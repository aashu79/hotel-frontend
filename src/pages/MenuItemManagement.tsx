import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Space,
  message,
  Popconfirm,
  Upload,
  Card,
  Tag,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../lib/axios";
import type { UploadFile } from "antd/es/upload/interface";

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  prepTimeMins?: number;
  sortOrder?: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface MenuCategory {
  id: number;
  name: string;
}

interface MenuItemFormData {
  name: string;
  description?: string;
  price: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  prepTimeMins?: number;
  sortOrder?: number;
  categoryId: number;
}

// Validation schema matching backend
const menuItemSchema = yup.object({
  name: yup.string().required("Item name is required"),
  description: yup.string(),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be greater than 0"),
  isVegetarian: yup.boolean().default(false),
  isAvailable: yup.boolean().default(true),
  prepTimeMins: yup
    .number()
    .integer("Preparation time must be an integer")
    .min(0, "Preparation time cannot be negative")
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    ),
  sortOrder: yup
    .number()
    .integer("Sort order must be an integer")
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    ),
  categoryId: yup
    .number()
    .required("Category is required")
    .integer("Invalid category"),
});

const MenuItemManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | "all">("all");
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(menuItemSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      isVegetarian: false,
      isAvailable: true,
      prepTimeMins: undefined,
      sortOrder: undefined,
      categoryId: 0,
    },
  });

  // Fetch menu items
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/menu-items");
      setMenuItems(response?.data?.data || []);
    } catch (error) {
      message.error("Failed to fetch menu items");
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/menu-categories");
      setCategories(response?.data?.data || []);
    } catch (error) {
      message.error("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  // Handle form submission
  const onSubmit = async (data: MenuItemFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("isVegetarian", data.isVegetarian.toString());
      formData.append("isAvailable", data.isAvailable.toString());
      if (data.prepTimeMins !== undefined && data.prepTimeMins !== null) {
        formData.append("prepTimeMins", data.prepTimeMins.toString());
      }
      if (data.sortOrder !== undefined && data.sortOrder !== null) {
        formData.append("sortOrder", data.sortOrder.toString());
      }
      formData.append("categoryId", data.categoryId.toString());

      if (imageFile?.originFileObj) {
        formData.append("image", imageFile.originFileObj);
      }

      if (editingItem) {
        await api.put(`/api/menu-items/${editingItem.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Menu item updated successfully");
      } else {
        await api.post("/api/menu-items", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Menu item created successfully");
      }

      handleCloseModal();
      fetchMenuItems();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Failed to save menu item");
      console.error("Error saving menu item:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/menu-items/${id}`);
      message.success("Menu item deleted successfully");
      fetchMenuItems();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(
        err.response?.data?.message || "Failed to delete menu item"
      );
      console.error("Error deleting menu item:", error);
    }
  };

  // Handle modal open for create/edit
  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      reset({
        name: item.name,
        description: item.description || "",
        price: item.price,
        isVegetarian: item.isVegetarian,
        isAvailable: item.isAvailable,
        prepTimeMins: item.prepTimeMins || undefined,
        sortOrder: item.sortOrder || undefined,
        categoryId: item.categoryId,
      });
      setImagePreview(item.imageUrl || "");
    } else {
      setEditingItem(null);
      reset({
        name: "",
        description: "",
        price: 0,
        isVegetarian: false,
        isAvailable: true,
        prepTimeMins: undefined,
        sortOrder: undefined,
        categoryId: categories[0]?.id || 0,
      });
      setImagePreview("");
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setImageFile(null);
    setImagePreview("");
    reset();
  };

  // Filter menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Table columns
  const columns: ColumnsType<MenuItem> = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl: string) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="Item"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ) : (
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "#1e293b",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              fontSize: "12px",
            }}
          >
            No Image
          </div>
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (categoryName: string) => (
        <Tag color="blue">{categoryName || "N/A"}</Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => `₹${price}`,
    },
    {
      title: "Type",
      dataIndex: "isVegetarian",
      key: "isVegetarian",
      width: 100,
      render: (isVegetarian: boolean) => (
        <Tag color={isVegetarian ? "green" : "red"}>
          {isVegetarian ? "Veg" : "Non-Veg"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isAvailable",
      key: "isAvailable",
      width: 120,
      render: (isAvailable: boolean) => (
        <Tag color={isAvailable ? "green" : "orange"}>
          {isAvailable ? "Available" : "Unavailable"}
        </Tag>
      ),
    },
    {
      title: "Prep Time",
      dataIndex: "prepTimeMins",
      key: "prepTimeMins",
      width: 100,
      render: (time?: number) => (time ? `${time} mins` : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: unknown, record: MenuItem) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
            style={{ color: "#fb923c" }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Menu Item"
            description="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ padding: "24px" }}>
        <Card
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#cbd5e1",
                  margin: 0,
                }}
              >
                Menu Items
              </h1>
              <p style={{ color: "#64748b", marginTop: "4px" }}>
                Manage your menu items
              </p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
              size="large"
              style={{
                background: "linear-gradient(135deg, #fb923c, #ea580c)",
                border: "none",
              }}
            >
              Add Menu Item
            </Button>
          </div>

          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <Input
              placeholder="Search menu items..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
            <Select
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: "200px" }}
            >
              <Select.Option value="all">All Categories</Select.Option>
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={filteredMenuItems}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </span>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={700}
        >
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {/* Name */}
              <Form.Item
                label="Item Name"
                validateStatus={errors.name ? "error" : ""}
                help={errors.name?.message}
                required
                style={{ gridColumn: "1 / -1" }}
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g., Butter Chicken"
                      size="large"
                    />
                  )}
                />
              </Form.Item>

              {/* Category */}
              <Form.Item
                label="Category"
                validateStatus={errors.categoryId ? "error" : ""}
                help={errors.categoryId?.message}
                required
              >
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      placeholder="Select category"
                    >
                      {categories.map((cat) => (
                        <Select.Option key={cat.id} value={cat.id}>
                          {cat.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>

              {/* Price */}
              <Form.Item
                label="Price (₹)"
                validateStatus={errors.price ? "error" : ""}
                help={errors.price?.message}
                required
              >
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="0"
                      style={{ width: "100%" }}
                      min={0}
                      step={10}
                      size="large"
                    />
                  )}
                />
              </Form.Item>

              {/* Prep Time */}
              <Form.Item
                label="Preparation Time (mins)"
                validateStatus={errors.prepTimeMins ? "error" : ""}
                help={errors.prepTimeMins?.message as string}
              >
                <Controller
                  name="prepTimeMins"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="0"
                      style={{ width: "100%" }}
                      min={0}
                      size="large"
                    />
                  )}
                />
              </Form.Item>

              {/* Sort Order */}
              <Form.Item
                label="Sort Order"
                validateStatus={errors.sortOrder ? "error" : ""}
                help={errors.sortOrder?.message as string}
              >
                <Controller
                  name="sortOrder"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      placeholder="0"
                      style={{ width: "100%" }}
                      min={0}
                      size="large"
                    />
                  )}
                />
              </Form.Item>
            </div>

            {/* Description */}
            <Form.Item
              label="Description"
              validateStatus={errors.description ? "error" : ""}
              help={errors.description?.message}
            >
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    placeholder="Item description (optional)"
                    rows={3}
                  />
                )}
              />
            </Form.Item>

            {/* Image Upload */}
            <Form.Item label="Item Image">
              <Upload
                listType="picture-card"
                maxCount={1}
                fileList={imageFile ? [imageFile] : []}
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

                  // Preview
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setImagePreview(e.target?.result as string);
                  };
                  reader.readAsDataURL(file);

                  setImageFile({
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    url: "",
                    originFileObj: file,
                  } as UploadFile);
                  return false;
                }}
                onRemove={() => {
                  setImageFile(null);
                  setImagePreview("");
                }}
              >
                {!imageFile && !imagePreview && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              {imagePreview && !imageFile && (
                <img
                  src={imagePreview}
                  alt="Current"
                  style={{
                    maxWidth: "200px",
                    marginTop: "8px",
                    borderRadius: "8px",
                  }}
                />
              )}
            </Form.Item>

            {/* Switches */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <Form.Item label="Vegetarian">
                <Controller
                  name="isVegetarian"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    />
                  )}
                />
              </Form.Item>

              <Form.Item label="Available">
                <Controller
                  name="isAvailable"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    />
                  )}
                />
              </Form.Item>
            </div>

            {/* Submit Buttons */}
            <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    background: "linear-gradient(135deg, #fb923c, #ea580c)",
                    border: "none",
                  }}
                >
                  {editingItem ? "Update Item" : "Create Item"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MenuItemManagement;
