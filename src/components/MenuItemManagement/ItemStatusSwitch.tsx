import { Switch } from "antd";

interface ItemStatusSwitchProps {
  checked: boolean;
  loading?: boolean;
  onToggle: (checked: boolean) => void;
  checkedChildren?: string;
  unCheckedChildren?: string;
}

const ItemStatusSwitch = ({
  checked,
  loading,
  onToggle,
  checkedChildren,
  unCheckedChildren,
}: ItemStatusSwitchProps) => (
  <Switch
    checked={checked}
    loading={loading}
    onChange={onToggle}
    checkedChildren={checkedChildren}
    unCheckedChildren={unCheckedChildren}
  />
);

export default ItemStatusSwitch;
