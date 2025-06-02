import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css"; // Updated import
import {
  Home,
  People,
  Chair,
  Visibility,
  CropFree,
} from "@mui/icons-material";

function Footer() {
  return (
    <footer className={styles.footer}>
      <Link to="/" className={styles["footer-icon"]}>
        <Home />
      </Link>
      <Link to="/community" className={styles["footer-icon"]}>
        <People />
      </Link>
      <Link to="/sit" className={styles["footer-icon"]}>
        <Chair />
      </Link>
      <Link to="/thirdeye" className={styles["footer-icon"]}>
        <Visibility />
      </Link>
      <Link to="/blank" className={styles["footer-icon"]}>
        <CropFree />
      </Link>
    </footer>
  );
}

export default Footer;