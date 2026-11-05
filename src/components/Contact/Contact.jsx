import { Mail, MessageCircle } from 'lucide-react';
import PageSection from '../PageSection/PageSection.jsx';
import SocialLinks from '../SocialLinks/SocialLinks.jsx';
import { whatsappUrl } from '../../lib/contact.js';

// Ways to get in touch. No form: the email opens the visitor's own mail app, and WhatsApp opens a
// chat in a new tab. The WhatsApp number is only in the link, never shown as text.
export default function Contact({ contact, socials }) {
  return (
    <PageSection id="contact" heading="Contact">
      {contact.email && (
        <p className="contact-email">
          <Mail size={20} aria-hidden="true" />
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
      )}
      {contact.whatsapp?.number && (
        <p>
          <a
            className="btn-primary-action contact-whatsapp"
            href={whatsappUrl(contact.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Chat on WhatsApp <span className="visually-hidden">(opens in a new tab)</span>
          </a>
        </p>
      )}
      {socials.length > 0 && <SocialLinks socials={socials} />}
    </PageSection>
  );
}
