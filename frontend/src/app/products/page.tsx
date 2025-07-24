"use client";
import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus, Trash, MoreHorizontal, Search } from "lucide-react";
import { ProductViewDialog } from "@/components/ui/product-view-dialog";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  status?: "active" | "out-of-stock" | "draft";
}

type ProductFull = {
  name: string;
  description: string;
  price: number;
  stock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState("");
  const [viewProduct, setViewProduct] = useState<ProductFull | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<
    | "id_desc"
    | "id_asc"
    | "price_desc"
    | "price_asc"
    | "stock_desc"
    | "stock_asc"
    | "name_asc"
    | "name_desc"
  >("id_desc");

  // Busca todos os produtos da API
  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Erro ao buscar produtos: " + err.message);
      } else {
        toast.error("Erro desconhecido ao buscar produtos");
      }
    } finally {
      setLoading(false);
    }
  }

  // Busca todas as categorias únicas cadastradas
  async function fetchCategories() {
    try {
      const res = await api.get("/products/categories");
      setCategories(res.data);
    } catch (err: unknown) {
      console.error("Erro ao buscar categorias:", err);
    }
  }

  // Protege a rota: redireciona para login se não estiver autenticado
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.replace("/login");
    }
  }, [router]);

  // Busca produtos e categorias ao carregar a página
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Debounce para busca (evita requisições a cada tecla)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Abre o modal de confirmação para deletar
  async function handleDelete(id: number) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  // Confirma a exclusão do produto
  async function confirmDelete() {
    if (deleteId == null) return;
    setConfirmOpen(false);
    try {
      await api.delete(`/products/${deleteId}`);
      setProducts(products.filter((p) => p.id !== deleteId));
      toast.success("Produto excluído com sucesso");
    } catch {
      toast.error("Erro ao excluir produto");
    } finally {
      setDeleteId(null);
    }
  }

  // Filtra produtos por busca e categoria
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            product.description.toLowerCase().includes(debouncedSearch.toLowerCase())) &&
          (selectedCategory === "all" || product.category === selectedCategory)
      ),
    [products, debouncedSearch, selectedCategory]
  );

  // Ordena produtos conforme o campo selecionado
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    if (sortField === "id_desc") {
      arr.sort((a, b) => b.id - a.id);
    } else if (sortField === "id_asc") {
      arr.sort((a, b) => a.id - b.id);
    } else if (sortField === "price_desc") {
      arr.sort((a, b) => b.price - a.price);
    } else if (sortField === "price_asc") {
      arr.sort((a, b) => a.price - b.price);
    } else if (sortField === "stock_desc") {
      arr.sort((a, b) => b.stock - a.stock);
    } else if (sortField === "stock_asc") {
      arr.sort((a, b) => a.stock - b.stock);
    } else if (sortField === "name_asc") {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortField === "name_desc") {
      arr.sort((a, b) => b.name.localeCompare(a.name));
    }
    return arr;
  }, [filteredProducts, sortField]);

  // Paginação dos produtos
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(
    () => sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [sortedProducts, currentPage]
  );

  // Sempre volta para a página 1 ao filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      {/* Modal de visualização do produto */}
      <ProductViewDialog
        open={!!viewProduct}
        onOpenChange={(open) => setViewProduct(open ? viewProduct : null)}
        product={viewProduct}
      />
      {/* Modal de confirmação de exclusão */}
      <ConfirmDialog
        open={confirmOpen}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        message="Tem certeza que deseja excluir este produto?"
      />
      <div className="max-w-5xl mx-auto px-2">
        <div className="bg-background rounded-xl border shadow-sm my-5 p-2 sm:p-6">
          <div className="mb-2 h-auto flex flex-row items-center justify-between gap-2 w-full">
            <h1 className="text-lg sm:text-3xl font-bold tracking-tight w-full">
              <span className="block sm:hidden">Gerenciar Produtos</span>
              <span className="hidden sm:block">Gerenciamento de Produtos</span>
            </h1>
            <Button
              onClick={() => router.push("/products/new")}
              className="text-zinc-900 font-bold dark:text-white px-3 sm:px-6 py-2 rounded-md shadow bg-[#20cfc7] hover:bg-[#20cfc7]/70 flex items-center justify-center"
            >
              <span className="hidden sm:inline">Adicionar Produto </span>
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          {/* Filtros de busca, categoria e ordenação */}
          <div className="flex justify-between flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 my-6 w-full">
            <div className="relative w-full sm:w-4/5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-5 h-5" />
              </span>
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar produtos..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-muted/10 w-full"
              />
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-4 items-center w-full">
              <Label className="text-sm">Categoria:</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-auto min-w-[140px]">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="text-sm">Ordenar por:</Label>
              <Select
                value={sortField}
                onValueChange={(v) =>
                  setSortField(
                    v as
                      | "id_desc"
                      | "id_asc"
                      | "price_desc"
                      | "price_asc"
                      | "stock_desc"
                      | "stock_asc"
                      | "name_asc"
                      | "name_desc"
                  )
                }
              >
                <SelectTrigger className="w-auto min-w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id_desc">Mais recente</SelectItem>
                  <SelectItem value="id_asc">Mais antigo</SelectItem>
                  <SelectItem value="price_desc">Preço: Maior para Menor</SelectItem>
                  <SelectItem value="price_asc">Preço: Menor para Maior</SelectItem>
                  <SelectItem value="stock_desc">Estoque: Maior para Menor</SelectItem>
                  <SelectItem value="stock_asc">Estoque: Menor para Maior</SelectItem>
                  <SelectItem value="name_asc">Nome: A-Z</SelectItem>
                  <SelectItem value="name_desc">Nome: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto w-full min-w-[340px]">
            {/* Tabela de produtos */}
            <Table className="w-full text-xs sm:text-sm min-w-[600px]">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="p-2 sm:p-4 text-left font-semibold w-48 sm:w-64">
                    Produto
                  </TableHead>
                  <TableHead className="p-2 sm:p-4 text-left font-semibold w-28 sm:w-40">
                    Categoria
                  </TableHead>
                  <TableHead className="p-2 sm:p-4 text-right font-semibold w-20 sm:w-32">
                    Preço
                  </TableHead>
                  <TableHead className="p-2 sm:p-4 text-right font-semibold w-16 sm:w-24">
                    Estoque
                  </TableHead>
                  <TableHead className="p-2 sm:p-4 text-center font-semibold w-8 sm:w-12">
                    {" "}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-8 text-center text-muted-foreground">
                      <LoadingSpinner size={24} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="p-4 text-destructive bg-destructive/10 rounded"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-8 text-center text-muted-foreground">
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product, idx) => {
                    const category = product.category;
                    return (
                      <TableRow
                        key={product.id}
                        className={
                          `bg-background hover:bg-muted/30 transition-all border-b last:border-0 ` +
                          (idx % 2 === 1 ? "bg-muted/40" : "")
                        }
                        style={{ height: 64 }}
                      >
                        <TableCell className="p-2 sm:p-4 flex items-center gap-2 sm:gap-4">
                          {/* Avatar do produto (primeira letra) */}
                          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center font-bold text-lg text-muted-foreground uppercase">
                            {product.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-base text-foreground leading-tight">
                              {product.name}
                            </div>
                            <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                          </div>
                        </TableCell>
                        <TableCell className="p-2 sm:p-4 text-muted-foreground">
                          {category}
                        </TableCell>
                        <TableCell className="p-2 sm:p-4 text-right font-semibold text-foreground">
                          R${product.price.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={"p-2 sm:p-4 text-right font-semibold text-foreground"}
                        >
                          {product.stock}
                        </TableCell>
                        <TableCell className="p-2 sm:p-4 text-center">
                          {/* Menu de ações (visualizar, editar, excluir) */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="rounded-full">
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              sideOffset={4}
                              className="z-50 min-w-[140px] rounded-md border bg-popover p-1 shadow-md"
                            >
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent cursor-pointer text-sm"
                                onSelect={() =>
                                  setViewProduct({
                                    name: product.name,
                                    description: product.description,
                                    price: product.price,
                                    stock: product.stock,
                                  })
                                }
                              >
                                <Eye className="w-4 h-4" /> Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent cursor-pointer text-sm"
                                onSelect={() => router.push(`/products/${product.id}/edit`)}
                              >
                                <Pencil className="w-4 h-4" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="my-1 h-px bg-border" />
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-destructive/20 text-[#ff0000] cursor-pointer text-sm"
                                onSelect={() => handleDelete(product.id)}
                              >
                                <Trash className="w-4 h-4" color="#ff0000" /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {/* Paginação */}
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
