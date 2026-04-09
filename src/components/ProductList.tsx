import type { Product } from "@/types/product";
import ProductItem from "./ProductItem";

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Product List</h2>

      <div className="grid grid-cols-2 gap-4">
        {products.map((p, i) => {
          const isLast = i === products.length - 1;
          const isOdd = products.length % 2 !== 0;

          return (
            <div key={p.id} className={isOdd && isLast ? "col-span-2" : ""}>
              <ProductItem product={p} />
            </div>
          );
        })}
      </div>
    </div>
  );
}