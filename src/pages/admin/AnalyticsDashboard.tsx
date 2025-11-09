import { useState } from "react";
import { Row, Col, Card, Table, Progress, Select, Space, Tabs } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrophyOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  RiseOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  useDashboardMetrics,
  useMostSoldItems,
  useRevenueTrends,
  useSalesByCategory,
  useTopCustomers,
  useOrderStatusDistribution,
  useLocationPerformance,
} from "../../hooks/useDashboard";
import { useLocations } from "../../hooks/useLocations";
import MetricCard from "../../components/admin/MetricCard";
import DateFilter, { DateRange } from "../../components/admin/DateFilter";
import EmptyState from "../../components/admin/EmptyState";
import type {
  DashboardFilters,
  MostSoldItem,
  TopCustomer,
} from "../../services/dashboard";
import type { ColumnsType } from "antd/es/table";

const COLORS = [
  "#fb923c",
  "#4ade80",
  "#60a5fa",
  "#f472b6",
  "#a78bfa",
  "#fbbf24",
];

const AnalyticsDashboard = () => {
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [trendGroupBy, setTrendGroupBy] = useState<
    "hour" | "day" | "week" | "month" | "year"
  >("day");

  const { data: locationsData } = useLocations();
  const { data: metricsData, isLoading: metricsLoading } =
    useDashboardMetrics(filters);
  const { data: mostSoldData, isLoading: mostSoldLoading } = useMostSoldItems(
    10,
    filters
  );
  const { data: trendsData, isLoading: trendsLoading } = useRevenueTrends(
    trendGroupBy,
    filters
  );
  const { data: categoryData, isLoading: categoryLoading } =
    useSalesByCategory(filters);
  const { data: customersData, isLoading: customersLoading } = useTopCustomers(
    10,
    filters
  );
  const { data: statusData, isLoading: statusLoading } =
    useOrderStatusDistribution(filters);
  const { data: locationData, isLoading: locationLoading } =
    useLocationPerformance(filters);

  const handleDateChange = (dateRange: DateRange) => {
    setFilters((prev) => ({
      ...prev,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    }));
  };

  const handleLocationChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      locationId: value || undefined,
    }));
  };

  const metrics = metricsData?.data;

  // Top Selling Items Table Columns
  const itemColumns: ColumnsType<MostSoldItem> = [
    {
      title: "Item",
      key: "item",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {record.menuItem?.imageUrl && (
            <img
              src={record.menuItem.imageUrl}
              alt={record.menuItem?.name || "-"}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          )}
          <div>
            <div style={{ fontWeight: "500", color: "#e2e8f0" }}>
              {record.menuItem?.name || "-"}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
              {record.menuItem?.category?.name || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Quantity Sold",
      dataIndex: "quantitySold",
      key: "quantitySold",
      sorter: (a, b) => a.quantitySold - b.quantitySold,
      render: (qty) => (
        <span style={{ color: "#fb923c", fontWeight: "600" }}>
          {qty ?? "-"}
        </span>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
      render: (revenue) => (
        <span style={{ color: "#4ade80", fontWeight: "600" }}>
          ${typeof revenue === "number" ? revenue.toFixed(2) : "-"}
        </span>
      ),
    },
    {
      title: "Orders",
      dataIndex: "orderCount",
      key: "orderCount",
      sorter: (a, b) => a.orderCount - b.orderCount,
      render: (count) => (
        <span style={{ color: "#94a3b8" }}>{count ?? "-"}</span>
      ),
    },
  ];

  // Top Customers Table Columns
  const customerColumns: ColumnsType<TopCustomer> = [
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: "500", color: "#e2e8f0" }}>
            {record.user?.name || "-"}
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
            {record.user?.email || "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Total Orders",
      dataIndex: "orderCount",
      key: "orderCount",
      sorter: (a, b) => a.orderCount - b.orderCount,
      render: (count) => (
        <span style={{ color: "#fb923c", fontWeight: "600" }}>
          {count ?? "-"}
        </span>
      ),
    },
    {
      title: "Total Spent",
      dataIndex: "totalSpent",
      key: "totalSpent",
      sorter: (a, b) => a.totalSpent - b.totalSpent,
      render: (amount) => (
        <span style={{ color: "#4ade80", fontWeight: "600" }}>
          ${typeof amount === "number" ? amount.toFixed(2) : "-"}
        </span>
      ),
    },
  ];

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
            Analytics Dashboard
          </h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            Comprehensive insights and analytics for your restaurant
          </p>
        </div>

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

        {/* Overview Metrics */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Total Revenue"
              value={metrics?.overview.totalRevenue || 0}
              prefix="$"
              precision={2}
              icon={<DollarOutlined />}
              loading={metricsLoading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Total Orders"
              value={metrics?.overview.totalOrders || 0}
              icon={<ShoppingOutlined />}
              loading={metricsLoading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Total Customers"
              value={metrics?.overview.totalCustomers || 0}
              icon={<TeamOutlined />}
              loading={metricsLoading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Avg Order Value"
              value={metrics?.overview.averageOrderValue || 0}
              prefix="$"
              precision={2}
              icon={<RiseOutlined />}
              loading={metricsLoading}
            />
          </Col>
        </Row>

        {/* Charts Row 1 */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          {/* Revenue Trends */}
          <Col xs={24} lg={16}>
            <Card
              bordered={false}
              loading={trendsLoading}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
                height: "400px",
              }}
              title={<span style={{ color: "#e2e8f0" }}>Revenue Trends</span>}
              extra={
                <Select
                  value={trendGroupBy}
                  onChange={setTrendGroupBy}
                  style={{ width: 120 }}
                  options={[
                    { label: "Hourly", value: "hour" },
                    { label: "Daily", value: "day" },
                    { label: "Weekly", value: "week" },
                    { label: "Monthly", value: "month" },
                    { label: "Yearly", value: "year" },
                  ]}
                />
              }
            >
              {trendsData?.data && trendsData.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendsData.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="period" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#fb923c"
                      strokeWidth={2}
                      dot={{ fill: "#fb923c" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState description="No revenue data available" />
              )}
            </Card>
          </Col>

          {/* Order Status Distribution */}
          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              loading={statusLoading}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
                height: "400px",
              }}
              title={<span style={{ color: "#e2e8f0" }}>Order Status</span>}
            >
              {statusData?.data && statusData.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData.data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {statusData?.data?.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState description="No order data available" />
              )}
            </Card>
          </Col>
        </Row>

        {/* Charts Row 2 */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          {/* Sales by Category */}
          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              loading={categoryLoading}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
                height: "400px",
              }}
              title={
                <span style={{ color: "#e2e8f0" }}>Sales by Category</span>
              }
            >
              {categoryData?.data && categoryData.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="categoryName" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="totalRevenue" fill="#fb923c" name="Revenue" />
                    <Bar
                      dataKey="totalQuantity"
                      fill="#4ade80"
                      name="Quantity"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState description="No category data available" />
              )}
            </Card>
          </Col>

          {/* Location Performance */}
          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              loading={locationLoading}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
                height: "400px",
              }}
              title={
                <span style={{ color: "#e2e8f0" }}>Location Performance</span>
              }
            >
              {locationData?.data && locationData.data.length > 0 ? (
                <div style={{ height: "300px", overflowY: "auto" }}>
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                  >
                    {locationData?.data?.map((loc) => (
                      <div key={loc.location.id}>
                        <div
                          style={{
                            marginBottom: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span style={{ color: "#e2e8f0", fontWeight: "500" }}>
                            {loc.location.name}
                          </span>
                          <span style={{ color: "#4ade80", fontWeight: "600" }}>
                            ${loc.totalRevenue.toFixed(2)}
                          </span>
                        </div>
                        <Progress
                          percent={
                            (loc.totalRevenue /
                              Math.max(
                                ...locationData.data.map((l) => l.totalRevenue)
                              )) *
                            100
                          }
                          strokeColor="#fb923c"
                          trailColor="#334155"
                          showInfo={false}
                        />
                        <div
                          style={{
                            marginTop: "4px",
                            fontSize: "12px",
                            color: "#94a3b8",
                          }}
                        >
                          {loc.orderCount} orders • Avg: $
                          {loc.averageOrderValue.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </Space>
                </div>
              ) : (
                <EmptyState description="No location data available" />
              )}
            </Card>
          </Col>
        </Row>

        {/* Tables Row */}
        <Row gutter={[16, 16]}>
          {/* Top Selling Items */}
          <Col xs={24} xl={12}>
            <Card
              bordered={false}
              loading={mostSoldLoading}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
              }}
              title={
                <span
                  style={{
                    color: "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <TrophyOutlined style={{ color: "#fb923c" }} />
                  Top Selling Items
                </span>
              }
            >
              <Table
                columns={itemColumns}
                dataSource={mostSoldData?.data}
                rowKey={(record) => record.menuItem.id}
                pagination={false}
                locale={{
                  emptyText: (
                    <EmptyState description="No items data available" />
                  ),
                }}
                style={{ background: "transparent" }}
              />
            </Card>
          </Col>

          {/* Top Customers */}
          <Col xs={24} xl={12}>
            <Card
              bordered={false}
              loading={customersLoading}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
              }}
              title={
                <span
                  style={{
                    color: "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <UserOutlined style={{ color: "#fb923c" }} />
                  Top Customers
                </span>
              }
            >
              <Table
                columns={customerColumns}
                dataSource={customersData?.data}
                rowKey={(record) => record.user.id}
                pagination={false}
                locale={{
                  emptyText: (
                    <EmptyState description="No customer data available" />
                  ),
                }}
                style={{ background: "transparent" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
