import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import MobileBottomNav from "@/components/landing/MobileBottomNav";

export const metadata: Metadata = {
  title: {
    default: "EA - English Action | Bimbingan Belajar Multidisiplin Cirebon",
    template: "%s | English Action"
  },
  description: "English Action adalah pusat bimbingan belajar multidisiplin di Cirebon yang berfokus pada Bahasa Inggris, Matematika, Calistung, PRISMA, dan Preschool. Be Brave to Act!",
  keywords: ["Bimbel Cirebon", "Kursus Bahasa Inggris Cirebon", "Les Calistung Cirebon", "Metode PRISMA", "Pendidikan Anak Cirebon", "English Action"],
  authors: [{ name: "English Action Management" }],
  creator: "English Action",
  publisher: "English Action",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "EA - English Action | Be Brave to Act",
    description: "Pusat bimbingan belajar inovatif di Cirebon untuk masa depan cerah anak Anda.",
    url: "https://englishaction-cirebon.com",
    siteName: "English Action",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EA - English Action | Be Brave to Act",
    description: "Pusat bimbingan belajar inovatif di Cirebon.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
        <MobileBottomNav />
      </body>
    </html>
  );
}
