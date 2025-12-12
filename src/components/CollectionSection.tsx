import { products } from "@/data/products";
import ProductCard from "./ProductCard";

const CollectionSection = () => {
  return (
    <section id="collection" className="section-padding bg-cream-dark">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-section text-foreground mb-4">
            Our Collection
          </h2>
          <div className="w-16 h-px bg-accent mx-auto mb-6" />
          <p className="text-body max-w-2xl mx-auto">
            Each cross is handcrafted with care, designed to bring beauty and meaning to your home or to gift to someone you love.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
