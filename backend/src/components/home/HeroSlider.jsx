import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HERO_SLIDES } from '../../constants/index.js';
import { useFetch } from '../../hooks/useFetch.js';
import { homeApiEnabled, homeService } from '../../services/homeService.js';

const INTERVAL_MS = 6000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const { data } = useFetch(
    (signal) => (homeApiEnabled ? homeService.list({ signal }) : Promise.resolve(null)),
    [],
  );
  // Use the backend's slides when there are any, otherwise the built-in ones.
  const slides = data?.length ? data : HERO_SLIDES;

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    const timer = setInterval(() => setCurrent((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current % slides.length];

  return (
    <section className="relative h-[90vh] min-h-[560px] w-full overflow-hidden bg-zinc-900" aria-label="Featured photographs">
      <AnimatePresence mode="sync">
        <motion.img
          key={slide.id}
          src={slide.image}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-black/40" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h1 className="mb-4 font-serif text-5xl font-bold text-white drop-shadow-lg md:text-7xl">{slide.title}</h1>
            <p className="mb-8 text-lg font-light text-zinc-200 md:text-xl">{slide.subtitle}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/portfolio"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-amber-500 px-7 text-sm font-bold uppercase tracking-widest text-zinc-900 transition-colors hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            View portfolio <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div className="flex gap-2" role="group" aria-label="Choose slide">
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === current}
                className="flex h-11 w-8 items-center justify-center"
              >
                <span className={`h-1.5 rounded-full transition-all ${index === current ? 'w-8 bg-amber-500' : 'w-4 bg-white/50'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
