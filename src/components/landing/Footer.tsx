import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white text-gray-900 pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        {/* Footer Top CTA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 border-b border-gray-100 pb-16 gap-8">
          <div>
            <p className="font-mono text-[#9ca986] text-sm tracking-wide mb-6">Get Started</p>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-none text-gray-900 mb-8 tracking-tight">
              Upgrade your hotel.
            </h2>
            <div className="flex gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-gray-900 text-white font-sans text-sm font-medium rounded-full hover:bg-[#9ca986] transition-colors"
              >
                Request a Demo
              </Link>
            </div>
          </div>
          <div className="text-left lg:text-right text-gray-500 max-w-sm font-sans font-light">
            Empower your hospitality operations with the most robust, elegantly designed POS system ever built.
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24 font-sans">
          <div className="col-span-2 md:col-span-1">
             <div className="font-serif text-3xl text-gray-900 mb-8 tracking-tight">Area</div>
          </div>
          <div>
            <h4 className="font-mono text-[10px] mb-6 uppercase tracking-widest text-gray-400">Platform</h4>
            <ul className="space-y-4 text-sm font-light text-gray-600">
              <li><Link href="/about" className="hover:text-gray-900 transition-colors">Overview</Link></li>
              <li><Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Hardware</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] mb-6 uppercase tracking-widest text-gray-400">Company</h4>
            <ul className="space-y-4 text-sm font-light text-gray-600">
              <li><Link href="#" className="hover:text-gray-900 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Sales</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] mb-6 uppercase tracking-widest text-gray-400">Legal</h4>
            <ul className="space-y-4 text-sm font-light text-gray-600">
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 font-mono uppercase tracking-widest border-t border-gray-100 pt-8">
          <div>© 2026 Area Hospitality. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-900 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
