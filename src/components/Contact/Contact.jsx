import { Mail } from 'lucide-react';
import PageSection from '../PageSection/PageSection.jsx';
import SocialLinks from '../SocialLinks/SocialLinks.jsx';

// Ways to get in touch. No form: the email opens the visitor's own mail app.
export default function Contact({ contact, socials }) {
  return (
    <PageSection id="contact" heading="Contact">
      {contact.email && (
        <p className="contact-email">
          <Mail size={20} aria-hidden="true" />
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
      )}
      {socials.length > 0 && <SocialLinks socials={socials} />}
    </PageSection>
  );
}
