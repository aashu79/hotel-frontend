import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Avatar, Button, Drawer } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  TagsOutlined,
  UnorderedListOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Utensils } from "lucide-react";
import useAuthStore from "../store/authStore";

const { Sider, Content, Header } = Layout;

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/staff-login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const isAdmin = user?.role === "ADMIN";

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: isAdmin ? "Admin Dashboard" : "Dashboard",
      onClick: () => {
        navigate(isAdmin ? "/admin/dashboard" : "/dashboard");
        setIsMobileMenuOpen(false);
      },
    },
    ...(isAdmin
      ? [
          {
            key: "/admin/staff",
            icon: <UserOutlined />,
            label: "Staff Management",
            onClick: () => {
              navigate("/admin/staff");
              setIsMobileMenuOpen(false);
            },
          },
          {
            key: "/admin/customers",
            icon: <UserOutlined />,
            label: "Customer Management",
            onClick: () => {
              navigate("/admin/customers");
              setIsMobileMenuOpen(false);
            },
          },
          {
            key: "locations",
            icon: <EnvironmentOutlined />,
            label: "Locations",
            onClick: () => navigate("/admin/locations"),
          },
          {
            key: "delivery-services",
            icon: <ShoppingOutlined />,
            label: "Delivery Services",
            onClick: () => navigate("/admin/delivery-services"),
          },
        ]
      : []),
    {
      key: "menu-section",
      label: "Menu Management",
      icon: <AppstoreOutlined />,
      children: [
        {
          key: "/dashboard/menu-categories",
          icon: <TagsOutlined />,
          label: "Categories",
          onClick: () => {
            navigate("/dashboard/menu-categories");
            setIsMobileMenuOpen(false);
          },
        },
        {
          key: "/dashboard/menu-items",
          icon: <UnorderedListOutlined />,
          label: "Menu Items",
          onClick: () => {
            navigate("/dashboard/menu-items");
            setIsMobileMenuOpen(false);
          },
        },
      ],
    },
    {
      key: "/dashboard/orders",
      icon: <ShoppingOutlined />,
      label: "Orders",
      onClick: () => {
        navigate("/dashboard/orders");
        setIsMobileMenuOpen(false);
      },
    },
    ...(isAdmin
      ? [
          {
            key: "/admin/settings",
            icon: <SettingOutlined />,
            label: "Restaurant Settings",
            onClick: () => {
              navigate("/admin/settings");
              setIsMobileMenuOpen(false);
            },
          },
        ]
      : []),
  ];

  const sidebarContent = (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              padding: "8px",
              background: "linear-gradient(135deg, #fb923c, #ea580c)",
              borderRadius: "8px",
            }}
          >
            <Utensils
              style={{ width: "20px", height: "20px", color: "white" }}
            />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              background: "linear-gradient(to right, #fb923c, #ea580c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}
          >
            Himalayan
          </h2>
        </div>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px 12px" }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            background: "transparent",
            border: "none",
          }}
          theme="dark"
        />
      </div>

      {/* User Profile */}
      <div style={{ borderTop: "1px solid #1e293b", padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
            padding: "12px",
            borderRadius: "8px",
            background: "#1e293b",
          }}
        >
          <Avatar
            style={{
              background: "linear-gradient(135deg, #fb923c, #ea580c)",
              border: "2px solid rgba(251, 146, 60, 0.5)",
            }}
          >
            {user?.name ? getInitials(user.name) : "U"}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                color: "#cbd5e1",
                fontSize: "14px",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name}
            </p>
            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                fontSize: "12px",
                textTransform: "capitalize",
              }}
            >
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>
        <Button
          block
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            color: "#cbd5e1",
            height: "40px",
          }}
        >
          Log out
        </Button>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#020617" }}>
      {/* Desktop Sidebar */}
      <Sider
        width={256}
        style={{
          background: "#0f172a",
          borderRight: "1px solid #1e293b",
          display: "none",
        }}
        breakpoint="md"
        collapsedWidth={0}
        className="desktop-sider"
      >
        {sidebarContent}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        closeIcon={null}
        width={256}
        styles={{
          body: { padding: 0, background: "#0f172a" },
          header: { display: "none" },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Layout style={{ background: "#020617" }}>
        {/* Mobile Header */}
        <Header
          style={{
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #1e293b",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="mobile-header"
        >
          <Button
            icon={<MenuOutlined />}
            onClick={() => setIsMobileMenuOpen(true)}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#cbd5e1",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                padding: "6px",
                background: "linear-gradient(135deg, #fb923c, #ea580c)",
                borderRadius: "6px",
              }}
            >
              <Utensils
                style={{ width: "16px", height: "16px", color: "white" }}
              />
            </div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 600,
                background: "linear-gradient(to right, #fb923c, #ea580c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
              }}
            >
              Himalayan
            </h1>
          </div>
          <div style={{ width: "32px" }} />
        </Header>

        {/* Main Content */}
        <Content
          style={{
            padding: "16px",
            background: "#020617",
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>

      <style>{`
        @media (min-width: 768px) {
          .desktop-sider {
            display: block !important;
          }
          .mobile-header {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .mobile-header {
            display: flex !important;
          }
        }
        
        /* Ant Design Menu customization */
        .ant-menu-dark.ant-menu-inline .ant-menu-item-selected {
          background: linear-gradient(to right, rgba(251, 146, 60, 0.2), rgba(234, 88, 12, 0.2)) !important;
          border-left: 2px solid #fb923c !important;
          color: #fb923c !important;
        }
        
        .ant-menu-dark .ant-menu-item {
          color: #94a3b8 !important;
          border-radius: 8px;
          margin: 4px 0;
        }
        
        .ant-menu-dark .ant-menu-item:hover {
          color: #cbd5e1 !important;
          background: rgba(30, 41, 59, 0.5) !important;
        }
        
        .ant-menu-dark .ant-menu-item-selected:hover {
          color: #fb923c !important;
        }
      `}</style>
    </Layout>
  );
};

export default DashboardLayout;
