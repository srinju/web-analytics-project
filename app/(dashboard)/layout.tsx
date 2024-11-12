import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WebWise",
  description: "Web analytics app for web applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <div className="min-w-screen min-h-screen">
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}