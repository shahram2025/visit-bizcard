import React from 'react';
import { 
  FiX, 
  FiLink, 
  FiMail, 
  FiFacebook, 
  FiTwitter, 
  FiLinkedin,
  FiShare2 
} from 'react-icons/fi';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import styles from './ShareModal.module.css';

const ShareModal = ({ isOpen, onClose, frontImage, backImage }) => {
  if (!isOpen) return null;

  const shareOptions = [
    { icon: <FiLink size={20} />, name: 'Copy Link', color: '#3b82f6' },
    { icon: <FiMail size={20} />, name: 'Email', color: '#ef4444' },
    { icon: <FiFacebook size={20} />, name: 'Facebook', color: '#1877f2' },
    { icon: <FiTwitter size={20} />, name: 'X', color: '#000000' },
    { icon: <FiLinkedin size={20} />, name: 'LinkedIn', color: '#0a66c2' },
    { icon: <FaWhatsapp size={20} />, name: 'WhatsApp', color: '#25D366' },
    { icon: <FaTelegram size={20} />, name: 'Telegram', color: '#0088cc' },
  ];

  const handleShare = (platform) => {
    console.log(`Sharing to ${platform}`);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Share Your Card</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close share modal">
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.cardPreviews}>
          {frontImage && (
            <div className={styles.previewContainer}>
              <img src={frontImage} alt="Front of card" className={styles.cardPreview} />
              <span>Front Side</span>
            </div>
          )}
          {backImage && (
            <div className={styles.previewContainer}>
              <img src={backImage} alt="Back of card" className={styles.cardPreview} />
              <span>Back Side</span>
            </div>
          )}
        </div>

        <div className={styles.shareOptions}>
          {shareOptions.map((option) => (
            <button
              key={option.name}
              className={styles.shareButton}
              style={{ backgroundColor: option.color }}
              onClick={() => handleShare(option.name)}
              aria-label={`Share via ${option.name}`}
            >
              {option.icon}
              <span>{option.name}</span>
            </button>
          ))}
        </div>

        <div className={styles.footer}>
          <FiShare2 className={styles.shareIcon} />
          <p>Select a platform to share</p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;