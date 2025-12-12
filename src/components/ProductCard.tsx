import { Link } from "react-router-dom";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const lowestPrice = Math.min(...product.sizes.map(s => s.price));
  const highestPrice = Math.max(...product.sizes.map(s => s.price));
  
  const priceDisplay = lowestPrice === highestPrice 
    ? `$${lowestPrice}`
    : `$${lowestPrice} – $${highestPrice}`;

  return (
    <Link 
      to={`/product/${product.slug}`}
      className="card-product group block"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="aspect-[3/4] overflow-hidden bg-navy/5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-serif text-xl tracking-wide text-foreground mb-2">
          {product.name}
        </h3>
        <p className="font-sans text-sm text-accent font-medium">
          {priceDisplay}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
