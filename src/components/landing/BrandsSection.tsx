export function BrandsSection() {
  const brands = [
    'The Ritz-Carlton', 'Four Seasons', 'Marriott', 'Hilton', 'Hyatt', 'Mandarin Oriental', 'Aman', 'Rosewood'
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-gray-400 mb-16">
          Powering the world's finest hotels
        </h2>
        
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 max-w-5xl mx-auto opacity-60 grayscale">
          {brands.map((brand, i) => (
            <div key={i} className="flex items-center justify-center hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              <span className="font-serif text-xl md:text-2xl text-gray-900 tracking-tight">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
