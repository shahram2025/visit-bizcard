import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';
import MapComponent from './MapComponent';
import SaveButton from './SaveButton';
import ContinueButton from '../Buttons/ContinueButton';
import ProfileImageUpload from './ProfileImageUpload';
import styles from './CardCreator.module.css';

const colorThemes = [
  {
    name: "Classic White",
    primary: "#FFFFFF",
    secondary: "#F5F5F5",
    accent: "#2C3E50",
    text: "#2C3E50"
  },
  {
    name: "Premium Cream",
    primary: "#F5F5DC",
    secondary: "#FFFFF0",
    accent: "#8B4513",
    text: "#333333"
  },
  {
    name: "Navy Blue",
    primary: "#000080",
    secondary: "#1E3F66",
    accent: "#D4AF37",
    text: "#FFFFFF"
  },
  {
    name: "Charcoal Gray",
    primary: "#36454F",
    secondary: "#708090",
    accent: "#FF6B6B",
    text: "#FFFFFF"
  },
  {
    name: "Jet Black",
    primary: "#000000",
    secondary: "#222222",
    accent: "#C0C0C0",
    text: "#FFFFFF"
  },
  {
    name: "Sky Blue",
    primary: "#87CEEB",
    secondary: "#4682B4",
    accent: "#FFFFFF",
    text: "#000000"
  },
  {
    name: "Burgundy",
    primary: "#800020",
    secondary: "#58111A",
    accent: "#D4AF37",
    text: "#FFFFFF"
  },
  {
    name: "Forest Green",
    primary: "#228B22",
    secondary: "#2E8B57",
    accent: "#F5F5DC",
    text: "#FFFFFF"
  },
  {
    name: "Slate Teal",
    primary: "#008080",
    secondary: "#006D6D",
    accent: "#FFFFFF",
    text: "#FFFFFF"
  },
  {
    name: "Warm Gray",
    primary: "#A9A9A9",
    secondary: "#D3D3D3",
    accent: "#36454F",
    text: "#000000"
  },
  {
    name: "Soft Pink",
    primary: "#FFD1DC",
    secondary: "#FFB6C1",
    accent: "#6A5ACD",
    text: "#000000"
  },
  {
    name: "Sand",
    primary: "#F4A460",
    secondary: "#E6C9A8",
    accent: "#800020",
    text: "#000000"
  }
];

