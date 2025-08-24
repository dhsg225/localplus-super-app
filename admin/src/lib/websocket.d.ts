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
declare class RealTimeService {
    private updateCallbacks;
    private statsCallbacks;
    private isConnected;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectDelay;
    private channel;
    private hasInitialized;
    connect(): Promise<void>;
    disconnect(): void;
    onUpdate(callback: UpdateCallback): () => void;
    onStatsUpdate(callback: StatsCallback): () => void;
    private emitUpdate;
    private emitStatsUpdate;
    private handleBusinessUpdate;
    private startStatsMonitoring;
    private refreshStats;
    private handleConnectionError;
    simulateBusinessApproval(businessId: string, businessName: string): Promise<void>;
    simulateBusinessRejection(businessId: string, businessName: string): Promise<void>;
    getConnectionStatus(): boolean;
}
export declare const realTimeService: RealTimeService;
export {};
