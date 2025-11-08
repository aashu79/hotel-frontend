import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  CheckCheck,
  ChefHat,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { OrderStatus } from "../../services/orders";
import { statusConfig } from "./OrderStatusConfig";
import { Skeleton } from "../ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
  total: number;
  menuItem: {
    id: string;
    name: string;
    description: string;
    price: number;
    isVegetarian: boolean;
    imageUrl: string;
  };
}

interface OrderData {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  paid: boolean;
  specialNotes: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    phoneNumber: string;
  };
  items: OrderItem[];
}

interface OrdersTableProps {
  orders: OrderData[];
  isLoading: boolean;
  searchQuery: string;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  isLoading,
  searchQuery,
  onStatusUpdate,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (orderId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-slate-300">Order #</TableHead>
              <TableHead className="text-slate-300">Customer</TableHead>
              <TableHead className="text-slate-300">Phone</TableHead>
              <TableHead className="text-slate-300">Items</TableHead>
              <TableHead className="text-slate-300">Total</TableHead>
              <TableHead className="text-slate-300">Payment</TableHead>
              <TableHead className="text-slate-300">Date</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-slate-800">
                <TableCell>
                  <Skeleton className="h-4 w-4 bg-slate-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32 bg-slate-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24 bg-slate-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28 bg-slate-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12 bg-slate-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 bg-slate-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24 bg-slate-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 bg-slate-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 bg-slate-800" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800">
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-slate-300">Order #</TableHead>
              <TableHead className="text-slate-300">Customer</TableHead>
              <TableHead className="text-slate-300">Phone</TableHead>
              <TableHead className="text-slate-300">Items</TableHead>
              <TableHead className="text-slate-300">Total</TableHead>
              <TableHead className="text-slate-300">Payment</TableHead>
              <TableHead className="text-slate-300">Date</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-12 text-slate-400"
              >
                <Package className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                <p className="font-medium">No orders found</p>
                <p className="text-sm text-slate-500 mt-1">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Orders will appear here"}
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-slate-800/50">
            <TableHead className="w-10"></TableHead>
            <TableHead className="text-slate-300">Order #</TableHead>
            <TableHead className="text-slate-300">Customer</TableHead>
            <TableHead className="text-slate-300">Phone</TableHead>
            <TableHead className="text-slate-300">Items Summary</TableHead>
            <TableHead className="text-slate-300">Total</TableHead>
            <TableHead className="text-slate-300">Payment</TableHead>
            <TableHead className="text-slate-300">Date</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            const isExpanded = expandedRows.has(order.id);

            return (
              <>
                {/* Main Row */}
                <TableRow
                  key={order.id}
                  className="border-slate-800 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={() => toggleRow(order.id)}
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-slate-700"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-mono text-slate-200 text-sm font-semibold">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {order.user.name}
                  </TableCell>
                  <TableCell className="font-mono text-slate-400 text-sm">
                    {order.user.phoneNumber}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="text-slate-200">
                            {item.menuItem.name}
                          </span>
                          <span className="text-slate-500">
                            {" "}
                            × {item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-slate-500">
                          +{order.items.length - 2} more
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-200 font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        order.paid
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      } border`}
                    >
                      {order.paid ? "Paid" : "Unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${config.bgColor} ${config.textColor} ${config.borderColor} border`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
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
                          Update Status
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem
                          onClick={() => onStatusUpdate(order.id, "PENDING")}
                          disabled={order.status === "PENDING"}
                          className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                        >
                          <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusUpdate(order.id, "CONFIRMED")}
                          disabled={order.status === "CONFIRMED"}
                          className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                        >
                          <CheckCheck className="w-4 h-4 mr-2 text-cyan-500" />
                          Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusUpdate(order.id, "PREPARING")}
                          disabled={order.status === "PREPARING"}
                          className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                        >
                          <ChefHat className="w-4 h-4 mr-2 text-blue-500" />
                          Preparing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusUpdate(order.id, "READY")}
                          disabled={order.status === "READY"}
                          className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                        >
                          <Package className="w-4 h-4 mr-2 text-purple-500" />
                          Ready
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusUpdate(order.id, "COMPLETED")}
                          disabled={order.status === "COMPLETED"}
                          className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Completed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem
                          onClick={() => onStatusUpdate(order.id, "CANCELLED")}
                          disabled={order.status === "CANCELLED"}
                          className="text-red-400 hover:bg-red-950/50 hover:text-red-300 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                {/* Expanded Row with Order Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <TableRow className="border-slate-800">
                      <TableCell colSpan={10} className="p-0 bg-slate-800/30">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-6"
                        >
                          <div className="space-y-4">
                            {/* Customer Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <p className="text-slate-400 text-sm mb-1">
                                  Customer Name
                                </p>
                                <p className="text-slate-200 font-semibold">
                                  {order.user.name}
                                </p>
                              </div>
                              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <p className="text-slate-400 text-sm mb-1">
                                  Phone Number
                                </p>
                                <p className="text-slate-200 font-mono">
                                  {order.user.phoneNumber}
                                </p>
                              </div>
                              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <p className="text-slate-400 text-sm mb-1">
                                  Order Total
                                </p>
                                <p className="text-orange-400 font-bold text-xl">
                                  ${order.totalAmount.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {/* Special Notes */}
                            {order.specialNotes && (
                              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-4">
                                <p className="text-slate-400 text-sm mb-1">
                                  Special Notes
                                </p>
                                <p className="text-slate-200">
                                  {order.specialNotes}
                                </p>
                              </div>
                            )}

                            {/* Order Items */}
                            <div>
                              <h4 className="text-slate-200 font-semibold mb-3 flex items-center">
                                <Package className="w-4 h-4 mr-2 text-orange-400" />
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700"
                                  >
                                    {/* Item Image */}
                                    <img
                                      src={item.menuItem.imageUrl}
                                      alt={item.menuItem.name}
                                      className="w-16 h-16 object-cover rounded-lg"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          "https://via.placeholder.com/64?text=Food";
                                      }}
                                    />

                                    {/* Item Details */}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h5 className="text-slate-200 font-semibold">
                                          {item.menuItem.name}
                                        </h5>
                                        {item.menuItem.isVegetarian && (
                                          <Badge
                                            variant="outline"
                                            className="border-green-500/50 text-green-400 text-xs"
                                          >
                                            Veg
                                          </Badge>
                                        )}
                                      </div>
                                      <p
                                        className="text-slate-400 text-sm line-clamp-1"
                                        dangerouslySetInnerHTML={{
                                          __html: item.menuItem.description,
                                        }}
                                      />
                                    </div>

                                    {/* Quantity & Price */}
                                    <div className="text-right">
                                      <p className="text-slate-300 font-semibold">
                                        Qty: {item.quantity}
                                      </p>
                                      <p className="text-slate-400 text-sm">
                                        ${item.price.toFixed(2)} each
                                      </p>
                                      <p className="text-orange-400 font-bold">
                                        ${item.total.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
