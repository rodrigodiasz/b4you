"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import ProductForm from "../../../../components/ProductForm";
import Navbar from "../../../../components/Navbar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditProductPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | string[]>("");
  const [product, setProduct] = useState<{
    name: string;
    price: number;
    description: string;
    stock: number;
    category: string;
  } | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct({
          name: res.data.name,
          price: res.data.price,
          description: res.data.description,
          stock: res.data.stock ?? 0,
          category: res.data.category,
        });
      } catch {
        setError("Produto não encontrado");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  async function handleSubmit(values: {
    name: string;
    price: number;
    description: string;
    stock: number;
    category: string;
  }) {
    setSaving(true);
    setError("");
    try {
      await api.put(`/products/${id}`, values);
      toast.success("Produto atualizado com sucesso!");
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
          (err.response.data as { error?: string }).error || "Erro ao salvar produto";
        const errorList = errorMsg.split(",").map((e: string) => e.trim());
        errorList.forEach((e) => toast.error(e));
      } else {
        toast.error("Erro ao salvar produto");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-8">
        <div className="flex justify-between items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold">Editar Produto</h2>
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
        {loading ? (
          <div className="p-6 text-center text-muted-foreground bg-muted rounded-lg">
            <LoadingSpinner />
            <span>Carregando...</span>
          </div>
        ) : (
          product && (
            <ProductForm
              initialValues={product}
              onSubmit={handleSubmit}
              loading={saving}
              mode="edit"
            />
          )
        )}
      </div>
    </div>
  );
}
