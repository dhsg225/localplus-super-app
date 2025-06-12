export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const truncateText = (text: string, maxLength: number = 150): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const buildApiUrl = (baseUrl: string, params: Record<string, string | number>): string => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  return url.toString();
};

export const getCityFromLocation = (locationData: any): string => {
  const cityMapping: Record<string, string> = {
    'Bangkok': 'bangkok',
    'Hua Hin': 'hua-hin',
    'Pattaya': 'pattaya',
    'Phuket': 'phuket',
    'Chiang Mai': 'chiang-mai'
  };

  return cityMapping[locationData?.city] || 'hua-hin';
}; 