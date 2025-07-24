"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ThemeSwitch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { LogIn } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLogged(!!localStorage.getItem("token"));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <nav className="w-full flex justify-between items-center px-6 py-3 bg-background border-b shadow-sm mb-8">
      <Link href="/">
        <Image
          src={currentTheme === "dark" ? "/logo-white.png" : "/logo.png"}
          alt="logo"
          width={100}
          height={100}
        />
      </Link>
      <div className="flex items-center gap-2">
        <ThemeSwitch />
        {isLogged ? (
          <Button
            onClick={() => {
              handleLogout();
              toast.success("Logout realizado com sucesso");
            }}
            variant="destructive"
            className="px-4"
          >
            Sair <LogOut className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => router.push("/login")}
            className="px-4 bg-[#20cfc7] hover:bg-[#20cfc7]/70"
          >
            Entrar <LogIn className="w-4 h-4" />
          </Button>
        )}
      </div>
    </nav>
  );
}
