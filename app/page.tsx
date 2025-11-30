import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PWAInstallButton from "@/components/pwa/PWAInstallButton";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <PWAInstallButton />
    </div>
  );
}
