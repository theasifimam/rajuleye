import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
export default async function ProductPage({ params }) {
    const { id } = await params;
    try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiBase}/api/v1/products/${id}`, { next: { revalidate: 0 } });
        if (!res.ok)
            throw new Error('Not found');
        const json = await res.json();
        const p = json.data;
        const product = {
            ...p,
            id: p._id,
            image: p.images && p.images.length > 0 ? p.images[0] : '',
            images: p.images || [],
            inStock: p.stock > 0,
            rating: p.avgRating || 0,
            reviews: p.totalReviews || 0,
            discountPrice: p.discount ? p.price - (p.price * p.discount / 100) : undefined,
            category: typeof p.category === 'object' && p.category ? p.category.name : p.category,
        };
        const relRes = await fetch(`${apiBase}/api/v1/products`, { next: { revalidate: 0 } });
        const relJson = await relRes.json();
        const relatedProducts = relJson.data.products.map((rp) => ({
            ...rp,
            id: rp._id,
            image: rp.images && rp.images.length > 0 ? rp.images[0] : '',
            images: rp.images || [],
            inStock: rp.stock > 0,
            rating: rp.avgRating || 0,
            reviews: rp.totalReviews || 0,
            discountPrice: rp.discount ? rp.price - (rp.price * rp.discount / 100) : undefined,
            category: typeof rp.category === 'object' && rp.category ? rp.category.name : rp.category,
        })).filter((rp) => rp.id !== product.id && rp.category === product.category).slice(0, 4);
        return <ProductDetailClient product={product} relatedProducts={relatedProducts}/>;
    }
    catch (e) {
        console.error('Error fetching product details:', e);
        notFound();
    }
}
