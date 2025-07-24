"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export default function ReportsPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
        </div>
        <div className="bg-background rounded-xl border shadow-sm p-8 flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Em breve: Relatórios detalhados do seu negócio!
          </h2>
          <p className="text-muted-foreground text-center mb-6 max-w-xl">
            Aqui você poderá visualizar gráficos, métricas e análises avançadas
            sobre vendas, estoque, clientes e muito mais.
          </p>
          <Button onClick={() => router.push("/")} className="bg-muted hover:bg-muted/60 text-zinc-900 dark:text-white">Voltar ao Dashboard</Button>
        </div>
      </main>
    </div>
  );
}
