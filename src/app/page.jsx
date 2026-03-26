import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Testimonials from "./components/Testimonials"
import Features from "./components/Features"
import ComingSoon from "./components/ComingSoon"
import AboutSection from "./components/AboutSection"
import Footer from "./components/Footer"

export default function HomePage() {
  return (
    <div id="top" className="bg-[var(--landing-section-alt)] text-[var(--text-primary)]">
      <Navbar />
      <main>
        <Hero />
        <Testimonials />
        <Features />
        <ComingSoon />
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}
