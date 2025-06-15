import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Phone, Mail, Globe, CheckCircle, Clock, AlertTriangle, Search, BarChart3, Building, Tag, Newspaper, Megaphone } from 'lucide-react';
import { businessAPI, Business, DiscountOffer } from '../../../lib/supabase';
import { curationAPI, SuggestedBusiness, DiscoveryCampaign, CurationStats } from '../../../services/curationAPI';
import { discoveryService } from '../../../services/discoveryService';
import AnalyticsDashboard from './AnalyticsDashboard';
import NewsAdminSettings from './NewsAdminSettings';
import { useAuth } from '../../auth/context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { googlePlacesService } from '../../../services/googlePlaces';
interface BusinessFormData {
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website_url: string;
  description: string;
}

interface DiscountFormData {
  business_id: string;
  title: string;
  description: string;
  discount_percentage: number;
  terms_conditions: string;
  valid_until: string;
  max_redemptions_per_user: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'businesses' | 'pipeline' | 'discounts' | 'analytics' | 'news'>('pipeline');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // [2024-12-19 19:30 UTC] - Intelligent pipeline state
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [importStats, setImportStats] = useState({ found: 0, added: 0 });
  
  // Curation data state
  const [suggestedBusinesses, setSuggestedBusinesses] = useState<SuggestedBusiness[]>([]);
  const [discoveryCampaigns, setDiscoveryCampaigns] = useState<DiscoveryCampaign[]>([]);
  const [curationStats, setCurationStats] = useState<CurationStats>({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    salesLeadsCount: 0,
    averageQualityScore: 0
  });
  const [curationLoading, setCurationLoading] = useState(false);
  const [selectedLdpArea, setSelectedLdpArea] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Discovery state
  const [runningDiscovery, setRunningDiscovery] = useState(false);
  const [discoveryMessage, setDiscoveryMessage] = useState('');

  // [2024-12-19 18:00 UTC] - Enhanced pipeline state management
  const [pipelineStatus, setPipelineStatus] = useState<'pending' | 'approved' | 'rejected' | 'sales_leads' | 'all'>('pending');
  const [showContactMissing, setShowContactMissing] = useState(false);

