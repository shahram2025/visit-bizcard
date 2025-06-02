import React from 'react';
import styles from './CTASection.module.css';

const CTASection = ({ onCreateCard, onUploadScan }) => {
  return (
    <section className={styles.ctaSection}>
      <h2>Upload your paper business Card, or create a new one fast and free</h2>
      <p>perfect for networking, sharing, and growing your professional connections</p>
      <div className={styles.ctaButtons}>
        <button 
          className={styles.uploadButton} 
          onClick={onUploadScan}
          aria-label="Upload business card"
        >
          <i className="fas fa-upload"></i> Upload Card
        </button>
        <span className={styles.ctaOr}>or</span>
        <button 
          className={styles.createButton} 
          onClick={onCreateCard}
          aria-label="Create business card"
        >
          <i className="fas fa-plus"></i> Create Card
        </button>
      </div>
    </section>
  );
};

export default CTASection;