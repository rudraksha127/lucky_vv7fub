import { useEffect } from 'react'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import StatsSection from '../components/landing/StatsSection'
import TracksSection from '../components/landing/TracksSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorks from '../components/landing/HowItWorks'
import CreatureSection from '../components/landing/CreatureSection'
import ProblemPreview from '../components/landing/ProblemPreview'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'
import CustomCursor from '../components/ui/CustomCursor'
import JsonLd from '../components/seo/JsonLd'
import useDeviceTier from '../hooks/useDeviceTier'

export default function LandingPage() {
  const tier = useDeviceTier()

  useEffect(() => {
    // Lenis smooth scroll — only for high-tier devices
    if (tier === 'low') return

    let lenis
    async function initLenis() {
      const Lenis = (await import('lenis')).default
      lenis = new Lenis({
        lerp: tier === 'mid' ? 0.12 : 0.08,
        smoothWheel: true,
      })

      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }

    initLenis()

    return () => {
      lenis?.destroy()
    }
  }, [tier])

  return (
    <div className="min-h-screen bg-dark-900">
      {/* SEO Structured Data */}
      <JsonLd type="WebApplication" />
      <JsonLd
        type="FAQPage"
        faqs={[
          {
            question: 'What is AlgoZen?',
            answer:
              "AlgoZen is India's first gamified DSA learning platform with AI mentorship, real-time battles, and interactive visualizations.",
          },
          {
            question: 'Is AlgoZen free?',
            answer:
              'Yes! AlgoZen is free forever on the Rookie tier. Paid plans unlock warrior and legend features.',
          },
          {
            question: 'How does the creature work?',
            answer:
              'Your creature evolves as you solve problems and level up. Keep your streak alive or it goes dormant!',
          },
        ]}
      />

      {/* Custom cursor (high/mid tier only) */}
      {tier !== 'low' && <CustomCursor />}

      <Navbar />
      <HeroSection />
      <StatsSection />
      <TracksSection />
      <FeaturesSection />
      <HowItWorks />
      <CreatureSection />
      <ProblemPreview />
      <CTASection />
      <Footer />
    </div>
  )
}
