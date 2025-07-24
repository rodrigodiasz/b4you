import { Button } from "./button";

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  message,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background rounded-xl shadow-lg p-6 w-full max-w-sm">
        <div className="mb-4 text-center text-lg font-semibold text-foreground">{message}</div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} className="min-w-[100px]">
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="min-w-[100px]">
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
