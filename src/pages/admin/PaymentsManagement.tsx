import { useState } from "react";
import { Row, Col, Card, Table, Tag, Input, Select, Space, Button } from "antd";
import {
  SearchOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../../layouts/DashboardLayout";
import { usePayments, usePaymentStats } from "../../hooks/usePayments";
import { useLocations } from "../../hooks/useLocations";
import MetricCard from "../../components/admin/MetricCard";
import DateFilter, { DateRange } from "../../components/admin/DateFilter";
import EmptyState from "../../components/admin/EmptyState";
import type { Payment, PaymentFilters } from "../../services/payments";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const PaymentsManagement = () => {
  const [filters, setFilters] = useState<PaymentFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: paymentsData, isLoading, refetch } = usePayments(filters);
  const { data: statsData, isLoading: statsLoading } = usePaymentStats({
    startDate: filters.startDate,
    endDate: filters.endDate,
    locationId: filters.locationId,
  });
  const { data: locationsData } = useLocations();

  const handleDateChange = (dateRange: DateRange) => {
    setFilters((prev) => ({
      ...prev,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      page: 1,
    }));
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value || undefined,
      page: 1,
    }));
  };

  const handleLocationChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      locationId: value || undefined,
      page: 1,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value || undefined,
      page: 1,
    }));
  };

  const handleTableChange = (
    pagination: { current?: number; pageSize?: number },
    _filters: unknown,
    sorter: unknown
  ) => {
    const sort = sorter as { field?: string; order?: string };
    setFilters((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: sort.field || "createdAt",
      sortOrder: sort.order === "ascend" ? "asc" : "desc",
    }));
  };

  const columns: ColumnsType<Payment> = [
    {
      title: "Order Number",
      dataIndex: ["order", "orderNumber"],
      key: "orderNumber",
      render: (orderNumber) => (
        <span style={{ color: "#fb923c", fontWeight: "500" }}>
          {orderNumber}
        </span>
      ),
      width: 160,
      ellipsis: true,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <span style={{ color: "#e2e8f0" }}>{record.user?.name || "-"}</span>
      ),
      width: 140,
      ellipsis: true,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: true,
      render: (amount) => (
        <span style={{ color: "#4ade80", fontWeight: "600" }}>
          ${typeof amount === "number" ? amount.toFixed(2) : "-"}
        </span>
      ),
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (!status) return <Tag color="default">-</Tag>;
        const statusConfig: Record<
          string,
          { color: string; text: string; icon: React.ReactNode }
        > = {
          paid: {
            color: "success",
            text: "Paid",
            icon: <CheckCircleOutlined />,
          },
          pending: { color: "warning", text: "Pending", icon: null },
          failed: {
            color: "error",
            text: "Failed",
            icon: <CloseCircleOutlined />,
          },
        };
        const config = statusConfig[status?.toLowerCase?.()] || {
          color: "default",
          text: status,
          icon: null,
        };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
      width: 100,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (date) => (
        <span style={{ color: "#e2e8f0" }}>
          {date ? dayjs(date).format("MMM DD, YYYY hh:mm A") : "-"}
        </span>
      ),
      width: 180,
    },
  ];

  // Expanded row render for full details
  const renderExpandedRow = (record: Payment) => (
    <div style={{ color: "#e2e8f0", fontSize: 14 }}>
      <div>
        <b>Order Number:</b> {record.order?.orderNumber || "-"}
      </div>
      <div>
        <b>Customer Name:</b> {record.user?.name || "-"}
      </div>
      <div>
        <b>Customer Email:</b> {record.user?.email || "-"}
      </div>
      <div>
        <b>Customer Phone:</b> {record.user?.phoneNumber || "-"}
      </div>
      <div>
        <b>Amount:</b> $
        {typeof record.amount === "number" ? record.amount.toFixed(2) : "-"}
      </div>
      <div>
        <b>Status:</b> {record.status || "-"}
      </div>
      <div>
        <b>Date:</b>{" "}
        {record.createdAt
          ? dayjs(record.createdAt).format("MMM DD, YYYY hh:mm A")
          : "-"}
      </div>
      <div>
        <b>Location:</b> {record.order?.location?.name || "-"} (
        {record.order?.location?.city || "-"})
      </div>
      <div>
        <b>Order Details:</b>
      </div>
      <ul style={{ marginLeft: 16 }}>
        {record.order?.items?.map((item) => (
          <li key={item.id}>
            <b>{item.menuItem?.name || "-"}</b> x{item.quantity} - $
            {typeof item.price === "number" ? item.price.toFixed(2) : "-"}{" "}
            (Category: {item.menuItem?.category?.name || "-"})
          </li>
        )) || <li>-</li>}
      </ul>
      <div>
        <b>Order Status:</b> {record.order?.status || "-"}
      </div>
      <div>
        <b>Special Notes:</b> {record.order?.specialNotes || "-"}
      </div>
    </div>
  );

  const stats = statsData?.data;

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
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
            Payments Management
          </h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            Monitor and track all payment transactions
          </p>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Total Payments"
              value={stats?.totalPayments || 0}
              icon={<DollarOutlined />}
              loading={statsLoading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Successful Payments"
              value={stats?.successfulPayments || 0}
              icon={<CheckCircleOutlined />}
              loading={statsLoading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Total Revenue"
              value={stats?.totalRevenue || 0}
              prefix="$"
              precision={2}
              icon={<DollarOutlined />}
              loading={statsLoading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Avg Order Value"
              value={stats?.averageOrderValue || 0}
              prefix="$"
              precision={2}
              icon={<DollarOutlined />}
              loading={statsLoading}
            />
          </Col>
        </Row>

        {/* Filters */}
        <Card
          bordered={false}
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <DateFilter
              value={{
                startDate: filters.startDate,
                endDate: filters.endDate,
              }}
              onChange={handleDateChange}
              onRefresh={refetch}
            />

            <Space wrap>
              <Input
                placeholder="Search by name, email, phone, or order number"
                prefix={<SearchOutlined />}
                style={{ width: 350 }}
                allowClear
                onChange={(e) => handleSearch(e.target.value)}
              />

              <Select
                placeholder="Filter by Location"
                style={{ width: 200 }}
                allowClear
                onChange={handleLocationChange}
                loading={!locationsData}
                options={locationsData?.data?.map((loc) => ({
                  label: loc.name,
                  value: loc.id,
                }))}
              />

              <Select
                placeholder="Filter by Status"
                style={{ width: 150 }}
                allowClear
                onChange={handleStatusChange}
                options={[
                  { label: "Paid", value: "paid" },
                  { label: "Pending", value: "pending" },
                  { label: "Failed", value: "failed" },
                ]}
              />
            </Space>
          </Space>
        </Card>

        {/* Payments Table */}
        <Card
          bordered={false}
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: "12px",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <Table
              columns={columns}
              dataSource={paymentsData?.data}
              loading={isLoading}
              rowKey="id"
              expandable={{
                expandedRowRender: renderExpandedRow,
                expandRowByClick: true,
              }}
              pagination={{
                current: paymentsData?.pagination.currentPage,
                pageSize: paymentsData?.pagination.itemsPerPage,
                total: paymentsData?.pagination.totalItems,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} payments`,
              }}
              onChange={handleTableChange}
              locale={{
                emptyText: <EmptyState description="No payments found" />,
              }}
              style={{
                background: "transparent",
              }}
              scroll={{ x: 900 }}
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsManagement;
