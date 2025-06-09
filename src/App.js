import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import CommunityPage from "./pages/CommunityPage/CommunityPage";
import BlankPage from "./pages/BlankPage/BlankPage";
import SitPage from "./pages/SitPage/SitPage";
import ThirdeyePage from "./pages/ThirdeyePage/ThirdeyePage";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import AuthForm from "./components/AuthForm";

const defaultProfileImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394a3b8' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3a3 3 0 110 6 3 3 0 010-6zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

// Inline Loading Component (temporary solution)
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  }}>
    <div style={{
      border: '4px solid rgba(0, 0, 0, 0.1)',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      borderLeftColor: '#09f',
      animation: 'spin 1s linear infinite'
    }}></div>
  </div>
);

// Inline Auth Layout Component (temporary solution)
const AuthLayout = ({ children }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px'
  }}>
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px'
    }}>
      {children}
    </div>
  </div>
);

function App() {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Handle auth state changes
  useEffect(() => {
    setLoading(true);
    
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Session check error:", error);
        setAuthError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Clear error on successful auth
      if (event === "SIGNED_IN") {
        setAuthError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      setAuthError(error.message);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="app">
        {user ? (
          <Layout
            profileImage={profileImage}
            onProfileClick={() => setShowUserProfile(true)}
            onLogout={handleLogout}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <HomePage
                      showUserProfile={showUserProfile}
                      setShowUserProfile={setShowUserProfile}
                      profileImage={profileImage}
                      setProfileImage={setProfileImage}
                      user={user}
                    />
                  </ErrorBoundary>
                }
              />
              <Route 
                path="/community" 
                element={
                  <ErrorBoundary>
                    <CommunityPage user={user} />
                  </ErrorBoundary>
                } 
              />
              <Route path="/blank" element={<ErrorBoundary><BlankPage /></ErrorBoundary>} />
              <Route path="/sit" element={<ErrorBoundary><SitPage /></ErrorBoundary>} />
              <Route path="/thirdeye" element={<ErrorBoundary><ThirdeyePage /></ErrorBoundary>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        ) : (
          <AuthLayout>
            <Routes>
              <Route 
                path="/login" 
                element={<AuthForm authError={authError} setAuthError={setAuthError} />} 
              />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </AuthLayout>
        )}
      </div>
    </Router>
  );
}

export default App;