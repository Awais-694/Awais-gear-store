import { notFound } from "next/navigation";

const products = [
  {
    id: "1",
    name: "Aero Lite Jacket",
    category: "Outerwear",
    price: 129,
    description: "Weather-ready jacket for daily adventure.",
  },
  {
    id: "2",
    name: "Trail Pro Backpack",
    category: "Gear",
    price: 89,
    description: "A durable backpack for weekend travel.",
  },
];

export default function ProductDetailPage({ params }) {
  const product = products.find((item) => item.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">{product.category}</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">{product.name}</h1>
        <p className="mt-4 text-zinc-600">{product.description}</p>
        <div className="mt-8 flex items-center justify-between">
          <span className="text-2xl font-semibold text-zinc-900">${product.price}</span>
          <button className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white">Add to cart</button>
        </div>
      </div>
    </main>
  );
}
