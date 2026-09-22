'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Boutique',
      description: 'Perfect for independent boutique hotels and small resorts.',
      price: isAnnual ? '149' : '179',
      features: [
        'Up to 50 Rooms',
        'In-Room Dining Module',
        '1 F&B Outlet POS',
        'Basic Analytics',
        'Standard Email Support'
      ],
      popular: false,
    },
    {
      name: 'Luxury Resort',
      description: 'Ideal for large resorts with multiple F&B outlets.',
      price: isAnnual ? '399' : '449',
      features: [
        'Up to 300 Rooms',
        'Unlimited F&B Outlets',
        'Poolside & Cabana Ordering',
        'Advanced Revenue Analytics',
        'Priority Phone Support',
        'Custom PMS Integration'
      ],
      popular: true,
    },
    {
      name: 'Enterprise Chain',
      description: 'For global hospitality groups requiring central management.',
      price: isAnnual ? '899' : '999',
      features: [
        'Unlimited Rooms & Properties',
        'Multi-Property Dashboard',
        'Global Menu Management',
        'White-label Guest App',
        'Dedicated Success Manager',
        'Custom API Workflows'
      ],
      popular: false,
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-40 pb-24 lg:pt-52">
        <div className="max-w-[1200px] mx-auto px-6">
          
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
            <p className="font-mono text-[#9ca986] text-sm tracking-widest uppercase mb-8">Pricing</p>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] tracking-tight text-gray-900 mb-8">
              Transparent scaling.
            </h1>
            <p className="text-xl text-gray-500 mb-12 font-light">
              Choose the tier that best fits your hotel's operational complexity.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-6">
              <span className={`font-mono text-[10px] uppercase tracking-widest ${!isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-200 transition-colors focus:outline-none"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isAnnual ? 'translate-x-7 bg-[#9ca986]' : 'translate-x-1'}`} />
              </button>
              <span className={`font-mono text-[10px] uppercase tracking-widest flex items-center gap-3 ${isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>
                Annually
                <span className="px-2 py-1 rounded-sm bg-[#f2f4ef] text-[#9ca986] text-[10px]">Save 20%</span>
              </span>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, index) => (
              <AnimatedSection key={plan.name} delay={index * 0.1} className={`relative bg-white rounded-2xl p-8 lg:p-10 border transition-all ${plan.popular ? 'border-[#9ca986] shadow-lg' : 'border-gray-100 hover:border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-8">
                    <span className="bg-[#9ca986] text-white px-4 py-1 rounded-full font-mono text-[10px] tracking-widest uppercase">Most Popular</span>
                  </div>
                )}
                
                <h3 className="font-serif text-2xl tracking-tight text-gray-900 mb-4">{plan.name}</h3>
                <p className="text-gray-500 text-sm font-light h-12">{plan.description}</p>
                
                <div className="mt-8 mb-10 pb-10 border-b border-gray-100">
                  <span className="font-serif text-5xl tracking-tighter text-gray-900">${plan.price}</span>
                  <span className="text-gray-500 font-mono tracking-widest uppercase text-[10px] ml-2">/mo</span>
                  {isAnnual && <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mt-4">billed annually</p>}
                </div>
                
                <button className={`w-full py-3 rounded-full font-sans text-sm font-medium transition-colors mb-10 ${plan.popular ? 'bg-gray-900 text-white hover:bg-[#9ca986]' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}>
                  Select Plan
                </button>
                
                <div className="space-y-4">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-start gap-4">
                      <div className="mt-0.5">
                        <Check className="w-4 h-4 text-[#9ca986]" strokeWidth={2} />
                      </div>
                      <span className="text-gray-600 text-sm font-light">{feature}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4} className="mt-32 border-t border-gray-100 pt-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h4 className="font-serif text-3xl tracking-tight text-gray-900 mb-4">Need a custom integration?</h4>
              <p className="font-sans font-light text-gray-500 max-w-xl">We offer custom PMS integrations, bespoke guest app white-labeling, and dedicated SLAs for global luxury chains.</p>
            </div>
            <Link href="/contact" className="px-8 py-3 bg-white border border-gray-200 text-gray-900 rounded-full font-sans text-sm font-medium hover:border-gray-900 transition-colors whitespace-nowrap flex items-center gap-2">
              Contact Sales <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>

        </div>
      </main>

      <Footer />
    </div>
  );
}
