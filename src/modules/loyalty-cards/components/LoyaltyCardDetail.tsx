import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// [2024-05-10 17:15 UTC] - Multiple loyalty card variations for different businesses
const loyaltyCardVariations = {
  'cafe-aroma': {
    id: '1',
    businessName: 'Cafe Aroma',
    stampsCollected: 4,
    stampsRequired: 10,
    prize: 'Free Coffee',
    terms: 'Collect 10 stamps to get a free coffee. One stamp per visit. Not valid with other offers.',
    status: 'Active',
    theme: {
      primary: '#8b4513',
      secondary: '#f4e4bc',
      accent: '#d2691e',
      cardStyle: 'vintage-coffee'
    }
  },
  'blue-wave-spa': {
    id: '2',
    businessName: 'Blue Wave Spa',
    stampsCollected: 7,
    stampsRequired: 8,
    prize: 'Free Massage',
    terms: 'Collect 8 stamps for a complimentary 30-minute massage. Valid for 6 months.',
    status: 'Active',
    theme: {
      primary: '#4682b4',
      secondary: '#e6f3ff',
      accent: '#87ceeb',
      cardStyle: 'ocean-blue'
    }
  },
  'golden-palace': {
    id: '3',
    businessName: 'Golden Palace Thai',
    stampsCollected: 12,
    stampsRequired: 12,
    prize: 'Free Dessert',
    terms: 'Collect 12 stamps for a free traditional Thai dessert. Cannot be combined with other offers.',
    status: 'Active',
    theme: {
      primary: '#daa520',
      secondary: '#fff8dc',
      accent: '#ffd700',
      cardStyle: 'golden-thai'
    }
  },
  'sunset-sailing': {
    id: '4',
    businessName: 'Sunset Sailing',
    stampsCollected: 2,
    stampsRequired: 6,
    prize: '20% Off Next Trip',
    terms: 'Collect 6 stamps for 20% off your next sailing adventure. Valid for 1 year.',
    status: 'Active',
    theme: {
      primary: '#ff6347',
      secondary: '#ffe4e1',
      accent: '#ff7f50',
      cardStyle: 'sunset-orange'
    }
  },
  'tropical-juice': {
    id: '5',
    businessName: 'Tropical Juice Bar',
    stampsCollected: 5,
    stampsRequired: 14,
    prize: 'Free Smoothie Bowl',
    terms: 'Collect 14 stamps for a free acai smoothie bowl with toppings of your choice.',
    status: 'Active',
    theme: {
      primary: '#32cd32',
      secondary: '#f0fff0',
      accent: '#98fb98',
      cardStyle: 'tropical-green'
    }
  }
};

// Get current card based on URL or default to cafe-aroma
const getCurrentCard = () => {
  const pathSegments = window.location.pathname.split('/');
  const cardId = pathSegments[pathSegments.length - 1];
  
  // Map card IDs to business keys
  const cardMapping: { [key: string]: string } = {
    'mock-1': 'cafe-aroma',
    'mock-2': 'blue-wave-spa', 
    'mock-3': 'golden-palace',
    'mock-4': 'sunset-sailing',
    'mock-5': 'tropical-juice'
  };
  
  const businessKey = cardMapping[cardId] || 'cafe-aroma';
  const loyaltyCardKey = businessKey as keyof typeof loyaltyCardVariations;
  return loyaltyCardVariations[loyaltyCardKey];
};

const mockCard = getCurrentCard();

