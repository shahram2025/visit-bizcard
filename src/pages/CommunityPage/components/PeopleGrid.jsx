import React from "react";
import styles from "./PeopleGrid.module.css"; // Changed import

function PeopleGrid({ 
  members, 
  onCardClick,
  peopleCardClassName,
  peopleAvatarContainerClassName,
  peopleAvatarClassName,
  peopleNameClassName,
  peopleProfessionClassName 
}) {
  return (
    <div className={styles.peopleGrid}>
      {members.map((member) => (
        <div 
          key={member.id} 
          className={`${styles.peopleCard} ${peopleCardClassName}`}
          onClick={() => onCardClick(member)}
        >
          <div className={`${styles.peopleAvatarContainer} ${peopleAvatarContainerClassName}`}>
            <img 
              src={member.avatar || "/default-avatar.jpg"} 
              alt={member.name}
              className={`${styles.peopleAvatar} ${peopleAvatarClassName}`}
            />
          </div>
          <h3 className={`${styles.peopleName} ${peopleNameClassName}`}>
            {member.fullName || member.name}
          </h3>
          {member.businessType && (
            <p className={`${styles.peopleProfession} ${peopleProfessionClassName}`}>
              {member.businessType}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default PeopleGrid;