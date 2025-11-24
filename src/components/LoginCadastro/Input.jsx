import React from "react";

export const Input = React.forwardRef(
  (
    {
      value,
      onChange,
      type = "text",
      placeholder,
      name,
      disabled,
      className = "",
      ...rest
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        className={`w-full py-2 px-3 rounded-sm border border-gray-400 outline-none bg-transparent focus:ring-2 focus:bg-white ${className}`}
        {...rest}
      />
    );
  }
);
