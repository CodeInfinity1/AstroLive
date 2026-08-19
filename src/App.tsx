import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import CompatibilityPage from './pages/CompatibilityPage';
import BondResultPage from './pages/BondResultPage';
import BondsPage from './pages/BondsPage';
import BondDetailPage from './pages/BondDetailPage';
import PremiumPage from './pages/PremiumPage';
import InvitePage from './pages/InvitePage';
import SharedBondPage from './pages/SharedBondPage';
import ReportPage from './pages/ReportPage';
import BottomNav from './components/BottomNav';
import { getUserProfile } from './store/storage';
import type { VedicProfile } from './engine/vedic';

function App() {
  const [userProfile, setUserProfile] = useState<VedicProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
    setLoaded(true);
  }, []);

  const refreshProfile = () => {
    setUserProfile(getUserProfile());
  };

  if (!loaded) return null;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={userProfile ? <Navigate to="/profile" replace /> : <LandingPage />}
        />
        <Route
          path="/onboarding"
          element={<OnboardingPage onComplete={refreshProfile} />}
        />
        <Route
          path="/profile"
          element={userProfile ? <ProfilePage profile={userProfile} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/compatibility"
          element={userProfile ? <CompatibilityPage userProfile={userProfile} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/bond-result/:bondId"
          element={userProfile ? <BondResultPage userProfile={userProfile} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/bonds"
          element={userProfile ? <BondsPage userProfile={userProfile} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/bond/:bondId"
          element={userProfile ? <BondDetailPage userProfile={userProfile} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/premium"
          element={<PremiumPage />}
        />
        <Route
          path="/invite/:token"
          element={<InvitePage onProfileRefresh={refreshProfile} />}
        />
        <Route
          path="/shared/:token"
          element={<SharedBondPage onProfileRefresh={refreshProfile} />}
        />
        <Route
          path="/report/:type"
          element={userProfile ? <ReportPage /> : <Navigate to="/" replace />}
        />
      </Routes>
      {userProfile && <BottomNav />}
    </>
  );
}

export default App;
