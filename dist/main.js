var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// node_modules/unique-random/index.js
var require_unique_random = __commonJS((exports, module) => {
  module.exports = function(min, max) {
    var prev;
    return function rand() {
      var num = Math.floor(Math.random() * (max - min + 1) + min);
      return prev = num === prev && min !== max ? rand() : num;
    };
  };
});

// node_modules/unique-random-array/index.js
var require_unique_random_array = __commonJS((exports, module) => {
  var uniqueRandom = require_unique_random();
  module.exports = function(arr) {
    var rand = uniqueRandom(0, arr.length - 1);
    return function() {
      return arr[rand()];
    };
  };
});

// node_modules/common-last-names/dist/common-last-names.json
var require_common_last_names = __commonJS((exports, module) => {
  module.exports = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
    "Martinez",
    "Anderson",
    "Taylor",
    "Thomas",
    "Hernandez",
    "Moore",
    "Martin",
    "Jackson",
    "Thompson",
    "White",
    "Lopez",
    "Lee",
    "Gonzalez",
    "Harris",
    "Clark",
    "Lewis",
    "Robinson",
    "Walker",
    "Perez",
    "Hall",
    "Young",
    "Allen",
    "Sanchez",
    "Wright",
    "King",
    "Scott",
    "Green",
    "Baker",
    "Adams",
    "Nelson",
    "Hill",
    "Ramirez",
    "Campbell",
    "Mitchell",
    "Roberts",
    "Carter",
    "Phillips",
    "Evans",
    "Turner",
    "Torres",
    "Parker",
    "Collins",
    "Edwards",
    "Stewart",
    "Flores",
    "Morris",
    "Nguyen",
    "Murphy",
    "Rivera",
    "Cook",
    "Rogers",
    "Morgan",
    "Peterson",
    "Cooper",
    "Reed",
    "Bailey",
    "Bell",
    "Gomez",
    "Kelly",
    "Howard",
    "Ward",
    "Cox",
    "Diaz",
    "Richardson",
    "Wood",
    "Watson",
    "Brooks",
    "Bennett",
    "Gray",
    "James",
    "Reyes",
    "Cruz",
    "Hughes",
    "Price",
    "Myers",
    "Long",
    "Foster",
    "Sanders",
    "Ross",
    "Morales",
    "Powell",
    "Sullivan",
    "Russell",
    "Ortiz",
    "Jenkins",
    "Gutierrez",
    "Perry",
    "Butler",
    "Barnes",
    "Fisher"
  ];
});

// node_modules/common-last-names/dist/index.js
var require_dist = __commonJS((exports, module) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _uniqueRandomArray = require_unique_random_array();
  var _uniqueRandomArray2 = _interopRequireDefault(_uniqueRandomArray);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var commonLastNames = require_common_last_names();
  var mainExport = {
    all: commonLastNames,
    random: (0, _uniqueRandomArray2.default)(commonLastNames)
  };
  exports.default = mainExport;
  module.exports = mainExport;
});

// packages/core/src/config.ts
var DEFAULT_CONFIG = {
  formatOptions: {
    tokenFormat: "[{TYPE}_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  patterns: {
    ipv4: {
      enabled: true,
      strategy: "token",
      regex: "(?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:/\\d{1,2})?(?![0-9])"
    },
    ipv6: {
      enabled: true,
      strategy: "token",
      regex: "(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}"
    },
    macAddress: {
      enabled: true,
      strategy: "token",
      regex: "(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\\.){2}[0-9A-Fa-f]{4})"
    },
    email: {
      enabled: true,
      strategy: "token",
      regex: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"
    },
    phone: {
      enabled: true,
      strategy: "token",
      regex: "(?<![A-Za-z0-9])(?:\\+?1[-\\.\\s]?)?(?:\\(\\d{3}\\)\\s?\\d{3}[-\\.\\s]?\\d{4}|\\(\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}\\)|\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}|\\d{3}[-\\.\\s]?[A-Za-z]{7}|\\d{3}[-\\.\\s]?[A-Za-z]{3}[-\\.\\s]?[A-Za-z]{4})(?![A-Za-z0-9])"
    },
    ssn: {
      enabled: true,
      strategy: "token",
      regex: "\\b\\d{3}-\\d{2}-\\d{4}\\b"
    },
    creditCard: {
      enabled: true,
      strategy: "token",
      regex: "(?<!\\d)(?:\\d{4}[-\\s]?){3,4}\\d{1,4}(?!\\d)|(?<!\\d)\\d{13,19}(?!\\d)"
    },
    creditCardLast4: {
      enabled: true,
      strategy: "token",
      regex: "(?:(?:card|payment|account)\\s+)?(?:ending\\s+in\\s+|ends\\s+in\\s+|last\\s+(?:4|four)(?:\\s+digits)?[\\s:]+)\\d{4}(?!\\d)|(?:\\*{4,})\\d{4}(?!\\d)",
      flags: "i"
    },
    hostname: {
      enabled: true,
      strategy: "token",
      regex: "\\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}\\b"
    },
    ticketNumber: {
      enabled: true,
      strategy: "token",
      regex: "(?:ticket|case)\\s*[#:-]?\\s*\\d+",
      flags: "i"
    },
    name: {
      enabled: true,
      strategy: "token"
    },
    custom: []
  },
  customEntities: {},
  testData: `Support Ticket #12345

Customer Information:
- Name: John Doe
- Email: john.doe@company.com
- Phone: 555-123-4567
- Alt Phone: (555) 987-6543
- Mobile: 1-555-SUPPORT
- SSN: 123-45-6789

Network Details:
- IPv4: 192.168.1.100
- IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
- MAC Address: 00-1B-44-11-3A-B8
- Gateway: 10.0.0.1
- DNS Server: 8.8.8.8
- Hostname: mail.example.com

Payment Information:
- Primary Card: 4532-1234-5678-9010
- Backup Card: 5425233430109903
- Card ending in 9010
- AmEx: 378282246310005

Issue Description:
Customer contacted us from IP 203.0.113.45 regarding server api.internal.company.net connection issues.
Contact support@company.com or call 1-555-FLOWERS for assistance.`
};

class ConfigLoader {
  static loadFromFile(path) {
    if (typeof process !== "undefined" && process.versions && process.versions.node) {
      try {
        const fs = (()=>{throw new Error("Cannot require module "+"fs");})();
        const content = fs.readFileSync(path, "utf-8");
        const config = JSON.parse(content);
        return this.mergeWithDefaults(config);
      } catch (error) {
        throw new Error(`Failed to load config from ${path}: ${error}`);
      }
    } else {
      throw new Error("loadFromFile is only available in Node.js environments. Use loadFromObject instead.");
    }
  }
  static loadFromObject(config) {
    return this.mergeWithDefaults(config);
  }
  static getDefault() {
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }
  static mergeWithDefaults(config) {
    const merged = {
      patterns: {
        ...DEFAULT_CONFIG.patterns,
        ...config.patterns
      },
      customEntities: {
        ...DEFAULT_CONFIG.customEntities,
        ...config.customEntities
      }
    };
    return merged;
  }
  static validateConfig(config) {
    const errors = [];
    if (config.patterns) {
      const validStrategies = ["token", "mask", "formatPreserving"];
      Object.entries(config.patterns).forEach(([key, value]) => {
        if (key === "custom") {
          const customPatterns = value;
          customPatterns?.forEach((pattern, index) => {
            if (!pattern.name) {
              errors.push(`Custom pattern at index ${index} is missing 'name'`);
            }
            if (!pattern.regex) {
              errors.push(`Custom pattern '${pattern.name}' is missing 'regex'`);
            }
            if (!validStrategies.includes(pattern.strategy)) {
              errors.push(`Custom pattern '${pattern.name}' has invalid strategy: ${pattern.strategy}`);
            }
            try {
              new RegExp(pattern.regex, pattern.flags || "");
            } catch (e) {
              errors.push(`Custom pattern '${pattern.name}' has invalid regex: ${e}`);
            }
          });
        } else {
          const patternConfig = value;
          if (patternConfig && !validStrategies.includes(patternConfig.strategy)) {
            errors.push(`Pattern '${key}' has invalid strategy: ${patternConfig.strategy}`);
          }
        }
      });
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// packages/core/src/patterns/base.ts
class BasePattern {
  name;
  regex;
  strategy;
  enabled;
  constructor(name, regex, strategy = "token", enabled = true) {
    this.name = name;
    this.regex = regex;
    this.strategy = strategy;
    this.enabled = enabled;
  }
  test(text) {
    return this.regex.test(text);
  }
  findAll(text) {
    if (!this.enabled)
      return [];
    const matches = [];
    const regex = new RegExp(this.regex.source, "g" + this.regex.flags.replace("g", ""));
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        value: match[0],
        start: match.index,
        end: match.index + match[0].length,
        type: this.name,
        strategy: this.strategy
      });
    }
    return matches;
  }
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  setEnabled(enabled) {
    this.enabled = enabled;
  }
}
// packages/core/src/patterns/network.ts
class IPv4Pattern extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/\d{1,2})?(?![0-9])/;
    super("ipv4", regex, strategy, enabled);
  }
}

class IPv6Pattern extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}/;
    super("ipv6", regex, strategy, enabled);
  }
  findAll(text) {
    console.log("[IPv6Pattern] findAll called with text:", text.substring(0, 200));
    const matches = [];
    const regex = new RegExp(this.regex.source, "g");
    let match;
    while ((match = regex.exec(text)) !== null) {
      const potential = match[0];
      console.log("[IPv6Pattern] Found potential match:", potential, "at index:", match.index);
      const isValid = this.isValidIPv6(potential);
      console.log("[IPv6Pattern] isValid:", isValid, "for:", potential);
      if (isValid) {
        matches.push({
          value: potential,
          start: match.index,
          end: match.index + potential.length,
          type: this.name,
          strategy: this.strategy
        });
        console.log("[IPv6Pattern] Added valid match:", potential);
      } else {
        console.log("[IPv6Pattern] Rejected invalid match:", potential);
      }
    }
    console.log("[IPv6Pattern] Total valid matches:", matches.length);
    return matches;
  }
  isValidIPv6(addr) {
    console.log("[IPv6Pattern] Validating:", addr);
    const colonCount = (addr.match(/:/g) || []).length;
    console.log("[IPv6Pattern] Colon count:", colonCount);
    if (colonCount < 2) {
      console.log("[IPv6Pattern] Validation failed: too few colons");
      return false;
    }
    const doubleColonCount = (addr.match(/::/g) || []).length;
    console.log("[IPv6Pattern] Double colon count:", doubleColonCount);
    if (doubleColonCount > 1) {
      console.log("[IPv6Pattern] Validation failed: multiple ::");
      return false;
    }
    try {
      const expanded = this.expandIPv6(addr);
      console.log("[IPv6Pattern] Expanded to:", expanded);
      const groups = expanded.split(":");
      console.log("[IPv6Pattern] Groups:", groups, "count:", groups.length);
      if (groups.length !== 8) {
        console.log("[IPv6Pattern] Validation failed: not 8 groups");
        return false;
      }
      const allValid = groups.every((g) => /^[0-9a-fA-F]{1,4}$/.test(g));
      console.log("[IPv6Pattern] All groups valid hex:", allValid);
      return allValid;
    } catch (e) {
      console.log("[IPv6Pattern] Validation failed with error:", e);
      return false;
    }
  }
  expandIPv6(addr) {
    console.log("[IPv6Pattern] Expanding:", addr);
    if (!addr.includes("::")) {
      console.log("[IPv6Pattern] No :: found, returning as-is");
      return addr;
    }
    const sides = addr.split("::");
    console.log("[IPv6Pattern] Split on ::", sides);
    if (sides.length !== 2) {
      console.log("[IPv6Pattern] Invalid split length:", sides.length);
      return addr;
    }
    const left = sides[0] ? sides[0].split(":") : [];
    const right = sides[1] ? sides[1].split(":") : [];
    console.log("[IPv6Pattern] Left groups:", left, "Right groups:", right);
    const totalGroups = 8;
    const existingGroups = left.length + right.length;
    const zeroGroups = totalGroups - existingGroups;
    console.log("[IPv6Pattern] Existing groups:", existingGroups, "Zero groups needed:", zeroGroups);
    const zeros = Array(zeroGroups).fill("0");
    const expanded = [...left, ...zeros, ...right];
    console.log("[IPv6Pattern] Expanded array:", expanded);
    const result = expanded.join(":");
    console.log("[IPv6Pattern] Final expanded result:", result);
    return result;
  }
}

class MACAddressPattern extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})/;
    super("macAddress", regex, strategy, enabled);
  }
}

