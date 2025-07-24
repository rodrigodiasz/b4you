import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <Loader2 className="animate-spin text-zinc-900 dark:text-zinc-200" size={size} />
      <span className="text-sm text-zinc-600 dark:text-zinc-400">Carregando...</span>
    </div>
  );
}
