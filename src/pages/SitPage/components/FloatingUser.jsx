import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './FloatingUser.css';

const FloatingUser = ({ user, onRemove, onPositionChange }) => {
  const userRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [position, setPosition] = useState(() => ({
    x: user.position?.x || Math.random() * 70,
    y: user.position?.y || Math.random() * 70
  }));

  // Update position when prop changes
  useEffect(() => {
    if (user.position) {
      setPosition(user.position);
    }
  }, [user.position]);

  // Notify parent of position changes after dragging
  useEffect(() => {
    if (!isDragging && onPositionChange) {
      onPositionChange(user.id, position);
    }
  }, [isDragging, position, user.id, onPositionChange]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Only left click
    
    const rect = userRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setIsDragging(true);

    const handleMouseMove = (e) => {
      const container = document.querySelector('.floating-users-container');
      if (!container || !userRef.current) return;

      const containerRect = container.getBoundingClientRect();
      const newX = ((e.clientX - containerRect.left - offsetX) / containerRect.width) * 100;
      const newY = ((e.clientY - containerRect.top - offsetY) / containerRect.height) * 100;

      setPosition({
        x: Math.max(0, Math.min(newX, 90)),
        y: Math.max(0, Math.min(newY, 90))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setShowContextMenu(true);
  }, []);

  const handleRemove = useCallback(() => {
    onRemove(user.id);
    setShowContextMenu(false);
  }, [onRemove, user.id]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    const rect = userRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    setIsDragging(true);

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const container = document.querySelector('.floating-users-container');
      if (!container || !userRef.current) return;

      const containerRect = container.getBoundingClientRect();
      const newX = ((touch.clientX - containerRect.left - offsetX) / containerRect.width) * 100;
      const newY = ((touch.clientY - containerRect.top - offsetY) / containerRect.height) * 100;

      setPosition({
        x: Math.max(0, Math.min(newX, 90)),
        y: Math.max(0, Math.min(newY, 90))
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={userRef}
      className={`floating-user ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: isDragging ? 'translate3d(0, 0, 0) scale(1.05)' : 'translate3d(0, 0, 0)'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onContextMenu={handleContextMenu}
      data-user-id={user.id}
    >
      {user.photo ? (
        <img 
          src={user.photo} 
          alt={user.fullName} 
          className="user-photo" 
          loading="lazy"
          draggable="false"
        />
      ) : (
        <div className="default-avatar">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="user-name">{user.fullName}</span>

      {showContextMenu && (
        <div className="user-context-menu">
          <button onClick={handleRemove}>
            <span className="icon">×</span> Remove
          </button>
          <button onClick={() => setShowContextMenu(false)}>
            <span className="icon">↩</span> Cancel
          </button>
        </div>
      )}
    </div>
  );
};

FloatingUser.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    photo: PropTypes.string,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onPositionChange: PropTypes.func
};

FloatingUser.defaultProps = {
  onPositionChange: () => {}
};

export default FloatingUser;