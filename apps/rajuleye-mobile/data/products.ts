export interface Product {
  id: string;
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
}

export const CATEGORIES = [
  { id: "optical", name: "Optical Frames", icon: "glasses" },
  { id: "sunglasses", name: "Sunglasses", icon: "sunny" },
  { id: "blue-light", name: "Blue Light", icon: "laptop" },
  { id: "designer", name: "Designer", icon: "ribbon" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Aero Titanium Frames",
    description: "Ultra-lightweight titanium frames designed for all-day comfort. Features a minimal architectural silhouette with flexible hinges.",
    price: 349.99,
    discountPrice: 289.99,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80",
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
