import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Car, 
  Plane, 
  Building2, 
  Utensils, 
  Compass, 
  Sparkles, 
  Download, 
  Share2, 
  CheckCircle2, 
  ShoppingBag, 
  Landmark, 
  ArrowRight, 
  Star, 
  ExternalLink, 
  Navigation, 
  Layers, 
  Phone, 
  Globe, 
  X, 
  Route, 
  ShieldCheck, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  Map as MapIcon,
  Satellite,
  Milestone
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { NavTab } from './Header';
import { DEMO_EXHIBITORS } from '../data/mockData';
import { Exhibitor } from '../types';

declare const google: any;

interface BuyerTripPlannerViewProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenExhibitorModal: (exhibitor: Exhibitor) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
}

export interface GooglePlaceInfo {
  id: string;
  name: string;
  categoryName: string;
  rating: number;
  reviewsCount: number;
  priceLevel: string;
  address: string;
  hours: string;
  phone?: string;
  website?: string;
  googleMapsUrl: string;
  tag: string;
  topReview: {
    author: string;
    text: string;
    stars: number;
    source: string;
  };
  features: string[];
  photos: string[];
  coordinates: { lat: number; lng: number };
}

interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  category: 'flight' | 'hotel' | 'meeting' | 'fair' | 'culinary' | 'culture';
  location: string;
  desc: string;
  image: string;
  actionLabel?: string;
  exhibitor?: Exhibitor;
  badge?: string;
  placeInfo?: GooglePlaceInfo;
}

interface DayPlan {
  dayNumber: number;
  date: string;
  title: string;
  highlight: string;
  routeCoords: Array<{ lat: number; lng: number }>;
  items: ItineraryItem[];
}

// Google Maps Route Polyline Sub-component
const MapRoutePolyline: React.FC<{
  path: Array<{ lat: number; lng: number }>;
  strokeColor?: string;
}> = ({ path, strokeColor = '#E6005C' }) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');

  useEffect(() => {
    if (!map || !mapsLib || !path || path.length < 2) return;

    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: strokeColor,
      strokeOpacity: 0.95,
      strokeWeight: 4,
      map: map,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 2.5,
            fillColor: '#F59E0B',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1
          },
          offset: '50%',
          repeat: '100px'
        }
      ]
    });

    // Auto-fit bounds so the entire daily journey is framed perfectly
    const bounds = new google.maps.LatLngBounds();
    path.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });

    return () => {
      polyline.setMap(null);
    };
  }, [map, mapsLib, path, strokeColor]);

  return null;
};

