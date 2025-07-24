import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "B4you",
  description:
    "A B4YOU é a plataforma definitiva para marcas que querem potencializar as vendas, ter total controle da operação e escalar com creators afiliados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