class HostnamePattern extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b/;
    super("hostname", regex, strategy, enabled);
  }
}
// node_modules/datasets-male-first-names-en/lib/dataset.json
var dataset_default = ["Aaron", "Ab", "Abba", "Abbe", "Abbey", "Abbie", "Abbot", "Abbott", "Abby", "Abdel", "Abdul", "Abe", "Abel", "Abelard", "Abeu", "Abey", "Abie", "Abner", "Abraham", "Abrahan", "Abram", "Abramo", "Abran", "Ad", "Adair", "Adam", "Adamo", "Adams", "Adan", "Addie", "Addison", "Addy", "Ade", "Adelbert", "Adham", "Adlai", "Adler", "Ado", "Adolf", "Adolph", "Adolphe", "Adolpho", "Adolphus", "Adrian", "Adriano", "Adrien", "Agosto", "Aguie", "Aguistin", "Aguste", "Agustin", "Aharon", "Ahmad", "Ahmed", "Ailbert", "Akim", "Aksel", "Al", "Alain", "Alair", "Alan", "Aland", "Alano", "Alanson", "Alard", "Alaric", "Alasdair", "Alastair", "Alasteir", "Alaster", "Alberik", "Albert", "Alberto", "Albie", "Albrecht", "Alden", "Aldin", "Aldis", "Aldo", "Aldon", "Aldous", "Aldric", "Aldrich", "Aldridge", "Aldus", "Aldwin", "Alec", "Alejandro", "Alejoa", "Aleksandr", "Alessandro", "Alex", "Alexander", "Alexandr", "Alexandre", "Alexandro", "Alexandros", "Alexei", "Alexio", "Alexis", "Alf", "Alfie", "Alfons", "Alfonse", "Alfonso", "Alford", "Alfred", "Alfredo", "Alfy", "Algernon", "Ali", "Alic", "Alick", "Alisander", "Alistair", "Alister", "Alix", "Allan", "Allard", "Allayne", "Allen", "Alley", "Alleyn", "Allie", "Allin", "Allister", "Allistir", "Allyn", "Aloin", "Alon", "Alonso", "Alonzo", "Aloysius", "Alphard", "Alphonse", "Alphonso", "Alric", "Aluin", "Aluino", "Alva", "Alvan", "Alvie", "Alvin", "Alvis", "Alvy", "Alwin", "Alwyn", "Alyosha", "Amble", "Ambros", "Ambrose", "Ambrosi", "Ambrosio", "Ambrosius", "Amby", "Amerigo", "Amery", "Amory", "Amos", "Anatol", "Anatole", "Anatollo", "Ancell", "Anders", "Anderson", "Andie", "Andonis", "Andras", "Andre", "Andrea", "Andreas", "Andrej", "Andres", "Andrew", "Andrey", "Andris", "Andros", "Andrus", "Andy", "Ange", "Angel", "Angeli", "Angelico", "Angelo", "Angie", "Angus", "Ansel", "Ansell", "Anselm", "Anson", "Anthony", "Antin", "Antoine", "Anton", "Antone", "Antoni", "Antonin", "Antonino", "Antonio", "Antonius", "Antons", "Antony", "Any", "Ara", "Araldo", "Arch", "Archaimbaud", "Archambault", "Archer", "Archibald", "Archibaldo", "Archibold", "Archie", "Archy", "Arel", "Ari", "Arie", "Ariel", "Arin", "Ario", "Aristotle", "Arlan", "Arlen", "Arley", "Arlin", "Arman", "Armand", "Armando", "Armin", "Armstrong", "Arnaldo", "Arne", "Arney", "Arni", "Arnie", "Arnold", "Arnoldo", "Arnuad", "Arny", "Aron", "Arri", "Arron", "Art", "Artair", "Arte", "Artemas", "Artemis", "Artemus", "Arther", "Arthur", "Artie", "Artur", "Arturo", "Artus", "Arty", "Arv", "Arvie", "Arvin", "Arvy", "Asa", "Ase", "Ash", "Ashbey", "Ashby", "Asher", "Ashley", "Ashlin", "Ashton", "Aube", "Auberon", "Aubert", "Aubrey", "Augie", "August", "Augustin", "Augustine", "Augusto", "Augustus", "Augy", "Aurthur", "Austen", "Austin", "Ave", "Averell", "Averil", "Averill", "Avery", "Avictor", "Avigdor", "Avram", "Avrom", "Ax", "Axe", "Axel", "Aylmar", "Aylmer", "Aymer", "Bail", "Bailey", "Bailie", "Baillie", "Baily", "Baird", "Bald", "Balduin", "Baldwin", "Bale", "Ban", "Bancroft", "Bank", "Banky", "Bar", "Barbabas", "Barclay", "Bard", "Barde", "Barn", "Barnabas", "Barnabe", "Barnaby", "Barnard", "Barnebas", "Barnett", "Barney", "Barnie", "Barny", "Baron", "Barr", "Barret", "Barrett", "Barri", "Barrie", "Barris", "Barron", "Barry", "Bart", "Bartel", "Barth", "Barthel", "Bartholemy", "Bartholomeo", "Bartholomeus", "Bartholomew", "Bartie", "Bartlet", "Bartlett", "Bartolemo", "Bartolomeo", "Barton", "Bartram", "Barty", "Bary", "Baryram", "Base", "Basil", "Basile", "Basilio", "Basilius", "Bastian", "Bastien", "Bat", "Batholomew", "Baudoin", "Bax", "Baxie", "Baxter", "Baxy", "Bay", "Bayard", "Beale", "Bealle", "Bear", "Bearnard", "Beau", "Beaufort", "Beauregard", "Beck", "Beltran", "Ben", "Bendick", "Bendicty", "Bendix", "Benedetto", "Benedick", "Benedict", "Benedicto", "Benedikt", "Bengt", "Beniamino", "Benito", "Benjamen", "Benjamin", "Benji", "Benjie", "Benjy", "Benn", "Bennett", "Bennie", "Benny", "Benoit", "Benson", "Bent", "Bentlee", "Bentley", "Benton", "Benyamin", "Ber", "Berk", "Berke", "Berkeley", "Berkie", "Berkley", "Berkly", "Berky", "Bern", "Bernard", "Bernardo", "Bernarr", "Berne", "Bernhard", "Bernie", "Berny", "Bert", "Berti", "Bertie", "Berton", "Bertram", "Bertrand", "Bertrando", "Berty", "Bev", "Bevan", "Bevin", "Bevon", "Bil", "Bill", "Billie", "Billy", "Bing", "Bink", "Binky", "Birch", "Birk", "Biron", "Bjorn", "Blaine", "Blair", "Blake", "Blane", "Blayne", "Bo", "Bob", "Bobbie", "Bobby", "Bogart", "Bogey", "Boigie", "Bond", "Bondie", "Bondon", "Bondy", "Bone", "Boniface", "Boone", "Boonie", "Boony", "Boot", "Boote", "Booth", "Boothe", "Bord", "Borden", "Bordie", "Bordy", "Borg", "Boris", "Bourke", "Bowie", "Boy", "Boyce", "Boycey", "Boycie", "Boyd", "Brad", "Bradan", "Brade", "Braden", "Bradford", "Bradley", "Bradly", "Bradney", "Brady", "Bram", "Bran", "Brand", "Branden", "Brander", "Brandon", "Brandtr", "Brandy", "Brandyn", "Brannon", "Brant", "Brantley", "Bren", "Brendan", "Brenden", "Brendin", "Brendis", "Brendon", "Brennan", "Brennen", "Brent", "Bret", "Brett", "Brew", "Brewer", "Brewster", "Brian", "Briano", "Briant", "Brice", "Brien", "Brig", "Brigg", "Briggs", "Brigham", "Brion", "Brit", "Britt", "Brnaba", "Brnaby", "Brock", "Brockie", "Brocky", "Brod", "Broddie", "Broddy", "Broderic", "Broderick", "Brodie", "Brody", "Brok", "Bron", "Bronnie", "Bronny", "Bronson", "Brook", "Brooke", "Brooks", "Brose", "Bruce", "Brucie", "Bruis", "Bruno", "Bryan", "Bryant", "Bryanty", "Bryce", "Bryn", "Bryon", "Buck", "Buckie", "Bucky", "Bud", "Budd", "Buddie", "Buddy", "Buiron", "Burch", "Burg", "Burgess", "Burk", "Burke", "Burl", "Burlie", "Burnaby", "Burnard", "Burr", "Burt", "Burtie", "Burton", "Burty", "Butch", "Byram", "Byran", "Byrann", "Byrle", "Byrom", "Byron", "Cad", "Caddric", "Caesar", "Cal", "Caldwell", "Cale", "Caleb", "Calhoun", "Callean", "Calv", "Calvin", "Cam", "Cameron", "Camey", "Cammy", "Car", "Carce", "Care", "Carey", "Carl", "Carleton", "Carlie", "Carlin", "Carling", "Carlo", "Carlos", "Carly", "Carlyle", "Carmine", "Carney", "Carny", "Carolus", "Carr", "Carrol", "Carroll", "Carson", "Cart", "Carter", "Carver", "Cary", "Caryl", "Casar", "Case", "Casey", "Cash", "Caspar", "Casper", "Cass", "Cassie", "Cassius", "Caz", "Cazzie", "Cchaddie", "Cece", "Cecil", "Cecilio", "Cecilius", "Ced", "Cedric", "Cello", "Cesar", "Cesare", "Cesaro", "Chad", "Chadd", "Chaddie", "Chaddy", "Chadwick", "Chaim", "Chalmers", "Chan", "Chance", "Chancey", "Chandler", "Chane", "Chariot", "Charles", "Charley", "Charlie", "Charlton", "Chas", "Chase", "Chaunce", "Chauncey", "Che", "Chen", "Ches", "Chester", "Cheston", "Chet", "Chev", "Chevalier", "Chevy", "Chic", "Chick", "Chickie", "Chicky", "Chico", "Chilton", "Chip", "Chris", "Chrisse", "Chrissie", "Chrissy", "Christian", "Christiano", "Christie", "Christoffer", "Christoforo", "Christoper", "Christoph", "Christophe", "Christopher", "Christophorus", "Christos", "Christy", "Chrisy", "Chrotoem", "Chucho", "Chuck", "Cirillo", "Cirilo", "Ciro", "Claiborn", "Claiborne", "Clair", "Claire", "Clarance", "Clare", "Clarence", "Clark", "Clarke", "Claudell", "Claudian", "Claudianus", "Claudio", "Claudius", "Claus", "Clay", "Clayborn", "Clayborne", "Claybourne", "Clayson", "Clayton", "Cleavland", "Clem", "Clemens", "Clement", "Clemente", "Clementius", "Clemmie", "Clemmy", "Cleon", "Clerc", "Cletis", "Cletus", "Cleve", "Cleveland", "Clevey", "Clevie", "Cliff", "Clifford", "Clim", "Clint", "Clive", "Cly", "Clyde", "Clyve", "Clywd", "Cob", "Cobb", "Cobbie", "Cobby", "Codi", "Codie", "Cody", "Cointon", "Colan", "Colas", "Colby", "Cole", "Coleman", "Colet", "Colin", "Collin", "Colman", "Colver", "Con", "Conan", "Conant", "Conn", "Conney", "Connie", "Connor", "Conny", "Conrad", "Conrade", "Conrado", "Conroy", "Consalve", "Constantin", "Constantine", "Constantino", "Conway", "Coop", "Cooper", "Corbet", "Corbett", "Corbie", "Corbin", "Corby", "Cord", "Cordell", "Cordie", "Cordy", "Corey", "Cori", "Cornall", "Cornelius", "Cornell", "Corney", "Cornie", "Corny", "Correy", "Corrie", "Cort", "Cortie", "Corty", "Cory", "Cos", "Cosimo", "Cosme", "Cosmo", "Costa", "Court", "Courtnay", "Courtney", "Cozmo", "Craggie", "Craggy", "Craig", "Crawford", "Creigh", "Creight", "Creighton", "Crichton", "Cris", "Cristian", "Cristiano", "Cristobal", "Crosby", "Cross", "Cull", "Cullan", "Cullen", "Culley", "Cullie", "Cullin", "Cully", "Culver", "Curcio", "Curr", "Curran", "Currey", "Currie", "Curry", "Curt", "Curtice", "Curtis", "Cy", "Cyril", "Cyrill", "Cyrille", "Cyrillus", "Cyrus", "Darcy", "Dael", "Dag", "Dagny", "Dal", "Dale", "Dalis", "Dall", "Dallas", "Dalli", "Dallis", "Dallon", "Dalston", "Dalt", "Dalton", "Dame", "Damian", "Damiano", "Damien", "Damon", "Dan", "Dana", "Dane", "Dani", "Danie", "Daniel", "Dannel", "Dannie", "Danny", "Dante", "Danya", "Dar", "Darb", "Darbee", "Darby", "Darcy", "Dare", "Daren", "Darill", "Darin", "Dario", "Darius", "Darn", "Darnall", "Darnell", "Daron", "Darrel", "Darrell", "Darren", "Darrick", "Darrin", "Darryl", "Darwin", "Daryl", "Daryle", "Dav", "Dave", "Daven", "Davey", "David", "Davidde", "Davide", "Davidson", "Davie", "Davin", "Davis", "Davon", "Davy", "De", "Witt", "Dean", "Deane", "Decca", "Deck", "Del", "Delainey", "Delaney", "Delano", "Delbert", "Dell", "Delmar", "Delmer", "Delmor", "Delmore", "Demetre", "Demetri", "Demetris", "Demetrius", "Demott", "Den", "Dene", "Denis", "Dennet", "Denney", "Dennie", "Dennis", "Dennison", "Denny", "Denver", "Denys", "Der", "Derby", "Derek", "Derick", "Derk", "Dermot", "Derrek", "Derrick", "Derrik", "Derril", "Derron", "Derry", "Derward", "Derwin", "Des", "Desi", "Desmond", "Desmund", "Dev", "Devin", "Devland", "Devlen", "Devlin", "Devy", "Dew", "Dewain", "Dewey", "Dewie", "Dewitt", "Dex", "Dexter", "Diarmid", "Dick", "Dickie", "Dicky", "Diego", "Dieter", "Dietrich", "Dilan", "Dill", "Dillie", "Dillon", "Dilly", "Dimitri", "Dimitry", "Dino", "Dion", "Dionisio", "Dionysus", "Dirk", "Dmitri", "Dolf", "Dolph", "Dom", "Domenic", "Domenico", "Domingo", "Dominic", "Dominick", "Dominik", "Dominique", "Don", "Donal", "Donall", "Donalt", "Donaugh", "Donavon", "Donn", "Donnell", "Donnie", "Donny", "Donovan", "Dore", "Dorey", "Dorian", "Dorie", "Dory", "Doug", "Dougie", "Douglas", "Douglass", "Dougy", "Dov", "Doy", "Doyle", "Drake", "Drew", "Dru", "Drud", "Drugi", "Duane", "Dud", "Dudley", "Duff", "Duffie", "Duffy", "Dugald", "Duke", "Dukey", "Dukie", "Duky", "Dun", "Dunc", "Duncan", "Dunn", "Dunstan", "Dur", "Durand", "Durant", "Durante", "Durward", "Dwain", "Dwayne", "Dwight", "Dylan", "Eadmund", "Eal", "Eamon", "Earl", "Earle", "Earlie", "Early", "Earvin", "Eb", "Eben", "Ebeneser", "Ebenezer", "Eberhard", "Eberto", "Ed", "Edan", "Edd", "Eddie", "Eddy", "Edgar", "Edgard", "Edgardo", "Edik", "Edlin", "Edmon", "Edmund", "Edouard", "Edsel", "Eduard", "Eduardo", "Eduino", "Edvard", "Edward", "Edwin", "Efrem", "Efren", "Egan", "Egbert", "Egon", "Egor", "El", "Elbert", "Elden", "Eldin", "Eldon", "Eldredge", "Eldridge", "Eli", "Elia", "Elias", "Elihu", "Elijah", "Eliot", "Elisha", "Ellary", "Ellerey", "Ellery", "Elliot", "Elliott", "Ellis", "Ellswerth", "Ellsworth", "Ellwood", "Elmer", "Elmo", "Elmore", "Elnar", "Elroy", "Elston", "Elsworth", "Elton", "Elvin", "Elvis", "Elvyn", "Elwin", "Elwood", "Elwyn", "Ely", "Em", "Emanuel", "Emanuele", "Emelen", "Emerson", "Emery", "Emile", "Emilio", "Emlen", "Emlyn", "Emmanuel", "Emmerich", "Emmery", "Emmet", "Emmett", "Emmit", "Emmott", "Emmy", "Emory", "Engelbert", "Englebert", "Ennis", "Enoch", "Enos", "Enrico", "Enrique", "Ephraim", "Ephrayim", "Ephrem", "Erasmus", "Erastus", "Erek", "Erhard", "Erhart", "Eric", "Erich", "Erick", "Erie", "Erik", "Erin", "Erl", "Ermanno", "Ermin", "Ernest", "Ernesto", "Ernestus", "Ernie", "Ernst", "Erny", "Errick", "Errol", "Erroll", "Erskine", "Erv", "ErvIn", "Erwin", "Esdras", "Esme", "Esra", "Esteban", "Estevan", "Etan", "Ethan", "Ethe", "Ethelbert", "Ethelred", "Etienne", "Ettore", "Euell", "Eugen", "Eugene", "Eugenio", "Eugenius", "Eustace", "Ev", "Evan", "Evelin", "Evelyn", "Even", "Everard", "Evered", "Everett", "Evin", "Evyn", "Ewan", "Eward", "Ewart", "Ewell", "Ewen", "Ezechiel", "Ezekiel", "Ezequiel", "Eziechiele", "Ezra", "Ezri", "Fabe", "Faber", "Fabian", "Fabiano", "Fabien", "Fabio", "Fair", "Fairfax", "Fairleigh", "Fairlie", "Falito", "Falkner", "Far", "Farlay", "Farlee", "Farleigh", "Farley", "Farlie", "Farly", "Farr", "Farrel", "Farrell", "Farris", "Faulkner", "Fax", "Federico", "Fee", "Felic", "Felice", "Felicio", "Felike", "Feliks", "Felipe", "Felix", "Felizio", "Feodor", "Ferd", "Ferdie", "Ferdinand", "Ferdy", "Fergus", "Ferguson", "Fernando", "Ferrel", "Ferrell", "Ferris", "Fidel", "Fidelio", "Fidole", "Field", "Fielding", "Fields", "Filbert", "Filberte", "Filberto", "Filip", "Filippo", "Filmer", "Filmore", "Fin", "Findlay", "Findley", "Finlay", "Finley", "Finn", "Fitz", "Fitzgerald", "Flem", "Fleming", "Flemming", "Fletch", "Fletcher", "Flin", "Flinn", "Flint", "Florian", "Flory", "Floyd", "Flynn", "Fons", "Fonsie", "Fonz", "Fonzie", "Forbes", "Ford", "Forest", "Forester", "Forrest", "Forrester", "Forster", "Foss", "Foster", "Fowler", "Fran", "Francesco", "Franchot", "Francis", "Francisco", "Franciskus", "Francklin", "Francklyn", "Francois", "Frank", "Frankie", "Franklin", "Franklyn", "Franky", "Frannie", "Franny", "Frans", "Fransisco", "Frants", "Franz", "Franzen", "Frasco", "Fraser", "Frasier", "Frasquito", "Fraze", "Frazer", "Frazier", "Fred", "Freddie", "Freddy", "Fredek", "Frederic", "Frederich", "Frederick", "Frederico", "Frederigo", "Frederik", "Fredric", "Fredrick", "Free", "Freedman", "Freeland", "Freeman", "Freemon", "Fremont", "Friedrich", "Friedrick", "Fritz", "Fulton", "Gabbie", "Gabby", "Gabe", "Gabi", "Gabie", "Gabriel", "Gabriele", "Gabriello", "Gaby", "Gael", "Gaelan", "Gage", "Gail", "Gaile", "Gal", "Gale", "Galen", "Gallagher", "Gallard", "Galvan", "Galven", "Galvin", "Gamaliel", "Gan", "Gannie", "Gannon", "Ganny", "Gar", "Garald", "Gard", "Gardener", "Gardie", "Gardiner", "Gardner", "Gardy", "Gare", "Garek", "Gareth", "Garey", "Garfield", "Garik", "Garner", "Garold", "Garrard", "Garrek", "Garret", "Garreth", "Garrett", "Garrick", "Garrik", "Garrot", "Garrott", "Garry", "Garth", "Garv", "Garvey", "Garvin", "Garvy", "Garwin", "Garwood", "Gary", "Gaspar", "Gaspard", "Gasparo", "Gasper", "Gaston", "Gaultiero", "Gauthier", "Gav", "Gavan", "Gaven", "Gavin", "Gawain", "Gawen", "Gay", "Gayelord", "Gayle", "Gayler", "Gaylor", "Gaylord", "Gearalt", "Gearard", "Gene", "Geno", "Geoff", "Geoffrey", "Geoffry", "Georas", "Geordie", "Georg", "George", "Georges", "Georgi", "Georgie", "Georgy", "Gerald", "Gerard", "Gerardo", "Gerek", "Gerhard", "Gerhardt", "Geri", "Gerick", "Gerik", "Germain", "Germaine", "Germayne", "Gerome", "Gerrard", "Gerri", "Gerrie", "Gerry", "Gery", "Gherardo", "Giacobo", "Giacomo", "Giacopo", "Gian", "Gianni", "Giavani", "Gib", "Gibb", "Gibbie", "Gibby", "Gideon", "Giff", "Giffard", "Giffer", "Giffie", "Gifford", "Giffy", "Gil", "Gilbert", "Gilberto", "Gilburt", "Giles", "Gill", "Gilles", "Ginger", "Gino", "Giordano", "Giorgi", "Giorgio", "Giovanni", "Giraldo", "Giraud", "Giselbert", "Giulio", "Giuseppe", "Giustino", "Giusto", "Glen", "Glenden", "Glendon", "Glenn", "Glyn", "Glynn", "Godard", "Godart", "Goddard", "Goddart", "Godfree", "Godfrey", "Godfry", "Godwin", "Gonzales", "Gonzalo", "Goober", "Goran", "Goraud", "Gordan", "Gorden", "Gordie", "Gordon", "Gordy", "Gothart", "Gottfried", "Grace", "Gradeigh", "Gradey", "Grady", "Graehme", "Graeme", "Graham", "Graig", "Gram", "Gran", "Grange", "Granger", "Grannie", "Granny", "Grant", "Grantham", "Granthem", "Grantley", "Granville", "Gray", "Greg", "Gregg", "Greggory", "Gregoire", "Gregoor", "Gregor", "Gregorio", "Gregorius", "Gregory", "Grenville", "Griff", "Griffie", "Griffin", "Griffith", "Griffy", "Gris", "Griswold", "Griz", "Grove", "Grover", "Gualterio", "Guglielmo", "Guido", "Guilbert", "Guillaume", "Guillermo", "Gun", "Gunar", "Gunner", "Guntar", "Gunter", "Gunther", "Gus", "Guss", "Gustaf", "Gustav", "Gustave", "Gustavo", "Gustavus", "Guthrey", "Guthrie", "Guthry", "Guy", "Had", "Hadlee", "Hadleigh", "Hadley", "Hadrian", "Hagan", "Hagen", "Hailey", "Haily", "Hakeem", "Hakim", "Hal", "Hale", "Haleigh", "Haley", "Hall", "Hallsy", "Halsey", "Halsy", "Ham", "Hamel", "Hamid", "Hamil", "Hamilton", "Hamish", "Hamlen", "Hamlin", "Hammad", "Hamnet", "Hanan", "Hank", "Hans", "Hansiain", "Hanson", "Harald", "Harbert", "Harcourt", "Hardy", "Harlan", "Harland", "Harlen", "Harley", "Harlin", "Harman", "Harmon", "Harold", "Haroun", "Harp", "Harper", "Harris", "Harrison", "Harry", "Hart", "Hartley", "Hartwell", "Harv", "Harvey", "Harwell", "Harwilll", "Hasheem", "Hashim", "Haskel", "Haskell", "Haslett", "Hastie", "Hastings", "Hasty", "Haven", "Hayden", "Haydon", "Hayes", "Hayward", "Haywood", "Hayyim", "Haze", "Hazel", "Hazlett", "Heall", "Heath", "Hebert", "Hector", "Heindrick", "Heinrick", "Heinrik", "Henderson", "Hendrick", "Hendrik", "Henri", "Henrik", "Henry", "Herb", "Herbert", "Herbie", "Herby", "Herc", "Hercule", "Hercules", "Herculie", "Heriberto", "Herman", "Hermann", "Hermie", "Hermon", "Hermy", "Hernando", "Herold", "Herrick", "Hersch", "Herschel", "Hersh", "Hershel", "Herve", "Hervey", "Hew", "Hewe", "Hewet", "Hewett", "Hewie", "Hewitt", "Heywood", "Hi", "Hieronymus", "Hilario", "Hilarius", "Hilary", "Hill", "Hillard", "Hillary", "Hillel", "Hillery", "Hilliard", "Hillie", "Hillier", "Hilly", "Hillyer", "Hilton", "Hinze", "Hiram", "Hirsch", "Hobard", "Hobart", "Hobey", "Hobie", "Hodge", "Hoebart", "Hogan", "Holden", "Hollis", "Holly", "Holmes", "Holt", "Homer", "Homere", "Homerus", "Horace", "Horacio", "Horatio", "Horatius", "Horst", "Hort", "Horten", "Horton", "Howard", "Howey", "Howie", "Hoyt", "Hube", "Hubert", "Huberto", "Hubey", "Hubie", "Huey", "Hugh", "Hughie", "Hugibert", "Hugo", "Hugues", "Humbert", "Humberto", "Humfrey", "Humfrid", "Humfried", "Humphrey", "Hunfredo", "Hunt", "Hunter", "Huntington", "Huntlee", "Huntley", "Hurlee", "Hurleigh", "Hurley", "Husain", "Husein", "Hussein", "Hy", "Hyatt", "Hyman", "Hymie", "Iago", "Iain", "Ian", "Ibrahim", "Ichabod", "Iggie", "Iggy", "Ignace", "Ignacio", "Ignacius", "Ignatius", "Ignaz", "Ignazio", "Igor", "Ike", "Ikey", "Ilaire", "Ilario", "Immanuel", "Ingamar", "Ingar", "Ingelbert", "Ingemar", "Inger", "Inglebert", "Inglis", "Ingmar", "Ingra", "Ingram", "Ingrim", "Inigo", "Inness", "Innis", "Iorgo", "Iorgos", "Iosep", "Ira", "Irv", "Irvin", "Irvine", "Irving", "Irwin", "Irwinn", "Isa", "Isaac", "Isaak", "Isac", "Isacco", "Isador", "Isadore", "Isaiah", "Isak", "Isiahi", "Isidor", "Isidore", "Isidoro", "Isidro", "Israel", "Issiah", "Itch", "Ivan", "Ivar", "Ive", "Iver", "Ives", "Ivor", "Izaak", "Izak", "Izzy", "Jabez", "Jack", "Jackie", "Jackson", "Jacky", "Jacob", "Jacobo", "Jacques", "Jae", "Jaime", "Jaimie", "Jake", "Jakie", "Jakob", "Jamaal", "Jamal", "James", "Jameson", "Jamesy", "Jamey", "Jamie", "Jamil", "Jamill", "Jamison", "Jammal", "Jan", "Janek", "Janos", "Jarad", "Jard", "Jareb", "Jared", "Jarib", "Jarid", "Jarrad", "Jarred", "Jarret", "Jarrett", "Jarrid", "Jarrod", "Jarvis", "Jase", "Jasen", "Jason", "Jasper", "Jasun", "Javier", "Jay", "Jaye", "Jayme", "Jaymie", "Jayson", "Jdavie", "Jean", "Jecho", "Jed", "Jedd", "Jeddy", "Jedediah", "Jedidiah", "Jeff", "Jefferey", "Jefferson", "Jeffie", "Jeffrey", "Jeffry", "Jeffy", "Jehu", "Jeno", "Jens", "Jephthah", "Jerad", "Jerald", "Jeramey", "Jeramie", "Jere", "Jereme", "Jeremiah", "Jeremias", "Jeremie", "Jeremy", "Jermain", "Jermaine", "Jermayne", "Jerome", "Jeromy", "Jerri", "Jerrie", "Jerrold", "Jerrome", "Jerry", "Jervis", "Jess", "Jesse", "Jessee", "Jessey", "Jessie", "Jesus", "Jeth", "Jethro", "Jim", "Jimmie", "Jimmy", "Jo", "Joachim", "Joaquin", "Job", "Jock", "Jocko", "Jodi", "Jodie", "Jody", "Joe", "Joel", "Joey", "Johan", "Johann", "Johannes", "John", "Johnathan", "Johnathon", "Johnnie", "Johnny", "Johny", "Jon", "Jonah", "Jonas", "Jonathan", "Jonathon", "Jone", "Jordan", "Jordon", "Jorgan", "Jorge", "Jory", "Jose", "Joseito", "Joseph", "Josh", "Joshia", "Joshua", "Joshuah", "Josiah", "Josias", "Jourdain", "Jozef", "Juan", "Jud", "Judah", "Judas", "Judd", "Jude", "Judon", "Jule", "Jules", "Julian", "Julie", "Julio", "Julius", "Justen", "Justin", "Justinian", "Justino", "Justis", "Justus", "Kahaleel", "Kahlil", "Kain", "Kaine", "Kaiser", "Kale", "Kaleb", "Kalil", "Kalle", "Kalvin", "Kane", "Kareem", "Karel", "Karim", "Karl", "Karlan", "Karlens", "Karlik", "Karlis", "Karney", "Karoly", "Kaspar", "Kasper", "Kayne", "Kean", "Keane", "Kearney", "Keary", "Keefe", "Keefer", "Keelby", "Keen", "Keenan", "Keene", "Keir", "Keith", "Kelbee", "Kelby", "Kele", "Kellby", "Kellen", "Kelley", "Kelly", "Kelsey", "Kelvin", "Kelwin", "Ken", "Kendal", "Kendall", "Kendell", "Kendrick", "Kendricks", "Kenn", "Kennan", "Kennedy", "Kenneth", "Kennett", "Kennie", "Kennith", "Kenny", "Kenon", "Kent", "Kenton", "Kenyon", "Ker", "Kerby", "Kerk", "Kermie", "Kermit", "Kermy", "Kerr", "Kerry", "Kerwin", "Kerwinn", "Kev", "Kevan", "Keven", "Kevin", "Kevon", "Khalil", "Kiel", "Kienan", "Kile", "Kiley", "Kilian", "Killian", "Killie", "Killy", "Kim", "Kimball", "Kimbell", "Kimble", "Kin", "Kincaid", "King", "Kingsley", "Kingsly", "Kingston", "Kinnie", "Kinny", "Kinsley", "Kip", "Kipp", "Kippar", "Kipper", "Kippie", "Kippy", "Kirby", "Kirk", "Kit", "Klaus", "Klemens", "Klement", "Kleon", "Kliment", "Knox", "Koenraad", "Konrad", "Konstantin", "Konstantine", "Korey", "Kort", "Kory", "Kris", "Krisha", "Krishna", "Krishnah", "Krispin", "Kristian", "Kristo", "Kristofer", "Kristoffer", "Kristofor", "Kristoforo", "Kristopher", "Kristos", "Kurt", "Kurtis", "Ky", "Kyle", "Kylie", "Laird", "Lalo", "Lamar", "Lambert", "Lammond", "Lamond", "Lamont", "Lance", "Lancelot", "Land", "Lane", "Laney", "Langsdon", "Langston", "Lanie", "Lannie", "Lanny", "Larry", "Lars", "Laughton", "Launce", "Lauren", "Laurence", "Laurens", "Laurent", "Laurie", "Lauritz", "Law", "Lawrence", "Lawry", "Lawton", "Lay", "Layton", "Lazar", "Lazare", "Lazaro", "Lazarus", "Lee", "Leeland", "Lefty", "Leicester", "Leif", "Leigh", "Leighton", "Lek", "Leland", "Lem", "Lemar", "Lemmie", "Lemmy", "Lemuel", "Lenard", "Lenci", "Lennard", "Lennie", "Leo", "Leon", "Leonard", "Leonardo", "Leonerd", "Leonhard", "Leonid", "Leonidas", "Leopold", "Leroi", "Leroy", "Les", "Lesley", "Leslie", "Lester", "Leupold", "Lev", "Levey", "Levi", "Levin", "Levon", "Levy", "Lew", "Lewes", "Lewie", "Lewiss", "Lezley", "Liam", "Lief", "Lin", "Linc", "Lincoln", "Lind", "Lindon", "Lindsay", "Lindsey", "Lindy", "Link", "Linn", "Linoel", "Linus", "Lion", "Lionel", "Lionello", "Lisle", "Llewellyn", "Lloyd", "Llywellyn", "Lock", "Locke", "Lockwood", "Lodovico", "Logan", "Lombard", "Lon", "Lonnard", "Lonnie", "Lonny", "Lorant", "Loren", "Lorens", "Lorenzo", "Lorin", "Lorne", "Lorrie", "Lorry", "Lothaire", "Lothario", "Lou", "Louie", "Louis", "Lovell", "Lowe", "Lowell", "Lowrance", "Loy", "Loydie", "Luca", "Lucais", "Lucas", "Luce", "Lucho", "Lucian", "Luciano", "Lucias", "Lucien", "Lucio", "Lucius", "Ludovico", "Ludvig", "Ludwig", "Luigi", "Luis", "Lukas", "Luke", "Lutero", "Luther", "Ly", "Lydon", "Lyell", "Lyle", "Lyman", "Lyn", "Lynn", "Lyon", "Mac", "Mace", "Mack", "Mackenzie", "Maddie", "Maddy", "Madison", "Magnum", "Mahmoud", "Mahmud", "Maison", "Maje", "Major", "Mal", "Malachi", "Malchy", "Malcolm", "Mallory", "Malvin", "Man", "Mandel", "Manfred", "Mannie", "Manny", "Mano", "Manolo", "Manuel", "Mar", "Marc", "Marcel", "Marcello", "Marcellus", "Marcelo", "Marchall", "Marco", "Marcos", "Marcus", "Marijn", "Mario", "Marion", "Marius", "Mark", "Markos", "Markus", "Marlin", "Marlo", "Marlon", "Marlow", "Marlowe", "Marmaduke", "Marsh", "Marshal", "Marshall", "Mart", "Martainn", "Marten", "Martie", "Martin", "Martino", "Marty", "Martyn", "Marv", "Marve", "Marven", "Marvin", "Marwin", "Mason", "Massimiliano", "Massimo", "Mata", "Mateo", "Mathe", "Mathew", "Mathian", "Mathias", "Matias", "Matt", "Matteo", "Matthaeus", "Mattheus", "Matthew", "Matthias", "Matthieu", "Matthiew", "Matthus", "Mattias", "Mattie", "Matty", "Maurice", "Mauricio", "Maurie", "Maurise", "Maurits", "Maurizio", "Maury", "Max", "Maxie", "Maxim", "Maximilian", "Maximilianus", "Maximilien", "Maximo", "Maxwell", "Maxy", "Mayer", "Maynard", "Mayne", "Maynord", "Mayor", "Mead", "Meade", "Meier", "Meir", "Mel", "Melvin", "Melvyn", "Menard", "Mendel", "Mendie", "Mendy", "Meredeth", "Meredith", "Merell", "Merill", "Merle", "Merrel", "Merrick", "Merrill", "Merry", "Merv", "Mervin", "Merwin", "Merwyn", "Meryl", "Meyer", "Mic", "Micah", "Michael", "Michail", "Michal", "Michale", "Micheal", "Micheil", "Michel", "Michele", "Mick", "Mickey", "Mickie", "Micky", "Miguel", "Mikael", "Mike", "Mikel", "Mikey", "Mikkel", "Mikol", "Mile", "Miles", "Mill", "Millard", "Miller", "Milo", "Milt", "Miltie", "Milton", "Milty", "Miner", "Minor", "Mischa", "Mitch", "Mitchael", "Mitchel", "Mitchell", "Moe", "Mohammed", "Mohandas", "Mohandis", "Moise", "Moises", "Moishe", "Monro", "Monroe", "Montague", "Monte", "Montgomery", "Monti", "Monty", "Moore", "Mord", "Mordecai", "Mordy", "Morey", "Morgan", "Morgen", "Morgun", "Morie", "Moritz", "Morlee", "Morley", "Morly", "Morrie", "Morris", "Morry", "Morse", "Mort", "Morten", "Mortie", "Mortimer", "Morton", "Morty", "Mose", "Moses", "Moshe", "Moss", "Mozes", "Muffin", "Muhammad", "Munmro", "Munroe", "Murdoch", "Murdock", "Murray", "Murry", "Murvyn", "My", "Myca", "Mycah", "Mychal", "Myer", "Myles", "Mylo", "Myron", "Myrvyn", "Myrwyn", "Nahum", "Nap", "Napoleon", "Nappie", "Nappy", "Nat", "Natal", "Natale", "Nataniel", "Nate", "Nathan", "Nathanael", "Nathanial", "Nathaniel", "Nathanil", "Natty", "Neal", "Neale", "Neall", "Nealon", "Nealson", "Nealy", "Ned", "Neddie", "Neddy", "Neel", "Nefen", "Nehemiah", "Neil", "Neill", "Neils", "Nels", "Nelson", "Nero", "Neron", "Nester", "Nestor", "Nev", "Nevil", "Nevile", "Neville", "Nevin", "Nevins", "Newton", "Nial", "Niall", "Niccolo", "Nicholas", "Nichole", "Nichols", "Nick", "Nickey", "Nickie", "Nicko", "Nickola", "Nickolai", "Nickolas", "Nickolaus", "Nicky", "Nico", "Nicol", "Nicola", "Nicolai", "Nicolais", "Nicolas", "Nicolis", "Niel", "Niels", "Nigel", "Niki", "Nikita", "Nikki", "Niko", "Nikola", "Nikolai", "Nikolaos", "Nikolas", "Nikolaus", "Nikolos", "Nikos", "Nil", "Niles", "Nils", "Nilson", "Niven", "Noach", "Noah", "Noak", "Noam", "Nobe", "Nobie", "Noble", "Noby", "Noe", "Noel", "Nolan", "Noland", "Noll", "Nollie", "Nolly", "Norbert", "Norbie", "Norby", "Norman", "Normand", "Normie", "Normy", "Norrie", "Norris", "Norry", "North", "Northrop", "Northrup", "Norton", "Nowell", "Nye", "Oates", "Obadiah", "Obadias", "Obed", "Obediah", "Oberon", "Obidiah", "Obie", "Oby", "Octavius", "Ode", "Odell", "Odey", "Odie", "Odo", "Ody", "Ogdan", "Ogden", "Ogdon", "Olag", "Olav", "Ole", "Olenolin", "Olin", "Oliver", "Olivero", "Olivier", "Oliviero", "Ollie", "Olly", "Olvan", "Omar", "Omero", "Onfre", "Onfroi", "Onofredo", "Oran", "Orazio", "Orbadiah", "Oren", "Orin", "Orion", "Orlan", "Orland", "Orlando", "Orran", "Orren", "Orrin", "Orson", "Orton", "Orv", "Orville", "Osbert", "Osborn", "Osborne", "Osbourn", "Osbourne", "Osgood", "Osmond", "Osmund", "Ossie", "Oswald", "Oswell", "Otes", "Othello", "Otho", "Otis", "Otto", "Owen", "Ozzie", "Ozzy", "Pablo", "Pace", "Packston", "Paco", "Pacorro", "Paddie", "Paddy", "Padget", "Padgett", "Padraic", "Padraig", "Padriac", "Page", "Paige", "Pail", "Pall", "Palm", "Palmer", "Panchito", "Pancho", "Paolo", "Papageno", "Paquito", "Park", "Parke", "Parker", "Parnell", "Parrnell", "Parry", "Parsifal", "Pascal", "Pascale", "Pasquale", "Pat", "Pate", "Paten", "Patin", "Paton", "Patric", "Patrice", "Patricio", "Patrick", "Patrizio", "Patrizius", "Patsy", "Patten", "Pattie", "Pattin", "Patton", "Patty", "Paul", "Paulie", "Paulo", "Pauly", "Pavel", "Pavlov", "Paxon", "Paxton", "Payton", "Peadar", "Pearce", "Pebrook", "Peder", "Pedro", "Peirce", "Pembroke", "Pen", "Penn", "Pennie", "Penny", "Penrod", "Pepe", "Pepillo", "Pepito", "Perceval", "Percival", "Percy", "Perice", "Perkin", "Pernell", "Perren", "Perry", "Pete", "Peter", "Peterus", "Petey", "Petr", "Peyter", "Peyton", "Phil", "Philbert", "Philip", "Phillip", "Phillipe", "Phillipp", "Phineas", "Phip", "Pierce", "Pierre", "Pierson", "Pieter", "Pietrek", "Pietro", "Piggy", "Pincas", "Pinchas", "Pincus", "Piotr", "Pip", "Pippo", "Pooh", "Port", "Porter", "Portie", "Porty", "Poul", "Powell", "Pren", "Prent", "Prentice", "Prentiss", "Prescott", "Preston", "Price", "Prince", "Prinz", "Pryce", "Puff", "Purcell", "Putnam", "Putnem", "Pyotr", "Quent", "Quentin", "Quill", "Quillan", "Quincey", "Quincy", "Quinlan", "Quinn", "Quint", "Quintin", "Quinton", "Quintus", "Rab", "Rabbi", "Rabi", "Rad", "Radcliffe", "Raddie", "Raddy", "Rafael", "Rafaellle", "Rafaello", "Rafe", "Raff", "Raffaello", "Raffarty", "Rafferty", "Rafi", "Ragnar", "Raimondo", "Raimund", "Raimundo", "Rainer", "Raleigh", "Ralf", "Ralph", "Ram", "Ramon", "Ramsay", "Ramsey", "Rance", "Rancell", "Rand", "Randal", "Randall", "Randell", "Randi", "Randie", "Randolf", "Randolph", "Randy", "Ransell", "Ransom", "Raoul", "Raphael", "Raul", "Ravi", "Ravid", "Raviv", "Rawley", "Ray", "Raymond", "Raymund", "Raynard", "Rayner", "Raynor", "Read", "Reade", "Reagan", "Reagen", "Reamonn", "Red", "Redd", "Redford", "Reece", "Reed", "Rees", "Reese", "Reg", "Regan", "Regen", "Reggie", "Reggis", "Reggy", "Reginald", "Reginauld", "Reid", "Reidar", "Reider", "Reilly", "Reinald", "Reinaldo", "Reinaldos", "Reinhard", "Reinhold", "Reinold", "Reinwald", "Rem", "Remington", "Remus", "Renado", "Renaldo", "Renard", "Renato", "Renaud", "Renault", "Rene", "Reube", "Reuben", "Reuven", "Rex", "Rey", "Reynard", "Reynold", "Reynolds", "Rhett", "Rhys", "Ric", "Ricard", "Ricardo", "Riccardo", "Rice", "Rich", "Richard", "Richardo", "Richart", "Richie", "Richmond", "Richmound", "Richy", "Rick", "Rickard", "Rickert", "Rickey", "Ricki", "Rickie", "Ricky", "Ricoriki", "Rik", "Rikki", "Riley", "Rinaldo", "Ring", "Ringo", "Riobard", "Riordan", "Rip", "Ripley", "Ritchie", "Roarke", "Rob", "Robb", "Robbert", "Robbie", "Robby", "Robers", "Robert", "Roberto", "Robin", "Robinet", "Robinson", "Rochester", "Rock", "Rockey", "Rockie", "Rockwell", "Rocky", "Rod", "Rodd", "Roddie", "Roddy", "Roderic", "Roderich", "Roderick", "Roderigo", "Rodge", "Rodger", "Rodney", "Rodolfo", "Rodolph", "Rodolphe", "Rodrick", "Rodrigo", "Rodrique", "Rog", "Roger", "Rogerio", "Rogers", "Roi", "Roland", "Rolando", "Roldan", "Roley", "Rolf", "Rolfe", "Rolland", "Rollie", "Rollin", "Rollins", "Rollo", "Rolph", "Roma", "Romain", "Roman", "Romeo", "Ron", "Ronald", "Ronnie", "Ronny", "Rooney", "Roosevelt", "Rorke", "Rory", "Rosco", "Roscoe", "Ross", "Rossie", "Rossy", "Roth", "Rourke", "Rouvin", "Rowan", "Rowen", "Rowland", "Rowney", "Roy", "Royal", "Royall", "Royce", "Rriocard", "Rube", "Ruben", "Rubin", "Ruby", "Rudd", "Ruddie", "Ruddy", "Rudie", "Rudiger", "Rudolf", "Rudolfo", "Rudolph", "Rudy", "Rudyard", "Rufe", "Rufus", "Ruggiero", "Rupert", "Ruperto", "Ruprecht", "Rurik", "Russ", "Russell", "Rustie", "Rustin", "Rusty", "Rutger", "Rutherford", "Rutledge", "Rutter", "Ruttger", "Ruy", "Ryan", "Ryley", "Ryon", "Ryun", "Sal", "Saleem", "Salem", "Salim", "Salmon", "Salomo", "Salomon", "Salomone", "Salvador", "Salvatore", "Salvidor", "Sam", "Sammie", "Sammy", "Sampson", "Samson", "Samuel", "Samuele", "Sancho", "Sander", "Sanders", "Sanderson", "Sandor", "Sandro", "Sandy", "Sanford", "Sanson", "Sansone", "Sarge", "Sargent", "Sascha", "Sasha", "Saul", "Sauncho", "Saunder", "Saunders", "Saunderson", "Saundra", "Sauveur", "Saw", "Sawyer", "Sawyere", "Sax", "Saxe", "Saxon", "Say", "Sayer", "Sayers", "Sayre", "Sayres", "Scarface", "Schuyler", "Scot", "Scott", "Scotti", "Scottie", "Scotty", "Seamus", "Sean", "Sebastian", "Sebastiano", "Sebastien", "See", "Selby", "Selig", "Serge", "Sergeant", "Sergei", "Sergent", "Sergio", "Seth", "Seumas", "Seward", "Seymour", "Shadow", "Shae", "Shaine", "Shalom", "Shamus", "Shanan", "Shane", "Shannan", "Shannon", "Shaughn", "Shaun", "Shaw", "Shawn", "Shay", "Shayne", "Shea", "Sheff", "Sheffie", "Sheffield", "Sheffy", "Shelby", "Shelden", "Shell", "Shelley", "Shelton", "Shem", "Shep", "Shepard", "Shepherd", "Sheppard", "Shepperd", "Sheridan", "Sherlock", "Sherlocke", "Sherm", "Sherman", "Shermie", "Shermy", "Sherwin", "Sherwood", "Sherwynd", "Sholom", "Shurlock", "Shurlocke", "Shurwood", "Si", "Sibyl", "Sid", "Sidnee", "Sidney", "Siegfried", "Siffre", "Sig", "Sigfrid", "Sigfried", "Sigismond", "Sigismondo", "Sigismund", "Sigismundo", "Sigmund", "Sigvard", "Silas", "Silvain", "Silvan", "Silvano", "Silvanus", "Silvester", "Silvio", "Sim", "Simeon", "Simmonds", "Simon", "Simone", "Sinclair", "Sinclare", "Siward", "Skell", "Skelly", "Skip", "Skipp", "Skipper", "Skippie", "Skippy", "Skipton", "Sky", "Skye", "Skylar", "Skyler", "Slade", "Sloan", "Sloane", "Sly", "Smith", "Smitty", "Sol", "Sollie", "Solly", "Solomon", "Somerset", "Son", "Sonnie", "Sonny", "Spence", "Spencer", "Spense", "Spenser", "Spike", "Stacee", "Stacy", "Staffard", "Stafford", "Staford", "Stan", "Standford", "Stanfield", "Stanford", "Stanislas", "Stanislaus", "Stanislaw", "Stanleigh", "Stanley", "Stanly", "Stanton", "Stanwood", "Stavro", "Stavros", "Stearn", "Stearne", "Stefan", "Stefano", "Steffen", "Stephan", "Stephanus", "Stephen", "Sterling", "Stern", "Sterne", "Steve", "Steven", "Stevie", "Stevy", "Steward", "Stewart", "Stillman", "Stillmann", "Stinky", "Stirling", "Stu", "Stuart", "Sullivan", "Sully", "Sumner", "Sunny", "Sutherlan", "Sutherland", "Sutton", "Sven", "Svend", "Swen", "Syd", "Sydney", "Sylas", "Sylvan", "Sylvester", "Syman", "Symon", "Tab", "Tabb", "Tabbie", "Tabby", "Taber", "Tabor", "Tad", "Tadd", "Taddeo", "Taddeusz", "Tadeas", "Tadeo", "Tades", "Tadio", "Tailor", "Tait", "Taite", "Talbert", "Talbot", "Tallie", "Tally", "Tam", "Tamas", "Tammie", "Tammy", "Tan", "Tann", "Tanner", "Tanney", "Tannie", "Tanny", "Tarrance", "Tate", "Taylor", "Teador", "Ted", "Tedd", "Teddie", "Teddy", "Tedie", "Tedman", "Tedmund", "Temp", "Temple", "Templeton", "Teodoor", "Teodor", "Teodorico", "Teodoro", "Terence", "Terencio", "Terrance", "Terrel", "Terrell", "Terrence", "Terri", "Terrill", "Terry", "Thacher", "Thaddeus", "Thaddus", "Thadeus", "Thain", "Thaine", "Thane", "Thatch", "Thatcher", "Thaxter", "Thayne", "Thebault", "Thedric", "Thedrick", "Theo", "Theobald", "Theodor", "Theodore", "Theodoric", "Thibaud", "Thibaut", "Thom", "Thoma", "Thomas", "Thor", "Thorin", "Thorn", "Thorndike", "Thornie", "Thornton", "Thorny", "Thorpe", "Thorstein", "Thorsten", "Thorvald", "Thurstan", "Thurston", "Tibold", "Tiebold", "Tiebout", "Tiler", "Tim", "Timmie", "Timmy", "Timofei", "Timoteo", "Timothee", "Timotheus", "Timothy", "Tirrell", "Tito", "Titos", "Titus", "Tobe", "Tobiah", "Tobias", "Tobie", "Tobin", "Tobit", "Toby", "Tod", "Todd", "Toddie", "Toddy", "Toiboid", "Tom", "Tomas", "Tomaso", "Tome", "Tomkin", "Tomlin", "Tommie", "Tommy", "Tonnie", "Tony", "Tore", "Torey", "Torin", "Torr", "Torrance", "Torre", "Torrence", "Torrey", "Torrin", "Torry", "Town", "Towney", "Townie", "Townsend", "Towny", "Trace", "Tracey", "Tracie", "Tracy", "Traver", "Travers", "Travis", "Travus", "Trefor", "Tremain", "Tremaine", "Tremayne", "Trent", "Trenton", "Trev", "Trevar", "Trever", "Trevor", "Trey", "Trip", "Tripp", "Tris", "Tristam", "Tristan", "Troy", "Trstram", "Trueman", "Trumaine", "Truman", "Trumann", "Tuck", "Tucker", "Tuckie", "Tucky", "Tudor", "Tull", "Tulley", "Tully", "Turner", "Ty", "Tybalt", "Tye", "Tyler", "Tymon", "Tymothy", "Tynan", "Tyrone", "Tyrus", "Tyson", "Udale", "Udall", "Udell", "Ugo", "Ulberto", "Ulick", "Ulises", "Ulric", "Ulrich", "Ulrick", "Ulysses", "Umberto", "Upton", "Urbain", "Urban", "Urbano", "Urbanus", "Uri", "Uriah", "Uriel", "Urson", "Vachel", "Vaclav", "Vail", "Val", "Valdemar", "Vale", "Valentijn", "Valentin", "Valentine", "Valentino", "Valle", "Van", "Vance", "Vanya", "Vasili", "Vasilis", "Vasily", "Vassili", "Vassily", "Vaughan", "Vaughn", "Verge", "Vergil", "Vern", "Verne", "Vernen", "Verney", "Vernon", "Vernor", "Vic", "Vick", "Victoir", "Victor", "Vidovic", "Vidovik", "Vin", "Vince", "Vincent", "Vincents", "Vincenty", "Vincenz", "Vinnie", "Vinny", "Vinson", "Virge", "Virgie", "Virgil", "Virgilio", "Vite", "Vito", "Vittorio", "Vlad", "Vladamir", "Vladimir", "Von", "Wade", "Wadsworth", "Wain", "Wainwright", "Wait", "Waite", "Waiter", "Wake", "Wakefield", "Wald", "Waldemar", "Walden", "Waldo", "Waldon", "Walker", "Wallace", "Wallache", "Wallas", "Wallie", "Wallis", "Wally", "Walsh", "Walt", "Walther", "Walton", "Wang", "Ward", "Warde", "Warden", "Ware", "Waring", "Warner", "Warren", "Wash", "Washington", "Wat", "Waverley", "Waverly", "Way", "Waylan", "Wayland", "Waylen", "Waylin", "Waylon", "Wayne", "Web", "Webb", "Weber", "Webster", "Weidar", "Weider", "Welbie", "Welby", "Welch", "Wells", "Welsh", "Wendall", "Wendel", "Wendell", "Werner", "Wernher", "Wes", "Wesley", "West", "Westbrook", "Westbrooke", "Westleigh", "Westley", "Weston", "Weylin", "Wheeler", "Whit", "Whitaker", "Whitby", "Whitman", "Whitney", "Whittaker", "Wiatt", "Wilbert", "Wilbur", "Wilburt", "Wilden", "Wildon", "Wilek", "Wiley", "Wilfred", "Wilfrid", "Wilhelm", "Will", "Willard", "Willdon", "Willem", "Willey", "Willi", "William", "Willie", "Willis", "Willy", "Wilmar", "Wilmer", "Wilt", "Wilton", "Win", "Windham", "Winfield", "Winfred", "Winifield", "Winn", "Winnie", "Winny", "Winslow", "Winston", "Winthrop", "Wit", "Wittie", "Witty", "Wolf", "Wolfgang", "Wolfie", "Wolfy", "Wood", "Woodie", "Woodman", "Woodrow", "Woody", "Worden", "Worth", "Worthington", "Worthy", "Wright", "Wyatan", "Wyatt", "Wye", "Wylie", "Wyn", "Wyndham", "Wynn", "Xavier", "Xenos", "Xerxes", "Xever", "Ximenes", "Ximenez", "Xymenes", "Yale", "Yanaton", "Yance", "Yancey", "Yancy", "Yank", "Yankee", "Yard", "Yardley", "Yehudi", "Yehudit", "Yorgo", "Yorgos", "York", "Yorke", "Yorker", "Yul", "Yule", "Yulma", "Yuma", "Yuri", "Yurik", "Yves", "Yvon", "Yvor", "Zaccaria", "Zach", "Zacharia", "Zachariah", "Zacharias", "Zacharie", "Zachary", "Zacherie", "Zachery", "Zack", "Zackariah", "Zak", "Zane", "Zared", "Zeb", "Zebadiah", "Zebedee", "Zebulen", "Zebulon", "Zechariah", "Zed", "Zedekiah", "Zeke", "Zelig", "Zerk", "Zollie", "Zolly"];

// node_modules/datasets-female-first-names-en/lib/dataset.json
var dataset_default2 = ["Aaren", "Aarika", "Abagael", "Abagail", "Abbe", "Abbey", "Abbi", "Abbie", "Abby", "Abbye", "Abigael", "Abigail", "Abigale", "Abra", "Ada", "Adah", "Adaline", "Adan", "Adara", "Adda", "Addi", "Addia", "Addie", "Addy", "Adel", "Adela", "Adelaida", "Adelaide", "Adele", "Adelheid", "Adelice", "Adelina", "Adelind", "Adeline", "Adella", "Adelle", "Adena", "Adey", "Adi", "Adiana", "Adina", "Adora", "Adore", "Adoree", "Adorne", "Adrea", "Adria", "Adriaens", "Adrian", "Adriana", "Adriane", "Adrianna", "Adrianne", "Adriena", "Adrienne", "Aeriel", "Aeriela", "Aeriell", "Afton", "Ag", "Agace", "Agata", "Agatha", "Agathe", "Aggi", "Aggie", "Aggy", "Agna", "Agnella", "Agnes", "Agnese", "Agnesse", "Agneta", "Agnola", "Agretha", "Aida", "Aidan", "Aigneis", "Aila", "Aile", "Ailee", "Aileen", "Ailene", "Ailey", "Aili", "Ailina", "Ailis", "Ailsun", "Ailyn", "Aime", "Aimee", "Aimil", "Aindrea", "Ainslee", "Ainsley", "Ainslie", "Ajay", "Alaine", "Alameda", "Alana", "Alanah", "Alane", "Alanna", "Alayne", "Alberta", "Albertina", "Albertine", "Albina", "Alecia", "Aleda", "Aleece", "Aleen", "Alejandra", "Alejandrina", "Alena", "Alene", "Alessandra", "Aleta", "Alethea", "Alex", "Alexa", "Alexandra", "Alexandrina", "Alexi", "Alexia", "Alexina", "Alexine", "Alexis", "Alfi", "Alfie", "Alfreda", "Alfy", "Ali", "Alia", "Alica", "Alice", "Alicea", "Alicia", "Alida", "Alidia", "Alie", "Alika", "Alikee", "Alina", "Aline", "Alis", "Alisa", "Alisha", "Alison", "Alissa", "Alisun", "Alix", "Aliza", "Alla", "Alleen", "Allegra", "Allene", "Alli", "Allianora", "Allie", "Allina", "Allis", "Allison", "Allissa", "Allix", "Allsun", "Allx", "Ally", "Allyce", "Allyn", "Allys", "Allyson", "Alma", "Almeda", "Almeria", "Almeta", "Almira", "Almire", "Aloise", "Aloisia", "Aloysia", "Alta", "Althea", "Alvera", "Alverta", "Alvina", "Alvinia", "Alvira", "Alyce", "Alyda", "Alys", "Alysa", "Alyse", "Alysia", "Alyson", "Alyss", "Alyssa", "Amabel", "Amabelle", "Amalea", "Amalee", "Amaleta", "Amalia", "Amalie", "Amalita", "Amalle", "Amanda", "Amandi", "Amandie", "Amandy", "Amara", "Amargo", "Amata", "Amber", "Amberly", "Ambur", "Ame", "Amelia", "Amelie", "Amelina", "Ameline", "Amelita", "Ami", "Amie", "Amii", "Amil", "Amitie", "Amity", "Ammamaria", "Amy", "Amye", "Ana", "Anabal", "Anabel", "Anabella", "Anabelle", "Analiese", "Analise", "Anallese", "Anallise", "Anastasia", "Anastasie", "Anastassia", "Anatola", "Andee", "Andeee", "Anderea", "Andi", "Andie", "Andra", "Andrea", "Andreana", "Andree", "Andrei", "Andria", "Andriana", "Andriette", "Andromache", "Andy", "Anestassia", "Anet", "Anett", "Anetta", "Anette", "Ange", "Angel", "Angela", "Angele", "Angelia", "Angelica", "Angelika", "Angelina", "Angeline", "Angelique", "Angelita", "Angelle", "Angie", "Angil", "Angy", "Ania", "Anica", "Anissa", "Anita", "Anitra", "Anjanette", "Anjela", "Ann", "Ann-Marie", "Anna", "Anna-Diana", "Anna-Diane", "Anna-Maria", "Annabal", "Annabel", "Annabela", "Annabell", "Annabella", "Annabelle", "Annadiana", "Annadiane", "Annalee", "Annaliese", "Annalise", "Annamaria", "Annamarie", "Anne", "Anne-Corinne", "Anne-Marie", "Annecorinne", "Anneliese", "Annelise", "Annemarie", "Annetta", "Annette", "Anni", "Annice", "Annie", "Annis", "Annissa", "Annmaria", "Annmarie", "Annnora", "Annora", "Anny", "Anselma", "Ansley", "Anstice", "Anthe", "Anthea", "Anthia", "Anthiathia", "Antoinette", "Antonella", "Antonetta", "Antonia", "Antonie", "Antonietta", "Antonina", "Anya", "Appolonia", "April", "Aprilette", "Ara", "Arabel", "Arabela", "Arabele", "Arabella", "Arabelle", "Arda", "Ardath", "Ardeen", "Ardelia", "Ardelis", "Ardella", "Ardelle", "Arden", "Ardene", "Ardenia", "Ardine", "Ardis", "Ardisj", "Ardith", "Ardra", "Ardyce", "Ardys", "Ardyth", "Aretha", "Ariadne", "Ariana", "Aridatha", "Ariel", "Ariela", "Ariella", "Arielle", "Arlana", "Arlee", "Arleen", "Arlen", "Arlena", "Arlene", "Arleta", "Arlette", "Arleyne", "Arlie", "Arliene", "Arlina", "Arlinda", "Arline", "Arluene", "Arly", "Arlyn", "Arlyne", "Aryn", "Ashely", "Ashia", "Ashien", "Ashil", "Ashla", "Ashlan", "Ashlee", "Ashleigh", "Ashlen", "Ashley", "Ashli", "Ashlie", "Ashly", "Asia", "Astra", "Astrid", "Astrix", "Atalanta", "Athena", "Athene", "Atlanta", "Atlante", "Auberta", "Aubine", "Aubree", "Aubrette", "Aubrey", "Aubrie", "Aubry", "Audi", "Audie", "Audra", "Audre", "Audrey", "Audrie", "Audry", "Audrye", "Audy", "Augusta", "Auguste", "Augustina", "Augustine", "Aundrea", "Aura", "Aurea", "Aurel", "Aurelea", "Aurelia", "Aurelie", "Auria", "Aurie", "Aurilia", "Aurlie", "Auroora", "Aurora", "Aurore", "Austin", "Austina", "Austine", "Ava", "Aveline", "Averil", "Averyl", "Avie", "Avis", "Aviva", "Avivah", "Avril", "Avrit", "Ayn", "Bab", "Babara", "Babb", "Babbette", "Babbie", "Babette", "Babita", "Babs", "Bambi", "Bambie", "Bamby", "Barb", "Barbabra", "Barbara", "Barbara-Anne", "Barbaraanne", "Barbe", "Barbee", "Barbette", "Barbey", "Barbi", "Barbie", "Barbra", "Barby", "Bari", "Barrie", "Barry", "Basia", "Bathsheba", "Batsheva", "Bea", "Beatrice", "Beatrisa", "Beatrix", "Beatriz", "Bebe", "Becca", "Becka", "Becki", "Beckie", "Becky", "Bee", "Beilul", "Beitris", "Bekki", "Bel", "Belia", "Belicia", "Belinda", "Belita", "Bell", "Bella", "Bellanca", "Belle", "Bellina", "Belva", "Belvia", "Bendite", "Benedetta", "Benedicta", "Benedikta", "Benetta", "Benita", "Benni", "Bennie", "Benny", "Benoite", "Berenice", "Beret", "Berget", "Berna", "Bernadene", "Bernadette", "Bernadina", "Bernadine", "Bernardina", "Bernardine", "Bernelle", "Bernete", "Bernetta", "Bernette", "Berni", "Bernice", "Bernie", "Bernita", "Berny", "Berri", "Berrie", "Berry", "Bert", "Berta", "Berte", "Bertha", "Berthe", "Berti", "Bertie", "Bertina", "Bertine", "Berty", "Beryl", "Beryle", "Bess", "Bessie", "Bessy", "Beth", "Bethanne", "Bethany", "Bethena", "Bethina", "Betsey", "Betsy", "Betta", "Bette", "Bette-Ann", "Betteann", "Betteanne", "Betti", "Bettina", "Bettine", "Betty", "Bettye", "Beulah", "Bev", "Beverie", "Beverlee", "Beverley", "Beverlie", "Beverly", "Bevvy", "Bianca", "Bianka", "Bibbie", "Bibby", "Bibbye", "Bibi", "Biddie", "Biddy", "Bidget", "Bili", "Bill", "Billi", "Billie", "Billy", "Billye", "Binni", "Binnie", "Binny", "Bird", "Birdie", "Birgit", "Birgitta", "Blair", "Blaire", "Blake", "Blakelee", "Blakeley", "Blanca", "Blanch", "Blancha", "Blanche", "Blinni", "Blinnie", "Blinny", "Bliss", "Blisse", "Blithe", "Blondell", "Blondelle", "Blondie", "Blondy", "Blythe", "Bobbe", "Bobbee", "Bobbette", "Bobbi", "Bobbie", "Bobby", "Bobbye", "Bobette", "Bobina", "Bobine", "Bobinette", "Bonita", "Bonnee", "Bonni", "Bonnibelle", "Bonnie", "Bonny", "Brana", "Brandais", "Brande", "Brandea", "Brandi", "Brandice", "Brandie", "Brandise", "Brandy", "Breanne", "Brear", "Bree", "Breena", "Bren", "Brena", "Brenda", "Brenn", "Brenna", "Brett", "Bria", "Briana", "Brianna", "Brianne", "Bride", "Bridget", "Bridgette", "Bridie", "Brier", "Brietta", "Brigid", "Brigida", "Brigit", "Brigitta", "Brigitte", "Brina", "Briney", "Brinn", "Brinna", "Briny", "Brit", "Brita", "Britney", "Britni", "Britt", "Britta", "Brittan", "Brittaney", "Brittani", "Brittany", "Britte", "Britteny", "Brittne", "Brittney", "Brittni", "Brook", "Brooke", "Brooks", "Brunhilda", "Brunhilde", "Bryana", "Bryn", "Bryna", "Brynn", "Brynna", "Brynne", "Buffy", "Bunni", "Bunnie", "Bunny", "Cacilia", "Cacilie", "Cahra", "Cairistiona", "Caitlin", "Caitrin", "Cal", "Calida", "Calla", "Calley", "Calli", "Callida", "Callie", "Cally", "Calypso", "Cam", "Camala", "Camel", "Camella", "Camellia", "Cami", "Camila", "Camile", "Camilla", "Camille", "Cammi", "Cammie", "Cammy", "Candace", "Candi", "Candice", "Candida", "Candide", "Candie", "Candis", "Candra", "Candy", "Caprice", "Cara", "Caralie", "Caren", "Carena", "Caresa", "Caressa", "Caresse", "Carey", "Cari", "Caria", "Carie", "Caril", "Carilyn", "Carin", "Carina", "Carine", "Cariotta", "Carissa", "Carita", "Caritta", "Carla", "Carlee", "Carleen", "Carlen", "Carlene", "Carley", "Carlie", "Carlin", "Carlina", "Carline", "Carlita", "Carlota", "Carlotta", "Carly", "Carlye", "Carlyn", "Carlynn", "Carlynne", "Carma", "Carmel", "Carmela", "Carmelia", "Carmelina", "Carmelita", "Carmella", "Carmelle", "Carmen", "Carmencita", "Carmina", "Carmine", "Carmita", "Carmon", "Caro", "Carol", "Carol-Jean", "Carola", "Carolan", "Carolann", "Carole", "Carolee", "Carolin", "Carolina", "Caroline", "Caroljean", "Carolyn", "Carolyne", "Carolynn", "Caron", "Carree", "Carri", "Carrie", "Carrissa", "Carroll", "Carry", "Cary", "Caryl", "Caryn", "Casandra", "Casey", "Casi", "Casie", "Cass", "Cassandra", "Cassandre", "Cassandry", "Cassaundra", "Cassey", "Cassi", "Cassie", "Cassondra", "Cassy", "Catarina", "Cate", "Caterina", "Catha", "Catharina", "Catharine", "Cathe", "Cathee", "Catherin", "Catherina", "Catherine", "Cathi", "Cathie", "Cathleen", "Cathlene", "Cathrin", "Cathrine", "Cathryn", "Cathy", "Cathyleen", "Cati", "Catie", "Catina", "Catlaina", "Catlee", "Catlin", "Catrina", "Catriona", "Caty", "Caye", "Cayla", "Cecelia", "Cecil", "Cecile", "Ceciley", "Cecilia", "Cecilla", "Cecily", "Ceil", "Cele", "Celene", "Celesta", "Celeste", "Celestia", "Celestina", "Celestine", "Celestyn", "Celestyna", "Celia", "Celie", "Celina", "Celinda", "Celine", "Celinka", "Celisse", "Celka", "Celle", "Cesya", "Chad", "Chanda", "Chandal", "Chandra", "Channa", "Chantal", "Chantalle", "Charil", "Charin", "Charis", "Charissa", "Charisse", "Charita", "Charity", "Charla", "Charlean", "Charleen", "Charlena", "Charlene", "Charline", "Charlot", "Charlotta", "Charlotte", "Charmain", "Charmaine", "Charmane", "Charmian", "Charmine", "Charmion", "Charo", "Charyl", "Chastity", "Chelsae", "Chelsea", "Chelsey", "Chelsie", "Chelsy", "Cher", "Chere", "Cherey", "Cheri", "Cherianne", "Cherice", "Cherida", "Cherie", "Cherilyn", "Cherilynn", "Cherin", "Cherise", "Cherish", "Cherlyn", "Cherri", "Cherrita", "Cherry", "Chery", "Cherye", "Cheryl", "Cheslie", "Chiarra", "Chickie", "Chicky", "Chiquia", "Chiquita", "Chlo", "Chloe", "Chloette", "Chloris", "Chris", "Chrissie", "Chrissy", "Christa", "Christabel", "Christabella", "Christal", "Christalle", "Christan", "Christean", "Christel", "Christen", "Christi", "Christian", "Christiana", "Christiane", "Christie", "Christin", "Christina", "Christine", "Christy", "Christye", "Christyna", "Chrysa", "Chrysler", "Chrystal", "Chryste", "Chrystel", "Cicely", "Cicily", "Ciel", "Cilka", "Cinda", "Cindee", "Cindelyn", "Cinderella", "Cindi", "Cindie", "Cindra", "Cindy", "Cinnamon", "Cissiee", "Cissy", "Clair", "Claire", "Clara", "Clarabelle", "Clare", "Claresta", "Clareta", "Claretta", "Clarette", "Clarey", "Clari", "Claribel", "Clarice", "Clarie", "Clarinda", "Clarine", "Clarissa", "Clarisse", "Clarita", "Clary", "Claude", "Claudelle", "Claudetta", "Claudette", "Claudia", "Claudie", "Claudina", "Claudine", "Clea", "Clem", "Clemence", "Clementia", "Clementina", "Clementine", "Clemmie", "Clemmy", "Cleo", "Cleopatra", "Clerissa", "Clio", "Clo", "Cloe", "Cloris", "Clotilda", "Clovis", "Codee", "Codi", "Codie", "Cody", "Coleen", "Colene", "Coletta", "Colette", "Colleen", "Collen", "Collete", "Collette", "Collie", "Colline", "Colly", "Con", "Concettina", "Conchita", "Concordia", "Conni", "Connie", "Conny", "Consolata", "Constance", "Constancia", "Constancy", "Constanta", "Constantia", "Constantina", "Constantine", "Consuela", "Consuelo", "Cookie", "Cora", "Corabel", "Corabella", "Corabelle", "Coral", "Coralie", "Coraline", "Coralyn", "Cordelia", "Cordelie", "Cordey", "Cordi", "Cordie", "Cordula", "Cordy", "Coreen", "Corella", "Corenda", "Corene", "Coretta", "Corette", "Corey", "Cori", "Corie", "Corilla", "Corina", "Corine", "Corinna", "Corinne", "Coriss", "Corissa", "Corliss", "Corly", "Cornela", "Cornelia", "Cornelle", "Cornie", "Corny", "Correna", "Correy", "Corri", "Corrianne", "Corrie", "Corrina", "Corrine", "Corrinne", "Corry", "Cortney", "Cory", "Cosetta", "Cosette", "Costanza", "Courtenay", "Courtnay", "Courtney", "Crin", "Cris", "Crissie", "Crissy", "Crista", "Cristabel", "Cristal", "Cristen", "Cristi", "Cristie", "Cristin", "Cristina", "Cristine", "Cristionna", "Cristy", "Crysta", "Crystal", "Crystie", "Cthrine", "Cyb", "Cybil", "Cybill", "Cymbre", "Cynde", "Cyndi", "Cyndia", "Cyndie", "Cyndy", "Cynthea", "Cynthia", "Cynthie", "Cynthy", "Dacey", "Dacia", "Dacie", "Dacy", "Dael", "Daffi", "Daffie", "Daffy", "Dagmar", "Dahlia", "Daile", "Daisey", "Daisi", "Daisie", "Daisy", "Dale", "Dalenna", "Dalia", "Dalila", "Dallas", "Daloris", "Damara", "Damaris", "Damita", "Dana", "Danell", "Danella", "Danette", "Dani", "Dania", "Danica", "Danice", "Daniela", "Daniele", "Daniella", "Danielle", "Danika", "Danila", "Danit", "Danita", "Danna", "Danni", "Dannie", "Danny", "Dannye", "Danya", "Danyelle", "Danyette", "Daphene", "Daphna", "Daphne", "Dara", "Darb", "Darbie", "Darby", "Darcee", "Darcey", "Darci", "Darcie", "Darcy", "Darda", "Dareen", "Darell", "Darelle", "Dari", "Daria", "Darice", "Darla", "Darleen", "Darlene", "Darline", "Darlleen", "Daron", "Darrelle", "Darryl", "Darsey", "Darsie", "Darya", "Daryl", "Daryn", "Dasha", "Dasi", "Dasie", "Dasya", "Datha", "Daune", "Daveen", "Daveta", "Davida", "Davina", "Davine", "Davita", "Dawn", "Dawna", "Dayle", "Dayna", "Ddene", "De", "Deana", "Deane", "Deanna", "Deanne", "Deb", "Debbi", "Debbie", "Debby", "Debee", "Debera", "Debi", "Debor", "Debora", "Deborah", "Debra", "Dede", "Dedie", "Dedra", "Dee", "Dee", "Dee", "Deeann", "Deeanne", "Deedee", "Deena", "Deerdre", "Deeyn", "Dehlia", "Deidre", "Deina", "Deirdre", "Del", "Dela", "Delcina", "Delcine", "Delia", "Delila", "Delilah", "Delinda", "Dell", "Della", "Delly", "Delora", "Delores", "Deloria", "Deloris", "Delphine", "Delphinia", "Demeter", "Demetra", "Demetria", "Demetris", "Dena", "Deni", "Denice", "Denise", "Denna", "Denni", "Dennie", "Denny", "Deny", "Denys", "Denyse", "Deonne", "Desdemona", "Desirae", "Desiree", "Desiri", "Deva", "Devan", "Devi", "Devin", "Devina", "Devinne", "Devon", "Devondra", "Devonna", "Devonne", "Devora", "Di", "Diahann", "Dian", "Diana", "Diandra", "Diane", "Diane-Marie", "Dianemarie", "Diann", "Dianna", "Dianne", "Diannne", "Didi", "Dido", "Diena", "Dierdre", "Dina", "Dinah", "Dinnie", "Dinny", "Dion", "Dione", "Dionis", "Dionne", "Dita", "Dix", "Dixie", "Dniren", "Dode", "Dodi", "Dodie", "Dody", "Doe", "Doll", "Dolley", "Dolli", "Dollie", "Dolly", "Dolores", "Dolorita", "Doloritas", "Domeniga", "Dominga", "Domini", "Dominica", "Dominique", "Dona", "Donella", "Donelle", "Donetta", "Donia", "Donica", "Donielle", "Donna", "Donnamarie", "Donni", "Donnie", "Donny", "Dora", "Doralia", "Doralin", "Doralyn", "Doralynn", "Doralynne", "Dore", "Doreen", "Dorelia", "Dorella", "Dorelle", "Dorena", "Dorene", "Doretta", "Dorette", "Dorey", "Dori", "Doria", "Dorian", "Dorice", "Dorie", "Dorine", "Doris", "Dorisa", "Dorise", "Dorita", "Doro", "Dorolice", "Dorolisa", "Dorotea", "Doroteya", "Dorothea", "Dorothee", "Dorothy", "Dorree", "Dorri", "Dorrie", "Dorris", "Dorry", "Dorthea", "Dorthy", "Dory", "Dosi", "Dot", "Doti", "Dotti", "Dottie", "Dotty", "Dre", "Dreddy", "Dredi", "Drona", "Dru", "Druci", "Drucie", "Drucill", "Drucy", "Drusi", "Drusie", "Drusilla", "Drusy", "Dulce", "Dulcea", "Dulci", "Dulcia", "Dulciana", "Dulcie", "Dulcine", "Dulcinea", "Dulcy", "Dulsea", "Dusty", "Dyan", "Dyana", "Dyane", "Dyann", "Dyanna", "Dyanne", "Dyna", "Dynah", "Eachelle", "Eada", "Eadie", "Eadith", "Ealasaid", "Eartha", "Easter", "Eba", "Ebba", "Ebonee", "Ebony", "Eda", "Eddi", "Eddie", "Eddy", "Ede", "Edee", "Edeline", "Eden", "Edi", "Edie", "Edin", "Edita", "Edith", "Editha", "Edithe", "Ediva", "Edna", "Edwina", "Edy", "Edyth", "Edythe", "Effie", "Eileen", "Eilis", "Eimile", "Eirena", "Ekaterina", "Elaina", "Elaine", "Elana", "Elane", "Elayne", "Elberta", "Elbertina", "Elbertine", "Eleanor", "Eleanora", "Eleanore", "Electra", "Eleen", "Elena", "Elene", "Eleni", "Elenore", "Eleonora", "Eleonore", "Elfie", "Elfreda", "Elfrida", "Elfrieda", "Elga", "Elianora", "Elianore", "Elicia", "Elie", "Elinor", "Elinore", "Elisa", "Elisabet", "Elisabeth", "Elisabetta", "Elise", "Elisha", "Elissa", "Elita", "Eliza", "Elizabet", "Elizabeth", "Elka", "Elke", "Ella", "Elladine", "Elle", "Ellen", "Ellene", "Ellette", "Elli", "Ellie", "Ellissa", "Elly", "Ellyn", "Ellynn", "Elmira", "Elna", "Elnora", "Elnore", "Eloisa", "Eloise", "Elonore", "Elora", "Elsa", "Elsbeth", "Else", "Elset", "Elsey", "Elsi", "Elsie", "Elsinore", "Elspeth", "Elsy", "Elva", "Elvera", "Elvina", "Elvira", "Elwira", "Elyn", "Elyse", "Elysee", "Elysha", "Elysia", "Elyssa", "Em", "Ema", "Emalee", "Emalia", "Emelda", "Emelia", "Emelina", "Emeline", "Emelita", "Emelyne", "Emera", "Emilee", "Emili", "Emilia", "Emilie", "Emiline", "Emily", "Emlyn", "Emlynn", "Emlynne", "Emma", "Emmalee", "Emmaline", "Emmalyn", "Emmalynn", "Emmalynne", "Emmeline", "Emmey", "Emmi", "Emmie", "Emmy", "Emmye", "Emogene", "Emyle", "Emylee", "Engracia", "Enid", "Enrica", "Enrichetta", "Enrika", "Enriqueta", "Eolanda", "Eolande", "Eran", "Erda", "Erena", "Erica", "Ericha", "Ericka", "Erika", "Erin", "Erina", "Erinn", "Erinna", "Erma", "Ermengarde", "Ermentrude", "Ermina", "Erminia", "Erminie", "Erna", "Ernaline", "Ernesta", "Ernestine", "Ertha", "Eryn", "Esma", "Esmaria", "Esme", "Esmeralda", "Essa", "Essie", "Essy", "Esta", "Estel", "Estele", "Estell", "Estella", "Estelle", "Ester", "Esther", "Estrella", "Estrellita", "Ethel", "Ethelda", "Ethelin", "Ethelind", "Etheline", "Ethelyn", "Ethyl", "Etta", "Etti", "Ettie", "Etty", "Eudora", "Eugenia", "Eugenie", "Eugine", "Eula", "Eulalie", "Eunice", "Euphemia", "Eustacia", "Eva", "Evaleen", "Evangelia", "Evangelin", "Evangelina", "Evangeline", "Evania", "Evanne", "Eve", "Eveleen", "Evelina", "Eveline", "Evelyn", "Evey", "Evie", "Evita", "Evonne", "Evvie", "Evvy", "Evy", "Eyde", "Eydie", "Ezmeralda", "Fae", "Faina", "Faith", "Fallon", "Fan", "Fanchette", "Fanchon", "Fancie", "Fancy", "Fanechka", "Fania", "Fanni", "Fannie", "Fanny", "Fanya", "Fara", "Farah", "Farand", "Farica", "Farra", "Farrah", "Farrand", "Faun", "Faunie", "Faustina", "Faustine", "Fawn", "Fawne", "Fawnia", "Fay", "Faydra", "Faye", "Fayette", "Fayina", "Fayre", "Fayth", "Faythe", "Federica", "Fedora", "Felecia", "Felicdad", "Felice", "Felicia", "Felicity", "Felicle", "Felipa", "Felisha", "Felita", "Feliza", "Fenelia", "Feodora", "Ferdinanda", "Ferdinande", "Fern", "Fernanda", "Fernande", "Fernandina", "Ferne", "Fey", "Fiann", "Fianna", "Fidela", "Fidelia", "Fidelity", "Fifi", "Fifine", "Filia", "Filide", "Filippa", "Fina", "Fiona", "Fionna", "Fionnula", "Fiorenze", "Fleur", "Fleurette", "Flo", "Flor", "Flora", "Florance", "Flore", "Florella", "Florence", "Florencia", "Florentia", "Florenza", "Florette", "Flori", "Floria", "Florida", "Florie", "Florina", "Florinda", "Floris", "Florri", "Florrie", "Florry", "Flory", "Flossi", "Flossie", "Flossy", "Flss", "Fran", "Francene", "Frances", "Francesca", "Francine", "Francisca", "Franciska", "Francoise", "Francyne", "Frank", "Frankie", "Franky", "Franni", "Frannie", "Franny", "Frayda", "Fred", "Freda", "Freddi", "Freddie", "Freddy", "Fredelia", "Frederica", "Fredericka", "Frederique", "Fredi", "Fredia", "Fredra", "Fredrika", "Freida", "Frieda", "Friederike", "Fulvia", "Gabbey", "Gabbi", "Gabbie", "Gabey", "Gabi", "Gabie", "Gabriel", "Gabriela", "Gabriell", "Gabriella", "Gabrielle", "Gabriellia", "Gabrila", "Gaby", "Gae", "Gael", "Gail", "Gale", "Gale", "Galina", "Garland", "Garnet", "Garnette", "Gates", "Gavra", "Gavrielle", "Gay", "Gaye", "Gayel", "Gayla", "Gayle", "Gayleen", "Gaylene", "Gaynor", "Gelya", "Gena", "Gene", "Geneva", "Genevieve", "Genevra", "Genia", "Genna", "Genni", "Gennie", "Gennifer", "Genny", "Genovera", "Genvieve", "George", "Georgeanna", "Georgeanne", "Georgena", "Georgeta", "Georgetta", "Georgette", "Georgia", "Georgiana", "Georgianna", "Georgianne", "Georgie", "Georgina", "Georgine", "Geralda", "Geraldine", "Gerda", "Gerhardine", "Geri", "Gerianna", "Gerianne", "Gerladina", "Germain", "Germaine", "Germana", "Gerri", "Gerrie", "Gerrilee", "Gerry", "Gert", "Gerta", "Gerti", "Gertie", "Gertrud", "Gertruda", "Gertrude", "Gertrudis", "Gerty", "Giacinta", "Giana", "Gianina", "Gianna", "Gigi", "Gilberta", "Gilberte", "Gilbertina", "Gilbertine", "Gilda", "Gilemette", "Gill", "Gillan", "Gilli", "Gillian", "Gillie", "Gilligan", "Gilly", "Gina", "Ginelle", "Ginevra", "Ginger", "Ginni", "Ginnie", "Ginnifer", "Ginny", "Giorgia", "Giovanna", "Gipsy", "Giralda", "Gisela", "Gisele", "Gisella", "Giselle", "Giuditta", "Giulia", "Giulietta", "Giustina", "Gizela", "Glad", "Gladi", "Gladys", "Gleda", "Glen", "Glenda", "Glenine", "Glenn", "Glenna", "Glennie", "Glennis", "Glori", "Gloria", "Gloriana", "Gloriane", "Glory", "Glyn", "Glynda", "Glynis", "Glynnis", "Gnni", "Godiva", "Golda", "Goldarina", "Goldi", "Goldia", "Goldie", "Goldina", "Goldy", "Grace", "Gracia", "Gracie", "Grata", "Gratia", "Gratiana", "Gray", "Grayce", "Grazia", "Greer", "Greta", "Gretal", "Gretchen", "Grete", "Gretel", "Grethel", "Gretna", "Gretta", "Grier", "Griselda", "Grissel", "Guendolen", "Guenevere", "Guenna", "Guglielma", "Gui", "Guillema", "Guillemette", "Guinevere", "Guinna", "Gunilla", "Gus", "Gusella", "Gussi", "Gussie", "Gussy", "Gusta", "Gusti", "Gustie", "Gusty", "Gwen", "Gwendolen", "Gwendolin", "Gwendolyn", "Gweneth", "Gwenette", "Gwenneth", "Gwenni", "Gwennie", "Gwenny", "Gwenora", "Gwenore", "Gwyn", "Gwyneth", "Gwynne", "Gypsy", "Hadria", "Hailee", "Haily", "Haleigh", "Halette", "Haley", "Hali", "Halie", "Halimeda", "Halley", "Halli", "Hallie", "Hally", "Hana", "Hanna", "Hannah", "Hanni", "Hannie", "Hannis", "Hanny", "Happy", "Harlene", "Harley", "Harli", "Harlie", "Harmonia", "Harmonie", "Harmony", "Harri", "Harrie", "Harriet", "Harriett", "Harrietta", "Harriette", "Harriot", "Harriott", "Hatti", "Hattie", "Hatty", "Hayley", "Hazel", "Heath", "Heather", "Heda", "Hedda", "Heddi", "Heddie", "Hedi", "Hedvig", "Hedvige", "Hedwig", "Hedwiga", "Hedy", "Heida", "Heidi", "Heidie", "Helaina", "Helaine", "Helen", "Helen-Elizabeth", "Helena", "Helene", "Helenka", "Helga", "Helge", "Helli", "Heloise", "Helsa", "Helyn", "Hendrika", "Henka", "Henrie", "Henrieta", "Henrietta", "Henriette", "Henryetta", "Hephzibah", "Hermia", "Hermina", "Hermine", "Herminia", "Hermione", "Herta", "Hertha", "Hester", "Hesther", "Hestia", "Hetti", "Hettie", "Hetty", "Hilary", "Hilda", "Hildagard", "Hildagarde", "Hilde", "Hildegaard", "Hildegarde", "Hildy", "Hillary", "Hilliary", "Hinda", "Holli", "Hollie", "Holly", "Holly-Anne", "Hollyanne", "Honey", "Honor", "Honoria", "Hope", "Horatia", "Hortense", "Hortensia", "Hulda", "Hyacinth", "Hyacintha", "Hyacinthe", "Hyacinthia", "Hyacinthie", "Hynda", "Ianthe", "Ibbie", "Ibby", "Ida", "Idalia", "Idalina", "Idaline", "Idell", "Idelle", "Idette", "Ileana", "Ileane", "Ilene", "Ilise", "Ilka", "Illa", "Ilsa", "Ilse", "Ilysa", "Ilyse", "Ilyssa", "Imelda", "Imogen", "Imogene", "Imojean", "Ina", "Indira", "Ines", "Inesita", "Inessa", "Inez", "Inga", "Ingaberg", "Ingaborg", "Inge", "Ingeberg", "Ingeborg", "Inger", "Ingrid", "Ingunna", "Inna", "Iolande", "Iolanthe", "Iona", "Iormina", "Ira", "Irena", "Irene", "Irina", "Iris", "Irita", "Irma", "Isa", "Isabel", "Isabelita", "Isabella", "Isabelle", "Isadora", "Isahella", "Iseabal", "Isidora", "Isis", "Isobel", "Issi", "Issie", "Issy", "Ivett", "Ivette", "Ivie", "Ivonne", "Ivory", "Ivy", "Izabel", "Jacenta", "Jacinda", "Jacinta", "Jacintha", "Jacinthe", "Jackelyn", "Jacki", "Jackie", "Jacklin", "Jacklyn", "Jackquelin", "Jackqueline", "Jacky", "Jaclin", "Jaclyn", "Jacquelin", "Jacqueline", "Jacquelyn", "Jacquelynn", "Jacquenetta", "Jacquenette", "Jacquetta", "Jacquette", "Jacqui", "Jacquie", "Jacynth", "Jada", "Jade", "Jaime", "Jaimie", "Jaine", "Jami", "Jamie", "Jamima", "Jammie", "Jan", "Jana", "Janaya", "Janaye", "Jandy", "Jane", "Janean", "Janeczka", "Janeen", "Janel", "Janela", "Janella", "Janelle", "Janene", "Janenna", "Janessa", "Janet", "Janeta", "Janetta", "Janette", "Janeva", "Janey", "Jania", "Janice", "Janie", "Janifer", "Janina", "Janine", "Janis", "Janith", "Janka", "Janna", "Jannel", "Jannelle", "Janot", "Jany", "Jaquelin", "Jaquelyn", "Jaquenetta", "Jaquenette", "Jaquith", "Jasmin", "Jasmina", "Jasmine", "Jayme", "Jaymee", "Jayne", "Jaynell", "Jazmin", "Jean", "Jeana", "Jeane", "Jeanelle", "Jeanette", "Jeanie", "Jeanine", "Jeanna", "Jeanne", "Jeannette", "Jeannie", "Jeannine", "Jehanna", "Jelene", "Jemie", "Jemima", "Jemimah", "Jemmie", "Jemmy", "Jen", "Jena", "Jenda", "Jenelle", "Jeni", "Jenica", "Jeniece", "Jenifer", "Jeniffer", "Jenilee", "Jenine", "Jenn", "Jenna", "Jennee", "Jennette", "Jenni", "Jennica", "Jennie", "Jennifer", "Jennilee", "Jennine", "Jenny", "Jeralee", "Jere", "Jeri", "Jermaine", "Jerrie", "Jerrilee", "Jerrilyn", "Jerrine", "Jerry", "Jerrylee", "Jess", "Jessa", "Jessalin", "Jessalyn", "Jessamine", "Jessamyn", "Jesse", "Jesselyn", "Jessi", "Jessica", "Jessie", "Jessika", "Jessy", "Jewel", "Jewell", "Jewelle", "Jill", "Jillana", "Jillane", "Jillayne", "Jilleen", "Jillene", "Jilli", "Jillian", "Jillie", "Jilly", "Jinny", "Jo", "Jo", "Ann", "Jo-Ann", "Jo-Anne", "Joan", "Joana", "Joane", "Joanie", "Joann", "Joanna", "Joanne", "Joannes", "Jobey", "Jobi", "Jobie", "Jobina", "Joby", "Jobye", "Jobyna", "Jocelin", "Joceline", "Jocelyn", "Jocelyne", "Jodee", "Jodi", "Jodie", "Jody", "Joeann", "Joela", "Joelie", "Joell", "Joella", "Joelle", "Joellen", "Joelly", "Joellyn", "Joelynn", "Joete", "Joey", "Johanna", "Johannah", "Johna", "Johnath", "Johnette", "Johnna", "Joice", "Jojo", "Jolee", "Joleen", "Jolene", "Joletta", "Joli", "Jolie", "Joline", "Joly", "Jolyn", "Jolynn", "Jonell", "Joni", "Jonie", "Jonis", "Jordain", "Jordan", "Jordana", "Jordanna", "Jorey", "Jori", "Jorie", "Jorrie", "Jorry", "Joscelin", "Josee", "Josefa", "Josefina", "Josepha", "Josephina", "Josephine", "Josey", "Josi", "Josie", "Josselyn", "Josy", "Jourdan", "Joy", "Joya", "Joyan", "Joyann", "Joyce", "Joycelin", "Joye", "Jsandye", "Juana", "Juanita", "Judi", "Judie", "Judith", "Juditha", "Judy", "Judye", "Juieta", "Julee", "Juli", "Julia", "Juliana", "Juliane", "Juliann", "Julianna", "Julianne", "Julie", "Julienne", "Juliet", "Julieta", "Julietta", "Juliette", "Julina", "Juline", "Julissa", "Julita", "June", "Junette", "Junia", "Junie", "Junina", "Justina", "Justine", "Justinn", "Jyoti", "Kacey", "Kacie", "Kacy", "Kaela", "Kai", "Kaia", "Kaila", "Kaile", "Kailey", "Kaitlin", "Kaitlyn", "Kaitlynn", "Kaja", "Kakalina", "Kala", "Kaleena", "Kali", "Kalie", "Kalila", "Kalina", "Kalinda", "Kalindi", "Kalli", "Kally", "Kameko", "Kamila", "Kamilah", "Kamillah", "Kandace", "Kandy", "Kania", "Kanya", "Kara", "Kara-Lynn", "Karalee", "Karalynn", "Kare", "Karee", "Karel", "Karen", "Karena", "Kari", "Karia", "Karie", "Karil", "Karilynn", "Karin", "Karina", "Karine", "Kariotta", "Karisa", "Karissa", "Karita", "Karla", "Karlee", "Karleen", "Karlen", "Karlene", "Karlie", "Karlotta", "Karlotte", "Karly", "Karlyn", "Karmen", "Karna", "Karol", "Karola", "Karole", "Karolina", "Karoline", "Karoly", "Karon", "Karrah", "Karrie", "Karry", "Kary", "Karyl", "Karylin", "Karyn", "Kasey", "Kass", "Kassandra", "Kassey", "Kassi", "Kassia", "Kassie", "Kat", "Kata", "Katalin", "Kate", "Katee", "Katerina", "Katerine", "Katey", "Kath", "Katha", "Katharina", "Katharine", "Katharyn", "Kathe", "Katherina", "Katherine", "Katheryn", "Kathi", "Kathie", "Kathleen", "Kathlin", "Kathrine", "Kathryn", "Kathryne", "Kathy", "Kathye", "Kati", "Katie", "Katina", "Katine", "Katinka", "Katleen", "Katlin", "Katrina", "Katrine", "Katrinka", "Katti", "Kattie", "Katuscha", "Katusha", "Katy", "Katya", "Kay", "Kaycee", "Kaye", "Kayla", "Kayle", "Kaylee", "Kayley", "Kaylil", "Kaylyn", "Keeley", "Keelia", "Keely", "Kelcey", "Kelci", "Kelcie", "Kelcy", "Kelila", "Kellen", "Kelley", "Kelli", "Kellia", "Kellie", "Kellina", "Kellsie", "Kelly", "Kellyann", "Kelsey", "Kelsi", "Kelsy", "Kendra", "Kendre", "Kenna", "Keri", "Keriann", "Kerianne", "Kerri", "Kerrie", "Kerrill", "Kerrin", "Kerry", "Kerstin", "Kesley", "Keslie", "Kessia", "Kessiah", "Ketti", "Kettie", "Ketty", "Kevina", "Kevyn", "Ki", "Kiah", "Kial", "Kiele", "Kiersten", "Kikelia", "Kiley", "Kim", "Kimberlee", "Kimberley", "Kimberli", "Kimberly", "Kimberlyn", "Kimbra", "Kimmi", "Kimmie", "Kimmy", "Kinna", "Kip", "Kipp", "Kippie", "Kippy", "Kira", "Kirbee", "Kirbie", "Kirby", "Kiri", "Kirsten", "Kirsteni", "Kirsti", "Kirstin", "Kirstyn", "Kissee", "Kissiah", "Kissie", "Kit", "Kitti", "Kittie", "Kitty", "Kizzee", "Kizzie", "Klara", "Klarika", "Klarrisa", "Konstance", "Konstanze", "Koo", "Kora", "Koral", "Koralle", "Kordula", "Kore", "Korella", "Koren", "Koressa", "Kori", "Korie", "Korney", "Korrie", "Korry", "Kris", "Krissie", "Krissy", "Krista", "Kristal", "Kristan", "Kriste", "Kristel", "Kristen", "Kristi", "Kristien", "Kristin", "Kristina", "Kristine", "Kristy", "Kristyn", "Krysta", "Krystal", "Krystalle", "Krystle", "Krystyna", "Kyla", "Kyle", "Kylen", "Kylie", "Kylila", "Kylynn", "Kym", "Kynthia", "Kyrstin", "La", "Verne", "Lacee", "Lacey", "Lacie", "Lacy", "Ladonna", "Laetitia", "Laina", "Lainey", "Lana", "Lanae", "Lane", "Lanette", "Laney", "Lani", "Lanie", "Lanita", "Lanna", "Lanni", "Lanny", "Lara", "Laraine", "Lari", "Larina", "Larine", "Larisa", "Larissa", "Lark", "Laryssa", "Latashia", "Latia", "Latisha", "Latrena", "Latrina", "Laura", "Lauraine", "Laural", "Lauralee", "Laure", "Lauree", "Laureen", "Laurel", "Laurella", "Lauren", "Laurena", "Laurene", "Lauretta", "Laurette", "Lauri", "Laurianne", "Laurice", "Laurie", "Lauryn", "Lavena", "Laverna", "Laverne", "Lavina", "Lavinia", "Lavinie", "Layla", "Layne", "Layney", "Lea", "Leah", "Leandra", "Leann", "Leanna", "Leanor", "Leanora", "Lebbie", "Leda", "Lee", "Leeann", "Leeanne", "Leela", "Leelah", "Leena", "Leesa", "Leese", "Legra", "Leia", "Leigh", "Leigha", "Leila", "Leilah", "Leisha", "Lela", "Lelah", "Leland", "Lelia", "Lena", "Lenee", "Lenette", "Lenka", "Lenna", "Lenora", "Lenore", "Leodora", "Leoine", "Leola", "Leoline", "Leona", "Leonanie", "Leone", "Leonelle", "Leonie", "Leonora", "Leonore", "Leontine", "Leontyne", "Leora", "Leshia", "Lesley", "Lesli", "Leslie", "Lesly", "Lesya", "Leta", "Lethia", "Leticia", "Letisha", "Letitia", "Letizia", "Letta", "Letti", "Lettie", "Letty", "Lexi", "Lexie", "Lexine", "Lexis", "Lexy", "Leyla", "Lezlie", "Lia", "Lian", "Liana", "Liane", "Lianna", "Lianne", "Lib", "Libbey", "Libbi", "Libbie", "Libby", "Licha", "Lida", "Lidia", "Liesa", "Lil", "Lila", "Lilah", "Lilas", "Lilia", "Lilian", "Liliane", "Lilias", "Lilith", "Lilla", "Lilli", "Lillian", "Lillis", "Lilllie", "Lilly", "Lily", "Lilyan", "Lin", "Lina", "Lind", "Linda", "Lindi", "Lindie", "Lindsay", "Lindsey", "Lindsy", "Lindy", "Linea", "Linell", "Linet", "Linette", "Linn", "Linnea", "Linnell", "Linnet", "Linnie", "Linzy", "Lira", "Lisa", "Lisabeth", "Lisbeth", "Lise", "Lisetta", "Lisette", "Lisha", "Lishe", "Lissa", "Lissi", "Lissie", "Lissy", "Lita", "Liuka", "Liv", "Liva", "Livia", "Livvie", "Livvy", "Livvyy", "Livy", "Liz", "Liza", "Lizabeth", "Lizbeth", "Lizette", "Lizzie", "Lizzy", "Loella", "Lois", "Loise", "Lola", "Loleta", "Lolita", "Lolly", "Lona", "Lonee", "Loni", "Lonna", "Lonni", "Lonnie", "Lora", "Lorain", "Loraine", "Loralee", "Loralie", "Loralyn", "Loree", "Loreen", "Lorelei", "Lorelle", "Loren", "Lorena", "Lorene", "Lorenza", "Loretta", "Lorette", "Lori", "Loria", "Lorianna", "Lorianne", "Lorie", "Lorilee", "Lorilyn", "Lorinda", "Lorine", "Lorita", "Lorna", "Lorne", "Lorraine", "Lorrayne", "Lorri", "Lorrie", "Lorrin", "Lorry", "Lory", "Lotta", "Lotte", "Lotti", "Lottie", "Lotty", "Lou", "Louella", "Louisa", "Louise", "Louisette", "Loutitia", "Lu", "Luce", "Luci", "Lucia", "Luciana", "Lucie", "Lucienne", "Lucila", "Lucilia", "Lucille", "Lucina", "Lucinda", "Lucine", "Lucita", "Lucky", "Lucretia", "Lucy", "Ludovika", "Luella", "Luelle", "Luisa", "Luise", "Lula", "Lulita", "Lulu", "Lura", "Lurette", "Lurleen", "Lurlene", "Lurline", "Lusa", "Luz", "Lyda", "Lydia", "Lydie", "Lyn", "Lynda", "Lynde", "Lyndel", "Lyndell", "Lyndsay", "Lyndsey", "Lyndsie", "Lyndy", "Lynea", "Lynelle", "Lynett", "Lynette", "Lynn", "Lynna", "Lynne", "Lynnea", "Lynnell", "Lynnelle", "Lynnet", "Lynnett", "Lynnette", "Lynsey", "Lyssa", "Mab", "Mabel", "Mabelle", "Mable", "Mada", "Madalena", "Madalyn", "Maddalena", "Maddi", "Maddie", "Maddy", "Madel", "Madelaine", "Madeleine", "Madelena", "Madelene", "Madelin", "Madelina", "Madeline", "Madella", "Madelle", "Madelon", "Madelyn", "Madge", "Madlen", "Madlin", "Madonna", "Mady", "Mae", "Maegan", "Mag", "Magda", "Magdaia", "Magdalen", "Magdalena", "Magdalene", "Maggee", "Maggi", "Maggie", "Maggy", "Mahala", "Mahalia", "Maia", "Maible", "Maiga", "Maighdiln", "Mair", "Maire", "Maisey", "Maisie", "Maitilde", "Mala", "Malanie", "Malena", "Malia", "Malina", "Malinda", "Malinde", "Malissa", "Malissia", "Mallissa", "Mallorie", "Mallory", "Malorie", "Malory", "Malva", "Malvina", "Malynda", "Mame", "Mamie", "Manda", "Mandi", "Mandie", "Mandy", "Manon", "Manya", "Mara", "Marabel", "Marcela", "Marcelia", "Marcella", "Marcelle", "Marcellina", "Marcelline", "Marchelle", "Marci", "Marcia", "Marcie", "Marcile", "Marcille", "Marcy", "Mareah", "Maren", "Marena", "Maressa", "Marga", "Margalit", "Margalo", "Margaret", "Margareta", "Margarete", "Margaretha", "Margarethe", "Margaretta", "Margarette", "Margarita", "Margaux", "Marge", "Margeaux", "Margery", "Marget", "Margette", "Margi", "Margie", "Margit", "Margo", "Margot", "Margret", "Marguerite", "Margy", "Mari", "Maria", "Mariam", "Marian", "Mariana", "Mariann", "Marianna", "Marianne", "Maribel", "Maribelle", "Maribeth", "Marice", "Maridel", "Marie", "Marie-Ann", "Marie-Jeanne", "Marieann", "Mariejeanne", "Mariel", "Mariele", "Marielle", "Mariellen", "Marietta", "Mariette", "Marigold", "Marijo", "Marika", "Marilee", "Marilin", "Marillin", "Marilyn", "Marin", "Marina", "Marinna", "Marion", "Mariquilla", "Maris", "Marisa", "Mariska", "Marissa", "Marita", "Maritsa", "Mariya", "Marj", "Marja", "Marje", "Marji", "Marjie", "Marjorie", "Marjory", "Marjy", "Marketa", "Marla", "Marlane", "Marleah", "Marlee", "Marleen", "Marlena", "Marlene", "Marley", "Marlie", "Marline", "Marlo", "Marlyn", "Marna", "Marne", "Marney", "Marni", "Marnia", "Marnie", "Marquita", "Marrilee", "Marris", "Marrissa", "Marsha", "Marsiella", "Marta", "Martelle", "Martguerita", "Martha", "Marthe", "Marthena", "Marti", "Martica", "Martie", "Martina", "Martita", "Marty", "Martynne", "Mary", "Marya", "Maryann", "Maryanna", "Maryanne", "Marybelle", "Marybeth", "Maryellen", "Maryjane", "Maryjo", "Maryl", "Marylee", "Marylin", "Marylinda", "Marylou", "Marylynne", "Maryrose", "Marys", "Marysa", "Masha", "Matelda", "Mathilda", "Mathilde", "Matilda", "Matilde", "Matti", "Mattie", "Matty", "Maud", "Maude", "Maudie", "Maura", "Maure", "Maureen", "Maureene", "Maurene", "Maurine", "Maurise", "Maurita", "Maurizia", "Mavis", "Mavra", "Max", "Maxi", "Maxie", "Maxine", "Maxy", "May", "Maybelle", "Maye", "Mead", "Meade", "Meagan", "Meaghan", "Meara", "Mechelle", "Meg", "Megan", "Megen", "Meggi", "Meggie", "Meggy", "Meghan", "Meghann", "Mehetabel", "Mei", "Mel", "Mela", "Melamie", "Melania", "Melanie", "Melantha", "Melany", "Melba", "Melesa", "Melessa", "Melicent", "Melina", "Melinda", "Melinde", "Melisa", "Melisande", "Melisandra", "Melisenda", "Melisent", "Melissa", "Melisse", "Melita", "Melitta", "Mella", "Melli", "Mellicent", "Mellie", "Mellisa", "Mellisent", "Melloney", "Melly", "Melodee", "Melodie", "Melody", "Melonie", "Melony", "Melosa", "Melva", "Mercedes", "Merci", "Mercie", "Mercy", "Meredith", "Meredithe", "Meridel", "Meridith", "Meriel", "Merilee", "Merilyn", "Meris", "Merissa", "Merl", "Merla", "Merle", "Merlina", "Merline", "Merna", "Merola", "Merralee", "Merridie", "Merrie", "Merrielle", "Merrile", "Merrilee", "Merrili", "Merrill", "Merrily", "Merry", "Mersey", "Meryl", "Meta", "Mia", "Micaela", "Michaela", "Michaelina", "Michaeline", "Michaella", "Michal", "Michel", "Michele", "Michelina", "Micheline", "Michell", "Michelle", "Micki", "Mickie", "Micky", "Midge", "Mignon", "Mignonne", "Miguela", "Miguelita", "Mikaela", "Mil", "Mildred", "Mildrid", "Milena", "Milicent", "Milissent", "Milka", "Milli", "Millicent", "Millie", "Millisent", "Milly", "Milzie", "Mimi", "Min", "Mina", "Minda", "Mindy", "Minerva", "Minetta", "Minette", "Minna", "Minnaminnie", "Minne", "Minni", "Minnie", "Minnnie", "Minny", "Minta", "Miof", "Mela", "Miquela", "Mira", "Mirabel", "Mirabella", "Mirabelle", "Miran", "Miranda", "Mireielle", "Mireille", "Mirella", "Mirelle", "Miriam", "Mirilla", "Mirna", "Misha", "Missie", "Missy", "Misti", "Misty", "Mitzi", "Modesta", "Modestia", "Modestine", "Modesty", "Moina", "Moira", "Moll", "Mollee", "Molli", "Mollie", "Molly", "Mommy", "Mona", "Monah", "Monica", "Monika", "Monique", "Mora", "Moreen", "Morena", "Morgan", "Morgana", "Morganica", "Morganne", "Morgen", "Moria", "Morissa", "Morna", "Moselle", "Moyna", "Moyra", "Mozelle", "Muffin", "Mufi", "Mufinella", "Muire", "Mureil", "Murial", "Muriel", "Murielle", "Myra", "Myrah", "Myranda", "Myriam", "Myrilla", "Myrle", "Myrlene", "Myrna", "Myrta", "Myrtia", "Myrtice", "Myrtie", "Myrtle", "Nada", "Nadean", "Nadeen", "Nadia", "Nadine", "Nadiya", "Nady", "Nadya", "Nalani", "Nan", "Nana", "Nananne", "Nance", "Nancee", "Nancey", "Nanci", "Nancie", "Nancy", "Nanete", "Nanette", "Nani", "Nanice", "Nanine", "Nannette", "Nanni", "Nannie", "Nanny", "Nanon", "Naoma", "Naomi", "Nara", "Nari", "Nariko", "Nat", "Nata", "Natala", "Natalee", "Natalie", "Natalina", "Nataline", "Natalya", "Natasha", "Natassia", "Nathalia", "Nathalie", "Natividad", "Natka", "Natty", "Neala", "Neda", "Nedda", "Nedi", "Neely", "Neila", "Neile", "Neilla", "Neille", "Nelia", "Nelie", "Nell", "Nelle", "Nelli", "Nellie", "Nelly", "Nerissa", "Nerita", "Nert", "Nerta", "Nerte", "Nerti", "Nertie", "Nerty", "Nessa", "Nessi", "Nessie", "Nessy", "Nesta", "Netta", "Netti", "Nettie", "Nettle", "Netty", "Nevsa", "Neysa", "Nichol", "Nichole", "Nicholle", "Nicki", "Nickie", "Nicky", "Nicol", "Nicola", "Nicole", "Nicolea", "Nicolette", "Nicoli", "Nicolina", "Nicoline", "Nicolle", "Nikaniki", "Nike", "Niki", "Nikki", "Nikkie", "Nikoletta", "Nikolia", "Nina", "Ninetta", "Ninette", "Ninnetta", "Ninnette", "Ninon", "Nissa", "Nisse", "Nissie", "Nissy", "Nita", "Nixie", "Noami", "Noel", "Noelani", "Noell", "Noella", "Noelle", "Noellyn", "Noelyn", "Noemi", "Nola", "Nolana", "Nolie", "Nollie", "Nomi", "Nona", "Nonah", "Noni", "Nonie", "Nonna", "Nonnah", "Nora", "Norah", "Norean", "Noreen", "Norene", "Norina", "Norine", "Norma", "Norri", "Norrie", "Norry", "Novelia", "Nydia", "Nyssa", "Octavia", "Odele", "Odelia", "Odelinda", "Odella", "Odelle", "Odessa", "Odetta", "Odette", "Odilia", "Odille", "Ofelia", "Ofella", "Ofilia", "Ola", "Olenka", "Olga", "Olia", "Olimpia", "Olive", "Olivette", "Olivia", "Olivie", "Oliy", "Ollie", "Olly", "Olva", "Olwen", "Olympe", "Olympia", "Olympie", "Ondrea", "Oneida", "Onida", "Oona", "Opal", "Opalina", "Opaline", "Ophelia", "Ophelie", "Ora", "Oralee", "Oralia", "Oralie", "Oralla", "Oralle", "Orel", "Orelee", "Orelia", "Orelie", "Orella", "Orelle", "Oriana", "Orly", "Orsa", "Orsola", "Ortensia", "Otha", "Othelia", "Othella", "Othilia", "Othilie", "Ottilie", "Page", "Paige", "Paloma", "Pam", "Pamela", "Pamelina", "Pamella", "Pammi", "Pammie", "Pammy", "Pandora", "Pansie", "Pansy", "Paola", "Paolina", "Papagena", "Pat", "Patience", "Patrica", "Patrice", "Patricia", "Patrizia", "Patsy", "Patti", "Pattie", "Patty", "Paula", "Paule", "Pauletta", "Paulette", "Pauli", "Paulie", "Paulina", "Pauline", "Paulita", "Pauly", "Pavia", "Pavla", "Pearl", "Pearla", "Pearle", "Pearline", "Peg", "Pegeen", "Peggi", "Peggie", "Peggy", "Pen", "Penelopa", "Penelope", "Penni", "Pennie", "Penny", "Pepi", "Pepita", "Peri", "Peria", "Perl", "Perla", "Perle", "Perri", "Perrine", "Perry", "Persis", "Pet", "Peta", "Petra", "Petrina", "Petronella", "Petronia", "Petronilla", "Petronille", "Petunia", "Phaedra", "Phaidra", "Phebe", "Phedra", "Phelia", "Phil", "Philipa", "Philippa", "Philippe", "Philippine", "Philis", "Phillida", "Phillie", "Phillis", "Philly", "Philomena", "Phoebe", "Phylis", "Phyllida", "Phyllis", "Phyllys", "Phylys", "Pia", "Pier", "Pierette", "Pierrette", "Pietra", "Piper", "Pippa", "Pippy", "Polly", "Pollyanna", "Pooh", "Poppy", "Portia", "Pris", "Prisca", "Priscella", "Priscilla", "Prissie", "Pru", "Prudence", "Prudi", "Prudy", "Prue", "Queenie", "Quentin", "Querida", "Quinn", "Quinta", "Quintana", "Quintilla", "Quintina", "Rachael", "Rachel", "Rachele", "Rachelle", "Rae", "Raeann", "Raf", "Rafa", "Rafaela", "Rafaelia", "Rafaelita", "Rahal", "Rahel", "Raina", "Raine", "Rakel", "Ralina", "Ramona", "Ramonda", "Rana", "Randa", "Randee", "Randene", "Randi", "Randie", "Randy", "Ranee", "Rani", "Rania", "Ranice", "Ranique", "Ranna", "Raphaela", "Raquel", "Raquela", "Rasia", "Rasla", "Raven", "Ray", "Raychel", "Raye", "Rayna", "Raynell", "Rayshell", "Rea", "Reba", "Rebbecca", "Rebe", "Rebeca", "Rebecca", "Rebecka", "Rebeka", "Rebekah", "Rebekkah", "Ree", "Reeba", "Reena", "Reeta", "Reeva", "Regan", "Reggi", "Reggie", "Regina", "Regine", "Reiko", "Reina", "Reine", "Remy", "Rena", "Renae", "Renata", "Renate", "Rene", "Renee", "Renell", "Renelle", "Renie", "Rennie", "Reta", "Retha", "Revkah", "Rey", "Reyna", "Rhea", "Rheba", "Rheta", "Rhetta", "Rhiamon", "Rhianna", "Rhianon", "Rhoda", "Rhodia", "Rhodie", "Rhody", "Rhona", "Rhonda", "Riane", "Riannon", "Rianon", "Rica", "Ricca", "Rici", "Ricki", "Rickie", "Ricky", "Riki", "Rikki", "Rina", "Risa", "Rita", "Riva", "Rivalee", "Rivi", "Rivkah", "Rivy", "Roana", "Roanna", "Roanne", "Robbi", "Robbie", "Robbin", "Robby", "Robbyn", "Robena", "Robenia", "Roberta", "Robin", "Robina", "Robinet", "Robinett", "Robinetta", "Robinette", "Robinia", "Roby", "Robyn", "Roch", "Rochell", "Rochella", "Rochelle", "Rochette", "Roda", "Rodi", "Rodie", "Rodina", "Rois", "Romola", "Romona", "Romonda", "Romy", "Rona", "Ronalda", "Ronda", "Ronica", "Ronna", "Ronni", "Ronnica", "Ronnie", "Ronny", "Roobbie", "Rora", "Rori", "Rorie", "Rory", "Ros", "Rosa", "Rosabel", "Rosabella", "Rosabelle", "Rosaleen", "Rosalia", "Rosalie", "Rosalind", "Rosalinda", "Rosalinde", "Rosaline", "Rosalyn", "Rosalynd", "Rosamond", "Rosamund", "Rosana", "Rosanna", "Rosanne", "Rose", "Roseann", "Roseanna", "Roseanne", "Roselia", "Roselin", "Roseline", "Rosella", "Roselle", "Rosemaria", "Rosemarie", "Rosemary", "Rosemonde", "Rosene", "Rosetta", "Rosette", "Roshelle", "Rosie", "Rosina", "Rosita", "Roslyn", "Rosmunda", "Rosy", "Row", "Rowe", "Rowena", "Roxana", "Roxane", "Roxanna", "Roxanne", "Roxi", "Roxie", "Roxine", "Roxy", "Roz", "Rozalie", "Rozalin", "Rozamond", "Rozanna", "Rozanne", "Roze", "Rozele", "Rozella", "Rozelle", "Rozina", "Rubetta", "Rubi", "Rubia", "Rubie", "Rubina", "Ruby", "Ruperta", "Ruth", "Ruthann", "Ruthanne", "Ruthe", "Ruthi", "Ruthie", "Ruthy", "Ryann", "Rycca", "Saba", "Sabina", "Sabine", "Sabra", "Sabrina", "Sacha", "Sada", "Sadella", "Sadie", "Sadye", "Saidee", "Sal", "Salaidh", "Sallee", "Salli", "Sallie", "Sally", "Sallyann", "Sallyanne", "Saloma", "Salome", "Salomi", "Sam", "Samantha", "Samara", "Samaria", "Sammy", "Sande", "Sandi", "Sandie", "Sandra", "Sandy", "Sandye", "Sapphira", "Sapphire", "Sara", "Sara-Ann", "Saraann", "Sarah", "Sarajane", "Saree", "Sarena", "Sarene", "Sarette", "Sari", "Sarina", "Sarine", "Sarita", "Sascha", "Sasha", "Sashenka", "Saudra", "Saundra", "Savina", "Sayre", "Scarlet", "Scarlett", "Sean", "Seana", "Seka", "Sela", "Selena", "Selene", "Selestina", "Selia", "Selie", "Selina", "Selinda", "Seline", "Sella", "Selle", "Selma", "Sena", "Sephira", "Serena", "Serene", "Shae", "Shaina", "Shaine", "Shalna", "Shalne", "Shana", "Shanda", "Shandee", "Shandeigh", "Shandie", "Shandra", "Shandy", "Shane", "Shani", "Shanie", "Shanna", "Shannah", "Shannen", "Shannon", "Shanon", "Shanta", "Shantee", "Shara", "Sharai", "Shari", "Sharia", "Sharity", "Sharl", "Sharla", "Sharleen", "Sharlene", "Sharline", "Sharon", "Sharona", "Sharron", "Sharyl", "Shaun", "Shauna", "Shawn", "Shawna", "Shawnee", "Shay", "Shayla", "Shaylah", "Shaylyn", "Shaylynn", "Shayna", "Shayne", "Shea", "Sheba", "Sheela", "Sheelagh", "Sheelah", "Sheena", "Sheeree", "Sheila", "Sheila-Kathryn", "Sheilah", "Shel", "Shela", "Shelagh", "Shelba", "Shelbi", "Shelby", "Shelia", "Shell", "Shelley", "Shelli", "Shellie", "Shelly", "Shena", "Sher", "Sheree", "Sheri", "Sherie", "Sherill", "Sherilyn", "Sherline", "Sherri", "Sherrie", "Sherry", "Sherye", "Sheryl", "Shina", "Shir", "Shirl", "Shirlee", "Shirleen", "Shirlene", "Shirley", "Shirline", "Shoshana", "Shoshanna", "Siana", "Sianna", "Sib", "Sibbie", "Sibby", "Sibeal", "Sibel", "Sibella", "Sibelle", "Sibilla", "Sibley", "Sibyl", "Sibylla", "Sibylle", "Sidoney", "Sidonia", "Sidonnie", "Sigrid", "Sile", "Sileas", "Silva", "Silvana", "Silvia", "Silvie", "Simona", "Simone", "Simonette", "Simonne", "Sindee", "Siobhan", "Sioux", "Siouxie", "Sisely", "Sisile", "Sissie", "Sissy", "Siusan", "Sofia", "Sofie", "Sondra", "Sonia", "Sonja", "Sonni", "Sonnie", "Sonnnie", "Sonny", "Sonya", "Sophey", "Sophi", "Sophia", "Sophie", "Sophronia", "Sorcha", "Sosanna", "Stace", "Stacee", "Stacey", "Staci", "Stacia", "Stacie", "Stacy", "Stafani", "Star", "Starla", "Starlene", "Starlin", "Starr", "Stefa", "Stefania", "Stefanie", "Steffane", "Steffi", "Steffie", "Stella", "Stepha", "Stephana", "Stephani", "Stephanie", "Stephannie", "Stephenie", "Stephi", "Stephie", "Stephine", "Stesha", "Stevana", "Stevena", "Stoddard", "Storm", "Stormi", "Stormie", "Stormy", "Sue", "Suellen", "Sukey", "Suki", "Sula", "Sunny", "Sunshine", "Susan", "Susana", "Susanetta", "Susann", "Susanna", "Susannah", "Susanne", "Susette", "Susi", "Susie", "Susy", "Suzann", "Suzanna", "Suzanne", "Suzette", "Suzi", "Suzie", "Suzy", "Sybil", "Sybila", "Sybilla", "Sybille", "Sybyl", "Sydel", "Sydelle", "Sydney", "Sylvia", "Tabatha", "Tabbatha", "Tabbi", "Tabbie", "Tabbitha", "Tabby", "Tabina", "Tabitha", "Taffy", "Talia", "Tallia", "Tallie", "Tallou", "Tallulah", "Tally", "Talya", "Talyah", "Tamar", "Tamara", "Tamarah", "Tamarra", "Tamera", "Tami", "Tamiko", "Tamma", "Tammara", "Tammi", "Tammie", "Tammy", "Tamqrah", "Tamra", "Tana", "Tandi", "Tandie", "Tandy", "Tanhya", "Tani", "Tania", "Tanitansy", "Tansy", "Tanya", "Tara", "Tarah", "Tarra", "Tarrah", "Taryn", "Tasha", "Tasia", "Tate", "Tatiana", "Tatiania", "Tatum", "Tawnya", "Tawsha", "Ted", "Tedda", "Teddi", "Teddie", "Teddy", "Tedi", "Tedra", "Teena", "TEirtza", "Teodora", "Tera", "Teresa", "Terese", "Teresina", "Teresita", "Teressa", "Teri", "Teriann", "Terra", "Terri", "Terrie", "Terrijo", "Terry", "Terrye", "Tersina", "Terza", "Tess", "Tessa", "Tessi", "Tessie", "Tessy", "Thalia", "Thea", "Theadora", "Theda", "Thekla", "Thelma", "Theo", "Theodora", "Theodosia", "Theresa", "Therese", "Theresina", "Theresita", "Theressa", "Therine", "Thia", "Thomasa", "Thomasin", "Thomasina", "Thomasine", "Tiena", "Tierney", "Tiertza", "Tiff", "Tiffani", "Tiffanie", "Tiffany", "Tiffi", "Tiffie", "Tiffy", "Tilda", "Tildi", "Tildie", "Tildy", "Tillie", "Tilly", "Tim", "Timi", "Timmi", "Timmie", "Timmy", "Timothea", "Tina", "Tine", "Tiphani", "Tiphanie", "Tiphany", "Tish", "Tisha", "Tobe", "Tobey", "Tobi", "Toby", "Tobye", "Toinette", "Toma", "Tomasina", "Tomasine", "Tomi", "Tommi", "Tommie", "Tommy", "Toni", "Tonia", "Tonie", "Tony", "Tonya", "Tonye", "Tootsie", "Torey", "Tori", "Torie", "Torrie", "Tory", "Tova", "Tove", "Tracee", "Tracey", "Traci", "Tracie", "Tracy", "Trenna", "Tresa", "Trescha", "Tressa", "Tricia", "Trina", "Trish", "Trisha", "Trista", "Trix", "Trixi", "Trixie", "Trixy", "Truda", "Trude", "Trudey", "Trudi", "Trudie", "Trudy", "Trula", "Tuesday", "Twila", "Twyla", "Tybi", "Tybie", "Tyne", "Ula", "Ulla", "Ulrica", "Ulrika", "Ulrikaumeko", "Ulrike", "Umeko", "Una", "Ursa", "Ursala", "Ursola", "Ursula", "Ursulina", "Ursuline", "Uta", "Val", "Valaree", "Valaria", "Vale", "Valeda", "Valencia", "Valene", "Valenka", "Valentia", "Valentina", "Valentine", "Valera", "Valeria", "Valerie", "Valery", "Valerye", "Valida", "Valina", "Valli", "Vallie", "Vally", "Valma", "Valry", "Van", "Vanda", "Vanessa", "Vania", "Vanna", "Vanni", "Vannie", "Vanny", "Vanya", "Veda", "Velma", "Velvet", "Venita", "Venus", "Vera", "Veradis", "Vere", "Verena", "Verene", "Veriee", "Verile", "Verina", "Verine", "Verla", "Verna", "Vernice", "Veronica", "Veronika", "Veronike", "Veronique", "Vevay", "Vi", "Vicki", "Vickie", "Vicky", "Victoria", "Vida", "Viki", "Vikki", "Vikky", "Vilhelmina", "Vilma", "Vin", "Vina", "Vinita", "Vinni", "Vinnie", "Vinny", "Viola", "Violante", "Viole", "Violet", "Violetta", "Violette", "Virgie", "Virgina", "Virginia", "Virginie", "Vita", "Vitia", "Vitoria", "Vittoria", "Viv", "Viva", "Vivi", "Vivia", "Vivian", "Viviana", "Vivianna", "Vivianne", "Vivie", "Vivien", "Viviene", "Vivienne", "Viviyan", "Vivyan", "Vivyanne", "Vonni", "Vonnie", "Vonny", "Vyky", "Wallie", "Wallis", "Walliw", "Wally", "Waly", "Wanda", "Wandie", "Wandis", "Waneta", "Wanids", "Wenda", "Wendeline", "Wendi", "Wendie", "Wendy", "Wendye", "Wenona", "Wenonah", "Whitney", "Wileen", "Wilhelmina", "Wilhelmine", "Wilie", "Willa", "Willabella", "Willamina", "Willetta", "Willette", "Willi", "Willie", "Willow", "Willy", "Willyt", "Wilma", "Wilmette", "Wilona", "Wilone", "Wilow", "Windy", "Wini", "Winifred", "Winna", "Winnah", "Winne", "Winni", "Winnie", "Winnifred", "Winny", "Winona", "Winonah", "Wren", "Wrennie", "Wylma", "Wynn", "Wynne", "Wynnie", "Wynny", "Xaviera", "Xena", "Xenia", "Xylia", "Xylina", "Yalonda", "Yasmeen", "Yasmin", "Yelena", "Yetta", "Yettie", "Yetty", "Yevette", "Ynes", "Ynez", "Yoko", "Yolanda", "Yolande", "Yolane", "Yolanthe", "Yoshi", "Yoshiko", "Yovonnda", "Ysabel", "Yvette", "Yvonne", "Zabrina", "Zahara", "Zandra", "Zaneta", "Zara", "Zarah", "Zaria", "Zarla", "Zea", "Zelda", "Zelma", "Zena", "Zenia", "Zia", "Zilvia", "Zita", "Zitella", "Zoe", "Zola", "Zonda", "Zondra", "Zonnya", "Zora", "Zorah", "Zorana", "Zorina", "Zorine", "Zsa", "Zsa", "Zsazsa", "Zulema", "Zuzana"];

