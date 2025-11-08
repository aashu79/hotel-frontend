import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, Spin, Divider } from "antd";
import { MapPin, ExternalLink } from "lucide-react";

const CheckoutForm = ({
  formData,
  errors,
  handleInputChange,
  activeLocations,
  selectedLocationId,
  handleLocationChange,
  selectedLocation,
  deliveryServices,
  loadingServices,
}: any) => (
  <div>
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
        onChange={handleLocationChange}
        style={{ width: "100%" }}
        className="custom-select"
      >
        {activeLocations.map((location: any) => (
          <Select.Option key={location.id} value={location.id}>
            <div className="py-1">
              <div className="font-semibold text-white">{location.name}</div>
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
    {/* Delivery Services */}
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
              deliveryServices.map((service: any) => (
                <button
                  key={service.id}
                  onClick={() => window.open(service.serviceUrl, "_blank")}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-red-500/30 text-white px-4 py-2 rounded"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {service.name}
                </button>
              ))
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            External delivery services may have different pricing and delivery
            times
          </p>
        </div>
        <Divider style={{ borderColor: "#374151", margin: "16px 0" }} />
      </>
    )}
    {/* Table Number */}
    <div className="space-y-2 mt-4">
      <Label htmlFor="tableNumber" className="text-white">
        Table Number (Optional)
      </Label>
      <Input
        id="tableNumber"
        type="number"
        placeholder="Enter your table number (if dining in)"
        value={formData.tableNumber}
        onChange={(e) => handleInputChange("tableNumber", e.target.value)}
        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
      />
    </div>
    {/* Special Instructions */}
    <div className="space-y-2 mt-4">
      <Label htmlFor="specialInstructions" className="text-white">
        Special Instructions (Optional)
      </Label>
      <Textarea
        id="specialInstructions"
        placeholder="Any special requests or dietary requirements?"
        value={formData.specialInstructions}
        onChange={(e) =>
          handleInputChange("specialInstructions", e.target.value)
        }
        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 min-h-[120px]"
      />
    </div>
  </div>
);

export default CheckoutForm;
