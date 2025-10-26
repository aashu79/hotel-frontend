import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Space,
  Tag,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../../layouts/DashboardLayout";
import useLocationStore from "../../store/locationStore";
import { Location } from "../../services/locationService";

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);

  const {
    locations: activeLocations,
    loading,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
  } = useLocationStore();

  useEffect(() => {
    setLocations(activeLocations);
  }, [activeLocations]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleCreate = () => {
    setEditingLocation(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Location) => {
    setEditingLocation(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLocation(id);
      message.success("Location deleted successfully");
    } catch (error) {
      message.error("Failed to delete location");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingLocation) {
        await updateLocation(editingLocation.id, values);
        message.success("Location updated successfully");
      } else {
        await createLocation(values);
        message.success("Location created successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(
        `Failed to ${editingLocation ? "update" : "create"} location`
      );
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <strong style={{ color: "#f1f5f9" }}>{text}</strong>
      ),
    },
    {
      title: "Address",
      key: "address",
      render: (_: any, record: Location) => (
        <span style={{ color: "#cbd5e1" }}>
          {record.address}, {record.city}, {record.country}
        </span>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_: any, record: Location) => (
        <div style={{ color: "#cbd5e1" }}>
          {record.phoneNumber && <div>{record.phoneNumber}</div>}
          {record.email && <div>{record.email}</div>}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Location) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: "#60a5fa" }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this location?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
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
              <EnvironmentOutlined /> Location Management
            </h1>
            <p style={{ color: "#94a3b8", margin: 0 }}>
              Manage restaurant branches and locations
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{
              background: "linear-gradient(to right, #fb923c, #ea580c)",
              border: "none",
              height: "40px",
            }}
          >
            Add Location
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={locations}
          rowKey="id"
          loading={loading}
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingLocation ? "Edit Location" : "Add New Location"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          okText={editingLocation ? "Update" : "Create"}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ isActive: true }}
          >
            <Form.Item
              label="Location Name"
              name="name"
              rules={[
                { required: true, message: "Please enter location name" },
              ]}
            >
              <Input placeholder="e.g., Main Branch, Downtown Branch" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input placeholder="Street address" />
            </Form.Item>

            <Space style={{ width: "100%" }} size="middle">
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Required" }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="City" />
              </Form.Item>

              <Form.Item label="State" name="state" style={{ flex: 1 }}>
                <Input placeholder="State (optional)" />
              </Form.Item>
            </Space>

            <Space style={{ width: "100%" }} size="middle">
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: "Required" }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Country" />
              </Form.Item>

              <Form.Item
                label="Postal Code"
                name="postalCode"
                style={{ flex: 1 }}
              >
                <Input placeholder="Postal code" />
              </Form.Item>
            </Space>

            <Space style={{ width: "100%" }} size="middle">
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                style={{ flex: 1 }}
              >
                <Input placeholder="+1234567890" />
              </Form.Item>

              <Form.Item label="Email" name="email" style={{ flex: 1 }}>
                <Input type="email" placeholder="branch@email.com" />
              </Form.Item>
            </Space>

            <Form.Item label="Opening Hours" name="openingHours">
              <Input.TextArea placeholder="e.g., Mon-Sun: 9AM-10PM" rows={2} />
            </Form.Item>

            <Form.Item label="Image URL" name="imageUrl">
              <Input placeholder="https://..." />
            </Form.Item>

            <Form.Item
              label="Active Status"
              name="isActive"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default LocationManagement;
