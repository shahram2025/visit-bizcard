import React, { useState } from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import CTASection from './components/CTASection/CTASection';
import BusinessCardDisplay from './components/BusinessCardDisplay/BusinessCardDisplay';
import CustomerReview from './components/CustomerReview/CustomerReview';
import CardCreator from '../../components/UserProfile/CardCreator';
import UserProfile from '../../components/UserProfile/UserProfile';
import styles from './HomePage.module.css';

const HomePage = ({ 
  showUserProfile, 
  setShowUserProfile,
  profileImage,
  setProfileImage 
}) => {
  const [isCardCreatorOpen, setIsCardCreatorOpen] = useState(false);
  const [cardData, setCardData] = useState(null);

  const handleSaveCard = (card) => {
    setCardData(card);
    setIsCardCreatorOpen(false);
  };

  return (
    <main className={styles.homePage}>
      {/* All sections remain unchanged */}
      <HeroSection />
      <CTASection 
        onCreateCard={() => setIsCardCreatorOpen(true)}
        onUploadScan={() => setShowUserProfile(true)}
      />
      <BusinessCardDisplay 
        frontImage={cardData?.frontCardImage || null}
        backImage={cardData?.backCardImage || null}
      />
      <CustomerReview />

      {/* Card Creator */}
      <CardCreator 
        isOpen={isCardCreatorOpen}
        onClose={() => setIsCardCreatorOpen(false)}
        onSaveCard={handleSaveCard}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
      />
      
      {/* User Profile Panel - Corrected Props */}
      {showUserProfile && (
        <UserProfile
          onClose={() => setShowUserProfile(false)}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          setFrontImage={(img) => setCardData(prev => ({...prev, frontCardImage: img}))}
          setBackImage={(img) => setCardData(prev => ({...prev, backCardImage: img}))}
        />
      )}
    </main>
  );
};

export default HomePage;