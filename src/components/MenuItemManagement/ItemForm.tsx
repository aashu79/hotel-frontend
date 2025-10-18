import {
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Space,
  Select,
  Upload,
  Divider,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { MenuItemFormData, MenuCategory } from "./types";
import RichTextEditor from "./RichTextEditor";
import { message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";

interface ItemFormProps {
  initialValues?: Partial<MenuItemFormData>;
  categories: MenuCategory[];
  loading: boolean;
  onSubmit: (data: MenuItemFormData) => void;
  onCancel: () => void;
  imageFile: UploadFile | null;
  setImageFile: (file: UploadFile | null) => void;
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
}

// Define schema with proper types for our form
const schema = yup.object({
  name: yup.string().trim().required("Item name is required"),
  description: yup
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be greater than 0"),
  isVegetarian: yup.boolean().default(true), // Backend default is true
  isAvailable: yup.boolean().default(true),
  prepTimeMins: yup
    .number()
    .nullable()
    .transform((v) => (isNaN(v) ? undefined : v))
    .min(0, "Preparation time cannot be negative"),
  sortOrder: yup
    .number()
    .nullable()
    .transform((v) => (isNaN(v) ? undefined : v))
    .integer("Sort order must be an integer")
    .default(0),
  categoryId: yup
    .number()
    .required("Category is required")
    .integer("Invalid category"),
  image: yup.mixed().optional(),
});

const ItemForm = ({
  initialValues,
  categories,
  loading,
  onSubmit,
  onCancel,
  imageFile,
  setImageFile,
  imagePreview,
  setImagePreview,
}: ItemFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuItemFormData>({
    resolver: yupResolver(schema) as any, // Type assertion needed due to complex form structure
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      isVegetarian: true, // API default is true
      isAvailable: true, // API default is true
      prepTimeMins: undefined,
      sortOrder: 0, // API default is 0
      categoryId: categories[0]?.id || 0,
      ...initialValues,
    },
  });

  useEffect(() => {
    reset({
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      price: initialValues?.price ?? 0,
      isVegetarian: initialValues?.isVegetarian ?? true,
      isAvailable: initialValues?.isAvailable ?? true,
      prepTimeMins: initialValues?.prepTimeMins,
      sortOrder: initialValues?.sortOrder,
      categoryId: initialValues?.categoryId ?? (categories[0]?.id || 0),
    });
  }, [initialValues, categories, reset]);

  const handleFormSubmit = (data: MenuItemFormData) => {
    // Pass MenuItemFormData and let parent handle FormData conversion if needed
    onSubmit(data);
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
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
              <Select {...field} size="large" placeholder="Select category">
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>
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
      <Form.Item
        label="Description"
        validateStatus={errors.description ? "error" : ""}
        help={errors.description?.message}
      >
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ""}
              onChange={field.onChange}
              placeholder="Item description (optional)"
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Item Image"
        tooltip={{
          title:
            "Image will be uploaded to Cloudinary. Max size: 5MB. Supported formats: JPEG, PNG, GIF.",
          icon: <InfoCircleOutlined />,
        }}
      >
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
            });
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
            style={{ maxWidth: "200px", marginTop: "8px", borderRadius: "8px" }}
          />
        )}
      </Form.Item>
      <Divider orientation="left">Item Status</Divider>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <Form.Item
          label="Vegetarian"
          tooltip="Vegetarian items are marked with a green indicator on the menu"
        >
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
        <Form.Item
          label="Available"
          tooltip="Unavailable items won't be shown to customers"
        >
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
      <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              background: "linear-gradient(135deg, #fb923c, #ea580c)",
              border: "none",
            }}
          >
            {initialValues ? "Update Item" : "Create Item"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ItemForm;
