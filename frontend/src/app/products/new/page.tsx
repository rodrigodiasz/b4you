"use client";
import ProductForm from "../../../components/ProductForm";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | string[]>("");

  async function handleSubmit(values: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
  }) {
    setLoading(true);
    setError("");
    try {
      await api.post("/products", values);
      toast.success("Produto criado com sucesso");
      router.push("/products");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
      ) {
        const errorMsg =
          (err.response.data as { error?: string }).error ||
          "Erro ao criar produto";
        const errorList = errorMsg.split(",").map((e: string) => e.trim());
        errorList.forEach((e) => toast.error(e));
      } else {
        toast.error("Erro ao criar produto");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-8">
        <div className="flex justify-between items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold">Novo Produto</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/products")}
            className="px-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
        </div>
        <ProductForm onSubmit={handleSubmit} loading={loading} mode="create" />
      </div>
    </div>
  );
}
