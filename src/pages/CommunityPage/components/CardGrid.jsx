import React from "react";
import { FiImage } from "react-icons/fi";
import styles from "./CardGrid.module.css"; // Changed import

const CardGrid = ({ 
  members, 
  onAddCardClick, 
  onCardClick,
  cardClassName,
  cardAvatarClassName,
  cardNameClassName,
  cardProfessionClassName,
  cardDividerClassName,
  cardContactClassName,
  addCardClassName,
  addCardIconClassName
}) => {
  const handleImageError = (e) => {
    const container = e.target.parentElement;
    if (container) {
      e.target.style.display = 'none';
      const fallback = container.querySelector(`.${styles.noImageFallback}`);
      if (fallback) fallback.style.display = 'flex';
    }
  };

  return (
    <div className={styles.cardGrid}>
      {/* Add Card Placeholder */}
      <div 
        className={`${styles.card} ${styles.addCard} ${addCardClassName}`} 
        onClick={onAddCardClick}
      >
        <div className={styles.addCardContent}>
          <div className={styles.addIcon}>+</div>
          <div className={styles.addCardText}>Add New Business Card</div>
        </div>
      </div>

      {/* Business Cards */}
      {members.map((member) => (
        <div 
          key={member.id} 
          className={`${styles.card} ${styles.businessCard} ${cardClassName}`}
          onClick={() => onCardClick(member)}
        >
          <div className={styles.cardImageContainer}>
            {member.frontCardImage ? (
              <>
                <img
                  src={member.frontCardImage}
                  alt={`${member.fullName}'s business card`}
                  className={styles.cardImage}
                  onError={handleImageError}
                />
                <div 
                  className={styles.noImageFallback} 
                  style={{ display: 'none' }}
                >
                  <FiImage className={styles.noImageIcon} />
                </div>
              </>
            ) : (
              <div className={styles.noImageFallback}>
                <FiImage className={styles.noImageIcon} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardGrid;