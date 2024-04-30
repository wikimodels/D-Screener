// Function to generate Binance signature
export async function generateBinanceSignature(
  secretKey: string,
  query: string
): Promise<string> {
  const encoder = new TextEncoder();

  // Combine timestamp and query string for signing
  const message = `${query}`;
  const messageBuffer = encoder.encode(message);

  // Import secret key for HMAC
  const keyBuffer = encoder.encode(secretKey);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign"]
  );

  // Generate HMAC signature
  const signature = await crypto.subtle.sign("HMAC", key, messageBuffer);

  // Convert signature to base64 for inclusion in requests
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return signatureB64;
}
