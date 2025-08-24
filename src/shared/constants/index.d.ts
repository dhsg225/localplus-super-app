export declare const LOCATIONS: {
    readonly cities: readonly [{
        readonly id: "pattaya";
        readonly name: "Pattaya";
        readonly slug: "pattaya";
    }, {
        readonly id: "hua-hin";
        readonly name: "Hua Hin";
        readonly slug: "hua-hin";
    }, {
        readonly id: "krabi";
        readonly name: "Krabi";
        readonly slug: "krabi";
    }, {
        readonly id: "samui";
        readonly name: "Koh Samui";
        readonly slug: "samui";
    }, {
        readonly id: "bangkok";
        readonly name: "Bangkok";
        readonly slug: "bangkok";
    }];
    readonly bangkokDistricts: readonly [{
        readonly id: "thonglor";
        readonly name: "Thonglor";
        readonly slug: "thonglor";
    }, {
        readonly id: "phrom-phong";
        readonly name: "Phrom Phong";
        readonly slug: "phrom-phong";
    }, {
        readonly id: "ekkamai";
        readonly name: "Ekkamai";
        readonly slug: "ekkamai";
    }, {
        readonly id: "on-nut";
        readonly name: "On Nut";
        readonly slug: "on-nut";
    }, {
        readonly id: "riverside";
        readonly name: "Riverside";
        readonly slug: "riverside";
    }, {
        readonly id: "nana";
        readonly name: "Nana";
        readonly slug: "nana";
    }];
};
export declare const CUISINE_TYPES: readonly ["Thai Traditional", "Fresh Seafood", "Street Food", "Chinese-Thai", "International", "Indian", "Japanese", "Italian", "Fusion", "BBQ & Grill", "Korean", "Vietnamese", "Halal", "Vegetarian/Vegan", "Cafe & Coffee", "Thai", "Chinese", "Mediterranean", "American", "French", "Mexican", "Seafood", "BBQ", "Vegetarian", "Vegan"];
export declare const PRICE_RANGES: {
    readonly budget: {
        readonly min: 0;
        readonly max: 300;
        readonly label: "Budget (฿)";
    };
    readonly "mid-range": {
        readonly min: 301;
        readonly max: 800;
        readonly label: "Mid-range (฿฿)";
    };
    readonly upscale: {
        readonly min: 801;
        readonly max: 1500;
        readonly label: "Upscale (฿฿฿)";
    };
    readonly "fine-dining": {
        readonly min: 1501;
        readonly max: 5000;
        readonly label: "Fine Dining (฿฿฿฿)";
    };
};
export declare const EVENT_CATEGORIES: readonly ["music", "food", "art", "culture", "sports", "business", "nightlife", "shopping", "wellness", "education", "family"];
export declare const SERVICE_CATEGORIES: readonly ["home-maintenance", "cleaning", "beauty-wellness", "automotive", "technology", "health-medical", "education", "legal-finance", "delivery", "repair", "installation"];
export declare const CONTACT_METHODS: {
    readonly phone: {
        readonly icon: "Phone";
        readonly label: "Call";
        readonly prefix: "tel:";
    };
    readonly whatsapp: {
        readonly icon: "MessageCircle";
        readonly label: "WhatsApp";
        readonly prefix: "https://wa.me/";
    };
    readonly line: {
        readonly icon: "MessageSquare";
        readonly label: "Line";
        readonly prefix: "https://line.me/ti/p/";
    };
    readonly website: {
        readonly icon: "Globe";
        readonly label: "Website";
        readonly prefix: "https://";
    };
    readonly facebook: {
        readonly icon: "Facebook";
        readonly label: "Facebook";
        readonly prefix: "https://facebook.com/";
    };
};
