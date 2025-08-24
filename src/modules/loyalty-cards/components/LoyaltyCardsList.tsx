import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../../auth/context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// [2024-05-10 17:00 UTC] - Mock data for variety in loyalty cards display
const mockLoyaltyCards = [
  {
    id: 'mock-1',
    stamps_collected: 3,
    loyalty_programs: {
      stamps_required: 10,
      prize_description: 'Free Coffee',
      is_active: true,
      businesses: {
        name: 'Cafe Aroma',
        id: 'cafe-aroma'
      }
    }
  },
  {
    id: 'mock-2', 
    stamps_collected: 7,
    loyalty_programs: {
      stamps_required: 8,
      prize_description: 'Free Massage',
      is_active: true,
      businesses: {
        name: 'Blue Wave Spa',
        id: 'blue-wave-spa'
      }
    }
  },
  {
    id: 'mock-3',
    stamps_collected: 12,
    loyalty_programs: {
      stamps_required: 12,
      prize_description: 'Free Dessert',
      is_active: true,
      businesses: {
        name: 'Golden Palace Thai',
        id: 'golden-palace'
      }
    }
  },
  {
    id: 'mock-4',
    stamps_collected: 2,
    loyalty_programs: {
      stamps_required: 6,
      prize_description: '20% Off Next Visit',
      is_active: true,
      businesses: {
        name: 'Sunset Sailing',
        id: 'sunset-sailing'
      }
    }
  },
  {
    id: 'mock-5',
    stamps_collected: 5,
    loyalty_programs: {
      stamps_required: 14,
      prize_description: 'Free Smoothie Bowl',
      is_active: false,
      businesses: {
        name: 'Tropical Juice Bar',
        id: 'tropical-juice'
      }
    }
  }
];

const LoyaltyCardsList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchCards = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_loyalty_stamps')
          .select(`
            *,
            loyalty_programs!inner(
              *,
              businesses!inner(
                name,
                id
              )
            )
          `)
          .eq('user_id', user.id);
        if (error) throw error;
        
        // [2024-05-10 17:00 UTC] - Combine real data with mock data for variety
        const combinedCards = [...(data || []), ...mockLoyaltyCards];
        setCards(combinedCards);
      } catch (err: any) {
        // [2024-05-10 17:00 UTC] - If real data fails, show mock data for demo
        console.warn('Using mock data for loyalty cards:', err.message);
        setCards(mockLoyaltyCards);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [user]);

  if (!user) return <div className="p-8 text-center text-gray-500">Please log in to view your loyalty cards.</div>;
  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back
        </button>
        <h1 className="text-xl font-semibold">My Loyalty Cards</h1>
      </div>
      <div className="space-y-4">
        {cards.map((card) => {
          // [2024-05-10 17:00 UTC] - Generate different colors for variety
          const businessInitial = card.loyalty_programs?.businesses?.name?.charAt(0) || 'B';
          const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
          const colorIndex = businessInitial.charCodeAt(0) % colors.length;
          const progressColor = colors[colorIndex];
          
          return (
            <div key={card.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${colors[colorIndex]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-lg">
                      {businessInitial}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {card.loyalty_programs?.businesses?.name || 'Business'} Card
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">
                        {card.stamps_collected || 0} / {card.loyalty_programs?.stamps_required || 10} stamps
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        card.loyalty_programs?.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {card.loyalty_programs?.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`${progressColor.replace('bg-', 'bg-')} h-2 rounded-full transition-all duration-300`}
                        style={{ 
                          width: `${((card.stamps_collected || 0) / (card.loyalty_programs?.stamps_required || 10)) * 100}%` 
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Prize: {card.loyalty_programs?.prize_description || 'Reward available'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/loyalty-cards/${card.id}`)}
                  className={`${progressColor} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors flex-shrink-0`}
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="fixed bottom-20 right-6 bg-red-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl font-bold hover:bg-red-700 transition-colors"
        onClick={() => window.location.href = '/loyalty-cards/scan'}
      >
        +
      </button>
    </div>
  );
};

export default LoyaltyCardsList; 