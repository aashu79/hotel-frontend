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

interface MenuCategory {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  description?: string;
  sortOrder?: number;
  isActive: boolean;
}

// Validation schema matching backend
const categorySchema = yup
  .object({
    name: yup.string().required("Category name is required"),
    description: yup.string().optional(),
    sortOrder: yup
      .number()
      .integer("Sort order must be an integer")
      .optional()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      ),
    isActive: yup.boolean().required().default(true),
  })
  .required();

const MenuCategoryManagement = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      description: "",
      sortOrder: undefined,
      isActive: true,
    },
  });

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/menu-categories");
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const onSubmit = async (data: CategoryFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.sortOrder !== undefined && data.sortOrder !== null) {
        formData.append("sortOrder", data.sortOrder.toString());
      }
      formData.append("isActive", data.isActive.toString());

      if (imageFile?.originFileObj) {
        formData.append("image", imageFile.originFileObj);
      }

      if (editingCategory) {
        await api.put(`/api/menu-categories/${editingCategory.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Category updated successfully");
      } else {
        await api.post("/api/menu-categories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Category created successfully");
      }

      handleCloseModal();
      fetchCategories();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Failed to save category");
      console.error("Error saving category:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/menu-categories/${id}`);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Failed to delete category");
      console.error("Error deleting category:", error);
    }
  };

  // Handle modal open for create/edit
  const handleOpenModal = (category?: MenuCategory) => {
    if (category) {
      setEditingCategory(category);
      reset({
        name: category.name,
        description: category.description || "",
        sortOrder: category.sortOrder || undefined,
        isActive: category.isActive,
      });
      setImagePreview(category.imageUrl || "");
    } else {
      setEditingCategory(null);
      reset({
        name: "",
        description: "",
        sortOrder: undefined,
        isActive: true,
      });
      setImagePreview("");
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setImageFile(null);
    setImagePreview("");
    reset();
  };

  // Filter categories by search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns: ColumnsType<MenuCategory> = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl: string) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="Category"
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Sort Order",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 120,
      sorter: (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: unknown, record: MenuCategory) => (
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
            title="Delete Category"
            description="Are you sure you want to delete this category?"
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
                Menu Categories
              </h1>
              <p style={{ color: "#64748b", marginTop: "4px" }}>
                Manage your menu categories
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
              Add Category
            </Button>
          </div>

          {/* Search */}
          <div style={{ marginBottom: "16px" }}>
            <Input
              placeholder="Search categories..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={filteredCategories}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} categories`,
            }}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              {editingCategory ? "Edit Category" : "Add Category"}
            </span>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={600}
        >
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            {/* Name */}
            <Form.Item
              label="Category Name"
              validateStatus={errors.name ? "error" : ""}
              help={errors.name?.message}
              required
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., Main Course"
                    size="large"
                  />
                )}
              />
            </Form.Item>

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
                    placeholder="Category description (optional)"
                    rows={3}
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
                  />
                )}
              />
            </Form.Item>

            {/* Image Upload */}
            <Form.Item label="Category Image">
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

            {/* Active Status */}
            <Form.Item label="Active Status">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                )}
              />
            </Form.Item>

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
                  {editingCategory ? "Update Category" : "Create Category"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MenuCategoryManagement;
