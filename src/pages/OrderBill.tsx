import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";

const OrderBill: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch({ type: "REMOVE_ITEM", payload: itemId });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: itemId, quantity: newQuantity },
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const handleContinueShopping = () => {
    navigate("/menu");
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-gray-600" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-400 mb-8">
              Add some delicious items to get started!
            </p>
            <Button
              onClick={handleContinueShopping}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-6 rounded-xl text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Browse Menu
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const subtotal = state.total;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Order Bill
          </h1>
          <p className="text-gray-400">Review your items before checkout</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 p-4 hover:border-red-500/30 transition-all duration-300">
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1 truncate">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="h-8 w-8 rounded-full border-gray-700 hover:bg-red-600 hover:border-red-600 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-white font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="h-8 w-8 rounded-full border-gray-700 hover:bg-red-600 hover:border-red-600 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-red-500">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="bg-gradient-to-b from-gray-900 to-gray-900/50 border-gray-800 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (10%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-gray-800" />
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>Total</span>
                    <span className="text-red-500">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-6 rounded-xl text-lg font-semibold"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    onClick={handleContinueShopping}
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800 hover:border-red-500/30 text-white py-6 rounded-xl text-lg"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Continue Shopping
                  </Button>
                </div>

                {/* Item Count */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <p className="text-gray-400 text-sm text-center">
                    {state.items.length}{" "}
                    {state.items.length === 1 ? "item" : "items"} in cart
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBill;
