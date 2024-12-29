const Spinner = ({ className = "", size = "md" }) => {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <div
      className={`border-t-2 border-blue-500 rounded-full animate-spin ${sizeClass} ${className}`}
    ></div>
  );
};

export default Spinner;
