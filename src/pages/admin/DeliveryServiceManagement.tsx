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
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../../layouts/DashboardLayout";
import deliveryServiceService, {
  DeliveryService,
} from "../../services/deliveryService";
import useLocationStore from "../../store/locationStore";

const DeliveryServiceManagement = () => {
  const [services, setServices] = useState<DeliveryService[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<DeliveryService | null>(
    null
  );
  const { locations, fetchLocations } = useLocationStore();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLocations();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await deliveryServiceService.getAllDeliveryServices();
      setServices(
        Array.isArray(data.deliveryServices) ? data.deliveryServices : []
      );
    } catch (error) {
      setServices([]); // Ensure services is always an array
      message.error("Failed to fetch delivery services");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingService(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: DeliveryService) => {
    setEditingService(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deliveryServiceService.deleteDeliveryService(id);
      message.success("Delivery service deleted successfully");
      fetchServices();
    } catch (error) {
      message.error("Failed to delete delivery service");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingService) {
        await deliveryServiceService.updateDeliveryService(
          editingService.id,
          values
        );
        message.success("Delivery service updated successfully");
      } else {
        await deliveryServiceService.createDeliveryService(values);
        message.success("Delivery service created successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchServices();
    } catch (error) {
      message.error(
        `Failed to ${editingService ? "update" : "create"} delivery service`
      );
    }
  };

  const columns = [
    {
      title: "Service Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <strong style={{ color: "#f1f5f9" }}>{text}</strong>
      ),
    },
    {
      title: "Service URL",
      dataIndex: "serviceUrl",
      key: "serviceUrl",
      render: (url: string) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#60a5fa" }}
        >
          <LinkOutlined /> Visit Service
        </a>
      ),
    },
    {
      title: "Location",
      dataIndex: "locationId",
      key: "locationId",
      render: (locationId: string) => {
        const location = locations.find((loc) => loc.id === locationId);
        return (
          <span style={{ color: "#cbd5e1" }}>
            {location?.name || "Unknown"}
          </span>
        );
      },
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
      render: (_: any, record: DeliveryService) => (
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
            title="Are you sure you want to delete this service?"
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
              <ShoppingOutlined /> Delivery Services
            </h1>
            <p style={{ color: "#94a3b8", margin: 0 }}>
              Manage external delivery service integrations
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
            Add Service
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={services}
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
          title={
            editingService
              ? "Edit Delivery Service"
              : "Add New Delivery Service"
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          okText={editingService ? "Update" : "Create"}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ isActive: true }}
          >
            <Form.Item
              label="Service Name"
              name="name"
              rules={[{ required: true, message: "Please enter service name" }]}
            >
              <Input placeholder="e.g., DoorDash, Uber Eats" />
            </Form.Item>

            <Form.Item
              label="Service URL"
              name="serviceUrl"
              rules={[
                { required: true, message: "Please enter service URL" },
                { type: "url", message: "Please enter a valid URL" },
              ]}
            >
              <Input placeholder="https://www.doordash.com/store/..." />
            </Form.Item>

            <Form.Item
              label="Location"
              name="locationId"
              rules={[{ required: true, message: "Please select a location" }]}
            >
              <Select placeholder="Select location">
                {locations.map((location) => (
                  <Select.Option key={location.id} value={location.id}>
                    {location.name}
                  </Select.Option>
                ))}
              </Select>
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

export default DeliveryServiceManagement;
