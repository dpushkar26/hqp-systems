'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { StampProgress } from '@/components/ui/stamp-progress';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Features8 } from '@/components/ui/features-8';

export default function FeaturesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div 
      className="min-h-screen selection:bg-black selection:text-white"
      style={{
        '--bg': '#FFFFFF',
        '--bg-soft': '#F9F9F9',
        '--bg-softer': '#F0F0F0',
        '--accent': '#000000',
        '--accent-dim': '#333333',
        '--text': '#000000',
        '--text-muted': '#666666',
        '--line': 'rgba(0,0,0,0.08)',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
      } as React.CSSProperties}
    >
      <Navbar />
      
      {/* 1. Hero Section */}
      <section className="pt-20 pb-8 md:pt-28 md:pb-12 max-w-[1100px] mx-auto px-6 lg:px-8 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <AnimatedSection>
            <h1 className="font-serif font-medium text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-5">
              Every feature starts with one scan.
            </h1>
            <p className="font-sans text-base md:text-lg text-[var(--text-muted)] font-light leading-relaxed mb-6 max-w-lg">
              Firse turns a table into a live order and a phone number into a remembered regular — without asking your customers to install anything or your staff to learn anything new.
            </p>
            {/* TODO: real pilot-owner quote goes here once available */}
          </AnimatedSection>
          
          {/* Hero Image */}
          <motion.div 
            className="relative w-full hidden md:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img 
              src="/qrfeatureimage.png" 
              alt="Feature QR Ordering" 
              className="w-full h-auto max-w-sm object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Feature strip (Premium Highlight) */}
      <Features8 />

      {/* 3. Showcase band */}
      <section className="bg-[var(--bg-soft)] border-y border-[var(--line)] py-12 md:py-16 overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            
            {/* Abstract Graphic */}
            <motion.div 
              className="relative h-[280px] w-full order-2 md:order-1 bg-white border border-[var(--line)] rounded-2xl p-5 shadow-sm flex flex-col gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Fake UI Header */}
              <div className="flex justify-between items-center border-b border-[var(--line)] pb-3">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                </div>
                <div className="w-20 h-3 bg-gray-100 rounded-full"></div>
              </div>
              {/* Fake UI Content */}
              <div className="flex-1 grid grid-cols-3 gap-3 pt-2">
                <div className="col-span-1 bg-gray-50 rounded-lg p-3 flex flex-col gap-2">
                  <div className="w-full h-6 bg-gray-200 rounded-sm"></div>
                  <div className="w-3/4 h-2 bg-gray-100 rounded-full"></div>
                  <div className="w-1/2 h-2 bg-gray-100 rounded-full"></div>
                </div>
                <div className="col-span-2 bg-black text-white rounded-lg p-3 flex flex-col justify-between">
                  <div>
                    <div className="w-24 h-4 bg-white/20 rounded-sm mb-3"></div>
                    <div className="flex gap-2 mb-2">
                      <div className="w-12 h-12 bg-white/10 rounded-md"></div>
                      <div className="w-12 h-12 bg-white/10 rounded-md"></div>
                      <div className="w-12 h-12 bg-white/10 rounded-md"></div>
                    </div>
                  </div>
                  <div className="w-full h-8 bg-white text-black font-sans text-[10px] flex items-center justify-center rounded-md font-medium">Processing...</div>
                </div>
              </div>
            </motion.div>

            {/* Text Content */}
            <div className="order-1 md:order-2">
              <h2 className="font-serif font-medium text-3xl md:text-4xl mb-4 tracking-tight">
                Built to run without a manual.
              </h2>
              <p className="font-sans text-base text-[var(--text-muted)] font-light leading-relaxed mb-6">
                No new hardware, no training session, no English-only interface. If your staff can use WhatsApp, they can use Firse. It works on the phone your owner already has, in the language your customers already speak.
              </p>
              <a 
                href="/#preview"
                className="inline-flex items-center justify-center px-5 py-2.5 font-sans text-xs font-medium rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
              >
                See it on a real table
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Benefit section */}
      <section className="py-12 md:py-16 max-w-[1100px] mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="font-serif font-medium text-3xl md:text-4xl mb-4 tracking-tight">
              Every regular, remembered — without you lifting a finger.
            </h2>
            <p className="font-sans text-base text-[var(--text-muted)] font-light leading-relaxed mb-6">
              Whether it's their 1st visit or their 15th, Firse quietly counts. By the 5th, they've unlocked whatever you decide to give them — and you never had to keep a card, a notebook, or a mental list.
            </p>
            {/* TODO: real customer quote */}
          </div>
          
          <motion.div 
            className="flex flex-col items-center justify-center relative py-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Decorative elements behind StampProgress */}
            <div className="absolute top-0 right-10 w-20 h-20 border border-gray-200 rounded-full opacity-50"></div>
            <div className="absolute bottom-0 left-5 w-24 h-24 bg-gray-50 rounded-full -z-10"></div>
            
            <StampProgress />
          </motion.div>
        </div>
      </section>

      {/* 5. Closing CTA band */}
      <section className="border-t border-[var(--line)] py-12 md:py-16 text-center bg-[var(--bg-soft)]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
          <h2 className="font-serif font-medium text-3xl md:text-4xl mb-3 tracking-tight">Bring Firse to your restaurant.</h2>
          <p className="font-sans text-base text-[var(--text-muted)] font-light mb-6">
            First hotel is free — we just ask for two introductions.
          </p>
          <a 
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 font-sans text-sm font-medium rounded-full bg-black text-white hover:bg-gray-800 transition-colors shadow-lg shadow-black/5 hover:shadow-black/10 hover:-translate-y-0.5 duration-200"
          >
            Book a demo
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
