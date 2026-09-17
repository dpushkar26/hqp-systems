'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-40 pb-20 lg:pt-52 lg:pb-32">
        <div className="max-w-[1200px] mx-auto px-6">
          
          <AnimatedSection className="mb-24 text-center">
            <p className="font-mono text-[#9ca986] text-sm tracking-widest uppercase mb-8">Contact Us</p>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] tracking-tight text-gray-900 mb-6">
              Let's talk.
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
              Have questions about Area, PMS integrations, or looking for a custom enterprise deployment for your hotel group?
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* Contact Info */}
            <AnimatedSection delay={0.1}>
              <div className="h-full">
                
                <div className="space-y-12">
                  <div className="border-t border-gray-100 pt-8">
                    <h4 className="font-mono text-gray-400 uppercase tracking-widest text-[10px] mb-4">Email Us</h4>
                    <a href="mailto:hello@areahospitality.com" className="font-serif text-3xl hover:text-[#9ca986] transition-colors tracking-tight text-gray-900">hello@areahospitality.com</a>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <h4 className="font-mono text-gray-400 uppercase tracking-widest text-[10px] mb-4">Visit Us</h4>
                    <p className="font-serif text-3xl tracking-tight max-w-sm text-gray-900 leading-snug">100 Innovation Drive, <br/> San Francisco, CA</p>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <h4 className="font-mono text-gray-400 uppercase tracking-widest text-[10px] mb-4">Call Us</h4>
                    <a href="tel:+18001234567" className="font-serif text-3xl hover:text-[#9ca986] transition-colors tracking-tight text-gray-900">+1 (800) 123-4567</a>
                  </div>
                </div>

              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-2xl p-8 lg:p-12 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <h3 className="font-serif text-3xl tracking-tight mb-8 text-gray-900">Send a message.</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                      <input type="text" id="firstName" required className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-900 focus:bg-white outline-none transition-all rounded-lg text-sm" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                      <input type="text" id="lastName" required className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-900 focus:bg-white outline-none transition-all rounded-lg text-sm" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="hotelName" className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Hotel / Group Name</label>
                    <input type="text" id="hotelName" required className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-900 focus:bg-white outline-none transition-all rounded-lg text-sm" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                    <input type="email" id="email" required className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-900 focus:bg-white outline-none transition-all rounded-lg text-sm" />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Subject</label>
                    <select id="subject" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-900 focus:bg-white outline-none transition-all rounded-lg text-sm">
                      <option>Sales & Demo</option>
                      <option>PMS Integration Inquiry</option>
                      <option>Partnership</option>
                      <option>Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Message</label>
                    <textarea id="message" rows={4} required className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-900 focus:bg-white outline-none transition-all resize-none rounded-lg text-sm"></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={formStatus !== 'idle'}
                    className="w-full py-4 bg-gray-900 text-white rounded-full font-sans text-sm font-medium hover:bg-[#9ca986] transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                  >
                    {formStatus === 'idle' && <><Send className="w-4 h-4" /> Send Message</>}
                    {formStatus === 'sending' && 'Sending...'}
                    {formStatus === 'sent' && 'Message Sent!'}
                  </button>
                </form>
              </div>
            </AnimatedSection>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
