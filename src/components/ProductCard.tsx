import { Link } from "react-router-dom";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  return (
    <Link 
      to={`/product/${product.slug}`}
      className="card-product group block"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="overflow-hidden bg-navy/5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-serif text-xl tracking-wide text-foreground mb-2">
          {product.name}
        </h3>
        <p className="font-sans text-sm text-muted-foreground">
          {product.availability}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
