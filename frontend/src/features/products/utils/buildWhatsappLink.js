export function buildWhatsappLink(productName) {
  const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
  if (!productName) {
    return `https://wa.me/${waNumber}`;
  }
  return `https://wa.me/${waNumber}?text=Hola,%20me%20interesa%20la%20pieza%20"${encodeURIComponent(productName)}"%20que%20vi%20en%20su%20catálogo%20web.%20¿Me%20podrían%20dar%20información?`;
}
