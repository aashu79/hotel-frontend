import { Form, Input, InputNumber, Switch, Button, Space } from "antd";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MenuCategory } from "./types";
import { useEffect } from "react";

export interface CategoryFormData {
  name: string;
  description?: string;
  sortOrder?: number;
  isActive: boolean;
}

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormData>;
  loading: boolean;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
}

const schema: yup.ObjectSchema<CategoryFormData> = yup.object({
  name: yup.string().required("Category name is required"),
  description: yup.string().nullable(),
  sortOrder: yup.number().integer("Sort order must be an integer").nullable(),
  isActive: yup.boolean().required().default(true),
});

const CategoryForm = ({
  initialValues,
  loading,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
      description: "",
      // sortOrder: undefined,
      isActive: true,
      ...initialValues,
    },
  });

  useEffect(() => {
    reset({
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      sortOrder: initialValues?.sortOrder,
      isActive: initialValues?.isActive ?? true,
    });
  }, [initialValues, reset]);

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
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
            <Input {...field} placeholder="e.g., Main Course" size="large" />
          )}
        />
      </Form.Item>
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
      {/* <Form.Item
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
      </Form.Item> */}
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
            {initialValues ? "Update Category" : "Create Category"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
