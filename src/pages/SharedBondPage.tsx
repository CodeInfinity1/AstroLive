import { useNavigate, useParams } from 'react-router-dom';
import { calculateCompatibility, generateProfile, getBondDailyInsight, getZodiacSymbol } from '../engine/vedic';
import ScoreRing from '../components/ScoreRing';
import { findOrCreateBond, getUserProfile, setPendingInvite } from '../store/storage';
import { decodePayload, inviteToBirth, type SharedBondPayload } from '../store/share';
import './BondResultPage.css';
import './SharedBondPage.css';

interface SharedBondPageProps {
  onProfileRefresh: () => void;
}

export default function SharedBondPage({ onProfileRefresh }: SharedBondPageProps) {
  const { token } = useParams();
  const navigate = useNavigate();
  const payload = token ? decodePayload<SharedBondPayload>(token) : null;
  const user = getUserProfile();

  if (!payload?.a?.name || !payload?.b?.name) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '30vh' }}>
          <p>This Bond Card link is invalid.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Nakshatra</button>
        </div>
      </div>
    );
  }

  const profileA = generateProfile(inviteToBirth(payload.a));
  const profileB = generateProfile(inviteToBirth(payload.b));
  const compatibility = calculateCompatibility(profileA, profileB);
  const dailyInsight = getBondDailyInsight(profileA, profileB);

  const handleJoin = () => {
    if (user) {
      const other = user.birthData.name === payload.a.name ? payload.b : payload.a;
      const bond = findOrCreateBond(user, inviteToBirth(other), 'friend', { countTowardLimit: false });
      onProfileRefresh();
      navigate(`/bond-result/${bond.id}`);
      return;
    }
    setPendingInvite(inviteToBirth(payload.a));
    navigate('/onboarding');
  };

  return (
    <div className="page bond-result-page shared-bond-page">
      <div className="container">
        <p className="shared-kicker">Shared Bond Card · Nakshatra by AstroLive</p>

        <div className="bond-card">
          <div className="bond-card-bg" />
          <div className="bond-card-inner">
            <span className="bond-card-logo">NAKSHATRA</span>
            <div className="bond-card-profiles">
              <div className="bond-profile">
                <div className="bond-avatar bond-avatar-1">{profileA.birthData.name.charAt(0)}</div>
                <span className="bond-profile-name">{profileA.birthData.name}</span>
                <span className="bond-profile-sign">{getZodiacSymbol(profileA.moonSign)} {profileA.moonSign}</span>
              </div>
              <div className="bond-score-center">
                <ScoreRing score={compatibility.overallScore} size={100} fontSize="1.5rem" />
                <span className="bond-type-label">{compatibility.bondType}</span>
              </div>
              <div className="bond-profile">
                <div className="bond-avatar bond-avatar-2">{profileB.birthData.name.charAt(0)}</div>
                <span className="bond-profile-name">{profileB.birthData.name}</span>
                <span className="bond-profile-sign">{getZodiacSymbol(profileB.moonSign)} {profileB.moonSign}</span>
              </div>
            </div>
            <p className="bond-description">{compatibility.bondDescription}</p>
            <div className="bond-guna">
              <div className="bond-guna-header">
                <span>Ashtakoota Guna Milan</span>
                <span className="bond-guna-score">{compatibility.gunaScore}/{compatibility.maxGuna}</span>
              </div>
              <div className="bond-guna-bar">
                <div className="bond-guna-fill" style={{ width: `${(compatibility.gunaScore / compatibility.maxGuna) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bond-daily">
          <span className="bond-daily-label">Today's Bond Forecast</span>
          <p className="bond-daily-text">{dailyInsight}</p>
        </div>

        <div className="shared-cta card card-accent">
          <h2>What would your Bond Card look like?</h2>
          <p>Create your Vedic profile and check this bond — or invite someone of your own. That’s how Nakshatra grows.</p>
          <button className="btn btn-primary btn-full btn-lg" onClick={handleJoin}>
            {user ? 'Save this bond to my circle' : 'Get my cosmic profile — free'}
          </button>
        </div>
      </div>
    </div>
  );
}
