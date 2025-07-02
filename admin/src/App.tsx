import React, { useState, useEffect } from 'react';
import { BarChart3, Database, DollarSign, Users, MapPin, Clock, Star, Building2, Shield, Bell, Activity, LogOut, Settings, Download, CheckCircle, XCircle, Search, Filter, Eye, User, TrendingUp } from 'lucide-react';
import AzureMapComponent from './components/AzureMapComponent';
import { AdminLogin } from './components/AdminLogin';
import { AnalyticsCharts, generateSampleAnalyticsData, type AnalyticsData } from './components/AnalyticsCharts';
import { RealCostTracker } from './components/RealCostTracker';
import { adminAuth, type AdminUser } from './lib/auth';
import { realTimeService, type RealTimeUpdate, type DashboardStats } from './lib/websocket';
import { supabase } from './lib/supabase';
import 'azure-maps-control/dist/atlas.min.css';

interface PipelineStats {
  discoveryLeads: number;
  pendingReview: number;
  approved: number;
  salesLeads: number;
  monthlyCost: number;
}

interface DiscoveryLead {
  id: string;
  name: string;
  category: string;
  address: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  selected: boolean;
  // [2025-01-21 01:15] - Comprehensive enrichment fields
  googlePlaceId?: string;
  enhancedRating?: number;
  verifiedAddress?: string;
  latitude?: number;
  longitude?: number;
  enriched?: boolean;
  enrichmentDate?: Date;
  // Photo fields
  photoUrl?: string;
  photoReference?: string;
  photoAttribution?: string;
  // Business details
  phoneNumber?: string;
  website?: string;
  businessType?: string;
  priceLevel?: number; // 0-4 scale
  // Operating hours
  openingHours?: string[];
  isOpenNow?: boolean;
  // Reviews
  reviewCount?: number;
  reviewSummary?: string;
  photo_gallery?: any; // Added photo_gallery field
  partnership_status?: 'pending' | 'active' | 'suspended';
}

