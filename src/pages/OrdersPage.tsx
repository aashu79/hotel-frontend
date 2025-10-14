import { useState } from "react";
import { MoreHorizontal, Search, Filter, ArrowUpDown } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface Order {
  id: string;
  customerName: string;
  status: "new" | "preparing" | "ready" | "delivered" | "cancelled";
  date: Date;
  total: number;
  items: number;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "Rahul Sharma",
      status: "new",
      date: new Date(2023, 6, 12, 14, 32),
      total: 540,
      items: 3,
    },
    {
      id: "ORD-002",
      customerName: "Priya Singh",
      status: "preparing",
      date: new Date(2023, 6, 12, 13, 15),
      total: 890,
      items: 5,
    },
    {
      id: "ORD-003",
      customerName: "Amit Patel",
      status: "ready",
      date: new Date(2023, 6, 12, 12, 45),
      total: 350,
      items: 2,
    },
    {
      id: "ORD-004",
      customerName: "Deepika Reddy",
      status: "delivered",
      date: new Date(2023, 6, 12, 11, 20),
      total: 780,
      items: 4,
    },
    {
      id: "ORD-005",
      customerName: "Vikram Kumar",
      status: "cancelled",
      date: new Date(2023, 6, 12, 10, 5),
      total: 450,
      items: 2,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-500 text-white";
      case "preparing":
        return "bg-yellow-500 text-white";
      case "ready":
        return "bg-green-500 text-white";
      case "delivered":
        return "bg-gray-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Orders
            </h1>
            <p className="text-slate-400 mt-1">
              Manage and track customer orders
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search orders..."
              className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-10 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableHead className="text-slate-300">Order ID</TableHead>
                <TableHead className="text-slate-300">Customer</TableHead>
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Items</TableHead>
                <TableHead className="text-right text-slate-300">
                  Total
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-slate-800 hover:bg-slate-800/30"
                  >
                    <TableCell className="font-medium text-slate-200">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {order.customerName}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {order.date.toLocaleDateString()}{" "}
                      {order.date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {order.items}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-200">
                      ₹{order.total}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-900 border-slate-800"
                        >
                          <DropdownMenuLabel className="text-slate-200">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer">
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem
                            onClick={() => updateOrderStatus(order.id, "new")}
                            className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                          >
                            Mark as New
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "preparing")
                            }
                            className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                          >
                            Mark as Preparing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateOrderStatus(order.id, "ready")}
                            className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                          >
                            Mark as Ready
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "delivered")
                            }
                            className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                          >
                            Mark as Delivered
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "cancelled")
                            }
                            className="text-red-400 hover:bg-red-950/50 hover:text-red-300 cursor-pointer"
                          >
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-slate-400"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
