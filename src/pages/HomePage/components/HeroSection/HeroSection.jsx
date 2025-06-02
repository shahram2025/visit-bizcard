import React from "react";
import styles from './HeroSection.module.css';

function HeroSection() {
  return (
    <section className={`${styles.heroSection} ${styles.animateEntry}`}>
      <div className={styles.contentContainer}>
        <h1 className={styles.headline}>Share Your Paper Business Card</h1>
        <p className={styles.subhead}>Share your card to unlock new connections.</p>
        
        {/* Optional decorative element */}
        <div className={styles.decorativeLine} aria-hidden="true"></div>
      </div>
    </section>
  );
}

export default HeroSection;