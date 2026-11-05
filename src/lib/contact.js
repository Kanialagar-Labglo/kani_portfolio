/**
 * WhatsApp click-to-chat address for a number, with an optional pre-filled greeting.
 * @param {{ number: string, message?: string }} whatsapp number in international form; non-digits are ignored
 * @returns {string}
 */
export function whatsappUrl({ number, message }) {
  const base = `https://wa.me/${number.replace(/\D/g, '')}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
