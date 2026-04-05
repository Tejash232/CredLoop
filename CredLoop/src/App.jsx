import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import ListingDetailPage from './pages/ListingDetailPage';
import ProfilePage from './pages/ProfilePage';
import CreateListingPage from './pages/CreateListingPage';
import RequestsPage from './pages/RequestsPage';
import LeaderboardPage from './pages/LeaderboardPage';

function ProtectedRoute({ children }) {
  const { currentUser } = useApp();
  return currentUser ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { currentUser, notification } = useApp();

  return (
    <div className="min-h-screen bg-brand-black">
      {notification && <Notification {...notification} />}
      {currentUser && <Navbar />}
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
        <Route path="/listing/:id" element={<ProtectedRoute><ListingDetailPage /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateListingPage /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
