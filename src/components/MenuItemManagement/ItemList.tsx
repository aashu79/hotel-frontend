import { Table, Tag, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { MenuItem, MenuCategory } from "./types";
import ItemStatusSwitch from "./ItemStatusSwitch";

interface ItemListProps {
  items: MenuItem[];
  loading: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onToggleAvailable: (id: number, checked: boolean) => void;
  onToggleVeg: (id: number, checked: boolean) => void;
  togglingAvailableId?: number | null;
  togglingVegId?: number | null;
}

const ItemList = ({
  items,
  loading,
  onEdit,
  onDelete,
  onToggleAvailable,
  onToggleVeg,
  togglingAvailableId,
  togglingVegId,
}: ItemListProps) => {
  const columns: ColumnsType<MenuItem> = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl: string) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="Item"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ) : (
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "#1e293b",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              fontSize: "12px",
            }}
          >
            No Image
          </div>
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (_: any, record: MenuItem) => (
        <Tag color="blue">{record.category?.name || "N/A"}</Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => `₹${price}`,
    },
    {
      title: "Type",
      dataIndex: "isVegetarian",
      key: "isVegetarian",
      width: 120,
      render: (_: boolean, record: MenuItem) => (
        <ItemStatusSwitch
          checked={record.isVegetarian}
          loading={togglingVegId === record.id}
          onToggle={(checked) => onToggleVeg(record.id, checked)}
          checkedChildren="Veg"
          unCheckedChildren="Non-Veg"
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "isAvailable",
      key: "isAvailable",
      width: 120,
      render: (_: boolean, record: MenuItem) => (
        <ItemStatusSwitch
          checked={record.isAvailable}
          loading={togglingAvailableId === record.id}
          onToggle={(checked) => onToggleAvailable(record.id, checked)}
          checkedChildren="Available"
          unCheckedChildren="Unavailable"
        />
      ),
    },
    {
      title: "Prep Time",
      dataIndex: "prepTimeMins",
      key: "prepTimeMins",
      width: 100,
      render: (time?: number) => (time ? `${time} mins` : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: unknown, record: MenuItem) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            style={{ color: "#fb923c" }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Menu Item"
            description="Are you sure you want to delete this item?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={items}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }}
    />
  );
};

export default ItemList;
