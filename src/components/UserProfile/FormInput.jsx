import React from "react";
import "./FormInput.css";

const FormInput = ({ type, name, placeholder, value, onChange, required }) => {
  return (
    <div className="form-group">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default FormInput;