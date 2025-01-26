import React from "react";

const NotificationSearchFilter = ({ setFilters }) => {
  const handleSearchChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      search: event.target.value,
    }));
  };

  const handleUnreadChange = (event) => {
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
