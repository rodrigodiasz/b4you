import * as React from "react";

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
    }
  };
  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block font-medium mb-2">{label}</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading || isLoading || !!suggestion}
            autoFocus
          />
        </div>
        {suggestion && (
          <div className="mb-4 p-3 bg-muted rounded border text-sm">
            <div className="font-semibold mb-1">Sugestão da IA:</div>
            <div className="whitespace-pre-line mb-2">{suggestion}</div>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleApply}
              >
                Aplicar
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded bg-muted text-foreground border hover:bg-muted/80"
                onClick={() => navigator.clipboard.writeText(suggestion)}
              >
                Copiar
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          {!suggestion && (
            <button
              type="button"
              className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              onClick={handleConfirm}
              disabled={isLoading || !value.trim()}
            >
              {isLoading ? "Gerando..." : "Gerar"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
