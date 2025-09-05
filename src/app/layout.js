import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./globals.css";
import { ModalIntroName } from "./common";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: ModalIntroName,
  description: `Portfolio of ${ModalIntroName}`,
  icons: {
    icon: "/profile.jpg?v=2",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <title>{ModalIntroName}</title>

        {/* <meta name="description" content="Trending IT Training Solution" />
        <meta name="keywords" content="  IT Training, WYNXIO, WYNXIO IT Training, Best IT Training in the world, Fastest growing IT training, programming training, CSS, Python,React " /> */}


        {/* Open Graph */}
        {/* <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.wynxio.com" />
        <meta property="og:title" content={ModalIntroName} />
        <meta property="og:description" content={`Portfolio of ${ModalIntroName}`} />
        <meta property="og:image" content="/profile.jpg" /> */}

        {/* Twitter */}
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ModalIntroName} />
        <meta name="twitter:description" content={`Portfolio of ${ModalIntroName}`} />
        <meta name="twitter:image" content="/profile.jpg"  /> */}





      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}
