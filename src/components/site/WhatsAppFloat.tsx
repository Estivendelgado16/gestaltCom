const WHATSAPP_NUMBER = "573127897914";
const WHATSAPP_MESSAGE =
  "Hola Dany, ¿qué tal? Estoy interesado en la terapia gestalt, me gustaría obtener más información.";

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="whatsapp-float"
    >
      <img src="/img/whatsapp.png" alt="WhatsApp" />
    </a>
  );
}
