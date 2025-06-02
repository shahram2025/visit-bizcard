import React from 'react';
import styles from './ThirdeyeCard.module.css';

const ThirdeyeCard = ({ title, description, buttonText, onButtonClick }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <button 
        className={styles.button}
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ThirdeyeCard;