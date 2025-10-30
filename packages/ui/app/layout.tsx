import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Redactor - Secure Data Redaction Tool',
  description: 'Redact sensitive information before sending to AI systems',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        background: 'linear-gradient(135deg, #002868 0%, #BF0A30 100%)',
        color: '#FFFFFF',
        minHeight: '100vh',
      }}>
        {children}
      </body>
    </html>
  );
}
