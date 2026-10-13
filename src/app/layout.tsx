import ConsoleBanner from "@/components/ConsoleBanner";
import Preloader from "@/components/Preloader";
import MobileNav from "@/components/MobileNav";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { AudioProvider } from "@/components/AudioProvider";

export const metadata = {
  title: "Harsh - Portfolio",
  description: "Personal Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/harsh.png" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://cdn.fontshare.com/wf/D7WD5OXZFWQ5T76HSPWAC7MNKAJXE2YG/LUGNSPO5YC34ABNB2O6K7AFDSOJZT56V/WNDVG7O66ENLOD43GS7FBUCC4KMT5OM2.woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AudioProvider>
          <ConsoleBanner />
          <Preloader />
          <MobileNav />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </AudioProvider>
      </body>
    </html>
  );
}
