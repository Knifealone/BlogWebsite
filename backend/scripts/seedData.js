/** Sample content used by `npm run seed`. Replace it from the admin panel. */
const SAMPLE_POSTS = [
  {
    type: 'story',
    title: 'Chasing Shadows in Kyoto',
    excerpt: 'Exploring the ancient alleyways at dusk, where neon meets traditional wood.',
    content:
      'Kyoto at dusk transforms into a completely different world. As the sun dips below the horizon, the ancient wooden machiya houses cast long, dramatic shadows, while the neon signs of modern Japan begin to flicker to life.\n\nI spent three hours wandering the narrow alleys of Gion, waiting for the perfect interplay of light and shadow. The juxtaposition of a geisha hurrying past a glowing vending machine encapsulated the essence of this city: a place where centuries-old traditions coexist seamlessly with the hyper-modern.\n\nThis series captures that fleeting twilight hour.',
    readTime: '4 min read',
    coverImage:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    metadata: { camera: 'Sony A7R IV', lens: '35mm', settings: 'f/2.8 • 1/125s • ISO 800' },
    publishedAt: '2026-09-24T00:00:00.000Z',
  },
  {
    type: 'portfolio',
    category: 'Landscapes',
    title: 'The Silent Alps',
    excerpt: 'A minimalist approach to mountain ranges during the deep winter.',
    content:
      'There is a profound silence that blankets the Alps during deep winter. Away from the ski resorts and bustling lodges, the landscape is reduced to stark whites and deep, shadowy blues.',
    coverImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    metadata: { camera: 'Canon EOS R5', lens: '70-200mm', settings: 'f/8 • 1/500s • ISO 100' },
    publishedAt: '2026-09-20T00:00:00.000Z',
  },
  {
    type: 'story',
    title: 'Neon Reflections',
    excerpt: 'Cyberpunk aesthetics in the heart of the metropolis during a downpour.',
    content:
      "Rain in the city is a photographer's best friend. The wet asphalt acts like a massive mirror, reflecting the chaotic, vibrant neon signs scattered across the urban canyon.\n\nThis shoot was entirely spontaneous. A sudden downpour caught me in the middle of the neon district, and instead of taking cover, I embraced the elements. The resulting images feel like stills from a sci-fi film, full of saturated magentas and electric blues.",
    readTime: '6 min read',
    coverImage:
      'https://images.unsplash.com/photo-1555861496-0666c8981751?auto=format&fit=crop&w=1200&q=80',
    metadata: { camera: 'Fujifilm X-T4', lens: '50mm', settings: 'f/1.4 • 1/60s • ISO 1600' },
    publishedAt: '2026-09-15T00:00:00.000Z',
  },
  {
    type: 'portfolio',
    category: 'Portraits',
    title: 'Studio Studies: Form',
    excerpt: 'An exploration of human geometry and stark lighting.',
    content:
      'Stripping away the chaos of the outside world, the studio allows for absolute control. This series explores the human form through harsh, directional lighting to emphasize geometry and texture.',
    coverImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    metadata: { camera: 'Leica SL2', lens: '85mm', settings: 'f/5.6 • 1/200s • ISO 100' },
    publishedAt: '2026-09-10T00:00:00.000Z',
  },
  {
    type: 'story',
    title: 'Monochrome Markets',
    excerpt: 'Life in high contrast. Capturing the chaotic beauty of open air bazaars.',
    content:
      "Color can sometimes distract from the raw emotion and movement of a scene. By shooting this open-air bazaar in high-contrast monochrome, the focus shifts to the expressions of the vendors, the intricate patterns of the goods, and the dramatic shafts of light piercing through the canopy.\n\nIt's a study in texture and human interaction.",
    readTime: '5 min read',
    coverImage:
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
    metadata: { camera: 'Sony A7C', lens: '24mm', settings: 'f/8 • 1/250s • ISO 400' },
    publishedAt: '2026-09-02T00:00:00.000Z',
  },
  {
    type: 'portfolio',
    category: 'Street',
    title: 'Rush Hour Blur',
    excerpt: 'The speed of life in downtown Manhattan.',
    content: 'Using a slow shutter speed to capture the frantic energy of commuters.',
    coverImage:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
    metadata: { camera: 'Sony A7R IV', lens: '35mm', settings: 'f/11 • 1/15s • ISO 100' },
    publishedAt: '2026-08-28T00:00:00.000Z',
  },
  {
    type: 'portfolio',
    category: 'Landscapes',
    title: 'Desert Dunes',
    excerpt: 'The shifting sands of the Sahara at dawn.',
    content: 'Waking up before sunrise to catch the first light hitting the pristine dunes.',
    coverImage:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=80',
    metadata: { camera: 'Canon EOS R5', lens: '70-200mm', settings: 'f/11 • 1/250s • ISO 100' },
    publishedAt: '2026-08-15T00:00:00.000Z',
  },
  {
    type: 'preset',
    title: 'Cinematic Charcoal',
    excerpt: 'Deep, moody shadows with subtle warm highlights.',
    price: '$29',
    coverImage:
      'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-10T00:00:00.000Z',
  },
  {
    type: 'preset',
    title: 'Golden Hour Film',
    excerpt: 'Emulate classic 35mm warmth for your lifestyle portraits.',
    price: '$35',
    coverImage:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-05T00:00:00.000Z',
  },
];

module.exports = { SAMPLE_POSTS };
