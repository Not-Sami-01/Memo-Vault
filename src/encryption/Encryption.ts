import * as crypto from 'crypto';
// export async function MyEncrypt(plaintext: string, password: string) {
//   const ptUtf8 = new TextEncoder().encode(plaintext);
//   const pwUtf8 = new TextEncoder().encode(password);
//   const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);

//   const iv = crypto.getRandomValues(new Uint8Array(16));
//   const alg = { name: 'AES-CBC', iv: iv };
//   const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']);

//   const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUtf8);
//   const ctArray = new Uint8Array(ctBuffer);
//   const ctBase64 = btoa(String.fromCharCode(...ctArray));

//   const ivHex = Array.from(iv).map(b => ('00' + b.toString(16)).slice(-2)).join('');
//   return ivHex + ctBase64;
// }

// export async function MyDecrypt(ciphertext: string, password: string) {
//   const ivHex = ciphertext.slice(0, 32);
//   const ctBase64 = ciphertext.slice(32);
//   const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

//   const ctStr = atob(ctBase64);
//   const ctArray = new Uint8Array(ctStr.split('').map(c => c.charCodeAt(0)));

//   const pwUtf8 = new TextEncoder().encode(password);
//   const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);

//   const alg = { name: 'AES-CBC', iv: iv };
//   const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt']);

//   const ptBuffer = await crypto.subtle.decrypt(alg, key, ctArray);
//   const plaintext = new TextDecoder().decode(ptBuffer);

//   return plaintext;
// }





const isBrowser = typeof window !== 'undefined';

import { randomBytes } from 'crypto';

export async function MyEncrypt(plaintext: string, password: string) {
  if (plaintext === '') return plaintext;
  const ptUtf8 = new TextEncoder().encode(plaintext);
  const pwUtf8 = new TextEncoder().encode(password);
  const pwHash = await (isBrowser ? window.crypto.subtle : crypto.subtle).digest('SHA-256', pwUtf8);

  const iv = new Uint8Array(16);
  if (isBrowser) {
    window.crypto.getRandomValues(iv);
  } else {
    randomBytes(16).copy(iv);
  }

  const alg = { name: 'AES-CBC', iv: iv };
  const key = await (isBrowser ? window.crypto.subtle : crypto.subtle).importKey('raw', pwHash, alg, false, ['encrypt']);

  const ctBuffer = await (isBrowser ? window.crypto.subtle : crypto.subtle).encrypt(alg, key, ptUtf8);
  const ctArray = new Uint8Array(ctBuffer);
  const ctBase64 = btoa(String.fromCharCode(...ctArray));

  const ivHex = Array.from(iv).map(b => ('00' + b.toString(16)).slice(-2)).join('');
  return ivHex + ctBase64;
}

// export async function MyDecrypt(ciphertext: string, password: string) {
//   if(ciphertext === '') return ciphertext;
//   const ivHex = ciphertext.slice(0, 32);
//   const ctBase64 = ciphertext.slice(32);
//   const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

//   const ctStr = atob(ctBase64);
//   const ctArray = new Uint8Array(ctStr.split('').map(c => c.charCodeAt(0)));

//   const pwUtf8 = new TextEncoder().encode(password);
//   const pwHash = await (isBrowser ? window.crypto.subtle : crypto.subtle).digest('SHA-256', pwUtf8);

//   const alg = { name: 'AES-CBC', iv: iv };
//   const key = await (isBrowser ? window.crypto.subtle : crypto.subtle).importKey('raw', pwHash, alg, false, ['decrypt']);

//   const ptBuffer = await (isBrowser ? window.crypto.subtle : crypto.subtle).decrypt(alg, key, ctArray);
//   const plaintext = new TextDecoder().decode(ptBuffer);

//   return plaintext;
// }
export async function MyDecrypt(ciphertext: string, password: string) {
  if (ciphertext === '') return ciphertext;
  const ivHex = ciphertext.slice(0, 32);
  const ctBase64 = ciphertext.slice(32);

  if (!ivHex) throw new Error("Invalid ciphertext: ivHex is missing.");

  const iv = new Uint8Array(ivHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);

  const ctStr = atob(ctBase64);
  const ctArray = new Uint8Array(ctStr.split('').map(c => c.charCodeAt(0)));

  const pwUtf8 = new TextEncoder().encode(password);
  const pwHash = await (isBrowser ? window.crypto.subtle : crypto.subtle).digest('SHA-256', pwUtf8);

  const alg = { name: 'AES-CBC', iv: iv };
  const key = await (isBrowser ? window.crypto.subtle : crypto.subtle).importKey('raw', pwHash, alg, false, ['decrypt']);

  const ptBuffer = await (isBrowser ? window.crypto.subtle : crypto.subtle).decrypt(alg, key, ctArray);
  const plaintext = new TextDecoder().decode(ptBuffer);

  return plaintext;
}
