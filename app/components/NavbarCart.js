"use client";

import { useState, useEffect } from "react";

export default function NavbarCart() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Load cart on component mount
  useEffect(() => {
    const loadCart = () => {
      const storedCart = JSON.parse(localStorage.getItem("awais_cart") || "[]");
      setCartItems(storedCart);
    };

    loadCart();

    // Listen to custom window events for real-time syncing
    window.addEventListener("cart-updated", loadCart);
    return () => {
      window.removeEventListener("cart-updated", loadCart);
    };
  }, []);

  const saveCart = (newCart) => {
    localStorage.setItem("awais_cart", JSON.stringify(newCart));
    setCartItems(newCart);
    // Dispatch update event to sync other listening widgets if any
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQuantity = (id, delta) => {
    const newCart = cartItems
      .map((item) => {
        if (item._id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    saveCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cartItems.filter((item) => item._id !== id);
    saveCart(newCart);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* 🛒 CART TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-1.5 sm:p-2 text-gray-700 hover:text-black transition-colors duration-150 flex items-center gap-1 sm:gap-1.5 border border-gray-100 rounded-xl px-2.5 sm:px-3 bg-gray-50/50 hover:bg-gray-50 cursor-pointer shadow-sm shrink-0"
      >
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline-block">Cart</span>
        <span className="inline-block sm:hidden text-xs">🛒</span>
        <span className="bg-black text-white text-[9px] sm:text-[10px] font-black w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center shrink-0">
          {totalItems}
        </span>
      </button>

      {/* 🚪 DRAWER SLIDE-OUT PANEL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-black">
                  Shopping Cart ({totalItems})
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-black text-lg font-black transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 space-y-2">
                    <p className="text-gray-400 font-bold text-sm">Your cart is empty</p>
                    <p className="text-xs text-gray-400">Add custom tech gear and t-shirts to get started.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-14 h-18 bg-white border rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.image || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h4 className="text-xs font-black text-gray-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="text-xs text-black font-extrabold mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-5 h-5 bg-white border border-gray-200 hover:border-black rounded flex items-center justify-center text-xs font-bold text-gray-600 transition"
                          >
                            -
                          </button>
                          <span className="text-xs font-black text-gray-800 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-5 h-5 bg-white border border-gray-200 hover:border-black rounded flex items-center justify-center text-xs font-bold text-gray-600 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-400 hover:text-red-650 text-xs font-bold uppercase transition p-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Checkout Summary */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                  <div className="flex justify-between items-center text-xs uppercase tracking-wider font-bold text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-sm font-black text-black">${subtotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => {
                      alert(`🚀 Order processed successfully!\nTotal payment: $${subtotal.toFixed(2)}`);
                      saveCart([]); // clear cart
                      setIsOpen(false);
                    }}
                    className="w-full bg-black text-white hover:bg-neutral-800 text-xs font-black uppercase py-3 rounded-xl transition duration-150"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
