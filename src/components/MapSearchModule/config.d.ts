import { ContextConfig } from './types';
export declare const CUISINE_FILTERS: {
    id: string;
    label: string;
    value: string;
    icon: import("lucide-react").LucideIcon;
}[];
export declare const PRICE_LEVEL_FILTERS: {
    id: string;
    label: string;
    value: number;
    icon: import("lucide-react").LucideIcon;
}[];
export declare const BUSINESS_TYPE_FILTERS: {
    id: string;
    label: string;
    value: string;
    icon: import("lucide-react").LucideIcon;
}[];
export declare const CONSUMER_CONFIG: ContextConfig;
export declare const ADMIN_CONFIG: ContextConfig;
export declare const ACTION_CONFIGS: {
    view: {
        label: string;
        icon: import("lucide-react").LucideIcon;
        variant: "primary";
    };
    call: {
        label: string;
        icon: import("lucide-react").LucideIcon;
        variant: "outline";
    };
    directions: {
        label: string;
        icon: import("lucide-react").LucideIcon;
        variant: "outline";
    };
    book: {
        label: string;
        icon: import("lucide-react").LucideIcon;
        variant: "primary";
    };
    menu: {
        label: string;
        icon: import("lucide-react").LucideIcon;
        variant: "outline";
    };
    approve: {
        label: string;
        icon: import("lucide-react").LucideIcon;
        variant: "success";
    };
    reject: {
        label: string;
        icon: import("lucide-react").LucideIcon;
        variant: "danger";
    };
    lead: {
        label: string;
        icon: import("lucide-react").LucideIcon;
        variant: "outline";
    };
    details: {
        label: string;
        icon: import("lucide-react").LucideIcon;
        variant: "outline";
    };
    edit: {
        label: string;
        icon: import("lucide-react").LucideIcon;
        variant: "outline";
    };
};
export declare const DEFAULT_RADIUS: {
    consumer: number;
    admin: number;
};
export declare const MAX_RESULTS: {
    consumer: number;
    admin: number;
};
export declare const MAP_CONFIG: {
    defaultZoom: number;
    styles: {
        featureType: string;
        elementType: string;
        stylers: {
            visibility: string;
        }[];
    }[];
    controls: {
        streetViewControl: boolean;
        fullscreenControl: boolean;
        mapTypeControl: boolean;
    };
};
