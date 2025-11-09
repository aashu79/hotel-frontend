import { useState } from "react";
import { Row, Col, Card, Table, Tag, Select, Space } from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useSales, useSaleStats } from "../../hooks/useSales";
import { useLocations } from "../../hooks/useLocations";
import MetricCard from "../../components/admin/MetricCard";
import DateFilter, { DateRange } from "../../components/admin/DateFilter";
import EmptyState from "../../components/admin/EmptyState";
import type { Sale, SaleFilters } from "../../services/sales";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const SalesManagement = () => {
  const [filters, setFilters] = useState<SaleFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: salesData, isLoading, refetch } = useSales(filters);
  const { data: statsData, isLoading: statsLoading } = useSaleStats({
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

  const handleLocationChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      locationId: value || undefined,
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

  console.log("locationsData", locationsData);

  const columns: ColumnsType<Sale> = [
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
        <span style={{ color: "#e2e8f0" }}>
          {record.order?.user?.name || "-"}
        </span>
      ),
      width: 140,
      ellipsis: true,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: true,
      render: (amount) => (
        <span style={{ color: "#4ade80", fontWeight: "600" }}>
          ${typeof amount === "number" ? amount.toFixed(2) : "-"}
        </span>
      ),
      width: 120,
    },
    {
      title: "Status",
      dataIndex: ["order", "status"],
      key: "status",
      render: (status) => (
        <Tag color={status === "PENDING" ? "warning" : "success"}>
          {status || "-"}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Sale Date",
      dataIndex: "saleDate",
      key: "saleDate",
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
  const renderExpandedRow = (record: Sale) => (
    <div style={{ color: "#e2e8f0", fontSize: 14 }}>
      <div>
        <b>Order Number:</b> {record.order?.orderNumber || "-"}
      </div>
      <div>
        <b>Customer Name:</b> {record.order?.user?.name || "-"}
      </div>
      <div>
        <b>Customer Email:</b> {record.order?.user?.email || "-"}
      </div>
      <div>
        <b>Location:</b> {record.location?.name || "-"} (
        {record.location?.city || "-"})
      </div>
      <div>
        <b>Payment Method:</b> {record.paymentMethod || "-"}
      </div>
      <div>
        <b>Subtotal:</b> $
        {typeof record.subtotal === "number" ? record.subtotal.toFixed(2) : "-"}
      </div>
      <div>
        <b>Tax:</b> $
        {typeof record.tax === "number" ? record.tax.toFixed(2) : "-"}
      </div>
      <div>
        <b>Total Amount:</b> $
        {typeof record.totalAmount === "number"
          ? record.totalAmount.toFixed(2)
          : "-"}
      </div>
      <div>
        <b>Status:</b> {record.order?.status || "-"}
      </div>
      <div>
        <b>Sale Date:</b>{" "}
        {record.saleDate
          ? dayjs(record.saleDate).format("MMM DD, YYYY hh:mm A")
          : "-"}
      </div>
      <div>
        <b>Order Items:</b>
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
            Sales Management
          </h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            Track and analyze all sales transactions
          </p>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} lg={8}>
            <MetricCard
              title="Total Sales"
              value={stats?.totalSales || 0}
              icon={<ShoppingOutlined />}
              loading={statsLoading}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <MetricCard
              title="Total Revenue"
              value={stats?.totalRevenue || 0}
              prefix="$"
              precision={2}
              icon={<DollarOutlined />}
              loading={statsLoading}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <MetricCard
              title="Avg Sale Value"
              value={stats?.averageSaleValue || 0}
              prefix="$"
              precision={2}
              icon={<BarChartOutlined />}
              loading={statsLoading}
            />
          </Col>
        </Row>

        {/* Sales by Location */}
        {stats?.salesByLocation && stats.salesByLocation.length > 0 && (
          <Card
            bordered={false}
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: "12px",
              marginBottom: "24px",
            }}
            title={<span style={{ color: "#e2e8f0" }}>Sales by Location</span>}
          >
            <Row gutter={[16, 16]}>
              {stats?.salesByLocation?.map((loc) => (
                <Col xs={24} sm={12} lg={8} key={loc.location.id}>
                  <Card
                    bordered={false}
                    style={{
                      background: "rgba(15, 23, 42, 0.5)",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          color: "#e2e8f0",
                          fontWeight: "600",
                          fontSize: "16px",
                        }}
                      >
                        {loc.location.name}
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                        {loc?.location?.city}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                          Sales
                        </div>
                        <div style={{ color: "#fb923c", fontWeight: "600" }}>
                          {loc.count}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                          Revenue
                        </div>
                        <div style={{ color: "#4ade80", fontWeight: "600" }}>
                          ${loc?.totalRevenue?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {/* Filters */}
        <Card
          bordered={false}
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        >
          <Space wrap>
            <DateFilter
              value={{
                startDate: filters.startDate,
                endDate: filters.endDate,
              }}
              onChange={handleDateChange}
              onRefresh={refetch}
            />

            <Select
              placeholder="Filter by Location"
              style={{ width: 200 }}
              allowClear
              onChange={handleLocationChange}
              loading={!locationsData}
              options={locationsData?.locations?.map((loc) => ({
                label: loc.name,
                value: loc.id,
              }))}
            />
          </Space>
        </Card>

        {/* Sales Table */}
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
              dataSource={salesData?.data}
              loading={isLoading}
              rowKey="id"
              expandable={{
                expandedRowRender: renderExpandedRow,
                expandRowByClick: true,
              }}
              pagination={{
                current: salesData?.pagination.currentPage,
                pageSize: salesData?.pagination.itemsPerPage,
                total: salesData?.pagination.totalItems,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} sales`,
              }}
              onChange={handleTableChange}
              locale={{
                emptyText: <EmptyState description="No sales found" />,
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

export default SalesManagement;
