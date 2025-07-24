import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AIPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  placeholder?: string;
  onConfirm: (context: string) => Promise<string | void>;
  loading?: boolean;
}

export function AIPromptDialog({
  open,
  onOpenChange,
  label,
  placeholder,
  onConfirm,
  loading,
}: AIPromptDialogProps) {
  const [value, setValue] = React.useState("");
  const [suggestion, setSuggestion] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const handleClose = () => {
    setValue("");
    setSuggestion(null);
    setIsLoading(false);
    onOpenChange(false);
  };
  const handleConfirm = async () => {
    setIsLoading(true);
    const result = await onConfirm(value);
    if (typeof result === "string") {
      setSuggestion(result);
    }
    setIsLoading(false);
  };
  const handleApply = () => {
    if (suggestion) {
      onOpenChange(false);
      setValue("");
      setSuggestion(null);
      setIsLoading(false);
      toast.success("Sugestão aplicada!");
    }
  };
  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <Label className="mb-2" htmlFor="ai-context">
            {label}
          </Label>
          <Textarea
            id="ai-context"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading || isLoading || !!suggestion}
            autoFocus
            className="min-h-[60px]"
          />
        </div>
        {suggestion && (
          <div className="mb-4 p-3 bg-muted rounded border text-sm">
            <div className="font-semibold mb-1">Sugestão da IA:</div>
            <div className="whitespace-pre-line mb-2">{suggestion}</div>
            <div className="flex gap-2">
              <Button type="button" onClick={handleApply}>
                Aplicar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(suggestion);
                  toast.success("Copiado para a área de transferência!");
                }}
              >
                Copiar
              </Button>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="default" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {!suggestion && (
            <Button type="button" onClick={handleConfirm} disabled={isLoading || !value.trim()}>
              {isLoading ? "Gerando..." : "Gerar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
