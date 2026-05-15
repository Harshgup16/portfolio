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
