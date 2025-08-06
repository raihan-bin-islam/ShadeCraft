import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { LandingPage } from "@/components/pages/v2";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-dvh md:min-h-auto justify-between md:justify-start">
      <Header />
      <LandingPage />
      <Footer />
    </div>
  );
}
