import Header from '../components/landing/Header'
import HeroSection from '../components/landing/HeroSection'
import TrustSection from '../components/landing/TrustSection'
import FeaturedPGSection from '../components/landing/FeaturedPGSection'
import PopularCities from '../components/landing/PopularCities'
import WhyHomiePG from '../components/landing/WhyHomiePG'
import HowItWorks from '../components/landing/HowItWorks'
import OwnerSection from '../components/landing/OwnerSection'
import FeaturesGrid from '../components/landing/FeaturesGrid'
import DashboardPreview from '../components/landing/DashboardPreview'
import Testimonials from '../components/landing/Testimonials'
import Pricing from '../components/landing/Pricing'
import FAQ from '../components/landing/FAQ'
import AboutPreview from '../components/landing/AboutPreview'
import ContactCTA from '../components/landing/ContactCTA'
import Newsletter from '../components/landing/Newsletter'
import MobileApp from '../components/landing/MobileApp'
import Footer from '../components/landing/Footer'
import FloatingButtons from '../components/landing/FloatingButtons'

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-inter">
      <Header />
      <main>
        <HeroSection />
        <TrustSection />
        <FeaturedPGSection />
        <PopularCities />
        <WhyHomiePG />
        <HowItWorks />
        <OwnerSection />
        <FeaturesGrid />
        <DashboardPreview />
        <MobileApp />
        <Testimonials />
        <Pricing />
        <AboutPreview />
        <FAQ />
        <ContactCTA />
        <Newsletter />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  )
}
