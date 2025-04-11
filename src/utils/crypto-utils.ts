// utils/crypto.js

const SECRET_KEY = process.env.CRYPTO_SECRET_KEY; // 32 caracteres (256 bits)

// utils/crypto.js
export async function encryptData(data: string) {
  // Converta a chave para 32 bytes (256 bits) usando um hash SHA-256
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(16), // Salt aleatório (pode ser fixo para seu caso)
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 }, // AES-256
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12)); // Vetor de inicialização
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(data))
  );

  // Concatena IV + dados criptografados (em base64 para URL)
  return `${btoa(String.fromCharCode(...iv))}:${btoa(
    String.fromCharCode(...new Uint8Array(encrypted))
  )}`;
}
