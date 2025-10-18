import { useState } from "react";
import {
  Card,
  Table,
  Button,
  message,
  Popconfirm,
  Space,
  Tag,
  Input,
} from "antd";
import {
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../layouts/DashboardLayout";
import { useCustomers, useDeleteCustomer } from "../hooks/useCustomers";

interface Customer {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  createdAt: string;
  lastOrder?: string;
}

const CustomerManagement = () => {
  const [searchText, setSearchText] = useState("");

  // React Query hooks
  const { data: customerList = [], isLoading: loading } = useCustomers();
  const deleteCustomer = useDeleteCustomer();

  // Delete customer
  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Filter customers based on search
  const filteredCustomers = customerList.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.phoneNumber.includes(searchText) ||
      (customer.email &&
        customer.email.toLowerCase().includes(searchText.toLowerCase()))
  );

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
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text: string) => (
        <div style={{ color: "#94a3b8" }}>
          <PhoneOutlined style={{ marginRight: "8px" }} />
          {text}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) =>
        text ? (
          <div style={{ color: "#94a3b8" }}>
            <MailOutlined style={{ marginRight: "8px" }} />
            {text}
          </div>
        ) : (
          <span style={{ color: "#64748b" }}>N/A</span>
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
      title: "Status",
      key: "status",
      render: () => <Tag color="green">Active</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Customer) => (
        <Space>
          <Popconfirm
            title="Delete Customer"
            description="Are you sure you want to delete this customer? This action cannot be undone."
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
            flexWrap: "wrap",
            gap: "16px",
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
              Customer Management
            </h1>
            <p style={{ color: "#94a3b8", margin: 0 }}>
              View and manage customer accounts
            </p>
          </div>
          <Input
            placeholder="Search customers..."
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "300px",
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#cbd5e1",
              height: "40px",
            }}
          />
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
            dataSource={filteredCustomers}
            loading={loading}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} customers`,
            }}
            style={{
              background: "transparent",
            }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomerManagement;