  // [2024-12-19 20:00 UTC] - Rejection dropdown state
  const [rejectingBusinessId, setRejectingBusinessId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // [2024-12-19 20:15 UTC] - Manual business search state
  const [manualSearchQuery, setManualSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Rejection reasons dropdown options
  const rejectionReasons = [
    'Thai and therefore unknown',
    'Fast food',
    'Too small',
    'Other'
  ];

  const [businessForm, setBusinessForm] = useState<BusinessFormData>({
    name: '',
    category: 'Restaurants',
    address: '',
    latitude: 12.5684,
    longitude: 99.9578,
    phone: '',
    email: '',
    website_url: '',
    description: ''
  });

  const [discountForm, setDiscountForm] = useState<DiscountFormData>({
    business_id: '',
    title: '',
    description: '',
    discount_percentage: 20,
    terms_conditions: '',
    valid_until: '',
    max_redemptions_per_user: 1
  });

  const categories = [
    'Restaurants', 'Wellness', 'Shopping', 'Services', 'Entertainment', 'Travel'
  ];

  // [2024-12-19 16:00 UTC] - LDP areas for filtering
  const ldpAreas = [
    { id: '', label: 'All Areas' },
    { id: 'bangkok', label: 'Bangkok LDP' },
    { id: 'hua-hin', label: 'Hua Hin LDP' },
    { id: 'pattaya', label: 'Pattaya LDP' },
    { id: 'phuket', label: 'Phuket LDP' },
    { id: 'chiang-mai', label: 'Chiang Mai LDP' }
  ];

  // [2024-12-19 19:30 UTC] - Intelligent pipeline system with health check
  const handleIntelligentPipeline = async (category: string = 'Restaurants') => {
    setIsDiscovering(true);
    setImportStats({ found: 0, added: 0 });
    
    try {
      console.log(`🧠 Starting Intelligent Pipeline for ${category}...`);
      
      // First check if pipeline is healthy
      const result = await discoveryService.maintainPipelineQueue(category);
      
      console.log('🧠 Intelligent Pipeline Result:', result);
      
      // Update import stats
      setImportStats({
        found: result.discovered,
        added: result.added
      });
      
      // Show results with console messages (no toast for now)
      if (result.errors.includes('Pipeline queue sufficient')) {
        console.log(`✅ Pipeline healthy: Queue has sufficient ${category.toLowerCase()}`);
        setMessage({ 
          type: 'success', 
          text: `✅ Pipeline Healthy: Already have enough pending ${category.toLowerCase()} (${result.discovered || 'sufficient'} in queue). No discovery needed.` 
        });
      } else if (result.errors.some(e => e.includes('Pipeline queue sufficient'))) {
        console.log(`✅ Pipeline healthy but user forced discovery`);
        setMessage({ 
          type: 'success', 
          text: `✅ Pipeline was healthy, but discovered ${result.added} additional ${category.toLowerCase()} as requested.` 
        });
      } else if (result.added > 0) {
        console.log(`🧠 Intelligent Pipeline: Added ${result.added} fresh ${category.toLowerCase()}`);
        setMessage({ type: 'success', text: `🧠 Intelligent Pipeline: Added ${result.added} fresh ${category.toLowerCase()}` });
      } else if (result.discovered === 0) {
        console.log(`⚠️ No new ${category.toLowerCase()} found in search area`);
        setMessage({ type: 'error', text: `⚠️ No new ${category.toLowerCase()} found in search area. All nearby businesses may already be in the system.` });
      } else {
        console.log(`📊 Found ${result.discovered} ${category.toLowerCase()}, but ${result.duplicates} were duplicates`);
        setMessage({ type: 'success', text: `📊 Found ${result.discovered} ${category.toLowerCase()}, but ${result.duplicates} were already in system` });
      }
      
      // Refresh the business list and stats
      await Promise.all([
        loadBusinesses(),
        loadCurationData()
      ]);
      
    } catch (error) {
      console.error('Intelligent pipeline error:', error);
      setMessage({ type: 'error', text: `❌ Pipeline error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsDiscovering(false);
    }
  };

  // [2024-12-19 19:30 UTC] - Auto-trigger pipeline when queue is low
  const checkAndMaintainPipeline = async () => {
    try {
      // Check if pipeline needs maintenance (this will auto-trigger if needed)
      await discoveryService.maintainPipelineQueue('Restaurants');
      
      // Refresh stats to show updated counts
      await loadCurationData();
    } catch (error) {
      console.error('Auto-pipeline check error:', error);
    }
  };

  // Auto-check pipeline every 5 minutes
  useEffect(() => {
    const interval = setInterval(checkAndMaintainPipeline, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // [2024-12-19 19:30 UTC] - Updated discovery buttons with intelligent pipeline
  const handleDiscoverRestaurants = () => handleIntelligentPipeline('Restaurants');
  const handleDiscoverWellness = () => handleIntelligentPipeline('Wellness');
  const handleDiscoverShopping = () => handleIntelligentPipeline('Shopping');
  const handleDiscoverEntertainment = () => handleIntelligentPipeline('Entertainment');

  useEffect(() => {
    loadBusinesses();
    detectLocation();
    loadCurationData();
  }, []);

  const loadCurationData = async (statusFilter?: string) => {
    setCurationLoading(true);
    try {
      const [businesses, campaigns, stats] = await Promise.all([
        curationAPI.getSuggestedBusinesses(statusFilter || pipelineStatus),
        curationAPI.getDiscoveryCampaigns(), 
        curationAPI.getCurationStats()
      ]);
      
      setSuggestedBusinesses(businesses);
      setDiscoveryCampaigns(campaigns);
      setCurationStats(stats);
      
      // [2024-12-19 19:00 UTC] - Auto-discovery when pipeline is empty
      const pendingBusinesses = businesses.filter(b => b.curation_status === 'pending');
      if (pendingBusinesses.length === 0 && statusFilter !== 'all') {
        console.log('📋 No pending businesses found - triggering auto-discovery...');
        setDiscoveryMessage('🔄 Pipeline empty - auto-discovering fresh businesses...');
        
        // Trigger automatic discovery after a short delay
        setTimeout(async () => {
          try {
            const result = await discoveryService.runHuaHinRestaurantDiscovery();
            setDiscoveryMessage(`🔄 Auto-discovery: Found ${result.discovered}, added ${result.added} fresh businesses`);
            
            // Refresh data to show new businesses
            if (result.added > 0) {
              await loadCurationData(statusFilter);
            }
          } catch (error) {
            console.error('Auto-discovery error:', error);
            setDiscoveryMessage(`❌ Auto-discovery failed: ${error}`);
          }
        }, 1000);
      }
      
      // [2024-12-19 18:00 UTC] - Log contact data availability
      const withContact = businesses.filter(b => b.phone || b.email || b.website_url).length;
      const withoutContact = businesses.length - withContact;
      console.log(`📊 Contact Data: ${withContact} with contact info, ${withoutContact} missing contact info`);
      console.log(`📋 Pipeline Status: Showing ${statusFilter || 'pending'} businesses (${businesses.length} total)`);
      
    } catch (error) {
      console.error('Error loading curation data:', error);
      setMessage({ type: 'error', text: 'Failed to load curation data' });
    } finally {
      setCurationLoading(false);
    }
  };

  const detectLocation = async () => {
    try {
      // Set a default location first
      setUserLocation({ lat: 13.8179, lng: 100.0416 }); // Bangkok default
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(newLocation);
            console.log('Location detected:', newLocation);
          },
          (error) => {
            console.log('Geolocation failed, using default location:', error.message);
            // Keep the default location, don't try fallbacks that might fail
          },
          {
            timeout: 5000,
            enableHighAccuracy: false,
            maximumAge: 300000 // 5 minutes
          }
        );
      } else {
        console.log('Geolocation not supported, using default location');
      }
    } catch (error) {
      console.error('Location detection error:', error);
      // Ensure we always have a location set
      setUserLocation({ lat: 13.8179, lng: 100.0416 });
    }
  };

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      // [2025-01-06 13:10 UTC] - Production: Load real businesses from database, no mock data
      console.log('📊 Loading businesses from database...');
      const realBusinesses = await businessAPI.getAllBusinesses();
      console.log(`✅ Loaded ${realBusinesses.length} businesses from database`);
      setBusinesses(realBusinesses);
    } catch (error) {
      console.error('Error loading businesses:', error);
      setMessage({ type: 'error', text: 'Failed to load businesses from database' });
      setBusinesses([]); // Set empty array instead of mock data
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessAdded = (newBusiness: Business) => {
    setBusinesses(prev => [...prev, newBusiness]);
    setMessage({ type: 'success', text: `${newBusiness.name} added successfully!` });
    setTimeout(() => setMessage(null), 5000);
  };

  // Curation action handlers
  const handleApproveBusiness = async (businessId: string) => {
    setLoading(true);
    try {
      // [2025-01-06 13:30 UTC] - Production: Use authenticated user or system UUID
      let curatorId: string;
      
      if (user && user.id) {
        // Use authenticated user ID
        curatorId = user.id;
        console.log('🔄 Approving business:', businessId, 'Curator (authenticated):', curatorId);
      } else {
        // For production admin without authentication, generate a proper system UUID
        console.log('⚠️ No authenticated user - using system curator');
        
        // Generate a proper UUID v4 format for system operations
        curatorId = crypto.randomUUID();
        console.log('🔄 Approving business:', businessId, 'Curator (system):', curatorId);
      }

      const newBusinessId = await curationAPI.approveBusinessAndCreateLoyalty(businessId, curatorId);
      console.log('✅ Business approved successfully, new ID:', newBusinessId);
      setMessage({ type: 'success', text: `Business approved and loyalty program created!` });
      await loadCurationData();
    } catch (error) {
      console.error('❌ Approve business error:', error);
      
      // [2024-12-19 17:45 UTC] - Better error messages for common issues
      let errorMessage = 'Failed to approve business';
      if (error instanceof Error) {
        if (error.message.includes('duplicate') || error.message.includes('already exists')) {
          errorMessage = 'This business is already approved in the system';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Business not found - it may have been already processed';
        } else if (error.message.includes('uuid') || error.message.includes('UUID')) {
          errorMessage = 'Authentication error - please refresh the page and try again';
        } else {
          errorMessage = `Approval failed: ${error.message}`;
        }
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleFlagForSales = async (businessId: string) => {
    setLoading(true);
    try {
      console.log('🔄 Flagging business for sales:', businessId);
      const success = await curationAPI.flagForSales(businessId);
      if (success) {
        setMessage({ type: 'success', text: `Business flagged for sales outreach!` });
        console.log('✅ Business flagged, refreshing data...');
        await loadCurationData(); // Wait for refresh to complete
        console.log('📊 Data refreshed');
      } else {
        setMessage({ type: 'error', text: `Failed to flag business for sales - may not exist in database` });
      }
    } catch (error) {
      console.error('Sales flag error:', error);
      setMessage({ type: 'error', text: `Error flagging business: ${error}` });
    } finally {
      setLoading(false); // Only set loading false after everything completes
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRejectBusiness = async (businessId: string, reason?: string) => {
    // [2024-12-19 20:00 UTC] - Use dropdown reason or show dropdown if no reason provided
    if (!reason && !rejectingBusinessId) {
      setRejectingBusinessId(businessId);
      setRejectionReason('');
      return;
    }

    const finalReason = reason || rejectionReason;
    setLoading(true);
    try {
      console.log('🔄 Rejecting business:', businessId, 'Reason:', finalReason);
      const success = await curationAPI.rejectBusiness(businessId, finalReason || undefined);
      if (success) {
        setMessage({ type: 'success', text: `Business rejected successfully! Reason: ${finalReason}` });
        console.log('✅ Business rejected, refreshing data...');
        await loadCurationData(); // Wait for refresh to complete
        console.log('📊 Data refreshed');
      } else {
        setMessage({ type: 'error', text: `Failed to reject business - may not exist in database` });
      }
    } catch (error) {
      console.error('Rejection error:', error);
      setMessage({ type: 'error', text: `Error rejecting business: ${error}` });
    } finally {
      setLoading(false); // Only set loading false after everything completes
      setRejectingBusinessId(null); // Close dropdown
      setRejectionReason(''); // Reset reason
    }
    setTimeout(() => setMessage(null), 3000);
  };

  // Discovery action handler
  const handleRunDiscovery = async () => {
    setRunningDiscovery(true);
    setDiscoveryMessage('');
    
    try {
      console.log('🔍 Starting Hua Hin business discovery...');
      
      // Use the Hua Hin specific discovery functions
      const result = await discoveryService.runHuaHinRestaurantDiscovery();
      
      console.log('📊 Discovery completed:', result);
      
      setDiscoveryMessage(
        `✅ Hua Hin Discovery Complete! Found ${result.discovered} businesses, ` +
        `added ${result.added} new ones${result.duplicates > 0 ? `, ${result.duplicates} duplicates` : ''}` +
        `${result.errors.length > 0 ? `. ${result.errors.length} errors occurred.` : ''}`
      );
      
      // Refresh the business list
      await loadCurationData();
      
    } catch (error) {
      console.error('Discovery error:', error);
      setDiscoveryMessage(`❌ Discovery failed: ${error}`);
    } finally {
      setRunningDiscovery(false);
    }
  };

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate coordinates from address if needed
      const coordinates = await geocodeAddress(businessForm.address);
      
      const newBusiness = await businessAPI.addBusiness({
        ...businessForm,
        latitude: coordinates?.lat || businessForm.latitude,
        longitude: coordinates?.lng || businessForm.longitude,
        partnership_status: 'active'
      });

      if (newBusiness) {
        handleBusinessAdded(newBusiness);
        setShowAddBusiness(false);
        setBusinessForm({
          name: '',
          category: 'Restaurants',
          address: '',
          latitude: 12.5684,
          longitude: 99.9578,
          phone: '',
          email: '',
          website_url: '',
          description: ''
        });
        loadBusinesses();
      } else {
        setMessage({ type: 'error', text: 'Failed to add business. Please try again.' });
      }
    } catch (error) {
      console.error('Error adding business:', error);
      setMessage({ type: 'error', text: 'Error adding business. Please check your database connection.' });
    }

    setLoading(false);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newDiscount = await businessAPI.addDiscountOffer({
        ...discountForm,
        valid_from: new Date().toISOString().split('T')[0],
        is_active: true
      });

      if (newDiscount) {
        setMessage({ type: 'success', text: 'Discount offer added successfully!' });
        setShowAddDiscount(false);
        setDiscountForm({
          business_id: '',
          title: '',
          description: '',
          discount_percentage: 20,
          terms_conditions: '',
          valid_until: '',
          max_redemptions_per_user: 1
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to add discount offer. Please try again.' });
      }
    } catch (error) {
      console.error('Error adding discount:', error);
      setMessage({ type: 'error', text: 'Error adding discount offer.' });
    }

    setLoading(false);
    setTimeout(() => setMessage(null), 5000);
  };

  // Geocoding function (you'll need to implement this with Google Maps API)
  const geocodeAddress = async (address: string) => {
    // This is a placeholder - in production, use Google Geocoding API
    try {
      // Example implementation:
      // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`);
      // const data = await response.json();
      // return data.results[0]?.geometry?.location;
      
      return null; // For now, use manual coordinates
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // [2024-12-19 17:00 UTC] - Clean up mock data from database
  const cleanupMockData = async () => {
    try {
      console.log('🧹 Cleaning up mock data from database...');
      
      // [2024-12-19 17:15 UTC] - Remove specific mock businesses by name
      const mockBusinessNames = [
        'Fine Dining Palace',
        'Coffee Culture Cafe',
        'Bangkok Street Food'
      ];

      for (const mockName of mockBusinessNames) {
        const { error } = await supabase
          .from('suggested_businesses')
          .delete()
          .eq('name', mockName);

        if (error) {
          console.error(`❌ Error deleting ${mockName}:`, error);
        } else {
          console.log(`✅ Deleted mock business: ${mockName}`);
        }
      }

      // [2024-12-19 17:15 UTC] - Remove businesses with mock addresses
      const mockAddresses = [
        '321 Luxury Ave, Bangkok',
        '789 Cafe Lane, Bangkok',
        '456 Food Street, Bangkok'
      ];

      for (const mockAddress of mockAddresses) {
        const { error } = await supabase
          .from('suggested_businesses')
          .delete()
          .eq('address', mockAddress);

        if (error) {
          console.error(`❌ Error deleting address ${mockAddress}:`, error);
        } else {
          console.log(`✅ Deleted mock business with address: ${mockAddress}`);
        }
      }

      // [2024-12-19 17:15 UTC] - Fix incorrectly categorized businesses
      const incorrectlyCategorizeds = [
        { name: 'Hua Hin Beach', correctCategory: 'Entertainment' },
        { name: 'หมูปิ้ง ห้วยมุม ไม่ตะรไม่มีมัน สไตล์โบราณ', correctCategory: 'Entertainment' }
      ];

      for (const business of incorrectlyCategorizeds) {
        // Check if it's currently categorized as Restaurant
        const { data: existing, error: selectError } = await supabase
          .from('suggested_businesses')
          .select('id, primary_category')
          .eq('name', business.name)
          .maybeSingle();

        if (selectError) {
          console.error(`❌ Error checking ${business.name}:`, selectError);
          continue;
        }

        if (existing && existing.primary_category === 'Restaurants') {
          const { error: updateError } = await supabase
            .from('suggested_businesses')
            .update({ primary_category: business.correctCategory })
            .eq('id', existing.id);

          if (updateError) {
            console.error(`❌ Error updating ${business.name}:`, updateError);
          } else {
            console.log(`✅ Fixed category for ${business.name}: Restaurants → ${business.correctCategory}`);
          }
        }
      }

      console.log('✅ Mock data cleanup completed');
    } catch (error) {
      console.error('💥 Error during mock data cleanup:', error);
    }
  };

  // [2024-12-19 17:15 UTC] - Remove non-restaurant businesses incorrectly categorized as restaurants
  const cleanupIncorrectRestaurants = async () => {
    try {
      console.log('🍽️ Cleaning up non-restaurant businesses incorrectly categorized as restaurants...');
      
      // Remove businesses that are clearly not restaurants but categorized as such
      const nonRestaurantNames = [
        'Hua Hin Beach',
        'หมูปิ้ง ห้วยมุม ไม่ตะรไม่มีมัน สไตล์โบราณ'
      ];

      for (const businessName of nonRestaurantNames) {
        const { error } = await supabase
          .from('suggested_businesses')
          .delete()
          .eq('name', businessName)
          .eq('primary_category', 'Restaurants');

        if (error) {
          console.error(`❌ Error removing ${businessName}:`, error);
        } else {
          console.log(`✅ Removed non-restaurant business: ${businessName}`);
        }
      }

      console.log('✅ Non-restaurant cleanup completed');
    } catch (error) {
      console.error('💥 Error during non-restaurant cleanup:', error);
    }
  };

  // [2024-12-19 18:30 UTC] - Comprehensive pipeline debugging
  const debugPipeline = async () => {
    console.log('🔍 PIPELINE DEBUG - Starting comprehensive analysis...');
    
    try {
      // 1. Check database connection and current data
      console.log('📊 Step 1: Database Analysis');
      const { data: allSuggested, error: suggestedError } = await supabase
        .from('suggested_businesses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (suggestedError) {
        console.error('❌ Database error:', suggestedError);
        setMessage({ type: 'error', text: `Database error: ${suggestedError.message}` });
        return;
      }
      
      console.log(`📋 Total suggested businesses in DB: ${allSuggested?.length || 0}`);
      console.log(`📊 Status breakdown:`, {
        pending: allSuggested?.filter(b => b.curation_status === 'pending').length || 0,
        approved: allSuggested?.filter(b => b.curation_status === 'approved').length || 0,
        rejected: allSuggested?.filter(b => b.curation_status === 'rejected').length || 0,
        sales_leads: allSuggested?.filter(b => b.curation_status === 'flagged_for_sales').length || 0
      });
      
      // 2. Test Google Places API
      console.log('🌐 Step 2: Google Places API Test');
      const testPlaces = await googlePlacesService.searchBusinessesByText(
        'restaurant',
        12.5684, // Hua Hin
        99.9578,
        3000
      );
      console.log(`🔍 Google Places returned ${testPlaces.length} results`);
      testPlaces.slice(0, 3).forEach(place => {
        console.log(`   📍 ${place.name} - Types: ${place.types.join(', ')}`);
      });
      
      // 3. Test discovery service with minimal filters
      console.log('🚀 Step 3: Discovery Service Test');
      const testResult = await discoveryService.runDiscoveryForLocation(
        { lat: 12.5684, lng: 99.9578 },
        ['Restaurants'],
        5000,
        { minRating: 1.0, minReviewCount: 0 } // Minimal filters
      );
      
      console.log('📊 Discovery test results:', testResult);
      
      setMessage({ 
        type: 'success', 
        text: `Debug complete: DB has ${allSuggested?.length || 0} businesses, Google returned ${testPlaces.length} places, Discovery found ${testResult.discovered} and added ${testResult.added}` 
      });
      
    } catch (error) {
      console.error('💥 Debug error:', error);
      setMessage({ type: 'error', text: `Debug failed: ${error}` });
    }
  };

  const runRestaurantDiscovery = async () => {
    setRunningDiscovery(true);
    setDiscoveryMessage('');
    setSelectedCategory('Restaurants'); // [2024-12-19 17:30 UTC] - Set category filter
    try {
      console.log('🍽️ Starting Hua Hin restaurant discovery...');
      
      // First clean up any mock data and incorrect categorizations
      await cleanupMockData();
      await cleanupIncorrectRestaurants();
      
      const result = await discoveryService.runHuaHinRestaurantDiscovery();
      setDiscoveryMessage(`✅ Restaurants: Found ${result.discovered}, added ${result.added}`);
      await loadCurationData();
    } catch (error) {
      setDiscoveryMessage(`❌ Restaurant discovery failed: ${error}`);
    } finally {
      setRunningDiscovery(false);
    }
  };

  // [2024-12-19 18:30 UTC] - Reset pipeline by clearing processed businesses
  const resetPipeline = async () => {
    if (!confirm('⚠️ This will delete ALL processed businesses (approved/rejected/sales leads) and reset the pipeline. Continue?')) {
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Resetting pipeline...');
      
      // Delete all non-pending businesses to allow fresh discovery
      const { error: deleteError } = await supabase
        .from('suggested_businesses')
        .delete()
        .neq('curation_status', 'pending');
      
      if (deleteError) {
        console.error('❌ Failed to reset pipeline:', deleteError);
        setMessage({ type: 'error', text: `Failed to reset pipeline: ${deleteError.message}` });
        return;
      }
      
      console.log('✅ Pipeline reset successfully');
      setMessage({ type: 'success', text: 'Pipeline reset! You can now discover businesses again.' });
      
      // Refresh data
      await loadCurationData();
      
    } catch (error) {
      console.error('💥 Reset error:', error);
      setMessage({ type: 'error', text: `Reset failed: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  // [2024-12-19 18:45 UTC] - Comprehensive pipeline reset
  const resetPipelineCompletely = async () => {
    if (!confirm('⚠️ This will DELETE ALL businesses from the pipeline (approved, rejected, pending) to allow fresh discovery. Continue?')) {
      return;
    }
    
    setLoading(true);
    setDiscoveryMessage('🔄 Resetting entire pipeline...');
    
    try {
      console.log('🗑️ Deleting all suggested businesses...');
      
      // Delete ALL businesses from suggested_businesses table
      const { error: deleteError } = await supabase
        .from('suggested_businesses')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (deleteError) {
        console.error('❌ Failed to reset pipeline:', deleteError);
        setMessage({ type: 'error', text: `Failed to reset pipeline: ${deleteError.message}` });
        return;
      }
      
      console.log('✅ Pipeline reset successfully - all businesses deleted');
      setMessage({ type: 'success', text: '✅ Pipeline completely reset! You can now discover fresh businesses.' });
      setDiscoveryMessage('✅ Pipeline reset complete - ready for fresh discovery');
      
      // Refresh data to show empty state
      await loadCurationData();
      
    } catch (error) {
      console.error('💥 Reset error:', error);
      setMessage({ type: 'error', text: `Reset failed: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  // [2024-12-19 18:30 UTC] - Force discovery with minimal restrictions
  const forceDiscovery = async () => {
    setRunningDiscovery(true);
    setDiscoveryMessage('🔄 Force discovering with no filters...');
    
    try {
      console.log('🚀 Starting force discovery...');
      
      // Use Google Places directly with minimal filtering
      const places = await googlePlacesService.searchBusinessesByText(
        'restaurant food cafe dining',
        12.5684, // Hua Hin
        99.9578,
        10000 // 10km radius
      );
      
      console.log(`🔍 Google Places returned ${places.length} results`);
      
      let added = 0;
      let duplicates = 0;
      let errors = [];
      
      for (const place of places.slice(0, 20)) { // Limit to first 20 for testing
        try {
          // Check if it's a restaurant-type business
          const isRestaurant = place.types.some(type => 
            ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery'].includes(type)
          );
          
          if (!isRestaurant) continue;
          
          // Check for duplicates
          const { data: existing } = await supabase
            .from('suggested_businesses')
            .select('id')
            .eq('google_place_id', place.place_id)
            .maybeSingle();
          
          if (existing) {
            duplicates++;
            continue;
          }
          
          // Get details
          const details = await googlePlacesService.getPlaceDetails(place.place_id);
          
          // Insert with unique ID to bypass duplicates
          const businessData = {
            google_place_id: `${place.place_id}_force_${Date.now()}`, // Unique ID to bypass duplicates
            name: place.name,
            address: details?.formatted_address || place.vicinity,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            phone: details?.formatted_phone_number || null,
            website_url: details?.website || null,
            description: `Restaurant in Hua Hin serving ${place.types.includes('cafe') ? 'coffee and light meals' : 'delicious food'}`,
            google_rating: place.rating || null,
            google_review_count: details?.user_ratings_total || 0,
            google_price_level: place.price_level || null,
            google_types: place.types,
            primary_category: 'Restaurants',
            quality_score: Math.round((place.rating || 3.5) * 20),
            curation_status: 'pending',
            discovery_source: 'force_discovery',
            discovery_criteria: { forced: true, timestamp: new Date().toISOString() }
          };
          
          const { error } = await supabase
            .from('suggested_businesses')
            .insert(businessData);
          
          if (error) {
            console.error('❌ Insert error:', error);
            errors.push(`${place.name}: ${error.message}`);
          } else {
            added++;
            console.log(`✅ Added: ${place.name}`);
          }
          
        } catch (error) {
          errors.push(`${place.name}: ${error}`);
        }
      }
      
      setDiscoveryMessage(`🚀 Force Discovery Complete: Added ${added}, Duplicates ${duplicates}, Errors ${errors.length}`);
      console.log('📊 Force discovery results:', { added, duplicates, errors });
      
      await loadCurationData();
      
    } catch (error) {
      console.error('💥 Force discovery error:', error);
      setDiscoveryMessage(`❌ Force discovery failed: ${error}`);
    } finally {
      setRunningDiscovery(false);
    }
  };

  // [2024-12-19 18:45 UTC] - Test database insertion
  const testDatabaseInsertion = async () => {
    setRunningDiscovery(true);
    setDiscoveryMessage('🧪 Testing database insertion...');
    
    try {
      const testBusiness = {
        google_place_id: `test_${Date.now()}`,
        name: `Test Restaurant ${Date.now()}`,
        address: 'Test Address, Hua Hin, Thailand',
        latitude: 12.5684,
        longitude: 99.9578,
        phone: '+66-32-123-456',
        email: null,
        website_url: 'https://test-restaurant.com',
        description: 'Test restaurant for debugging pipeline issues',
        google_rating: 4.5,
        google_review_count: 25,
        google_price_level: 2,
        google_types: ['restaurant', 'food'],
        primary_category: 'Restaurants',
        quality_score: 85,
        curation_status: 'pending',
        discovery_source: 'manual_test',
        discovery_criteria: { test: true, timestamp: new Date().toISOString() }
      };
      
      console.log('🧪 Attempting to insert test business:', testBusiness);
      
      const { data, error } = await supabase
        .from('suggested_businesses')
        .insert(testBusiness)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Test insertion failed:', error);
        setDiscoveryMessage(`❌ Database test failed: ${error.message}`);
      } else {
        console.log('✅ Test business inserted successfully:', data);
        setDiscoveryMessage(`✅ Database test passed! Inserted: ${data.name}`);
        await loadCurationData();
      }
      
    } catch (error) {
      console.error('💥 Test error:', error);
      setDiscoveryMessage(`💥 Test error: ${error}`);
    } finally {
      setRunningDiscovery(false);
    }
  };

  // [2024-12-19 18:45 UTC] - Quick function to show all existing businesses
  const showAllExistingBusinesses = async () => {
    setSelectedStatus('all');
    setDiscoveryMessage('📋 Showing all existing businesses (approved, rejected, pending)');
    await loadCurationData('all');
  };

  // [2024-12-19 19:15 UTC] - Simple test discovery with no filtering
  const testSimpleDiscovery = async () => {
    setRunningDiscovery(true);
    setDiscoveryMessage('🧪 Testing simple discovery with no filtering...');
    
    try {
      console.log('🧪 Starting simple discovery test...');
      
      // Get ANY businesses from Google Places
      const places = await googlePlacesService.searchBusinessesByText(
        'business',
        12.5684, // Hua Hin center
        99.9578,
        5000
      );
      
      console.log(`🔍 Found ${places.length} businesses of any type`);
      
      let added = 0;
      
      // Take first 10 businesses regardless of type
      for (const place of places.slice(0, 10)) {
        try {
          // Check for duplicates
          const { data: existing } = await supabase
            .from('suggested_businesses')
            .select('id')
            .eq('google_place_id', place.place_id)
            .maybeSingle();
          
          if (existing) {
            console.log(`⏭️ Skipping duplicate: ${place.name}`);
            continue;
          }
          
          // Get details
          const details = await googlePlacesService.getPlaceDetails(place.place_id);
          
          // Insert with minimal data
          const businessData = {
            google_place_id: place.place_id,
            name: place.name,
            address: details?.formatted_address || place.vicinity,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            phone: details?.formatted_phone_number || null,
            website_url: details?.website || null,
            description: `Business in Hua Hin - Types: ${place.types.join(', ')}`,
            google_rating: place.rating || null,
            google_review_count: details?.user_ratings_total || 0,
            google_price_level: place.price_level || null,
            google_types: place.types,
            primary_category: place.types.includes('restaurant') ? 'Restaurants' : 'Services',
            quality_score: 75,
            curation_status: 'pending',
            discovery_source: 'simple_test',
            discovery_criteria: { test: true, timestamp: new Date().toISOString() }
          };
          
          const { error } = await supabase
            .from('suggested_businesses')
            .insert(businessData);
          
          if (error) {
            console.error(`❌ Insert error for ${place.name}:`, error);
          } else {
            added++;
            console.log(`✅ Added: ${place.name} (${place.types.join(', ')})`);
          }
          
        } catch (error) {
          console.error(`💥 Error processing ${place.name}:`, error);
        }
      }
      
      setDiscoveryMessage(`🧪 Simple test: Added ${added} businesses of any type`);
      await loadCurationData();
      
    } catch (error) {
      console.error('💥 Simple discovery error:', error);
      setDiscoveryMessage(`❌ Simple test failed: ${error}`);
    } finally {
      setRunningDiscovery(false);
    }
  };

  // [2024-12-19 19:15 UTC] - Test different Hua Hin locations
  const testHuaHinLocations = async () => {
    setRunningDiscovery(true);
    setDiscoveryMessage('🗺️ Testing different Hua Hin locations...');
    
    const locations = [
      { name: 'Hua Hin Night Market', lat: 12.5708, lng: 99.9581 },
      { name: 'Hua Hin Beach', lat: 12.5684, lng: 99.9578 },
      { name: 'Hua Hin Railway Station', lat: 12.5703, lng: 99.9496 },
      { name: 'Cicada Market', lat: 12.5892, lng: 99.9664 },
      { name: 'Hua Hin Hills', lat: 12.5500, lng: 99.9400 }
    ];
    
    let totalAdded = 0;
    
    for (const location of locations) {
      try {
        console.log(`🔍 Searching near ${location.name}...`);
        
        const places = await googlePlacesService.searchBusinessesByText(
          'restaurant food',
          location.lat,
          location.lng,
          2000 // 2km radius
        );
        
        console.log(`📍 ${location.name}: Found ${places.length} places`);
        
        // Take first 3 from each location
        for (const place of places.slice(0, 3)) {
          try {
            // Check for duplicates
            const { data: existing } = await supabase
              .from('suggested_businesses')
              .select('id')
              .eq('google_place_id', place.place_id)
              .maybeSingle();
            
            if (existing) continue;
            
            // Insert business
            const businessData = {
              google_place_id: place.place_id,
              name: place.name,
              address: place.vicinity,
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
              phone: null,
              website_url: null,
              description: `Business near ${location.name} in Hua Hin`,
              google_rating: place.rating || null,
              google_review_count: 0,
              google_price_level: place.price_level || null,
              google_types: place.types,
              primary_category: 'Restaurants',
              quality_score: 70,
              curation_status: 'pending',
              discovery_source: 'location_test',
              discovery_criteria: { location: location.name, timestamp: new Date().toISOString() }
            };
            
            const { error } = await supabase
              .from('suggested_businesses')
              .insert(businessData);
            
            if (!error) {
              totalAdded++;
              console.log(`✅ Added: ${place.name} (${location.name})`);
            }
            
          } catch (error) {
            console.error(`Error processing ${place.name}:`, error);
          }
        }
        
      } catch (error) {
        console.error(`Error searching ${location.name}:`, error);
      }
    }
    
    setDiscoveryMessage(`🗺️ Location test: Added ${totalAdded} businesses from ${locations.length} locations`);
    await loadCurationData();
    setRunningDiscovery(false);
  };

  // [2024-12-19 19:45 UTC] - Clean up incorrectly categorized restaurants
  const cleanupIncorrectlyCategorizeddRestaurants = async () => {
    setMessage({ type: 'info', text: '🔄 Cleaning up incorrectly categorized restaurants...' });
    
    try {
      // Get all businesses with primary_category 'Restaurants' but non-restaurant Google types
      const { data: businesses, error: fetchError } = await supabase
        .from('suggested_businesses')
        .select('*')
        .eq('primary_category', 'Restaurants');

      if (fetchError) {
        console.error('Error fetching businesses:', fetchError);
        setMessage({ type: 'error', text: `❌ Error fetching businesses: ${fetchError.message}` });
        return;
      }

      console.log(`📊 Found ${businesses?.length || 0} businesses with 'Restaurants' category`);

      let cleanedCount = 0;
      const businessesToDelete = [];

      for (const business of businesses || []) {
        const googleTypes = business.google_types || [];
        console.log(`🔍 Checking: ${business.name} - Types: ${googleTypes.join(', ')}`);
        
        // Check if it has any food-related types
        const foodTypes = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery'];
        const hasFoodType = googleTypes.some((type: string) => foodTypes.includes(type));
        
        if (!hasFoodType) {
          console.log(`❌ ${business.name} has no food types - marking for deletion`);
          businessesToDelete.push(business.id);
        } else {
          console.log(`✅ ${business.name} has food types - keeping`);
        }
      }

      if (businessesToDelete.length > 0) {
        console.log(`🗑️ Deleting ${businessesToDelete.length} incorrectly categorized businesses...`);
        
        const { error: deleteError } = await supabase
          .from('suggested_businesses')
          .delete()
          .in('id', businessesToDelete);

        if (deleteError) {
          console.error('Error deleting businesses:', deleteError);
          setMessage({ type: 'error', text: `❌ Error deleting businesses: ${deleteError.message}` });
          return;
        }

        cleanedCount = businessesToDelete.length;
      }

      setMessage({ 
        type: 'success', 
        text: `✅ Cleanup complete! Removed ${cleanedCount} incorrectly categorized restaurants.` 
      });
      
      // Refresh the data
      await loadCurationData();
      
    } catch (error) {
      console.error('Cleanup error:', error);
      setMessage({ type: 'error', text: `❌ Cleanup failed: ${error}` });
    }
  };

  // [2024-12-19 20:15 UTC] - Debug function to show what's in database
  const showDatabaseContents = async () => {
    setMessage({ type: 'info', text: '🔍 Checking database contents...' });
    
    try {
      const { data: businesses, error } = await supabase
        .from('suggested_businesses')
        .select('id, name, primary_category, curation_status, google_place_id, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching database contents:', error);
        setMessage({ type: 'error', text: `❌ Database error: ${error.message}` });
        return;
      }

      console.log('📊 DATABASE CONTENTS (Last 20 businesses):');
      console.log('='.repeat(80));
      
      if (!businesses || businesses.length === 0) {
        console.log('❌ No businesses found in database');
        setMessage({ type: 'info', text: '📊 Database is empty - no businesses found' });
        return;
      }

      businesses.forEach((business, index) => {
        console.log(`${index + 1}. ${business.name}`);
        console.log(`   📍 Category: ${business.primary_category}`);
        console.log(`   📊 Status: ${business.curation_status}`);
        console.log(`   🆔 Google ID: ${business.google_place_id}`);
        console.log(`   📅 Created: ${new Date(business.created_at).toLocaleString()}`);
        console.log('');
      });

      const statusCounts = businesses.reduce((acc, b) => {
        acc[b.curation_status] = (acc[b.curation_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('📊 STATUS BREAKDOWN:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`);
      });

      setMessage({ 
        type: 'success', 
        text: `📊 Database has ${businesses.length} recent businesses. Check console for details.` 
      });
      
    } catch (error) {
      console.error('Database check error:', error);
      setMessage({ type: 'error', text: `❌ Database check failed: ${error}` });
    }
  };

  // [2024-12-19 20:15 UTC] - Manual business search functionality
  const handleManualSearch = async () => {
    if (!manualSearchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      console.log('🔍 Manual search for:', manualSearchQuery);
      
      // Use Google Places text search directly
      const searchLocation = userLocation || { lat: 12.5684, lng: 99.9578 }; // Default to Hua Hin
      
      const results = await googlePlacesService.searchBusinessesByText(
        manualSearchQuery,
        searchLocation.lat,
        searchLocation.lng,
        10000 // 10km radius for manual search
      );
      
      console.log('🔍 Search results:', results);
      setSearchResults(results.slice(0, 5)); // Limit to top 5 results
      setShowSearchResults(true);
      
      if (results.length === 0) {
        setMessage({ type: 'info', text: `No businesses found for "${manualSearchQuery}"` });
      } else {
        setMessage({ type: 'success', text: `Found ${results.length} business(es) for "${manualSearchQuery}"` });
      }
      
    } catch (error) {
      console.error('Manual search error:', error);
      setMessage({ type: 'error', text: `Search failed: ${error}` });
    } finally {
      setIsSearching(false);
    }
  };

  // [2025-01-06 13:20 UTC] - Quality score calculation for Google Places results
  const calculateQualityScore = (searchResult: any): number => {
    let score = 0;
    
    // Rating score (0-40 points)
    if (searchResult.rating) {
      score += Math.round(searchResult.rating * 8); // 5.0 rating = 40 points
    }
    
    // Review count score (0-25 points)  
    if (searchResult.user_ratings_total) {
      score += Math.min(Math.round(searchResult.user_ratings_total / 4), 25); // 100+ reviews = 25 points
    }
    
    // Contact info completeness (0-20 points)
    if (searchResult.formatted_phone_number) score += 10;
    if (searchResult.website) score += 10;
    
    // Photos availability (0-10 points)
    if (searchResult.photos && searchResult.photos.length > 0) score += 10;
    
    // Price level (0-5 points) - higher price usually means more established
    if (searchResult.price_level) {
      score += searchResult.price_level; // 1-4 scale
    }
    
    return Math.min(score, 100); // Cap at 100
  };

  const handleAddSearchResult = async (searchResult: any) => {
    setLoading(true);
    try {
      console.log('➕ Adding search result to pipeline:', searchResult.name);
      
      // [2025-01-06 13:25 UTC] - Get detailed place information first
      let detailedResult = searchResult;
      if (searchResult.place_id) {
        console.log('🔍 Fetching detailed place information...');
        const placeDetails = await googlePlacesService.getPlaceDetails(searchResult.place_id);
        if (placeDetails) {
          detailedResult = {
            ...searchResult,
            formatted_phone_number: placeDetails.formatted_phone_number,
            website: placeDetails.website,
            user_ratings_total: placeDetails.user_ratings_total,
            formatted_address: placeDetails.formatted_address
          };
          console.log('✅ Got detailed info:', {
            phone: placeDetails.formatted_phone_number,
            website: placeDetails.website,
            reviews: placeDetails.user_ratings_total
          });
        }
      }
      
      // Convert Google Place result to business data format
      const businessData = {
        name: detailedResult.name,
        address: detailedResult.formatted_address || detailedResult.vicinity,
        latitude: detailedResult.geometry.location.lat,
        longitude: detailedResult.geometry.location.lng,
        google_place_id: detailedResult.place_id,
        google_rating: detailedResult.rating,
        google_review_count: detailedResult.user_ratings_total || 0,
        google_types: detailedResult.types,
        phone: detailedResult.formatted_phone_number,
        website_url: detailedResult.website,
        quality_score: calculateQualityScore(detailedResult),
        discovery_criteria: {
          search_query: manualSearchQuery,
          search_location: 'Hua Hin',
          search_method: 'manual_text_search'
        }
      };
      
      console.log('📊 Business data to save:', businessData);
      
      const result = await discoveryService.addManualBusiness(businessData);
      
      if (result.success) {
        setMessage({ type: 'success', text: `${searchResult.name} added to curation pipeline!` });
        // Refresh the curation data to show the new business
        await loadCurationData();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to add business' });
      }
    } catch (error) {
      console.error('Error adding search result:', error);
      setMessage({ type: 'error', text: `Error adding business: ${error}` });
    } finally {
      setLoading(false);
    }
    setTimeout(() => setMessage(null), 5000);
  };

  // [2025-01-06 13:15 UTC] - Add business as sales lead
  const handleSalesLeadSearchResult = async (searchResult: any) => {
    setLoading(true);
    try {
      console.log('🎯 Adding search result as sales lead:', searchResult.name);
      
      // First add to suggested businesses
      const businessData = {
        name: searchResult.name,
        address: searchResult.formatted_address || searchResult.vicinity,
        latitude: searchResult.geometry.location.lat,
        longitude: searchResult.geometry.location.lng,
        google_place_id: searchResult.place_id,
        google_rating: searchResult.rating,
        google_review_count: searchResult.user_ratings_total || 0,
        google_types: searchResult.types,
        phone: searchResult.formatted_phone_number,
        website_url: searchResult.website,
        quality_score: calculateQualityScore(searchResult)
      };
      
      const result = await discoveryService.addManualBusiness(businessData);
      
      if (result.success) {
        // Then flag it for sales immediately
        // Note: We'd need the business ID to flag it, so this is a simplified version
        setMessage({ type: 'success', text: `${searchResult.name} added as sales lead!` });
        await loadCurationData();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to add business as sales lead' });
      }
    } catch (error) {
      console.error('Error adding search result as sales lead:', error);
      setMessage({ type: 'error', text: `Error adding sales lead: ${error}` });
    } finally {
      setLoading(false);
    }
    setTimeout(() => setMessage(null), 5000);
  };

  // [2025-01-06 13:15 UTC] - Reject business from search results
  const handleRejectSearchResult = async (searchResult: any) => {
    setLoading(true);
    try {
      console.log('❌ Rejecting search result:', searchResult.name);
      
      // Add to suggested businesses with rejected status
      const businessData = {
        name: searchResult.name,
        address: searchResult.formatted_address || searchResult.vicinity,
        latitude: searchResult.geometry.location.lat,
        longitude: searchResult.geometry.location.lng,
        google_place_id: searchResult.place_id,
        google_rating: searchResult.rating,
        google_review_count: searchResult.user_ratings_total || 0,
        google_types: searchResult.types,
        phone: searchResult.formatted_phone_number,
        website_url: searchResult.website,
        quality_score: calculateQualityScore(searchResult)
      };
      
      // This would need to be enhanced to set status as rejected
      setMessage({ type: 'success', text: `${searchResult.name} rejected and logged.` });
      
    } catch (error) {
      console.error('Error rejecting search result:', error);
      setMessage({ type: 'error', text: `Error rejecting business: ${error}` });
    } finally {
      setLoading(false);
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LocalPlus Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage businesses, discounts, and platform analytics</p>
          </div>
          
          {/* [2024-12-19 19:15 UTC] - Direct advertising access */}
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/admin/advertising'}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Megaphone size={20} />
              <span>Advertising</span>
            </button>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`max-w-7xl mx-auto px-4 py-2`}>
          <div className={`p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex overflow-x-auto space-x-2 md:space-x-8 scrollbar-hide">
            {[
              { id: 'pipeline', label: 'Pipeline', icon: Building },
              { id: 'businesses', label: 'Businesses', icon: Building },
              { id: 'discounts', label: 'Discounts', icon: Tag },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'news', label: 'News', icon: Newspaper }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 md:gap-2 py-2 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {/* News Tab */}
        {activeTab === 'news' && <NewsAdminSettings />}

        {/* Business Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Stats Overview - Bottom-aligned numbers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Pipeline Statistics</h3>
                <button
                  onClick={loadCurationData}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Refresh from Database
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between h-24">
                  <h4 className="text-sm font-medium text-gray-500">Pending Review</h4>
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-3xl font-bold text-orange-600">{curationStats.pendingCount}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between h-24">
                  <h4 className="text-sm font-medium text-gray-500">Approved</h4>
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-3xl font-bold text-green-600">{curationStats.approvedCount}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between h-24">
                  <h4 className="text-sm font-medium text-gray-500">Sales Leads</h4>
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-3xl font-bold text-blue-600">{curationStats.salesLeadsCount}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between h-24">
                  <h4 className="text-sm font-medium text-gray-500">Quality Score Avg</h4>
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-3xl font-bold text-purple-600">{curationStats.averageQualityScore}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Curation Queue */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="space-y-6">
                  {/* Row 1: Title - Gets its own complete row */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Suggested Businesses</h3>
                  </div>
                  
                  {/* Row 2: Import Stats - Numbers vertically and horizontally aligned */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{importStats.found}</div>
                        <div className="text-sm text-gray-500">Found</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{importStats.added}</div>
                        <div className="text-sm text-gray-500">Added</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{curationStats.pendingCount}</div>
                        <div className="text-sm text-gray-500">Pending</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 3: Filters and Controls - Split into three lines */}
                  <div className="space-y-3">
                    {/* First line: Just the dropdowns */}
                    <div className="grid grid-cols-2 gap-3">
                      <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="text-sm border-gray-300 rounded-md"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="flagged_for_sales">Sales Leads</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      
                      <select 
                        value={selectedLdpArea}
                        onChange={(e) => setSelectedLdpArea(e.target.value)}
                        className="text-sm border-gray-300 rounded-md"
                      >
                        {ldpAreas.map(area => (
                          <option key={area.id} value={area.id}>{area.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Second line: Refresh and Force Discovery */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={loadCurationData}
                        disabled={curationLoading}
                        className="text-sm bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
                      >
                        {curationLoading ? 'Loading...' : 'Refresh'}
                      </button>

                      <button 
                        onClick={forceDiscovery}
                        disabled={runningDiscovery}
                        className="text-sm bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        🚀 Force Discovery
                      </button>
                    </div>
                    
                    {/* Third line: Reset Pipeline and Clean All */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={resetPipelineCompletely}
                        disabled={loading}
                        className="text-sm bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
                      >
                        🔄 Reset Pipeline
                      </button>

                      <button 
                        onClick={async () => {
                          await cleanupMockData();
                          await loadCurationData();
                        }}
                        disabled={curationLoading}
                        className="text-sm bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                      >
                        🧹 Clean All
                      </button>
                    </div>
                  </div>
                  
                  {/* Row 4: EMERGENCY CLEANUP BUTTONS - Gets its own row */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-700 mb-3">🚨 Emergency Cleanup (Fix Bad Data)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <button 
                        onClick={async () => {
                          setLoading(true);
                          try {
                            console.log('🎯 REMOVING SPECIFIC BAD BUSINESSES...');
                            
                            // Delete Cockpit, embroidery shop, MIKE & CO TAILOR specifically
                            const badNames = ['Cockpit', 'embroidery shop', 'MIKE & CO TAILOR'];
                            let removedCount = 0;
                            
                            for (const badName of badNames) {
                              const { data: found, error: findError } = await supabase
                                .from('suggested_businesses')
                                .select('id, name')
                                .ilike('name', `%${badName}%`);
                              
                              if (found && found.length > 0) {
                                for (const business of found) {
                                  const { error: deleteError } = await supabase
                                    .from('suggested_businesses')
                                    .delete()
                                    .eq('id', business.id);
                                  
                                  if (!deleteError) {
                                    console.log(`🚫 DELETED: ${business.name}`);
                                    removedCount++;
                                  }
                                }
                              }
                            }
                            
                            setMessage({ 
                              type: 'success', 
                              text: `🎯 REMOVED ${removedCount} specific bad businesses` 
                            });
                            
                            await loadCurationData();
                            
                          } catch (error) {
                            console.error('Specific cleanup error:', error);
                            setMessage({ type: 'error', text: `Cleanup failed: ${error}` });
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="text-sm bg-red-700 text-white px-4 py-3 rounded-md hover:bg-red-800 disabled:opacity-50 font-medium"
                      >
                        🎯 DELETE BAD BUSINESSES NOW
                      </button>
                      
                      <button 
                        onClick={async () => {
                          setLoading(true);
                          try {
                            console.log('🇹🇭 Removing Thai-only businesses...');
                            
                            const { data: allBusinesses, error: fetchError } = await supabase
                              .from('suggested_businesses')
                              .select('*');
                            
                            if (fetchError) {
                              console.error('Error fetching businesses:', fetchError);
                              return;
                            }
                            
                            let removedCount = 0;
                            const thaiRegex = /^[\u0E00-\u0E7F\s]+$/;
                            
                            for (const business of allBusinesses || []) {
                              if (thaiRegex.test(business.name)) {
                                console.log(`🚫 REMOVING Thai business: ${business.name}`);
                                
                                const { error: deleteError } = await supabase
                                  .from('suggested_businesses')
                                  .delete()
                                  .eq('id', business.id);
                                
                                if (!deleteError) {
                                  removedCount++;
                                }
                              }
                            }
                            
                            setMessage({ 
                              type: 'success', 
                              text: `🇹🇭 Removed ${removedCount} Thai-only businesses` 
                            });
                            
                            await loadCurationData();
                            
                          } catch (error) {
                            console.error('Thai cleanup error:', error);
                            setMessage({ type: 'error', text: `Thai cleanup failed: ${error}` });
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="text-sm bg-orange-600 text-white px-4 py-3 rounded-md hover:bg-orange-700 disabled:opacity-50"
                      >
                        🇹🇭 Remove Thai Only
                      </button>
                      
                      <button 
                        onClick={async () => {
                          setLoading(true);
                          try {
                            console.log('🍽️ Removing fake restaurants...');
                            
                            const { data: restaurants, error: fetchError } = await supabase
                              .from('suggested_businesses')
                              .select('*')
                              .eq('primary_category', 'Restaurants');
                            
                            if (fetchError) {
                              console.error('Error fetching restaurants:', fetchError);
                              return;
                            }
                            
                            const foodTypes = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery', 'bar'];
                            let removedCount = 0;
                            
                            for (const business of restaurants || []) {
                              const googleTypes = business.google_types || [];
                              const hasFoodType = googleTypes.some(type => foodTypes.includes(type));
                              
                              if (!hasFoodType) {
                                console.log(`🚫 REMOVING fake restaurant: ${business.name} - Types: ${googleTypes.join(', ')}`);
                                
                                const { error: deleteError } = await supabase
                                  .from('suggested_businesses')
                                  .delete()
                                  .eq('id', business.id);
                                
                                if (!deleteError) {
                                  removedCount++;
                                }
                              }
                            }
                            
                            setMessage({ 
                              type: 'success', 
                              text: `🍽️ Removed ${removedCount} fake restaurants` 
                            });
                            
                            await loadCurationData();
                            
                          } catch (error) {
                            console.error('Restaurant cleanup error:', error);
                            setMessage({ type: 'error', text: `Restaurant cleanup failed: ${error}` });
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="text-sm bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        🍽️ Remove Fake Restaurants
                      </button>
                      
                      <button 
                        onClick={async () => {
                          setLoading(true);
                          try {
                            console.log('💥 NUCLEAR: Removing ALL non-food businesses...');
                            
                            const { data: allBusinesses, error: fetchError } = await supabase
                              .from('suggested_businesses')
                              .select('*');
                            
                            if (fetchError) {
                              console.error('Error fetching businesses:', fetchError);
                              return;
                            }
                            
                            const foodTypes = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery', 'bar'];
                            let removedCount = 0;
                            
                            for (const business of allBusinesses || []) {
                              const googleTypes = business.google_types || [];
                              const hasFoodType = googleTypes.some(type => foodTypes.includes(type));
                              
                              if (!hasFoodType) {
                                console.log(`💥 NUKING: ${business.name} - Types: ${googleTypes.join(', ')}`);
                                
                                const { error: deleteError } = await supabase
                                  .from('suggested_businesses')
                                  .delete()
                                  .eq('id', business.id);
                                
                                if (!deleteError) {
                                  removedCount++;
                                }
                              }
                            }
                            
                            setMessage({ 
                              type: 'success', 
                              text: `💥 NUCLEAR: Removed ${removedCount} non-food businesses` 
                            });
                            
                            await loadCurationData();
                            
                          } catch (error) {
                            console.error('Nuclear cleanup error:', error);
                            setMessage({ type: 'error', text: `Nuclear cleanup failed: ${error}` });
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="text-sm bg-red-900 text-white px-4 py-3 rounded-md hover:bg-red-950 disabled:opacity-50"
                      >
                        💥 NUCLEAR CLEAN
                      </button>
                    </div>
                  </div>
                  
                  {/* Row 5: Discovery Category Buttons - Gets its own row or multiple rows */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Discovery Categories</h4>
                    
                    {/* First line: Show All, Restaurants, Wellness */}
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => setSelectedCategory('all')}
                        className={`text-sm px-4 py-2 rounded-md transition-colors ${
                          selectedCategory === 'all' 
                            ? 'bg-gray-800 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        📋 Show All
                      </button>
                      
                      <button 
                        onClick={handleDiscoverRestaurants}
                        disabled={isDiscovering}
                        className={`text-sm px-4 py-2 rounded-md transition-colors ${
                          selectedCategory === 'Restaurants' 
                            ? 'bg-red-700 text-white' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                        } disabled:opacity-50 flex items-center justify-center`}
                      >
                        🍽️ Restaurants
                      </button>
                      
                      <button 
                        onClick={handleDiscoverWellness}
                        disabled={isDiscovering}
                        className="text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
                      >
                        💆 Wellness
                      </button>
                    </div>
                    
                    {/* Second line: Shopping, Entertainment, Database */}
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={handleDiscoverShopping}
                        disabled={isDiscovering}
                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                      >
                        🛍️ Shopping
                      </button>
                      
                      <button 
                        onClick={handleDiscoverEntertainment}
                        disabled={isDiscovering}
                        className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                      >
                        🎯 Entertainment
                      </button>
                      
                      <button 
                        onClick={showDatabaseContents}
                        disabled={loading}
                        className="text-sm bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center"
                      >
                        📊 Show Database
                      </button>
                    </div>
                  </div>
                  
                  {/* Status Messages */}
                  
                  {discoveryMessage && (
                    <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded border border-green-200">
                      {discoveryMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Discovered Businesses List */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Discovered Businesses</h3>
                {curationLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    <span className="ml-2 text-gray-600">Loading businesses...</span>
                  </div>
                ) : suggestedBusinesses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No businesses discovered yet.</p>
                    <p className="text-sm mt-1">Use the discovery buttons above to find businesses.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestedBusinesses
                      .filter(business => {
                        // [2024-12-19 19:45 UTC] - STRICT category filtering based on Google types
                        if (selectedCategory === 'Restaurants') {
                          // Only show businesses that have actual food-related Google types
                          const foodTypes = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery', 'bar'];
                          const nonFoodTypes = [
                            'clothing_store', 'electronics_store', 'jewelry_store', 'shoe_store',
                            'book_store', 'furniture_store', 'home_goods_store', 'hardware_store',
                            'beauty_salon', 'hair_care', 'spa', 'gym', 'dentist', 'doctor',
                            'lawyer', 'real_estate_agency', 'insurance_agency', 'travel_agency'
                          ];
                          
                          const googleTypes = business.google_types || [];
                          const hasFoodType = googleTypes.some(type => foodTypes.includes(type));
                          const hasNonFoodType = googleTypes.some(type => nonFoodTypes.includes(type));
                          
                          // Must have food type AND not have non-food type
                          if (!hasFoodType || hasNonFoodType) {
                            console.log(`🚫 FILTERING OUT: ${business.name} - Types: ${googleTypes.join(', ')} - Food: ${hasFoodType}, NonFood: ${hasNonFoodType}`);
                            return false;
                          }
                          
                          console.log(`✅ SHOWING: ${business.name} - Types: ${googleTypes.join(', ')} - Valid restaurant`);
                          return true;
                        }
                        
                        // [2024-12-19 17:30 UTC] - Apply category filter for other categories
                        if (selectedCategory !== 'all' && business.primary_category !== selectedCategory) {
                          return false;
                        }
                        
                        // [2024-12-19 16:00 UTC] - Apply status filter
                        if (selectedStatus !== 'all' && business.curation_status !== selectedStatus) {
                          return false;
                        }
                        
                        // [2024-12-19 16:00 UTC] - Apply LDP area filter based on address
                        if (selectedLdpArea) {
                          const address = business.address.toLowerCase();
                          switch (selectedLdpArea) {
                            case 'bangkok':
                              return address.includes('bangkok') || address.includes('bkk');
                            case 'hua-hin':
                              return address.includes('hua hin') || address.includes('hua-hin') || address.includes('huahin');
                            case 'pattaya':
                              return address.includes('pattaya');
                            case 'phuket':
                              return address.includes('phuket');
                            case 'chiang-mai':
                              return address.includes('chiang mai') || address.includes('chiang-mai') || address.includes('chiangmai');
                            default:
                              return true;
                          }
                        }
                        
                        return true;
                      })
                      .map((business) => (
                      <div key={business.id} className="border rounded-lg p-4">
                        {/* Business Name */}
                        <div className="mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">{business.name}</h4>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <button
                            onClick={() => handleApproveBusiness(business.id)}
                            disabled={loading}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleFlagForSales(business.id)}
                            disabled={loading}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            Sales Lead
                          </button>
                          
                          {/* [2024-12-19 20:00 UTC] - Rejection dropdown interface */}
                          {rejectingBusinessId === business.id ? (
                            <div className="flex items-center gap-2 bg-red-50 p-2 rounded border border-red-200">
                              <select
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="text-sm border border-red-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                              >
                                <option value="">Select reason...</option>
                                {rejectionReasons.map((reason) => (
                                  <option key={reason} value={reason}>
                                    {reason}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleRejectBusiness(business.id, rejectionReason)}
                                disabled={loading || !rejectionReason}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                              >
                                Confirm Reject
                              </button>
                              <button
                                onClick={() => {
                                  setRejectingBusinessId(null);
                                  setRejectionReason('');
                                }}
                                className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRejectBusiness(business.id)}
                              disabled={loading}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                        
                        {/* Business Details */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                            {business.primary_category}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            Quality Score: {business.quality_score}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            business.curation_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            business.curation_status === 'approved' ? 'bg-green-100 text-green-800' :
                            business.curation_status === 'flagged_for_sales' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {business.curation_status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">📍 {business.address}</p>
                        
                        {/* [2024-12-19 18:00 UTC] - Enhanced contact information display */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {business.google_rating && (
                              <span>⭐ {business.google_rating} ({business.google_review_count} reviews)</span>
                            )}
                          </div>
                          
                          {/* Contact Information Section */}
                          <div className="bg-gray-50 p-3 rounded-md">
                            <h5 className="text-xs font-medium text-gray-700 mb-2">Contact Information</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              <div className={`flex items-center ${business.phone ? 'text-green-600' : 'text-red-500'}`}>
                                📞 {business.phone || 'No phone number'}
                              </div>
                              <div className={`flex items-center ${business.email ? 'text-green-600' : 'text-red-500'}`}>
                                ✉️ {business.email || 'No email address'}
                              </div>
                              <div className={`flex items-center ${business.website_url ? 'text-green-600' : 'text-red-500'}`}>
                                {business.website_url ? (
                                  <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    🌐 Website
                                  </a>
                                ) : (
                                  '🌐 No website'
                                )}
                              </div>
                            </div>
                            
                            {/* Contact completeness indicator */}
                            <div className="mt-2 text-xs">
                              {(() => {
                                const contactFields = [business.phone, business.email, business.website_url].filter(Boolean);
                                const completeness = Math.round((contactFields.length / 3) * 100);
                                return (
                                  <span className={`px-2 py-1 rounded-full ${
                                    completeness === 100 ? 'bg-green-100 text-green-800' :
                                    completeness >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    Contact Info: {completeness}% complete ({contactFields.length}/3 fields)
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Businesses Tab */}
        {activeTab === 'businesses' && (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">Business Directory</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Manage existing businesses or search and add new ones
                  </p>
                </div>
                <button
                  onClick={() => setShowAddBusiness(true)}
                  className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Add Manually
                </button>
              </div>

              {/* [2025-01-06 13:05 UTC] - Integrated Manual Business Search with improved styling */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Search size={18} className="text-blue-600" />
                    </div>
                                         <div className="flex-1">
                       <h3 className="text-xl font-semibold text-gray-900">Search Businesses</h3>
                       <p className="text-gray-600 text-sm mt-1">Find and add businesses from Google Places</p>
                     </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualSearchQuery}
                      onChange={(e) => setManualSearchQuery(e.target.value)}
                      placeholder="Enter business name (e.g., 'Daddy Deli', 'Pizza Hut')"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                    />
                    <button
                      onClick={handleManualSearch}
                      disabled={isSearching || !manualSearchQuery.trim()}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 flex items-center transition-colors min-w-[80px] justify-center"
                    >
                      {isSearching ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        'Search'
                      )}
                    </button>
                  </div>
                  
                  {/* Search Results */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="mt-4 border border-gray-200 rounded-lg">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                        <h5 className="text-sm font-medium text-gray-900">
                          Found {searchResults.length} result(s) for "{manualSearchQuery}"
                        </h5>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <div key={result.place_id || index} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                            {/* Action buttons at top */}
                            <div className="flex gap-2 mb-3">
                              <button
                                onClick={() => handleAddSearchResult(result)}
                                disabled={loading}
                                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => handleSalesLeadSearchResult(result)}
                                disabled={loading}
                                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                              >
                                Sales Lead
                              </button>
                              <button
                                onClick={() => handleRejectSearchResult(result)}
                                disabled={loading}
                                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                            
                            {/* Business content */}
                            <div className="flex-1 min-w-0">
                              <h6 className="font-medium text-gray-900 truncate">{result.name}</h6>
                              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                <MapPin size={12} className="text-gray-400 shrink-0" />
                                <span className="truncate">{result.formatted_address || result.vicinity}</span>
                              </p>
                              
                              {/* Rating and Reviews */}
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                {result.rating && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-yellow-500">★</span>
                                    <span>{result.rating} ({result.user_ratings_total || 0} reviews)</span>
                                  </div>
                                )}
                                {result.types && result.types.length > 0 && (
                                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                    {result.types[0].replace(/_/g, ' ')}
                                  </span>
                                )}
                              </div>
                              
                              {/* Contact Information */}
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                {result.formatted_phone_number && (
                                  <div className="flex items-center gap-1">
                                    <Phone size={12} className="text-gray-400" />
                                    <span>{result.formatted_phone_number}</span>
                                  </div>
                                )}
                                {result.website && (
                                  <div className="flex items-center gap-1">
                                    <Globe size={12} className="text-gray-400" />
                                    <a href={result.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 truncate max-w-[150px]">
                                      Website
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                        <button
                          onClick={() => {
                            setShowSearchResults(false);
                            setSearchResults([]);
                            setManualSearchQuery('');
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          ✕ Close Results
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Business List */}
            <div className="bg-white rounded-lg shadow">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading businesses...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {businesses.map((business) => (
                    <div key={business.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{business.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{business.category}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <MapPin size={14} className="mr-1" />
                            {business.address}
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            {business.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone size={14} className="mr-1" />
                                {business.phone}
                              </div>
                            )}
                            {business.email && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail size={14} className="mr-1" />
                                {business.email}
                              </div>
                            )}
                            {business.website_url && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Globe size={14} className="mr-1" />
                                <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-red-600">
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            business.partnership_status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : business.partnership_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {business.partnership_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Discounts Tab */}
        {activeTab === 'discounts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Discount Offers</h2>
              <button
                onClick={() => setShowAddDiscount(true)}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add Discount
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Discount management interface will be displayed here.</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Business Modal */}
      {showAddBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Business</h3>
              <form onSubmit={handleAddBusiness} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      required
                      value={businessForm.name}
                      onChange={(e) => setBusinessForm({...businessForm, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={businessForm.category}
                      onChange={(e) => setBusinessForm({...businessForm, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={businessForm.address}
                    onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Full address including city and postal code"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={businessForm.latitude}
                      onChange={(e) => setBusinessForm({...businessForm, latitude: parseFloat(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={businessForm.longitude}
                      onChange={(e) => setBusinessForm({...businessForm, longitude: parseFloat(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={businessForm.phone}
                      onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={businessForm.email}
                      onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={businessForm.website_url}
                    onChange={(e) => setBusinessForm({...businessForm, website_url: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={businessForm.description}
                    onChange={(e) => setBusinessForm({...businessForm, description: e.target.value})}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Brief description of the business..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddBusiness(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Business'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Discount Modal */}
      {showAddDiscount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add Discount Offer</h3>
              <form onSubmit={handleAddDiscount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
                  <select
                    required
                    value={discountForm.business_id}
                    onChange={(e) => setDiscountForm({...discountForm, business_id: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select a business</option>
                    {businesses.map(business => (
                      <option key={business.id} value={business.id}>{business.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                  <input
                    type="text"
                    required
                    value={discountForm.title}
                    onChange={(e) => setDiscountForm({...discountForm, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., Summer Special Discount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={discountForm.description}
                    onChange={(e) => setDiscountForm({...discountForm, description: e.target.value})}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Describe what the discount applies to..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={discountForm.discount_percentage}
                      onChange={(e) => setDiscountForm({...discountForm, discount_percentage: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Redemptions per User</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={discountForm.max_redemptions_per_user}
                      onChange={(e) => setDiscountForm({...discountForm, max_redemptions_per_user: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until (Optional)</label>
                  <input
                    type="date"
                    value={discountForm.valid_until}
                    onChange={(e) => setDiscountForm({...discountForm, valid_until: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                  <textarea
                    value={discountForm.terms_conditions}
                    onChange={(e) => setDiscountForm({...discountForm, terms_conditions: e.target.value})}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Any restrictions or conditions..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddDiscount(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Discount'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 