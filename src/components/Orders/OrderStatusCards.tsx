import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Package } from "lucide-react";
import { OrderStatus } from "../../services/orders";
import { statusConfig } from "./OrderStatusConfig";

interface OrderStatusCardsProps {
  counts: {
    PENDING: number;
    CONFIRMED: number;
    PREPARING: number;
    READY: number;
    COMPLETED: number;
    CANCELLED: number;
    ALL: number;
  };
  selectedStatus: OrderStatus | "ALL";
  onStatusChange: (status: OrderStatus | "ALL") => void;
  isLoading: boolean;
}

export const OrderStatusCards: React.FC<OrderStatusCardsProps> = ({
  counts,
  selectedStatus,
  onStatusChange,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-32 bg-slate-800 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
      {/* All Orders Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className={`cursor-pointer transition-all duration-300 border-2 ${
            selectedStatus === "ALL"
              ? "bg-orange-500/20 border-orange-500"
              : "bg-slate-900/50 border-slate-800 hover:border-orange-500/50"
          }`}
          onClick={() => onStatusChange("ALL")}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold text-white">
                {counts.ALL}
              </span>
            </div>
            <p className="text-slate-400 font-medium">All Orders</p>
          </div>
        </Card>
      </motion.div>

      {/* Status Cards */}
      {(Object.keys(statusConfig) as OrderStatus[]).map((status, index) => {
        const config = statusConfig[status];
        const StatusIcon = config.icon;

        return (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 border-2 ${
                selectedStatus === status
                  ? `${config.bgColor} ${config.borderColor}`
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              }`}
              onClick={() => onStatusChange(status)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <StatusIcon className={`w-8 h-8 ${config.color}`} />
                  <span className="text-3xl font-bold text-white">
                    {counts[status]}
                  </span>
                </div>
                <p className="text-slate-400 font-medium">{config.label}</p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
