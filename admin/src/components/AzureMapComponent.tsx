import React, { useEffect, useRef } from 'react';
import * as atlas from 'azure-maps-control';

interface BusinessLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
}

interface AzureMapComponentProps {
  businesses: BusinessLocation[];
  height?: string;
}

const AzureMapComponent: React.FC<AzureMapComponentProps> = ({ 
  businesses, 
  height = '400px' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<atlas.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // [2024-12-15 17:10] - Create Azure Maps instance with authentication
    const map = new atlas.Map(mapRef.current, {
      center: [99.9596, 12.5659], // Hua Hin coordinates
      zoom: 12,
      language: 'en-US',
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: 'AzSK_uGqr5qvO-yx4CjyCJKvt_fvYxvJJKMnvRX1e1c' // Your Azure Maps key
      }
    });

    mapInstanceRef.current = map;

    // [2024-12-15 17:10] - Wait for map to be ready then add business markers
    map.events.add('ready', () => {
      // Create data source for markers
      const dataSource = new atlas.source.DataSource();
      map.sources.add(dataSource);

      // Add markers for each business
      businesses.forEach(business => {
        if (business.latitude && business.longitude) {
          const point = new atlas.data.Feature(new atlas.data.Point([
            business.longitude, 
            business.latitude
          ]), {
            id: business.id,
            name: business.name,
            category: business.category,
            address: business.address
          });
          
          dataSource.add(point);
        }
      });

      // Create symbol layer for markers
      const symbolLayer = new atlas.layer.SymbolLayer(dataSource, undefined, {
        iconOptions: {
          image: 'pin-round-blue',
          anchor: 'center',
          allowOverlap: true
        },
        textOptions: {
          textField: ['get', 'name'],
          color: '#000000',
          offset: [0, -2],
          size: 12
        }
      });

      map.layers.add(symbolLayer);

      // [2024-12-15 17:10] - Add click events for business details
      map.events.add('click', symbolLayer, (e) => {
        if (e.shapes && e.shapes.length > 0) {
          const shape = e.shapes[0] as atlas.data.Feature<atlas.data.Point, any>;
          const properties = shape.properties;
          
          // Create popup with business info
          const popup = new atlas.Popup({
            content: `
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 8px 0; color: #2563eb;">${properties.name}</h3>
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b;">${properties.category}</p>
                <p style="margin: 0; font-size: 11px; color: #94a3b8;">${properties.address}</p>
              </div>
            `,
            position: (shape.geometry as atlas.data.Point).coordinates
          });
          
          popup.open(map);
        }
      });

      // [2024-12-15 17:10] - Change cursor on hover
      map.events.add('mouseenter', symbolLayer, () => {
        map.getCanvasContainer().style.cursor = 'pointer';
      });

      map.events.add('mouseleave', symbolLayer, () => {
        map.getCanvasContainer().style.cursor = 'grab';
      });
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
        mapInstanceRef.current = null;
      }
    };
  }, [businesses]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height, 
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    />
  );
};

export default AzureMapComponent; 