import React from "react";
import styles from "./ComoSection.module.css";

const ComoSection = ({ memberCount }) => (
  <div className={styles["como-section"]}>
    <h1 className={styles["como-title"]}>Who will you meet today?</h1>
    <p className={styles["como-subtitle"]}>Visit makes it easy to build your business network</p>
    <div className={styles["community-header"]}>
      <h3>My Community</h3>
      <span className={styles["member-count"]}>{memberCount} members</span>
    </div>
  </div>
);

export default ComoSection;