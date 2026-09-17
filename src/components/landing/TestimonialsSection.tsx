export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Before Area, managing in-room dining across our 400 suites was a logistical nightmare. Now, orders flow directly from the guest's phone to the kitchen, and our delivery times have dropped by 30%. The elegance of the system matches the luxury we provide.",
      author: "Eleanor Vance",
      title: "General Manager",
      company: "The Grand Plaza"
    },
    {
      quote: "We needed a POS that could handle our poolside cabanas, three signature restaurants, and banqueting simultaneously without crashing. Area hasn't just survived our peak seasons; it has given us insights to optimize our staffing entirely.",
      author: "Marcus Thorne",
      title: "Director of F&B",
      company: "Azure Resort & Spa"
    },
    {
      quote: "Standard restaurant POS systems simply do not understand hotel operations. Area allows us to bill directly to the guest's room folio seamlessly. It is the first system that feels like it was actually built for hoteliers.",
      author: "Sarah Jenkins",
      title: "VP of Operations",
      company: "Luxe Hospitality Group"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
          <p className="font-mono text-[#9ca986] text-sm tracking-wide mb-6">Testimonials</p>
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 tracking-tight">
            Loved by hoteliers.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {testimonials.map((t, i) => (
            <div key={i} className="flex flex-col justify-between">
              <div>
                <div className="font-serif text-gray-900 text-6xl leading-[0.5] mb-6 tracking-tighter">“</div>
                <p className="font-sans text-gray-500 text-sm leading-relaxed mb-12 font-light">
                  {t.quote}
                </p>
              </div>
              <div className="flex flex-col gap-1 border-t border-gray-100 pt-6">
                <div className="font-serif text-gray-900 text-lg tracking-tight">{t.author}</div>
                <div className="font-sans text-xs text-gray-400 font-light">{t.title}, {t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
