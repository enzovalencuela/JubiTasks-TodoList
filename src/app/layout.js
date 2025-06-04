import { Dosis } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./layout.client";

const dosis = Dosis({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "JubiTasks",
  description: "Gerencie suas tarefas com o seu amigo Jubileu!",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    title: "JubiTasks",
    description: "Gerencie suas tarefas com o seu amigo Jubileu!",
    images: ["/favicon.ico"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <RootLayoutClient dosis={dosis}>{children}</RootLayoutClient>
    </html>
  );
}
