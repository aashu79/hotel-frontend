import { Card, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  loading?: boolean;
  precision?: number;
  formatter?: (value: number | string) => string;
}

const MetricCard = ({
  title,
  value,
  prefix,
  suffix,
  icon,
  trend,
  loading = false,
  precision = 0,
  formatter,
}: MetricCardProps) => {
  return (
    <Card
      bordered={false}
      loading={loading}
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "12px",
        height: "100%",
      }}
    >
      <div style={{ position: "relative" }}>
        <Statistic
          title={
            <span style={{ color: "#cbd5e1", fontSize: "14px" }}>{title}</span>
          }
          value={value}
          prefix={prefix}
          suffix={suffix}
          precision={precision}
          formatter={formatter}
          valueStyle={{ color: "#f0fdf4", fontSize: "24px", fontWeight: "600" }}
        />

        {trend && (
          <div
            style={{
              fontSize: "12px",
              color: trend.direction === "up" ? "#4ade80" : "#f87171",
              marginTop: "4px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {trend.direction === "up" ? (
              <ArrowUpOutlined />
            ) : (
              <ArrowDownOutlined />
            )}
            {Math.abs(trend.value)}%
          </div>
        )}

        {icon && (
          <div
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(251, 146, 60, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "#fb923c",
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;
