import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { LandingPage } from "@/components/pages/v2";

export default function Home() {
  return (
    <div className="relative flex flex-col">
      <Header />
      <LandingPage />
      <Footer />
    </div>
  );
}
