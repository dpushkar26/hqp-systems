import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { LeadCapture } from '@/components/ui/LeadCapture';
import { BarChart3, Clock, UtensilsCrossed, Smartphone } from 'lucide-react';

export default function OwnersPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      
      <div className="pt-32 pb-16 md:pt-48 md:pb-24 max-w-[1200px] mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <p className="font-mono text-[#9ca986] text-sm tracking-wide mb-6">For Restaurant Owners</p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-none text-gray-900 mb-8 tracking-tight">
            Increase revenue. <br /> Decrease chaos.
          </h1>
          <p className="font-sans text-xl text-gray-500 font-light max-w-2xl">
            Area is designed to boost your bottom line by increasing table turnover, raising average ticket sizes, and streamlining your entire front and back of house operations.
          </p>
        </AnimatedSection>
      </div>

      <div className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <AnimatedSection delay={0.1}>
              <div className="w-12 h-12 bg-[#131b25] rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-[#9ca986]" />
              </div>
              <h3 className="font-serif text-xl mb-3 tracking-tight">Higher Ticket Sizes</h3>
              <p className="font-sans text-gray-500 font-light text-sm">Visual digital menus and intelligent upselling prompts consistently drive a 15-20% increase in average order value.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="w-12 h-12 bg-[#131b25] rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-[#9ca986]" />
              </div>
              <h3 className="font-serif text-xl mb-3 tracking-tight">Faster Turnover</h3>
              <p className="font-sans text-gray-500 font-light text-sm">Guests order and pay on their own time. No more waiting for staff to bring the menu, take the order, or process the check.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="w-12 h-12 bg-[#131b25] rounded-2xl flex items-center justify-center mb-6">
                <UtensilsCrossed className="w-6 h-6 text-[#9ca986]" />
              </div>
              <h3 className="font-serif text-xl mb-3 tracking-tight">Kitchen Efficiency</h3>
              <p className="font-sans text-gray-500 font-light text-sm">Orders flow directly to the digital KDS, reducing human error and keeping your kitchen synchronized during peak hours.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="w-12 h-12 bg-[#131b25] rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6 text-[#9ca986]" />
              </div>
              <h3 className="font-serif text-xl mb-3 tracking-tight">Staff Empowerment</h3>
              <p className="font-sans text-gray-500 font-light text-sm">Free your servers from transactional tasks so they can focus on hospitality, resulting in better service and higher tips.</p>
            </AnimatedSection>
          </div>
        </div>
      </div>

      <LeadCapture 
        title="Ready to take control?"
        description="Join thousands of owners who have modernized their restaurants with Area. Get a personalized demo of the owner dashboard."
        buttonText="Book a Demo"
      />

      <Footer />
    </div>
  );
}
