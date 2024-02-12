import './globals.css';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';
import Script from 'next/script'
import Providers from '../../redux/providers';
 
const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({ params, searchParams }, parent) {
  const _id = "65c8e1dad3c601a36e0dd62f"
  const res = await fetch(`http://localhost:3000/api/settings/${_id}`);
  const meta = await res.json();
  const previousImages = (await parent).openGraph?.images || []
  return {
    title: meta.result.brandTitle,
    description: meta.result.brandIntro,
    keywords: [meta.result.brandTags],
    icons: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico', // Path to your favicon.ico
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/logo.png', // Path to your brand logo
      },
    ],
    // openGraph: {
    //   images: [`/${meta.result.prodImage}`, ...previousImages], //helps sharing of webpages on social media.
    // },
  }
}

export default function RootLayout({ children }) {
  return (
  <>
    <html lang="en">
    <body className={inter.className}>     
        <ToastContainer className="customToast" />
        <Providers>
          <div>
            {children}
          </div>
        </Providers>
      </body>
    </html> 
    <Script src="https://checkout.razorpay.com/v1/checkout.js"/>
  </>
  )
}
