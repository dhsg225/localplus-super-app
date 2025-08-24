import { Advertisement, AdDisplayOptions } from '../types';
export declare const useAds: (options: AdDisplayOptions) => {
    ads: Advertisement[];
    loading: boolean;
    error: string;
    refreshAds: () => void;
    hasAds: boolean;
};
export default useAds;
