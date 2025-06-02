import React, { useState } from 'react';
import styles from './BusinessCardDisplay.module.css';
import ShareButton from '../../../../components/Buttons/ShareButton/ShareButton';
import ShareModal from '../ShareModal/ShareModal';

const BusinessCardDisplay = ({ frontImage, backImage }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className={styles.cardDisplaySection}>
      <div className={styles.cardContainer}>
        {/* Card Flip Container */}
        <div 
          className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={isFlipped ? "Show front of card" : "Show back of card"}
        >
          {/* Front Card */}
          <div className={styles.cardFace}>
            {frontImage ? (
              <img 
                src={frontImage} 
                alt="Business card front" 
                className={styles.cardImage}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/default-card-front.png';
                }}
              />
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.logoPlaceholder}></div>
                <p className={styles.instructionText}>Create your business card</p>
              </div>
            )}
          </div>

          {/* Back Card */}
          <div className={`${styles.cardFace} ${styles.cardBack}`}>
            {backImage ? (
              <img 
                src={backImage} 
                alt="Business card back" 
                className={styles.cardImage}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/default-card-back.png';
                }}
              />
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.logoPlaceholder}></div>
                <p className={styles.instructionText}>Add back side details</p>
              </div>
            )}
          </div>
        </div>

        {/* Card Status Indicator */}
        <div className={styles.cardIndicator}>
          <button 
            className={`${styles.indicatorDot} ${!isFlipped ? styles.active : ''}`}
            onClick={() => setIsFlipped(false)}
            aria-label="Show front of card"
          />
          <button 
            className={`${styles.indicatorDot} ${isFlipped ? styles.active : ''}`}
            onClick={() => setIsFlipped(true)}
            aria-label="Show back of card"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <ShareButton 
          onClick={() => setIsShareModalOpen(true)}
          disabled={!frontImage}
          aria-label="Share business card"
        />
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        frontImage={frontImage}
        backImage={backImage}
      />
    </section>
  );
};

export default BusinessCardDisplay;