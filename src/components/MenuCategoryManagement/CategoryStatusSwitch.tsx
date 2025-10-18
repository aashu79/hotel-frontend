import { Switch } from "antd";

interface CategoryStatusSwitchProps {
  isActive: boolean;
  loading?: boolean;
  onToggle: (checked: boolean) => void;
}

const CategoryStatusSwitch = ({
  isActive,
  loading,
  onToggle,
}: CategoryStatusSwitchProps) => (
  <Switch
    checked={isActive}
    loading={loading}
    onChange={onToggle}
    checkedChildren="Active"
    unCheckedChildren="Inactive"
  />
);

export default CategoryStatusSwitch;
