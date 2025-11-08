import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-900/50 border-red-500/30 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Payment Cancelled
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 mb-8 text-lg"
            >
              Your payment was cancelled. Don't worry, your items are still in
              your cart.
              <br />
              You can try again or choose a different payment method.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button
                onClick={() => navigate("/checkout")}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-6 rounded-xl text-lg font-semibold"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={() => navigate("/order-bill")}
                variant="outline"
                className="w-full border-gray-700 hover:bg-gray-800 hover:border-red-500/30 text-white py-6 rounded-xl text-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Cart
              </Button>

              <Button
                onClick={() => navigate("/menu")}
                variant="outline"
                className="w-full border-gray-700 hover:bg-gray-800 text-white py-6 rounded-xl text-lg"
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

export default PaymentCancel;