// packages/core/src/patterns/personal.ts
var lastNamesModule = __toESM(require_dist(), 1);
var maleNames = dataset_default || [];
var femaleNames = dataset_default2 || [];
var lastNames = lastNamesModule.all || [];

class EmailPattern extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    super("email", regex, strategy, enabled);
  }
}

class PhonePattern extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?<![A-Za-z0-9])(?:\+?1[-.\s]?)?(?:\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\)|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?[A-Za-z]{7}|\d{3}[-.\s]?[A-Za-z]{3}[-.\s]?[A-Za-z]{4})(?![A-Za-z0-9])/;
    super("phone", regex, strategy, enabled);
  }
}

class SSNPattern extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /\b\d{3}-\d{2}-\d{4}\b/;
    super("ssn", regex, strategy, enabled);
  }
}

class NamePattern extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const allFirstNames = [...maleNames, ...femaleNames];
    const allNames = [...allFirstNames, ...lastNames];
    const escapedNames = allNames.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    escapedNames.sort((a, b) => b.length - a.length);
    const namesPattern = escapedNames.join("|");
    const regex = new RegExp(`\\b(?:${namesPattern})(?:\\s+(?:${namesPattern}))?\\b`, "i");
    super("name", regex, strategy, enabled);
  }
}
// packages/core/src/patterns/financial.ts
class CreditCardPattern extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?<!\d)(?:\d{4}[-\s]?){3,4}\d{1,4}(?!\d)|(?<!\d)\d{13,19}(?!\d)/;
    super("creditCard", regex, strategy, enabled);
  }
}

