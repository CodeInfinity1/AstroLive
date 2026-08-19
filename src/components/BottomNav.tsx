import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css';

const NAV_ITEMS = [
  { path: '/profile', label: 'Profile', icon: '◎' },
  { path: '/bonds', label: 'Bonds', icon: '⬡' },
  { path: '/compatibility', label: 'Check', icon: '✦' },
  { path: '/premium', label: 'Premium', icon: '◆' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  
  if (
    location.pathname === '/' ||
    location.pathname === '/onboarding' ||
    location.pathname.startsWith('/invite') ||
    location.pathname.startsWith('/shared')
  ) return null;
  
  return (
    <nav className="nav-bottom">
      <div className="nav-bottom-inner">
        {NAV_ITEMS.map(item => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
