import { useState, useEffect } from "react";
import { Search, XCircle, RefreshCw } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useOrders, useUpdateOrder } from "../hooks/useOrders";
import { OrderStatus } from "../services/orders";
import { message } from "antd";
import { OrderStatusCards } from "../components/Orders/OrderStatusCards";
import { OrdersTable } from "../components/Orders/OrdersTable";
import { OrderNotification } from "../components/Orders/OrderNotification";
import useAuthStore from "../store/authStore";
import orderService from "../services/orderService";

const OrdersPage = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    data: fetchedOrders,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useOrders();

  useEffect(() => {
    if (fetchedOrders) {
      setOrders(fetchedOrders);
    }
  }, [fetchedOrders]);

  const updateOrder = useUpdateOrder();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">(
    "ALL"
  );
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<
    "ALL" | "PAID" | "UNPAID"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Get order counts by status
  const getOrderCounts = () => {
    if (!orders)
      return {
        PENDING: 0,
        CONFIRMED: 0,
        PREPARING: 0,
        READY: 0,
        COMPLETED: 0,
        CANCELLED: 0,
        ALL: 0,
      };

    return {
      PENDING: orders.filter((o) => o.status === "PENDING").length,
      CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
      PREPARING: orders.filter((o) => o.status === "PREPARING").length,
      READY: orders.filter((o) => o.status === "READY").length,
      COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
      CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
      ALL: orders.length,
    };
  };

  const counts = getOrderCounts();

  // Filter orders
  const filteredOrders =
    orders?.filter((order) => {
      const matchesStatus =
        selectedStatus === "ALL" || order.status === selectedStatus;
      const matchesPayment =
        selectedPaymentStatus === "ALL" ||
        (selectedPaymentStatus === "PAID" && order.paid) ||
        (selectedPaymentStatus === "UNPAID" && !order.paid);
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.phoneNumber.includes(searchQuery);

      return matchesStatus && matchesPayment && matchesSearch;
    }) || [];

  // Update order status
  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await updateOrder.mutateAsync({
        id: orderId,
        data: { status: newStatus },
      });
      message.success({
        content: `Order status updated to ${newStatus}`,
        style: { marginTop: "80px" },
      });
    } catch (error: any) {
      console.error("Failed to update order status:", error);
      message.error({
        content:
          error?.response?.data?.message || "Failed to update order status",
        style: { marginTop: "80px" },
      });
    }
  };

  // Get time since last update
  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((Date.now() - dataUpdatedAt) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  // useEffect(() => {
  //   fetchOrders();
  // }, [user]);

  // const fetchOrders = async () => {
  //   setLoading(true);
  //   try {
  //     // If user is STAFF, their locationId will automatically filter orders on backend
  //     // If user is ADMIN, they can see all orders or filter by location
  //     const data = await orderService.getAllOrders();
  //     setOrders(data);
  //   } catch (error) {
  //     message.error("Failed to fetch orders");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Card className="bg-red-500/10 border-red-500/30 p-8 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Failed to Load Orders
            </h2>
            <p className="text-slate-400 mb-4">Please try again later</p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="border-red-500/50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Notification Component */}
      <OrderNotification orders={orders} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Orders Management
            </h1>
            <p className="text-slate-400 mt-1">
              Real-time order tracking and management • Updated{" "}
              {getTimeSinceUpdate()}
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Status Cards */}
        <OrderStatusCards
          counts={counts}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          isLoading={isLoading}
        />

        {/* Search Bar and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by Order #, Name, Phone..."
                className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Payment Filter */}
            <div className="flex gap-2">
              <Button
                variant={
                  selectedPaymentStatus === "ALL" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedPaymentStatus("ALL")}
                className={
                  selectedPaymentStatus === "ALL"
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 text-slate-300"
                }
              >
                All Payments
              </Button>
              <Button
                variant={
                  selectedPaymentStatus === "PAID" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedPaymentStatus("PAID")}
                className={
                  selectedPaymentStatus === "PAID"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 text-slate-300"
                }
              >
                Paid
              </Button>
              <Button
                variant={
                  selectedPaymentStatus === "UNPAID" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedPaymentStatus("UNPAID")}
                className={
                  selectedPaymentStatus === "UNPAID"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 text-slate-300"
                }
              >
                Unpaid
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            {selectedStatus !== "ALL" && (
              <Badge
                variant="outline"
                className="border-orange-500/50 text-orange-400"
              >
                {selectedStatus}
              </Badge>
            )}
            {selectedPaymentStatus !== "ALL" && (
              <Badge
                variant="outline"
                className={
                  selectedPaymentStatus === "PAID"
                    ? "border-green-500/50 text-green-400"
                    : "border-red-500/50 text-red-400"
                }
              >
                {selectedPaymentStatus}
              </Badge>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable
          orders={filteredOrders}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
