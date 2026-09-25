import Link from 'next/link';

export function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full bg-transparent">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex justify-between items-center relative">
          {/* Minimalist Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-serif text-2xl tracking-tight text-gray-900">
              Venu
            </Link>
          </div>

          {/* Nav with Mega Menu */}
          <nav className="hidden md:flex space-x-12 absolute left-1/2 -translate-x-1/2 group">
            <div className="relative py-2">
              <span className="cursor-pointer font-sans text-xs text-gray-900 font-medium tracking-wide uppercase flex items-center gap-1">
                Menu
              </span>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[800px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                <div className="bg-white rounded-3xl shadow-xl p-4 flex gap-4 border border-gray-100">
                  
                  {/* Platform Card */}
                  <div className="flex-1 bg-[#131b25] text-white rounded-2xl p-8 flex flex-col justify-between min-h-[300px]">
                    <h3 className="font-serif text-2xl mb-12">Platform</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link href="/features" className="font-mono text-xs tracking-widest uppercase flex items-center gap-2 hover:text-gray-300 transition-colors">
                          <span className="text-gray-500">↗</span> Features
                        </Link>
                      </li>
                      <li>
                        <Link href="/how-it-works" className="font-mono text-xs tracking-widest uppercase flex items-center gap-2 hover:text-gray-300 transition-colors">
                          <span className="text-gray-500">↗</span> How it works
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Business Card */}
                  <div className="flex-1 bg-[#3f4a59] text-white rounded-2xl p-8 flex flex-col justify-between min-h-[300px]">
                    <h3 className="font-serif text-2xl mb-12">Business</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link href="/pricing" className="font-mono text-xs tracking-widest uppercase flex items-center gap-2 hover:text-gray-300 transition-colors">
                          <span className="text-gray-400">↗</span> Pricing
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="font-mono text-xs tracking-widest uppercase flex items-center gap-2 hover:text-gray-300 transition-colors">
                          <span className="text-gray-400">↗</span> Contact Sales
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Portal Card */}
                  <div className="flex-1 bg-[#9ca986] text-gray-900 rounded-2xl p-8 flex flex-col justify-between min-h-[300px]">
                    <h3 className="font-serif text-2xl mb-12">Portal</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link href="/login" className="font-mono text-xs tracking-widest uppercase flex items-center gap-2 hover:text-gray-700 transition-colors">
                          <span className="text-gray-600">↗</span> Dashboard Login
                        </Link>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
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
