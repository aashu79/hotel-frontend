import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Loader2,
  AlertCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useVerifyPayment } from "@/hooks/usePayment";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface OrderDetails {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paid: boolean;
  userId: string;
  locationId: string;
  createdAt: string;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dispatch } = useCart();
  const verifyPayment = useVerifyPayment();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      navigate("/cart");
      return;
    }

    // Only verify once
    if (hasVerified) {
      return;
    }

    setHasVerified(true);

    // Verify payment and update order paid status to true
    verifyPayment.mutate(
      { session_id: sessionId },
      {
        onSuccess: (data) => {
          // Clear cart after successful payment verification
          dispatch({ type: "CLEAR_CART" });

          // Store order details for display
          if (data.order) {
            setOrderDetails(data.order);
          }
        },
        // Error is handled by the error state UI below
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (verifyPayment.isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900/50 border-gray-700 p-8 text-center">
            <div className="w-24 h-24 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Verifying Payment...
            </h1>
            <p className="text-gray-400">
              Please wait while we confirm your payment
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (verifyPayment.isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900/50 border-red-500/30 p-8 text-center">
            <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Payment Verification Failed
            </h1>
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {verifyPayment.error instanceof Error
                  ? verifyPayment.error.message
                  : "Unable to verify payment. Please contact support."}
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/my-orders")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 rounded-xl text-lg font-semibold"
              >
                Check My Orders
              </Button>
              <Button
                onClick={() => navigate("/cart")}
                variant="outline"
                className="w-full border-gray-700 hover:bg-gray-800 text-white py-6 rounded-xl text-lg"
              >
                Return to Cart
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-900/50 border-green-500/30 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Payment Successful!
            </motion.h1>

            {orderDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-6 bg-gray-800/50 p-4 rounded-lg"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-green-400" />
                  <p className="text-green-400 font-semibold text-lg">
                    Order #{orderDetails.orderNumber}
                  </p>
                </div>
                <Separator className="bg-gray-700 mb-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Order Total:</span>
                    <span className="font-semibold text-white">
                      ${orderDetails.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Status:</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs font-semibold">
                      {orderDetails.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 mb-8 text-lg"
            >
              Thank you for your order. Your payment has been processed
              successfully.
              <br />
              You will receive a confirmation shortly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button
                onClick={() => navigate("/my-orders")}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 rounded-xl text-lg font-semibold"
              >
                View My Orders
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                onClick={() => navigate("/menu")}
                variant="outline"
                className="w-full border-gray-700 hover:bg-gray-800 hover:border-green-500/30 text-white py-6 rounded-xl text-lg"
              >
                Continue Shopping
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
