import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  Loader2,
  MapPin,
  ExternalLink,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useCreateOrder } from "@/hooks/useOrders";
import { useCreateCheckoutSession } from "@/hooks/usePayment";
import { useTaxServiceRates } from "@/hooks/useTaxServiceRates";
import useAuthStore from "@/store/authStore";
import { message, Select, Spin, Divider, Radio } from "antd";
import useLocationStore from "../store/locationStore";
import deliveryServiceService, {
  DeliveryService,
} from "../services/deliveryService";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch, selectedLocationId, setSelectedLocationId } =
    useCart();
  const createOrder = useCreateOrder();
  const createCheckoutSession = useCreateCheckoutSession();
  const { data: taxServiceRates, isLoading: loadingRates } =
    useTaxServiceRates();
  const [activeLocations, setActiveLocations] = useState([]);
  const { user } = useAuthStore();
  const {
    activeLocations: locations,
    fetchActiveLocations,
    loading,
  } = useLocationStore();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">(
    "stripe"
  );
  const [calculatedTax, setCalculatedTax] = useState(0);
  const [calculatedService, setCalculatedService] = useState(0);

  useEffect(() => {
    if (Array.isArray(locations)) {
      setActiveLocations(locations);
    }
  }, [locations]);

  const [formData, setFormData] = useState({
    tableNumber: "",
    specialInstructions: "",
  });

  const [errors, setErrors] = useState({
    tableNumber: "",
  });

  const [deliveryServices, setDeliveryServices] = useState<DeliveryService[]>(
    []
  );
  const [loadingServices, setLoadingServices] = useState(false);

  // Initialize with selected location from cart context (from Menu page)
  useEffect(() => {
    fetchActiveLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch delivery services when location changes
  useEffect(() => {
    if (selectedLocationId) {
      fetchDeliveryServices(selectedLocationId);
    }
  }, [selectedLocationId]);

  const fetchDeliveryServices = async (locationId: string) => {
    setLoadingServices(true);
    try {
      const services =
        await deliveryServiceService.getDeliveryServicesByLocation(locationId);
      setDeliveryServices(services.filter((s) => s.isActive));
    } catch (error) {
      console.error("Failed to fetch delivery services");
    } finally {
      setLoadingServices(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
    const location = activeLocations?.find((loc) => loc.id === locationId);
    if (location) {
      message.success(`Location changed to ${location.name}`);
    }
  };

  // Calculate tax and service charges based on active rates
  useEffect(() => {
    if (taxServiceRates && taxServiceRates.length > 0) {
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      let totalTax = 0;
      let totalService = 0;

      taxServiceRates
        .filter((rate) => rate.isActive)
        .forEach((rate) => {
          const amount = subtotal * rate.rate;
          // Categorize by name (customize based on your needs)
          if (
            rate.name.toLowerCase().includes("tax") ||
            rate.name.toLowerCase().includes("gst") ||
            rate.name.toLowerCase().includes("vat")
          ) {
            totalTax += amount;
          } else {
            totalService += amount;
          }
        });

      setCalculatedTax(totalTax);
      setCalculatedService(totalService);
    }
  }, [taxServiceRates, state.items]);

  const validateForm = () => {
    // No validation needed since all fields are optional now
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!selectedLocationId) {
      message.error("Please select a location");
      return;
    }

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
      // Calculate total amount
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const totalAmount = subtotal + calculatedTax + calculatedService;

      // Create order data
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
        locationId: selectedLocationId,
      };

      if (paymentMethod === "stripe") {
        // Step 1: Create order with paid: false
        const createdOrderResponse = await createOrder.mutateAsync(orderData);

        // Extract order from response (backend returns {success, message, order})
        const createdOrder =
          (createdOrderResponse as { order?: { id: string } }).order ||
          createdOrderResponse;

        // Validate we have items
        if (!state.items || state.items.length === 0) {
          message.error("No items in cart");
          return;
        }

        // Step 2: Create Stripe checkout session with all required data
        const checkoutSessionData = {
          orderId: createdOrder.id,
          items: state.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          currency: "usd",
          userId: user.id.toString(),
          locationId: selectedLocationId,
          tableNumber: formData.tableNumber
            ? parseInt(formData.tableNumber)
            : undefined,
          specialInstructions: formData.specialInstructions || undefined,
        };

        await createCheckoutSession.mutateAsync(checkoutSessionData);
        // The useCreateCheckoutSession hook will redirect to Stripe
        // Don't clear cart yet - will clear after successful payment verification
      } else {
        // Cash on Delivery - order created with paid: false, just clear cart and navigate
        await createOrder.mutateAsync(orderData);
        dispatch({ type: "CLEAR_CART" });
        message.success("Order placed successfully! Pay on delivery.");
        setTimeout(() => {
          navigate("/my-orders");
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to process order:", error);
      message.error("Failed to process order. Please try again.");
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
  const total = subtotal + calculatedTax + calculatedService;

  const selectedLocation = activeLocations.find(
    (loc) => loc.id === selectedLocationId
  );

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
                {/* Location Selection */}
                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Select Location <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    size="large"
                    placeholder="Choose your nearest location"
                    value={selectedLocationId || undefined}
                    onChange={handleLocationChange}
                    style={{ width: "100%" }}
                    className="custom-select"
                  >
                    {activeLocations.map((location) => (
                      <Select.Option key={location.id} value={location.id}>
                        <div className="py-1">
                          <div className="font-semibold text-white">
                            {location.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {location.address}, {location.city}
                          </div>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                  {selectedLocation && (
                    <div className="mt-2 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-green-400 font-medium">
                            {selectedLocation.name}
                          </div>
                          <div className="text-gray-300 text-xs mt-1">
                            {selectedLocation.address}, {selectedLocation.city}
                            {selectedLocation.phoneNumber && (
                              <> • {selectedLocation.phoneNumber}</>
                            )}
                          </div>
                          {selectedLocation.openingHours && (
                            <div className="text-gray-400 text-xs mt-1">
                              {selectedLocation.openingHours}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Services - Only show if location is selected */}
                {selectedLocationId && deliveryServices.length > 0 && (
                  <>
                    <Divider
                      style={{ borderColor: "#374151", margin: "16px 0" }}
                    />
                    <div className="space-y-2">
                      <Label className="text-white flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Or Order via Delivery Service
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {loadingServices ? (
                          <div className="flex justify-center py-4 w-full">
                            <Spin />
                          </div>
                        ) : (
                          deliveryServices.map((service) => (
                            <Button
                              key={service.id}
                              onClick={() =>
                                window.open(service.serviceUrl, "_blank")
                              }
                              variant="outline"
                              className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-red-500/30 text-white"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {service.name}
                            </Button>
                          ))
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        External delivery services may have different pricing
                        and delivery times
                      </p>
                    </div>
                    <Divider
                      style={{ borderColor: "#374151", margin: "16px 0" }}
                    />
                  </>
                )}

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

                {loadingRates ? (
                  <div className="flex justify-center py-2">
                    <Spin size="small" />
                  </div>
                ) : (
                  <>
                    {taxServiceRates && taxServiceRates.length > 0 ? (
                      taxServiceRates
                        .filter((rate) => rate.isActive)
                        .map((rate) => {
                          const amount = subtotal * rate.rate;
                          return (
                            <div
                              key={rate.id}
                              className="flex justify-between text-gray-300"
                            >
                              <span>
                                {rate.name} ({(rate.rate * 100).toFixed(2)}%)
                              </span>
                              <span className="font-semibold">
                                ${amount.toFixed(2)}
                              </span>
                            </div>
                          );
                        })
                    ) : (
                      <div className="flex justify-between text-gray-300">
                        <span>Tax & Service</span>
                        <span className="font-semibold">$0.00</span>
                      </div>
                    )}
                  </>
                )}

                <Separator className="bg-gray-800" />
                <div className="flex justify-between text-white text-xl font-bold">
                  <span>Total</span>
                  <span className="text-red-500">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6 space-y-3">
                <Label className="text-white font-semibold">
                  Payment Method
                </Label>
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full"
                >
                  <div className="space-y-2">
                    {/* <Radio value="cod" className="w-full">
                      <div className="flex items-center gap-2 text-white">
                        <CheckCircle className="w-4 h-4" />
                        <span>Cash on Delivery</span>
                      </div>
                    </Radio> */}
                    <Radio value="stripe" className="w-full">
                      <div className="flex items-center gap-2 text-white">
                        <CreditCard className="w-4 h-4" />
                        <span>Pay with Stripe (Card/UPI)</span>
                      </div>
                    </Radio>
                  </div>
                </Radio.Group>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={
                    createOrder.isPending ||
                    createCheckoutSession.isPending ||
                    !selectedLocationId
                  }
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-6 rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createOrder.isPending || createCheckoutSession.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {paymentMethod === "stripe"
                        ? "Processing Payment..."
                        : "Placing Order..."}
                    </>
                  ) : (
                    <>
                      {paymentMethod === "stripe" ? (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay ${total.toFixed(2)} with Stripe
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Place Order (COD)
                        </>
                      )}
                    </>
                  )}
                </Button>
                {!selectedLocationId && (
                  <p className="text-xs text-yellow-400 text-center">
                    Please select a location to continue
                  </p>
                )}
                <Button
                  onClick={handleBackToBill}
                  variant="outline"
                  disabled={
                    createOrder.isPending || createCheckoutSession.isPending
                  }
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
