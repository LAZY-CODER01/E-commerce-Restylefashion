import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navigastion";
import { Footer7 } from "@/components/ui/footer-7";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Restyle Fashion Marketplace",
  description: "Community-driven thrift fashion marketplace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <SearchProvider>
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
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
