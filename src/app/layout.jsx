import { Roboto } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import NextTopLoader from "nextjs-toploader";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = {
  title: "SCANDOQ | An Automated Document Management Platform",
  description: "An Automated Document Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className=" bg-background text-foreground">
      <body className={`${roboto.className} bg-[var(--primary-gradient)]`}>
        <AuthProvider>
          <NextTopLoader color="#005cdc" showSpinner={false} />
          {children}
          <ToastContainer autoClose={2500} position="bottom-center" />
        </AuthProvider>
      </body>
    </html>
  );
}