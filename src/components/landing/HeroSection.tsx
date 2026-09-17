import Link from 'next/link';
import { GridPulse } from '@/components/ui/grid-pulse';
import { CardsStackContainer, CardSticky } from '@/components/systaliko-ui/cards/cards-stack';

const IMPLEMENTATION_PHASES = [
  {
    id: 'phase-1',
    title: 'Infrastructure Setup',
    description: 'We establish your central command dashboard and synchronize all property locations. Your entire hotel group is mapped securely into a unified cloud environment.',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    numberColor: 'text-[#9ca986]'
  },
  {
    id: 'phase-2',
    title: 'Menu & Inventory Import',
    description: 'Bring your in-room dining, poolside bar, and main restaurant menus online. We configure dynamic pricing, inventory tracking, and VIP tagging instantly.',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-900',
    numberColor: 'text-gray-400'
  },
  {
    id: 'phase-3',
    title: 'Staff Onboarding',
    description: 'Our ultra-minimalist, intuitive interface ensures your hospitality staff is fully trained in minutes, drastically reducing onboarding overhead.',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-900',
    numberColor: 'text-gray-400'
  },
  {
    id: 'phase-4',
    title: 'Live Operations',
    description: 'Watch live orders flow seamlessly from the guest app directly to the kitchen and automatically sync with the final room folio.',
    bgColor: 'bg-gray-900',
    textColor: 'text-white',
    numberColor: 'text-[#9ca986]'
  },
];

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-0 bg-white flex flex-col items-center overflow-clip">
      {/* Grid Pulse Background */}
      <GridPulse className="absolute inset-0 z-0 opacity-80" ambient={6} reach={4} />
      
      {/* Elegant Editorial Headline */}
      <div className="relative z-10 w-full px-6 max-w-[1200px] mx-auto text-center mb-16 lg:mb-24">
        <p className="font-mono text-[#9ca986] text-sm tracking-widest uppercase mb-8">
          The hospitality standard
        </p>
        <h1 
          className="font-serif text-[clamp(3.5rem,8vw,8rem)] leading-[0.95] tracking-tight text-gray-900" 
          data-grid-avoid
        >
          The definitive POS <br className="hidden md:block"/> for modern hotels.
        </h1>
        <p className="mt-10 font-sans text-gray-500 text-xl font-light max-w-2xl mx-auto">
          Streamline room service, table-side ordering, and multi-location inventory from a single, elegant command center.
        </p>
      </div>

      {/* Cards Stack Process Container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-32 lg:py-48">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Side: Sticky Text */}
          <div className="lg:w-1/3 lg:sticky lg:top-40 lg:pb-16">
            <p className="font-mono text-[#9ca986] text-[10px] tracking-widest uppercase mb-6">
              Our Process
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Planning your <br />
              <span className="text-gray-400">implementation</span> <br />
              journey
            </h2>
            <p className="font-sans text-gray-500 font-light text-base lg:text-lg leading-relaxed">
              Our journey begins with a deep dive into your hotel's operations. In the onboarding phase, we engage in meaningful conversations to grasp your unique workflows, menu structures, and the guest experience you want to convey. This sets the stage for a seamless deployment.
            </p>
          </div>

          {/* Right Side: Stacking Cards */}
          <div className="lg:w-2/3 w-full pb-32">
            <CardsStackContainer className="space-y-16">
              {IMPLEMENTATION_PHASES.map((phase, index) => (
                <CardSticky 
                  key={phase.id} 
                  index={index + 1} 
                  className="w-full"
                  style={{ top: 120 + index * 40 }}
                >
                  <div 
                    className={`rounded-[2rem] p-8 sm:p-10 lg:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 backdrop-blur-xl ${phase.bgColor} transition-colors`}
                  >
                    <div className="mb-6 lg:mb-10 flex items-start justify-between gap-4">
                      <h3 className={`font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight ${phase.textColor}`}>
                        {phase.title}
                      </h3>
                      <h4 className={`font-mono text-xl sm:text-2xl tracking-widest ${phase.numberColor}`}>
                        {String(index + 1).padStart(2, '0')}
                      </h4>
                    </div>
                    <p className={`font-sans font-light text-base sm:text-lg leading-relaxed ${phase.textColor} opacity-80`}>
                      {phase.description}
                    </p>
                  </div>
                </CardSticky>
              ))}
            </CardsStackContainer>
          </div>

        </div>
      </div>
    </section>
  );
}
