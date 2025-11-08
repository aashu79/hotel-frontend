import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Percent, RefreshCw } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { message } from "antd";
import {
  useTaxServiceRates,
  useCreateTaxServiceRate,
  useUpdateTaxServiceRate,
  useDeleteTaxServiceRate,
} from "../hooks/useTaxServiceRates";
import { TaxServiceRate } from "../services/taxServiceRates";

const TaxServiceRateManagement = () => {
  const { data: rates, isLoading, refetch } = useTaxServiceRates();
  const createRate = useCreateTaxServiceRate();
  const updateRate = useUpdateTaxServiceRate();
  const deleteRate = useDeleteTaxServiceRate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<TaxServiceRate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    isActive: true,
  });

  const handleOpenModal = (rate?: TaxServiceRate) => {
    if (rate) {
      setEditingRate(rate);
      setFormData({
        name: rate.name,
        rate: (rate.rate * 100).toString(), // Convert to percentage
        isActive: rate.isActive,
      });
    } else {
      setEditingRate(null);
      setFormData({ name: "", rate: "", isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRate(null);
    setFormData({ name: "", rate: "", isActive: true });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.rate) {
      message.error("Please fill in all required fields");
      return;
    }

    const rateValue = parseFloat(formData.rate) / 100; // Convert percentage to decimal

    if (isNaN(rateValue) || rateValue < 0 || rateValue > 1) {
      message.error("Rate must be between 0 and 100");
      return;
    }

    try {
      const data = {
        name: formData.name,
        rate: rateValue,
        isActive: formData.isActive,
      };

      if (editingRate) {
        await updateRate.mutateAsync({ id: editingRate.id, data });
        message.success("Rate updated successfully");
      } else {
        await createRate.mutateAsync(data);
        message.success("Rate created successfully");
      }

      handleCloseModal();
      refetch();
    } catch (error) {
      message.error("Failed to save rate");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRate.mutateAsync(id);
      message.success("Rate deleted successfully");
      refetch();
    } catch (error) {
      message.error("Failed to delete rate");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Tax & Service Rate Management
            </h1>
            <p className="text-slate-400 mt-1">
              Manage tax and service rates for orders
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Rate
            </Button>
          </div>
        </div>

        {/* Rates Table */}
        <Card className="bg-slate-900/50 border-slate-800">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Rate</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex justify-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : rates && rates.length > 0 ? (
                rates.map((rate) => (
                  <TableRow
                    key={rate.id}
                    className="border-slate-800 hover:bg-slate-800/30"
                  >
                    <TableCell className="font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-orange-400" />
                        {rate.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {(rate.rate * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={rate.isActive ? "default" : "secondary"}
                        className={
                          rate.isActive
                            ? "bg-green-500/20 text-green-400 border-green-500/50"
                            : "bg-slate-500/20 text-slate-400 border-slate-500/50"
                        }
                      >
                        {rate.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(rate)}
                          className="hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(rate.id)}
                          className="hover:bg-red-900/30 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-12 text-slate-400"
                  >
                    No rates found. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingRate ? "Edit Rate" : "Create New Rate"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rate Name</Label>
              <Input
                id="name"
                placeholder="e.g., GST, Service Charge"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                placeholder="e.g., 18 for 18%"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({ ...formData, rate: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="border-slate-700 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createRate.isPending || updateRate.isPending}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {createRate.isPending || updateRate.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TaxServiceRateManagement;
