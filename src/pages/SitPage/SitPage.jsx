import React, { useState, useCallback } from "react";
import FloatingUser from "./components/FloatingUser";
import AddContactPanel from "../../components/UserProfile/AddContactPanel";
import PlusIcon from "./components/PlusIcon";
import "./SitPage.css";

const SitPage = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const handlePlusIconClick = useCallback(() => {
    setIsPanelOpen(true);
  }, []);

  const handleAddMember = useCallback((memberData) => {
    if (!memberData) return;

    const newUser = {
      id: Date.now().toString(),
      fullName: memberData.fullName || 'New Member',
      mobileNumber: memberData.phoneNumber || '',
      photo: memberData.profileImage || null,
      frontImage: memberData.frontCardImage || null,
      backImage: memberData.backCardImage || null,
      position: {
        x: Math.random() * 70,
        y: Math.random() * 70
      }
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    setIsPanelOpen(false);
  }, []);

  const handleRemoveUser = useCallback((userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  }, []);

  const handlePositionChange = useCallback((userId, newPosition) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, position: newPosition } : user
      )
    );
  }, []);

  return (
    <div className="sit-page-container">
      <header className="room-header">
        <h1 className="room-title">Room</h1>
        <p className="room-subtitle">Who is in the room?</p>
      </header>

      <div className="floating-users-container">
        {users.map(user => (
          <FloatingUser
            key={user.id}
            user={user}
            onRemove={handleRemoveUser}
            onPositionChange={handlePositionChange}
          />
        ))}
      </div>

      <PlusIcon onClick={handlePlusIconClick} />

      <AddContactPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
};

export default SitPage;