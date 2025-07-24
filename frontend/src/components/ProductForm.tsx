import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { AIPromptDialog } from "@/components/ui/ai-prompt-dialog";
import { Plus, Save, WandSparkles } from "lucide-react";
import { toast } from "sonner";

interface ProductFormProps {
  initialValues?: {
    name: string;
    price: number;
    description: string;
    stock: number;
    category: string;
  };
  onSubmit: (values: {
    name: string;
    price: number;
    description: string;
    stock: number;
    category: string;
  }) => void;
  loading?: boolean;
  mode?: "create" | "edit";
}

type IAField = "name" | "description" | null;

export default function ProductForm({
  initialValues = {
    name: "",
    price: 0,
    description: "",
    stock: 0,
    category: "",
  },
  onSubmit,
  loading,
  mode = "create",
}: ProductFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [price, setPrice] = useState(initialValues.price);
  const [description, setDescription] = useState(initialValues.description);
  const [stock, setStock] = useState(initialValues.stock);
  const [category, setCategory] = useState(initialValues.category);
  const [loadingName, setLoadingName] = useState(false);
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [iaDialogOpen, setIADialogOpen] = useState<IAField>(null);

  async function handleAISuggest(
    field: "name" | "description",
    context: string
  ): Promise<string | void> {
    if (!context) return;
    if (field === "name") setLoadingName(true);
    if (field === "description") setLoadingDesc(true);
    try {
      const res = await api.post("/products/ai-suggest", { field, context });
      return res.data.suggestion;
    } catch (err) {
      toast.error("Erro ao gerar sugestão com IA");
    } finally {
      setLoadingName(false);
      setLoadingDesc(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, price, description, stock, category });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-5 bg-background rounded-xl border p-6 shadow-md"
    >
      <AIPromptDialog
        open={iaDialogOpen === "name"}
        onOpenChange={(open) => setIADialogOpen(open ? "name" : null)}
        label="Contexto para o nome do produto"
        placeholder="Ex: categoria, público, diferencial, palavras-chave..."
        onConfirm={(context) =>
          handleAISuggest("name", context).then((suggestion) => {
            if (suggestion) setName(suggestion);
            return suggestion;
          })
        }
        loading={loadingName}
      />
      <AIPromptDialog
        open={iaDialogOpen === "description"}
        onOpenChange={(open) => setIADialogOpen(open ? "description" : null)}
        label="Contexto para a descrição do produto"
        placeholder="Ex: benefícios, uso, público, palavras-chave..."
        onConfirm={(context) =>
          handleAISuggest("description", context).then((suggestion) => {
            if (suggestion) setDescription(suggestion);
            return suggestion;
          })
        }
        loading={loadingDesc}
      />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="name">Nome</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIADialogOpen("name")}
            disabled={loading || loadingName}
            className="ml-2"
          >
            {loadingName ? "Gerando..." : "Gerar com IA"}{" "}
            <WandSparkles className="w-4 h-4" />
          </Button>
        </div>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Nome do produto"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Descrição</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIADialogOpen("description")}
            disabled={loading || loadingDesc}
            className="ml-2"
          >
            {loadingDesc ? "Gerando..." : "Gerar com IA"}{" "}
            <WandSparkles className="w-4 h-4" />
          </Button>
        </div>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Descrição do produto"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          placeholder="Categoria do produto"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Preço</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          min={0}
          step={0.01}
          placeholder="Preço"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stock">Estoque</Label>
        <Input
          id="stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          required
          min={0}
          step={1}
          placeholder="Estoque"
        />
      </div>
      <Button type="submit" className="w-full bg-[#20cfc7] hover:bg-[#20cfc7]/70 text-zinc-900 dark:text-white" disabled={loading}>
        {mode === "edit" ? "Salvar alterações" : "Criar produto"}
        {mode === "edit" ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </Button>
    </form>
  );
}
