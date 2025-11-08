import React from "react";
import { CreditCard, Loader2, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Radio, Spin } from "antd";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface TaxServiceRate {
  id: string;
  name: string;
  rate: number;
  isActive: boolean;
}

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  total: number;
  taxServiceRates: TaxServiceRate[] | undefined;
  loadingRates: boolean;
  paymentMethod: "stripe" | "cod";
  isProcessing: boolean;
  selectedLocationId: string | null;
  onPaymentMethodChange: (method: "stripe" | "cod") => void;
  onPlaceOrder: () => void;
  onBack: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  subtotal,
  total,
  taxServiceRates,
  loadingRates,
  paymentMethod,
  isProcessing,
  selectedLocationId,
  onPaymentMethodChange,
  onPlaceOrder,
  onBack,
}) => {
  return (
    <Card className="bg-gradient-to-b from-gray-900 to-gray-900/50 border-gray-800 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

      {/* Items List */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
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
        <div className="text-white font-semibold">Payment Method</div>
        <Radio.Group
          value={paymentMethod}
          onChange={(e) => onPaymentMethodChange(e.target.value)}
          className="w-full"
        >
          <div className="space-y-2">
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
          onClick={onPlaceOrder}
          disabled={isProcessing || !selectedLocationId}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-6 rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pay ${total.toFixed(2)} with Stripe
            </>
          )}
        </Button>
        {!selectedLocationId && (
          <p className="text-xs text-yellow-400 text-center">
            Please select a location to continue
          </p>
        )}
        <Button
          onClick={onBack}
          variant="outline"
          disabled={isProcessing}
          className="w-full border-gray-700 hover:bg-gray-800 hover:border-red-500/30 text-white py-6 rounded-xl text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Bill
        </Button>
      </div>
    </Card>
  );
};

export default CheckoutSummary;