class CreditCardLast4Pattern extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?:(?:card|payment|account)\s+)?(?:ending\s+in\s+|ends\s+in\s+|last\s+(?:4|four)(?:\s+digits)?[\s:]+)\d{4}(?!\d)|(?:\*{4,})\d{4}(?!\d)/i;
    super("creditCardLast4", regex, strategy, enabled);
  }
}
// packages/core/src/patterns/business.ts
class TicketNumberPattern extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?:ticket|case)\s*[#:-]?\s*\d+/i;
    super("ticketNumber", regex, strategy, enabled);
  }
}
// packages/core/src/strategies/base.ts
class RedactionContext {
  valueMap = new Map;
  counters = new Map;
  getOrCreateRedaction(value, type, strategy) {
    const key = `${type}:${value}`;
    if (this.valueMap.has(key)) {
      return this.valueMap.get(key);
    }
    const counter = (this.counters.get(type) || 0) + 1;
    this.counters.set(type, counter);
    const redacted = strategy.redact(value, type, counter);
    this.valueMap.set(key, redacted);
    return redacted;
  }
  getMapping() {
    const mapping = {};
    this.valueMap.forEach((redacted, key) => {
      const [, original] = key.split(":", 2);
      mapping[original] = redacted;
    });
    return mapping;
  }
  clear() {
    this.valueMap.clear();
    this.counters.clear();
  }
}
// packages/core/src/strategies/token.ts
class TokenStrategy {
  tokenFormat;
  constructor(formatOptions) {
    this.tokenFormat = formatOptions?.tokenFormat || "[{TYPE}_{INDEX}]";
  }
  redact(value, type, counter) {
    const typeUpper = type.toUpperCase().replace(/([A-Z])/g, "_$1").replace(/^_/, "");
    return this.tokenFormat.replace(/\{TYPE\}/g, typeUpper).replace(/\{INDEX\}/g, counter.toString());
  }
}
// packages/core/src/strategies/mask.ts
class MaskStrategy {
  maskChar;
  preserveStructure;
  constructor(formatOptions) {
    this.maskChar = formatOptions?.maskChar || "*";
    this.preserveStructure = formatOptions?.preserveStructure !== false;
  }
  redact(value, type, counter) {
    if (!this.preserveStructure) {
      return this.maskChar.repeat(value.length);
    }
    return value.replace(/[a-zA-Z0-9]/g, this.maskChar);
  }
}
// packages/core/src/strategies/formatPreserving.ts
class FormatPreservingStrategy {
  seed = 12345;
  constructor(formatOptions) {}
  redact(value, type, counter) {
    const hash = this.hashString(value + counter);
    switch (type) {
      case "ipv4":
        return this.generateIPv4(hash);
      case "macAddress":
        return this.generateMAC(hash, value);
      case "email":
        return this.generateEmail(hash);
      case "phone":
        return this.generatePhone(hash);
      case "ssn":
        return this.generateSSN(hash);
      case "creditCard":
        return this.generateCreditCard(hash);
      case "hostname":
        return this.generateHostname(hash);
      default:
        return `REDACTED_${counter}`;
    }
  }
  hashString(str) {
    let hash = 0;
    for (let i = 0;i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  seededRandom(seed) {
    const x = Math.sin(seed++) * 1e4;
    return x - Math.floor(x);
  }
  generateIPv4(seed) {
    const octets = [10];
    for (let i = 0;i < 3; i++) {
      octets.push(Math.floor(this.seededRandom(seed + i) * 256));
    }
    return octets.join(".");
  }
  generateMAC(seed, original) {
    let separator = ":";
    if (original.includes("-"))
      separator = "-";
    else if (original.includes("."))
      separator = ".";
    const hex = "0123456789ABCDEF";
    const parts = [];
    if (separator === ".") {
      for (let i = 0;i < 3; i++) {
        let part = "";
        for (let j = 0;j < 4; j++) {
          part += hex[Math.floor(this.seededRandom(seed + i * 4 + j) * 16)];
        }
        parts.push(part);
      }
      return parts.join(".");
    } else {
      for (let i = 0;i < 6; i++) {
        let part = "";
        for (let j = 0;j < 2; j++) {
          part += hex[Math.floor(this.seededRandom(seed + i * 2 + j) * 16)];
        }
        parts.push(part);
      }
      return parts.join(separator);
    }
  }
  generateEmail(seed) {
    const userLength = 5 + Math.floor(this.seededRandom(seed) * 8);
    const user = this.generateRandomString(seed, userLength);
    const domains = ["example.com", "test.com", "sample.org", "demo.net"];
    const domain = domains[Math.floor(this.seededRandom(seed + 1000) * domains.length)];
    return `${user}@${domain}`;
  }
  generatePhone(seed) {
    const area = 200 + Math.floor(this.seededRandom(seed) * 800);
    const exchange = 200 + Math.floor(this.seededRandom(seed + 1) * 800);
    const number = Math.floor(this.seededRandom(seed + 2) * 1e4);
    return `${area}-${exchange}-${number.toString().padStart(4, "0")}`;
  }
  generateSSN(seed) {
    const area = 100 + Math.floor(this.seededRandom(seed) * 900);
    const group = 10 + Math.floor(this.seededRandom(seed + 1) * 90);
    const serial = 1000 + Math.floor(this.seededRandom(seed + 2) * 9000);
    return `${area}-${group.toString().padStart(2, "0")}-${serial}`;
  }
  generateCreditCard(seed) {
    let card = "4";
    for (let i = 0;i < 15; i++) {
      card += Math.floor(this.seededRandom(seed + i) * 10);
    }
    return card.match(/.{1,4}/g)?.join(" ") || card;
  }
  generateHostname(seed) {
    const length = 5 + Math.floor(this.seededRandom(seed) * 8);
    const name = this.generateRandomString(seed, length);
    const tlds = ["com", "net", "org", "io"];
    const tld = tlds[Math.floor(this.seededRandom(seed + 1000) * tlds.length)];
    return `${name}.${tld}`;
  }
  generateRandomString(seed, length) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0;i < length; i++) {
      result += chars[Math.floor(this.seededRandom(seed + i) * chars.length)];
    }
    return result;
  }
}
// packages/core/src/engine.ts
class DataRedactor {
  config;
  patterns = [];
  context;
  strategies;
  constructor(config) {
    console.log("[DataRedactor] Constructor called - VERSION WITH LOGGING");
    if (typeof config === "string") {
      this.config = ConfigLoader.loadFromFile(config);
    } else if (config) {
      this.config = ConfigLoader.loadFromObject(config);
    } else {
      this.config = ConfigLoader.getDefault();
    }
    console.log("[DataRedactor] Config loaded:", this.config);
    const validation = ConfigLoader.validateConfig(this.config);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(", ")}`);
    }
    const formatOptions = this.config.formatOptions;
    this.strategies = new Map([
      ["token", new TokenStrategy(formatOptions)],
      ["mask", new MaskStrategy(formatOptions)],
      ["formatPreserving", new FormatPreservingStrategy(formatOptions)]
    ]);
    this.context = new RedactionContext;
    this.initializePatterns();
  }
  initializePatterns() {
    const { patterns } = this.config;
    if (!patterns)
      return;
    if (patterns.ipv4) {
      if (patterns.ipv4.regex) {
        const regex = new RegExp(patterns.ipv4.regex, patterns.ipv4.flags || "");
        this.patterns.push(new BasePattern("ipv4", regex, patterns.ipv4.strategy, patterns.ipv4.enabled));
      } else {
        this.patterns.push(new IPv4Pattern(patterns.ipv4.strategy, patterns.ipv4.enabled));
      }
    }
    if (patterns.ipv6) {
      if (patterns.ipv6.regex) {
        const regex = new RegExp(patterns.ipv6.regex, patterns.ipv6.flags || "");
        this.patterns.push(new BasePattern("ipv6", regex, patterns.ipv6.strategy, patterns.ipv6.enabled));
      } else {
        this.patterns.push(new IPv6Pattern(patterns.ipv6.strategy, patterns.ipv6.enabled));
      }
    }
    if (patterns.macAddress) {
      if (patterns.macAddress.regex) {
        const regex = new RegExp(patterns.macAddress.regex, patterns.macAddress.flags || "");
        this.patterns.push(new BasePattern("macAddress", regex, patterns.macAddress.strategy, patterns.macAddress.enabled));
      } else {
        this.patterns.push(new MACAddressPattern(patterns.macAddress.strategy, patterns.macAddress.enabled));
      }
    }
    if (patterns.email) {
      if (patterns.email.regex) {
        const regex = new RegExp(patterns.email.regex, patterns.email.flags || "");
        this.patterns.push(new BasePattern("email", regex, patterns.email.strategy, patterns.email.enabled));
      } else {
        this.patterns.push(new EmailPattern(patterns.email.strategy, patterns.email.enabled));
      }
    }
    if (patterns.phone) {
      if (patterns.phone.regex) {
        const regex = new RegExp(patterns.phone.regex, patterns.phone.flags || "");
        this.patterns.push(new BasePattern("phone", regex, patterns.phone.strategy, patterns.phone.enabled));
      } else {
        this.patterns.push(new PhonePattern(patterns.phone.strategy, patterns.phone.enabled));
      }
    }
    if (patterns.ssn) {
      if (patterns.ssn.regex) {
        const regex = new RegExp(patterns.ssn.regex, patterns.ssn.flags || "");
        this.patterns.push(new BasePattern("ssn", regex, patterns.ssn.strategy, patterns.ssn.enabled));
      } else {
        this.patterns.push(new SSNPattern(patterns.ssn.strategy, patterns.ssn.enabled));
      }
    }
    if (patterns.creditCard) {
      if (patterns.creditCard.regex) {
        const regex = new RegExp(patterns.creditCard.regex, patterns.creditCard.flags || "");
        this.patterns.push(new BasePattern("creditCard", regex, patterns.creditCard.strategy, patterns.creditCard.enabled));
      } else {
        this.patterns.push(new CreditCardPattern(patterns.creditCard.strategy, patterns.creditCard.enabled));
      }
    }
    if (patterns.creditCardLast4) {
      if (patterns.creditCardLast4.regex) {
        const regex = new RegExp(patterns.creditCardLast4.regex, patterns.creditCardLast4.flags || "");
        this.patterns.push(new BasePattern("creditCardLast4", regex, patterns.creditCardLast4.strategy, patterns.creditCardLast4.enabled));
      } else {
        this.patterns.push(new CreditCardLast4Pattern(patterns.creditCardLast4.strategy, patterns.creditCardLast4.enabled));
      }
    }
    if (patterns.hostname) {
      if (patterns.hostname.regex) {
        const regex = new RegExp(patterns.hostname.regex, patterns.hostname.flags || "");
        this.patterns.push(new BasePattern("hostname", regex, patterns.hostname.strategy, patterns.hostname.enabled));
      } else {
        this.patterns.push(new HostnamePattern(patterns.hostname.strategy, patterns.hostname.enabled));
      }
    }
    if (patterns.ticketNumber) {
      if (patterns.ticketNumber.regex) {
        const regex = new RegExp(patterns.ticketNumber.regex, patterns.ticketNumber.flags || "");
        this.patterns.push(new BasePattern("ticketNumber", regex, patterns.ticketNumber.strategy, patterns.ticketNumber.enabled));
      } else {
        this.patterns.push(new TicketNumberPattern(patterns.ticketNumber.strategy, patterns.ticketNumber.enabled));
      }
    }
    if (patterns.name) {
      if (patterns.name.regex) {
        const regex = new RegExp(patterns.name.regex, patterns.name.flags || "");
        this.patterns.push(new BasePattern("name", regex, patterns.name.strategy, patterns.name.enabled));
      } else {
        this.patterns.push(new NamePattern(patterns.name.strategy, patterns.name.enabled));
      }
    }
    if (patterns.custom) {
      patterns.custom.forEach((customPattern) => {
        const regex = new RegExp(customPattern.regex, customPattern.flags || "");
        this.patterns.push(new BasePattern(customPattern.name, regex, customPattern.strategy, true));
      });
    }
    if (this.config.customEntities) {
      Object.entries(this.config.customEntities).forEach(([type, values]) => {
        if (values && values.length > 0) {
          const escapedValues = values.map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
          const regex = new RegExp(`\\b(${escapedValues.join("|")})\\b`, "gi");
          this.patterns.push(new BasePattern(type, regex, "token", true));
        }
      });
    }
  }
  redact(text) {
    console.log("[DataRedactor] redact() called with text:", text.substring(0, 200));
    console.log("[DataRedactor] Number of patterns:", this.patterns.length);
    const allMatches = [];
    this.patterns.forEach((pattern) => {
      console.log("[DataRedactor] Checking pattern:", pattern.name, "enabled:", pattern.enabled);
      if (pattern.enabled) {
        const matches = pattern.findAll(text);
        console.log("[DataRedactor] Pattern", pattern.name, "found", matches.length, "matches");
        allMatches.push(...matches);
      }
    });
    const nonOverlappingMatches = this.removeOverlaps(allMatches);
    nonOverlappingMatches.sort((a, b) => b.start - a.start);
    let redactedText = text;
    nonOverlappingMatches.forEach((match) => {
      const strategy = this.strategies.get(match.strategy);
      if (strategy) {
        const replacement = this.context.getOrCreateRedaction(match.value, match.type, strategy);
        redactedText = redactedText.substring(0, match.start) + replacement + redactedText.substring(match.end);
      }
    });
    return {
      redactedText,
      mapping: this.context.getMapping(),
      matches: nonOverlappingMatches.reverse()
    };
  }
  removeOverlaps(matches) {
    const result = [];
    const sorted = [...matches].sort((a, b) => a.start - b.start);
    sorted.forEach((match) => {
      const overlaps = result.some((existing) => {
        return match.start >= existing.start && match.start < existing.end || match.end > existing.start && match.end <= existing.end || match.start <= existing.start && match.end >= existing.end;
      });
      if (!overlaps) {
        result.push(match);
      }
    });
    return result;
  }
  reset() {
    this.context.clear();
  }
  getConfig() {
    return JSON.parse(JSON.stringify(this.config));
  }
  updateConfig(config) {
    this.config = ConfigLoader.loadFromObject({
      ...this.config,
      ...config
    });
    const formatOptions = this.config.formatOptions;
    this.strategies = new Map([
      ["token", new TokenStrategy(formatOptions)],
      ["mask", new MaskStrategy(formatOptions)],
      ["formatPreserving", new FormatPreservingStrategy(formatOptions)]
    ]);
    this.patterns = [];
    this.initializePatterns();
    this.reset();
  }
}
// packages/ui/main.js
var inputText = "";
var redactedText = "";
var mapping = {};
var config = getDefaultConfig();
var jsonConfig = JSON.stringify(config, null, 2);
var testInputs = {
  ipv4: "192.168.1.100",
  ipv6: "2001:0db8:85a3::8a2e:0370:7334",
  macAddress: "00-1B-44-11-3A-B8",
  email: "john.doe@example.com",
  phone: "555-123-4567",
  ssn: "123-45-6789",
  creditCard: "4532-1234-5678-9010",
  creditCardLast4: "Card ending in 9010",
  hostname: "mail.example.com",
  ticketNumber: "Ticket #12345",
  name: "John Doe"
};
var patternFormats = {
  ipv4: {
    tokenFormat: "[I_P_V4_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  ipv6: {
    tokenFormat: "[I_P_V6_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  macAddress: {
    tokenFormat: "[M_A_C_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  email: {
    tokenFormat: "[E_M_A_I_L_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  phone: {
    tokenFormat: "[P_H_O_N_E_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  ssn: {
    tokenFormat: "[S_S_N_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  creditCard: {
    tokenFormat: "[C_A_R_D_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  creditCardLast4: {
    tokenFormat: "[C_A_R_D_L_A_S_T_4_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  hostname: {
    tokenFormat: "[H_O_S_T_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  ticketNumber: {
    tokenFormat: "[T_I_C_K_E_T_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  name: {
    tokenFormat: "[N_A_M_E_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  }
};
function getDefaultConfig() {
  return {
    patterns: {
      ipv4: {
        enabled: true,
        strategy: "token",
        regex: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:/\\d{1,2})?\\b"
      },
      ipv6: {
        enabled: true,
        strategy: "token",
        regex: "(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}"
      },
      macAddress: {
        enabled: true,
        strategy: "token",
        regex: "(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\\.){2}[0-9A-Fa-f]{4})"
      },
      email: {
        enabled: true,
        strategy: "token",
        regex: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"
      },
      phone: {
        enabled: true,
        strategy: "token",
        regex: "(?:\\+?1[-\\.\\s]?)?(?:\\(\\d{3}\\)\\s?\\d{3}[-\\.\\s]?\\d{4}|\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4})"
      },
      ssn: {
        enabled: true,
        strategy: "token",
        regex: "\\b\\d{3}-\\d{2}-\\d{4}\\b"
      },
      creditCard: {
        enabled: true,
        strategy: "token",
        regex: "\\b(?:\\d{4}[-\\s]?){3,4}\\d{1,4}\\b|\\b\\d{13,19}\\b"
      },
      creditCardLast4: {
        enabled: true,
        strategy: "token",
        regex: "(?:(?:card|payment|account)\\s+)?(?:ending\\s+in\\s+|ends\\s+in\\s+|last\\s+(?:4|four)(?:\\s+digits)?[\\s:]+)\\d{4}(?!\\d)|(?:\\*{4,})\\d{4}(?!\\d)",
        flags: "i"
      },
      hostname: {
        enabled: true,
        strategy: "token",
        regex: "\\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}\\b"
      },
      ticketNumber: {
        enabled: true,
        strategy: "token",
        regex: "(?:ticket|case)\\s*[#:-]?\\s*\\d+",
        flags: "i"
      },
      name: {
        enabled: true,
        strategy: "token"
      },
      custom: []
    },
    customEntities: {},
    testData: `Support Ticket #12345

Customer Information:
- Name: John Doe
- Email: john.doe@company.com
- Phone: 555-123-4567
- Alt Phone: (555) 987-6543
- Mobile: 1-555-SUPPORT
- SSN: 123-45-6789

Network Details:
- IPv4: 192.168.1.100
- IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
- MAC Address: 00-1B-44-11-3A-B8
- Gateway: 10.0.0.1
- DNS Server: 8.8.8.8
- Hostname: mail.example.com

Payment Information:
- Primary Card: 4532-1234-5678-9010
- Backup Card: 5425233430109903
- Card ending in 9010
- AmEx: 378282246310005

Issue Description:
Customer contacted us from IP 203.0.113.45 regarding server api.internal.company.net connection issues.
Contact support@company.com or call 1-555-FLOWERS for assistance.`
  };
}
var elements = {};
document.addEventListener("DOMContentLoaded", init);
function init() {
  cacheElements();
  bindEvents();
  renderPatternCards();
  renderOutputFormatTab();
  updateJsonConfig();
}
function cacheElements() {
  elements.tabSimple = document.getElementById("tab-simple");
  elements.tabJson = document.getElementById("tab-json");
  elements.tabOutput = document.getElementById("tab-output");
  elements.contentSimple = document.getElementById("content-simple");
  elements.contentJson = document.getElementById("content-json");
  elements.contentOutput = document.getElementById("content-output");
  elements.patternCards = document.getElementById("pattern-cards");
  elements.outputPatterns = document.getElementById("output-patterns");
  elements.inputText = document.getElementById("input-text");
  elements.redactedText = document.getElementById("redacted-text");
  elements.mappingContainer = document.getElementById("mapping-container");
  elements.mappingContent = document.getElementById("mapping-content");
  elements.jsonEditor = document.getElementById("json-editor");
  elements.jsonError = document.getElementById("json-error");
  elements.btnRedact = document.getElementById("btn-redact");
  elements.btnCopy = document.getElementById("btn-copy");
  elements.btnClear = document.getElementById("btn-clear");
  elements.btnCopyMapping = document.getElementById("btn-copy-mapping");
  elements.btnInsertTest = document.getElementById("btn-insert-test");
  elements.btnImportJson = document.getElementById("btn-import-json");
  elements.btnExportEdited = document.getElementById("btn-export-edited");
  elements.btnExportDefault = document.getElementById("btn-export-default");
  elements.btnReset = document.getElementById("btn-reset");
}
function bindEvents() {
  elements.tabSimple.addEventListener("click", () => setActiveTab("simple"));
  elements.tabJson.addEventListener("click", () => setActiveTab("json"));
  elements.tabOutput.addEventListener("click", () => setActiveTab("output"));
  elements.btnRedact.addEventListener("click", handleRedact);
  elements.btnCopy.addEventListener("click", handleCopy);
  elements.btnClear.addEventListener("click", handleClear);
  elements.btnCopyMapping.addEventListener("click", handleCopyMapping);
  elements.btnInsertTest.addEventListener("click", handleInsertTestData);
  elements.btnImportJson.addEventListener("click", handleImportJson);
  elements.btnExportEdited.addEventListener("click", handleExportEditedJson);
  elements.btnExportDefault.addEventListener("click", handleExportDefaultJson);
  elements.btnReset.addEventListener("click", handleResetConfig);
  elements.inputText.addEventListener("input", (e) => {
    inputText = e.target.value;
  });
  elements.jsonEditor.addEventListener("input", (e) => {
    handleJsonChange(e.target.value);
  });
}
function setActiveTab(tab) {
  elements.tabSimple.classList.toggle("active", tab === "simple");
  elements.tabJson.classList.toggle("active", tab === "json");
  elements.tabOutput.classList.toggle("active", tab === "output");
  elements.contentSimple.classList.toggle("hidden", tab !== "simple");
  elements.contentJson.classList.toggle("hidden", tab !== "json");
  elements.contentOutput.classList.toggle("hidden", tab !== "output");
}
function renderPatternCards() {
  const container = elements.patternCards;
  container.innerHTML = "";
  Object.entries(config.patterns || {}).forEach(([key, value]) => {
    if (key === "custom")
      return;
    const card = document.createElement("div");
    card.className = "pattern-card";
    card.innerHTML = `
      <label>
        <input type="checkbox" ${value.enabled ? "checked" : ""} data-pattern="${key}">
        <span>${key}</span>
      </label>
      <select data-pattern="${key}" ${!value.enabled ? "disabled" : ""}>
        <option value="token" ${value.strategy === "token" ? "selected" : ""}>Token</option>
        <option value="mask" ${value.strategy === "mask" ? "selected" : ""}>Mask</option>
        <option value="formatPreserving" ${value.strategy === "formatPreserving" ? "selected" : ""}>Format-Preserving</option>
      </select>
    `;
    const checkbox = card.querySelector('input[type="checkbox"]');
    const select = card.querySelector("select");
    checkbox.addEventListener("change", (e) => {
      togglePattern(key, e.target.checked);
      select.disabled = !e.target.checked;
    });
    select.addEventListener("change", (e) => {
      setStrategy(key, e.target.value);
    });
    container.appendChild(card);
  });
}
function renderOutputFormatTab() {
  const container = elements.outputPatterns;
  container.innerHTML = "";
  Object.entries(config.patterns || {}).forEach(([key]) => {
    if (key === "custom")
      return;
    const testInput = testInputs[key] || "";
    const format = patternFormats[key] || {
      tokenFormat: "[{TYPE}_{INDEX}]",
      maskChar: "*",
      preserveStructure: true
    };
    const card = document.createElement("div");
    card.className = "pattern-test-card";
    card.innerHTML = `
      <h3>${key}</h3>
      <label class="test-input-label">Test Input:</label>
      <input type="text" class="test-input" value="${escapeHtml(testInput)}" data-pattern="${key}" placeholder="Enter ${key} to test...">

