import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Space,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  useStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "../hooks/useStaff";
import useLocationStore from "../store/locationStore";

const { Option } = Select;

// Validation schema for adding staff
const staffSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    )
    .required("Password is required"),
  role: yup.string().required("Role is required"),
  locationId: yup.string().required("Location is required"),
});

interface Staff {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const StaffManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(staffSchema),
  });

  // React Query hooks
  const { data: fetchedStaffList = [], isLoading: loading } = useStaff();
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();
  const { locations, fetchLocations } = useLocationStore();

  useEffect(() => {
    // Reset form when modal is closed
    if (fetchedStaffList) {
      setStaffList(fetchedStaffList.users);
    }
  }, [fetchedStaffList]);

  useEffect(() => {
    fetchLocations(); // Fetch locations
  }, []);

  // Add or update staff
  const onSubmit = async (data: {
    name: string;
    email: string;
    password?: string;
    role: string;
    locationId: string;
  }) => {
    try {
      if (editingStaff) {
        // Update staff - don't send password if empty
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password;
        }
        await updateStaff.mutateAsync({
          id: editingStaff._id,
          data: updateData,
        });
      } else {
        // Add new staff - password is required
        if (!data.password) {
          message.error("Password is required for new staff members");
          return;
        }
        await createStaff.mutateAsync(
          data as {
            name: string;
            email: string;
            password: string;
            role: string;
            phone?: string;
          }
        );
      }
      handleCloseModal();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Delete staff
  const handleDelete = async (id: string) => {
    try {
      await deleteStaff.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Open modal for adding/editing
  const handleOpenModal = (staff?: Staff) => {
    if (staff) {
      setEditingStaff(staff);
      reset({
        name: staff.name,
        email: staff.email,
        role: staff.role,
      });
    } else {
      setEditingStaff(null);
      reset({
        name: "",
        email: "",
        password: "",
        role: "STAFF",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    reset();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div style={{ color: "#cbd5e1" }}>
          <UserOutlined style={{ marginRight: "8px" }} />
          {text}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => (
        <span style={{ color: "#94a3b8" }}>{text}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "ADMIN" ? "orange" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span style={{ color: "#94a3b8" }}>
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Staff) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
            style={{ color: "#60a5fa" }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Staff"
            description="Are you sure you want to delete this staff member?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              style={{ color: "#f87171" }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ padding: "0" }}>
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
                fontSize: "32px",
                fontWeight: "bold",
                background: "linear-gradient(to right, #fb923c, #ea580c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
              }}
            >
              Staff Management
            </h1>
            <p style={{ color: "#94a3b8", margin: 0 }}>
              Add, edit, or remove staff members
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            style={{
              background: "linear-gradient(to right, #fb923c, #ea580c)",
              border: "none",
              height: "40px",
            }}
          >
            Add Staff
          </Button>
        </div>

        <Card
          bordered={false}
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: "12px",
          }}
        >
          <Table
            columns={columns}
            dataSource={staffList}
            loading={loading}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} staff members`,
            }}
            style={{
              background: "transparent",
            }}
          />
        </Card>

        <Modal
          title={
            <span style={{ color: "#f1f5f9", fontSize: "20px" }}>
              {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
            </span>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          styles={{
            content: {
              background: "#1e293b",
              border: "1px solid #334155",
            },
            header: {
              background: "#1e293b",
              borderBottom: "1px solid #334155",
            },
          }}
        >
          <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
            style={{ marginTop: "24px" }}
          >
            <Form.Item
              label={<span style={{ color: "#cbd5e1" }}>Name</span>}
              validateStatus={errors.name ? "error" : ""}
              help={errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter staff name"
                    style={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      color: "#cbd5e1",
                      height: "40px",
                    }}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "#cbd5e1" }}>Email</span>}
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                    disabled={!!editingStaff}
                    style={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      color: "#cbd5e1",
                      height: "40px",
                    }}
                  />
                )}
              />
            </Form.Item>

            {!editingStaff && (
              <Form.Item
                label={<span style={{ color: "#cbd5e1" }}>Password</span>}
                validateStatus={errors.password ? "error" : ""}
                help={errors.password?.message}
              >
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      placeholder="Enter password"
                      style={{
                        background: "#0f172a",
                        border: "1px solid #334155",
                        color: "#cbd5e1",
                        height: "40px",
                      }}
                    />
                  )}
                />
              </Form.Item>
            )}

            <Form.Item
              label={<span style={{ color: "#cbd5e1" }}>Role</span>}
              validateStatus={errors.role ? "error" : ""}
              help={errors.role?.message}
            >
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select role"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Option value="STAFF">Staff</Option>
                    <Option value="ADMIN">Admin</Option>
                  </Select>
                )}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "#cbd5e1" }}>Location</span>}
              validateStatus={errors.locationId ? "error" : ""}
              help={errors.locationId?.message}
            >
              <Controller
                name="locationId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select location"
                    style={{
                      width: "100%",
                    }}
                  >
                    {locations
                      .filter((loc) => loc.isActive)
                      .map((location) => (
                        <Option key={location.id} value={location.id}>
                          {location.name} - {location.city}
                        </Option>
                      ))}
                  </Select>
                )}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    background: "linear-gradient(to right, #fb923c, #ea580c)",
                    border: "none",
                  }}
                >
                  {editingStaff ? "Update" : "Add"} Staff
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default StaffManagement;
