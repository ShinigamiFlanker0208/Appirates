import type { Metadata } from "next";
import "./globals.css";
import StormBackground from "@/components/StormBackground";
import { GlassNavbar } from "@/components/ui/GlassNavbar";
import LenisProvider from "@/components/LenisProvider";

export const metadata: Metadata = {
    title: "Appirates | Navigate the Digital Seas",
    description: "A tech club where innovation meets adventure. We sail through code, conquer challenges, and build the future—one line at a time.",
    keywords: ["Ship Deck", "coding", "programming", "appirates", "technology"],
    authors: [{ name: "Appirates " }],
    openGraph: {
        title: "Appirates | Navigate the Digital Seas",
        description: "A tech club where innovation meets adventure.",
        type: "website",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="antialiased bg-black min-h-screen text-white">
            <LenisProvider>
                <div className="fixed inset-0 z-0">
                    <StormBackground />
                </div>
                <div className="relative z-10 flex flex-col min-h-screen">
                    <GlassNavbar />
                    {children}
                </div>
            </LenisProvider>
        </body>
        </html>
    );
}