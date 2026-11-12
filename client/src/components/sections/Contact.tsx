import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import site from "../../config/site.js";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function Contact() {
  const whatsappContact = site.contact.whatsapp || site.contact.phone;
  const whatsappNumber = whatsappContact.replace(/\D/g, "");

  return (
    <section className="section section-contact" id="contact" aria-labelledby="contact-title">
      <div className="page-container">
        <SectionHeading
          id="contact-title"
          number="08"
          eyebrow="Contact"
          title="Let's connect."
          description="Reach me directly on WhatsApp or email."
        />
        <Reveal className="contact-options">
          {whatsappNumber && (
            <a className="contact-option surface-hover" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp: ${whatsappContact}`}>
              <MessageCircle size={19} aria-hidden="true" />
              <span><strong>WhatsApp</strong><small>{whatsappContact}</small></span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          <a className="contact-option surface-hover" href={`mailto:${site.contact.email}`} aria-label={`Email: ${site.contact.email}`}>
            <Mail size={19} aria-hidden="true" />
            <span><strong>Email</strong><small>{site.contact.email}</small></span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