      <div class="strategy-grid">
        <!-- Token Strategy -->
        <div class="strategy-card token">
          <div class="strategy-title">Token Strategy</div>
          <div class="format-input-group">
            <label>Token Format:</label>
            <input type="text" value="${escapeHtml(format.tokenFormat)}" data-pattern="${key}" data-field="tokenFormat" placeholder="[PATTERN_{INDEX}]">
            <div class="format-hint">Use <code>{INDEX}</code> for counter</div>
          </div>
          <div class="output-box">
            <div class="output-label">Output:</div>
            <code class="output-value" data-output="${key}-token"></code>
          </div>
          <button class="copy-btn" data-copy="${key}-token">Copy Token Output</button>
        </div>

        <!-- Mask Strategy -->
        <div class="strategy-card mask">
          <div class="strategy-title">Mask Strategy</div>
          <div class="format-input-group">
            <label>Mask Character:</label>
            <input type="text" value="${format.maskChar}" maxlength="1" data-pattern="${key}" data-field="maskChar" placeholder="*">
          </div>
          <label class="preserve-structure-label">
            <input type="checkbox" ${format.preserveStructure ? "checked" : ""} data-pattern="${key}" data-field="preserveStructure">
            Preserve structure
          </label>
          <div class="output-box">
            <div class="output-label">Output:</div>
            <code class="output-value" data-output="${key}-mask"></code>
          </div>
          <button class="copy-btn" data-copy="${key}-mask">Copy Mask Output</button>
        </div>

