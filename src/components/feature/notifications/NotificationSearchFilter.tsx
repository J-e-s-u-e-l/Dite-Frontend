import React from "react";

interface NotificationSearchFilterProps {
  setFilters: React.Dispatch<
    React.SetStateAction<{ search?: string; unread?: boolean }>
  >;
}

const NotificationSearchFilter: React.FC<NotificationSearchFilterProps> = ({
  setFilters,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: event.target.value,
    }));
  };

  const handleUnreadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      unread: event.target.checked,
    }));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search notifications"
        onChange={handleSearchChange}
      />

      <label>
        {" "}
        <input type="checkbox" onChange={handleUnreadChange} />
        Show unread only
      </label>
    </div>
  );
};

export default NotificationSearchFilter;
