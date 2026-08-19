import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateProfile } from '../engine/vedic';
import type { BirthData } from '../engine/vedic';
import { consumePendingInvite, findOrCreateBond, peekPendingInvite, saveUserProfile, setOnboarded } from '../store/storage';
import './OnboardingPage.css';

interface OnboardingPageProps {
  onComplete: () => void;
}

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Surat', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Chandigarh', 'Coimbatore', 'Kochi'
];

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<BirthData>({
    name: '',
    date: '',
    time: '',
    place: '',
    gender: undefined,
  });
  const [loading, setLoading] = useState(false);
  const pendingInvite = peekPendingInvite();

  const handleSubmit = async () => {
    if (!formData.name || !formData.date || !formData.time || !formData.place) return;
    
    setLoading(true);
    
    // Simulate calculation time for UX feel
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const profile = generateProfile(formData);
    saveUserProfile(profile);
    setOnboarded(true);

    const pending = consumePendingInvite();
    
    setLoading(false);
    onComplete();

    if (pending && !(pending.name === profile.birthData.name && pending.date === profile.birthData.date)) {
      const bond = findOrCreateBond(profile, pending, 'friend', { countTowardLimit: false });
      navigate(`/bond-result/${bond.id}`);
      return;
    }

    navigate('/profile');
  };

  const canProceed = () => {
    switch (step) {
      case 0: return formData.name.trim().length >= 2;
      case 1: return formData.date !== '';
      case 2: return formData.time !== '';
      case 3: return formData.place !== '';
      default: return false;
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  if (loading) {
    return (
      <div className="page onboarding-page">
        <div className="container">
          <div className="onboarding-loading">
            <div className="loading-orbit">
              <div className="loading-ring" />
              <div className="loading-ring loading-ring-2" />
              <div className="loading-center">✦</div>
            </div>
            <h2 className="loading-title">Calculating your cosmic profile</h2>
            <p className="loading-subtitle">
              Analyzing planetary positions at the moment of your birth...
            </p>
            <div className="loading-steps">
              <div className="loading-step active">
                <span className="loading-check">✓</span>
                Mapping Nakshatra position
              </div>
              <div className="loading-step active">
                <span className="loading-check">✓</span>
                Calculating Moon sign
              </div>
              <div className="loading-step">
                <span className="loading-dot" />
                Generating personality traits
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page onboarding-page">
      <div className="container">
        {/* Progress */}
        <div className="onboarding-progress">
          <button className="onboarding-back" onClick={() => step > 0 ? setStep(step - 1) : navigate('/')}>
            ←
          </button>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((step + 1) / 4) * 100}%` }} />
          </div>
          <span className="progress-text">{step + 1}/4</span>
        </div>

        {pendingInvite && (
          <div className="card card-accent" style={{ marginBottom: 'var(--space-lg)', padding: '12px 16px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              After this, you’ll see your Bond Card with <strong style={{ color: 'var(--text-primary)' }}>{pendingInvite.name}</strong>.
            </p>
          </div>
        )}

        {/* Steps */}
        <div className="onboarding-content" key={step}>
          {step === 0 && (
            <div className="onboarding-step">
              <div className="step-emoji">✨</div>
              <h1 className="onboarding-title">What should we call you?</h1>
              <p className="onboarding-desc">This is how you'll appear on your Bond Cards</p>
              <div className="input-group">
                <input
                  type="text"
                  className="input-field onboarding-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && canProceed() && nextStep()}
                />
              </div>
              
              {/* Gender (optional) */}
              <div className="gender-select">
                {(['female', 'male', 'other'] as const).map(g => (
                  <button
                    key={g}
                    className={`gender-btn ${formData.gender === g ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, gender: g })}
                  >
                    {g === 'female' ? '♀' : g === 'male' ? '♂' : '⚧'} {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="onboarding-step">
              <div className="step-emoji">📅</div>
              <h1 className="onboarding-title">When were you born?</h1>
              <p className="onboarding-desc">Your birth date determines your Sun sign and planetary positions</p>
              <div className="input-group">
                <input
                  type="date"
                  className="input-field onboarding-input"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  autoFocus
                  max={new Date().toISOString().split('T')[0]}
                  min="1940-01-01"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="onboarding-step">
              <div className="step-emoji">🕐</div>
              <h1 className="onboarding-title">What time were you born?</h1>
              <p className="onboarding-desc">Birth time determines your Ascendant (Lagna) — the most personalized part of your chart</p>
              <div className="input-group">
                <input
                  type="time"
                  className="input-field onboarding-input"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  autoFocus
                />
              </div>
              <p className="onboarding-hint">
                Don't know exact time? Check your birth certificate or ask a family member. An approximate time still works.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="onboarding-step">
              <div className="step-emoji">📍</div>
              <h1 className="onboarding-title">Where were you born?</h1>
              <p className="onboarding-desc">Birth location affects planetary house positions in your chart</p>
              <div className="input-group">
                <input
                  type="text"
                  className="input-field onboarding-input"
                  placeholder="Enter your birth city"
                  value={formData.place}
                  onChange={e => setFormData({ ...formData, place: e.target.value })}
                  autoFocus
                  list="cities"
                  onKeyDown={e => e.key === 'Enter' && canProceed() && nextStep()}
                />
                <datalist id="cities">
                  {INDIAN_CITIES.map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
              <div className="city-suggestions">
                {INDIAN_CITIES.slice(0, 8).map(city => (
                  <button
                    key={city}
                    className={`city-chip ${formData.place === city ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, place: city })}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Continue button */}
        <div className="onboarding-footer">
          <button
            className="btn btn-primary btn-full btn-lg"
            disabled={!canProceed()}
            onClick={nextStep}
          >
            {step < 3 ? 'Continue' : 'Generate My Cosmic Profile ✦'}
          </button>
        </div>
      </div>
    </div>
  );
}
