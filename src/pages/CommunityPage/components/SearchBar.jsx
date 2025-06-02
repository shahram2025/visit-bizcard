import React from "react";
import styles from "./SearchBar.module.css";
import { Search } from "@mui/icons-material"; // Import search icon

const SearchBar = () => (
  <div className={styles.searchBarContainer}>
    <Search className={styles.searchIcon} />
    <input
      type="text"
      className={styles.searchBar}
      placeholder="Search community members..."
    />
  </div>
);

export default SearchBar;