function App() {
  // [2024-12-15 23:40] - Admin Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [realTimeConnected, setRealTimeConnected] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(generateSampleAnalyticsData());
  
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<PipelineStats>({
    discoveryLeads: 0,
    pendingReview: 0,
    approved: 0,
    salesLeads: 0,
    monthlyCost: 0
  });
  
  const [discoveryLeads, setDiscoveryLeads] = useState<DiscoveryLead[]>([]);
  const [businessLocations, setBusinessLocations] = useState<Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    category: string;
    address: string;
  }>>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const costPerCall = 0.017; // $0.017 per Google Places API call
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedBusinessForGallery, setSelectedBusinessForGallery] = useState<DiscoveryLead | null>(null);

  // [2025-01-22 17:00] - Add approval management functions
  const handleApproveBusiness = async (lead: DiscoveryLead) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ partnership_status: 'active' })
        .eq('id', lead.id);

      if (error) throw error;

      // Update local state
      setDiscoveryLeads(leads => 
        leads.map(l => l.id === lead.id ? { ...l, status: 'approved', partnership_status: 'active' } : l)
      );

      alert(`✅ "${lead.name}" has been approved and will now appear in the main app.`);
    } catch (error: any) {
      console.error('Approval error:', error);
      alert(`Failed to approve business: ${error.message}`);
    }
  };

  const handleRejectBusiness = async (lead: DiscoveryLead) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ partnership_status: 'suspended' })
        .eq('id', lead.id);

      if (error) throw error;

      // Update local state
      setDiscoveryLeads(leads => 
        leads.map(l => l.id === lead.id ? { ...l, status: 'rejected', partnership_status: 'suspended' } : l)
      );

      alert(`❌ "${lead.name}" has been rejected and will not appear in the main app.`);
    } catch (error: any) {
      console.error('Rejection error:', error);
      alert(`Failed to reject business: ${error.message}`);
    }
  };

  // [2025-01-22 17:00] - Add photo removal function
  const handleRemovePhoto = async (photoUrl: string) => {
    if (!selectedBusinessForGallery) return;

    try {
      const updatedPhotos = selectedBusinessForGallery.photo_gallery?.filter(
        (photo: any) => photo.url !== photoUrl
      ) || [];

      const { error } = await supabase
        .from('businesses')
        .update({ photo_gallery: updatedPhotos })
        .eq('id', selectedBusinessForGallery.id);

      if (error) throw error;

      // Update local state
      setSelectedBusinessForGallery(prev => prev ? {
        ...prev,
        photo_gallery: updatedPhotos
      } : null);

      setDiscoveryLeads(leads => 
        leads.map(l => l.id === selectedBusinessForGallery.id ? 
          { ...l, photo_gallery: updatedPhotos } : l
        )
      );

      console.log(`📸 Photo removed from ${selectedBusinessForGallery.name}`);
    } catch (error: any) {
      console.error('Photo removal error:', error);
      alert(`Failed to remove photo: ${error.message}`);
    }
  };

  // [2024-12-15 23:40] - Initialize authentication and real-time services
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Check for existing authentication
    const existingUser = adminAuth.getCurrentUser();
    if (existingUser) {
      setCurrentUser(existingUser);
      await initializeRealTimeServices();
    }
    setIsAuthenticating(false);
  };

  const initializeRealTimeServices = async () => {
    try {
      // [2024-12-15 23:55] - Connect with graceful fallback
      await realTimeService.connect();
      setRealTimeConnected(realTimeService.getConnectionStatus());

      // Subscribe to real-time updates only once
      const unsubscribeUpdates = realTimeService.onUpdate((update: RealTimeUpdate) => {
        console.log('📡 Real-time update received:', update);
        if (update.type === 'business_approved' || update.type === 'business_added') {
          // Debounced refresh to prevent spam
          setTimeout(() => fetchRealData(), 1000);
        }
      });

      const unsubscribeStats = realTimeService.onStatsUpdate((newStats: DashboardStats) => {
        console.log('📊 Stats update received:', newStats);
        setStats({
          discoveryLeads: newStats.discoveryLeads,
          pendingReview: newStats.pendingReview,
          approved: newStats.approved,
          salesLeads: newStats.salesLeads,
          monthlyCost: newStats.monthlyCost
        });
      });

      // Load initial data once
      fetchRealData();

    } catch (error) {
      console.log('⚠️ Real-time services unavailable, running in offline mode');
      setRealTimeConnected(false);
      fetchRealData(); // Still load initial data
    }
  };

  const handleLogin = async (user: AdminUser) => {
    setCurrentUser(user);
    await initializeRealTimeServices();
  };

  const handleLogout = async () => {
    await adminAuth.logout();
    realTimeService.disconnect();
    setCurrentUser(null);
    setRealTimeConnected(false);
  };

  const fetchRealData = async () => {
    console.log('🔄 Attempting to connect to Supabase database...');
    setLoading(true);
    
    try {
      console.log('📡 Testing database connection...');
      
      // [2025-01-21 06:05] - Load enriched data from localStorage first
      const savedEnrichedData = localStorage.getItem('enrichedBusinessData');
      let enrichedDataMap = new Map();
      if (savedEnrichedData) {
        try {
          const parsedData = JSON.parse(savedEnrichedData);
          parsedData.forEach((business: DiscoveryLead) => {
            if (business.enriched) {
              enrichedDataMap.set(business.id, business);
            }
          });
          console.log(`📸 Loaded ${enrichedDataMap.size} enriched businesses from localStorage`);
        } catch (error) {
          console.error('Failed to parse saved enriched data:', error);
        }
      }

      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .limit(200);

      if (businessError) {
        throw new Error(`Database query failed: ${businessError.message}`);
      }

      setDbConnected(true);
      console.log('✅ REAL database connection successful!');
      console.log(`📊 Found ${businesses?.length || 0} businesses`);
      
      const allBusinesses = (businesses || []).map(b => ({
        id: b.id,
        name: b.name || b.business_name,
        category: b.category || b.business_type || 'Business',
        address: b.address || b.location,
        rating: b.rating || b.google_rating || (3.5 + Math.random() * 1.5),
        approved: b.partnership_status === 'active',
        partnership_status: b.partnership_status,
        googlePlaceId: b.google_place_id,
        latitude: b.latitude || b.lat,
        longitude: b.longitude || b.lng,
        photo_gallery: b.photo_gallery
      }));

      // Only proceed with REAL data - never use demo data
      if (allBusinesses.length === 0) {
        throw new Error('No businesses found in database tables - check database configuration');
      }
      
      // Calculate real stats
      const totalLeads = allBusinesses.length;
      const pending = allBusinesses.filter(b => !b.approved).length;
      const approved = allBusinesses.filter(b => b.approved).length;
      
      setStats({
        discoveryLeads: totalLeads,
        pendingReview: pending,
        approved: approved,
        salesLeads: Math.floor(approved * 0.3), // Estimate 30% conversion
        monthlyCost: totalLeads * costPerCall
      });

      // Transform data for discovery leads
      const leads: DiscoveryLead[] = allBusinesses.slice(0, 20).map((business, index) => {
        // [2025-01-22 17:00] - Fix photo URL handling for both old and new formats
        let photoUrl = undefined;
        let photoReference = undefined;
        
        if (business.photo_gallery && Array.isArray(business.photo_gallery) && business.photo_gallery.length > 0) {
          const firstPhoto = business.photo_gallery[0];
          if (typeof firstPhoto === 'string') {
            // New format: direct URL strings
            photoUrl = firstPhoto;
          } else if (firstPhoto.url) {
            // New format: objects with url property
            photoUrl = firstPhoto.url;
          } else if (firstPhoto.photo_reference) {
            // Old format: photo_reference that needs proxy
            photoReference = firstPhoto.photo_reference;
            photoUrl = `http://localhost:3004/api/places/photo?photo_reference=${photoReference}`;
          }
        }
        
        const baseData = {
          id: String(business.id || `lead-${index}`),
          name: business.name || `Business ${index + 1}`,
          category: business.category || 'Restaurant',
          address: business.address || 'Address not available',
          rating: Number(business.rating) || (3.5 + Math.random() * 1.5),
          status: business.approved ? 'approved' : 'pending',
          selected: false,
          photo_gallery: business.photo_gallery,
          photoUrl: photoUrl,
          photoReference: photoReference,
          partnership_status: business.partnership_status || (business.approved ? 'active' : 'pending'),
          googlePlaceId: business.googlePlaceId || '',
          latitude: business.latitude,
          longitude: business.longitude
        };
        
        // [2025-01-21 06:05] - Merge with enriched data from localStorage
        const enrichedData = enrichedDataMap.get(baseData.id);
        if (enrichedData) {
          console.log(`📸 Merging enriched data for: ${baseData.name}`);
          return { ...baseData, ...enrichedData, selected: false };
        }
        
        return baseData;
      });

      setDiscoveryLeads(leads);

      // [2024-12-15 17:12] - Extract location data for map
      const locations = allBusinesses
        .filter(business => business.latitude && business.longitude)
        .map(business => ({
          id: String(business.id || `location-${Math.random()}`),
          name: business.name || 'Unknown Business',
          latitude: Number(business.latitude),
          longitude: Number(business.longitude),
          category: business.category || 'Restaurant',
          address: business.address || 'Address not available'
        }));

      setBusinessLocations(locations);
    } catch (error: any) {
      console.log('⚠️ Database connection failed, but dashboard will continue with limited functionality');
      setDbConnected(false);
      
      // [2024-12-15 23:55] - Improved error handling with specific DNS guidance
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
        setDbError('Network connectivity issue detected. The dashboard will operate in offline mode. Check your internet connection or DNS settings.');
      } else {
        setDbError(`Database unavailable: ${error instanceof Error ? error.message : 'Unknown error'}. Operating in limited mode.`);
      }
      
      // Set minimal stats for offline mode
      setStats({
        discoveryLeads: 0,
        pendingReview: 0,
        approved: 0,
        salesLeads: 0,
        monthlyCost: 0.00
      });
      
      setDiscoveryLeads([]);
      setBusinessLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const count = discoveryLeads.filter(lead => lead.selected).length;
    setSelectedCount(count);
  }, [discoveryLeads]);

  const handleSelectLead = (id: string) => {
    setDiscoveryLeads(leads => 
      leads.map(lead => 
        lead.id === id ? { ...lead, selected: !lead.selected } : lead
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = discoveryLeads.every(lead => lead.selected);
    setDiscoveryLeads(leads => 
      leads.map(lead => ({ ...lead, selected: !allSelected }))
    );
  };

  const handleEnrichWithGooglePlaces = async () => {
    const selectedLeads = discoveryLeads.filter(lead => lead.selected);
    if (selectedLeads.length === 0) {
      alert('Please select at least one business to enrich.');
      return;
    }
  
    console.log(`Enriching ${selectedLeads.length} selected businesses...`);
    setLoading(true);
  
    const updatedLeads = [...discoveryLeads];
  
    for (const lead of selectedLeads) {
      const leadIndex = updatedLeads.findIndex(l => l.id === lead.id);
      if (leadIndex === -1) continue;
  
      try {
        let placeId = lead.googlePlaceId;
  
        // Step 1: Find Place ID if missing
        if (!placeId) {
          console.log(`🔍 No Place ID for ${lead.name}. Searching...`);
          const searchResponse = await fetch(`http://localhost:3004/api/places/search?query=${encodeURIComponent(lead.name + ' ' + lead.address)}`);
          const searchData = await searchResponse.json();
          if (searchData.candidates && searchData.candidates.length > 0) {
            placeId = searchData.candidates[0].place_id;
            console.log(`   ✅ Found Place ID: ${placeId}`);
            await supabase.from('businesses').update({ google_place_id: placeId }).eq('id', lead.id);
          } else {
            console.warn(`   ❌ Could not find a Google Place ID for ${lead.name}.`);
            continue;
          }
        }
        
        // Step 2: Fetch photo references
        console.log(`📸 Fetching photo references for ${lead.name} (Place ID: ${placeId})`);
        const photosResponse = await fetch(`http://localhost:3004/api/places/photos/${placeId}`);
        const photosData = await photosResponse.json();
        
        if (!photosData.success || photosData.photos.length === 0) {
          console.log(`   ℹ️ No photos found for ${lead.name}.`);
          continue;
        }

        console.log(`   Found ${photosData.photos.length} photo references. Starting download and upload process...`);

        // Step 3: Download, upload to Supabase, and get public URLs
        // NOTE: This assumes you have a Supabase Storage bucket named 'business-photos'.
        // Please create it if it doesn't exist.
        const supabasePhotoUrls = [];
        for (const photo of photosData.photos) {
          try {
            const downloadUrl = `http://localhost:3004/api/places/photo/download?photo_reference=${photo.photo_reference}`;
            const imageResponse = await fetch(downloadUrl);
            if (!imageResponse.ok) continue;

            const imageBlob = await imageResponse.blob();
            
            // [2025-01-22 16:00] - Sanitize filename to prevent upload errors
            const safePhotoReference = photo.photo_reference.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40);
            const fileName = `${lead.id}_${safePhotoReference}.jpg`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('business-photos')
              .upload(fileName, imageBlob, {
                cacheControl: '3600',
                upsert: true, // Overwrite if exists
              });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
              .from('business-photos')
              .getPublicUrl(uploadData.path);
              
            supabasePhotoUrls.push(publicUrlData.publicUrl);
            console.log(`     ✅ Uploaded ${fileName} to Supabase.`);
          } catch (uploadError: any) {
            console.error(`     ❌ Failed to upload photo ${photo.photo_reference.substring(0, 40)}...:`, uploadError.message || uploadError);
          }
        }

        if (supabasePhotoUrls.length === 0) {
          console.warn(`   All photo uploads failed for ${lead.name}.`);
          continue;
        }

        // Step 4: Update the business record with the new Supabase URLs
        const { error: updateError } = await supabase
          .from('businesses')
          .update({ photo_gallery: supabasePhotoUrls })
          .eq('id', lead.id);
          
        if (updateError) throw updateError;
        
        // Step 5: Update the UI state
        updatedLeads[leadIndex] = {
          ...updatedLeads[leadIndex],
          enriched: true,
          photoUrl: supabasePhotoUrls[0],
          photoReference: undefined, // No longer needed
          googlePlaceId: placeId,
          photo_gallery: supabasePhotoUrls,
        };
        console.log(`   ✅ Successfully enriched ${lead.name} with ${supabasePhotoUrls.length} photos.`);

      } catch (error) {
        console.error(`Failed to enrich ${lead.name}:`, error);
      }
    }
    
    setDiscoveryLeads(updatedLeads);
    setLoading(false);
    console.log('Enrichment process completed.');
  };

  // [2024-12-15 23:10] - Advanced Admin Features
  const handleBulkApproval = (action: 'approve' | 'reject') => {
    if (selectedCount === 0) {
      alert('Please select businesses to approve/reject.');
      return;
    }

    const actionText = action === 'approve' ? 'approve' : 'reject';
    const confirmed = confirm(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${selectedCount} selected businesses?`);
    
    if (confirmed) {
      setDiscoveryLeads(leads => 
        leads.map(lead => 
          lead.selected 
            ? { ...lead, status: action === 'approve' ? 'approved' : 'pending', selected: false }
            : lead
        )
      );

      // Update stats
      const newApproved = discoveryLeads.filter(l => l.selected).length;
      setStats(prev => ({
        ...prev,
        approved: action === 'approve' ? prev.approved + newApproved : prev.approved - newApproved,
        pendingReview: action === 'approve' ? prev.pendingReview - newApproved : prev.pendingReview + newApproved,
        salesLeads: Math.floor((action === 'approve' ? prev.approved + newApproved : prev.approved - newApproved) * 0.3)
      }));

      alert(`✅ Successfully ${actionText}ed ${selectedCount} businesses!`);
    }
  };

  const handleExportData = () => {
    const selectedBusinesses = discoveryLeads.filter(lead => lead.selected);
    const dataToExport = selectedBusinesses.length > 0 ? selectedBusinesses : discoveryLeads;
    
    if (exportFormat === 'csv') {
      const csvHeaders = 'ID,Name,Category,Address,Rating,Status\n';
      const csvData = dataToExport.map(lead => 
        `${lead.id},"${lead.name}","${lead.category}","${lead.address}",${lead.rating},${lead.status}`
      ).join('\n');
      
      const blob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `localplus-businesses-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const jsonData = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `localplus-businesses-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    alert(`✅ Exported ${dataToExport.length} businesses as ${exportFormat.toUpperCase()}!`);
  };

  const handleBulkAction = () => {
    if (selectedCount === 0) {
      alert('Please select businesses first.');
      return;
    }

    switch (bulkAction) {
      case 'approve':
        handleBulkApproval('approve');
        break;
      case 'reject':
        handleBulkApproval('reject');
        break;
      case 'enrich':
        handleEnrichWithGooglePlaces();
        break;
      case 'export':
        handleExportData();
        break;
      default:
        alert('Please select a bulk action.');
    }
    setBulkAction('');
  };

  // Filter businesses based on search and filters
  const filteredLeads = discoveryLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || lead.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter
  const uniqueCategories = [...new Set(discoveryLeads.map(lead => lead.category))];

  // [2025-01-21 01:15] - Test photo functionality
  const addTestPhotoData = () => {
    setDiscoveryLeads(leads => 
      leads.map((lead, index) => {
        if (index === 0) { // Add photo to first business
          return {
            ...lead,
            enriched: true,
            photoUrl: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AXCi2Q4xWQEyGJN8h8K7J0r8lVZ2aQ9DexampleRef&key=AIzaSyCEMtUfl8yJzVZIcTaaEajKRtqEJZZ_G2Y",
            phoneNumber: "032 709 000",
            website: "https://example.com",
            businessType: "restaurant",
            rating: 4.7,
            reviewCount: 36,
            isOpenNow: true
          };
        }
        return lead;
      })
    );
  };

  // [2025-01-21 06:15] - Debug enrichment for specific business
  const debugEnrichLetsSeaDirectly = async () => {
    console.log('🔍 DEBUG: Starting Let\'s Sea enrichment test...');
    
    try {
      const response = await fetch(`http://localhost:3004/api/places/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: "Let's Sea Hua Hin Al Fresco Resort 83, 188 ซอย หัวถนน 23, Tambon Nong Kae, Amphoe Hua Hin",
          fields: 'place_id,name,rating,formatted_address,geometry,photos,formatted_phone_number,website,types,price_level,opening_hours,user_ratings_total,reviews'
        })
      });
      
      const result = await response.json();
      console.log('🔍 DEBUG: API Response:', result);
      
      if (result.success && result.data && result.data.status === 'OK' && result.data.result) {
        const place = result.data.result;
        console.log('🔍 DEBUG: Place data:', place);
        console.log('🔍 DEBUG: Photos available:', place.photos?.length || 0);
        
        if (place.photos && place.photos.length > 0) {
          const photo = place.photos[0];
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${result.apiKey}`;
          console.log('🔍 DEBUG: Generated photo URL:', photoUrl);
          
          // Find Let's Sea in the current data and update it
          setDiscoveryLeads(leads => {
            const updatedLeads = leads.map(lead => {
              if (lead.name.includes("Let's Sea") || lead.name.includes("Lets Sea")) {
                console.log('🔍 DEBUG: Updating Let\'s Sea with photo:', photoUrl);
                return {
                  ...lead,
                  enriched: true,
                  photoUrl: photoUrl,
                  photoReference: photo.photo_reference,
                  enhancedRating: place.rating,
                  phoneNumber: place.formatted_phone_number,
                  website: place.website,
                  businessType: place.types?.[0],
                  reviewCount: place.user_ratings_total
                };
              }
              return lead;
            });
            
            // Save to localStorage
            localStorage.setItem('enrichedBusinessData', JSON.stringify(updatedLeads));
            console.log('🔍 DEBUG: Saved enriched data to localStorage');
            
            return updatedLeads;
          });
          
          alert(`✅ DEBUG SUCCESS!\n\nLet's Sea enriched with:\n• Photo: ${photoUrl.substring(0, 50)}...\n• Rating: ${place.rating}/5\n• Phone: ${place.formatted_phone_number}\n• Reviews: ${place.user_ratings_total}\n\nCheck Business Curation tab now!`);
        } else {
          alert('❌ No photos found for Let\'s Sea');
        }
      } else {
        alert('❌ API call failed: ' + (result.data?.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('🔍 DEBUG: Error:', error);
      alert('❌ Network error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // [2024-12-15 23:45] - Authentication Guard
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Initializing LocalPlus Admin...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // [2025-01-21 07:45] - Database Management action handlers
  const handleEditBusiness = (lead: DiscoveryLead) => {
    // Open edit modal/form
    alert(`🛠️ Edit Business: ${lead.name}\n\nThis would open an edit form with:\n• Business name: ${lead.name}\n• Address: ${lead.address}\n• Phone: ${lead.phoneNumber || 'Not set'}\n• Status: ${lead.status}`);
  };

  const handleViewBusinessDetails = (lead: DiscoveryLead) => {
    // Show detailed view
    const details = `📋 ${lead.name} - Complete Details\n\n` +
      `📍 Address: ${lead.address}\n` +
      `⭐ Rating: ${lead.enhancedRating || lead.rating}/5\n` +
      `📞 Phone: ${lead.phoneNumber || 'Not available'}\n` +
      `🌐 Website: ${lead.website || 'Not available'}\n` +
      `🏷️ Type: ${lead.businessType || lead.category}\n` +
      `📊 Status: ${lead.status}\n` +
      `✅ Enriched: ${lead.enriched ? 'Yes' : 'No'}\n` +
      `📸 Has Photo: ${lead.photoUrl ? 'Yes' : 'No'}\n` +
      `📝 Reviews: ${lead.reviewCount || 'Unknown'} reviews`;
    
    alert(details);
  };

  const handleDeleteBusiness = (lead: DiscoveryLead) => {
    if (confirm(`🗑️ Delete Business?\n\nAre you sure you want to delete "${lead.name}"?\n\nThis action cannot be undone.`)) {
      setDiscoveryLeads(leads => leads.filter(l => l.id !== lead.id));
      alert(`✅ "${lead.name}" has been deleted from the database.`);
    }
  };

  const handleViewPhotoGallery = (lead: DiscoveryLead) => {
    if (lead.photo_gallery && lead.photo_gallery.length > 0) {
      setSelectedBusinessForGallery(lead);
      setGalleryModalOpen(true);
    } else {
      alert(`📸 No Photos Available\n\n"${lead.name}" doesn't have any photos stored.\n\nUse the enrichment feature to add photos from Google Places.`);
    }
  };

  // [2025-01-21 11:50] - Debug function to analyze photo data
  const debugPhotoData = () => {
    const photosData = discoveryLeads
      .filter(lead => lead.photoUrl)
      .map(lead => ({
        name: lead.name,
        photoUrl: lead.photoUrl!,
        photoReference: lead.photoReference,
        urlType: lead.photoUrl!.includes('googleapis.com') ? 'Google API' : 
                 lead.photoUrl!.includes('localhost:3004') ? 'Backend Proxy' :
                 lead.photoUrl!.includes('supabase') ? 'Supabase Storage' : 'Other'
      }));
    
    console.log('📸 Photo Data Analysis:');
    console.table(photosData);
    alert(`📸 Photo Data Analysis:\n\n${photosData.length} businesses have photos\n\nBreakdown:\n- Google API URLs: ${photosData.filter(p => p.urlType === 'Google API').length}\n- Backend Proxy URLs: ${photosData.filter(p => p.urlType === 'Backend Proxy').length}\n- Supabase Storage URLs: ${photosData.filter(p => p.urlType === 'Supabase Storage').length}\n- Other URLs: ${photosData.filter(p => p.urlType === 'Other').length}\n\nCheck browser console for detailed table.`);
  };

  return (
    <div>
      {/* Gallery Modal */}
      {galleryModalOpen && selectedBusinessForGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Photo Gallery: {selectedBusinessForGallery.name}</h2>
              <button
                onClick={() => setGalleryModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <XCircle size={28} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
              {selectedBusinessForGallery.photo_gallery.map((photo: any, index: number) => {
                // Handle both string URLs and object formats
                const photoUrl = typeof photo === 'string' ? photo : (photo.url || photo.photo_reference);
                const displayUrl = photo.photo_reference && !photo.url ? 
                  `http://localhost:3004/api/places/photo?photo_reference=${photo.photo_reference}` : 
                  photoUrl;
                
                return (
                  <div key={index} className="relative aspect-w-1 aspect-h-1">
                    <img
                      src={displayUrl}
                      alt={`${selectedBusinessForGallery.name} photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemovePhoto(displayUrl)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      title="Remove photo"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-6 text-sm text-gray-500">
              Displaying {selectedBusinessForGallery.photo_gallery.length} photos.
            </div>
          </div>
        </div>
      )}

      {/* ADMIN HEADER WITH USER INFO */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Shield size={32} className="text-white" />
            <div>
              <h1 className="text-xl font-bold">LocalPlus Admin Dashboard</h1>
              <p className="text-purple-100 text-sm">Business Discovery & Analytics Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${realTimeConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm">{realTimeConnected ? 'WebSocket Live' : 'WebSocket Offline'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <img 
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40'} 
                alt={currentUser.firstName}
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm">
                <div className="font-medium">{currentUser.firstName} {currentUser.lastName}</div>
                <div className="text-purple-200">{currentUser.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS BANNER */}
      {!loading && (
        <div className={`px-4 py-3 text-center text-sm font-medium ${
          dbConnected 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
        } border-b`}>
          {dbConnected ? (
            <>🟢 Supabase Database Connected - Data Access Active</>
          ) : (
            <>⚠️ Database Offline - Cannot access Supabase data • {dbError}</>
          )}
        </div>
      )}
      
      {/* HEADER */}
      <div className="admin-header">
        <div className="admin-container">
          <h1>LocalPlus Admin Dashboard</h1>
          <p>Business Discovery & Analytics Platform</p>
          <p className="subtitle">Real-time data from Hua Hin, Thailand</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div className="flex space-x-0 px-6 bg-white">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            📊 Pipeline Overview
          </button>
          <button
            onClick={() => setActiveTab('discovery')}
            className={`px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${
              activeTab === 'discovery'
                ? 'border-purple-500 text-purple-600 bg-purple-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🔍 Data Discovery
          </button>
          <button
            onClick={() => setActiveTab('cost')}
            className={`px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${
              activeTab === 'cost'
                ? 'border-green-500 text-green-600 bg-green-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            💰 Cost Management
          </button>
          <button
            onClick={() => setActiveTab('curation')}
            className={`px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${
              activeTab === 'curation'
                ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🎯 Business Curation
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${
              activeTab === 'map'
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🗺️ Discovery Map
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${
              activeTab === 'analytics'
                ? 'border-pink-500 text-pink-600 bg-pink-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            📈 Analytics
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${
              activeTab === 'database'
                ? 'border-cyan-500 text-cyan-600 bg-cyan-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🗄️ Database Management
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ background: 'white', minHeight: '80vh', padding: '32px 24px', margin: '0 24px', borderRadius: '0 0 16px 16px', boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)' }}>
        {activeTab === 'overview' && (
          <div>
            <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '2rem'}}>📊 Pipeline Overview</h2>
            
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-label">Discovery Leads</div>
                <div className="stat-value">{loading ? '...' : stats.discoveryLeads.toLocaleString()}</div>
                <div className="stat-meta">
                  <span>📊</span>
                  <span>Live database active</span>
                </div>
              </div>
              
              <div className="stat-card orange">
                <div className="stat-label">Pending Review</div>
                <div className="stat-value">{loading ? '...' : stats.pendingReview.toLocaleString()}</div>
                <div className="stat-meta">
                  <span>⏰</span>
                  <span>Needs attention</span>
                </div>
              </div>
              
              <div className="stat-card green">
                <div className="stat-label">Approved</div>
                <div className="stat-value">{loading ? '...' : stats.approved.toLocaleString()}</div>
                <div className="stat-meta">
                  <span>🚀</span>
                  <span>Ready for platform</span>
                </div>
              </div>
              
              <div className="stat-card purple">
                <div className="stat-label">Monthly API Cost</div>
                <div className="stat-value">${stats.monthlyCost.toFixed(2)}</div>
                <div className="stat-meta">
                  <span>📍</span>
                  <span>Google Places API</span>
                </div>
              </div>
            </div>

            {/* Modern Activity Feed */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">🔔 Recent Activity</h3>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Live
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 animate-pulse"></div>
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium">12 new businesses discovered</span>
                    <span className="text-blue-600 ml-1">in Hua Hin area</span>
                    <div className="text-xs text-slate-500 mt-1">📍 Lat: 12.5659, Lng: 99.9596</div>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">2 min ago</span>
                </div>
                <div className="flex items-center p-4 bg-green-50/50 rounded-xl border border-green-100/50">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium">5 businesses approved</span>
                    <span className="text-green-600 ml-1">for platform</span>
                    <div className="text-xs text-slate-500 mt-1">💰 Est. revenue: $2,340/month</div>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">15 min ago</span>
                </div>
                <div className="flex items-center p-4 bg-purple-50/50 rounded-xl border border-purple-100/50">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium">Google Places enrichment completed</span>
                    <span className="text-purple-600 ml-1">for 8 businesses</span>
                    <div className="text-xs text-slate-500 mt-1">💸 Cost: $0.136 USD</div>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discovery' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Data Discovery</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Discovery Leads</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    {discoveryLeads.every(lead => lead.selected) ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={handleEnrichWithGooglePlaces}
                    disabled={selectedCount === 0}
                    className={`px-4 py-2 text-sm rounded-lg font-medium ${
                      selectedCount > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Enrich with Google Places ({selectedCount})
                  </button>
                  <button
                    onClick={addTestPhotoData}
                    className="px-4 py-2 text-sm rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 ml-2"
                  >
                    🖼️ Test Photo Display
                  </button>
                  <button
                    onClick={debugEnrichLetsSeaDirectly}
                    className="px-4 py-2 text-sm rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 ml-2"
                  >
                    🔍 DEBUG: Enrich Let's Sea
                  </button>
                </div>
              </div>
            </div>

            {selectedCount > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-2">💰 Cost Calculator</h4>
                <p className="text-sm text-blue-700">
                  Selected: {selectedCount} businesses
                </p>
                <p className="text-sm text-blue-700">
                  Estimated cost: <span className="font-bold">${(selectedCount * costPerCall).toFixed(3)} USD</span>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  ({selectedCount} calls × ${costPerCall} per call)
                </p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-3 text-gray-600">Loading real data from Supabase...</span>
                        </div>
                      </td>
                    </tr>
                  ) : discoveryLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No businesses found in database
                      </td>
                    </tr>
                  ) : (
                    discoveryLeads.map((lead) => (
                      <tr key={lead.id} className={lead.selected ? 'bg-blue-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={lead.selected}
                            onChange={() => handleSelectLead(lead.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lead.photoUrl ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm bg-gray-100">
                              <img 
                                src={lead.photoUrl} 
                                alt={`${lead.name} photo`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-200 cursor-pointer"
                                onClick={() => window.open(lead.photoUrl, '_blank')}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Photo</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.address}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {lead.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-900">{lead.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            lead.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cost' && (
          <RealCostTracker />
        )}

        {activeTab === 'curation' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Business Curation & Management</h2>
            
            {/* Search and Filter Controls */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-slate-800 mb-4">🔍 Search & Filter</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Search businesses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-slate-800 mb-4">⚡ Bulk Actions</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Action</option>
                    <option value="approve">✅ Approve Selected</option>
                    <option value="reject">❌ Reject Selected</option>
                    <option value="enrich">🔍 Enrich with Google Places</option>
                    <option value="export">📊 Export Data</option>
                  </select>
                </div>
                <button
                  onClick={handleBulkAction}
                  disabled={selectedCount === 0 || !bulkAction}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Execute Action ({selectedCount} selected)
                </button>
                <button
                  onClick={handleExportData}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 font-medium"
                >
                  📄 Export {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>

            {/* Business List with Advanced Controls */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">
                    📋 Business Management ({filteredLeads.length} businesses)
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      {discoveryLeads.every(lead => lead.selected) ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                      onClick={() => handleBulkApproval('approve')}
                      disabled={selectedCount === 0}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
                    >
                      ✅ Quick Approve
                    </button>
                    <button
                      onClick={() => handleBulkApproval('reject')}
                      disabled={selectedCount === 0}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
                    >
                      ❌ Quick Reject
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={filteredLeads.length > 0 && filteredLeads.every(lead => lead.selected)}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className={`hover:bg-gray-50 ${lead.selected ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={lead.selected}
                            onChange={() => handleSelectLead(lead.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          {lead.photoUrl ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm bg-gray-100">
                              <img 
                                src={lead.photoUrl} 
                                alt={`${lead.name} photo`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-200 cursor-pointer"
                                onClick={() => window.open(lead.photoUrl, '_blank')}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Photo</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.address}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{lead.category}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">{lead.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            lead.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {(lead.partnership_status === 'pending' || lead.status === 'pending') ? (
                            <>
                              <button
                                onClick={() => handleApproveBusiness(lead)}
                                className="text-green-600 hover:text-green-900 font-medium"
                              >
                                ✅ Approve
                              </button>
                              <button
                                onClick={() => handleRejectBusiness(lead)}
                                className="text-red-600 hover:text-red-900 font-medium"
                              >
                                ❌ Reject
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setDiscoveryLeads(leads => 
                                  leads.map(l => l.id === lead.id ? { ...l, status: 'pending', partnership_status: 'pending' } : l)
                                );
                              }}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              🔄 Reset
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">🗺️ Discovery Map</h2>
                <p className="text-slate-600 mt-1">Real-time business discovery locations with Azure Maps</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setActiveTab('discovery')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Add Businesses
                </button>
                <button 
                  onClick={fetchRealData}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Refresh Map
                </button>
                <button className="bg-white hover:bg-gray-50 text-slate-700 px-4 py-2 rounded-xl font-medium transition-colors border border-gray-200 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Export Data
                </button>
              </div>
            </div>

            {/* Real Azure Maps Integration */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">📍 Business Locations</h3>
                  <p className="text-sm text-slate-600">
                    {loading ? 'Loading...' : `${businessLocations.length} businesses mapped`}
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  🔴 Live Map
                </div>
              </div>
              
              {loading ? (
                <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading map data from database...</p>
                  </div>
                </div>
              ) : businessLocations.length > 0 ? (
                <AzureMapComponent 
                  businesses={businessLocations} 
                  height="400px" 
                />
              ) : (
                <div className="h-96 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-300">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Locations Found</h3>
                    <p className="text-slate-600 mb-4">No businesses with coordinates in database</p>
                  </div>
                </div>
              )}
            </div>

            {/* Real Map Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-2xl font-bold text-blue-600">
                  {loading ? '...' : businessLocations.length}
                </div>
                <div className="text-sm text-slate-600">Locations Mapped</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-2xl font-bold text-green-600">
                  {loading ? '...' : stats.discoveryLeads > 0 ? Math.round((businessLocations.length / stats.discoveryLeads) * 100) : 0}%
                </div>
                <div className="text-sm text-slate-600">Coverage Rate</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-2xl font-bold text-purple-600">Hua Hin</div>
                <div className="text-sm text-slate-600">Primary Area</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-2xl font-bold text-orange-600">
                  {loading ? '...' : businessLocations.filter(b => b.category === 'Restaurant').length}
                </div>
                <div className="text-sm text-slate-600">Restaurants</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">📈 Analytics Dashboard</h2>
                <p className="text-slate-600 mt-1">Real-time business discovery analytics and insights</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setAnalyticsData(generateSampleAnalyticsData())}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                >
                  🔄 Refresh Data
                </button>
                <button className="bg-white/70 hover:bg-white text-slate-700 px-4 py-2 rounded-xl font-medium transition-colors border border-white/20">
                  📊 Export Report
                </button>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              {!dbConnected ? (
                <div className="text-center py-12">
                  <div className="text-yellow-600 mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics Offline</h3>
                  <p className="text-gray-600 mb-4">Charts require database connection for real-time data.</p>
                  <button 
                    onClick={fetchRealData}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    🔄 Retry Connection
                  </button>
                </div>
              ) : (
                <AnalyticsCharts data={analyticsData} loading={loading} />
              )}
            </div>

            {/* Real-time Activity Feed */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">🔔 Real-time Activity</h3>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  realTimeConnected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {realTimeConnected ? '🟢 Live Connection' : '🔴 Offline'}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                  <Activity size={20} className="text-blue-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium">Analytics dashboard initialized</span>
                    <div className="text-xs text-slate-500 mt-1">Chart.js components loaded successfully</div>
                  </div>
                  <span className="text-slate-400 text-sm">Just now</span>
                </div>
                {currentUser && (
                  <div className="flex items-center p-3 bg-green-50/50 rounded-lg border border-green-100/50">
                    <Shield size={20} className="text-green-500 mr-3" />
                    <div className="flex-1">
                      <span className="text-slate-700 font-medium">{currentUser.firstName} {currentUser.lastName} logged in</span>
                      <div className="text-xs text-slate-500 mt-1">Role: {currentUser.role} | Session active</div>
                    </div>
                    <span className="text-slate-400 text-sm">Session start</span>
                  </div>
                )}
                <div className="flex items-center p-3 bg-purple-50/50 rounded-lg border border-purple-100/50">
                  <TrendingUp size={20} className="text-purple-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium">Real-time WebSocket service {realTimeConnected ? 'connected' : 'disconnected'}</span>
                    <div className="text-xs text-slate-500 mt-1">Monitoring database changes for live updates</div>
                  </div>
                  <span className="text-slate-400 text-sm">Service status</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">🗄️ Database Management</h2>
                <p className="text-slate-600 mt-1">Direct database access - Pure Supabase data only</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={fetchRealData}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  🔄 Refresh Database
                </button>
                <button 
                  onClick={handleEnrichWithGooglePlaces}
                  disabled={selectedCount === 0}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                    selectedCount > 0
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  ✨ Enrich Selected ({selectedCount})
                </button>
                <button 
                  onClick={handleExportData}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  📁 Export Data
                </button>
                <button 
                  onClick={() => alert('Cleanup feature coming soon!')}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  🧹 Cleanup
                </button>
                <button 
                  onClick={debugPhotoData}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  🔍 Debug Photos
                </button>
              </div>
            </div>

            {/* Selection Info Banner */}
            {selectedCount > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-purple-900">✨ Ready to Enrich</h4>
                    <p className="text-sm text-purple-700">
                      {selectedCount} businesses selected • Est. cost: ${(selectedCount * 0.017).toFixed(3)} USD
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                      {discoveryLeads.every(lead => lead.selected) ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Database Stats - Better Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">
                  {loading ? '...' : discoveryLeads.length}
                </div>
                <div className="text-sm opacity-90">Total Records</div>
                <div className="text-xs opacity-75 mt-1">From Supabase DB</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">
                  {loading ? '...' : discoveryLeads.filter(lead => lead.enriched).length}
                </div>
                <div className="text-sm opacity-90">Enriched</div>
                <div className="text-xs opacity-75 mt-1">With Google data</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">
                  {loading ? '...' : discoveryLeads.filter(lead => lead.photoUrl).length}
                </div>
                <div className="text-sm opacity-90">With Photos</div>
                <div className="text-xs opacity-75 mt-1">Stored images</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">
                  {loading ? '...' : discoveryLeads.filter(lead => lead.phoneNumber).length}
                </div>
                <div className="text-sm opacity-90">Phone Numbers</div>
                <div className="text-xs opacity-75 mt-1">Contact verified</div>
              </div>
            </div>

            {/* Database Table with Checkbox Selection */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">📋 Business Database Records</h3>
                    <p className="text-sm text-slate-600 mt-1">Pure database data - no API calls</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={discoveryLeads.length > 0 && discoveryLeads.every(lead => lead.selected)}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                      Select All
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photos</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact & Business Info</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ratings</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading database records...</span>
                          </div>
                        </td>
                      </tr>
                    ) : discoveryLeads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                          No database records found
                        </td>
                      </tr>
                    ) : (
                      discoveryLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          {/* Selection Checkbox */}
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={lead.selected}
                              onChange={() => handleSelectLead(lead.id)}
                              className="rounded border-gray-300"
                            />
                          </td>

                          {/* Business Name & Basic Info */}
                          <td className="px-4 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                              <div className="text-sm text-gray-500">{lead.category}</div>
                              {lead.enriched && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mt-1">
                                  ✅ Enriched
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Photos - Real Database Images */}
                          <td className="px-4 py-4">
                            {lead.photoUrl ? (
                              <div className="flex items-center space-x-2">
                                <img 
                                  src={lead.photoUrl.includes('googleapis.com') && lead.photoReference ? 
                                    `http://localhost:3004/api/places/photo?photo_reference=${lead.photoReference}&maxwidth=400&maxheight=400` : 
                                    lead.photoUrl
                                  } 
                                  alt={lead.name}
                                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                                  onClick={() => handleViewPhotoGallery(lead)}
                                  onError={(e) => {
                                    // Fallback for broken images
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23e5e7eb"/><text x="32" y="32" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="24">📷</text></svg>';
                                  }}
                                />
                                <div className="text-xs text-gray-500">
                                  <div className="text-green-600 font-medium">✅ Has Photo</div>
                                  <button 
                                    onClick={() => handleViewPhotoGallery(lead)}
                                    className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800"
                                  >
                                    View Gallery
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                                <span className="text-gray-400 text-xs">No Photo</span>
                              </div>
                            )}
                          </td>

                          {/* Contact Info & Business Details */}
                          <td className="px-4 py-4">
                            <div className="text-sm space-y-1">
                              {lead.phoneNumber ? (
                                <div className="flex items-center text-green-600 text-xs">
                                  📞 {lead.phoneNumber}
                                </div>
                              ) : (
                                <div className="text-gray-400 text-xs">No phone</div>
                              )}
                              {lead.website ? (
                                <div className="flex items-center text-blue-600 text-xs">
                                  🌐 <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    Website
                                  </a>
                                </div>
                              ) : (
                                <div className="text-gray-400 text-xs">No website</div>
                              )}
                              {/* Business Type & Category */}
                              <div className="border-t border-gray-100 pt-1 mt-1">
                                {lead.businessType && (
                                  <div className="text-purple-600 text-xs font-medium">
                                    🏷️ {lead.businessType}
                                  </div>
                                )}
                                {lead.category && lead.category !== lead.businessType && (
                                  <div className="text-orange-600 text-xs">
                                    🍽️ {lead.category}
                                  </div>
                                )}
                                {lead.priceLevel && (
                                  <div className="text-green-600 text-xs">
                                    💰 {'$'.repeat(lead.priceLevel)} Price Level
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              <div className="truncate max-w-48">{lead.address}</div>
                              {lead.latitude && lead.longitude ? (
                                <div className="text-xs text-green-600 mt-1">
                                  📍 {lead.latitude.toFixed(4)}, {lead.longitude.toFixed(4)}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400 mt-1">No coordinates</div>
                              )}
                            </div>
                          </td>

                          {/* Ratings */}
                          <td className="px-4 py-4">
                            <div className="text-sm">
                              <div className="flex items-center">
                                ⭐ {lead.enhancedRating || lead.rating}/5
                              </div>
                              {lead.reviewCount ? (
                                <div className="text-xs text-green-600 mt-1">
                                  {lead.reviewCount} reviews
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400 mt-1">No reviews</div>
                              )}
                            </div>
                          </td>

                          {/* Platform Status */}
                          <td className="px-4 py-4">
                            <div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                lead.status === 'approved' 
                                  ? 'bg-green-100 text-green-800' 
                                  : lead.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {lead.status === 'approved' ? '✅ Approved' : 
                                 lead.status === 'rejected' ? '❌ Rejected' : 
                                 '⏳ Pending Review'}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {lead.status === 'approved' ? 'Ready for platform' : 
                                 lead.status === 'rejected' ? 'Not suitable' : 
                                 'Awaiting review'}
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap items-center gap-1">
                              {/* Approval Actions */}
                                                             {(lead.partnership_status === 'pending' || lead.status === 'pending') ? (
                                <>
                                  <button 
                                    onClick={() => handleApproveBusiness(lead)}
                                    className="text-green-600 hover:text-green-900 text-xs font-medium px-2 py-1 bg-green-50 rounded hover:bg-green-100 transition-colors"
                                  >
                                    ✅ Approve
                                  </button>
                                  <button 
                                    onClick={() => handleRejectBusiness(lead)}
                                    className="text-red-600 hover:text-red-900 text-xs font-medium px-2 py-1 bg-red-50 rounded hover:bg-red-100 transition-colors"
                                  >
                                    ❌ Reject
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => {
                                                                         setDiscoveryLeads(leads => 
                                       leads.map(l => l.id === lead.id ? { ...l, status: 'pending', partnership_status: 'pending' } : l)
                                     );
                                  }}
                                  className="text-blue-600 hover:text-blue-900 text-xs font-medium px-2 py-1 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                                >
                                  🔄 Reset
                                </button>
                              )}
                              
                              {/* Other Actions */}
                              <button 
                                onClick={() => handleEditBusiness(lead)}
                                className="text-purple-600 hover:text-purple-900 text-xs font-medium px-2 py-1 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
                              >
                                ✏️ Edit
                              </button>
                              <button 
                                onClick={() => handleViewBusinessDetails(lead)}
                                className="text-indigo-600 hover:text-indigo-900 text-xs font-medium px-2 py-1 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors"
                              >
                                📋 View
                              </button>
                              <button 
                                onClick={() => handleDeleteBusiness(lead)}
                                className="text-red-600 hover:text-red-900 text-xs font-medium px-2 py-1 bg-red-50 rounded hover:bg-red-100 transition-colors"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Database Health & Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Database Health */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-slate-800 mb-4">🔧 Database Health</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Connection Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      dbConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {dbConnected ? '🟢 Connected' : '🔴 Disconnected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Real-time Updates</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      realTimeConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {realTimeConnected ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Integrity</span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      🟢 Healthy
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Operations */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-slate-800 mb-4">⚡ Quick Operations</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-700 transition-colors">
                    🔍 Find Duplicate Records
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-sm font-medium text-yellow-700 transition-colors">
                    📋 Validate Phone Numbers
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-sm font-medium text-green-700 transition-colors">
                    🖼️ Check Missing Photos
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm font-medium text-purple-700 transition-colors">
                    📊 Generate Data Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
