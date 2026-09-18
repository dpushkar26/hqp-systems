import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      
      <div className="pt-32 pb-16 md:pt-48 md:pb-24 max-w-[1200px] mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <p className="font-mono text-[#9ca986] text-sm tracking-wide mb-6">Operations</p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-none text-gray-900 mb-8 tracking-tight">
            Designed for <br /> seamless flow.
          </h1>
          <p className="font-sans text-xl text-gray-500 font-light max-w-2xl">
            Area simplifies every step of the hospitality journey, removing friction for both your staff and your guests.
          </p>
        </AnimatedSection>
      </div>

      <div className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 md:gap-32">
            
            {/* Step 1 */}
            <AnimatedSection delay={0.1}>
              <div className="mb-6 font-mono text-xs text-gray-400 tracking-widest uppercase">Step 01</div>
              <h2 className="font-serif text-3xl mb-4 tracking-tight text-gray-900">Scan & Explore</h2>
              <p className="font-sans text-gray-500 font-light leading-relaxed">
                Guests simply scan a beautifully designed QR code placed in their room or at their table. No app downloads or sign-ups required. They are instantly presented with a vibrant, dynamic digital menu customized to their specific location.
              </p>
            </AnimatedSection>

            {/* Step 2 */}
            <AnimatedSection delay={0.2}>
              <div className="mb-6 font-mono text-xs text-gray-400 tracking-widest uppercase">Step 02</div>
              <h2 className="font-serif text-3xl mb-4 tracking-tight text-gray-900">Seamless Ordering</h2>
              <p className="font-sans text-gray-500 font-light leading-relaxed">
                With a few taps, guests can customize their orders and send them directly to the kitchen or bar. The intuitive interface ensures high conversion rates and larger average order sizes through smart upselling.
              </p>
            </AnimatedSection>

            {/* Step 3 */}
            <AnimatedSection delay={0.3}>
              <div className="mb-6 font-mono text-xs text-gray-400 tracking-widest uppercase">Step 03</div>
              <h2 className="font-serif text-3xl mb-4 tracking-tight text-gray-900">Real-time Management</h2>
              <p className="font-sans text-gray-500 font-light leading-relaxed">
                Staff receive the orders instantly on their dedicated Area Dashboard. The kitchen display system organizes tickets by priority, while front-of-house staff can monitor all active tables and rooms at a glance.
              </p>
            </AnimatedSection>

            {/* Step 4 */}
            <AnimatedSection delay={0.4}>
              <div className="mb-6 font-mono text-xs text-gray-400 tracking-widest uppercase">Step 04</div>
              <h2 className="font-serif text-3xl mb-4 tracking-tight text-gray-900">Frictionless Payment</h2>
              <p className="font-sans text-gray-500 font-light leading-relaxed">
                Guests can split the bill or pay instantly using Apple Pay, Google Pay, or any major credit card directly from their device. Staff are freed from handling cards and printing receipts.
              </p>
            </AnimatedSection>

      <Footer />
    </div>
  );
}
