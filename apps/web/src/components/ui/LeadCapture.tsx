'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

interface LeadCaptureProps {
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export function LeadCapture({
  title = "Ready to transform your operations?",
  description = "Join the leading hospitality brands who have already upgraded their guest experience with Area.",
  buttonText = "Request a Demo",
  className = ""
}: LeadCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('sending');
    // Simulate network request
    setTimeout(() => {
      setStatus('sent');
      setEmail('');
    }, 1200);
  };

  return (
    <AnimatedSection className={`py-24 bg-[#131b25] text-white ${className}`}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-tight mb-6">
          {title}
        </h2>
        <p className="font-sans text-gray-400 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
          {description}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto justify-center">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your work email" 
            disabled={status !== 'idle'}
            required
            className="flex-grow px-6 py-4 bg-white/5 border border-white/10 rounded-full font-sans text-white placeholder:text-gray-500 focus:outline-none focus:border-[#9ca986] focus:bg-white/10 transition-all disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={status !== 'idle'}
            className="px-8 py-4 bg-[#9ca986] text-[#131b25] rounded-full font-sans font-semibold hover:bg-[#a9b893] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 whitespace-nowrap"
          >
            {status === 'idle' && <>{buttonText} <Send className="w-4 h-4 ml-1" /></>}
            {status === 'sending' && 'Sending...'}
            {status === 'sent' && 'Sent!'}
          </button>
        </form>
        
        {status === 'sent' && (
          <p className="text-[#9ca986] font-mono text-xs uppercase tracking-widest mt-6 animate-pulse">
            Thanks! We'll be in touch shortly.
          </p>
        )}
      </div>
    </AnimatedSection>
  );
}
