import { RuixenGradientFooter } from "@/components/ui/ruixen-gradient-footer";
import { Building } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    title: "Platform",
    links: [
      { name: "Overview", href: "/about" },
      { name: "Features", href: "/features" },
      { name: "How it works", href: "/how-it-works" },
      { name: "Hardware", href: "#" }
    ],
  },
  {
    title: "Business",
    links: [
      { name: "Pricing", href: "/pricing" },
      { name: "Contact Sales", href: "/contact" }
    ],
  },
  { 
    title: "Company", 
    links: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" }
    ] 
  },
  { 
    title: "Legal", 
    links: [
      { name: "Privacy Policy", href: "#" }, 
      { name: "Terms of Service", href: "#" }
    ] 
  },
];

export function Footer() {
  return (
    <div className="flex w-full flex-col bg-white overflow-hidden">
      <RuixenGradientFooter gradientHeight="40vh" className="relative z-10 bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-8 pt-24">
          <div className="grid gap-10 pb-16 sm:grid-cols-2 lg:grid-cols-6 border-b border-gray-100">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-gray-900">
                <Building className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-mono text-sm uppercase tracking-widest font-bold">
                  Area
                </span>
              </div>
              <p className="mt-6 max-w-xs text-sm text-gray-500 font-sans font-light leading-relaxed">
                Empower your hospitality operations with the most robust, elegantly designed POS system ever built.
              </p>
 
              <div className="mt-8 flex max-w-xs gap-2">
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="you@hotel.com"
                  className="h-10 w-full rounded-full border border-gray-200 bg-transparent px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none font-sans"
                />
                <button
                  type="button"
                  className="h-10 shrink-0 rounded-full bg-gray-900 px-5 font-mono text-xs uppercase tracking-wider text-white transition-opacity hover:opacity-90 hover:bg-[#9ca986]"
                >
                  Join
                </button>
              </div>
            </div>
 
            <nav className="grid grid-cols-2 gap-10 font-mono text-xs uppercase tracking-wider sm:grid-cols-4 lg:col-span-4 mt-8 lg:mt-0">
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className="text-gray-900 mb-6 font-bold">{col.title}</h3>
                  <ul className="flex flex-col gap-4">
                    {col.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-500 transition-colors hover:text-gray-900"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
 
          <div className="flex flex-col items-center justify-between gap-4 pt-8 pb-4 font-mono text-xs uppercase tracking-widest text-gray-400 sm:flex-row">
            <span>© 2026 Area Hospitality. All rights reserved.</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9ca986]" />
              All systems normal
            </span>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-gray-900 transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">LinkedIn</Link>
            </div>
          </div>
        </div>
      </RuixenGradientFooter>
    </div>
  );
}
