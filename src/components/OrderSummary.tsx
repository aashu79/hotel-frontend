import React from "react";
import { Separator } from "@/components/ui/separator";
import { Spin } from "antd";

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

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  total: number;
  taxServiceRates?: TaxServiceRate[];
  loadingRates?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  total,
  taxServiceRates = [],
  loadingRates = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Items List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center text-sm"
          >
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>
            <span className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <Separator />

      {/* Price Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
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
                    <div key={rate.id} className="flex justify-between text-sm">
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
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax & Service</span>
                <span>$0.00</span>
              </div>
            )}
          </>
        )}

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
