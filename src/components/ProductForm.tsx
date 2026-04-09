"use client";

import { useState } from "react";

export default function ProductForm({ onAdd }: any) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"weight" | "item">("weight");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // 🧠 VALIDATION
    if (!name.trim()) {
      alert("Nama produk wajib diisi 👀");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Harga harus lebih dari 0 💸");
      return;
    }

    setLoading(true);

    try {
      await onAdd({
        name: name.trim(),
        price: Number(price),
        type,
      });

      // 🔄 RESET
      setName("");
      setPrice("");
      setType("weight");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan produk 😵");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold">Add Product</h2>

      {/* NAME */}
      <div>
        <label className="block text-sm mb-1 text-gray-400">
          Product Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Cuci Kering"
          className="w-full bg-neutral-800 px-3 py-2 rounded-lg text-sm"
        />
      </div>

      {/* PRICE */}
      <div>
        <label className="block text-sm mb-1 text-gray-400">
          Price
        </label>
        <input
          type="number"
          min="1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="5000"
          className="w-full bg-neutral-800 px-3 py-2 rounded-lg text-sm"
        />
      </div>

      {/* TYPE */}
            <div>
        <label
          htmlFor="type"
          className="block text-sm mb-1 text-gray-400"
        >
          Type
        </label>

        <select
          id="type"
          value={type}
          onChange={(e) =>
            setType(e.target.value as "weight" | "item")
          }
          className="w-full bg-neutral-800 px-3 py-2 rounded-lg text-sm"
        >
          <option value="weight">Per Kg</option>
          <option value="item">Per Item</option>
        </select>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        {loading ? "Menambahkan..." : "Add Product"}
      </button>
    </div>
  );
}