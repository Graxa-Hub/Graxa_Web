export const AuthLayout = ({
  children,
  rightPanelColor = "bg-[var(--accent)]",
  columns = 2,
  className = "",
  padding = "px-4",
}) => {
  const colsClass =
    columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2";
  const maxWidthClass = columns === 1 ? "max-w-xl" : "max-w-4xl";

  return (
    <div
      className={`w-full min-h-screen flex justify-center items-center bg-[var(--bg)] ${padding}`}
    >
      <div
        className={`w-full ${maxWidthClass} grid ${colsClass} auth-panel overflow-hidden ${className}`}
      >
        {children}
        {columns > 1 && (
          <div
            className={`hidden sm:block grid-background ${rightPanelColor}`}
          />
        )}
      </div>
    </div>
  );
};
