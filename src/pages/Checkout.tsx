import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useCreateOrder } from "@/hooks/useOrders";
import useAuthStore from "@/store/authStore";
import { message } from "antd";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const createOrder = useCreateOrder();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    tableNumber: "",
    specialInstructions: "",
  });

  const [errors, setErrors] = useState({
    tableNumber: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    // No validation needed since all fields are optional now
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (state.items.length === 0) {
      message.error("Your cart is empty");
      return;
    }

    if (!user || !user.id) {
      message.error("You must be logged in to place an order");
      navigate("/login");
      return;
    }

    try {
      // Calculate total amount from cart
      const totalAmount = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const orderData = {
        userId: user.id.toString(),
        totalAmount: totalAmount,
        tableNumber: formData.tableNumber
          ? parseInt(formData.tableNumber)
          : undefined,
        specialInstructions: formData.specialInstructions || undefined,
        items: state.items.map((item) => ({
          menuItemId: item.id.toString(),
          quantity: item.quantity,
        })),
      };

      await createOrder.mutateAsync(orderData);

      // Clear cart after successful order
      dispatch({ type: "CLEAR_CART" });

      // Show success message
      message.success("Order placed successfully!");

      // Navigate to my orders page
      setTimeout(() => {
        navigate("/my-orders");
      }, 1000);
    } catch (error) {
      console.error("Failed to place order:", error);
      message.error("Failed to place order. Please try again.");
    }
  };

  const handleBackToBill = () => {
    navigate("/order-bill");
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
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-600" />
            <h2 className="text-3xl font-bold text-white mb-4">
              No Items to Checkout
            </h2>
            <p className="text-gray-400 mb-8">
              Add some items to your cart first!
            </p>
            <Button
              onClick={() => navigate("/menu")}
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Checkout
          </h1>
          <p className="text-gray-400">Complete your order</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Details Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Order Details
              </h2>

              <div className="space-y-6">
                {/* Table Number */}
                <div className="space-y-2">
                  <Label htmlFor="tableNumber" className="text-white">
                    Table Number (Optional)
                  </Label>
                  <Input
                    id="tableNumber"
                    type="number"
                    placeholder="Enter your table number (if dining in)"
                    value={formData.tableNumber}
                    onChange={(e) =>
                      handleInputChange("tableNumber", e.target.value)
                    }
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
                  />
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="specialInstructions" className="text-white">
                    Special Instructions (Optional)
                  </Label>
                  <Textarea
                    id="specialInstructions"
                    placeholder="Any special requests or dietary requirements?"
                    value={formData.specialInstructions}
                    onChange={(e) =>
                      handleInputChange("specialInstructions", e.target.value)
                    }
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 min-h-[120px]"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-gradient-to-b from-gray-900 to-gray-900/50 border-gray-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm bg-gray-800/50 p-3 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-red-500 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="bg-gray-800 mb-6" />

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
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

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={createOrder.isPending}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-6 rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleBackToBill}
                  variant="outline"
                  disabled={createOrder.isPending}
                  className="w-full border-gray-700 hover:bg-gray-800 hover:border-red-500/30 text-white py-6 rounded-xl text-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Bill
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
