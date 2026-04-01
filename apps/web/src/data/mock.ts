export interface Product {
  _id?: string;
  id?: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  images: string[];
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  features?: string[];
  frameColor?: string;
  size?: {
    lensWidth?: number;
    bridge?: number;
    templeLength?: number;
    frameWidth?: number;
  };
  lensType?: string;
}

export const CATEGORIES = [
  { id: "optical", name: "Optical Frames", image: "https://images.unsplash.com/photo-1747731141445-7656d7467969?w=800&q=80" },
  { id: "sunglasses", name: "Sunglasses", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80" },
  { id: "blue-light", name: "Blue Light", image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80" },
  { id: "designer", name: "Designer", image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Aero Titanium Frames",
    description: "Ultra-lightweight titanium frames designed for all-day comfort. Features a minimal architectural silhouette with flexible hinges.",
    price: 349.99,
    discountPrice: 289.99,
    image: "https://images.unsplash.com/photo-1494005826588-25b58776edbc?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1494005826588-25b58776edbc?w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80"
    ],
    category: "optical",
    inStock: true,
    rating: 4.9,
    reviews: 156,
    features: ["Grade 5 Titanium", "Anti-Scratch Coating", "Flexible Temples"]
  },
  {
    id: "p2",
    name: "Midnight Eclipse Aviators",
    description: "Polarized midnight black aviators with a refined carbon fiber top bar. Provides 100% UVA/UVB protection with zero distortion.",
    price: 219.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80"
    ],
    category: "sunglasses",
    inStock: true,
    rating: 4.8,
    reviews: 92,
    features: ["HD Polarized Lenses", "Carbon Fiber Accents", "Adjustable Nose Pads"]
  },
  {
    id: "p3",
    name: "Logic Blue Blockers",
    description: "Optimize your screen time. These lenses filter 95% of high-energy blue light while maintaining color accuracy.",
    price: 129.99,
    discountPrice: 99.99,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
      "https://images.unsplash.com/photo-1509695507497-903c140c430a?w=800&q=80"
    ],
    category: "blue-light",
    inStock: true,
    rating: 4.7,
    reviews: 243,
    features: ["HEV Filter", "Anti-Reflective Coating", "Crystal Clear Optics"]
  },
  {
    id: "p4",
    name: "Estate Tortoise Shell",
    description: "Classic Italian acetate in a rich tortoise shell pattern. A bold statement piece for the sophisticated intellectual.",
    price: 279.99,
    image: "https://images.unsplash.com/photo-1747731141445-7656d7467969?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1747731141445-7656d7467969?w=800&q=80",
      "https://images.unsplash.com/photo-1625591338805-494b98687258?w=800&q=80"
    ],
    category: "optical",
    inStock: true,
    rating: 4.9,
    reviews: 67,
    features: ["Hand-Polished Acetate", "5-Barrel Hinges", "Signature Engraving"]
  },
  {
    id: "p5",
    name: "Vector Sport Performance",
    description: "Wrap-around design for maximum peripheral vision. Impact-resistant and hydro-oleophobic lenses for active lifestyle.",
    price: 189.99,
    discountPrice: 159.99,
    image: "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767390-903390e6fbc1?w=800&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80"
    ],
    category: "sunglasses",
    inStock: true,
    rating: 4.6,
    reviews: 134,
    features: ["Impact Resistance", "Sweat-Proof Grip", "Panoramic View"]
  },
  {
    id: "p6",
    name: "Heritage Gold Circular",
    description: "24k gold-plated circular frames. A nod to vintage luxury combined with modern metallurgical precision.",
    price: 549.99,
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80",
      "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=800&q=80"
    ],
    category: "designer",
    inStock: true,
    rating: 5.0,
    reviews: 42,
    features: ["24k Gold Plating", "Mineral Glass Lenses", "Limited Batch"]
  }
];

export const FEATURED_PRODUCTS = MOCK_PRODUCTS.slice(0, 4);

export const MOCK_ORDERS = [
  {
    id: "ORD-V738",
    date: "2024-02-15",
    status: "Delivered",
    total: 349.99,
    items: [
      { name: "Aero Titanium Frames", quantity: 1, price: 349.99, image: MOCK_PRODUCTS[0].image },
    ]
  }
];
