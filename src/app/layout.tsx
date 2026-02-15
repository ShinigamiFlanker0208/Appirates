import type { Metadata } from "next";
import "./globals.css";

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
        <body className="antialiased">{children}</body>
        </html>
    );
}