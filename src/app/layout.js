"use client";
import './globals.css';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';
import Script from 'next/script'
import Providers from '../../redux/providers';
import { usePathname } from 'next/navigation';
import NavBar from '@/components/NavBar/page';
     
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  
   const pathName = usePathname();

  return (
    <>
      <Providers>
        <html lang="en">
          <body className={inter.className}>
            <ToastContainer className="customToast" />
            {pathName.startsWith("/dashboard") ? null : <NavBar />} 
            <div>{children}</div>
          </body>
        </html>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </Providers>
    </>
  );
}