"use client";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Package,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown,
  WandSparkles,
  PackagePlus,
} from "lucide-react";
import api from "@/lib/api";
import { ElementType } from "react";

interface DashboardStats {
  totalProducts: number;
  revenue: number;
  totalStock: number;
  customers: number;
  productsGrowth: number;
  revenueGrowth: number;
  stockGrowth: number;
  customersGrowth: number;
}

type Product = { stock?: number };

export default function Home() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    revenue: 0,
    totalStock: 0,
    customers: 0,
    productsGrowth: 0,
    revenueGrowth: 0,
    stockGrowth: 0,
    customersGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLogged(!!token);

      if (token) {
        fetchDashboardStats();
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Busca dados reais de produtos e estoque, e preenche o restante com dados fictícios
  const fetchDashboardStats = async () => {
    try {
      // Buscar número real de produtos do backend
      const productsResponse = await api.get("/products");
      const totalProducts = productsResponse.data.length;

      // Calcular estoque total real dos produtos
      const totalStock = productsResponse.data.reduce(
        (sum: number, product: Product) => sum + (product.stock || 0),
        0
      );

      // Dados fictícios para os outros campos
      const mockStats: DashboardStats = {
        totalProducts: totalProducts,
        revenue: 45231,
        totalStock: totalStock,
        customers: 2845,
        productsGrowth: 12.5,
        revenueGrowth: 8.2,
        stockGrowth: 10.5,
        customersGrowth: -2.4,
      };
      setStats(mockStats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      // Fallback com dados fictícios em caso de erro
      const fallbackStats: DashboardStats = {
        totalProducts: 1247,
        revenue: 45231,
        totalStock: 1234,
        customers: 2845,
        productsGrowth: 12.5,
        revenueGrowth: 8.2,
        stockGrowth: 10.5,
        customersGrowth: -2.4,
      };
      setStats(fallbackStats);
    } finally {
      setLoading(false);
    }
  };

  // Componente para exibir cada card de estatística
  const StatCard = ({
    title,
    value,
    growth,
    icon: Icon,
    formatValue = (val: number) => val.toString(),
  }: {
    title: string;
    value: number;
    growth: number;
    icon: ElementType;
    formatValue?: (val: number) => string;
  }) => (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-zinc-400">{title}</h3>
        <Icon className="w-5 h-5 text-gray-400 dark:text-zinc-400" />
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-zinc-400">
          {formatValue(value)}
        </span>
      </div>
      <div className="flex items-center">
        {growth >= 0 ? (
          <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${growth >= 0 ? "text-green-600" : "text-red-600"}`}>
          {growth >= 0 ? "+" : ""}
          {growth.toFixed(1)}% do mês passado
        </span>
      </div>
    </div>
  );

  // Se não estiver logado, mostra landing page
  if (!isLogged) {
    return (
      <div className="min-h-screen ">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-2 sm:px-4 py-8 sm:py-16 w-full">
          <div className="text-center max-w-2xl sm:max-w-4xl mx-auto px-2">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Bem-vindo à <span className="text-[#20cfc7]">B4YOU</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 dark:text-white mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
              A plataforma definitiva para marcas que querem potencializar as vendas, ter total
              controle da operação e escalar com creators afiliados.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-[#20cfc7] hover:bg-[#20cfc7]/70"
                onClick={() => router.push("/login")}
              >
                Fazer Login
              </Button>
            </div>
          </div>

          {/* Seção de recursos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-16 max-w-2xl sm:max-w-5xl mx-auto w-full px-2">
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Gestão de Produtos</h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm sm:text-base">
                Controle total do seu inventário com ferramentas avançadas de gestão.
              </p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Analytics Avançado</h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm sm:text-base">
                Dashboards em tempo real com métricas detalhadas do seu negócio.
              </p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <WandSparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                Inteligência Artificial
              </h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm sm:text-base">
                Auxilio de IA para o seu negócio, criando produtos, categorias, descrições, etc.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Se estiver logado, mostra dashboard com cards e ações rápidas
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-zinc-400">
            Bem-vindo de volta! Aqui está um resumo do seu negócio.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 rounded-lg border shadow-sm p-6 animate-pulse"
              >
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
                <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <StatCard
                title="Total de Produtos"
                value={stats.totalProducts}
                growth={stats.productsGrowth}
                icon={Package}
                formatValue={(val) => val.toLocaleString()}
              />
              <StatCard
                title="Receita"
                value={stats.revenue}
                growth={stats.revenueGrowth}
                icon={DollarSign}
                formatValue={(val) => `R$${val.toLocaleString()}`}
              />
              <StatCard
                title="Estoque Total"
                value={stats.totalStock}
                growth={stats.stockGrowth}
                icon={TrendingUp}
                formatValue={(val) => val.toLocaleString()}
              />
              <StatCard
                title="Clientes"
                value={stats.customers}
                growth={stats.customersGrowth}
                icon={Users}
                formatValue={(val) => val.toLocaleString()}
              />
            </div>

            {/* Ações rápidas */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <Button
                  onClick={() => router.push("/products")}
                  className="w-full justify-start p-4 h-auto"
                  variant="outline"
                >
                  <Package className="w-5 h-5 mr-3 text-zinc-900 dark:text-zinc-400" />
                  <div className="text-left">
                    <div className="font-medium text-zinc-900 dark:text-zinc-400">
                      Gerenciar Produtos
                    </div>
                    <div className="text-sm text-gray-500 dark:text-zinc-400">
                      Ver e editar produtos
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => router.push("/products/new")}
                  className="w-full justify-start p-4 h-auto"
                  variant="outline"
                >
                  <PackagePlus className="w-5 h-5 mr-3 text-zinc-900 dark:text-zinc-400" />
                  <div className="text-left">
                    <div className="font-medium text-zinc-900 dark:text-zinc-400">
                      Adicionar Produto
                    </div>
                    <div className="text-sm text-gray-500 dark:text-zinc-400">
                      Criar novo produto
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => router.push("/reports")}
                  className="w-full justify-start p-4 h-auto"
                  variant="outline"
                >
                  <TrendingUp className="w-5 h-5 mr-3 text-zinc-900 dark:text-zinc-400" />
                  <div className="text-left">
                    <div className="font-medium text-zinc-900 dark:text-zinc-400">
                      Ver Relatórios
                    </div>
                    <div className="text-sm text-gray-500 dark:text-zinc-400">Analisar dados</div>
                  </div>
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
