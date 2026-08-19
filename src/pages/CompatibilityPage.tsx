import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VedicProfile, BirthData } from '../engine/vedic';
import { generateProfile, calculateCompatibility } from '../engine/vedic';
import { saveBond, getBonds, getCompatibilityCount, incrementCompatibilityCount, isPremium } from '../store/storage';
import type { Bond } from '../store/storage';
import { birthToInvite, copyText, inviteUrl, shareOrCopy } from '../store/share';
import './CompatibilityPage.css';

interface CompatibilityPageProps {
  userProfile: VedicProfile;
}

const RELATIONSHIP_LABELS: { value: Bond['label']; label: string; icon: string }[] = [
  { value: 'partner', label: 'Partner', icon: '💕' },
  { value: 'crush', label: 'Crush', icon: '✨' },
  { value: 'friend', label: 'Friend', icon: '🤝' },
  { value: 'family', label: 'Family', icon: '🏠' },
  { value: 'colleague', label: 'Colleague', icon: '💼' },
  { value: 'other', label: 'Other', icon: '◎' },
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
];

export default function CompatibilityPage({ userProfile }: CompatibilityPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BirthData>({
    name: '',
    date: '',
    time: '12:00',
    place: '',
  });
  const [label, setLabel] = useState<Bond['label']>('friend');
  const [loading, setLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  const FREE_LIMIT = 3;
  const count = getCompatibilityCount();
  const premium = isPremium();
  const remaining = premium ? '∞' : Math.max(0, FREE_LIMIT - count);

  const handleCheck = async () => {
    if (!formData.name || !formData.date || !formData.place) return;
    
    // Check free limit
    if (!premium && count >= FREE_LIMIT) {
      setShowLimitModal(true);
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const otherProfile = generateProfile(formData);
    const compatibility = calculateCompatibility(userProfile, otherProfile);
    
    const bond: Bond = {
      id: `bond_${Date.now()}`,
      profile: otherProfile,
      compatibility,
      createdAt: new Date().toISOString(),
      label,
    };
    
    saveBond(bond);
    incrementCompatibilityCount();
    setLoading(false);
    navigate(`/bond-result/${bond.id}`);
  };

  const canSubmit = formData.name.trim().length >= 2 && formData.date !== '' && formData.place !== '';

  if (loading) {
    return (
      <div className="page compatibility-page">
        <div className="container">
          <div className="compat-loading">
            <div className="compat-loading-visual">
              <div className="compat-orb compat-orb-1">
                <span>{userProfile.birthData.name.charAt(0)}</span>
              </div>
              <div className="compat-connecting">
                <div className="compat-beam" />
                <span className="compat-connecting-icon">✦</span>
              </div>
              <div className="compat-orb compat-orb-2">
                <span>{formData.name.charAt(0)}</span>
              </div>
            </div>
            <h2 className="compat-loading-title">Aligning your cosmic energies</h2>
            <p className="compat-loading-sub">
              Analyzing the bond between {userProfile.birthData.name} and {formData.name}...
            </p>
            <div className="compat-loading-steps">
              <span>Comparing Nakshatras...</span>
              <span>Calculating Ashtakoota Guna Milan...</span>
              <span>Analyzing planetary friendships...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page compatibility-page">
      <div className="container">
        <div className="compat-header">
          <h1>Check Compatibility</h1>
          <span className="compat-remaining badge badge-accent">
            {remaining} check{remaining !== 1 ? 's' : ''} left
          </span>
        </div>
        
        <p className="compat-desc">
          Enter someone's birth details to discover your Vedic cosmic compatibility using the ancient Ashtakoota system.
        </p>

        {/* Your profile mini card */}
        <div className="compat-you">
          <div className="compat-you-avatar">{userProfile.birthData.name.charAt(0)}</div>
          <div>
            <span className="compat-you-label">You</span>
            <span className="compat-you-name">{userProfile.birthData.name} · {userProfile.moonSign}</span>
          </div>
          <span className="compat-you-check">✦</span>
        </div>

        <div className="compat-divider">
          <span>checking with</span>
        </div>

        {/* Relationship type */}
        <div className="compat-labels">
          {RELATIONSHIP_LABELS.map(rl => (
            <button
              key={rl.value}
              className={`compat-label-btn ${label === rl.value ? 'active' : ''}`}
              onClick={() => setLabel(rl.value)}
            >
              <span>{rl.icon}</span>
              <span>{rl.label}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="compat-form">
          <div className="input-group">
            <label className="input-label">Their Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter their name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Date of Birth</label>
            <input
              type="date"
              className="input-field"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              min="1940-01-01"
            />
          </div>
          
          <div className="compat-form-row">
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Birth Time</label>
              <input
                type="time"
                className="input-field"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Birth Place</label>
              <input
                type="text"
                className="input-field"
                placeholder="City"
                value={formData.place}
                onChange={e => setFormData({ ...formData, place: e.target.value })}
                list="compat-cities"
              />
              <datalist id="compat-cities">
                {CITIES.map(city => <option key={city} value={city} />)}
              </datalist>
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-full btn-lg compat-submit"
          disabled={!canSubmit}
          onClick={handleCheck}
        >
          Reveal Cosmic Bond ✦
        </button>

        {/* Invite alternative */}
        <div className="compat-invite">
          <p>Don't know their birth details?</p>
          <p className="compat-invite-hint">Send a personal invite. They enter their details and both of you get the Bond Card — no guessing required.</p>
          <button className="btn btn-secondary btn-full" onClick={async () => {
            const url = inviteUrl(birthToInvite(userProfile.birthData));
            const result = await shareOrCopy(
              `${userProfile.birthData.name} wants to see your cosmic bond`,
              `${userProfile.birthData.name} invited you to reveal your Vedic Bond Card on Nakshatra.`,
              url
            );
            if (result === 'copied') {
              setInviteCopied(true);
              setTimeout(() => setInviteCopied(false), 2000);
            }
          }}>
            {inviteCopied ? 'Invite link copied' : 'Send them a Bond invite →'}
          </button>
          <button className="btn btn-ghost btn-full" onClick={async () => {
            const url = inviteUrl(birthToInvite(userProfile.birthData));
            await copyText(url);
            setInviteCopied(true);
            setTimeout(() => setInviteCopied(false), 2000);
          }}>
            Copy invite link
          </button>
        </div>

        {/* Previous bonds */}
        {getBonds().length > 0 && (
          <div className="compat-previous">
            <h3 className="compat-previous-title">Recent Bonds</h3>
            {getBonds().slice(-3).reverse().map(bond => (
              <button
                key={bond.id}
                className="compat-previous-item"
                onClick={() => navigate(`/bond/${bond.id}`)}
              >
                <div className="compat-prev-avatar">{bond.profile.birthData.name.charAt(0)}</div>
                <div className="compat-prev-info">
                  <span className="compat-prev-name">{bond.profile.birthData.name}</span>
                  <span className="compat-prev-type">{bond.label} · {bond.compatibility.overallScore}% compatible</span>
                </div>
                <span className="compat-prev-arrow">→</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Limit modal */}
      {showLimitModal && (
        <div className="modal-overlay" onClick={() => setShowLimitModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="modal-icon">✦</span>
            <h2>Free checks used</h2>
            <p>You've used all {FREE_LIMIT} free compatibility checks. Upgrade to Premium for unlimited checks, deep reports, and more.</p>
            <button className="btn btn-primary btn-full" onClick={() => { setShowLimitModal(false); navigate('/premium'); }}>
              Upgrade to Premium — ₹199/mo
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => setShowLimitModal(false)}>
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
