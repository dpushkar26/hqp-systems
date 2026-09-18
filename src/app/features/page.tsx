import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      
      <div className="pt-32 pb-16 md:pt-48 md:pb-24 max-w-[1200px] mx-auto px-6 lg:px-8">
        <AnimatedSection>
          <p className="font-mono text-[#9ca986] text-sm tracking-wide mb-6">Platform Capabilities</p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-none text-gray-900 mb-8 tracking-tight">
            Everything you need. <br /> Nothing you don't.
          </h1>
          <p className="font-sans text-xl text-gray-500 font-light max-w-2xl">
            Our platform is built on modern web technologies, delivering blazing fast performance and a beautiful aesthetic that guests and staff will love.
          </p>
        </AnimatedSection>
      </div>

      <FeaturesSection />
      
      <div className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <AnimatedSection delay={0.2}>
             <div className="grid md:grid-cols-2 gap-16">
               <div>
                 <h2 className="font-serif text-4xl mb-6 tracking-tight">For Hoteliers</h2>
                 <ul className="space-y-4 font-sans text-gray-500 font-light">
                   <li className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-[#9ca986] rounded-full"></span>
                     Real-time order management dashboard
                   </li>
                   <li className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-[#9ca986] rounded-full"></span>
                     Dynamic menu creation and editing
                   </li>
                   <li className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-[#9ca986] rounded-full"></span>
                     Comprehensive sales analytics and reporting
                   </li>
                   <li className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-[#9ca986] rounded-full"></span>
                     Table and room management integration
                   </li>
                 </ul>
               </div>
               <div>
                 <h2 className="font-serif text-4xl mb-6 tracking-tight">For Guests</h2>
                 <ul className="space-y-4 font-sans text-gray-500 font-light">
                   <li className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-[#131b25] rounded-full"></span>
                     Frictionless QR code ordering
                   </li>
                   <li className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-[#131b25] rounded-full"></span>
                     Beautiful, responsive digital menus
                   </li>
                   <li className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-[#131b25] rounded-full"></span>
                     Secure and instant payment processing
                   </li>
                   <li className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-[#131b25] rounded-full"></span>
                     Live order status tracking
                   </li>
                 </ul>
               </div>
             </div>
          </AnimatedSection>
        </div>
      </div>

      <Footer />
    </div>
  );
}
