import React, { useState, useEffect } from "react";
import ComoSection from "./components/ComoSection";
import Filters from "./components/Filters";
import SearchBar from "./components/SearchBar";
import CardGrid from "./components/CardGrid";
import PeopleGrid from "./components/PeopleGrid";
import AddContactPanel from "../../components/UserProfile/AddContactPanel";
import DetailModal from "./components/DetailModal";
import styles from "./CommunityPage.module.css";

function CommunityPage() {
  const [activeTab, setActiveTab] = useState("business");
  const [members, setMembers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [availableProfessions, setAvailableProfessions] = useState(() => {
    const saved = localStorage.getItem('communityProfessions');
    return saved ? JSON.parse(saved) : [
      "Technology", "Finance", "Healthcare", "Education",
      "Real Estate", "Marketing", "Design", "Engineering"
    ];
  });

  // Load members from localStorage
  useEffect(() => {
    const loadMembers = () => {
      const savedMembers = localStorage.getItem('communityMembers');
      if (savedMembers) {
        try {
          const parsedMembers = JSON.parse(savedMembers);
          const validatedMembers = parsedMembers.map(member => ({
            id: member.id || Date.now(),
            fullName: member.fullName || "No Name",
            businessType: member.businessType || "No Profession",
            frontCardImage: member.frontCardImage || null,
            avatar: member.avatar || "/default-avatar.jpg",
            contact: member.contact || "",
            ...member
          }));
          setMembers(validatedMembers);
        } catch (error) {
          console.error("Failed to parse members:", error);
          setMembers([]);
        }
      }
    };
    loadMembers();
  }, []);

  // Save data to localStorage when changes occur
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem('communityMembers', JSON.stringify(members));
        localStorage.setItem('communityProfessions', JSON.stringify(availableProfessions));
      } catch (error) {
        console.error("Failed to save data:", error);
      }
    };
    saveData();
  }, [members, availableProfessions]);

  const addMember = (newMember) => {
    const memberWithDefaults = {
      ...newMember,
      id: Date.now(),
      frontCardImage: newMember.frontCardImage || null,
      avatar: newMember.avatar || "/default-avatar.jpg",
      contact: newMember.contact || newMember.phoneNumber || "",
      timestamp: newMember.timestamp || new Date().toISOString()
    };

    setMembers(prev => [...prev, memberWithDefaults]);

    if (newMember.businessType && !availableProfessions.includes(newMember.businessType)) {
      setAvailableProfessions(prev => [...prev, newMember.businessType]);
    }
  };

  const handleNewProfession = (profession) => {
    if (profession && !availableProfessions.includes(profession)) {
      setAvailableProfessions(prev => [...prev, profession]);
    }
  };

  const openDetailModal = (member) => {
    setSelectedMember(member);
  };

  return (
    <div className={styles.communityPage}>
      <main>
        <ComoSection memberCount={members.length} />
        
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${activeTab === 'business' ? styles.active : ''}`}
            onClick={() => setActiveTab('business')}
          >
            Business Cards
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'people' ? styles.active : ''}`}
            onClick={() => setActiveTab('people')}
          >
            People
          </button>
        </div>

        <div className={styles.filtersContainer}>
          <Filters 
            activeFilter={activeFilter} 
            setActiveFilter={setActiveFilter}
            availableCategories={availableProfessions}
          />
          <SearchBar />
        </div>

        <div className={styles.cardGridContainer}>
          {activeTab === 'business' ? (
            <CardGrid
              members={activeFilter === "All" 
                ? members 
                : members.filter(m => m.businessType === activeFilter)}
              onAddCardClick={() => setIsAddPanelOpen(true)}
              onCardClick={openDetailModal}
              cardClassName={styles.communityCard}
              cardAvatarClassName={styles.cardAvatar}
              cardNameClassName={styles.cardName}
              cardProfessionClassName={styles.cardProfession}
              cardDividerClassName={styles.cardDivider}
              cardContactClassName={styles.cardContact}
              addCardClassName={styles.addCard}
              addCardIconClassName={styles.addCardIcon}
            />
          ) : (
            <PeopleGrid
              members={activeFilter === "All" 
                ? members 
                : members.filter(m => m.businessType === activeFilter)}
              onCardClick={openDetailModal}
              peopleCardClassName={styles.peopleCard}
              peopleAvatarContainerClassName={styles.peopleAvatarContainer}
              peopleAvatarClassName={styles.peopleAvatar}
              peopleNameClassName={styles.peopleName}
              peopleProfessionClassName={styles.peopleProfession}
            />
          )}
        </div>
      </main>

      <AddContactPanel
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
        onAddMember={addMember}
        onNewProfession={handleNewProfession}
      />

      {selectedMember && (
        <DetailModal 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)}
          modalClassName={styles.detailModal}
          modalHeaderClassName={styles.modalHeader}
          modalContentClassName={styles.modalContent}
        />
      )}
    </div>
  );
}

export default CommunityPage;