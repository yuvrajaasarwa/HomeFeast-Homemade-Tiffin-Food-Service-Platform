/**
 * Real-time GPS Geolocation & Reverse Geocoding Utility
 * Uses HTML5 Geolocation + OpenStreetMap Nominatim Reverse Geocoding API
 */

export const geoLocator = {
  /**
   * Get device live GPS coordinates
   * @returns {Promise<{lat: number, lng: number, accuracy: number}>}
   */
  async getCurrentPosition(timeoutMs = 12000) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let errorMsg = 'Unable to retrieve your location.';
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = 'Location permission was denied. Please allow location access in your browser settings.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Location information is currently unavailable.';
          } else if (error.code === error.TIMEOUT) {
            errorMsg = 'Location request timed out. Please try again or search manually.';
          }
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: timeoutMs,
          maximumAge: 10000,
        }
      );
    });
  },

  /**
   * Reverse Geocode Lat/Lng to Indian Address & Locality
   * Uses OpenStreetMap Nominatim API with fallback
   */
  async reverseGeocode(lat, lng) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        },
      });

      if (!response.ok) {
        throw new Error('Reverse geocoding service returned an error.');
      }

      const data = await response.json();
      const addr = data.address || {};

      // Extract City Name
      const cityName =
        addr.city ||
        addr.town ||
        addr.municipality ||
        addr.district ||
        addr.county ||
        addr.state_district ||
        'Jaipur';

      // Extract Specific Locality / Area
      const locality =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.quarter ||
        addr.village ||
        addr.road ||
        addr.commercial ||
        'Central Hub';

      // Extract Road / Street
      const road = addr.road || addr.street || '';

      // Extract Pincode
      const pincode = addr.postcode || '';

      // Extract State
      const state = addr.state || 'Rajasthan';

      // Build formatted human-friendly address
      const parts = [
        road,
        locality,
        cityName,
        pincode ? `PIN: ${pincode}` : '',
        state,
      ].filter(Boolean);

      const formattedAddress = parts.join(', ');

      return {
        lat,
        lng,
        cityName,
        locality: road && road !== locality ? `${road}, ${locality}` : locality,
        pincode,
        state,
        formattedAddress: formattedAddress || `${locality}, ${cityName}`,
        displayName: data.display_name || formattedAddress,
        isLiveGps: true,
        detectedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('Nominatim reverse geocoding failed, using coordinates fallback:', err);
      return {
        lat,
        lng,
        cityName: 'Live Detected Location',
        locality: `GPS Area (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        pincode: '',
        state: 'India',
        formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (Live GPS)`,
        isLiveGps: true,
        detectedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * One-touch detection combining GPS + Reverse Geocoding
   */
  async detectLiveLocation() {
    const coords = await this.getCurrentPosition();
    const addressData = await this.reverseGeocode(coords.lat, coords.lng);
    return addressData;
  },

  /**
   * Calculate distance between two lat/lng points in kilometers (Haversine formula)
   */
  getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  },
};
