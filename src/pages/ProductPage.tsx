import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductBySlug, products } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InquiryModal from "@/components/InquiryModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 pt-32 text-center">
          <h1 className="heading-display text-foreground mb-6">Product Not Found</h1>
          <Link to="/" className="text-accent hover:underline font-sans">
            Return to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Get other products for suggestions
  const otherProducts = products.filter(p => p.id !== product.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Back Link */}
          <Link 
            to="/#collection"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8 font-sans text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Image */}
            <div className="opacity-0 animate-fade-in">
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-navy/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:py-8 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
              <h1 className="font-serif text-4xl md:text-5xl font-light tracking-wide text-foreground mb-6">
                {product.name}
              </h1>

              <p className="text-body text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Sizes & Prices */}
              <div className="mb-10">
                <h3 className="font-sans text-sm uppercase tracking-widest text-muted-foreground mb-4">
                  Available Sizes
                </h3>
                <div className="space-y-3">
                  {product.sizes.map((size) => (
                    <div 
                      key={size.size}
                      className="flex items-center justify-between py-3 px-4 border border-border rounded-sm"
                    >
                      <span className="font-serif text-lg text-foreground">
                        {size.size}
                      </span>
                      <span className="font-sans text-accent font-medium">
                        ${size.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inquiry Button */}
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-navy-light py-6 text-lg font-serif tracking-wide"
              >
                Inquire About This Cross
              </Button>

              <p className="mt-6 text-center text-muted-foreground text-sm font-sans">
                Custom engraving available • 10% supports our church community
              </p>
            </div>
          </div>

          {/* Other Products */}
          {otherProducts.length > 0 && (
            <div className="mt-24">
              <h2 className="heading-section text-foreground text-center mb-12">
                More From Our Collection
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {otherProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.slug}`}
                    className="card-product group block"
                  >
                    <div className="aspect-square overflow-hidden bg-navy/5">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-serif text-lg text-foreground">
                        {p.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
      />
    </div>
  );
};

export default ProductPage;
