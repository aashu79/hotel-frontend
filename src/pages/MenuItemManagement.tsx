import { useState } from "react";
import { Button, Modal, Input, Card, Select, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import DashboardLayout from "../layouts/DashboardLayout";
import type { UploadFile } from "antd/es/upload/interface";
import ItemList from "../components/MenuItemManagement/ItemList";
import ItemForm from "../components/MenuItemManagement/ItemForm";
import type {
  MenuItem,
  MenuCategory,
  MenuItemFormData,
} from "../components/MenuItemManagement/types";
import {
  useMenuItems,
  useDeleteMenuItem,
  useToggleMenuItemAvailability,
  useToggleMenuItemVegetarian,
  useCreateMenuItem,
  useUpdateMenuItem,
} from "../hooks/useMenuItems";
import { useMenuCategories } from "../hooks/useMenuCategories";

const MenuItemManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | number>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // React Query hooks
  const { data: menuItems = [], isLoading: itemsLoading } = useMenuItems();
  const { data: categories = [], isLoading: categoriesLoading } =
    useMenuCategories();
  const deleteMenuItem = useDeleteMenuItem();
  const toggleAvailability = useToggleMenuItemAvailability();
  const toggleVegetarian = useToggleMenuItemVegetarian();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();

  const loading = itemsLoading || categoriesLoading;

  // Handler functions
  const handleOpenModal = (item?: MenuItem) => {
    setEditingItem(item ?? null);
    if (item?.imageUrl) {
      setImagePreview(item.imageUrl);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMenuItem.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleToggleAvailable = async (id: number) => {
    try {
      await toggleAvailability.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleToggleVeg = async (id: number) => {
    try {
      await toggleVegetarian.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleFormSubmit = async (data: MenuItemFormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });
      if (imageFile?.originFileObj) {
        formData.append("image", imageFile.originFileObj);
      }

      if (editingItem) {
        await updateMenuItem.mutateAsync({ id: editingItem.id, formData });
      } else {
        await createMenuItem.mutateAsync(formData);
      }
      handleCloseModal();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Filter menu items
  const filteredMenuItems = menuItems?.data?.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div style={{ padding: "24px" }}>
        <Card
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            overflowX: "auto",
            overflowY: "visible",
            maxHeight: "calc(100vh - 100px)",
            minWidth: 900,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#cbd5e1",
                  margin: 0,
                }}
              >
                Menu Items
              </h1>
              <p style={{ color: "#64748b", marginTop: "4px" }}>
                Manage your menu items
              </p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
              size="large"
              style={{
                background: "linear-gradient(135deg, #fb923c, #ea580c)",
                border: "none",
              }}
            >
              Add Menu Item
            </Button>
          </div>

          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <Input
              placeholder="Search menu items..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
            <Select
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: "200px" }}
            >
              <Select.Option value="all">All Categories</Select.Option>
              {categories?.data?.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Table */}
          <div style={{ width: "100%", overflowX: "auto" }}>
            <ItemList
              items={filteredMenuItems}
              loading={loading}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onToggleAvailable={handleToggleAvailable}
              onToggleVeg={handleToggleVeg}
              togglingAvailableId={
                toggleAvailability.isPending ? undefined : null
              }
              togglingVegId={toggleVegetarian.isPending ? undefined : null}
            />
          </div>
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </span>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={700}
          bodyStyle={{ maxHeight: "70vh", overflowY: "auto", minWidth: 320 }}
          style={{ top: 40 }}
        >
          <div style={{ minWidth: 320 }}>
            <ItemForm
              initialValues={
                editingItem
                  ? {
                      name: editingItem.name,
                      description: editingItem.description,
                      price: editingItem.price,
                      isVegetarian: editingItem.isVegetarian,
                      isAvailable: editingItem.isAvailable,
                      prepTimeMins: editingItem.prepTimeMins,
                      categoryId: editingItem.categoryId,
                    }
                  : undefined
              }
              categories={categories?.data || []}
              loading={createMenuItem.isPending || updateMenuItem.isPending}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
              imageFile={imageFile}
              setImageFile={setImageFile}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
            />
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MenuItemManagement;
