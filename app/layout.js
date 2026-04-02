import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navigastion";
import { Footer7 } from "@/components/ui/footer-7";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";
import { CartProvider } from "@/context/CartContext";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Restyle Fashion Marketplace",
  description: "Community-driven thrift fashion marketplace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased">
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer7 />
              <ToastContainer 
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </CartProvider>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
