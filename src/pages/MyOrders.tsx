import React, { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  ChevronDown,
  ChevronUp,
  Calendar,
  Hash,
  UtensilsCrossed,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMyOrders } from "@/hooks/useOrders";
import { OrderStatus, Order } from "@/services/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepayment } from "@/hooks/usePayment";

import { ChefHat, CheckCheck, RotateCw } from "lucide-react";

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    glowColor: string;
    badgeClass: string;
  }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    glowColor: "shadow-amber-500/20",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCheck,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    glowColor: "shadow-cyan-500/20",
    badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  PREPARING: {
    label: "Preparing",
    icon: ChefHat,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    glowColor: "shadow-blue-500/20",
    badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  READY: {
    label: "Ready",
    icon: Package,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    glowColor: "shadow-purple-500/20",
    badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    glowColor: "shadow-emerald-500/20",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    glowColor: "shadow-rose-500/20",
    badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
};

const REFRESH_INTERVAL = 20;
const MyOrders: React.FC = () => {
  const { data: orders, isLoading, error, refetch, isFetching } = useMyOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [refreshIn, setRefreshIn] = useState(REFRESH_INTERVAL);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const repayment = useRepayment();

  // Countdown timer for next auto-refresh
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRefreshIn((prev) => (prev > 1 ? prev - 1 : REFRESH_INTERVAL));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Reset timer on manual or auto refetch
  useEffect(() => {
    setRefreshIn(REFRESH_INTERVAL);
  }, [isFetching]);

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

  const handleRepayment = async (order: Order) => {
    try {
      // Map order items to the format expected by the API
      const items = order.items.map((item) => ({
        id: item.menuItemId,
        name: item.menuItem?.name || `Item ${item.menuItemId.slice(0, 8)}`,
        price: item.menuItem?.price || order.totalAmount / order.items.length,
        quantity: item.quantity,
      }));

      await repayment.mutateAsync({
        orderId: order.id,
        items,
        currency: "usd",
        userId: order.userId,
        locationId: order.locationId || "",
        tableNumber: order.tableNumber,
        specialInstructions: order.specialInstructions,
      });
      // Redirect happens automatically in the hook
    } catch (error) {
      console.error("Repayment failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                My Orders
              </h1>
            </div>
          </div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="bg-gray-900/40 backdrop-blur-xl border-gray-800/50 p-6"
              >
                <Skeleton className="h-8 w-3/4 mb-4 bg-gray-800/50" />
                <Skeleton className="h-4 w-1/2 mb-2 bg-gray-800/50" />
                <Skeleton className="h-4 w-2/3 bg-gray-800/50" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-3xl"></div>
            <Card className="relative bg-gray-900/40 backdrop-blur-xl border-gray-800/50 p-12 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
                  <Package className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  No Orders Found
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  You haven't placed any orders yet. Start exploring our menu!
                </p>
                <Button
                  onClick={() => (window.location.href = "/menu")}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-10 py-6 rounded-2xl text-lg font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all"
                >
                  Browse Menu
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/10 blur-3xl"></div>
            <Card className="relative bg-gray-900/40 backdrop-blur-xl border-gray-800/50 p-12 text-center">
              <div className="w-20 h-20 bg-gray-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                No Orders Yet
              </h2>
              <p className="text-gray-400 text-lg">
                Your order history will appear here
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              My Orders
            </h1>
            <p className="text-gray-400 mt-1">
              Track your order status and history
            </p>
          </div>
          <motion.button
            onClick={() => refetch()}
            className="ml-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all flex items-center gap-2"
            title="Refresh Orders"
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            <motion.span
              animate={isFetching ? { rotate: 360 } : { rotate: 0 }}
              transition={
                isFetching
                  ? { repeat: Infinity, duration: 0.8, ease: "linear" }
                  : {}
              }
              className="inline-flex"
            >
              <RotateCw className="w-5 h-5" />
            </motion.span>
            <span className="hidden sm:inline">Refresh</span>
            <motion.span
              className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-900/80 text-orange-200 font-bold text-xs font-mono shadow-sm"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            >
              <Clock className="w-4 h-4 text-orange-300" />
              {refreshIn}s
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Orders Grid */}
        <div className="grid gap-6">
          {orders.map((order, index) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            const isExpanded = expandedOrderId === order.id;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`relative bg-gray-900/40 backdrop-blur-xl border ${
                    config.borderColor
                  } hover:border-${
                    config.color.split("-")[1]
                  }-500/50 transition-all duration-500 overflow-hidden group shadow-xl ${
                    config.glowColor
                  } hover:shadow-2xl cursor-pointer`}
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  {/* Animated background gradient */}
                  <div
                    className={`absolute inset-0 ${config.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Order Header */}
                  <div className="relative p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Section - Icon & Info */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Status Icon with Animation */}
                        <motion.div
                          className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-3 shadow-lg`}
                          animate={
                            order.status === "PREPARING"
                              ? {
                                  rotate: [0, -10, 10, -10, 0],
                                  scale: [1, 1.05, 1],
                                }
                              : {}
                          }
                          transition={{
                            duration: 2,
                            repeat: order.status === "PREPARING" ? Infinity : 0,
                            ease: "easeInOut",
                          }}
                        >
                          <StatusIcon className={`w-7 h-7 ${config.color}`} />
                        </motion.div>

                        {/* Order Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <h3 className="text-2xl font-bold text-white">
                              Order #{order.id.slice(0, 8).toUpperCase()}
                            </h3>
                            <Badge
                              className={`${config.badgeClass} border px-3 py-1 font-semibold`}
                            >
                              {config.label}
                            </Badge>
                            {/* Payment Status Badge */}
                            {order.paid !== undefined && (
                              <Badge
                                className={`${
                                  order.paid
                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                    : "bg-red-500/20 text-red-300 border-red-500/30"
                                } border px-3 py-1 font-semibold`}
                              >
                                {order.paid ? "Paid" : "Unpaid"}
                              </Badge>
                            )}
                          </div>

                          {/* Unpaid Order Alert */}
                          {!order.paid && order.status !== "CANCELLED" && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <span className="text-red-300 font-medium">
                                  Payment Required
                                </span>
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRepayment(order);
                                }}
                                disabled={repayment.isPending}
                                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2 text-sm rounded-lg"
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                {repayment.isPending
                                  ? "Processing..."
                                  : "Pay Now"}
                              </Button>
                            </motion.div>
                          )}

                          {/* Info Grid */}
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center">
                                <Hash className="w-4 h-4 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                  Table
                                </p>
                                <p className="text-sm font-semibold text-white">
                                  {order.tableNumber || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                  Placed
                                </p>
                                <p className="text-sm font-semibold text-white">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric" }
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center">
                                <UtensilsCrossed className="w-4 h-4 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                  Items
                                </p>
                                <p className="text-sm font-semibold text-white">
                                  {order.items.length} item
                                  {order.items.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expand Button */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center group-hover:bg-gray-800 transition-colors"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="border-t border-gray-800/50"></div>
                        <div className="relative p-6 bg-black/20">
                          {/* Order Items */}
                          <div className="mb-6">
                            <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                              <div className="w-1 h-5 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
                              Order Items
                            </h4>
                            <div className="grid gap-3">
                              {order.items.map((item, itemIndex) => (
                                <motion.div
                                  key={itemIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: itemIndex * 0.05 }}
                                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl hover:bg-gray-800/50 transition-all group/item"
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                                        <UtensilsCrossed className="w-5 h-5 text-red-400" />
                                      </div>
                                      <div>
                                        <p className="text-white font-semibold">
                                          Item ID:{" "}
                                          {item.menuItemId
                                            .slice(0, 8)
                                            .toUpperCase()}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                          Quantity: {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-red-500/30">
                                      {item.quantity}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Order Timeline */}
                          <div className="mt-6">
                            <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                              <div className="w-1 h-5 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
                              Order Timeline
                            </h4>
                            <div className="relative pl-8">
                              {/* Timeline line */}
                              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-gray-700 to-transparent"></div>

                              {/* Order Placed */}
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative mb-6"
                              >
                                <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 ring-4 ring-emerald-500/20"></div>
                                <div className="bg-gray-800/30 backdrop-blur-sm border border-emerald-500/30 p-4 rounded-xl">
                                  <p className="text-white font-semibold flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    Order Placed
                                  </p>
                                  <p className="text-gray-400 text-sm mt-1">
                                    {formatDate(order.createdAt)}
                                  </p>
                                </div>
                              </motion.div>

                              {/* Confirmed/Preparing */}
                              {order.status !== "PENDING" &&
                                order.status !== "CANCELLED" && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="relative mb-6"
                                  >
                                    <div
                                      className={`absolute -left-8 top-1 w-3 h-3 rounded-full ${
                                        order.status === "PREPARING" ||
                                        order.status === "READY" ||
                                        order.status === "COMPLETED"
                                          ? "bg-blue-500 shadow-lg shadow-blue-500/50 ring-4 ring-blue-500/20"
                                          : "bg-gray-600"
                                      }`}
                                    ></div>
                                    <div
                                      className={`bg-gray-800/30 backdrop-blur-sm border ${
                                        order.status === "PREPARING" ||
                                        order.status === "READY" ||
                                        order.status === "COMPLETED"
                                          ? "border-blue-500/30"
                                          : "border-gray-700/30"
                                      } p-4 rounded-xl`}
                                    >
                                      <p className="text-white font-semibold flex items-center gap-2">
                                        <ChefHat className="w-4 h-4 text-blue-400" />
                                        Preparing
                                      </p>
                                      <p className="text-gray-400 text-sm mt-1">
                                        {formatDate(order.updatedAt)}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                              {/* Ready */}
                              {(order.status === "READY" ||
                                order.status === "COMPLETED") && (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="relative mb-6"
                                >
                                  <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50 ring-4 ring-purple-500/20"></div>
                                  <div className="bg-gray-800/30 backdrop-blur-sm border border-purple-500/30 p-4 rounded-xl">
                                    <p className="text-white font-semibold flex items-center gap-2">
                                      <Package className="w-4 h-4 text-purple-400" />
                                      Ready for Pickup
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">
                                      {formatDate(order.updatedAt)}
                                    </p>
                                  </div>
                                </motion.div>
                              )}

                              {/* Completed */}
                              {order.status === "COMPLETED" && (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 }}
                                  className="relative"
                                >
                                  <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 ring-4 ring-emerald-500/20"></div>
                                  <div className="bg-gray-800/30 backdrop-blur-sm border border-emerald-500/30 p-4 rounded-xl">
                                    <p className="text-white font-semibold flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                                      Completed
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">
                                      {formatDate(order.updatedAt)}
                                    </p>
                                  </div>
                                </motion.div>
                              )}

                              {/* Cancelled */}
                              {order.status === "CANCELLED" && (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="relative"
                                >
                                  <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50 ring-4 ring-rose-500/20"></div>
                                  <div className="bg-gray-800/30 backdrop-blur-sm border border-rose-500/30 p-4 rounded-xl">
                                    <p className="text-white font-semibold flex items-center gap-2">
                                      <XCircle className="w-4 h-4 text-rose-400" />
                                      Cancelled
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">
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
