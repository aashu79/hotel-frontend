import { useState } from "react";
import { Button, Modal, Card, Input, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import DashboardLayout from "../layouts/DashboardLayout";
import CategoryList from "../components/MenuCategoryManagement/CategoryList";
import CategoryForm, {
  CategoryFormData,
} from "../components/MenuCategoryManagement/CategoryForm";
import type { MenuCategory } from "../components/MenuCategoryManagement/types";
import {
  useMenuCategories,
  useCreateMenuCategory,
  useUpdateMenuCategory,
  useDeleteMenuCategory,
  useToggleMenuCategoryStatus,
} from "../hooks/useMenuCategories";

const MenuCategoryManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  );
  const [searchText, setSearchText] = useState("");

  // React Query hooks
  const { data: categories = [], isLoading: loading } = useMenuCategories({
    includeInactive: true,
  });
  const createCategory = useCreateMenuCategory();
  const updateCategory = useUpdateMenuCategory();
  const deleteCategory = useDeleteMenuCategory();
  const toggleStatus = useToggleMenuCategoryStatus();

  // Handle status toggle
  const handleToggleStatus = async (id: number) => {
    try {
      await toggleStatus.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, data });
      } else {
        await createCategory.mutateAsync(data);
      }
      handleCloseModal();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await deleteCategory.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Handle modal open for create/edit
  const handleOpenModal = (category?: MenuCategory) => {
    setEditingCategory(category || null);
    setModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  // Filter categories by search
  const filteredCategories = categories?.data?.filter((category) =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div style={{ padding: "24px" }}>
        <Card
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            overflow: "auto",
            maxHeight: "calc(100vh - 100px)",
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
                Menu Categories
              </h1>
              <p style={{ color: "#64748b", marginTop: "4px" }}>
                Manage your menu categories
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
              Add Category
            </Button>
          </div>

          {/* Search */}
          <div style={{ marginBottom: "16px" }}>
            <Input
              placeholder="Search categories..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
          </div>

          {/* Table */}
          <CategoryList
            categories={filteredCategories}
            loading={loading}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            togglingId={toggleStatus.isPending ? undefined : null}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              {editingCategory ? "Edit Category" : "Add Category"}
            </span>
          }
          open={modalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={600}
          bodyStyle={{ maxHeight: "70vh", overflow: "auto" }}
        >
          <CategoryForm
            initialValues={editingCategory ?? undefined}
            loading={createCategory.isPending || updateCategory.isPending}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MenuCategoryManagement;
