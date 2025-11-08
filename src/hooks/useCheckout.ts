import { useState, useEffect } from "react";
import { useTaxServiceRates } from "./useTaxServiceRates";
import { useCreateCheckoutSession } from "./usePayment";
import useAuthStore from "@/store/authStore";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import deliveryServiceService, {
  DeliveryService,
} from "@/services/deliveryService";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutFormData {
  tableNumber: string;
  specialInstructions: string;
}

export const useCheckout = (
  cartItems: CartItem[],
  selectedLocationId: string | null
) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: taxServiceRates, isLoading: loadingRates } =
    useTaxServiceRates();
  const createCheckoutSession = useCreateCheckoutSession();

  const [formData, setFormData] = useState<CheckoutFormData>({
    tableNumber: "",
    specialInstructions: "",
  });

  const [deliveryServices, setDeliveryServices] = useState<DeliveryService[]>(
    []
  );
  const [loadingServices, setLoadingServices] = useState(false);
  const [calculatedTax, setCalculatedTax] = useState(0);
  const [calculatedService, setCalculatedService] = useState(0);

  // Fetch delivery services when location changes
  useEffect(() => {
    if (selectedLocationId) {
      fetchDeliveryServices(selectedLocationId);
    }
  }, [selectedLocationId]);

  // Calculate tax and service charges
  useEffect(() => {
    if (taxServiceRates && taxServiceRates.length > 0) {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      let totalTax = 0;
      let totalService = 0;

      taxServiceRates
        .filter((rate) => rate.isActive)
        .forEach((rate) => {
          const amount = subtotal * rate.rate;
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
  }, [taxServiceRates, cartItems]);

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
  };

  const handlePlaceOrder = async () => {
    if (!selectedLocationId) {
      message.error("Please select a location");
      return;
    }

    if (cartItems.length === 0) {
      message.error("Your cart is empty");
      return;
    }

    if (!user || !user.id) {
      message.error("You must be logged in to place an order");
      navigate("/login");
      return;
    }

    try {
      // Create checkout session with cart items and metadata
      await createCheckoutSession.mutateAsync({
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        currency: "usd",
        userId: user.id.toString(),
        locationId: selectedLocationId,
        tableNumber: formData.tableNumber || undefined,
        specialInstructions: formData.specialInstructions || undefined,
      });
      // The hook will redirect to Stripe
      // Cart will be cleared after successful payment verification
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      message.error("Failed to create checkout session. Please try again.");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + calculatedTax + calculatedService;

  return {
    formData,
    deliveryServices,
    loadingServices,
    taxServiceRates,
    loadingRates,
    subtotal,
    total,
    isProcessing: createCheckoutSession.isPending,
    handleInputChange,
    handlePlaceOrder,
  };
};
