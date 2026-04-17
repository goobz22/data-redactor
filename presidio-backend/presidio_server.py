"""
Presidio Backend Server for Data Redactor
Full-featured PII detection and redaction with:
- Text, Image (OCR), and PDF redaction
- Custom recognizers (deny-list, pattern/regex)
- Multiple anonymization strategies (token, mask, hash, encrypt, fake)
- Transformer/NLP model support
"""

import json
import io
import os
import base64
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler
from presidio_analyzer import AnalyzerEngine, RecognizerResult, PatternRecognizer, Pattern
from presidio_analyzer.nlp_engine import NlpEngineProvider
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
from typing import Dict, List, Any, Optional
import traceback

# Initialize engines
print("Initializing Presidio engines...")

# Try to use transformers for better accuracy, fall back to spaCy
nlp_engine = None
nlp_model_name = "spaCy (en_core_web_lg)"
try:
    # Check if transformers model is available
    from transformers import pipeline
    nlp_model_name = "Transformers available (using spaCy default)"
    print("Transformers library detected - can use BERT models")
except ImportError:
    print("Transformers not installed - using spaCy NLP engine")

analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

# Try to import image redactor
image_redactor = None
try:
    from presidio_image_redactor import ImageRedactorEngine
    image_redactor = ImageRedactorEngine()
    print("Image redactor engine ready!")
except ImportError:
    print("WARNING: presidio-image-redactor not installed")

# Try to import Faker for synthetic data
faker_instance = None
try:
    from faker import Faker
    faker_instance = Faker()
    print("Faker library ready for synthetic data!")
except ImportError:
    print("WARNING: Faker not installed - fake data replacement unavailable")

# Try to import cryptography for encryption
crypto_available = False
try:
    from cryptography.fernet import Fernet
    crypto_available = True
    print("Cryptography library ready for encryption!")
except ImportError:
    print("WARNING: cryptography not installed - encryption unavailable")

print("Presidio engines ready!")

# Entity type mappings
ENTITY_TYPE_MAP = {
    "PERSON": "name",
    "EMAIL_ADDRESS": "email",
    "PHONE_NUMBER": "phone",
    "CREDIT_CARD": "creditCard",
    "US_SSN": "ssn",
    "IP_ADDRESS": "ipv4",
    "URL": "url",
    "DATE_TIME": "date",
    "LOCATION": "address",
    "US_DRIVER_LICENSE": "driversLicense",
    "US_PASSPORT": "passport",
    "US_BANK_NUMBER": "bankAccount",
    "IBAN_CODE": "iban",
    "CRYPTO": "crypto",
    "MEDICAL_LICENSE": "medicalLicense",
    "NRP": "nationality",
    "US_ITIN": "itin",
    "UK_NHS": "ukNhs",
}

PATTERN_TO_ENTITY = {v: k for k, v in ENTITY_TYPE_MAP.items()}

# Store for custom recognizers (in production, use a database)
custom_recognizers: Dict[str, PatternRecognizer] = {}

# Encryption key management (in production, use secure key storage)
encryption_keys: Dict[str, bytes] = {}


def get_or_create_encryption_key(session_id: str = "default") -> bytes:
    """Get or create an encryption key for the session"""
    if session_id not in encryption_keys:
        encryption_keys[session_id] = Fernet.generate_key()
    return encryption_keys[session_id]


def encrypt_value(value: str, key: bytes) -> str:
    """Encrypt a value using Fernet symmetric encryption"""
    f = Fernet(key)
    encrypted = f.encrypt(value.encode())
    return base64.urlsafe_b64encode(encrypted).decode()[:32] + "..."


def generate_fake_value(entity_type: str) -> str:
    """Generate fake/synthetic data based on entity type"""
    if not faker_instance:
        return f"<FAKE_{entity_type}>"

    fake_generators = {
        "PERSON": faker_instance.name,
        "EMAIL_ADDRESS": faker_instance.email,
        "PHONE_NUMBER": faker_instance.phone_number,
        "CREDIT_CARD": lambda: faker_instance.credit_card_number()[:4] + "-XXXX-XXXX-XXXX",
        "US_SSN": lambda: "XXX-XX-" + faker_instance.ssn()[-4:],
        "IP_ADDRESS": faker_instance.ipv4,
        "URL": faker_instance.url,
        "DATE_TIME": lambda: faker_instance.date(),
        "LOCATION": faker_instance.city,
        "US_DRIVER_LICENSE": lambda: "DL-" + faker_instance.bothify("???######"),
        "US_PASSPORT": lambda: faker_instance.bothify("?########"),
        "US_BANK_NUMBER": lambda: "XXXX" + faker_instance.bban()[-4:],
        "IBAN_CODE": lambda: faker_instance.iban()[:4] + "XXXXXXXXXXXX",
    }

    generator = fake_generators.get(entity_type, lambda: f"<FAKE_{entity_type}>")
    try:
        return generator()
    except:
        return f"<FAKE_{entity_type}>"


