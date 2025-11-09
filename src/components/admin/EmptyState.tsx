import { Empty as AntEmpty } from "antd";
import { ReactNode } from "react";

interface EmptyStateProps {
  description?: string;
  image?: ReactNode;
  children?: ReactNode;
}

const EmptyState = ({
  description = "No data available",
  image,
  children,
}: EmptyStateProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "300px",
        padding: "40px 20px",
      }}
    >
      <AntEmpty
        image={image || AntEmpty.PRESENTED_IMAGE_SIMPLE}
        description={<span style={{ color: "#94a3b8" }}>{description}</span>}
        style={{
          color: "#94a3b8",
        }}
      >
        {children}
      </AntEmpty>
    </div>
  );
};

export default EmptyState;
