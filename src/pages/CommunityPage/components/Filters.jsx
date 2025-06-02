import React, { useRef, useEffect, useMemo } from "react";
import styles from "./Filters.module.css";

const Filters = ({ activeFilter, setActiveFilter, availableCategories = [] }) => {
  const filtersContainerRef = useRef(null);

  // Memoized filter preparation - now only shows valid, completed professions
  const filters = useMemo(() => {
    // Always include "All" filter first
    const baseFilters = ["All"];

    // Process available categories
    const validCategories = availableCategories
      .filter(category => {
        // Validate each category
        if (!category || typeof category !== 'string') return false;
        
        const trimmed = category.trim();
        
        // Exclude any "other:" prefixed entries and empty/short values
        return (
          trimmed.length > 1 &&                   // Minimum 2 characters
          !trimmed.startsWith("other:") &&       // No partial "other" entries
          !trimmed.includes(":") &&              // No colon-separated values
          /^[a-zA-Z0-9 ]+$/.test(trimmed)        // Only alphanumeric + spaces
        );
      })
      .map(category => category.trim())
      .sort((a, b) => a.localeCompare(b)); // Alphabetical sort

    return [...baseFilters, ...validCategories];
  }, [availableCategories]);

  // Enhanced drag-to-scroll functionality
  const handleMouseDown = (e) => {
    const container = filtersContainerRef.current;
    container.classList.add(styles.grabbing);
    container.style.cursor = "grabbing";
    
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (e) => {
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      container.classList.remove(styles.grabbing);
      container.style.cursor = "grab";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Auto-scroll to active filter
  useEffect(() => {
    if (filtersContainerRef.current && activeFilter && activeFilter !== "All") {
      const activeBtn = filtersContainerRef.current.querySelector(
        `.${styles["filter-btn"]}.${styles.active}`
      );
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }
  }, [activeFilter, filters]);

  return (
    <div className={styles["filters-container"]}>
      <div
        className={styles.filters}
        ref={filtersContainerRef}
        onMouseDown={handleMouseDown}
        role="tablist"
        aria-label="Business category filters"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles["filter-btn"]} ${
              activeFilter === filter ? styles.active : ""
            }`}
            onClick={() => setActiveFilter(filter)}
            onKeyDown={(e) => 
              ["Enter", " "].includes(e.key) && setActiveFilter(filter)
            }
            role="tab"
            aria-selected={activeFilter === filter}
            tabIndex={0}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;