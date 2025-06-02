import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';

const Layout = ({ children, profileImage, onProfileClick }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Header 
          profileImage={profileImage} 
          onProfileClick={onProfileClick} 
        />
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;