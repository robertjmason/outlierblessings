const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl tracking-wide mb-2">Outlier Blessings</h3>
            <p className="font-sans text-sm opacity-80">
              Handcrafted symbols of faith
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="font-sans text-sm opacity-80">
              10% of every purchase supports our church community
            </p>
            <p className="font-sans text-xs opacity-60 mt-2">
              © {new Date().getFullYear()} Outlier Blessings. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
