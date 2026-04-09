"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { getProducts } from "@/lib/admin-product";
import { createOrder } from "@/lib/createOrder";

export default function OrderServicePage() {
  const params = useParams();
  const router = useRouter();

  const serviceSlug = params.service as string;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [items, setItems] = useState<string[]>([""]);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        console.log("PRODUCTS:", data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  // 🔍 FIND PRODUCT BY SLUG
  const product = products.find(
    (p) => p.slug === serviceSlug && p.isActive
  );

  // ⏳ STATE HANDLING
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="p-4 text-center">
        Service tidak ditemukan 🚫
      </div>
    );
  }

  // 💰 TOTAL PRICE
  const totalPrice = useMemo(() => {
    if (product.type === "weight") {
      return Number(weight || 0) * product.price;
    }

    return items.filter((i) => i.trim() !== "").length * product.price;
  }, [weight, items, product]);

  // ➕ ITEM HANDLER
  const addItem = () => setItems([...items, ""]);

  const updateItem = (i: number, value: string) => {
    const copy = [...items];
    copy[i] = value;
    setItems(copy);
  };

  const removeItem = (i: number) => {
    setItems(items.filter((_, idx) => idx !== i));
  };

  // 🚀 SUBMIT
  const handleSubmit = async () => {
    if (!name || !phone || !address) {
      alert("Lengkapi data dulu ya 👀");
      return;
    }

    const payload = {
      service: product.slug,
      serviceLabel: product.name,
      name,
      phone,
      address,
      pricePerUnit: product.price,
      totalPrice,
      weight: product.type === "weight" ? Number(weight) : null,
      items:
        product.type === "item"
          ? items.filter((i) => i.trim() !== "")
          : [],
    };

    try {
      await createOrder(payload);
      alert("Pesanan berhasil 🎉");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Gagal membuat pesanan 😵");
    }
  };

  // 🎨 UI
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-center font-semibold text-lg mb-1">
        Buat Pesanan
      </h2>

      <p className="text-center text-sm text-gray-500 mb-4">
        Layanan Dipilih:{" "}
        <span className="font-medium text-blue-600">
          {product.name}
        </span>
      </p>

      <div className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Nama Lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border rounded p-2"
          placeholder="Nomor WhatsApp"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          className="w-full border rounded p-2"
          placeholder="Alamat Lengkap"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* 🔹 WEIGHT TYPE */}
        {product.type === "weight" && (
          <>
            <input
              type="number"
              min="1"
              className="w-full border rounded p-2"
              placeholder="Estimasi Berat (Kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />

            <div className="text-sm text-gray-600">
              Harga: Rp {product.price.toLocaleString()} / Kg
            </div>
          </>
        )}

        {/* 🔹 ITEM TYPE */}
        {product.type === "item" && (
          <>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 border rounded p-2"
                    placeholder={`Item ${i + 1}`}
                    value={item}
                    onChange={(e) =>
                      updateItem(i, e.target.value)
                    }
                  />
                  <button
                    onClick={() => removeItem(i)}
                    className="px-3 bg-red-100 text-red-600 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="text-sm text-blue-600"
            >
              + Tambah Item
            </button>

            <div className="text-sm text-gray-600">
              Harga: Rp {product.price.toLocaleString()} / item
            </div>
          </>
        )}

        {/* 💰 TOTAL */}
        <div className="bg-blue-50 p-3 rounded text-center font-semibold">
          Total Harga: Rp {totalPrice.toLocaleString()}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded mt-2"
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
}