export const BuyerTripPlannerView: React.FC<BuyerTripPlannerViewProps> = ({
  onSelectTab,
  onOpenExhibitorModal,
  onBookMeeting
}) => {
  const [buyerName, setBuyerName] = useState('Sarah Williams');
  const [buyerCompany, setBuyerCompany] = useState('Meridian Apparel UK Ltd');
  const [hotelChoice, setHotelChoice] = useState<'central' | 'aerocity' | 'gurugram'>('central');
  const [sourcingFocus, setSourcingFocus] = useState('Organic Knits & Sustainable Casuals');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [activePlaceModal, setActivePlaceModal] = useState<GooglePlaceInfo | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 28.6050, lng: 77.2100 });
  const [mapZoom, setMapZoom] = useState<number>(12);

  const googleMapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Google Business Places Database for Delhi Sourcing, Hotels & Dining
  const PLACES_DB: Record<string, GooglePlaceInfo> = {
    airport: {
      id: 'place-airport',
      name: 'Indira Gandhi International Airport (DEL) — Terminal 3',
      categoryName: 'International Airport · SkyTrax 5-Star Hub',
      rating: 4.6,
      reviewsCount: 124800,
      priceLevel: 'Free IIGF Transit',
      address: 'Palam, New Delhi, Delhi 110037, India',
      hours: 'Open 24 hours',
      phone: '+91 124 479 7300',
      website: 'https://www.newdelhiairport.in',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Indira+Gandhi+International+Airport+Delhi+Terminal+3',
      tag: 'Official Arrival Hub',
      topReview: {
        author: 'Marcus Vance, UK Sourcing Director',
        text: 'The IIGF VIP welcome desk at T3 Gate 5 made immigration and hotel limousine pickup swift and effortless.',
        stars: 5,
        source: 'Google Verified Review'
      },
      features: ['Fast-track VIP Lounge', 'Meet & Greet Counter', 'Foreign Exchange', 'Luggage Assistance'],
      photos: [
        'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80'
      ],
      coordinates: { lat: 28.5562, lng: 77.1000 }
    },
    tajHotel: {
      id: 'place-taj',
      name: 'The Taj Mahal Hotel, New Delhi',
      categoryName: '5-Star Luxury Heritage Hotel · Lutyens Delhi',
      rating: 4.8,
      reviewsCount: 16420,
      priceLevel: '$$$$',
      address: 'Number One, Man Singh Rd, South End, New Delhi, Delhi 110011',
      hours: 'Open 24 hours · Check-in: 2:00 PM / Express VIP: 09:30 AM',
      phone: '+91 11 6656 6162',
      website: 'https://www.tajhotels.com',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Taj+Mahal+Hotel+Man+Singh+Road+New+Delhi',
      tag: 'IIGF Partner Luxury Hotel',
      topReview: {
        author: 'Elena Rostova, EuroStyle Fashion',
        text: 'Exceptional hospitality in the heart of Delhi. Only 10 minutes to Bharat Mandapam with the official fair shuttle.',
        stars: 5,
        source: 'Google Local Guide'
      },
      features: ['Complimentary Fair Shuttle', '24/7 Concierge', 'High-Speed Wi-Fi', 'Luxury Spa & Pool'],
      photos: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
      ],
      coordinates: { lat: 28.6045, lng: 77.2255 }
    },
    aerocityHotel: {
      id: 'place-aerocity',
      name: 'JW Marriott Hotel New Delhi Aerocity',
      categoryName: '5-Star International Business Hotel',
      rating: 4.7,
      reviewsCount: 19850,
      priceLevel: '$$$$',
      address: 'Asset Area 4 - Hospitality District, Delhi Aerocity, New Delhi 110037',
      hours: 'Open 24 hours',
      phone: '+91 11 4521 2121',
      website: 'https://www.marriott.com',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=JW+Marriott+Hotel+New+Delhi+Aerocity',
      tag: 'Aerocity Hub Hotel',
      topReview: {
        author: 'David Chen, Global Retail Buyer',
        text: 'Top tier rooms, impeccable soundproofing near airport, and direct express coach to Pragati Maidan.',
        stars: 5,
        source: 'Google Verified Review'
      },
      features: ['Airport Shuttle', 'Executive Business Lounge', '24-hour Dining', 'Express Dry Cleaning'],
      photos: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
      ],
      coordinates: { lat: 28.5516, lng: 77.1219 }
    },
    bharatMandapam: {
      id: 'place-mandapam',
      name: 'Bharat Mandapam (IECC) · Pragati Maidan',
      categoryName: 'World-Class International Exhibition Centre · 75th IIGF Venue',
      rating: 4.9,
      reviewsCount: 48200,
      priceLevel: 'Free Buyer Registration',
      address: 'Pragati Maidan, Mathura Rd, New Delhi, Delhi 110001, India',
      hours: '09:00 AM – 06:30 PM Daily (14–17 July 2026)',
      phone: '+91 11 2337 1540',
      website: 'https://www.iigf.in',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bharat+Mandapam+Pragati+Maidan+New+Delhi',
      tag: '75th IIGF Exhibition Complex',
      topReview: {
        author: 'Sarah Williams, UK Buyer',
        text: 'Magnificent architectural complex with state-of-the-art air conditioning, digital signage, and seamless hall transit.',
        stars: 5,
        source: 'Google Local Guide'
      },
      features: ['Gate 4 VIP Buyer Entry', 'Halls 1, 2, 3 Sourcing', 'Translation Lounges', 'B2B Suites'],
      photos: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
      ],
      coordinates: { lat: 28.6186, lng: 77.2435 }
    },
    bukhara: {
      id: 'place-bukhara',
      name: 'Bukhara — ITC Maurya',
      categoryName: 'Legendary Indian Fine Dining · Asia’s 50 Best Restaurants',
      rating: 4.9,
      reviewsCount: 11200,
      priceLevel: '$$$$',
      address: 'ITC Maurya, Sardar Patel Marg, Diplomatic Enclave, New Delhi 110021',
      hours: '12:30 PM – 02:45 PM, 07:00 PM – 11:45 PM',
      phone: '+91 11 2611 2233',
      website: 'https://www.itchotels.com',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bukhara+ITC+Maurya+New+Delhi',
      tag: 'Michelin Recommended Culinary Spot',
      topReview: {
        author: 'Bill Clinton & World Leaders Visit',
        text: 'The iconic Dal Bukhara slow-cooked for 18 hours and tandoori jumbo prawns are unmatched anywhere on earth.',
        stars: 5,
        source: 'Google Verified Review'
      },
      features: ['Table Reservation Required', 'Clay Tandoor Oven', 'Valet Parking', 'Cocktails'],
      photos: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80'
      ],
      coordinates: { lat: 28.5973, lng: 77.1739 }
    },
    indianAccent: {
      id: 'place-accent',
      name: 'Indian Accent — The Lodhi',
      categoryName: 'Progressive Indian Haute Cuisine · World’s 50 Best',
      rating: 4.9,
      reviewsCount: 9400,
      priceLevel: '$$$$',
      address: 'The Lodhi, Lodhi Rd, CGO Complex, Pragati Vihar, New Delhi 110003',
      hours: '12:00 PM – 02:30 PM, 07:00 PM – 11:00 PM',
      phone: '+91 11 6617 5151',
      website: 'https://indianaccent.com',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Indian+Accent+The+Lodhi+New+Delhi',
      tag: 'Top 50 Global Dining',
      topReview: {
        author: 'New York Times Review',
        text: 'Chef Manish Mehrotra invents a modern Indian vocabulary with refined tasting menus and exquisite wine pairings.',
        stars: 5,
        source: 'Google Local Guide'
      },
      features: ['Chef Tasting Menu', 'Waterfront Courtyard', 'Sommelier Selection', 'Private Dining'],
      photos: [
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'
      ],
      coordinates: { lat: 28.5916, lng: 77.2378 }
    },
    craftsMuseum: {
      id: 'place-crafts',
      name: 'National Crafts Museum & Hastkala Academy',
      categoryName: 'Heritage Textile & Handloom Museum',
      rating: 4.7,
      reviewsCount: 8900,
      priceLevel: '$$ · INR 300 Foreign Delegates',
      address: 'Bhairon Marg, Pragati Maidan, New Delhi, Delhi 110001 (Gate 2 Access)',
      hours: '09:30 AM – 06:00 PM (Closed Mondays)',
      phone: '+91 11 2337 1641',
      website: 'https://nationalcraftsmuseum.nic.in',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=National+Crafts+Museum+Pragati+Maidan+New+Delhi',
      tag: 'Textile Heritage Sanctuary',
      topReview: {
        author: 'Charlotte Dubois, Harrods Fashion',
        text: 'A treasure trove of 300-year-old kalamkari, chintz fabrics, and live handloom master artisans right beside the fair.',
        stars: 5,
        source: 'Google Local Guide'
      },
      features: ['Live Master Weavers', 'Heritage Cafe Lota', 'Artisan Village Replicas', 'Gift Souvenirs'],
      photos: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
      ],
      coordinates: { lat: 28.6142, lng: 77.2418 }
    },
    khanMarket: {
      id: 'place-khan',
      name: 'Khan Market Sourcing & Cafes (Town Hall / Andrea’s)',
      categoryName: 'Upscale Lifestyle & Gourmet District',
      rating: 4.8,
      reviewsCount: 24500,
      priceLevel: '$$$',
      address: 'Khan Market, Rabindra Nagar, New Delhi, Delhi 110003 (8 mins from Fair)',
      hours: '10:00 AM – 11:30 PM',
      phone: '+91 11 4359 8150',
      website: 'https://www.delhitourism.gov.in',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Khan+Market+New+Delhi',
      tag: 'Boutique & Cafe District',
      topReview: {
        author: 'Henrik Lindqvist, Stockholm EcoWear',
        text: 'Great coffee, artisan Indian fashion labels (Good Earth, Fabindia), and wonderful sushi at Town Hall.',
        stars: 5,
        source: 'Google Verified Review'
      },
      features: ['Boutique Apparel', 'Artisan Coffee', 'Fine Dining', 'Designer Bookstores'],
      photos: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
      ],
      coordinates: { lat: 28.6003, lng: 77.2272 }
    },
    chandniChowk: {
      id: 'place-chandni',
      name: 'Kinari Bazaar & Chandni Chowk Silk Heritage',
      categoryName: 'Historic Asian Textile & Zari Wholesale Quarter',
      rating: 4.6,
      reviewsCount: 65400,
      priceLevel: 'Wholesale B2B & Heritage',
      address: 'Chandni Chowk, Old Delhi, New Delhi, Delhi 110006',
      hours: '10:30 AM – 08:00 PM',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kinari+Bazaar+Chandni+Chowk+Delhi',
      tag: 'Old Delhi Heritage Walk',
      topReview: {
        author: 'Kenji Takahashi, Tokyo Retail',
        text: 'The vibrant history of brocade, trims, and heritage embroidery. A sensory feast with private haveli tea.',
        stars: 5,
        source: 'Google Local Guide'
      },
      features: ['Guided Electric Rickshaw', 'Heritage Haveli', 'Wholesale Trims', 'Ancient Spices'],
      photos: [
        'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80'
      ],
      coordinates: { lat: 28.6562, lng: 77.2300 }
    },
    dilliHaat: {
      id: 'place-dillihaat',
      name: 'Dilli Haat (INA) Crafts & Food Village',
      categoryName: 'Permanent Open-Air National Artisan Marketplace',
      rating: 4.7,
      reviewsCount: 42100,
      priceLevel: '$ · INR 100 Foreign Visitors',
      address: 'Sri Aurobindo Marg, Dilli Haat, Kidwai Nagar West, New Delhi 110023',
      hours: '10:30 AM – 10:00 PM Daily',
      phone: '+91 11 2611 9055',
      website: 'https://delhitourism.gov.in',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dilli+Haat+INA+New+Delhi',
      tag: 'Rural Artisan Craft Bazaar',
      topReview: {
        author: 'Matteo Rossi, Milano Fashion Group',
        text: 'Ideal final stop before flying home. Authentic pashminas, hand-painted textiles, and pan-Indian regional food stalls.',
        stars: 5,
        source: 'Google Local Guide'
      },
      features: ['Direct Master Craftsmen', 'Handmade Pashminas', 'Regional Food Courts', 'Cultural Shows'],
      photos: [
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80'
      ],
      coordinates: { lat: 28.5732, lng: 77.2081 }
    }
  };

  const dayPlans: DayPlan[] = [
    {
      dayNumber: 1,
      date: 'Tuesday, 14 July 2026',
      title: 'Arrival, VIP Badge Access & Hall 2 Knits Sourcing',
      highlight: 'VIP Airport Chauffeur + 2 High-Fidelity B2B Meetings + Bukhara Dinner',
      routeCoords: [
        PLACES_DB.airport.coordinates,
        PLACES_DB.tajHotel.coordinates,
        PLACES_DB.bharatMandapam.coordinates,
        PLACES_DB.bukhara.coordinates,
        PLACES_DB.tajHotel.coordinates
      ],
      items: [
        {
          id: 'd1-1',
          time: '08:15 AM',
          title: 'Landing at Indira Gandhi International Airport (DEL)',
          category: 'flight',
          location: 'Terminal 3 International Arrivals, Gate 5',
          desc: 'Meet your dedicated IIGF VIP Chauffeur with name placard. Direct air-conditioned luxury transfer to hotel.',
          image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80',
          badge: 'Complimentary VIP Transfer',
          placeInfo: PLACES_DB.airport
        },
        {
          id: 'd1-2',
          time: '09:45 AM',
          title: 'Check-in at The Taj Mahal Hotel (Man Singh Road)',
          category: 'hotel',
          location: 'Lutyens Central New Delhi',
          desc: 'Express overseas buyer check-in, luxury room key delivery, and luggage drop. Enjoy complimentary high-tea buffet.',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          badge: '4.8 ★ Luxury Partner',
          placeInfo: PLACES_DB.tajHotel
        },
        {
          id: 'd1-3',
          time: '11:00 AM',
          title: 'Fast-Track Badge Collection at Bharat Mandapam',
          category: 'fair',
          location: 'VIP Overseas Buyer Lounge, Gate 4',
          desc: 'Collect RFID NFC smart badge, official 75th IIGF Buyer Directory, and access complimentary espresso bar.',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
          badge: 'Gate 4 VIP Entry',
          placeInfo: PLACES_DB.bharatMandapam
        },
        {
          id: 'd1-4',
          time: '11:30 AM',
          title: 'B2B Meeting: ABC Textiles (Tirupur Cluster)',
          category: 'meeting',
          location: 'Hall 2 · Stall B-17 (Knitwear Bay)',
          desc: 'Review SS27 100% GOTS organic cotton combed knits, 180 GSM single jersey samples, and low MOQ 300 terms.',
          image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
          actionLabel: 'View ABC Textiles Dossier',
          exhibitor: DEMO_EXHIBITORS[0],
          badge: 'Match Fidelity: 94%',
          placeInfo: PLACES_DB.bharatMandapam
        },
        {
          id: 'd1-5',
          time: '01:15 PM',
          title: 'Executive Lunch at Overseas Buyer Hospitality Lounge',
          category: 'culinary',
          location: 'Level 2, Bharat Mandapam',
          desc: 'Multi-cuisine dining with live pasta station, North Indian tandoori delicacies, fresh tropical juices, and barista coffee.',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          badge: 'Complimentary Buyer Hospitality',
          placeInfo: PLACES_DB.bharatMandapam
        },
        {
          id: 'd1-6',
          time: '02:30 PM',
          title: 'B2B Meeting: XYZ Garments (Noida Cluster)',
          category: 'meeting',
          location: 'Hall 2 · Stall D-08 (Wovens Bay)',
          desc: 'Inspect tailored casualwear, poplin shirts, and digital sampling lead times.',
          image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
          actionLabel: 'View XYZ Garments Dossier',
          exhibitor: DEMO_EXHIBITORS[1],
          badge: 'Match Fidelity: 91%',
          placeInfo: PLACES_DB.bharatMandapam
        },
        {
          id: 'd1-7',
          time: '04:30 PM',
          title: '75th IIGF Grand Inaugural Runway Fashion Show',
          category: 'fair',
          location: 'Fashion Amphitheatre, Hall 1',
          desc: 'Live ramp show featuring Spring/Summer 2027 collections by top Indian designers and export houses.',
          image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
          badge: 'VIP Front Row Seating',
          placeInfo: PLACES_DB.bharatMandapam
        },
        {
          id: 'd1-8',
          time: '08:00 PM',
          title: 'Dinner: Iconic Indian Fine Dining at Bukhara (ITC Maurya)',
          category: 'culinary',
          location: 'Diplomatic Enclave, New Delhi',
          desc: 'World-famous clay oven tandoori cuisine, Dal Bukhara slow-cooked for 18 hours, and Sikandari Raan.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          badge: '4.9 ★ Michelin Guide Top 50',
          placeInfo: PLACES_DB.bukhara
        }
      ]
    },
    {
      dayNumber: 2,
      date: 'Wednesday, 15 July 2026',
      title: 'Artisanal Block Prints, Eco-Denim & Cultural Immersion',
      highlight: 'Jaipur & Bengaluru Clusters + National Crafts Museum Tour + AEPC Gala Dinner',
      routeCoords: [
        PLACES_DB.tajHotel.coordinates,
        PLACES_DB.bharatMandapam.coordinates,
        PLACES_DB.craftsMuseum.coordinates,
        PLACES_DB.tajHotel.coordinates
      ],
      items: [
        {
          id: 'd2-1',
          time: '10:15 AM',
          title: 'B2B Meeting: FashionWorks India (Jaipur Cluster)',
          category: 'meeting',
          location: 'Hall 1 · Stall A-12 (Artisanal Prints Bay)',
          desc: 'Explore hand-block vegetable dye resortwear, silk kaftans, and fair-trade certified artisan collectives.',
          image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=800&q=80',
          actionLabel: 'View FashionWorks Dossier',
          exhibitor: DEMO_EXHIBITORS[2],
          badge: 'Match Fidelity: 87%',
          placeInfo: PLACES_DB.bharatMandapam
        },
        {
          id: 'd2-2',
          time: '12:30 PM',
          title: 'Private Tour: National Crafts Museum & Hastkala Academy',
          category: 'culture',
          location: 'Pragati Maidan (Adjacent to Gate 2)',
          desc: 'Walk through 300-year-old handloom exhibits, live master weavers, and ancient chintz fabric heritage.',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
          badge: '4.7 ★ Textile Heritage',
          placeInfo: PLACES_DB.craftsMuseum
        },
        {
          id: 'd2-3',
          time: '02:30 PM',
          title: 'B2B Meeting: Global Apparel Co. (Bengaluru Hub)',
          category: 'meeting',
          location: 'Hall 3 · Stall C-22 (Circular Eco-Denim Bay)',
          desc: 'Examine laser-wash ozone denim, water-neutral manufacturing lines, and low carbon certifications.',
          image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
          actionLabel: 'View Global Apparel Dossier',
          exhibitor: DEMO_EXHIBITORS[3],
          badge: 'Match Fidelity: 84%',
          placeInfo: PLACES_DB.bharatMandapam
        },
        {
          id: 'd2-4',
          time: '07:30 PM',
          title: 'AEPC International Buyer Networking Gala & Banquet',
          category: 'culinary',
          location: 'The Leela Palace Ballroom, Chanakyapuri',
          desc: 'Cocktails, authentic Mughlai banquet, and informal discussions with AEPC Chairman & Top 50 Exporters.',
          image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
          badge: 'Official AEPC Gala',
          placeInfo: PLACES_DB.tajHotel
        }
      ]
    },
    {
      dayNumber: 3,
      date: 'Thursday, 16 July 2026',
      title: 'Commercial Negotiations, Swatches & Heritage Delhi Tour',
      highlight: 'Contract Pricing Finalization + Old Delhi Textile Heritage Walk & Indian Accent Dining',
      routeCoords: [
        PLACES_DB.tajHotel.coordinates,
        PLACES_DB.bharatMandapam.coordinates,
        PLACES_DB.khanMarket.coordinates,
        PLACES_DB.chandniChowk.coordinates,
        PLACES_DB.indianAccent.coordinates,
        PLACES_DB.tajHotel.coordinates
      ],
      items: [
        {
          id: 'd3-1',
          time: '10:00 AM',
          title: 'Second-Round Contract & Pricing Negotiations',
          category: 'meeting',
          location: 'Private Negotiation Suites, Hall 2',
          desc: 'Finalize FOB London pricing, lab dip delivery milestones, and sign Letters of Intent (LOI) with shortlisted manufacturers.',
          image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
          badge: 'Commercial Sign-off',
          placeInfo: PLACES_DB.bharatMandapam
        },
        {
          id: 'd3-2',
          time: '01:00 PM',
          title: 'Lunch at Khan Market: Town Hall / Andrea’s Eatery',
          category: 'culinary',
          location: 'Khan Market (8 mins from Pragati Maidan)',
          desc: 'Chic café dining, artisan coffee, and boutique shopping in Delhi’s premier diplomat market.',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          badge: '4.8 ★ Gourmet Hub',
          placeInfo: PLACES_DB.khanMarket
        },
        {
          id: 'd3-3',
          time: '03:30 PM',
          title: 'Guided Heritage Walk: Chandni Chowk & Kinari Bazaar',
          category: 'culture',
          location: 'Old Delhi Heritage Quarter',
          desc: 'Explore Asia’s largest silk, brocade, and zari wholesale quarter, followed by high tea at a restored 19th-century Haveli.',
          image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
          badge: '4.6 ★ Silk Heritage',
          placeInfo: PLACES_DB.chandniChowk
        },
        {
          id: 'd3-4',
          time: '07:30 PM',
          title: 'Modern Indian Haute Cuisine at Indian Accent (The Lodhi)',
          category: 'culinary',
          location: 'The Lodhi Hotel, Lodhi Road',
          desc: 'Acclaimed tasting menu by Chef Manish Mehrotra reimagining classic Indian flavors.',
          image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
          badge: '4.9 ★ World’s 50 Best',
          placeInfo: PLACES_DB.indianAccent
        }
      ]
    },
    {
      dayNumber: 4,
      date: 'Friday, 17 July 2026',
      title: 'Sample Confirmation, Dilli Haat Souvenirs & Airport Return',
      highlight: 'Air Courier Swatch Sign-offs + Dilli Haat Crafts Sourcing + VIP Airport Chauffeur Drop',
      routeCoords: [
        PLACES_DB.tajHotel.coordinates,
        PLACES_DB.bharatMandapam.coordinates,
        PLACES_DB.dilliHaat.coordinates,
        PLACES_DB.airport.coordinates
      ],
      items: [
        {
          id: 'd4-1',
          time: '10:30 AM',
          title: 'Final Sample Courier Sign-off at IIGF Logistics Desk',
          category: 'fair',
          location: 'Hall 2 Logistics Bay, Bharat Mandapam',
          desc: 'Confirm DHL / FedEx air-courier tracking numbers for sample garments shipped directly to London office.',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
          badge: 'DHL Air Tracking',
          placeInfo: PLACES_DB.bharatMandapam
        },
        {
          id: 'd4-2',
          time: '01:00 PM',
          title: 'Artisan Sourcing & Lunch at Dilli Haat (INA)',
          category: 'culture',
          location: 'INA Market, Sri Aurobindo Marg',
          desc: 'Open-air craft bazaar featuring rural master craftsmen, pashmina shawls, and regional street food stalls.',
          image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
          badge: '4.7 ★ Handloom Bazaar',
          placeInfo: PLACES_DB.dilliHaat
        },
        {
          id: 'd4-3',
          time: '05:30 PM',
          title: 'VIP Chauffeur Transfer to Indira Gandhi International Airport (DEL)',
          category: 'flight',
          location: 'Terminal 3 International Departures',
          desc: 'Arrive 3 hours ahead of scheduled evening flight to London Heathrow (LHR) / Europe.',
          image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=800&q=80',
          badge: 'VIP Airport Drop',
          placeInfo: PLACES_DB.airport
        }
      ]
    }
  ];

  const currentDayPlan = dayPlans.find(d => d.dayNumber === selectedDay) || dayPlans[0];

  const allMapPlaces = Object.values(PLACES_DB);

  // Focus map when clicking an itinerary item
  const handleFocusPlace = (place: GooglePlaceInfo) => {
    setMapCenter({ lat: place.coordinates.lat, lng: place.coordinates.lng });
    setMapZoom(14);
    setSelectedMarkerId(place.id);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'meeting':
        return 'bg-pink-100 text-[#E6005C] border-pink-200';
      case 'flight':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'hotel':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'fair':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'culinary':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'culture':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-[#DE0057] via-[#E6005C] to-[#C2004D] text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Autonomous Trade & Travel Concierge · 75th IIGF</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            AI Fair & Trip Planner for Global Buyers
          </h1>
          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
            Personalized 4-day itinerary with live plotted Google Maps routes, verified Google Business Profile ratings & reviews, live GPS transit directions, luxury hotel transfers, and curated Delhi dining.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-white border border-white/30 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-amber-300" />
              Airport & Hotel Shuttles Included
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-white border border-white/30 flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-amber-300" />
              Live Plotted Route Polylines
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-white border border-white/30 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              Google Business Profiles & Ratings
            </span>
          </div>
        </div>
      </div>

      {/* Control Customizer & View Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E6005C]" />
            <h3 className="text-sm font-black text-slate-900 uppercase">
              Buyer Schedule Parameters & Sourcing Focus
            </h3>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'split' ? 'bg-[#E6005C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Split View (List + Map)</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'list' ? 'bg-[#E6005C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'map' ? 'bg-[#E6005C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Full Interactive Map</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-600 block mb-1">Buyer Profile:</label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:border-[#E6005C]"
            />
            <span className="text-[11px] text-slate-500 mt-0.5 block">{buyerCompany}</span>
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1">Preferred Hotel Hub:</label>
            <select
              value={hotelChoice}
              onChange={(e) => setHotelChoice(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:border-[#E6005C]"
            >
              <option value="central">Central Delhi — The Taj Mahal Hotel (4.8 ★ · 10 mins)</option>
              <option value="aerocity">Aerocity — JW Marriott / Pullman (4.7 ★ · 25 mins)</option>
              <option value="gurugram">Gurugram — The Oberoi / Leela (4.8 ★ · 35 mins)</option>
            </select>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
              ✓ Free Official IIGF Shuttle Bus Connected
            </span>
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1">Target Sourcing Category:</label>
            <input
              type="text"
              value={sourcingFocus}
              onChange={(e) => setSourcingFocus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:border-[#E6005C]"
            />
            <span className="text-[11px] text-[#E6005C] font-semibold mt-0.5 block">
              Matched with 426 Certified Exporters
            </span>
          </div>
        </div>

        {/* Action Export Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Calendar invite (.ICS) generated with all 4 days synced!')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Export to Calendar (.ICS)</span>
            </button>

            <button
              onClick={() => showToast('PDF Comprehensive Trade & Travel Dossier downloaded!')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1.5 border border-slate-300 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Guide</span>
            </button>

            <button
              onClick={() => showToast('Itinerary & Google Map routes sent to buyer WhatsApp!')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Send to WhatsApp</span>
            </button>
          </div>

          {toastNotice && (
            <span className="text-xs font-bold text-[#E6005C] bg-pink-50 px-3 py-1 rounded-lg border border-pink-200 animate-fadeIn">
              {toastNotice}
            </span>
          )}
        </div>
      </div>

      {/* Day Selector Tabs (4 Fair Days: 14 to 17 July 2026) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {dayPlans.map((d) => (
          <button
            key={d.dayNumber}
            onClick={() => {
              setSelectedDay(d.dayNumber);
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedDay === d.dayNumber
                ? 'bg-[#E6005C] text-white border-[#E6005C] shadow-md ring-2 ring-pink-300 scale-101'
                : 'bg-white text-slate-800 border-slate-200 hover:border-pink-300 hover:bg-pink-50/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] uppercase font-black tracking-wider ${
                selectedDay === d.dayNumber ? 'text-amber-300' : 'text-[#E6005C]'
              }`}>
                Day 0{d.dayNumber} Route
              </span>
              <span className={`text-[10px] font-bold ${
                selectedDay === d.dayNumber ? 'text-pink-100' : 'text-slate-400'
              }`}>
                {d.date.split(',')[0]}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-black tracking-tight line-clamp-1">
              {d.date.split(',')[1]}
            </h4>
            <p className={`text-[11px] line-clamp-2 mt-1 leading-snug ${
              selectedDay === d.dayNumber ? 'text-white/90' : 'text-slate-500'
            }`}>
              {d.highlight}
            </p>
          </button>
        ))}
      </div>

      {/* Workspace: Split View / List / Map */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        {/* Left Column: Itinerary Cards with Rich Photos & Google Business Badges */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-7' : 'w-full'} space-y-6`}>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#E6005C] uppercase tracking-wider">
                    <span>Day {currentDayPlan.dayNumber} Schedule</span>
                    <span>·</span>
                    <span>{currentDayPlan.date}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                    {currentDayPlan.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                    <Route className="w-3.5 h-3.5 text-amber-600" />
                    <span>Plotted on Map</span>
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    {currentDayPlan.items.length} Stops
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200">
                {currentDayPlan.items.map((item, idx) => (
                  <div key={item.id} className="relative pl-10 group">
                    {/* Numbered Waypoint Dot */}
                    <div className="absolute left-1.5 top-4 -translate-x-1/2 w-6 h-6 rounded-full bg-[#E6005C] text-white font-bold text-[10px] flex items-center justify-center shadow-xs z-10">
                      {idx + 1}
                    </div>

                    {/* Card */}
                    <div 
                      onMouseEnter={() => {
                        setActiveItemId(item.id);
                        if (item.placeInfo) {
                          setSelectedMarkerId(item.placeInfo.id);
                        }
                      }}
                      className={`bg-slate-50/80 hover:bg-white border rounded-2xl p-4 sm:p-5 transition-all space-y-3 shadow-xs ${
                        activeItemId === item.id ? 'border-[#E6005C] ring-2 ring-pink-100 bg-white' : 'border-slate-200'
                      }`}
                    >
                      {/* Photo + Header Row */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* High-res Image Thumbnail */}
                        <div 
                          onClick={() => {
                            if (item.placeInfo) handleFocusPlace(item.placeInfo);
                          }}
                          className="relative w-full sm:w-36 h-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-xs group/img cursor-pointer"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Navigation className="w-2.5 h-2.5 text-amber-300" />
                            <span>STOP #{idx + 1}</span>
                          </div>
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900 tabular-nums bg-white px-2 py-0.5 rounded border border-slate-200">
                                {item.time}
                              </span>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getCategoryBadgeClass(item.category)}`}>
                                {item.category}
                              </span>
                              {item.badge && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                if (item.placeInfo) handleFocusPlace(item.placeInfo);
                              }}
                              className="text-[11px] font-semibold text-slate-600 hover:text-[#E6005C] flex items-center gap-1 cursor-pointer"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#E6005C]" />
                              <span>{item.location}</span>
                            </button>
                          </div>

                          <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                            {item.title}
                          </h3>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* Google Business Profile Mini Bar & Actions */}
                      {item.placeInfo && (
                        <div className="pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          {/* Rating & Review Counter */}
                          <button
                            onClick={() => setActivePlaceModal(item.placeInfo!)}
                            className="flex items-center gap-2 text-slate-700 hover:text-[#E6005C] font-semibold cursor-pointer group/btn"
                          >
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-900 font-bold text-[11px]">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>{item.placeInfo.rating}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 group-hover/btn:underline">
                              ({item.placeInfo.reviewsCount.toLocaleString()} Google Reviews)
                            </span>
                            <span className="text-[10px] font-bold text-[#E6005C] bg-pink-50 px-1.5 py-0.5 rounded">
                              View Google Profile
                            </span>
                          </button>

                          {/* Direct Map / Action Links */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleFocusPlace(item.placeInfo!)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-md border border-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Navigation className="w-3 h-3 text-[#E6005C]" />
                              <span>Locate on Map</span>
                            </button>

                            <a
                              href={item.placeInfo.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-md border border-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3 text-blue-600" />
                              <span>Directions</span>
                            </a>

                            {item.exhibitor && (
                              <button
                                onClick={() => onOpenExhibitorModal(item.exhibitor!)}
                                className="px-3 py-1 bg-[#E6005C] hover:bg-[#C2004D] text-white text-[11px] font-bold rounded shadow-xs cursor-pointer"
                              >
                                {item.actionLabel || 'View Dossier'}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Real Google Maps View with Plotted Route */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-5' : 'w-full'} space-y-6`}>
            {/* Real Map Container */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 text-slate-900 shadow-md space-y-4 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#E6005C]" />
                    <span>Real Google Map · Day {selectedDay} Plotted Route</span>
                  </h3>
                </div>

                {/* Map Type Controls */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    onClick={() => setMapType('roadmap')}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      mapType === 'roadmap' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Map
                  </button>
                  <button
                    onClick={() => setMapType('hybrid')}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      mapType === 'hybrid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Satellite
                  </button>
                </div>
              </div>

              {/* Real Map Canvas Wrapper */}
              <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                <APIProvider apiKey={googleMapsApiKey}>
                  <Map
                    mapId="DEMO_MAP_ID"
                    center={mapCenter}
                    zoom={mapZoom}
                    mapTypeId={mapType}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    className="w-full h-full"
                    internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                  >
                    {/* Render Plotted Route Polyline */}
                    <MapRoutePolyline path={currentDayPlan.routeCoords} strokeColor="#E6005C" />

                    {/* Live Venue Markers */}
                    {allMapPlaces.map((place) => {
                      const isSelected = selectedMarkerId === place.id;
                      const isMandapam = place.id === 'place-mandapam';

                      return (
                        <AdvancedMarker
                          key={place.id}
                          position={{ lat: place.coordinates.lat, lng: place.coordinates.lng }}
                          onClick={() => {
                            setSelectedMarkerId(place.id);
                            setActivePlaceModal(place);
                          }}
                          title={place.name}
                        >
                          <Pin
                            background={isMandapam ? '#E6005C' : isSelected ? '#10B981' : '#1E293B'}
                            borderColor={isMandapam ? '#FBBF24' : '#FFFFFF'}
                            glyphColor="#FFFFFF"
                            scale={isMandapam ? 1.4 : isSelected ? 1.25 : 1.0}
                          />
                        </AdvancedMarker>
                      );
                    })}

                    {/* Active Venue InfoWindow */}
                    {selectedMarkerId && (
                      (() => {
                        const selectedPlace = allMapPlaces.find(p => p.id === selectedMarkerId);
                        if (!selectedPlace) return null;

                        return (
                          <InfoWindow
                            position={{ lat: selectedPlace.coordinates.lat, lng: selectedPlace.coordinates.lng }}
                            onCloseClick={() => setSelectedMarkerId(null)}
                          >
                            <div className="p-2 max-w-[220px] text-xs space-y-1.5 font-sans">
                              <span className="text-[10px] font-bold text-[#E6005C] uppercase block">
                                {selectedPlace.tag}
                              </span>
                              <h4 className="font-black text-slate-900 text-xs line-clamp-1">
                                {selectedPlace.name}
                              </h4>
                              <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>{selectedPlace.rating}</span>
                                <span className="text-slate-400 font-normal">
                                  ({selectedPlace.reviewsCount.toLocaleString()})
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-2">
                                {selectedPlace.address}
                              </p>
                              <button
                                onClick={() => setActivePlaceModal(selectedPlace)}
                                className="w-full py-1 bg-[#E6005C] text-white text-[10px] font-bold rounded cursor-pointer mt-1"
                              >
                                View Google Profile
                              </button>
                            </div>
                          </InfoWindow>
                        );
                      })()
                    )}
                  </Map>
                </APIProvider>

                {/* Quick Camera Navigation Overlay Chips */}
                <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[90%]">
                  <button
                    onClick={() => {
                      setMapCenter(PLACES_DB.bharatMandapam.coordinates);
                      setMapZoom(14);
                      setSelectedMarkerId(PLACES_DB.bharatMandapam.id);
                    }}
                    className="px-2.5 py-1 bg-white/95 hover:bg-white text-slate-900 rounded-lg text-[10px] font-bold shadow border border-slate-200 cursor-pointer backdrop-blur-xs flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#E6005C]" />
                    <span>Bharat Mandapam</span>
                  </button>

                  <button
                    onClick={() => {
                      setMapCenter(PLACES_DB.tajHotel.coordinates);
                      setMapZoom(15);
                      setSelectedMarkerId(PLACES_DB.tajHotel.id);
                    }}
                    className="px-2.5 py-1 bg-white/95 hover:bg-white text-slate-900 rounded-lg text-[10px] font-bold shadow border border-slate-200 cursor-pointer backdrop-blur-xs flex items-center gap-1"
                  >
                    <Building2 className="w-3 h-3 text-purple-600" />
                    <span>Hotel Hub</span>
                  </button>

                  <button
                    onClick={() => {
                      setMapCenter(PLACES_DB.airport.coordinates);
                      setMapZoom(14);
                      setSelectedMarkerId(PLACES_DB.airport.id);
                    }}
                    className="px-2.5 py-1 bg-white/95 hover:bg-white text-slate-900 rounded-lg text-[10px] font-bold shadow border border-slate-200 cursor-pointer backdrop-blur-xs flex items-center gap-1"
                  >
                    <Plane className="w-3 h-3 text-blue-600" />
                    <span>Airport T3</span>
                  </button>

                  <button
                    onClick={() => {
                      setMapCenter(PLACES_DB.bukhara.coordinates);
                      setMapZoom(15);
                      setSelectedMarkerId(PLACES_DB.bukhara.id);
                    }}
                    className="px-2.5 py-1 bg-white/95 hover:bg-white text-slate-900 rounded-lg text-[10px] font-bold shadow border border-slate-200 cursor-pointer backdrop-blur-xs flex items-center gap-1"
                  >
                    <Utensils className="w-3 h-3 text-emerald-600" />
                    <span>Bukhara</span>
                  </button>
                </div>
              </div>

              {/* Real-time Distance & Transit Optimization Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="text-[#E6005C] flex items-center gap-1.5">
                    <Route className="w-3.5 h-3.5" />
                    <span>Day {selectedDay} Plotted Route Sequence ({currentDayPlan.routeCoords.length} Points):</span>
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                    Active GPS Polyline
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="block text-slate-800">Airport ➔ Hotel</strong>
                    <span>14 km · ~20 mins</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="block text-slate-800">Hotel ➔ Fair Ground</strong>
                    <span>4.2 km · ~10 mins</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <strong className="block text-slate-800">Fair ➔ Dining/Culture</strong>
                    <span>6 km · ~15 mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Google Business Profile Modal / Drawer */}
      {activePlaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
            {/* Modal Header Photo Carousel */}
            <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
              <img
                src={activePlaceModal.photos[0]}
                alt={activePlaceModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <button
                onClick={() => setActivePlaceModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="text-[11px] font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                  {activePlaceModal.tag}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">{activePlaceModal.name}</h2>
                <p className="text-xs text-slate-200">{activePlaceModal.categoryName}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700">
              {/* Star Rating Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-black text-amber-900 flex items-center gap-1">
                    <span>{activePlaceModal.rating}</span>
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-600 font-semibold">
                      {activePlaceModal.reviewsCount.toLocaleString()} verified Google Reviews
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Google Verified Business</span>
                </span>
              </div>

              {/* Address & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <strong className="text-slate-900 block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E6005C]" />
                    <span>Address:</span>
                  </strong>
                  <p className="text-slate-600">{activePlaceModal.address}</p>
                </div>

                <div className="space-y-1">
                  <strong className="text-slate-900 block flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hours:</span>
                  </strong>
                  <p className="text-slate-600">{activePlaceModal.hours}</p>
                </div>
              </div>

              {/* Featured Amenities / Badges */}
              <div className="space-y-2">
                <strong className="text-slate-900 uppercase text-[11px] tracking-wider block">
                  Highlights & Amenities:
                </strong>
                <div className="flex flex-wrap gap-1.5">
                  {activePlaceModal.features.map((f, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Verified Review Quote */}
              <div className="bg-[#FDF2F5] border border-pink-200 p-4 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#E6005C] text-[11px]">
                    {activePlaceModal.topReview.author}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {activePlaceModal.topReview.source}
                  </span>
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{activePlaceModal.topReview.text}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setActivePlaceModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Close
                </button>

                <a
                  href={activePlaceModal.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-[#E6005C] hover:bg-[#C2004D] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Maps & Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
