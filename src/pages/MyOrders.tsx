import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMyOrders } from "@/hooks/useOrders";
import { OrderStatus } from "@/services/orders";
import { Skeleton } from "@/components/ui/skeleton";

import { ChefHat, CheckCheck } from "lucide-react";

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
    gradient: string;
  }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
    badgeVariant: "outline",
    gradient: "from-yellow-500/20 to-yellow-600/20",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCheck,
    color: "text-cyan-500",
    badgeVariant: "default",
    gradient: "from-cyan-500/20 to-cyan-600/20",
  },
  PREPARING: {
    label: "Preparing",
    icon: ChefHat,
    color: "text-blue-500",
    badgeVariant: "default",
    gradient: "from-blue-500/20 to-blue-600/20",
  },
  READY: {
    label: "Ready",
    icon: Package,
    color: "text-purple-500",
    badgeVariant: "default",
    gradient: "from-purple-500/20 to-purple-600/20",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-500",
    badgeVariant: "secondary",
    gradient: "from-green-500/20 to-green-600/20",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    badgeVariant: "destructive",
    gradient: "from-red-500/20 to-red-600/20",
  },
};

const MyOrders: React.FC = () => {
  const { data: orders, isLoading, error } = useMyOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            My Orders
          </h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800 p-6">
                <Skeleton className="h-8 w-3/4 mb-4 bg-gray-800" />
                <Skeleton className="h-4 w-1/2 mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-2/3 bg-gray-800" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            My Orders
          </h1>
          <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold text-white mb-2">
              No Orders Found
            </h2>
            <p className="text-gray-400 mb-6">
              You haven't placed any orders yet. Start exploring our menu!
            </p>
            <Button
              onClick={() => (window.location.href = "/menu")}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-6 rounded-xl text-lg"
            >
              Browse Menu
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            My Orders
          </h1>
          <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold text-white mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-400">Your order history will appear here</p>
          </Card>
        </div>
      </div>
    );
  }

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
            My Orders
          </h1>
          <p className="text-gray-400">Track your order status and history</p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order, index) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            const isExpanded = expandedOrderId === order.id;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`bg-gradient-to-r ${config.gradient} border-gray-800 hover:border-red-500/30 transition-all duration-300 overflow-hidden`}
                >
                  {/* Order Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <motion.div
                            animate={
                              order.status === "PREPARING"
                                ? { rotate: [0, 10, -10, 0] }
                                : {}
                            }
                            transition={{
                              duration: 2,
                              repeat:
                                order.status === "PREPARING" ? Infinity : 0,
                              ease: "easeInOut",
                            }}
                          >
                            <StatusIcon className={`w-6 h-6 ${config.color}`} />
                          </motion.div>
                          <h3 className="text-xl font-bold text-white">
                            Order #{order.id.slice(0, 8)}
                          </h3>
                          <Badge
                            variant={config.badgeVariant}
                            className="ml-auto"
                          >
                            {config.label}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-gray-400 text-sm">
                          <p>Table: {order.tableNumber || "N/A"}</p>
                          <p>Placed: {formatDate(order.createdAt)}</p>
                          <p>Items: {order.items.length}</p>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* Expandable Order Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Separator className="bg-gray-800" />
                        <div className="p-6 bg-gray-900/50">
                          <h4 className="text-white font-semibold mb-4">
                            Order Items
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((item, itemIndex) => (
                              <motion.div
                                key={itemIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: itemIndex * 0.1 }}
                                className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg"
                              >
                                <div>
                                  <p className="text-white font-medium">
                                    Item ID: {item.menuItemId.slice(0, 8)}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Order Timeline */}
                          <div className="mt-6 pt-6 border-t border-gray-800">
                            <h4 className="text-white font-semibold mb-4">
                              Order Timeline
                            </h4>
                            <div className="space-y-3">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3"
                              >
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <div>
                                  <p className="text-white text-sm">
                                    Order Placed
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    {formatDate(order.createdAt)}
                                  </p>
                                </div>
                              </motion.div>

                              {order.status !== "PENDING" && (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="flex items-center gap-3"
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      order.status === "PREPARING" ||
                                      order.status === "READY" ||
                                      order.status === "COMPLETED"
                                        ? "bg-blue-500"
                                        : "bg-gray-600"
                                    }`}
                                  ></div>
                                  <div>
                                    <p className="text-white text-sm">
                                      Preparing
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {formatDate(order.updatedAt)}
                                    </p>
                                  </div>
                                </motion.div>
                              )}

                              {order.status === "COMPLETED" && (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="flex items-center gap-3"
                                >
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <div>
                                    <p className="text-white text-sm">
                                      Completed
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {formatDate(order.updatedAt)}
                                    </p>
                                  </div>
                                </motion.div>
                              )}

                              {order.status === "CANCELLED" && (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="flex items-center gap-3"
                                >
                                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                  <div>
                                    <p className="text-white text-sm">
                                      Cancelled
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {formatDate(order.updatedAt)}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
