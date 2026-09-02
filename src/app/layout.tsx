import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "UnitedAthletes for India Foundation",
    template: "%s | UnitedAthletes for India Foundation",
  },
  description:
    "Empowering athletes across India with opportunities, facilities, equipment and support.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: "var(--font-sans, 'Helvetica Neue', Helvetica, Arial, sans-serif)" }}>
        {children}
      </body>
    </html>
  );
}
