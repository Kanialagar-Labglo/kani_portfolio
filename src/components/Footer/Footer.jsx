import SocialLinks from '../SocialLinks/SocialLinks.jsx';

export default function Footer({ ownerName, socials = [] }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="m-0">
          © {new Date().getFullYear()} {ownerName}
        </p>
        {socials.length > 0 && <SocialLinks socials={socials} />}
      </div>
    </footer>
  );
}
