import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Json Saver",
  description: "Save all your JSON !",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <head>
        <link href="/jsoneditor.css" rel="stylesheet" type="text/css"/>
      </head>
      <body className={inter.className}>{children}</body>
      </html>
  );
}
