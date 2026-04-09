"use client";

import { useEffect, useState } from "react";
import { getProducts, addProduct } from "@/lib/admin-product";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";
import type { Product } from "@/types/product";

export default function SettingsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const load = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (data: {
    name: string;
    price: number;
    type: "weight" | "item";
  }) => {
    await addProduct({
      ...data,
      isActive: true,
    });

    load();
  };

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ProductForm onAdd={handleAdd} />

        <div className="xl:col-span-2">
          <ProductList products={products} />
        </div>
      </div>
    </div>
  );
}