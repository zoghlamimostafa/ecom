import React from "react";

const CustomInput = (props) => {
  const { type, placeholder, name, className, value, onChange, onBlur } = props;
  return (
    <div>
      <input
        type={type}
        className={`form-control ${className}`}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default CustomInput;