// First focusable element on the page; hidden until it receives keyboard focus.
export default function SkipLink({ targetId }) {
  return (
    <a className="skip-link visually-hidden-focusable" href={`#${targetId}`}>
      Skip to main content
    </a>
  );
}
