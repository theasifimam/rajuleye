import CollectionClient from "./CollectionClient";

export function generateMetadata({ params }) {
  const slugs = params.collection || [];
  const title = slugs.map((slug) => slug.charAt(0).toUpperCase() + slug.slice(1)).join(" ");
  return {
    title: `${title} | Rajul Eye`,
    description: `Shop the best ${title.toLowerCase()} at Rajul Eye. Find your perfect fit from our wide range of premium eyewear.`,
  };
}

export default function CollectionPage({ params }) {
  return <CollectionClient collection={params.collection} />;
}
