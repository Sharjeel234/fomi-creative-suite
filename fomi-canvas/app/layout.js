
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// --------------------------------------------------
// Typography
// --------------------------------------------------

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// --------------------------------------------------
// Application Metadata
// --------------------------------------------------

export const metadata = {
  title: {
    default: "Fomi Canvas — Explore Creative Directions",
    template: "%s | Fomi Canvas",
  },
  description:
    "An interactive creative workspace for exploring visual concepts, branching ideas, comparing directions, and refining AI-inspired imagery.",
  applicationName: "Fomi Canvas",
  robots: {
    index: false,
    follow: false,
  },
};

// --------------------------------------------------
// Root Layout
// --------------------------------------------------

const RootLayout = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
