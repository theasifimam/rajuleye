import { notFound } from "next/navigation";
import { SelectPowerClient } from "./SelectPowerClient";

export default async function SelectPowerPage({ searchParams }) {
  const { product: id } = await searchParams;
  if (!id) {
    notFound();
  }

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const res = await fetch(`${apiBase}/api/v1/products/${id}`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error("Not found");
    const json = await res.json();
    const p = json.data;
    const product = {
      ...p,
      id: p._id,
      image: p.images && p.images.length > 0 ? p.images[0] : "",
      images: p.images || [],
      inStock: p.stock > 0,
      rating: p.avgRating || 0,
      reviews: p.totalReviews || 0,
      discountPrice: p.discount
        ? p.price - (p.price * p.discount) / 100
        : undefined,
      category:
        typeof p.category === "object" && p.category
          ? p.category.name
          : p.category,
    };

    return <SelectPowerClient product={product} />;
  } catch (e) {
    console.error("Error fetching product details for power selection:", e);
    notFound();
  }
}
