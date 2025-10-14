import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Upload,
  message,
  Row,
  Col,
  Divider,
  Spin,
} from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../lib/axios";
import type { UploadFile } from "antd/es/upload/interface";

interface RestaurantConfig {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  isOpen: boolean;
  isBusy: boolean;
  logoUrl?: string;
  heroImageUrl?: string;
}

interface RestaurantFormData {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  isOpen: boolean;
  isBusy: boolean;
}

// Validation schema
const restaurantSchema = yup.object({
  name: yup
    .string()
    .required("Restaurant name is required")
    .min(2, "Name must be at least 2 characters"),
  description: yup.string(),
  address: yup.string(),
  city: yup.string(),
  state: yup.string(),
  country: yup.string(),
  postalCode: yup.string(),
  phoneNumber: yup
    .string()
    .matches(/^[0-9+\-() ]*$/, "Invalid phone number format"),
  email: yup.string().email("Invalid email format"),
  website: yup.string().url("Invalid website URL"),
  openingHours: yup.string(),
  isOpen: yup.boolean().default(true),
  isBusy: yup.boolean().default(false),
});

const RestaurantSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [logoFile, setLogoFile] = useState<UploadFile | null>(null);
  const [heroFile, setHeroFile] = useState<UploadFile | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [heroPreview, setHeroPreview] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(restaurantSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      phoneNumber: "",
      email: "",
      website: "",
      openingHours: "",
      isOpen: true,
      isBusy: false,
    },
  });

  // Fetch restaurant config
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/restaurant/config");
      const data = response.data;
      setConfig(data);
      reset({
        name: data.name || "",
        description: data.description || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "India",
        postalCode: data.postalCode || "",
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        website: data.website || "",
        openingHours: data.openingHours || "",
        isOpen: data.isOpen ?? true,
        isBusy: data.isBusy ?? false,
      });
      setLogoPreview(data.logoUrl || "");
      setHeroPreview(data.heroImageUrl || "");
    } catch (error) {
      message.error("Failed to fetch restaurant settings");
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle form submission
  const onSubmit = async (data: RestaurantFormData) => {
    setSaving(true);
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value.toString());
        }
      });

      if (logoFile?.originFileObj) {
        formData.append("logo", logoFile.originFileObj);
      }
      if (heroFile?.originFileObj) {
        formData.append("heroImage", heroFile.originFileObj);
      }

      await api.put("/api/restaurant/config", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Restaurant settings updated successfully");
      fetchConfig();
      setLogoFile(null);
      setHeroFile(null);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Failed to update settings");
      console.error("Error updating settings:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle quick status toggle
  const handleStatusToggle = async (
    field: "isOpen" | "isBusy",
    value: boolean
  ) => {
    try {
      await api.put("/api/restaurant/config", { [field]: value });
      message.success("Status updated successfully");
      fetchConfig();
    } catch (error) {
      message.error("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 200px)",
          }}
        >
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#cbd5e1",
              margin: 0,
            }}
          >
            Restaurant Settings
          </h1>
          <p style={{ color: "#64748b", marginTop: "8px" }}>
            Manage your restaurant configuration and operational status
          </p>
        </div>

        {/* Quick Status Card */}
        <Card
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ color: "#cbd5e1", marginBottom: "16px" }}>
            Operational Status
          </h2>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  background: "#1e293b",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <h3 style={{ color: "#cbd5e1", margin: 0 }}>
                    Restaurant Open
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                    Toggle restaurant availability
                  </p>
                </div>
                <Switch
                  checked={config?.isOpen ?? true}
                  onChange={(value) => handleStatusToggle("isOpen", value)}
                  checkedChildren="Open"
                  unCheckedChildren="Closed"
                  style={{ minWidth: "80px" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  background: "#1e293b",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <h3 style={{ color: "#cbd5e1", margin: 0 }}>Busy Status</h3>
                  <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                    Indicate high demand periods
                  </p>
                </div>
                <Switch
                  checked={config?.isBusy ?? false}
                  onChange={(value) => handleStatusToggle("isBusy", value)}
                  checkedChildren="Busy"
                  unCheckedChildren="Normal"
                  style={{ minWidth: "80px" }}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Configuration Form */}
        <Card
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
          }}
        >
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            {/* Basic Information */}
            <h2 style={{ color: "#cbd5e1", marginBottom: "16px" }}>
              Basic Information
            </h2>
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Restaurant Name"
                  validateStatus={errors.name ? "error" : ""}
                  help={errors.name?.message as string}
                  required
                >
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Himalayan Restro"
                        size="large"
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Phone Number"
                  validateStatus={errors.phoneNumber ? "error" : ""}
                  help={errors.phoneNumber?.message as string}
                >
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="+91 1234567890"
                        size="large"
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Email"
                  validateStatus={errors.email ? "error" : ""}
                  help={errors.email?.message as string}
                >
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="info@himalayan.com"
                        size="large"
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Website"
                  validateStatus={errors.website ? "error" : ""}
                  help={errors.website?.message as string}
                >
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="https://himalayan.com"
                        size="large"
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Description"
                  validateStatus={errors.description ? "error" : ""}
                  help={errors.description?.message as string}
                >
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Input.TextArea
                        {...field}
                        placeholder="Restaurant description"
                        rows={3}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ borderColor: "#1e293b" }} />

            {/* Address Information */}
            <h2 style={{ color: "#cbd5e1", marginBottom: "16px" }}>
              Address Information
            </h2>
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  label="Street Address"
                  validateStatus={errors.address ? "error" : ""}
                  help={errors.address?.message as string}
                >
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="123 Main Street"
                        size="large"
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="City"
                  validateStatus={errors.city ? "error" : ""}
                  help={errors.city?.message as string}
                >
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Mumbai" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="State"
                  validateStatus={errors.state ? "error" : ""}
                  help={errors.state?.message as string}
                >
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Maharashtra"
                        size="large"
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="Country"
                  validateStatus={errors.country ? "error" : ""}
                  help={errors.country?.message as string}
                >
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="India" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="Postal Code"
                  validateStatus={errors.postalCode ? "error" : ""}
                  help={errors.postalCode?.message as string}
                >
                  <Controller
                    name="postalCode"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="400001" size="large" />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ borderColor: "#1e293b" }} />

            {/* Operating Hours */}
            <h2 style={{ color: "#cbd5e1", marginBottom: "16px" }}>
              Operating Hours
            </h2>
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  label="Opening Hours"
                  validateStatus={errors.openingHours ? "error" : ""}
                  help={errors.openingHours?.message as string}
                >
                  <Controller
                    name="openingHours"
                    control={control}
                    render={({ field }) => (
                      <Input.TextArea
                        {...field}
                        placeholder="Monday - Friday: 11:00 AM - 10:00 PM&#10;Saturday - Sunday: 10:00 AM - 11:00 PM"
                        rows={3}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ borderColor: "#1e293b" }} />

            {/* Media Upload */}
            <h2 style={{ color: "#cbd5e1", marginBottom: "16px" }}>
              Branding & Media
            </h2>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Restaurant Logo">
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    fileList={logoFile ? [logoFile] : []}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith("image/");
                      if (!isImage) {
                        message.error("You can only upload image files!");
                        return false;
                      }
                      const isLt5M = file.size / 1024 / 1024 < 5;
                      if (!isLt5M) {
                        message.error("Image must be smaller than 5MB!");
                        return false;
                      }

                      setLogoFile({
                        uid: file.uid,
                        name: file.name,
                        status: "done",
                        url: "",
                        originFileObj: file,
                      } as UploadFile);
                      return false;
                    }}
                    onRemove={() => setLogoFile(null)}
                  >
                    {!logoFile && !logoPreview && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload Logo</div>
                      </div>
                    )}
                  </Upload>
                  {logoPreview && !logoFile && (
                    <img
                      src={logoPreview}
                      alt="Current Logo"
                      style={{
                        maxWidth: "200px",
                        marginTop: "8px",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Hero Image">
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    fileList={heroFile ? [heroFile] : []}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith("image/");
                      if (!isImage) {
                        message.error("You can only upload image files!");
                        return false;
                      }
                      const isLt5M = file.size / 1024 / 1024 < 5;
                      if (!isLt5M) {
                        message.error("Image must be smaller than 5MB!");
                        return false;
                      }

                      setHeroFile({
                        uid: file.uid,
                        name: file.name,
                        status: "done",
                        url: "",
                        originFileObj: file,
                      } as UploadFile);
                      return false;
                    }}
                    onRemove={() => setHeroFile(null)}
                  >
                    {!heroFile && !heroPreview && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload Hero Image</div>
                      </div>
                    )}
                  </Upload>
                  {heroPreview && !heroFile && (
                    <img
                      src={heroPreview}
                      alt="Current Hero"
                      style={{
                        maxWidth: "200px",
                        marginTop: "8px",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>

            {/* Submit Button */}
            <Form.Item style={{ marginTop: "32px", marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                loading={saving}
                style={{
                  background: "linear-gradient(135deg, #fb923c, #ea580c)",
                  border: "none",
                  width: "100%",
                }}
              >
                Save Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RestaurantSettings;
