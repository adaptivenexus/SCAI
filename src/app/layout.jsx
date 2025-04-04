import { Roboto } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = {
  title: "SCAI | An Automated Document Management Platform",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className=" bg-background text-foreground">
      <body className={`${roboto.className} bg-[var(--primary-gradient)]`}>
        <AuthProvider>
          {children}
          <ToastContainer autoClose={2500} position="bottom-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
