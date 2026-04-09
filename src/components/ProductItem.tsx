import type { Product } from "@/types/product";

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="bg-[#151520] p-4 rounded-2xl border border-white/10 hover:border-purple-500/30 transition">
      <h3 className="font-semibold truncate">{product.name}</h3>

      <p className="text-sm text-gray-400 mt-1">
        Rp {product.price.toLocaleString("id-ID")}
      </p>

      <div className="text-xs text-gray-500 mt-2">
        {product.type === "weight" ? "Per Kg" : "Per Item"}
      </div>
    </div>
  );
}