const LoyaltyCardDetail: React.FC = () => {
  const navigate = useNavigate();
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [redeemMessage, setRedeemMessage] = useState('');

  const handleScanQR = () => {
    // TODO: Implement QR scanning functionality with a React 18 compatible library
    alert('QR Scanner feature coming soon! For now, stamps are added automatically when you visit the business.');
  };

  const handleRedeemPrize = () => {
    if (mockCard.stampsCollected >= mockCard.stampsRequired) {
      setRedeemStatus('success');
      setRedeemMessage('Prize redeemed successfully!');
    } else {
      setRedeemStatus('error');
      setRedeemMessage(`You need ${mockCard.stampsRequired - mockCard.stampsCollected} more stamps to redeem this prize.`);
    }
    setTimeout(() => {
      setRedeemStatus('idle');
      setRedeemMessage('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/loyalty-cards')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{mockCard.businessName}</h1>
              <p className="text-sm text-gray-600">Prize: {mockCard.prize}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Status Messages */}
        {redeemMessage && (
          <div className={`p-3 rounded-lg ${
            redeemStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {redeemMessage}
          </div>
        )}

        {/* [2024-05-10 16:40 UTC] - Enhanced Vintage-Style Loyalty Card with Pump Stamps */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Loyalty Card</h2>
          
          <div className="flex justify-center">
            <div 
              className="rounded-2xl shadow-2xl p-8 border-4 w-full max-w-lg relative overflow-hidden transform rotate-1"
              style={{ 
                backgroundColor: mockCard.theme.secondary,
                borderColor: mockCard.theme.primary,
                // DRAMATIC vintage paper texture with heavy stains and wear
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, ${mockCard.theme.primary}25, transparent 50%),
                  radial-gradient(circle at 75% 75%, ${mockCard.theme.accent}20, transparent 50%),
                  radial-gradient(circle at 15% 85%, ${mockCard.theme.primary}15, transparent 40%),
                  radial-gradient(circle at 85% 15%, ${mockCard.theme.accent}12, transparent 35%),
                  radial-gradient(circle at 60% 10%, ${mockCard.theme.primary}18, transparent 30%),
                  radial-gradient(circle at 10% 60%, ${mockCard.theme.accent}14, transparent 35%),
                  radial-gradient(circle at 90% 90%, ${mockCard.theme.primary}16, transparent 40%),
                  linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%),
                  linear-gradient(-45deg, ${mockCard.theme.primary}06, transparent 25%, transparent 75%, ${mockCard.theme.primary}06, transparent 75%),
                  radial-gradient(circle at 50% 50%, ${mockCard.theme.primary}08, transparent 70%),
                  radial-gradient(circle at 30% 70%, ${mockCard.theme.accent}20, transparent 30%),
                  radial-gradient(circle at 70% 30%, ${mockCard.theme.primary}15, transparent 25%)
                `,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 3px rgba(255,255,255,0.3)'
              }}
            >
              {/* Reduced vintage wear marks - less messy */}
              <div className="absolute top-6 right-8 w-5 h-4 rounded-full opacity-60 transform rotate-12" 
                   style={{ backgroundColor: mockCard.theme.accent }} />
              <div className="absolute bottom-12 left-6 w-4 h-4 rounded-full opacity-50"
                   style={{ backgroundColor: mockCard.theme.primary }} />
              <div className="absolute top-16 left-12 w-3 h-5 rounded-full opacity-40 transform rotate-45"
                   style={{ backgroundColor: mockCard.theme.accent }} />
              <div className="absolute bottom-20 right-16 w-6 h-3 rounded-full opacity-60 transform -rotate-12"
                   style={{ backgroundColor: mockCard.theme.primary }} />
              
              {/* Reduced coffee stain effects - less overlapping */}
              <div className="absolute top-8 right-20 w-10 h-10 rounded-full opacity-15" 
                   style={{ 
                     background: `radial-gradient(circle, ${mockCard.theme.primary}40, ${mockCard.theme.primary}20 50%, transparent 80%)`,
                     transform: 'rotate(25deg)'
                   }} />
              <div className="absolute bottom-24 left-8 w-8 h-8 rounded-full opacity-12" 
                   style={{ 
                     background: `radial-gradient(circle, ${mockCard.theme.accent}30, ${mockCard.theme.accent}10 60%, transparent 85%)`
                   }} />
              
              {/* Decorative vintage border */}
              <div className="absolute inset-4 border-2 border-dashed opacity-20" 
                   style={{ borderColor: mockCard.theme.primary }} />

              {/* Business Header with vintage styling */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 tracking-wide" 
                    style={{ 
                      fontFamily: 'serif', 
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                      color: mockCard.theme.primary
                    }}>
                  {mockCard.businessName}
                </h3>
                <div className="w-16 h-0.5 mx-auto mb-3 opacity-60" 
                     style={{ backgroundColor: mockCard.theme.primary }} />
                <p className="font-medium" style={{ color: mockCard.theme.primary }}>
                  Prize: {mockCard.prize}
                </p>
              </div>
              
              {/* Real Pump-Style Stamps - Circular with Business Logo/Text */}
              <div className="mb-8 p-6 rounded-lg border" 
                   style={{ 
                     backgroundColor: `${mockCard.theme.secondary}80`,
                     borderColor: mockCard.theme.accent
                   }}>
                <div className="grid grid-cols-5 gap-3 justify-items-center">
                  {[...Array(mockCard.stampsRequired)].map((_, i) => {
                    const isCollected = i < mockCard.stampsCollected;
                    const rotation = (i * 17) % 35 - 17; // More dramatic rotation -17° to +17°
                    const offsetX = (i * 9) % 16 - 8;
                    const offsetY = (i * 7) % 14 - 7;
                    
                    // Get business name parts for stamp text
                    const nameParts = mockCard.businessName.split(' ');
                    const firstPart = nameParts[0]?.toUpperCase() || 'BUSINESS';
                    const secondPart = nameParts[1]?.toUpperCase() || 'STAMP';
                    
                    return (
                      <div
                        key={i}
                        className="relative w-14 h-14 flex flex-col items-center justify-center text-xs font-bold transition-all duration-300"
                        style={{
                          transform: `rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px)`,
                          backgroundColor: isCollected ? mockCard.theme.primary : mockCard.theme.secondary,
                          // Perfect circle for pump stamp
                          borderRadius: '50%',
                          border: isCollected 
                            ? `5px solid ${mockCard.theme.primary}` 
                            : `3px solid ${mockCard.theme.primary}`,
                          color: isCollected ? mockCard.theme.secondary : mockCard.theme.primary,
                          boxShadow: isCollected 
                            ? `0 6px 20px ${mockCard.theme.primary}60, 
                               inset 0 3px 6px rgba(255,255,255,0.1),
                               0 0 0 3px ${mockCard.theme.primary}40,
                               0 0 15px ${mockCard.theme.primary}30,
                               0 2px 4px rgba(0,0,0,0.3)` // Heavy ink bleed effect
                            : `0 2px 8px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.6)`,
                          // Dramatic pump stamp texture with heavy ink
                          backgroundImage: isCollected 
                            ? `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2), transparent 40%),
                               radial-gradient(circle at 70% 80%, rgba(0,0,0,0.3), transparent 60%),
                               radial-gradient(circle at 50% 50%, ${mockCard.theme.primary}80, transparent 70%),
                               linear-gradient(${30 + (i * 45)}deg, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(0,0,0,0.1) 80%)`
                            : `linear-gradient(45deg, ${mockCard.theme.primary}08 25%, transparent 25%, transparent 75%, ${mockCard.theme.primary}08 75%)`
                        }}
                      >
                        {isCollected ? (
                          <>
                            <div className="text-[8px] leading-tight text-center font-black">
                              {firstPart}
                            </div>
                            <div className="text-[6px] leading-tight text-center font-bold opacity-90">
                              {secondPart}
                            </div>
                          </>
                        ) : (
                          <span className="text-sm">{i + 1}</span>
                        )}
                        
                        {/* Heavy ink splatter effects for collected stamps */}
                        {isCollected && (
                          <>
                            <div className="absolute -top-2 -right-2 w-2 h-2 rounded-full opacity-70"
                                 style={{ backgroundColor: mockCard.theme.accent }} />
                            <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 rounded-full opacity-60"
                                 style={{ backgroundColor: mockCard.theme.primary }} />
                            <div className="absolute top-1 left-0 w-1 h-2 opacity-50 transform rotate-45"
                                 style={{ backgroundColor: mockCard.theme.accent }} />
                            <div className="absolute -top-1 right-2 w-1 h-1 rounded-full opacity-40"
                                 style={{ backgroundColor: mockCard.theme.primary }} />
                            <div className="absolute bottom-0 -right-1 w-0.5 h-1.5 opacity-50 transform -rotate-30"
                                 style={{ backgroundColor: mockCard.theme.accent }} />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Vintage Progress Display */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold mb-2" 
                     style={{ 
                       fontFamily: 'serif', 
                       textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                       color: mockCard.theme.primary
                     }}>
                  {mockCard.stampsCollected} / {mockCard.stampsRequired}
                </div>
                <div className="italic font-medium" style={{ color: mockCard.theme.primary }}>
                  stamps collected
                </div>
              </div>
              
              {/* Vintage Progress Bar */}
              <div className="w-full rounded-full h-6 mb-8 shadow-inner border-2" 
                   style={{ 
                     backgroundColor: `${mockCard.theme.primary}20`,
                     borderColor: mockCard.theme.accent
                   }}>
                <div 
                  className="h-6 rounded-full transition-all duration-700 shadow-sm border-r-2" 
                  style={{ 
                    backgroundColor: mockCard.theme.primary,
                    borderColor: mockCard.theme.accent,
                    width: `${(mockCard.stampsCollected / mockCard.stampsRequired) * 100}%`,
                    backgroundImage: `
                      linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.2) 75%),
                      linear-gradient(90deg, ${mockCard.theme.primary} 0%, ${mockCard.theme.accent} 50%, ${mockCard.theme.primary} 100%)
                    `
                  }}
                />
              </div>
              
              {/* Vintage Action Buttons */}
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={handleScanQR}
                  className="px-6 py-4 rounded-xl text-white text-sm font-bold transition-all shadow-xl transform hover:scale-105 border-2"
                  style={{ 
                    backgroundColor: mockCard.theme.primary,
                    borderColor: mockCard.theme.accent,
                    backgroundImage: `
                      linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.15) 75%),
                      radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)
                    `,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  📱 Scan for Stamp
                </button>
                <button 
                  onClick={handleRedeemPrize}
                  className={`px-6 py-4 rounded-xl text-sm font-bold shadow-xl transition-all border-2 ${
                    mockCard.stampsCollected >= mockCard.stampsRequired
                      ? 'text-white hover:scale-105'
                      : 'opacity-50'
                  }`}
                  style={{
                    backgroundColor: mockCard.stampsCollected >= mockCard.stampsRequired ? '#22c55e' : '#9ca3af',
                    borderColor: mockCard.stampsCollected >= mockCard.stampsRequired ? '#16a34a' : '#6b7280',
                    backgroundImage: mockCard.stampsCollected >= mockCard.stampsRequired 
                      ? `linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.15) 75%)`
                      : 'none',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  🎁 Redeem Prize
                </button>
              </div>
              
              {/* Vintage authenticity mark */}
              <div className="absolute bottom-2 right-2 text-xs opacity-40 italic"
                   style={{ color: mockCard.theme.primary }}>
                Est. 2024
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Terms & Conditions</h3>
          <p className="text-gray-700 leading-relaxed">{mockCard.terms}</p>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCardDetail; 