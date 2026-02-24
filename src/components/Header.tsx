import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCollectionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#collection");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Outlier Blessings" className="h-16 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="link-elegant text-sm uppercase">
              Home
            </Link>
            <a href="/#collection" onClick={handleCollectionClick} className="link-elegant text-sm uppercase">
              Collection
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
