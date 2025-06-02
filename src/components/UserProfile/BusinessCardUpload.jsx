import React from "react";
import styles from "./BusinessCardUpload.module.css";

const BusinessCardUpload = ({ label, id, image, onChange }) => {
  return (
    <div className={styles["card-side-upload"]}>
      <input
        type="file"
        id={id}
        accept="image/*"
        style={{ display: "none" }}
        onChange={onChange}
        required
      />
      <label htmlFor={id} className={styles["card-upload-label"]}>
        {image ? (
          <img src={image} alt="Preview" className={styles["card-preview-image"]} />
        ) : (
          <span className={styles["upload-instruction"]}>Tap to upload {label}</span>
        )}
      </label>
    </div>
  );
};

export default BusinessCardUpload;