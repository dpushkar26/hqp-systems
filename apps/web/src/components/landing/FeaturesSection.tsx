"use client";

import { LineChart, Globe, MessageSquare, TrendingUp } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        <div className="mb-16 md:mb-24 max-w-2xl">
          <p className="font-mono text-[#9ca986] text-sm tracking-wide mb-6">Benefits</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 tracking-tight">
            We've cracked the code.
          </h2>
          <p className="font-sans text-gray-500 text-lg md:text-xl font-light">
            Area provides real insights, without the data overload.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-16 md:pt-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            
            {/* Column 1 */}
            <div>
              <LineChart className="w-6 h-6 text-black mb-6" strokeWidth={2} />
              <h3 className="font-serif text-xl text-gray-900 mb-4 tracking-tight">Amplify Insights</h3>
              <p className="font-sans text-gray-500 text-sm leading-relaxed font-light">
                Unlock data-driven decisions with comprehensive analytics, revealing key opportunities for strategic regional growth.
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <Globe className="w-6 h-6 text-black mb-6" strokeWidth={2} />
              <h3 className="font-serif text-xl text-gray-900 mb-4 tracking-tight">Control Your Global Presence</h3>
              <p className="font-sans text-gray-500 text-sm leading-relaxed font-light">
                Manage and track satellite offices, ensuring consistent performance and streamlined operations everywhere.
              </p>
            </div>

            {/* Column 3 */}
            <div>
              <MessageSquare className="w-6 h-6 text-black mb-6" strokeWidth={2} />
              <h3 className="font-serif text-xl text-gray-900 mb-4 tracking-tight">Remove Language Barriers</h3>
              <p className="font-sans text-gray-500 text-sm leading-relaxed font-light">
                Adapt to diverse markets with built-in localization for clear communication and enhanced user experience.
              </p>
            </div>

            {/* Column 4 */}
            <div>
              <TrendingUp className="w-6 h-6 text-black mb-6" strokeWidth={2} />
              <h3 className="font-serif text-xl text-gray-900 mb-4 tracking-tight">Visualize Growth</h3>
              <p className="font-sans text-gray-500 text-sm leading-relaxed font-light">
                Generate precise, visually compelling reports that illustrate your growth trajectories across all regions.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
