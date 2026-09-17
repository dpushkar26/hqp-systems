import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { label: 'Hotels Onboarded', value: '500+' },
    { label: 'Orders Processed', value: '2M+' },
    { label: 'Guest Satisfaction', value: '98%' },
    { label: 'System Uptime', value: '99.9%' },
  ];

  const team = [
    { name: 'Sarah Jenkins', role: 'CEO & Founder', image: 'https://i.pravatar.cc/300?img=47' },
    { name: 'Michael Chen', role: 'Head of Product', image: 'https://i.pravatar.cc/300?img=11' },
    { name: 'Elena Rodriguez', role: 'VP of Hospitality', image: 'https://i.pravatar.cc/300?img=5' },
    { name: 'David Smith', role: 'Lead Engineer', image: 'https://i.pravatar.cc/300?img=12' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 lg:pt-52 lg:pb-32 px-6 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <AnimatedSection>
            <p className="font-mono text-[#9ca986] text-sm tracking-widest uppercase mb-8">Our Mission</p>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] tracking-tight text-gray-900 mb-8 max-w-4xl mx-auto">
              We build tools for the hospitality of tomorrow.
            </h1>
            <p className="font-sans text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-light">
              Seamless, intuitive software that helps hoteliers streamline room service, delight guests, and manage complex F&B operations effortlessly.
            </p>
            <Link href="/contact" className="inline-flex px-8 py-3 bg-gray-900 text-white rounded-full font-sans text-sm font-medium hover:bg-[#9ca986] transition-colors items-center gap-2">
              Work with us <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="font-serif text-[clamp(2.5rem,4vw,4rem)] leading-none mb-4 text-gray-900 tracking-tight">{stat.value}</div>
                <div className="font-mono text-gray-400 text-[10px] uppercase tracking-widest">{stat.label}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <AnimatedSection className="mb-20 text-center">
            <p className="font-mono text-[#9ca986] text-sm tracking-widest uppercase mb-6">Leadership</p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900">
              The team behind Area.
            </h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <AnimatedSection key={index} delay={index * 0.1} className="group flex flex-col items-center text-center">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-gray-50 group-hover:border-[#9ca986] transition-colors">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
                <h3 className="font-serif text-2xl text-gray-900 tracking-tight">{member.name}</h3>
                <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mt-2">{member.role}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
