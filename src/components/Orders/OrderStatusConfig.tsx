import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  ChefHat,
  CheckCheck,
} from "lucide-react";
import { OrderStatus } from "../../services/orders";

// Status configuration
export const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-500/30",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCheck,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-500/30",
  },
  PREPARING: {
    label: "Preparing",
    icon: ChefHat,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30",
  },
  READY: {
    label: "Ready",
    icon: Package,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/30",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400",
    borderColor: "border-green-500/30",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
  },
};
