import founderImg from "@/assets/founder.jpg";

const HeroSection = () => {
  return (
    <section className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">
          {/* Text Content */}
          <div className="order-2 lg:order-1 py-12 lg:py-0">
            <h1 className="heading-display text-foreground mb-8 animate-fade-in">
              Outlier Blessings
            </h1>
            
            <div 
              className="space-y-6 opacity-0 animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <p className="text-body text-lg leading-relaxed">
                We're here to bring faith and inspiration into your daily life. Your spiritual journey matters, and we're honored to craft meaningful symbols of hope and resilience for you.
              </p>
              
              <p className="text-body text-lg leading-relaxed">
                Each handmade cross is personally crafted with your family name and favorite Bible verse engraved on the back, making every piece uniquely yours.
              </p>
              
              <p className="font-serif text-accent text-lg italic">
                10% of every purchase goes back to support our church community.
              </p>
              
              <p className="text-body text-lg leading-relaxed">
                Start your order today by contacting us to discuss the details!
              </p>
            </div>

            <div 
              className="mt-10 opacity-0 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              <a 
                href="#collection"
                className="btn-hero inline-block"
              >
                View Collection
              </a>
            </div>
          </div>

          {/* Image */}
          <div 
            className="order-1 lg:order-2 opacity-0 animate-fade-in-slow"
            style={{ animationDelay: "300ms" }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-gold-light/20 to-transparent rounded-sm" />
              <img
                src={founderImg}
                alt="Founder of Outlier Blessings"
                className="relative w-full max-w-md mx-auto lg:max-w-none rounded-sm shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
