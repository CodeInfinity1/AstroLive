import { useNavigate, useParams } from 'react-router-dom';
import { generateProfile, getZodiacSymbol } from '../engine/vedic';
import { findOrCreateBond, getUserProfile, setPendingInvite } from '../store/storage';
import { decodePayload, inviteToBirth, type InvitePayload } from '../store/share';
import './InvitePage.css';

interface InvitePageProps {
  onProfileRefresh: () => void;
}

export default function InvitePage({ onProfileRefresh }: InvitePageProps) {
  const { token } = useParams();
  const navigate = useNavigate();
  const payload = token ? decodePayload<InvitePayload>(token) : null;
  const user = getUserProfile();

  if (!payload || !payload.name || !payload.date) {
    return (
      <div className="page invite-page">
        <div className="container invite-empty">
          <h1>This invite has expired</h1>
          <p>Ask your friend to send a fresh Bond invite, or create your own cosmic profile.</p>
          <button className="btn btn-primary" onClick={() => navigate(user ? '/compatibility' : '/onboarding')}>
            {user ? 'Check a bond' : 'Create your profile'}
          </button>
        </div>
      </div>
    );
  }

  const inviter = generateProfile(inviteToBirth(payload));
  const isSelf = user && user.birthData.date === payload.date && user.birthData.name === payload.name;

  const handleAccept = () => {
    if (isSelf) {
      navigate('/compatibility');
      return;
    }
    if (user) {
      const bond = findOrCreateBond(user, inviteToBirth(payload), 'friend', { countTowardLimit: false });
      onProfileRefresh();
      navigate(`/bond-result/${bond.id}`);
      return;
    }
    setPendingInvite(inviteToBirth(payload));
    navigate('/onboarding');
  };

  return (
    <div className="page invite-page">
      <div className="invite-ambient" />
      <div className="container">
        <header className="invite-brand">
          <span>◎ NAKSHATRA</span>
          <span>by AstroLive</span>
        </header>

        <div className="invite-card">
          <p className="invite-kicker">{payload.name} invited you</p>
          <h1>
            See your cosmic bond with <span className="text-gradient">{payload.name}</span>
          </h1>
          <p className="invite-sub">
            They already have a Vedic profile. Enter yours (takes 30 seconds) and both of you get an Ashtakoota Bond Card.
          </p>

          <div className="invite-person">
            <div className="invite-avatar">{payload.name.charAt(0)}</div>
            <div>
              <strong>{payload.name}</strong>
              <span>
                {getZodiacSymbol(inviter.moonSign)} {inviter.moonSign} moon · {inviter.nakshatra}
              </span>
            </div>
          </div>

          <button className="btn btn-primary btn-full btn-lg" onClick={handleAccept}>
            {user && !isSelf
              ? `Reveal our Bond Card ✦`
              : isSelf
                ? 'This is your invite — check someone else'
                : 'Enter my birth details →'}
          </button>
          <p className="invite-note">Free · No sign-up · They won’t see your chart until you generate the bond</p>
        </div>
      </div>
    </div>
  );
}
