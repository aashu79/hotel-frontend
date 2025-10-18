import { Table, Tag, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import CategoryStatusSwitch from "./CategoryStatusSwitch";
import { MenuCategory } from "./types";

interface CategoryListProps {
  categories: MenuCategory[];
  loading: boolean;
  onEdit: (category: MenuCategory) => void;
  onDelete: (id: number) => void;
  onToggleStatus?: (id: number, isActive: boolean) => void;
  togglingId?: number | null;
}

const CategoryList = ({
  categories,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  togglingId,
}: CategoryListProps) => {
  const columns: ColumnsType<MenuCategory> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Sort Order",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 120,
      sorter: (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (_: boolean, record: MenuCategory) => (
        <CategoryStatusSwitch
          isActive={record.isActive}
          loading={togglingId === record.id}
          onToggle={(checked) =>
            onToggleStatus && onToggleStatus(record.id, checked)
          }
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: unknown, record: MenuCategory) => (
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
            title="Delete Category"
            description="Are you sure you want to delete this category?"
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
      dataSource={categories}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} categories`,
      }}
    />
  );
};

export default CategoryList;
