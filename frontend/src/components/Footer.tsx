import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="mt-6 text-center">
    <Link
      to="/"
      className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
    >
      Home
    </Link>
  </footer>
);

export default Footer;
