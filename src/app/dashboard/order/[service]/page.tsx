"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { servicesConfig, ServiceType } from "@/lib/services";
import { createOrder } from "@/lib/createOrder";

export default function OrderServicePage() {
  const params = useParams();
  const router = useRouter();

  console.log("PARAMS:", params);
  console.log("SERVICE RAW:", params.service);

  const serviceKey = params.service as ServiceType;
  const config = servicesConfig[serviceKey];

  if (!config) {
    return <div className="p-4 text-center">Service tidak ditemukan 🚫</div>;
  }

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [duvets, setDuvets] = useState<string[]>([""]);

  const totalPrice = useMemo(() => {
    if (config.type === "weight") {
      return Number(weight || 0) * config.price;
    }
    return duvets.filter((d) => d.trim() !== "").length * config.price;
  }, [weight, duvets, config]);

  const addDuvet = () => setDuvets([...duvets, ""]);
  const updateDuvet = (i: number, value: string) => {
    const copy = [...duvets];
    copy[i] = value;
    setDuvets(copy);
  };
  const removeDuvet = (i: number) => {
    setDuvets(duvets.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!name || !phone || !address) {
      alert("Lengkapi data dulu ya 👀");
      return;
    }

    const payload = {
      service: serviceKey,
      serviceLabel: config.label,
      name,
      phone,
      address,
      pricePerUnit: config.price,
      totalPrice,
      weight: config.type === "weight" ? Number(weight) : null,
      duvets:
        config.type === "duvet"
          ? duvets.filter((d) => d.trim() !== "")
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

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-center font-semibold text-lg mb-1">
        Buat Pesanan
      </h2>

      <p className="text-center text-sm text-gray-500 mb-4">
        Layanan Dipilih:{" "}
        <span className="font-medium text-blue-600">{config.label}</span>
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

        {config.type === "weight" && (
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
              Harga: Rp {config.price.toLocaleString()} / Kg
            </div>
          </>
        )}

        {config.type === "duvet" && (
          <>
            <div className="space-y-2">
              {duvets.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 border rounded p-2"
                    placeholder={`Duvet ${i + 1}`}
                    value={item}
                    onChange={(e) => updateDuvet(i, e.target.value)}
                  />
                  <button
                    onClick={() => removeDuvet(i)}
                    className="px-3 bg-red-100 text-red-600 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addDuvet}
              className="text-sm text-blue-600"
            >
              + Tambah Duvet
            </button>

            <div className="text-sm text-gray-600">
              Harga: Rp {config.price.toLocaleString()} / item
            </div>
          </>
        )}

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