import { Download } from 'lucide-react';

const NAME = 'Download résumé (PDF)';

// A real download link, so it works with the keyboard and assistive technology.
// The compact form shows a shorter visible label; its accessible name still starts with it.
export default function ResumeButton({ resume, compact = false, className = '', onChoose }) {
  const handleClick = (event) => {
    onChoose?.();
    resume.startDownload(event);
  };

  return (
    <a
      className={`resume-button ${className}`.trim()}
      href={resume.href}
      download={resume.fileName}
      aria-label={compact ? NAME : undefined}
      onClick={handleClick}
    >
      <Download size={18} aria-hidden="true" />
      {compact ? 'Résumé' : NAME}
    </a>
  );
}
