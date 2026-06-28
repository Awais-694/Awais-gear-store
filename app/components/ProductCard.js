"use client";

import { useRouter } from "next/navigation";

export default function ProductCard({ product, userRole }) {
  const router = useRouter();

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("awais_cart") || "[]");
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("awais_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new CustomEvent("show-toast", {
      detail: { message: `Added ${product.title} to cart!`, type: "success" }
    }));
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new CustomEvent("show-toast", {
          detail: { message: "Product successfully deleted from MongoDB & Cloudinary! 🗑️", type: "success" }
        }));
        router.refresh();
      } else {
        window.dispatchEvent(new CustomEvent("show-toast", {
          detail: { message: data.message, type: "error" }
        }));
      }
    } catch (error) {
      window.dispatchEvent(new CustomEvent("show-toast", {
        detail: { message: "Execution failure!", type: "error" }
      }));
    }
  };

  return (
    <div className="flex flex-col group justify-between h-full bg-white p-2.5 rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 reveal opacity-0 translate-y-4">
      
      {/* Product Image Container */}
      <div className="relative bg-gray-50 aspect-[3/4] w-full overflow-hidden rounded-lg">
        <img
          src={product.image || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
          {product.category || "T-Shirt"}
        </span>
      </div>

      {/* Product Information */}
      <div className="mt-2.5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider">
            {product.category || "Collection"}
          </span>
          <h3 className="font-extrabold text-gray-900 text-xs tracking-tight line-clamp-1 mt-0.5">
            {product.title}
          </h3>
          <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mt-1">
            {product.description}
          </p>
        </div>

        <div className="mt-2.5">
          <div className="flex items-baseline justify-between border-t border-gray-100 pt-2.5">
            <span className="text-xs font-black text-black">
              ${product.price ? product.price.toFixed(2) : "0.00"}
            </span>
            <span className="text-[8px] font-bold text-gray-400 uppercase">
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="mt-2.5 space-y-1.5">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white hover:bg-neutral-800 text-[10px] font-extrabold uppercase py-2 rounded-lg transition duration-150 active:scale-[0.98] cursor-pointer"
            >
              Add to Cart 🛒
            </button>

            {/* Admin Actions */}
            {userRole === "admin" && (
              <div className="border border-purple-100 bg-purple-50/50 p-1.5 rounded-lg flex items-center justify-between gap-2 mt-1.5">
                <span className="text-[8px] font-black uppercase text-purple-700 tracking-wider">
                  Admin:
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => router.push(`/admin?edit=${product._id}`)}
                    className="bg-white border border-gray-200 text-gray-700 text-[8px] font-black px-2 py-0.5 rounded hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteProduct}
                    className="bg-red-50 border border-red-200 text-red-600 text-[8px] font-black px-2 py-0.5 rounded hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}