import React from 'react';
import styles from './ShareButton.module.css';
import { FiShare2 } from 'react-icons/fi';

const ShareButton = ({ onClick }) => {
  return (
    <button 
      className={styles.shareButton}
      onClick={onClick}
      aria-label="Share business card"
    >
      <FiShare2 className={styles.icon} />
      <span>Share</span>
    </button>
  );
};

export default ShareButton;