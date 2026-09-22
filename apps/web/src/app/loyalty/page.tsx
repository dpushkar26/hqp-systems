import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { LeadCapture } from '@/components/ui/LeadCapture';
import { Gift, Star, TrendingUp, Users } from 'lucide-react';

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      
      <div className="pt-32 pb-16 md:pt-48 md:pb-24 max-w-[1200px] mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <p className="font-mono text-[#9ca986] text-sm tracking-wide mb-6">Guest Retention</p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-none text-gray-900 mb-8 tracking-tight">
            Turn visitors into <br /> regulars.
          </h1>
          <p className="font-sans text-xl text-gray-500 font-light max-w-2xl">
            Area's built-in digital loyalty program automatically rewards your best guests, increasing repeat visits and lifetime value without any extra effort from your staff.
          </p>
        </AnimatedSection>
      </div>

      <div className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <AnimatedSection delay={0.1}>
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
                <Star className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-serif text-xl mb-3 tracking-tight">Automated Points</h3>
              <p className="font-sans text-gray-500 font-light text-sm">Guests earn points seamlessly with every scan-to-pay transaction. No punch cards or phone numbers required.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
                <Gift className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-serif text-xl mb-3 tracking-tight">Dynamic Rewards</h3>
              <p className="font-sans text-gray-500 font-light text-sm">Set up custom reward tiers—from a free coffee to a complimentary stay. Guests redeem rewards right from their phone.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
                <TrendingUp className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-serif text-xl mb-3 tracking-tight">Data Insights</h3>
              <p className="font-sans text-gray-500 font-light text-sm">Track your most loyal guests, their favorite orders, and overall program ROI directly from your owner dashboard.</p>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
                <Users className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-serif text-xl mb-3 tracking-tight">VIP Segmentation</h3>
              <p className="font-sans text-gray-500 font-light text-sm">Create exclusive VIP tiers for high-spenders, granting them access to secret menu items or priority service.</p>
            </AnimatedSection>
          </div>
        </div>
      </div>

      <LeadCapture 
        title="Start building loyalty today."
        description="See how Area's digital loyalty program can increase your guest retention by over 30%."
        buttonText="Get Early Access"
      />

      <Footer />
    </div>
  );
}
