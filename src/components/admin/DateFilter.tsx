import { DatePicker, Select, Button, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface DateFilterProps {
  value?: DateRange;
  onChange?: (dateRange: DateRange) => void;
  onRefresh?: () => void;
  showQuickSelect?: boolean;
  showRefresh?: boolean;
}

const DateFilter = ({
  value,
  onChange,
  onRefresh,
  showQuickSelect = true,
  showRefresh = true,
}: DateFilterProps) => {
  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      onChange?.({
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
      });
    } else {
      onChange?.({});
    }
  };

  const handleQuickSelect = (preset: string) => {
    const today = dayjs();
    let startDate: string | undefined;
    let endDate: string = today.format("YYYY-MM-DD");

    switch (preset) {
      case "today":
        startDate = today.format("YYYY-MM-DD");
        break;
      case "yesterday":
        startDate = today.subtract(1, "day").format("YYYY-MM-DD");
        endDate = today.subtract(1, "day").format("YYYY-MM-DD");
        break;
      case "last7days":
        startDate = today.subtract(7, "day").format("YYYY-MM-DD");
        break;
      case "last30days":
        startDate = today.subtract(30, "day").format("YYYY-MM-DD");
        break;
      case "thisMonth":
        startDate = today.startOf("month").format("YYYY-MM-DD");
        break;
      case "lastMonth":
        startDate = today
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD");
        endDate = today
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD");
        break;
      case "all":
        onChange?.({});
        return;
    }

    onChange?.({ startDate, endDate });
  };

  const rangeValue: [Dayjs, Dayjs] | undefined =
    value?.startDate && value?.endDate
      ? [dayjs(value.startDate), dayjs(value.endDate)]
      : undefined;

  return (
    <Space wrap>
      {showQuickSelect && (
        <Select
          placeholder="Quick Select"
          style={{ width: 150 }}
          onChange={handleQuickSelect}
          allowClear
          options={[
            { label: "Today", value: "today" },
            { label: "Yesterday", value: "yesterday" },
            { label: "Last 7 Days", value: "last7days" },
            { label: "Last 30 Days", value: "last30days" },
            { label: "This Month", value: "thisMonth" },
            { label: "Last Month", value: "lastMonth" },
            { label: "All Time", value: "all" },
          ]}
        />
      )}

      <RangePicker
        value={rangeValue}
        onChange={handleRangeChange}
        format="YYYY-MM-DD"
        style={{ width: 260 }}
      />

      {showRefresh && (
        <Button icon={<ReloadOutlined />} onClick={onRefresh} type="default">
          Refresh
        </Button>
      )}
    </Space>
  );
};

export default DateFilter;
