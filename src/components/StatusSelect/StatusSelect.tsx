import Select, { StylesConfig, SingleValue, ActionMeta } from "react-select";
import { editEventStatus } from '@/utils/api/requests/admin/editEventStatus';
import { useEffect, useState } from "react";

type EventStatus = "Draft" | "Actual" | "Finished" | "Archive";

interface StatusOption {
  value: EventStatus;
  label: string;
  color: string;
}

const statusOptions: StatusOption[] = [
  { value: "Draft", label: "Черновик", color: "#aaa" },
  { value: "Actual", label: "Опубликовано", color: "#32c550" },
  { value: "Finished", label: "Завершено", color: "#555" },
  { value: "Archive", label: "Архивировано", color: "#333" },
];

const customStyles: StylesConfig<StatusOption> = {
    control: (base) => ({
        ...base,
        borderRadius: "0.5rem",
        padding: "0.2rem",
        minHeight: "40px",
        minWidth: "100%",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    }),
    singleValue: (base, { data }) => ({
        ...base,
        color: "#fff",
        background: data.color,
        padding: "0.2rem 0.6rem",
        borderRadius: "0.5rem",
        display: "inline-block",
    }),
    option: (base, { isFocused, data }) => ({
        ...base,
        background: isFocused ? data.color : "white",
        color: isFocused ? "white" : data.color,
        cursor: "pointer",
    }),
    menu: (base) => ({
        ...base,
        borderRadius: "0.5rem",
        overflow: "hidden",
    }),
};

interface StatusSelectProps {
  value: EventStatus;
  onChange: (status: EventStatus) => void;
  eventId: string;
}

export const StatusSelect = ({ value, onChange, eventId }: StatusSelectProps) => {
    const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(null);

    useEffect(() => {
        if (value) {
        const newSelected = statusOptions.find(option => option.value === value) || null;
        setSelectedStatus(newSelected);
        }
    }, [value]);
    if (!value) {
        return <div>Загрузка статуса...</div>;
    }
        
  const handleStatusChange = async (
    newValue: SingleValue<StatusOption>,
    actionMeta: ActionMeta<StatusOption>
    ) => {
        if (!newValue || Array.isArray(newValue)) return;
        const newStatus = newValue.value;
        
        setSelectedStatus(newValue);

        onChange(newStatus);

        try {
            const response = await editEventStatus({ id: eventId, newStatus });
        } catch (error) {
            console.error('Ошибка при изменении статуса мероприятия:', error);
        }
    };

  return (
    <Select
      isMulti={false}
      value={selectedStatus}
      onChange={handleStatusChange}
      options={statusOptions}
      styles={customStyles}
      isSearchable={false}
    />
  );
};

export default StatusSelect;