import Link from 'next/link';

export function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full bg-transparent">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          {/* Minimalist Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-serif text-2xl tracking-tight text-gray-900">
              Area
            </Link>
          </div>

          {/* Centered Nav Links */}
          <nav className="hidden md:flex space-x-12 absolute left-1/2 -translate-x-1/2">
            <Link href="/about" className="font-sans text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Platform
            </Link>
            <Link href="/pricing" className="font-sans text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="#" className="font-sans text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Hardware
            </Link>
            <Link href="/contact" className="font-sans text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right side CTA */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/login" 
              className="font-sans text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-2 bg-gray-900 text-white rounded-full font-sans text-xs font-medium hover:bg-[#9ca986] transition-colors"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
