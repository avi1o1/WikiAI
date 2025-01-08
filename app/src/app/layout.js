import localFont from "next/font/local";
import "./globals.css";

export const metadata = {
  title: "WikiAI",
  description: "Feel heard, feel healed.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