        <!-- Format-Preserving Strategy -->
        <div class="strategy-card format-preserving">
          <div class="strategy-title">Format-Preserving</div>
          <div class="auto-info">Automatically maintains input format with realistic fake data</div>
          <div class="output-box">
            <div class="output-label">Output:</div>
            <code class="output-value" data-output="${key}-format"></code>
          </div>
          <button class="copy-btn" data-copy="${key}-format">Copy Format-Preserving Output</button>
        </div>
      </div>
    `;
    container.appendChild(card);
    const testInputEl = card.querySelector(".test-input");
    testInputEl.addEventListener("input", (e) => {
      testInputs[key] = e.target.value;
      updateOutputForPattern(key);
    });
    card.querySelectorAll("[data-field]").forEach((input) => {
      input.addEventListener("input", (e) => {
        const field = e.target.dataset.field;
        const pattern = e.target.dataset.pattern;
        if (field === "preserveStructure") {
          patternFormats[pattern][field] = e.target.checked;
        } else {
          patternFormats[pattern][field] = e.target.value;
        }
        updateOutputForPattern(pattern);
      });
      if (input.type === "checkbox") {
        input.addEventListener("change", (e) => {
          const field = e.target.dataset.field;
          const pattern = e.target.dataset.pattern;
          patternFormats[pattern][field] = e.target.checked;
          updateOutputForPattern(pattern);
        });
      }
    });
    card.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const outputKey = e.target.dataset.copy;
        const outputEl = card.querySelector(`[data-output="${outputKey}"]`);
        copyToClipboard(outputEl.textContent, "Output");
      });
    });
    updateOutputForPattern(key);
  });
}
function updateOutputForPattern(key) {
  const testInput = testInputs[key] || "";
  const format = patternFormats[key] || {
    tokenFormat: "[{TYPE}_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  };
  const tokenOutput = testWithStrategy(key, testInput, "token", format);
  const tokenEl = document.querySelector(`[data-output="${key}-token"]`);
  if (tokenEl)
    tokenEl.textContent = tokenOutput;
  const maskOutput = testWithStrategy(key, testInput, "mask", format);
  const maskEl = document.querySelector(`[data-output="${key}-mask"]`);
  if (maskEl)
    maskEl.textContent = maskOutput;
  const formatOutput = testWithStrategy(key, testInput, "formatPreserving", format);
  const formatEl = document.querySelector(`[data-output="${key}-format"]`);
  if (formatEl)
    formatEl.textContent = formatOutput;
}
function testWithStrategy(key, testInput, strategy, format) {
  try {
    const testConfig = {
      ...config,
      formatOptions: {
        tokenFormat: format.tokenFormat,
        maskChar: format.maskChar,
        preserveStructure: format.preserveStructure
      },
      patterns: {
        ...config.patterns,
        [key]: {
          ...config.patterns[key],
          enabled: true,
          strategy
        }
      }
    };
    const redactor = new DataRedactor(testConfig);
    const result = redactor.redact(testInput);
    return result.redactedText || testInput;
  } catch (error) {
    return `Error: ${error}`;
  }
}
function togglePattern(pattern, enabled) {
  config.patterns[pattern].enabled = enabled;
  updateJsonConfig();
}
function setStrategy(pattern, strategy) {
  config.patterns[pattern].strategy = strategy;
  updateJsonConfig();
}
function updateJsonConfig() {
  jsonConfig = JSON.stringify(config, null, 2);
  if (elements.jsonEditor) {
    elements.jsonEditor.value = jsonConfig;
  }
}
function handleRedact() {
  try {
    inputText = elements.inputText.value;
    const redactor = new DataRedactor(config);
    const result = redactor.redact(inputText);
    redactedText = result.redactedText;
    mapping = result.mapping;
    elements.redactedText.value = redactedText;
    renderMapping();
  } catch (error) {
    console.error("Redaction error:", error);
    alert(`Error: ${error}`);
  }
}
function handleClear() {
  inputText = "";
  redactedText = "";
  mapping = {};
  elements.inputText.value = "";
  elements.redactedText.value = "";
  elements.mappingContainer.classList.add("hidden");
}
function handleCopy() {
  if (redactedText) {
    copyToClipboard(redactedText, "Redacted text");
  }
}
function handleCopyMapping() {
  const mappingText = Object.entries(mapping).map(([original, redacted]) => `${original} → ${redacted}`).join(`
`);
  copyToClipboard(mappingText, "Mapping");
}
function handleInsertTestData() {
  inputText = config.testData || "";
  elements.inputText.value = inputText;
}
function handleJsonChange(value) {
  jsonConfig = value;
  elements.jsonError.textContent = "";
  elements.jsonError.classList.add("hidden");
  try {
    const parsed = JSON.parse(value);
    config = parsed;
    renderPatternCards();
    renderOutputFormatTab();
  } catch {
    elements.jsonError.textContent = "Invalid JSON - will not apply until fixed";
    elements.jsonError.classList.remove("hidden");
  }
}
function handleImportJson() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader;
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const parsed = JSON.parse(content);
          config = parsed;
          updateJsonConfig();
          renderPatternCards();
          renderOutputFormatTab();
          alert("Configuration imported successfully!");
        } catch {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}
function handleExportEditedJson() {
  downloadJson(jsonConfig, "redactor-config-edited.json");
}
function handleExportDefaultJson() {
  downloadJson(JSON.stringify(DEFAULT_CONFIG, null, 2), "redactor-config-default.json");
}
function handleResetConfig() {
  config = getDefaultConfig();
  updateJsonConfig();
  renderPatternCards();
  renderOutputFormatTab();
}
function renderMapping() {
  if (Object.keys(mapping).length === 0) {
    elements.mappingContainer.classList.add("hidden");
    return;
  }
  elements.mappingContainer.classList.remove("hidden");
  elements.mappingContent.innerHTML = Object.entries(mapping).map(([original, redacted]) => `<div class="mapping-item"><strong>${escapeHtml(original)}</strong> → ${escapeHtml(redacted)}</div>`).join("");
}
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text);
  alert(`${label} copied to clipboard!`);
}
function downloadJson(content, filename) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
