import React from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, Spin, Divider, message } from "antd";
import { DeliveryService } from "@/services/deliveryService";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phoneNumber?: string;
  openingHours?: string;
}

interface OrderDetailsFormProps {
  formData: {
    tableNumber: string;
    specialInstructions: string;
  };
  selectedLocationId: string | null;
  activeLocations: Location[];
  deliveryServices: DeliveryService[];
  loadingServices: boolean;
  onInputChange: (field: string, value: string) => void;
  onLocationChange: (locationId: string) => void;
}

const OrderDetailsForm: React.FC<OrderDetailsFormProps> = ({
  formData,
  selectedLocationId,
  activeLocations,
  deliveryServices,
  loadingServices,
  onInputChange,
  onLocationChange,
}) => {
  const selectedLocation = activeLocations.find(
    (loc) => loc.id === selectedLocationId
  );

  const handleLocationSelect = (locationId: string) => {
    onLocationChange(locationId);
    const location = activeLocations?.find((loc) => loc.id === locationId);
    if (location) {
      message.success(`Location changed to ${location.name}`);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>

      <div className="space-y-6">
        {/* Location Selection */}
        <div className="space-y-2">
          <Label className="text-white flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Select Location <span className="text-red-500">*</span>
          </Label>
          <Select
            size="large"
            placeholder="Choose your nearest location"
            value={selectedLocationId || undefined}
            onChange={handleLocationSelect}
            style={{ width: "100%" }}
            className="custom-select"
          >
            {activeLocations.map((location) => (
              <Select.Option key={location.id} value={location.id}>
                <div className="py-1">
                  <div className="font-semibold text-white">
                    {location.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {location.address}, {location.city}
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
          {selectedLocation && (
            <div className="mt-2 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-green-400 font-medium">
                    {selectedLocation.name}
                  </div>
                  <div className="text-gray-300 text-xs mt-1">
                    {selectedLocation.address}, {selectedLocation.city}
                    {selectedLocation.phoneNumber && (
                      <> • {selectedLocation.phoneNumber}</>
                    )}
                  </div>
                  {selectedLocation.openingHours && (
                    <div className="text-gray-400 text-xs mt-1">
                      {selectedLocation.openingHours}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Services - Only show if location is selected */}
        {selectedLocationId && deliveryServices.length > 0 && (
          <>
            <Divider style={{ borderColor: "#374151", margin: "16px 0" }} />
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Or Order via Delivery Service
              </Label>
              <div className="flex flex-wrap gap-2">
                {loadingServices ? (
                  <div className="flex justify-center py-4 w-full">
                    <Spin />
                  </div>
                ) : (
                  deliveryServices.map((service) => (
                    <Button
                      key={service.id}
                      onClick={() => window.open(service.serviceUrl, "_blank")}
                      variant="outline"
                      className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-red-500/30 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {service.name}
                    </Button>
                  ))
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                External delivery services may have different pricing and
                delivery times
              </p>
            </div>
            <Divider style={{ borderColor: "#374151", margin: "16px 0" }} />
          </>
        )}

        {/* Table Number */}
        <div className="space-y-2">
          <Label htmlFor="tableNumber" className="text-white">
            Table Number (Optional)
          </Label>
          <Input
            id="tableNumber"
            type="number"
            placeholder="Enter your table number (if dining in)"
            value={formData.tableNumber}
            onChange={(e) => onInputChange("tableNumber", e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
          />
        </div>

        {/* Special Instructions */}
        <div className="space-y-2">
          <Label htmlFor="specialInstructions" className="text-white">
            Special Instructions (Optional)
          </Label>
          <Textarea
            id="specialInstructions"
            placeholder="Any special requests or dietary requirements?"
            value={formData.specialInstructions}
            onChange={(e) =>
              onInputChange("specialInstructions", e.target.value)
            }
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 min-h-[120px]"
          />
        </div>
      </div>
    </Card>
  );
};

export default OrderDetailsForm;
