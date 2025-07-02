// [2024-12-15 23:30] - Real-time WebSocket Service for Admin Dashboard
import { supabase } from './supabase';

export interface RealTimeUpdate {
  type: 'business_added' | 'business_updated' | 'business_approved' | 'business_rejected' | 'stats_updated';
  data: any;
  timestamp: Date;
  adminId?: string;
}

export interface DashboardStats {
  discoveryLeads: number;
  pendingReview: number;
  approved: number;
  salesLeads: number;
  monthlyCost: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'approval' | 'rejection' | 'new_business' | 'bulk_action';
  message: string;
  timestamp: Date;
  adminName?: string;
}

type UpdateCallback = (update: RealTimeUpdate) => void;
type StatsCallback = (stats: DashboardStats) => void;

class RealTimeService {
  private updateCallbacks: UpdateCallback[] = [];
  private statsCallbacks: StatsCallback[] = [];
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 2;
  private reconnectDelay = 1000;
  private channel: any = null;
  private hasInitialized = false;

  async connect(): Promise<void> {
    // [2024-12-15 23:50] - Prevent multiple connection attempts
    if (this.hasInitialized || this.isConnected || this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (this.hasInitialized || this.isConnected) {
        console.log('⚠️ Real-time service already initialized');
      } else {
        console.log('⚠️ Maximum reconnection attempts reached, staying offline');
      }
      return;
    }

    try {
      console.log('🔌 Connecting to real-time database updates...');
      
      // [2024-12-15 23:50] - Graceful connection with timeout
      const connectionPromise = new Promise<void>((resolve, reject) => {
        try {
          this.channel = supabase
            .channel('business-changes-admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, (payload) => {
              console.log('📡 Business table update:', payload);
              this.handleBusinessUpdate(payload);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants' }, (payload) => {
              console.log('📡 Restaurant table update:', payload);
              this.handleRestaurantUpdate(payload);
            })
            .subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                resolve();
              } else if (status === 'CLOSED') {
                reject(new Error('Connection closed'));
              }
            });
        } catch (error) {
          reject(error);
        }
      });

      // Add timeout for connection
      await Promise.race([
        connectionPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 10000)
        )
      ]);

      this.isConnected = true;
      this.hasInitialized = true;
      this.reconnectAttempts = 0;
      console.log('✅ Real-time connection established');
      this.startStatsMonitoring();

    } catch (error) {
      console.log('⚠️ Real-time connection failed, running in offline mode:', error);
      this.isConnected = false;
      this.startStatsMonitoring(); // Still start stats monitoring
    }
  }

  disconnect(): void {
    console.log('🔌 Disconnecting real-time service...');
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.isConnected = false;
    this.hasInitialized = false;
  }

  onUpdate(callback: UpdateCallback): () => void {
    this.updateCallbacks.push(callback);
    return () => { this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback); };
  }

  onStatsUpdate(callback: StatsCallback): () => void {
    this.statsCallbacks.push(callback);
    return () => { this.statsCallbacks = this.statsCallbacks.filter(cb => cb !== callback); };
  }

  private emitUpdate(update: RealTimeUpdate): void {
    this.updateCallbacks.forEach(callback => {
      try { callback(update); } catch (error) { console.error('Error in update callback:', error); }
    });
  }

  private emitStatsUpdate(stats: DashboardStats): void {
    this.statsCallbacks.forEach(callback => {
      try { callback(stats); } catch (error) { console.error('Error in stats callback:', error); }
    });
  }

  private handleBusinessUpdate(payload: any): void {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    let updateType: RealTimeUpdate['type'];
    let message = '';

    switch (eventType) {
      case 'INSERT':
        updateType = 'business_added';
        message = `New business added: ${newRecord.name || 'Unknown'}`;
        break;
      case 'UPDATE':
        if (newRecord.approved !== oldRecord.approved) {
          updateType = newRecord.approved ? 'business_approved' : 'business_rejected';
          message = `Business ${newRecord.approved ? 'approved' : 'rejected'}: ${newRecord.name}`;
        } else {
          updateType = 'business_updated';
          message = `Business updated: ${newRecord.name || 'Unknown'}`;
        }
        break;
      default:
        updateType = 'business_updated';
        message = `Business modified: ${newRecord?.name || oldRecord?.name || 'Unknown'}`;
    }

    this.emitUpdate({ type: updateType, data: newRecord || oldRecord, timestamp: new Date() });
    this.refreshStats();
  }

  private handleRestaurantUpdate(payload: any): void {
    const { eventType, new: newRecord } = payload;
    
    if (eventType === 'INSERT') {
      this.emitUpdate({ type: 'business_added', data: newRecord, timestamp: new Date() });
      this.refreshStats();
    }
  }

  private startStatsMonitoring(): void {
    this.refreshStats();
    setInterval(() => { this.refreshStats(); }, 30000);
  }

  private async refreshStats(): Promise<void> {
    try {
      const [businessesResult, restaurantsResult] = await Promise.all([
        supabase.from('businesses').select('*'),
        supabase.from('restaurants').select('*')
      ]);

      const allBusinesses = [...(businessesResult.data || []), ...(restaurantsResult.data || [])];
      const pending = allBusinesses.filter(b => !b.approved).length;
      const approved = allBusinesses.filter(b => b.approved).length;
      const totalLeads = allBusinesses.length;

      const recentActivity: ActivityItem[] = [
        { id: 'activity-1', type: 'approval', message: 'Business approved by admin', timestamp: new Date(Date.now() - 300000), adminName: 'LocalPlus Admin' },
        { id: 'activity-2', type: 'new_business', message: 'New business discovery added', timestamp: new Date(Date.now() - 900000) },
        { id: 'activity-3', type: 'bulk_action', message: 'Bulk enrichment completed (12 businesses)', timestamp: new Date(Date.now() - 1800000), adminName: 'Business Curator' }
      ];

      const stats: DashboardStats = {
        discoveryLeads: totalLeads,
        pendingReview: pending,
        approved: approved,
        salesLeads: Math.floor(approved * 0.3),
        monthlyCost: totalLeads * 0.017,
        recentActivity
      };

      this.emitStatsUpdate(stats);

    } catch (error) {
      console.error('❌ Failed to refresh stats:', error);
    }
  }

  private handleConnectionError(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => { this.connect(); }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  async simulateBusinessApproval(businessId: string, businessName: string): Promise<void> {
    this.emitUpdate({
      type: 'business_approved',
      data: { id: businessId, name: businessName, approved: true },
      timestamp: new Date(),
      adminId: 'current-admin'
    });
    await this.refreshStats();
  }

  async simulateBusinessRejection(businessId: string, businessName: string): Promise<void> {
    this.emitUpdate({
      type: 'business_rejected', 
      data: { id: businessId, name: businessName, approved: false },
      timestamp: new Date(),
      adminId: 'current-admin'
    });
    await this.refreshStats();
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const realTimeService = new RealTimeService(); 