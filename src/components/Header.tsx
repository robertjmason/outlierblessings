import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl tracking-wide text-foreground hover:text-accent transition-colors">
            Outlier Blessings
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="link-elegant text-sm uppercase">
              Home
            </Link>
            <Link to="/#collection" className="link-elegant text-sm uppercase">
              Collection
            </Link>
            <Link to="/product/santorini" className="link-elegant text-sm uppercase">
              Shop
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