const CardCreator = ({ 
  isOpen, 
  onClose, 
  onSaveCard, 
  profileImage, 
  setProfileImage 
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    businessType: '',
    company: '',
    position: '',
    websiteAddress: '',
    email: '',
    note: ''
  });

  const [frontCardImage, setFrontCardImage] = useState(null);
  const [backCardImage, setBackCardImage] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [addressLocation, setAddressLocation] = useState('');
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [logoSize, setLogoSize] = useState({ width: 60, height: 60 });
  const [backImageSize, setBackImageSize] = useState({ width: 90, height: 90 });
  const [cardColors, setCardColors] = useState({
    front: { ...colorThemes[0] },
    back: { ...colorThemes[3] },
    text: "#FFFFFF"
  });
  const [showThemeDropdown, setShowThemeDropdown] = useState({ 
    front: false, 
    back: false 
  });

  const panelRef = useRef(null);
  const frontImageInputRef = useRef(null);
  const backImageInputRef = useRef(null);
  const frontCardRef = useRef(null);
  const backCardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please upload an image file (JPEG, PNG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setProfileImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleCardImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Please upload an image file (JPEG, PNG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const captureCardImage = async (cardRef) => {
    if (!cardRef.current) return null;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: null
      });
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      console.error("Error capturing card:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const [frontImage, backImage] = await Promise.all([
        captureCardImage(frontCardRef),
        captureCardImage(backCardRef)
      ]);

      if (!frontImage || !backImage) {
        throw new Error("Failed to capture card images");
      }

      const newCard = {
        ...formData,
        frontCardImage: frontImage,
        backCardImage: backImage,
        addressLocation,
        logoSize,
        backImageSize,
        cardColors,
        id: Date.now()
      };

      onSaveCard(newCard);
      onClose();
    } catch (error) {
      console.error("Error saving card:", error);
      alert("Error saving card. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (currentStep === 1 && !formData.fullName.trim()) {
      alert("Please enter your full name");
      return;
    }
    if (currentStep === 2 && !formData.phoneNumber.trim()) {
      alert("Please enter your phone number");
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const selectTheme = (theme, side) => {
    setCardColors(prev => ({
      ...prev,
      [side]: theme,
      text: theme.text || "#FFFFFF" // Fallback to white if undefined
    }));
    setShowThemeDropdown(prev => ({
      ...prev,
      [side]: false
    }));
  };

  const toggleThemeDropdown = (side) => {
    setShowThemeDropdown(prev => ({
      ...prev,
      [side]: !prev[side]
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.visible : ''}`} onClick={onClose} />
      <div className={`${styles.panel} ${isOpen ? styles.visible : ''}`} ref={panelRef}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <input 
          type="file" 
          ref={frontImageInputRef} 
          onChange={(e) => handleCardImageUpload(e, setFrontCardImage)} 
          accept="image/*" 
          hidden 
        />
        <input 
          type="file" 
          ref={backImageInputRef} 
          onChange={(e) => handleCardImageUpload(e, setBackCardImage)} 
          accept="image/*" 
          hidden 
        />

        <div className={styles.container}>
          <div className={styles.previewColumn}>
            <div className={styles.cardsStack}>
              {/* Front Card Preview */}
              <div className={styles.cardContainer}>
                <div className={styles.cardLabel}>Front Side</div>
                <div 
                  className={`${styles.businessCard} ${styles.frontCard}`}
                  ref={frontCardRef}
                  style={{
                    background: `linear-gradient(145deg, ${cardColors.front.primary} 0%, ${cardColors.front.secondary} 100%)`,
                    color: cardColors.front.text || cardColors.text
                  }}
                >
                  <div className={styles.cardContent}>
                    <div className={styles.cardText}>
                      <div className={styles.cardName}>
                        {formData.fullName || <span className={styles.placeholder}>Your Name</span>}
                      </div>
                      <div className={styles.cardPosition}>
                        {formData.position || <span className={styles.placeholder}>Your Position</span>}
                      </div>
                      <div className={styles.cardContact}>
                        <div className={styles.contactItem}>
                          <FaPhone className={styles.contactIcon} />
                          {formData.phoneNumber || <span className={styles.placeholder}>(xxx) xxx-xxxx</span>}
                        </div>
                        <div className={styles.contactItem}>
                          <FaEnvelope className={styles.contactIcon} />
                          {formData.email || <span className={styles.placeholder}>your@email.com</span>}
                        </div>
                        <div className={styles.contactItem}>
                          <FaMapMarkerAlt className={styles.contactIcon} />
                          {addressLocation || <span className={styles.placeholder}>Your Address</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.logoGroup}>
                      {frontCardImage ? (
                        <div className={styles.logoContainer}>
                          <img
                            src={frontCardImage}
                            className={styles.logoImage}
                            style={{ 
                              width: `${logoSize.width}px`, 
                              height: `${logoSize.height}px`
                            }}
                            alt="Company Logo"
                            onClick={() => frontImageInputRef.current.click()}
                          />
                          <div className={styles.companyName}>
                            {formData.company ? 
                              (formData.company.length > 15 ? 
                                `${formData.company.substring(0, 15)}...` : 
                                formData.company) : 
                              <span className={styles.placeholder}>Company</span>}
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={styles.logoContainer} 
                          onClick={() => frontImageInputRef.current.click()}
                        >
                          <div className={styles.logoUpload}>
                            <div className={styles.uploadIcon}>+</div>
                            <div>Add Logo</div>
                          </div>
                          <div className={styles.companyName}>
                            <span className={styles.placeholder}>Company</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Card Preview */}
              <div className={styles.cardContainer}>
                <div className={styles.cardLabel}>Back Side</div>
                <div 
                  className={`${styles.businessCard} ${styles.backCard}`}
                  ref={backCardRef}
                  style={{
                    background: `linear-gradient(145deg, ${cardColors.back.primary} 0%, ${cardColors.back.secondary} 100%)`,
                    color: cardColors.back.text || cardColors.text
                  }}
                >
                  <div className={styles.cardBackContent}>
                    <div className={styles.backContentContainer}>
                      {backCardImage ? (
                        <div className={styles.backLogoContainer}>
                          <img
                            src={backCardImage}
                            className={styles.backLogoPreview}
                            style={{ 
                              width: `${backImageSize.width}px`, 
                              height: `${backImageSize.height}px` 
                            }}
                            alt="Back Design"
                            onClick={() => backImageInputRef.current.click()}
                          />
                        </div>
                      ) : (
                        <div 
                          className={styles.backLogoContainer}
                          onClick={() => backImageInputRef.current.click()}
                        >
                          <div className={styles.backLogoUpload}>
                            <div className={styles.uploadIcon}>+</div>
                            <div>Add Logo</div>
                          </div>
                        </div>
                      )}
                      <div className={styles.backTextContainer}>
                        <div className={styles.companyNameLarge}>
                          {formData.company || <span className={styles.placeholder}>COMPANY NAME</span>}
                        </div>
                        <div className={styles.companyWebsite}>
                          {formData.websiteAddress || <span className={styles.placeholder}>www.company.com</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formColumn}>
            <div className={styles.profileImageHeader}>
              <ProfileImageUpload 
                profileImage={profileImage}
                handleProfileImageUpload={handleProfileImageUpload}
              />
              <p className={styles.uploadHint}>Profile photo (appears in your account header)</p>
            </div>

            <div className={styles.stepGuide}>
              <h2>Create Business Card</h2>

              {currentStep === 1 && (
                <>
                  <p className={styles.step}>
                    <span className={styles.stepNumber}>Step 1:</span> What's your full name?
                  </p>
                  <FormInput
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <ContinueButton
                    onClick={handleContinue}
                    disabled={!formData.fullName.trim()}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <button className={styles.backButton} onClick={handleBack}>
                    <FaChevronLeft className={styles.backIcon} />
                    Back
                  </button>
                  <p className={styles.step}>
                    <span className={styles.stepNumber}>Step 2:</span> What's your phone number?
                  </p>
                  <FormInput
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />

                  <button
                    type="button"
                    className={styles.additionalToggle}
                    onClick={() => setShowAdditionalFields(!showAdditionalFields)}
                  >
                    Additional Info
                    <span className={`${styles.chevron} ${showAdditionalFields ? styles.open : ''}`}>▼</span>
                  </button>

                  {showAdditionalFields && (
                    <div className={styles.additionalFields}>
                      <FormSelect
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        options={[
                          { value: "accounting", label: "Accounting" },
                          { value: "advertising_marketing", label: "Advertising/Marketing" },
                        ]}
                      />
                      <FormInput 
                        type="text" 
                        name="company" 
                        placeholder="Company" 
                        value={formData.company} 
                        onChange={handleInputChange} 
                      />
                      <FormInput 
                        type="text" 
                        name="position" 
                        placeholder="Position" 
                        value={formData.position} 
                        onChange={handleInputChange} 
                      />
                      <FormInput 
                        type="url" 
                        name="websiteAddress" 
                        placeholder="Website" 
                        value={formData.websiteAddress} 
                        onChange={handleInputChange} 
                      />
                      <FormInput 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                      />
                      <FormInput 
                        type="text" 
                        placeholder="Address" 
                        value={addressLocation} 
                        onChange={(e) => setAddressLocation(e.target.value)} 
                      />
                      <button 
                        type="button" 
                        className={styles.mapButton} 
                        onClick={() => setShowMap(!showMap)}
                      >
                        {showMap ? "Hide Map" : "Find on Map"}
                      </button>
                      {showMap && <MapComponent setAddressLocation={setAddressLocation} />}
                      <FormTextarea 
                        name="note" 
                        placeholder="Notes" 
                        value={formData.note} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  )}

                  <ContinueButton
                    onClick={handleContinue}
                    disabled={!formData.phoneNumber.trim()}
                  />
                </>
              )}

              {currentStep === 3 && (
                <>
                  <button className={styles.backButton} onClick={handleBack}>
                    <FaChevronLeft className={styles.backIcon} />
                    Back
                  </button>
                  <p className={styles.step}>
                    <span className={styles.stepNumber}>Step 3:</span> Choose your card colors
                  </p>
                  
                  <div className={styles.themeContainer}>
                    <div className={styles.themeOption}>
                      <label>Front Side Theme</label>
                      <div className={styles.themeDropdownContainer}>
                        <button 
                          className={styles.themeButton}
                          onClick={() => toggleThemeDropdown('front')}
                        >
                          <div className={styles.themePreview}>
                            <div style={{ backgroundColor: cardColors.front.primary }} />
                            <div style={{ backgroundColor: cardColors.front.secondary }} />
                            <div style={{ backgroundColor: cardColors.front.accent }} />
                          </div>
                          <span>{cardColors.front.name}</span>
                          <span className={styles.dropdownArrow}>▼</span>
                        </button>
                        {showThemeDropdown.front && (
                          <div className={styles.themeDropdown}>
                            {colorThemes.map((theme, index) => (
                              <div 
                                key={`front-${index}`}
                                className={styles.themeItem}
                                onClick={() => selectTheme(theme, 'front')}
                              >
                                <div className={styles.themePreview}>
                                  <div style={{ backgroundColor: theme.primary }} />
                                  <div style={{ backgroundColor: theme.secondary }} />
                                  <div style={{ backgroundColor: theme.accent }} />
                                </div>
                                <span>{theme.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.themeOption}>
                      <label>Back Side Theme</label>
                      <div className={styles.themeDropdownContainer}>
                        <button 
                          className={styles.themeButton}
                          onClick={() => toggleThemeDropdown('back')}
                        >
                          <div className={styles.themePreview}>
                            <div style={{ backgroundColor: cardColors.back.primary }} />
                            <div style={{ backgroundColor: cardColors.back.secondary }} />
                            <div style={{ backgroundColor: cardColors.back.accent }} />
                          </div>
                          <span>{cardColors.back.name}</span>
                          <span className={styles.dropdownArrow}>▼</span>
                        </button>
                        {showThemeDropdown.back && (
                          <div className={styles.themeDropdown}>
                            {colorThemes.map((theme, index) => (
                              <div 
                                key={`back-${index}`}
                                className={styles.themeItem}
                                onClick={() => selectTheme(theme, 'back')}
                              >
                                <div className={styles.themePreview}>
                                  <div style={{ backgroundColor: theme.primary }} />
                                  <div style={{ backgroundColor: theme.secondary }} />
                                  <div style={{ backgroundColor: theme.accent }} />
                                </div>
                                <span>{theme.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <SaveButton onClick={handleSubmit}>Save Card</SaveButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardCreator;