import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Button, Empty } from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  AppstoreOutlined,
  RiseOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  CreditCardOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../layouts/DashboardLayout";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    menuItems: 0,
    totalStaff: 0,
  });

  useEffect(() => {
    // Fetch admin dashboard data from API
    const fetchDashboardData = async () => {
      // Mock data for demonstration
      setStats({
        totalOrders: 142,
        totalCustomers: 58,
        totalRevenue: 4385,
        menuItems: 36,
        totalStaff: 8,
      });
    };

    fetchDashboardData();
  }, []);

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
            Admin Dashboard
          </h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            Welcome back, {user?.name}! Complete control of your restaurant.
          </p>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
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

          <Col xs={24} sm={12} lg={8}>
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
                    Total Customers
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

          <Col xs={24} sm={12} lg={8}>
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
                    Total Staff
                  </span>
                }
                value={stats.totalStaff}
                valueStyle={{ color: "#f0fdf4", fontSize: "24px" }}
                suffix={
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#60a5fa",
                      marginTop: "4px",
                    }}
                  >
                    Active
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
                <TeamOutlined style={{ fontSize: "20px", color: "#60a5fa" }} />
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
          <Col xs={24} lg={16}>
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
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12} md={8}>
                  <Button
                    block
                    icon={<TeamOutlined />}
                    onClick={() => navigate("/admin/staff")}
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#cbd5e1",
                      height: "50px",
                      borderRadius: "8px",
                      fontSize: "15px",
                    }}
                  >
                    Manage Staff
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button
                    block
                    icon={<UserOutlined />}
                    onClick={() => navigate("/admin/customers")}
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#cbd5e1",
                      height: "50px",
                      borderRadius: "8px",
                      fontSize: "15px",
                    }}
                  >
                    Manage Customers
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button
                    block
                    icon={<AppstoreOutlined />}
                    onClick={() => navigate("/dashboard/menu")}
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#cbd5e1",
                      height: "50px",
                      borderRadius: "8px",
                      fontSize: "15px",
                    }}
                  >
                    Menu Management
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button
                    block
                    icon={<ShoppingOutlined />}
                    onClick={() => navigate("/dashboard/orders")}
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#cbd5e1",
                      height: "50px",
                      borderRadius: "8px",
                      fontSize: "15px",
                    }}
                  >
                    View Orders
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button
                    block
                    icon={<LineChartOutlined />}
                    onClick={() => navigate("/admin/analytics")}
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#cbd5e1",
                      height: "50px",
                      borderRadius: "8px",
                      fontSize: "15px",
                    }}
                  >
                    Analytics
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button
                    block
                    icon={<CreditCardOutlined />}
                    onClick={() => navigate("/admin/payments")}
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#cbd5e1",
                      height: "50px",
                      borderRadius: "8px",
                      fontSize: "15px",
                    }}
                  >
                    Payments
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button
                    block
                    icon={<BarChartOutlined />}
                    onClick={() => navigate("/admin/sales")}
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#cbd5e1",
                      height: "50px",
                      borderRadius: "8px",
                      fontSize: "15px",
                    }}
                  >
                    Sales
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button
                    block
                    icon={<SettingOutlined />}
                    onClick={() => navigate("/admin/settings")}
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#cbd5e1",
                      height: "50px",
                      borderRadius: "8px",
                      fontSize: "15px",
                    }}
                  >
                    Settings
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={
                <span style={{ color: "#f1f5f9", fontSize: "18px" }}>
                  Recent Activity
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
                  <span style={{ color: "#94a3b8" }}>No recent activity</span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
