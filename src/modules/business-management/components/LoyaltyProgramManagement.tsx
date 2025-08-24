import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const STAMP_OPTIONS = [4, 6, 8, 10, 12, 14, 16];

const PRIZE_TEMPLATES = [
  { id: 'free_item', label: 'Free Item', placeholder: 'e.g., Free Coffee, Free Dessert, Free Meal' },
  { id: 'percentage_off', label: 'Percentage Off', placeholder: 'e.g., 20% off next purchase' },
  { id: 'buy_x_get_y', label: 'Buy X Get Y Free', placeholder: 'e.g., Buy 2 Get 1 Free' },
  { id: 'free_upgrade', label: 'Free Upgrade', placeholder: 'e.g., Free size upgrade, Premium service' },
  { id: 'custom', label: 'Custom Prize', placeholder: 'Enter your custom prize description' }
];

const PROGRAM_TITLES = [
  { id: 'rewards_program', label: 'Rewards Program' },
  { id: 'vip_club', label: 'VIP Club' },
  { id: 'loyalty_plus', label: 'Loyalty Plus' },
  { id: 'member_benefits', label: 'Member Benefits' },
  { id: 'custom', label: 'Custom' }
];

const COLOR_THEMES = [
  { id: 'ocean_blue', name: 'Ocean Blue', primary: '#3B82F6', secondary: '#EFF6FF' },
  { id: 'forest_green', name: 'Forest Green', primary: '#10B981', secondary: '#ECFDF5' },
  { id: 'royal_purple', name: 'Royal Purple', primary: '#8B5CF6', secondary: '#F3E8FF' },
  { id: 'cherry_red', name: 'Cherry Red', primary: '#EF4444', secondary: '#FEF2F2' },
  { id: 'sunset_orange', name: 'Sunset Orange', primary: '#F97316', secondary: '#FFF7ED' }
];

interface LoyaltyProgram {
  id?: string;
  business_id: string;
  title: string;
  stamps_required: number;
  prize_description: string;
  terms_conditions: string;
  is_active: boolean;
  color_theme?: string;
}

const LoyaltyProgramManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'setup' | 'generate' | 'customers'>('setup');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [program, setProgram] = useState<LoyaltyProgram>({
    business_id: 'mock-business-id',
    title: 'Rewards Program',
    stamps_required: 10,
    prize_description: '',
    terms_conditions: 'One stamp per visit. Not valid with other offers.',
    is_active: true,
    color_theme: 'ocean_blue'
  });

  const [selectedPrizeTemplate, setSelectedPrizeTemplate] = useState('free_item');
  const [customTitle, setCustomTitle] = useState('');

  const selectedTheme = COLOR_THEMES.find(t => t.id === program.color_theme) || COLOR_THEMES[0];

  useEffect(() => {
    loadExistingProgram();
  }, []);

  const loadExistingProgram = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_programs')
        .select('*')
        .eq('business_id', program.business_id)
        .single();

      if (data && !error) {
        setProgram(data);
      }
    } catch (error) {
      console.log('No existing program found, using defaults');
    }
  };

  const handleSaveProgram = async () => {
    setSaving(true);
    try {
      const programData = {
        ...program,
        title: program.title === 'Custom' ? customTitle : program.title
      };

      const { error } = await supabase
        .from('loyalty_programs')
        .upsert(programData);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Loyalty program saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: `Error saving program: ${error}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/business')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to Business Dashboard
          </button>
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900">Loyalty Program Management</h1>
        
        {message && (
          <div className={`mt-2 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="flex space-x-6 mt-4">
          <button
            onClick={() => setActiveTab('setup')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'setup' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >Set Up / Edit</button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'generate' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >Generate QR</button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'customers' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >Customer Progress</button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'setup' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Customize Your Loyalty Program</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Title</label>
                  <select
                    value={program.title}
                    onChange={(e) => setProgram({...program, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {PROGRAM_TITLES.map(title => (
                      <option key={title.id} value={title.label}>{title.label}</option>
                    ))}
                  </select>
                  {program.title === 'Custom' && (
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="Enter custom program name"
                      className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stamps Required</label>
                  <select
                    value={program.stamps_required}
                    onChange={(e) => setProgram({...program, stamps_required: parseInt(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {STAMP_OPTIONS.map(count => (
                      <option key={count} value={count}>{count} stamps</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prize Type</label>
                  <select
                    value={selectedPrizeTemplate}
                    onChange={(e) => setSelectedPrizeTemplate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {PRIZE_TEMPLATES.map(template => (
                      <option key={template.id} value={template.id}>{template.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prize Description</label>
                  <input
                    type="text"
                    value={program.prize_description}
                    onChange={(e) => setProgram({...program, prize_description: e.target.value})}
                    placeholder={PRIZE_TEMPLATES.find(t => t.id === selectedPrizeTemplate)?.placeholder}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Color Theme</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {COLOR_THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setProgram({...program, color_theme: theme.id})}
                      className={`p-3 rounded-lg border-2 ${program.color_theme === theme.id ? 'border-gray-900' : 'border-gray-200'}`}
                      style={{ backgroundColor: theme.secondary }}
                    >
                      <div 
                        className="w-full h-4 rounded mb-1"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <span className="text-xs font-medium">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                <textarea
                  value={program.terms_conditions}
                  onChange={(e) => setProgram({...program, terms_conditions: e.target.value})}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <button
                onClick={handleSaveProgram}
                disabled={saving}
                className="w-full mt-6 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Save size={16} className="mr-2" />
                {saving ? 'Saving...' : 'Save Program'}
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Eye size={20} className="mr-2" />
                Live Preview
              </h2>
              
              <div className="border-2 border-dashed border-amber-300 rounded-lg p-6" style={{ backgroundColor: '#fffbf0' }}>
                <h3 className="text-sm font-medium text-amber-700 mb-6 text-center">
                  How customers will see your loyalty card with authentic pump stamp effects:
                </h3>
                
                <div className="flex justify-center">
                  <div 
                    className="rounded-2xl shadow-2xl p-8 border-4 w-full max-w-lg relative overflow-hidden transform rotate-1"
                    style={{ 
                      backgroundColor: '#f8f6f0',
                      borderColor: selectedTheme.primary,
                      backgroundImage: `
                        radial-gradient(circle at 25% 25%, rgba(139, 115, 85, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(101, 67, 33, 0.06) 0%, transparent 50%),
                        radial-gradient(circle at 15% 85%, rgba(160, 82, 45, 0.04) 0%, transparent 40%),
                        radial-gradient(circle at 85% 15%, rgba(139, 69, 19, 0.03) 0%, transparent 35%),
                        linear-gradient(45deg, rgba(0,0,0,0.02) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.02) 75%),
                        radial-gradient(circle at 50% 50%, rgba(139, 115, 85, 0.02) 0%, transparent 70%),
                        radial-gradient(circle at 30% 70%, rgba(101, 67, 33, 0.05) 0%, transparent 30%),
                        radial-gradient(circle at 70% 30%, rgba(160, 82, 45, 0.03) 0%, transparent 25%)
                      `,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 3px rgba(255,255,255,0.3)'
                    }}
                  >
                    <div className="absolute top-4 right-6 w-4 h-3 bg-amber-100 rounded-full opacity-50 transform rotate-12" />
                    <div className="absolute bottom-8 left-4 w-3 h-3 bg-amber-200 rounded-full opacity-40" />
                    <div className="absolute top-12 left-8 w-2 h-4 bg-yellow-100 opacity-30 transform rotate-45" />
                    <div className="absolute bottom-16 right-12 w-5 h-2 bg-amber-50 opacity-60 transform -rotate-12" />
                    
                    <div className="absolute top-6 right-16 w-8 h-8 rounded-full opacity-10" 
                         style={{ 
                           background: 'radial-gradient(circle, rgba(101, 67, 33, 0.3) 0%, rgba(101, 67, 33, 0.1) 40%, transparent 70%)',
                           transform: 'rotate(25deg)'
                         }} />
                    <div className="absolute bottom-20 left-6 w-6 h-6 rounded-full opacity-8" 
                         style={{ 
                           background: 'radial-gradient(circle, rgba(139, 69, 19, 0.2) 0%, rgba(139, 69, 19, 0.05) 50%, transparent 80%)'
                         }} />
                    
                    <div className="absolute inset-4 border-2 border-dashed opacity-20" 
                         style={{ borderColor: selectedTheme.primary }} />

                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-amber-900 mb-2 tracking-wide" 
                          style={{ fontFamily: 'serif', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                        {program.title === 'Custom' ? (customTitle || 'Custom Program') : program.title}
                      </h3>
                      <div className="w-16 h-0.5 bg-amber-700 mx-auto mb-3 opacity-60" />
                      <p className="text-amber-700 font-medium">Prize: {program.prize_description || 'Your prize description'}</p>
                    </div>
                    
                    <div className="mb-8 p-6 rounded-lg border border-amber-200" 
                         style={{ backgroundColor: 'rgba(255,248,220,0.5)' }}>
                      <div className="grid grid-cols-4 gap-3 justify-items-center">
                        {[...Array(Math.min(program.stamps_required, 16))].map((_, i) => {
                          const isCollected = i < 3;
                          const rotation = (i * 13) % 25 - 12;
                          const offsetX = (i * 7) % 12 - 6;
                          const offsetY = (i * 5) % 10 - 5;
                          
                          return (
                            <div
                              key={i}
                              className="relative w-12 h-12 flex items-center justify-center text-sm font-bold transition-all duration-300"
                              style={{
                                transform: `rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px)`,
                                backgroundColor: isCollected ? selectedTheme.primary : '#f5f5dc',
                                borderRadius: isCollected 
                                  ? `${40 + (i % 3)}% ${45 + (i % 4)}% ${42 + (i % 2)}% ${38 + (i % 5)}%`
                                  : `${35 + (i % 4)}% ${40 + (i % 3)}% ${37 + (i % 2)}% ${33 + (i % 5)}%`,
                                border: isCollected 
                                  ? `4px solid ${selectedTheme.primary}` 
                                  : `3px solid ${selectedTheme.primary}`,
                                color: isCollected ? '#f8f6f0' : selectedTheme.primary,
                                boxShadow: isCollected 
                                  ? `0 4px 12px ${selectedTheme.primary}40, 
                                     inset 0 2px 4px rgba(255,255,255,0.2),
                                     0 0 0 2px ${selectedTheme.primary}30,
                                     0 0 8px ${selectedTheme.primary}20`
                                  : `0 2px 6px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.6)`,
                                backgroundImage: isCollected 
                                  ? `radial-gradient(circle at 40% 30%, rgba(255,255,255,0.3), transparent 60%),
                                     radial-gradient(circle at 70% 70%, rgba(0,0,0,0.15), transparent 50%),
                                     radial-gradient(circle at 20% 80%, ${selectedTheme.primary}20, transparent 40%),
                                     linear-gradient(${45 + (i * 30)}deg, rgba(0,0,0,0.05) 0%, transparent 30%, rgba(0,0,0,0.05) 70%)`
                                  : `linear-gradient(45deg, rgba(139, 115, 85, 0.05) 25%, transparent 25%, transparent 75%, rgba(139, 115, 85, 0.05) 75%)`
                              }}
                            >
                              {isCollected ? '✓' : i + 1}
                              {isCollected && (
                                <>
                                  <div className="absolute -top-1 -right-1 w-1 h-1 bg-amber-900 rounded-full opacity-60" />
                                  <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-amber-800 rounded-full opacity-40" />
                                  <div className="absolute top-0 left-1 w-0.5 h-1 bg-amber-900 opacity-30 transform rotate-45" />
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {program.stamps_required > 16 && (
                        <p className="text-xs text-amber-600 text-center mt-3 italic">
                          +{program.stamps_required - 16} more stamps...
                        </p>
                      )}
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-amber-900 mb-2" 
                           style={{ fontFamily: 'serif', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                        3 / {program.stamps_required}
                      </div>
                      <div className="text-amber-700 italic font-medium">stamps collected</div>
                    </div>
                    
                    <div className="w-full bg-amber-200 rounded-full h-6 mb-8 shadow-inner border-2 border-amber-300">
                      <div 
                        className="h-6 rounded-full transition-all duration-700 shadow-sm border-r-2 border-amber-600" 
                        style={{ 
                          backgroundColor: selectedTheme.primary,
                          width: `${(3 / program.stamps_required) * 100}%`,
                          backgroundImage: `
                            linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.2) 75%),
                            linear-gradient(90deg, ${selectedTheme.primary} 0%, rgba(160, 130, 98, 1) 50%, ${selectedTheme.primary} 100%)
                          `
                        }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <button 
                        className="px-6 py-4 rounded-xl text-white text-sm font-bold transition-all shadow-xl transform hover:scale-105 border-2"
                        style={{ 
                          backgroundColor: selectedTheme.primary,
                          borderColor: selectedTheme.primary,
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
                        className="px-6 py-4 rounded-xl text-sm font-bold shadow-xl transition-all border-2 opacity-50"
                        style={{
                          backgroundColor: '#9ca3af',
                          borderColor: '#6b7280',
                          color: '#374151',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                        }}
                      >
                        🎁 Redeem Prize
                      </button>
                    </div>
                    
                    <div className="absolute bottom-2 right-2 text-xs text-amber-600 opacity-40 italic">
                      Est. 2024
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-amber-100 rounded-lg border border-amber-300">
                  <p className="text-sm text-amber-900 text-center">
                    <strong>🏆 Authentic Pump Stamp Preview:</strong> This shows your loyalty card with realistic rubber stamp effects, 
                    including irregular edges, ink bleed, and authentic paper aging. Perfect for creating a nostalgic, 
                    handcrafted experience that customers will love.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Generate Stamp QR Code</h2>
            <p className="text-gray-600 mb-4">Generate a QR code for customers to scan and collect stamps.</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">QR code generation feature coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Customer Progress</h2>
            <p className="text-gray-600 mb-4">View customer progress in your loyalty program.</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Customer progress tracking coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyProgramManagement; 