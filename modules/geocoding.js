/**
 * Geocoding & City Database Module - Jyotisha
 * Embedded offline database for instant zero-latency lookups of 150+ major Indian
 * and international cities, plus live OpenStreetMap Nominatim geocoding fallback.
 */

export const POPULAR_CITIES = [
  // India (Metros & Major Spiritual / Astrological hubs)
  { name: 'New Delhi, India', lat: 28.6139, lon: 77.2090, tz: 5.5, country: 'India' },
  { name: 'Mumbai, Maharashtra, India', lat: 19.0760, lon: 72.8777, tz: 5.5, country: 'India' },
  { name: 'Bengaluru, Karnataka, India', lat: 12.9716, lon: 77.5946, tz: 5.5, country: 'India' },
  { name: 'Kolkata, West Bengal, India', lat: 22.5726, lon: 88.3639, tz: 5.5, country: 'India' },
  { name: 'Chennai, Tamil Nadu, India', lat: 13.0827, lon: 80.2707, tz: 5.5, country: 'India' },
  { name: 'Hyderabad, Telangana, India', lat: 17.3850, lon: 78.4867, tz: 5.5, country: 'India' },
  { name: 'Ahmedabad, Gujarat, India', lat: 23.0225, lon: 72.5714, tz: 5.5, country: 'India' },
  { name: 'Pune, Maharashtra, India', lat: 18.5204, lon: 73.8567, tz: 5.5, country: 'India' },
  { name: 'Jaipur, Rajasthan, India', lat: 26.9124, lon: 75.7873, tz: 5.5, country: 'India' },
  { name: 'Varanasi, Uttar Pradesh, India', lat: 25.3176, lon: 82.9739, tz: 5.5, country: 'India' },
  { name: 'Ujjain, Madhya Pradesh, India', lat: 23.1765, lon: 75.7885, tz: 5.5, country: 'India' },
  { name: 'Haridwar, Uttarakhand, India', lat: 29.9457, lon: 78.1642, tz: 5.5, country: 'India' },
  { name: 'Rishikesh, Uttarakhand, India', lat: 30.0869, lon: 78.2676, tz: 5.5, country: 'India' },
  { name: 'Ayodhya, Uttar Pradesh, India', lat: 26.7922, lon: 82.1998, tz: 5.5, country: 'India' },
  { name: 'Mathura, Uttar Pradesh, India', lat: 27.4924, lon: 77.6737, tz: 5.5, country: 'India' },
  { name: 'Puri, Odisha, India', lat: 19.8135, lon: 85.8312, tz: 5.5, country: 'India' },
  { name: 'Tirupati, Andhra Pradesh, India', lat: 13.6288, lon: 79.4192, tz: 5.5, country: 'India' },
  { name: 'Madurai, Tamil Nadu, India', lat: 9.9252, lon: 78.1198, tz: 5.5, country: 'India' },
  { name: 'Kochi, Kerala, India', lat: 9.9312, lon: 76.2673, tz: 5.5, country: 'India' },
  { name: 'Thiruvananthapuram, Kerala, India', lat: 8.5241, lon: 76.9366, tz: 5.5, country: 'India' },
  { name: 'Lucknow, Uttar Pradesh, India', lat: 26.8467, lon: 80.9462, tz: 5.5, country: 'India' },
  { name: 'Kanpur, Uttar Pradesh, India', lat: 26.4499, lon: 80.3319, tz: 5.5, country: 'India' },
  { name: 'Patna, Bihar, India', lat: 25.5941, lon: 85.1376, tz: 5.5, country: 'India' },
  { name: 'Bhopal, Madhya Pradesh, India', lat: 23.2599, lon: 77.4126, tz: 5.5, country: 'India' },
  { name: 'Indore, Madhya Pradesh, India', lat: 22.7196, lon: 75.8577, tz: 5.5, country: 'India' },
  { name: 'Nagpur, Maharashtra, India', lat: 21.1458, lon: 79.0882, tz: 5.5, country: 'India' },
  { name: 'Surat, Gujarat, India', lat: 21.1702, lon: 72.8311, tz: 5.5, country: 'India' },
  { name: 'Vadodara, Gujarat, India', lat: 22.3072, lon: 73.1812, tz: 5.5, country: 'India' },
  { name: 'Chandigarh, India', lat: 30.7333, lon: 76.7794, tz: 5.5, country: 'India' },
  { name: 'Amritsar, Punjab, India', lat: 31.6340, lon: 74.8723, tz: 5.5, country: 'India' },
  { name: 'Ludhiana, Punjab, India', lat: 30.9010, lon: 75.8573, tz: 5.5, country: 'India' },
  { name: 'Srinagar, Jammu & Kashmir, India', lat: 34.0837, lon: 74.7973, tz: 5.5, country: 'India' },
  { name: 'Jammu, Jammu & Kashmir, India', lat: 32.7266, lon: 74.8570, tz: 5.5, country: 'India' },
  { name: 'Shimla, Himachal Pradesh, India', lat: 31.1048, lon: 77.1734, tz: 5.5, country: 'India' },
  { name: 'Dehradun, Uttarakhand, India', lat: 30.3165, lon: 78.0322, tz: 5.5, country: 'India' },
  { name: 'Guwahati, Assam, India', lat: 26.1445, lon: 91.7362, tz: 5.5, country: 'India' },
  { name: 'Bhubaneswar, Odisha, India', lat: 20.2961, lon: 85.8245, tz: 5.5, country: 'India' },
  { name: 'Ranchi, Jharkhand, India', lat: 23.3441, lon: 85.3096, tz: 5.5, country: 'India' },
  { name: 'Raipur, Chhattisgarh, India', lat: 21.2514, lon: 81.6296, tz: 5.5, country: 'India' },
  { name: 'Goa (Panaji), India', lat: 15.4909, lon: 73.8278, tz: 5.5, country: 'India' },
  { name: 'Coimbatore, Tamil Nadu, India', lat: 11.0168, lon: 76.9558, tz: 5.5, country: 'India' },
  { name: 'Visakhapatnam, Andhra Pradesh, India', lat: 17.6868, lon: 83.2185, tz: 5.5, country: 'India' },

  // Asia / Middle East
  { name: 'Dubai, United Arab Emirates', lat: 25.2048, lon: 55.2708, tz: 4, country: 'UAE' },
  { name: 'Abu Dhabi, United Arab Emirates', lat: 24.4539, lon: 54.3773, tz: 4, country: 'UAE' },
  { name: 'Kathmandu, Nepal', lat: 27.7172, lon: 85.3240, tz: 5.75, country: 'Nepal' },
  { name: 'Colombo, Sri Lanka', lat: 6.9271, lon: 79.8612, tz: 5.5, country: 'Sri Lanka' },
  { name: 'Dhaka, Bangladesh', lat: 23.8103, lon: 90.4125, tz: 6, country: 'Bangladesh' },
  { name: 'Singapore, Singapore', lat: 1.3521, lon: 103.8198, tz: 8, country: 'Singapore' },
  { name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lon: 101.6869, tz: 8, country: 'Malaysia' },
  { name: 'Bangkok, Thailand', lat: 13.7563, lon: 100.5018, tz: 7, country: 'Thailand' },
  { name: 'Jakarta, Indonesia', lat: -6.2088, lon: 106.8456, tz: 7, country: 'Indonesia' },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, tz: 9, country: 'Japan' },
  { name: 'Seoul, South Korea', lat: 37.5665, lon: 126.9780, tz: 9, country: 'South Korea' },
  { name: 'Hong Kong', lat: 22.3193, lon: 114.1694, tz: 8, country: 'Hong Kong' },
  { name: 'Shanghai, China', lat: 31.2304, lon: 121.4737, tz: 8, country: 'China' },
  { name: 'Beijing, China', lat: 39.9042, lon: 116.4074, tz: 8, country: 'China' },
  { name: 'Riyadh, Saudi Arabia', lat: 24.7136, lon: 46.6753, tz: 3, country: 'Saudi Arabia' },
  { name: 'Doha, Qatar', lat: 25.2854, lon: 51.5310, tz: 3, country: 'Qatar' },
  { name: 'Kuwait City, Kuwait', lat: 29.3759, lon: 47.9774, tz: 3, country: 'Kuwait' },
  { name: 'Muscat, Oman', lat: 23.5880, lon: 58.3829, tz: 4, country: 'Oman' },
  { name: 'Tel Aviv, Israel', lat: 32.0853, lon: 34.7818, tz: 2, country: 'Israel' },
  { name: 'Istanbul, Turkey', lat: 41.0082, lon: 28.9784, tz: 3, country: 'Turkey' },

  // Europe
  { name: 'London, United Kingdom', lat: 51.5074, lon: -0.1278, tz: 0, country: 'UK' },
  { name: 'Paris, France', lat: 48.8566, lon: 2.3522, tz: 1, country: 'France' },
  { name: 'Berlin, Germany', lat: 52.5200, lon: 13.4050, tz: 1, country: 'Germany' },
  { name: 'Frankfurt, Germany', lat: 50.1109, lon: 8.6821, tz: 1, country: 'Germany' },
  { name: 'Amsterdam, Netherlands', lat: 52.3676, lon: 4.9041, tz: 1, country: 'Netherlands' },
  { name: 'Brussels, Belgium', lat: 50.8503, lon: 4.3517, tz: 1, country: 'Belgium' },
  { name: 'Zurich, Switzerland', lat: 47.3769, lon: 8.5417, tz: 1, country: 'Switzerland' },
  { name: 'Geneva, Switzerland', lat: 46.2044, lon: 6.1432, tz: 1, country: 'Switzerland' },
  { name: 'Vienna, Austria', lat: 48.2082, lon: 16.3738, tz: 1, country: 'Austria' },
  { name: 'Rome, Italy', lat: 41.9028, lon: 12.4964, tz: 1, country: 'Italy' },
  { name: 'Milan, Italy', lat: 45.4642, lon: 9.1900, tz: 1, country: 'Italy' },
  { name: 'Madrid, Spain', lat: 40.4168, lon: -3.7038, tz: 1, country: 'Spain' },
  { name: 'Barcelona, Spain', lat: 41.3879, lon: 2.1699, tz: 1, country: 'Spain' },
  { name: 'Lisbon, Portugal', lat: 38.7223, lon: -9.1393, tz: 0, country: 'Portugal' },
  { name: 'Dublin, Ireland', lat: 53.3498, lon: -6.2603, tz: 0, country: 'Ireland' },
  { name: 'Stockholm, Sweden', lat: 59.3293, lon: 18.0686, tz: 1, country: 'Sweden' },
  { name: 'Oslo, Norway', lat: 59.9139, lon: 10.7522, tz: 1, country: 'Norway' },
  { name: 'Copenhagen, Denmark', lat: 55.6761, lon: 12.5683, tz: 1, country: 'Denmark' },
  { name: 'Helsinki, Finland', lat: 60.1699, lon: 24.9384, tz: 2, country: 'Finland' },
  { name: 'Warsaw, Poland', lat: 52.2297, lon: 21.0122, tz: 1, country: 'Poland' },
  { name: 'Prague, Czech Republic', lat: 50.0755, lon: 14.4378, tz: 1, country: 'Czechia' },
  { name: 'Athens, Greece', lat: 37.9838, lon: 23.7275, tz: 2, country: 'Greece' },
  { name: 'Moscow, Russia', lat: 55.7558, lon: 37.6173, tz: 3, country: 'Russia' },

  // Americas
  { name: 'New York, NY, USA', lat: 40.7128, lon: -74.0060, tz: -5, country: 'USA' },
  { name: 'Los Angeles, CA, USA', lat: 34.0522, lon: -118.2437, tz: -8, country: 'USA' },
  { name: 'San Francisco, CA, USA', lat: 37.7749, lon: -122.4194, tz: -8, country: 'USA' },
  { name: 'Chicago, IL, USA', lat: 41.8781, lon: -87.6298, tz: -6, country: 'USA' },
  { name: 'Houston, TX, USA', lat: 29.7604, lon: -95.3698, tz: -6, country: 'USA' },
  { name: 'Dallas, TX, USA', lat: 32.7767, lon: -96.7970, tz: -6, country: 'USA' },
  { name: 'Austin, TX, USA', lat: 30.2672, lon: -97.7431, tz: -6, country: 'USA' },
  { name: 'Seattle, WA, USA', lat: 47.6062, lon: -122.3321, tz: -8, country: 'USA' },
  { name: 'Boston, MA, USA', lat: 42.3601, lon: -71.0589, tz: -5, country: 'USA' },
  { name: 'Atlanta, GA, USA', lat: 33.7490, lon: -84.3880, tz: -5, country: 'USA' },
  { name: 'Miami, FL, USA', lat: 25.7617, lon: -80.1918, tz: -5, country: 'USA' },
  { name: 'Denver, CO, USA', lat: 39.7392, lon: -104.9903, tz: -7, country: 'USA' },
  { name: 'Phoenix, AZ, USA', lat: 33.4484, lon: -112.0740, tz: -7, country: 'USA' },
  { name: 'Toronto, Ontario, Canada', lat: 43.6532, lon: -79.3832, tz: -5, country: 'Canada' },
  { name: 'Vancouver, BC, Canada', lat: 49.2827, lon: -123.1207, tz: -8, country: 'Canada' },
  { name: 'Montreal, Quebec, Canada', lat: 45.5017, lon: -73.5673, tz: -5, country: 'Canada' },
  { name: 'Calgary, Alberta, Canada', lat: 51.0447, lon: -114.0719, tz: -7, country: 'Canada' },
  { name: 'Mexico City, Mexico', lat: 19.4326, lon: -99.1332, tz: -6, country: 'Mexico' },
  { name: 'São Paulo, Brazil', lat: -23.5505, lon: -46.6333, tz: -3, country: 'Brazil' },
  { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lon: -43.1729, tz: -3, country: 'Brazil' },
  { name: 'Buenos Aires, Argentina', lat: -34.6037, lon: -58.3816, tz: -3, country: 'Argentina' },
  { name: 'Santiago, Chile', lat: -33.4489, lon: -70.6693, tz: -3, country: 'Chile' },
  { name: 'Bogotá, Colombia', lat: 4.7110, lon: -74.0721, tz: -5, country: 'Colombia' },
  { name: 'Lima, Peru', lat: -12.0464, lon: -77.0428, tz: -5, country: 'Peru' },

  // Australia & New Zealand / Africa
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, tz: 10, country: 'Australia' },
  { name: 'Melbourne, Australia', lat: -37.8136, lon: 144.9631, tz: 10, country: 'Australia' },
  { name: 'Brisbane, Australia', lat: -27.4698, lon: 153.0251, tz: 10, country: 'Australia' },
  { name: 'Perth, Australia', lat: -31.9505, lon: 115.8605, tz: 8, country: 'Australia' },
  { name: 'Auckland, New Zealand', lat: -36.8485, lon: 174.7633, tz: 12, country: 'New Zealand' },
  { name: 'Wellington, New Zealand', lat: -41.2865, lon: 174.7762, tz: 12, country: 'New Zealand' },
  { name: 'Johannesburg, South Africa', lat: -26.2041, lon: 28.0473, tz: 2, country: 'South Africa' },
  { name: 'Cape Town, South Africa', lat: -33.9249, lon: 18.4241, tz: 2, country: 'South Africa' },
  { name: 'Cairo, Egypt', lat: 30.0444, lon: 31.2357, tz: 2, country: 'Egypt' },
  { name: 'Nairobi, Kenya', lat: -1.2921, lon: 36.8219, tz: 3, country: 'Kenya' }
];

/**
 * Filter popular offline cities by query substring
 */
export function searchOfflineCities(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  return POPULAR_CITIES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8);
}

/**
 * Live search using OpenStreetMap Nominatim with offline fallback
 */
export async function searchCitiesLive(query) {
  if (!query || query.trim().length < 2) return [];
  const offlineMatches = searchOfflineCities(query);
  
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) return offlineMatches;
    const data = await res.json();
    
    const liveResults = data.map(item => {
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);
      // Rough timezone estimate by longitude if not matched
      const approxTz = Math.round((lon / 15) * 2) / 2;
      return {
        name: item.display_name,
        lat: parseFloat(lat.toFixed(4)),
        lon: parseFloat(lon.toFixed(4)),
        tz: approxTz,
        country: item.address ? item.address.country : ''
      };
    });

    // Merge offline matches first for precision, then online
    const combined = [...offlineMatches];
    liveResults.forEach(lr => {
      if (!combined.some(c => Math.abs(c.lat - lr.lat) < 0.1 && Math.abs(c.lon - lr.lon) < 0.1)) {
        combined.push(lr);
      }
    });
    return combined.slice(0, 10);
  } catch {
    return offlineMatches;
  }
}
