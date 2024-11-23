import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";
import { Dancing_Script } from "next/font/google";

const dancingScript = Dancing_Script({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Vote for Fun",
    description: "Vote for Fun",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
