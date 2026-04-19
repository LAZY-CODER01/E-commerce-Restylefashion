import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navigastion";
import ConditionalFooter from "@/components/ConditionalFooter";
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans">
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
              <Navbar />
              {children}
              <ConditionalFooter />
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
