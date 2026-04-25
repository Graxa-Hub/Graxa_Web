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
    ref,
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
        className={`form-input ${className}`}
        {...rest}
      />
    );
  },
);
