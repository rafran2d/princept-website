import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const MapSection = ({
  latitude = 48.8566,
  longitude = 2.3522,
  zoom = 13,
  title = "Notre localisation",
  description = "Venez nous rendre visite",
  address = ""
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Fonction pour charger les scripts Leaflet
    const loadLeaflet = () => {
      return new Promise((resolve) => {
        // Vérifier si Leaflet est déjà chargé
        if (window.L) {
          resolve();
          return;
        }

        // Charger le CSS de Leaflet
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        cssLink.crossOrigin = '';
        document.head.appendChild(cssLink);

        // Charger le JavaScript de Leaflet
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    const initMap = async () => {
      await loadLeaflet();

      if (mapRef.current && !mapInstanceRef.current) {
        // Créer la carte
        const map = window.L.map(mapRef.current, {
          center: [latitude, longitude],
          zoom: zoom,
          scrollWheelZoom: true,
          dragging: true,
          touchZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          zoomControl: true
        });

        // Ajouter les tuiles OpenStreetMap
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Ajouter un marqueur
        const marker = window.L.marker([latitude, longitude]).addTo(map);

        if (title || description) {
          let popupContent = '';
          if (title) {
            popupContent += `<strong>${title}</strong>`;
          }
          if (description) {
            popupContent += title ? `<br/>${description}` : description;
          }
          if (address) {
            popupContent += `<br/><small>${address}</small>`;
          }
          marker.bindPopup(popupContent);
        }

        mapInstanceRef.current = map;

        // Redimensionner la carte après un délai pour s'assurer qu'elle s'affiche correctement
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, title, description, address]);

  return (
    <div className="py-3">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.9 }}>
              <MapPin className="w-8 h-8 text-white" />
            </div>
          </div>
          {title && (
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h3>
          )}
          {description && (
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{description}</p>
          )}
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white p-2">
            <div
              ref={mapRef}
              style={{ height: '350px', width: '100%'}}
              className="bg-gray-200 rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;