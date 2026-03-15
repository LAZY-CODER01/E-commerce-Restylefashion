import "./globals.css";
import Navbar from "@/components/Navigastion";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Restyle Fashion Marketplace",
  description: "Community-driven thrift fashion marketplace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
