import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Button, Empty } from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  AppstoreOutlined,
  RiseOutlined,
  PlusOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../layouts/DashboardLayout";
import useAuthStore from "../store/authStore";
import useLocationStore from "../store/locationStore";

const Dashboard = () => {
  const { user } = useAuthStore();
  const { currentLocation, fetchLocationById } = useLocationStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    menuItems: 0,
  });

  useEffect(() => {
    // In a real application, you'd fetch these stats from your API
    const fetchDashboardData = async () => {
      // Mock data for demonstration
      setStats({
        totalOrders: 142,
        totalCustomers: 58,
        totalRevenue: 4385,
        menuItems: 36,
      });
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Fetch user's location if they're staff
    if (user?.locationId) {
      fetchLocationById(user.locationId);
    }
  }, [user]);

  const isAdmin = user?.role === "ADMIN";
  const isStaff = user?.role === "STAFF";

  return (
    <DashboardLayout>
      <div style={{ padding: "0" }}>
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
            Dashboard
          </h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            Welcome back, {user?.name}!{" "}
            {isStaff && currentLocation && ` (${currentLocation.name})`} Here's
            an overview of your restaurant.
          </p>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "#cbd5e1", fontSize: "14px" }}>
                    Total Revenue
                  </span>
                }
                value={stats.totalRevenue}
                prefix="₹"
                valueStyle={{ color: "#f0fdf4", fontSize: "24px" }}
                suffix={
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#4ade80",
                      marginTop: "4px",
                    }}
                  >
                    <RiseOutlined /> +12%
                  </div>
                }
              />
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "rgba(34, 197, 94, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DollarOutlined
                  style={{ fontSize: "20px", color: "#4ade80" }}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "#cbd5e1", fontSize: "14px" }}>
                    Orders
                  </span>
                }
                value={stats.totalOrders}
                valueStyle={{ color: "#f0fdf4", fontSize: "24px" }}
                suffix={
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#60a5fa",
                      marginTop: "4px",
                    }}
                  >
                    <RiseOutlined /> +8%
                  </div>
                }
              />
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "rgba(59, 130, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingOutlined
                  style={{ fontSize: "20px", color: "#60a5fa" }}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "#cbd5e1", fontSize: "14px" }}>
                    Customers
                  </span>
                }
                value={stats.totalCustomers}
                valueStyle={{ color: "#f0fdf4", fontSize: "24px" }}
                suffix={
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#c084fc",
                      marginTop: "4px",
                    }}
                  >
                    <RiseOutlined /> +5%
                  </div>
                }
              />
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "rgba(168, 85, 247, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserOutlined style={{ fontSize: "20px", color: "#c084fc" }} />
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "#cbd5e1", fontSize: "14px" }}>
                    Menu Items
                  </span>
                }
                value={stats.menuItems}
                valueStyle={{ color: "#f0fdf4", fontSize: "24px" }}
                suffix={
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#fb923c",
                      marginTop: "4px",
                    }}
                  >
                    +2 new
                  </div>
                }
              />
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "rgba(251, 146, 60, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppstoreOutlined
                  style={{ fontSize: "20px", color: "#fb923c" }}
                />
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <span style={{ color: "#f1f5f9", fontSize: "18px" }}>
                  Recent Orders
                </span>
              }
              bordered={false}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
              }}
              headStyle={{ borderBottom: "1px solid #334155" }}
            >
              <Empty
                description={
                  <span style={{ color: "#94a3b8" }}>
                    No recent orders to display
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={
                <span style={{ color: "#f1f5f9", fontSize: "18px" }}>
                  Quick Actions
                </span>
              }
              bordered={false}
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "12px",
              }}
              headStyle={{ borderBottom: "1px solid #334155" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Button
                  block
                  icon={<AppstoreOutlined />}
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#cbd5e1",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  Add Menu Item
                </Button>
                <Button
                  block
                  icon={<TeamOutlined />}
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#cbd5e1",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  View Customers
                </Button>
                <Button
                  block
                  icon={<BarChartOutlined />}
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#cbd5e1",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  View Reports
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {isAdmin && (
          <Card
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ color: "#f1f5f9", fontSize: "18px" }}>
                  Admin Functions
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    padding: "4px 12px",
                    background: "rgba(251, 146, 60, 0.2)",
                    color: "#fb923c",
                    borderRadius: "12px",
                  }}
                >
                  Admin Only
                </span>
              </div>
            }
            bordered={false}
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: "12px",
              marginTop: "24px",
            }}
            headStyle={{ borderBottom: "1px solid #334155" }}
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} md={8}>
                <Button
                  block
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#cbd5e1",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  Manage Staff
                </Button>
              </Col>
              <Col xs={24} md={8}>
                <Button
                  block
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#cbd5e1",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  System Settings
                </Button>
              </Col>
              <Col xs={24} md={8}>
                <Button
                  block
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#cbd5e1",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  Export Data
                </Button>
              </Col>
            </Row>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
