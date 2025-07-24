import * as React from "react";

interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductViewDialog({
  open,
  onOpenChange,
  product,
}: ProductViewDialogProps) {
  if (!open || !product) return null;

  // Definir limites para o gráfico
  const maxStock = 100; // valor máximo para barra cheia
  const stockPercent = Math.min(
    100,
    Math.round((product.stock / maxStock) * 100)
  );
  let barColor = "bg-green-500";
  if (product.stock <= 10) barColor = "bg-red-500";
  else if (product.stock <= 30) barColor = "bg-yellow-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Detalhes do Produto</h2>
          <div className="mb-2">
            <span className="font-semibold">Nome:</span> {product.name}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Descrição:</span>
            <div className="whitespace-pre-line text-muted-foreground text-sm mt-1">
              {product.description}
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Preço:</span> R${" "}
            {product.price.toFixed(2)}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Estoque:</span> {product.stock}
            <div className="mt-2 h-4 w-full bg-muted rounded">
              <div
                className={`h-4 rounded transition-all duration-300 ${barColor}`}
                style={{ width: `${stockPercent}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stockPercent}% da capacidade máxima ({maxStock})
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