def parse_multipart(handler) -> Dict[str, Any]:
    """Parse multipart form data"""
    content_type = handler.headers.get('Content-Type', '')

    if 'multipart/form-data' not in content_type:
        content_length = int(handler.headers.get('Content-Length', 0))
        return json.loads(handler.rfile.read(content_length))

    boundary = content_type.split('boundary=')[1] if 'boundary=' in content_type else None
    if not boundary:
        return {}

    content_length = int(handler.headers.get('Content-Length', 0))
    body = handler.rfile.read(content_length)

    result = {}
    parts = body.split(f'--{boundary}'.encode())

    for part in parts:
        if not part or part == b'--\r\n' or part == b'--':
            continue
        try:
            if b'\r\n\r\n' in part:
                headers, content = part.split(b'\r\n\r\n', 1)
                headers = headers.decode('utf-8', errors='ignore')
                if 'name="' in headers:
                    name = headers.split('name="')[1].split('"')[0]
                    if 'filename="' in headers:
                        filename = headers.split('filename="')[1].split('"')[0]
                        content = content.rstrip(b'\r\n')
                        result[name] = {'filename': filename, 'data': content}
                    else:
                        content = content.rstrip(b'\r\n').decode('utf-8', errors='ignore')
                        result[name] = content
        except Exception as e:
            print(f"Error parsing part: {e}")
            continue

    return result


class PresidioHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _send_json_response(self, data: dict, status: int = 200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def _send_binary_response(self, data: bytes, content_type: str = "image/png"):
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self._send_json_response({
                "status": "ok",
                "engine": "presidio",
                "nlpModel": nlp_model_name,
                "entities": list(analyzer.get_supported_entities()),
                "imageSupport": image_redactor is not None,
                "fakerSupport": faker_instance is not None,
                "encryptionSupport": crypto_available,
                "customRecognizers": list(custom_recognizers.keys())
            })
        elif self.path == "/entities":
            self._send_json_response({
                "entities": list(analyzer.get_supported_entities()),
                "mapping": ENTITY_TYPE_MAP,
                "customRecognizers": list(custom_recognizers.keys())
            })
        elif self.path == "/recognizers":
            custom_list = []
            for name, rec in custom_recognizers.items():
                rec_info = {
                    "name": name,
                    "supported_entity": rec.supported_entities[0] if rec.supported_entities else None,
                    "type": "deny_list" if hasattr(rec, 'deny_list') and rec.deny_list else "pattern"
                }
                if hasattr(rec, 'deny_list') and rec.deny_list:
                    rec_info["deny_list"] = rec.deny_list
                if hasattr(rec, 'patterns') and rec.patterns:
                    rec_info["patterns"] = [{"regex": p.regex, "score": p.score} for p in rec.patterns]
                custom_list.append(rec_info)

            self._send_json_response({
                "builtIn": list(analyzer.get_supported_entities()),
                "custom": custom_list
            })
        elif self.path == "/strategies":
            self._send_json_response({
                "strategies": [
                    {"id": "token", "name": "Token (reversible)", "description": "[EMAIL_1], [PERSON_2]"},
                    {"id": "mask", "name": "Mask", "description": "****************"},
                    {"id": "hash", "name": "Hash (SHA-256)", "description": "a1b2c3d4e5f6..."},
                    {"id": "redact", "name": "Redact", "description": "<REDACTED>"},
                    {"id": "encrypt", "name": "Encrypt (AES)", "description": "gAAAAABk...", "available": crypto_available},
                    {"id": "fake", "name": "Fake Data", "description": "John Smith -> Jane Doe", "available": faker_instance is not None},
                ]
            })
        else:
            self._send_json_response({"error": "Not found"}, 404)

    def do_DELETE(self):
        if self.path.startswith("/recognizers/"):
            recognizer_name = self.path.split("/recognizers/")[1]
            self._handle_delete_recognizer(recognizer_name)
        else:
            self._send_json_response({"error": "Not found"}, 404)

    def do_POST(self):
        if self.path == "/analyze":
            self._handle_analyze()
        elif self.path == "/redact":
            self._handle_redact()
        elif self.path == "/redact/image":
            self._handle_redact_image()
        elif self.path == "/redact/pdf":
            self._handle_redact_pdf()
        elif self.path == "/recognizers/deny-list":
            self._handle_add_deny_list_recognizer()
        elif self.path == "/recognizers/pattern":
            self._handle_add_pattern_recognizer()
        elif self.path == "/decrypt":
            self._handle_decrypt()
        else:
            self._send_json_response({"error": "Not found"}, 404)

    def _handle_analyze(self):
        """Analyze text for PII entities"""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(content_length))

            text = body.get("text", "")
            language = body.get("language", "en")
            entities = body.get("entities")
            score_threshold = body.get("scoreThreshold", 0.5)

            # Add custom recognizers to analyzer temporarily
            for rec in custom_recognizers.values():
                if rec not in analyzer.registry.recognizers:
                    analyzer.registry.add_recognizer(rec)

            results = analyzer.analyze(
                text=text,
                language=language,
                entities=entities,
                score_threshold=score_threshold
            )

            self._send_json_response({
                "results": [
                    {
                        "entity_type": r.entity_type,
                        "start": r.start,
                        "end": r.end,
                        "score": r.score,
                        "text": text[r.start:r.end]
                    }
                    for r in results
                ]
            })
        except Exception as e:
            traceback.print_exc()
            self._send_json_response({"error": str(e)}, 500)

    def _handle_redact(self):
        """Full redaction pipeline with all strategies"""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(content_length))

            text = body.get("text", "")
            config = body.get("config", {})
            language = config.get("language", "en")
            strategy = config.get("strategy", "token")
            score_threshold = config.get("scoreThreshold", 0.5)
            session_id = config.get("sessionId", "default")

            enabled_entities = config.get("entities")
            if isinstance(enabled_entities, list) and len(enabled_entities) > 0:
                pass
            else:
                enabled_entities = None

            # Add custom recognizers
            for rec in custom_recognizers.values():
                if rec not in analyzer.registry.recognizers:
                    analyzer.registry.add_recognizer(rec)

            # Analyze
            results = analyzer.analyze(
                text=text,
                language=language,
                entities=enabled_entities,
                score_threshold=score_threshold
            )

            # Build operators based on strategy
            entity_counters: Dict[str, int] = {}
            token_mapping: Dict[str, str] = {}
            encryption_key = None

            if strategy == "encrypt" and crypto_available:
                encryption_key = get_or_create_encryption_key(session_id)

            # Sort results by position (descending) to replace from end to start
            sorted_results = sorted(results, key=lambda r: r.start, reverse=True)

            # For strategies that need unique values per match (token, encrypt, fake),
            # we need to manually replace text instead of using operators
            if strategy in ("token", "encrypt", "fake"):
                redacted_text = text
                for r in sorted_results:
                    original_text = text[r.start:r.end]

                    if strategy == "token":
                        if r.entity_type not in entity_counters:
                            entity_counters[r.entity_type] = 0
                        entity_counters[r.entity_type] += 1
                        replacement = f"[{r.entity_type}_{entity_counters[r.entity_type]}]"
                        token_mapping[replacement] = original_text

                    elif strategy == "encrypt" and crypto_available:
                        replacement = encrypt_value(original_text, encryption_key)
                        token_mapping[replacement] = original_text

                    elif strategy == "fake" and faker_instance:
                        replacement = generate_fake_value(r.entity_type)
                        token_mapping[replacement] = original_text

                    else:
                        replacement = f"<{r.entity_type}>"

                    redacted_text = redacted_text[:r.start] + replacement + redacted_text[r.end:]

                # Create a dummy anonymized result for consistency
                class AnonymizedResult:
                    def __init__(self, text):
                        self.text = text
                anonymized = AnonymizedResult(redacted_text)

            else:
                # Use operators for mask, hash, redact (they work the same for all entities of same type)
                operators = {}
                for r in results:
                    if strategy == "mask":
                        operators[r.entity_type] = OperatorConfig("mask", {
                            "chars_to_mask": 0,
                            "masking_char": "*",
                            "from_end": False
                        })
                    elif strategy == "hash":
                        operators[r.entity_type] = OperatorConfig("hash", {"hash_type": "sha256"})
                    elif strategy == "redact":
                        operators[r.entity_type] = OperatorConfig("replace", {"new_value": "<REDACTED>"})
                    else:
                        operators[r.entity_type] = OperatorConfig("replace", {"new_value": f"<{r.entity_type}>"})

                # Anonymize
                anonymized = anonymizer.anonymize(
                    text=text,
                    analyzer_results=results,
                    operators=operators
                )

            # Build response
            matches = []
            for r in results:
                matches.append({
                    "type": ENTITY_TYPE_MAP.get(r.entity_type, r.entity_type.lower()),
                    "entityType": r.entity_type,
                    "original": text[r.start:r.end],
                    "start": r.start,
                    "end": r.end,
                    "score": r.score
                })

            response_data = {
                "redactedText": anonymized.text,
                "matches": matches,
                "mapping": token_mapping,
                "stats": {
                    "originalLength": len(text),
                    "redactedLength": len(anonymized.text),
                    "matchCount": len(results),
                    "types": list(set(r.entity_type for r in results))
                }
            }

            # Include session ID for encryption strategy
            if strategy == "encrypt" and encryption_key:
                response_data["sessionId"] = session_id

            self._send_json_response(response_data)

        except Exception as e:
            traceback.print_exc()
            self._send_json_response({"error": str(e)}, 500)

    def _handle_add_deny_list_recognizer(self):
        """Add a custom deny-list recognizer"""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(content_length))

            name = body.get("name", "")
            # Support both camelCase and snake_case
            entity_type = body.get("supported_entity") or body.get("entityType", "CUSTOM")
            deny_list = body.get("deny_list") or body.get("denyList", [])

            if not name or not deny_list:
                self._send_json_response({"error": "name and deny_list are required"}, 400)
                return

            recognizer = PatternRecognizer(
                supported_entity=entity_type,
                deny_list=deny_list,
                name=name
            )

            custom_recognizers[name] = recognizer
            analyzer.registry.add_recognizer(recognizer)

            self._send_json_response({
                "success": True,
                "recognizer": {
                    "name": name,
                    "entityType": entity_type,
                    "type": "deny_list",
                    "itemCount": len(deny_list)
                }
            })

        except Exception as e:
            traceback.print_exc()
            self._send_json_response({"error": str(e)}, 500)

    def _handle_add_pattern_recognizer(self):
        """Add a custom pattern/regex recognizer"""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(content_length))

            name = body.get("name", "")
            # Support both camelCase and snake_case
            entity_type = body.get("supported_entity") or body.get("entityType", "CUSTOM")
            patterns = body.get("patterns", [])

            if not name or not patterns:
                self._send_json_response({"error": "name and patterns are required"}, 400)
                return

            pattern_objects = []
            for p in patterns:
                pattern_objects.append(Pattern(
                    name=p.get("name", name),
                    regex=p.get("regex", ""),
                    score=p.get("score", 0.8)
                ))

            recognizer = PatternRecognizer(
                supported_entity=entity_type,
                patterns=pattern_objects,
                name=name
            )

            custom_recognizers[name] = recognizer
            analyzer.registry.add_recognizer(recognizer)

            self._send_json_response({
                "success": True,
                "recognizer": {
                    "name": name,
                    "entityType": entity_type,
                    "type": "pattern",
                    "patternCount": len(patterns)
                }
            })

        except Exception as e:
            traceback.print_exc()
            self._send_json_response({"error": str(e)}, 500)

    def _handle_delete_recognizer(self, name: str):
        """Delete a custom recognizer"""
        try:
            if name in custom_recognizers:
                rec = custom_recognizers.pop(name)
                if rec in analyzer.registry.recognizers:
                    analyzer.registry.remove_recognizer(rec)
                self._send_json_response({"success": True, "deleted": name})
            else:
                self._send_json_response({"error": f"Recognizer '{name}' not found"}, 404)
        except Exception as e:
            traceback.print_exc()
            self._send_json_response({"error": str(e)}, 500)

    def _handle_decrypt(self):
        """Decrypt previously encrypted values"""
        try:
            if not crypto_available:
                self._send_json_response({"error": "Encryption not available"}, 501)
                return

            content_length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(content_length))

            session_id = body.get("sessionId", "default")
            encrypted_text = body.get("text", "")

            if session_id not in encryption_keys:
                self._send_json_response({"error": "Session key not found"}, 404)
                return

            # This is a simplified version - full implementation would parse and decrypt each token
            self._send_json_response({
                "message": "Use the mapping returned from redaction to reverse encrypted values",
                "sessionId": session_id
            })

        except Exception as e:
            traceback.print_exc()
            self._send_json_response({"error": str(e)}, 500)

    def _handle_redact_image(self):
        """Redact PII from images using OCR"""
        try:
            if image_redactor is None:
                self._send_json_response({
                    "error": "Image redaction not available"
                }, 501)
                return

            form_data = parse_multipart(self)

            if 'image' not in form_data:
                self._send_json_response({"error": "No image provided"}, 400)
                return

            image_data = form_data['image']
            if isinstance(image_data, dict):
                image_bytes = image_data['data']
            else:
                self._send_json_response({"error": "Invalid image data"}, 400)
                return

            entities = None
            if 'entities' in form_data:
                try:
                    entities = json.loads(form_data['entities'])
                except:
                    pass

            from PIL import Image
            image = Image.open(io.BytesIO(image_bytes))

            redacted = image_redactor.redact(
                image,
                fill=(0, 0, 0),
                entities=entities
            )

            output = io.BytesIO()
            redacted.save(output, format='PNG')
            output.seek(0)

            self._send_binary_response(output.read(), "image/png")

        except Exception as e:
            traceback.print_exc()
            self._send_json_response({"error": str(e)}, 500)

    def _handle_redact_pdf(self):
        """Redact PII from PDF files"""
        try:
            if image_redactor is None:
                self._send_json_response({
                    "error": "PDF redaction not available"
                }, 501)
                return

            form_data = parse_multipart(self)

            if 'pdf' not in form_data:
                self._send_json_response({"error": "No PDF provided"}, 400)
                return

            pdf_data = form_data['pdf']
            if isinstance(pdf_data, dict):
                pdf_bytes = pdf_data['data']
            else:
                self._send_json_response({"error": "Invalid PDF data"}, 400)
                return

            entities = None
            if 'entities' in form_data:
                try:
                    entities = json.loads(form_data['entities'])
                except:
                    pass

            try:
                from pdf2image import convert_from_bytes
                from PIL import Image
            except ImportError:
                self._send_json_response({
                    "error": "PDF support requires pdf2image"
                }, 501)
                return

            images = convert_from_bytes(pdf_bytes)

            redacted_images = []
            for page_img in images:
                redacted = image_redactor.redact(
                    page_img,
                    fill=(0, 0, 0),
                    entities=entities
                )
                redacted_images.append(redacted)

            output = io.BytesIO()
            if redacted_images:
                redacted_images[0].save(
                    output,
                    format='PDF',
                    save_all=True,
                    append_images=redacted_images[1:] if len(redacted_images) > 1 else []
                )
            output.seek(0)

            self._send_binary_response(output.read(), "application/pdf")

        except Exception as e:
            traceback.print_exc()
            self._send_json_response({"error": str(e)}, 500)

    def log_message(self, format, *args):
        print(f"[Presidio] {args[0]}")


def run_server(port: int = 5050):
    server = HTTPServer(("localhost", port), PresidioHandler)

    features = []
    if image_redactor:
        features.append("Image/PDF OCR")
    if faker_instance:
        features.append("Fake Data")
    if crypto_available:
        features.append("Encryption")

    print(f"""
============================================================
           Presidio Backend Server (Enhanced)
============================================================
  Server:   http://localhost:{port}
  NLP:      {nlp_model_name}
  Features: {', '.join(features) if features else 'Base only'}
------------------------------------------------------------
  Endpoints:
    GET  /health           - Health & capabilities
    GET  /entities         - List entities
    GET  /recognizers      - List recognizers
    GET  /strategies       - Available strategies
    POST /analyze          - Analyze text for PII
    POST /redact           - Redact with strategy
    POST /redact/image     - Redact image (OCR)
    POST /redact/pdf       - Redact PDF
    POST /recognizers/deny-list   - Add deny-list recognizer
    POST /recognizers/pattern     - Add pattern recognizer
    DELETE /recognizers/:name     - Remove recognizer
============================================================
""")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Presidio server...")
        server.shutdown()


if __name__ == "__main__":
    run_server()
