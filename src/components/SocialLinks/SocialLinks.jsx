import { Briefcase, CodeXml, Globe } from 'lucide-react';

// Lucide has no brand logos, so each platform gets a generic icon plus its visible name.
const PLATFORM_ICONS = {
  github: CodeXml,
  linkedin: Briefcase,
};

export default function SocialLinks({ socials, className = '' }) {
  return (
    <ul className={`social-links ${className}`.trim()}>
      {socials.map((social) => {
        const Icon = PLATFORM_ICONS[social.platform.toLowerCase()] ?? Globe;
        return (
          <li key={social.url}>
            <a href={social.url} target="_blank" rel="noopener noreferrer">
              <Icon size={18} aria-hidden="true" />
              {social.platform} <span className="visually-hidden">(opens in a new tab)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
