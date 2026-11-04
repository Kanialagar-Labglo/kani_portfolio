// Page footer. Social links are added in task 8.2.
export default function Footer({ ownerName }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="m-0">
          © {new Date().getFullYear()} {ownerName}
        </p>
      </div>
    </footer>
  );
}
