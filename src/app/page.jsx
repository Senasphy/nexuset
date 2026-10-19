import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Testimonials from "@/components/Testimonials"
import ComingSoon from "@/components/ComingSoon"
import AboutSection from "@/components/AboutSection"
import Footer from "@/components/Footer"

export default function HomePage() {
  return (
    <div id="top" className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] antialiased">
      <div className="grain-overlay" aria-hidden />
      <Navbar />
      <main id="main">
        <Hero />
        <Features />
        <Testimonials />
        <ComingSoon />
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}
