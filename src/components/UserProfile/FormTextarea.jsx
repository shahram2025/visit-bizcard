import React from "react";
import "./FormTextarea.css";

const FormTextarea = ({ name, placeholder, value, onChange }) => {
  return (
    <div className="form-group">
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormTextarea;