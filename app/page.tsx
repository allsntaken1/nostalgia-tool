'use client';

import { ArrowRight, Home, Shuffle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

type SavedItem = {
  id: string;
  title: string;
  imageUrl: string;
  thumbUrl: string;
  source: string;
  sourceUrl?: string;
  originalQuery: string;
  decade: string;
  category: string;
  subTags: string[];
  extraTags: string[];
  savedAt: string;
};

type VolumeStats = {
  id: string;
  volumeUp: number;
  volumeDown: number;
};

type Channel = {
  id: string;
  number: string;
  title: string;
  color: string;
  category: string;
  description: string;
  subs: string[];
};

type Era = '80s' | '90s' | '2000s';

type EraTheme = {
  label: Era;
  pageBg: string;
  frameBg: string;
  header: string;
  copyPanel: string;
  panelExtra: string;
  stripe: string;
  titleClass: string;
  accentBlock: string;
  primaryButton: string;
  secondaryButton: string;
  shapeOne: string;
  shapeTwo: string;
  shapeThree: string;
  guideOuter: string;
  guideInner: string;
  guideHeader: string;
  guideLive: string;
  guideEven: string;
  guideOdd: string;
  guideFocus: string;
  ticker: string;
};

const eraThemes: Record<Era, EraTheme> = {
  '80s': {
    label: '80s',
    pageBg: 'bg-[#1a0b4a] bg-[radial-gradient(circle_at_14%_10%,#fff36d_0_4%,transparent_5%),radial-gradient(circle_at_85%_18%,#54f5ff_0_5%,transparent_6%),linear-gradient(135deg,#ff5fb7_0%,#7a4cff_36%,#1827a8_68%,#0c0633_100%)]',
    frameBg: 'bg-[#fff7c2]',
    header: 'bg-[#fff36d]',
    copyPanel: 'bg-[#fffbce]',
    panelExtra: 'era-panel-80s',
    stripe: 'bg-[repeating-linear-gradient(90deg,#ff4fae_0_34px,#fff36d_34px_68px,#54f5ff_68px_102px,#65e85d_102px_136px,#ff8a2a_136px_170px)]',
    titleClass: 'era-title-80s',
    accentBlock: 'bg-[#ff4fae] text-white shadow-[4px_4px_0_#111827]',
    primaryButton: 'bg-[#ff4fae] text-white shadow-[5px_5px_0_#54f5ff] hover:bg-[#fff36d] hover:text-black',
    secondaryButton: 'bg-[#fff36d] text-black shadow-[5px_5px_0_#ff4fae] hover:bg-[#54f5ff]',
    shapeOne: 'border-[#ff4fae]',
    shapeTwo: 'bg-[#fff36d]',
    shapeThree: 'bg-[#54f5ff]',
    guideOuter: 'bg-[#ff8a2a]',
    guideInner: 'bg-[#25105f]',
    guideHeader: 'border-[#fff36d]/80 bg-[#120733] text-[#fff36d]',
    guideLive: 'border-[#fff36d] bg-[#fff36d] text-black',
    guideEven: 'border-[#54f5ff] bg-[#2a4fc9] text-white',
    guideOdd: 'border-[#ff4fae] bg-[#8f2aa8] text-white',
    guideFocus: 'focus:ring-[#fff36d]',
    ticker: 'bg-[#25105f] text-white',
  },
  '90s': {
    label: '90s',
    pageBg: 'bg-[radial-gradient(circle_at_15%_0%,#7bdff2_0%,#4361ee_28%,#3a0ca3_58%,#16002f_100%)]',
    frameBg: 'bg-[#fff8e8]',
    header: 'bg-gradient-to-r from-[#ff4d6d] via-[#ffbe0b] to-[#7bdff2]',
    copyPanel: 'bg-[#dff7ff]',
    panelExtra: '',
    stripe: 'bg-[repeating-linear-gradient(90deg,#ff4d6d_0_42px,#ffbe0b_42px_84px,#7bdff2_84px_126px,#90be6d_126px_168px)]',
    titleClass: 'era-title-90s',
    accentBlock: 'bg-[#3a0ca3] text-[#ffd166]',
    primaryButton: 'bg-[#ff4d6d] text-white shadow-[5px_5px_0_#3a0ca3] hover:bg-[#ffbe0b] hover:text-black',
    secondaryButton: 'bg-white text-black shadow-[5px_5px_0_#3a0ca3] hover:bg-[#ffbe0b]',
    shapeOne: 'border-[#ff4d6d]',
    shapeTwo: 'bg-[#ffbe0b]',
    shapeThree: 'bg-[#7bdff2]',
    guideOuter: 'bg-[#ff4d6d]',
    guideInner: 'bg-[#17005c]',
    guideHeader: 'border-[#7bdff2]/70 bg-[#0b0636] text-[#ffd166]',
    guideLive: 'border-[#ffbe0b] bg-[#ffd166] text-black',
    guideEven: 'border-[#7bdff2] bg-[#233f9f] text-white',
    guideOdd: 'border-[#ff4d6d] bg-[#2d197d] text-white',
    guideFocus: 'focus:ring-[#ffd166]',
    ticker: 'bg-[#2b2d42] text-white',
  },
  '2000s': {
    label: '2000s',
    pageBg: 'bg-[#001f3f] bg-[radial-gradient(circle_at_12%_16%,#00f5d4_0_5%,transparent_6%),radial-gradient(circle_at_88%_14%,#ff4fd8_0_4%,transparent_5%),linear-gradient(135deg,#b5f8ff_0%,#3a86ff_32%,#0437a0_62%,#00132e_100%)]',
    frameBg: 'bg-[#e9fbff]',
    header: 'bg-gradient-to-r from-[#7df9ff] via-[#ffffff] to-[#ff4fd8]',
    copyPanel: 'bg-[#e6fbff]',
    panelExtra: 'era-panel-2000s',
    stripe: 'bg-[repeating-linear-gradient(90deg,#7df9ff_0_40px,#ffffff_40px_80px,#ff4fd8_80px_120px,#b8ff4d_120px_160px,#3a86ff_160px_200px)]',
    titleClass: 'era-title-2000s',
    accentBlock: 'bg-[#001f3f] text-[#7df9ff]',
    primaryButton: 'bg-[#ff4fd8] text-white shadow-[5px_5px_0_#3a86ff] hover:bg-[#b8ff4d] hover:text-black',
    secondaryButton: 'bg-white text-black shadow-[5px_5px_0_#7df9ff] hover:bg-[#ff4fd8] hover:text-white',
    shapeOne: 'border-[#ff4fd8]',
    shapeTwo: 'bg-[#b8ff4d]',
    shapeThree: 'bg-[#7df9ff]',
    guideOuter: 'bg-[#ff4fd8]',
    guideInner: 'bg-[#001f3f]',
    guideHeader: 'border-[#7df9ff]/80 bg-[#00132e] text-[#b8ff4d]',
    guideLive: 'border-[#b8ff4d] bg-[#b8ff4d] text-black',
    guideEven: 'border-[#7df9ff] bg-[#053e9f] text-white',
    guideOdd: 'border-[#ff4fd8] bg-[#11246d] text-white',
    guideFocus: 'focus:ring-[#ff4fd8]',
    ticker: 'bg-[#00132e] text-[#7df9ff]',
  },
};

const channelData: Channel[] = [
  {
    id: 'stores',
    number: '01',
    title: 'Stores',
    color: 'from-[#ff4d6d] to-[#ffb703]',
    category: 'STORES',
    description: 'Big box aisles, toy stores, electronics, grocery trips, and video rentals.',
    subs: ['Big Box', 'Toy Stores', 'Electronics', 'Grocery', 'Department', 'Video Stores'],
  },
  {
    id: 'malls',
    number: '02',
    title: 'Malls',
    color: 'from-[#4361ee] to-[#4cc9f0]',
    category: 'MALLS',
    description: 'Food courts, escalators, anchor stores, kiosks, and wandering with no plan.',
    subs: ['Mall Interiors', 'Food Courts', 'Anchor Stores', 'Specialty Shops', 'Kiosks', 'Mall Events'],
  },
  {
    id: 'themeparks',
    number: '03',
    title: 'Theme Parks',
    color: 'from-[#8338ec] to-[#ff006e]',
    category: 'THEME PARKS',
    description: 'Rides, lands, resorts, queues, signage, and park food.',
    subs: ['Rides', 'Park Areas', 'Resorts', 'Food & Dining', 'Queues', 'Maps & Signage'],
  },
  {
    id: 'restaurants',
    number: '04',
    title: 'Restaurants',
    color: 'from-[#fb8500] to-[#ffd166]',
    category: 'RESTAURANTS',
    description: 'Fast food interiors, pizza places, buffets, dining rooms, and play places.',
    subs: ['Fast Food', 'Pizza Places', 'Casual Dining', 'Play Places', 'Buffets', 'Drive-Thru'],
  },
  {
    id: 'homelife',
    number: '05',
    title: 'Home Life',
    color: 'from-[#90be6d] to-[#f9c74f]',
    category: 'HOME LIFE',
    description: 'Living rooms, bedrooms, kitchens, basements, and early computer setups.',
    subs: ['Living Rooms', 'Bedrooms', 'Kitchens', 'Basements', 'Game Rooms', 'Home Computers'],
  },
  {
    id: 'schools',
    number: '06',
    title: 'Schools',
    color: 'from-[#06d6a0] to-[#118ab2]',
    category: 'SCHOOLS',
    description: 'Classrooms, cafeterias, hallways, playgrounds, libraries, and school events.',
    subs: ['Classrooms', 'Cafeterias', 'Hallways', 'Playgrounds', 'Libraries', 'School Events'],
  },
  {
    id: 'arcades',
    number: '07',
    title: 'Arcades & Gaming',
    color: 'from-[#7209b7] to-[#3a86ff]',
    category: 'ARCADES & GAMING',
    description: 'Arcades, store kiosks, LAN rooms, prize counters, and console corners.',
    subs: ['Arcades', 'Store Kiosks', 'LAN Setups', 'Console Rooms', 'Prize Areas', 'Game Corners'],
  },
  {
    id: 'movies',
    number: '08',
    title: 'Movies & Entertainment',
    color: 'from-[#ef476f] to-[#ffd166]',
    category: 'MOVIES & ENTERTAINMENT',
    description: 'Movie theaters, video stores, drive-ins, concession counters, and VHS shelves.',
    subs: ['Movie Theaters', 'Drive-Ins', 'Video Rentals', 'Home Media', 'Concessions', 'Lobby Spaces'],
  },
  {
    id: 'travel',
    number: '09',
    title: 'Travel & Vacation',
    color: 'from-[#00b4d8] to-[#90e0ef]',
    category: 'TRAVEL & VACATION',
    description: 'Hotels, airports, airplanes, gas stations, diners, and roadside stops.',
    subs: ['Airports', 'Airplanes', 'Hotels', 'Motels', 'Roadside Stops', 'Travel Interiors'],
  },
  {
    id: 'outdoors',
    number: '10',
    title: 'Outdoors',
    color: 'from-[#52b788] to-[#d9ed92]',
    category: 'OUTDOORS',
    description: 'Neighborhoods, parks, pools, playgrounds, campgrounds, and skate spots.',
    subs: ['Parks', 'Neighborhoods', 'Pools', 'Playgrounds', 'Campgrounds', 'Skate Parks'],
  },
  {
    id: 'cars',
    number: '11',
    title: 'Cars & Road Life',
    color: 'from-[#f94144] to-[#f9844a]',
    category: 'CARS & ROAD LIFE',
    description: 'Car interiors, road trips, dealerships, parking lots, and life on the road.',
    subs: ['Car Interiors', 'Road Trips', 'Parking Lots', 'Dealerships', 'Dashboard Views', 'Car Culture'],
  },
  {
    id: 'everyday',
    number: '12',
    title: 'Everyday Spaces',
    color: 'from-[#8d99ae] to-[#edf2f4]',
    category: 'EVERYDAY SPACES',
    description: 'Waiting rooms, laundromats, doctor offices, bathrooms, and forgotten everyday places.',
    subs: ['Waiting Rooms', 'Doctor Offices', 'Laundromats', 'Bathrooms', 'Government Buildings', 'Misc. Spaces'],
  },
];

const GUIDE_ITEMS: Record<string, string[]> = {
  STORES: [
    'Kmart',
    'Walmart',
    'Target',
    'Toys R Us',
    'KB Toys',
    'Kay-Bee Toys',
    'Circuit City',
    'RadioShack',
    'Best Buy',
    'CompUSA',
    'Media Play',
    'Blockbuster Video',
    'Hollywood Video',
    'Borders',
    'Waldenbooks',
    'Sam Goody',
    'Suncoast',
    'Sears',
    'JCPenney',
    'Ames',
    'Hills',
    'Service Merchandise',
    'Woolworth',
    'Eckerd',
  ],
  MALLS: [
    'Food Courts',
    'Mall Interiors',
    'Anchor Stores',
    'Specialty Shops',
    "Auntie Anne's",
    'Cinnabon',
    'Orange Julius',
    'Hot Dog on a Stick',
    "Wetzel's Pretzels",
    'Great American Cookies',
    'Mrs. Fields',
    'Charleys Philly Steaks',
    'Villa Italian Kitchen',
    'Johnny Rockets',
    "Nathan's Famous",
    'TCBY',
    'Sam Goody',
    'KB Toys',
    'Waldenbooks',
    'Spencer Gifts',
  ],
  'THEME PARKS': [
    'Main Gates',
    'Dark Rides',
    'Roller Coasters',
    'Water Rides',
    'Arcades',
    'Midways',
    'Gift Shops',
    'Park Maps',
    'Queue Lines',
    'Resort Lobbies',
    'Food Courts',
    'Parade Routes',
    'Character Dining',
    'Monorails',
    'Water Parks',
  ],
  RESTAURANTS: [
    'A&W Restaurants',
    "Arby's",
    'Back Yard Burgers',
    'Blimpie',
    'Bojangles',
    'Boston Market',
    'Burger Chef',
    'Burger King',
    "Captain D's",
    "Carl's Jr.",
    'Checkers',
    "Rally's",
    "Church's Chicken",
    "Culver's",
    'Dairy Queen',
    'Del Taco',
    "Domino's Pizza",
    'El Pollo Loco',
    'Five Guys',
    "Hardee's",
    'In-N-Out Burger',
    'Jack in the Box',
    'KFC',
    'Krystal',
    'Little Caesars',
    "Long John Silver's",
    "McDonald's",
    'Panda Express',
    "Papa John's",
    'Pizza Hut',
    'Popeyes',
    'Quiznos',
    'Roy Rogers Restaurants',
    'Sbarro',
    "Schlotzsky's",
    'Sonic Drive-In',
    "Steak 'n Shake",
    'Subway',
    'Taco Bell',
    "Wendy's",
    'Whataburger',
    'White Castle',
    'Wingstop',
    "Zaxby's",
    "Applebee's",
    "Bennigan's",
    'Bob Evans',
    'Buffalo Wild Wings',
    'California Pizza Kitchen',
    "Chili's",
    'Cracker Barrel',
    "Denny's",
    "Friendly's",
    'Golden Corral',
    'Hooters',
    'IHOP',
    "Marie Callender's",
    'Olive Garden',
    'Outback Steakhouse',
    'Perkins Restaurant & Bakery',
    'Ponderosa Steakhouse',
    'Bonanza Steakhouse',
    'Red Lobster',
    'Red Robin',
    'Ruby Tuesday',
    "Shoney's",
    'Sizzler',
    'Steak and Ale',
    'TGI Fridays',
    "Tony Roma's",
    'Waffle House',
  ],
  'HOME LIFE': [
    'Living Rooms',
    'Bedrooms',
    'Kitchens',
    'Basements',
    'Game Rooms',
    'Computer Desks',
    'TV Stands',
    'VHS Shelves',
    'Bean Bag Corners',
    'Garage Fridges',
    'Rec Rooms',
    'Holiday Tables',
    'Carpeted Stairs',
    'Wallpaper Kitchens',
  ],
  SCHOOLS: [
    'Classrooms',
    'Cafeterias',
    'Hallways',
    'Lockers',
    'Libraries',
    'Computer Labs',
    'Gymnasiums',
    'Playgrounds',
    'School Buses',
    'Book Fairs',
    'Science Fairs',
    'Pep Rallies',
    'Auditoriums',
  ],
  'ARCADES & GAMING': [
    'Arcades',
    'Prize Counters',
    'Token Machines',
    'Fighting Cabinets',
    'Racing Cabinets',
    'Light Gun Games',
    'Pinball Rows',
    'LAN Rooms',
    'Console Setups',
    'Store Kiosks',
    'Demo Stations',
    'Game Corners',
    'Birthday Rooms',
  ],
  'MOVIES & ENTERTAINMENT': [
    'Movie Theaters',
    'Cinema Lobbies',
    'Concession Counters',
    'Drive-Ins',
    'Video Rentals',
    'VHS Shelves',
    'DVD Walls',
    'Ticket Booths',
    'Arcade Corners',
    'Poster Halls',
    'Home Media Rooms',
  ],
  'TRAVEL & VACATION': [
    'Airports',
    'Airplanes',
    'Hotels',
    'Motels',
    'Roadside Stops',
    'Gas Stations',
    'Diners',
    'Hotel Pools',
    'Luggage Carts',
    'Rental Counters',
    'Rest Areas',
    'Boardwalks',
  ],
  OUTDOORS: [
    'Parks',
    'Neighborhoods',
    'Pools',
    'Playgrounds',
    'Campgrounds',
    'Skate Parks',
    'Cul-de-sacs',
    'Bike Trails',
    'Basketball Courts',
    'Mini Golf',
    'Water Parks',
    'Picnic Shelters',
  ],
  'CARS & ROAD LIFE': [
    'Car Interiors',
    'Road Trips',
    'Parking Lots',
    'Dealerships',
    'Dashboard Views',
    'Car Culture',
    'Back Seats',
    'Drive-Thrus',
    'Gas Pumps',
    'Rest Stops',
    'Cassette Decks',
    'Cup Holders',
  ],
  'EVERYDAY SPACES': [
    'Waiting Rooms',
    'Doctor Offices',
    'Dentist Offices',
    'Laundromats',
    'Bathrooms',
    'DMV',
    'Banks',
    'Post Offices',
    'Hair Salons',
    'Carpeted Offices',
    'Church Halls',
    'Community Centers',
  ],
};

const homeGuideItems = channelData.map((channel) => `CH ${channel.number} ${channel.title}`);
const HIDDEN_PUBLIC_TAGS = new Set(['chrome extension', 'extension save', 'saved by: admin']);
const CHANNEL_DEEP_TAG_PRESETS: Record<string, Record<string, string[]>> = {
  STORES: {
    'Big Box': ['Walmart', 'Kmart', 'Target', 'Ames', 'Hills', 'Bradlees', 'Caldor', 'Venture', 'Zayre', 'Jamesway', 'Meijer', 'Fred Meyer', 'ShopKo', 'Service Merchandise', 'Woolworth', 'Woolco', 'Korvettes', 'Gemco', 'Two Guys', 'FedMart'],
    'Toy Stores': ['Toys R Us', 'KB Toys', 'Kay-Bee Toys', 'FAO Schwarz', 'Child World', "Children's Palace", 'Lionel Kiddie City'],
    Electronics: ['Circuit City', 'RadioShack', 'Best Buy', 'CompUSA', 'The Wiz', 'Nobody Beats the Wiz', 'Good Guys', "Fry's Electronics", 'Tweeter'],
    Grocery: ['ShopRite', 'Kroger', 'Publix', 'Winn-Dixie', 'Pathmark', 'A&P', 'Albertsons', 'Safeway', 'Food Lion', 'Piggly Wiggly', "Dominick's", 'Eagle Food Centers', 'Grand Union'],
    Department: ['Sears', 'JCPenney', "Macy's", 'Montgomery Ward', 'Mervyns', 'Dayton Hudson', "Hecht's", "Filene's", "Foley's", 'Burdines', 'The Bon-Ton'],
    'Video Stores': ['Blockbuster Video', 'Hollywood Video', 'Movie Gallery'],
  },
  MALLS: {
    'Mall Interiors': ['Fountains', 'Escalators', 'Skylights', 'Directories', 'Seating Areas'],
    'Food Courts': [
      "Auntie Anne's",
      'Cinnabon',
      'Orange Julius',
      'Hot Dog on a Stick',
      "Wetzel's Pretzels",
      'Great American Cookies',
      'Mrs. Fields',
      'Charleys Philly Steaks',
      'Villa Italian Kitchen',
      'Johnny Rockets',
      "Nathan's Famous",
      'TCBY',
    ],
    'Anchor Stores': ['Sears', 'JCPenney', "Macy's", "Dillard's", 'Nordstrom'],
    'Specialty Shops': ['Sam Goody', 'KB Toys', 'Waldenbooks', 'Suncoast', 'Spencer Gifts'],
    Kiosks: ['Calendar Kiosks', 'Phone Cases', 'Perfume Carts', 'Pretzel Stands'],
    'Mall Events': ['Santa Display', 'Easter Bunny', 'Car Giveaways', 'Center Court Events'],
  },
  RESTAURANTS: {
    'Fast Food': [
      'A&W Restaurants',
      "Arby's",
      'Back Yard Burgers',
      'Blimpie',
      'Bojangles',
      'Boston Market',
      'Burger Chef',
      'Burger King',
      "Captain D's",
      "Carl's Jr.",
      'Checkers',
      "Rally's",
      "Church's Chicken",
      "Culver's",
      'Dairy Queen',
      'Del Taco',
      "Domino's Pizza",
      'El Pollo Loco',
      'Five Guys',
      "Hardee's",
      'In-N-Out Burger',
      'Jack in the Box',
      'KFC',
      'Krystal',
      'Little Caesars',
      "Long John Silver's",
      "McDonald's",
      'Panda Express',
      "Papa John's",
      'Pizza Hut',
      'Popeyes',
      'Quiznos',
      'Roy Rogers Restaurants',
      'Sbarro',
      "Schlotzsky's",
      'Sonic Drive-In',
      "Steak 'n Shake",
      'Subway',
      'Taco Bell',
      "Wendy's",
      'Whataburger',
      'White Castle',
      'Wingstop',
      "Zaxby's",
    ],
    'Pizza Places': ["Domino's Pizza", 'Little Caesars', "Papa John's", 'Pizza Hut', 'Sbarro'],
    'Casual Dining': [
      "Applebee's",
      "Bennigan's",
      'Bob Evans',
      'Buffalo Wild Wings',
      'California Pizza Kitchen',
      "Chili's",
      'Cracker Barrel',
      "Denny's",
      "Friendly's",
      'Golden Corral',
      'Hooters',
      'IHOP',
      "Marie Callender's",
      'Olive Garden',
      'Outback Steakhouse',
      'Perkins Restaurant & Bakery',
      'Ponderosa Steakhouse',
      'Bonanza Steakhouse',
      'Red Lobster',
      'Red Robin',
      'Ruby Tuesday',
      "Shoney's",
      'Sizzler',
      'Steak and Ale',
      'TGI Fridays',
      "Tony Roma's",
      'Waffle House',
    ],
    'Play Places': ["McDonald's PlayPlace", 'Burger King Kids Club', 'Chuck E. Cheese'],
    Buffets: ['Golden Corral', 'Ponderosa Steakhouse', 'Bonanza Steakhouse', "Shoney's", 'Sizzler'],
    'Drive-Thru': ["McDonald's", 'Burger King', "Wendy's", 'Taco Bell', 'Sonic Drive-In', "Arby's"],
  },
  'THEME PARKS': {
    Rides: ['Dark Rides', 'Roller Coasters', 'Water Rides', 'Flat Rides'],
    'Park Areas': ['Main Street', 'Midways', 'Kiddie Areas', 'Water Parks'],
    Resorts: ['Hotel Lobbies', 'Pools', 'Arcades', 'Food Courts'],
    'Food & Dining': ['Counter Service', 'Character Dining', 'Snack Stands', 'Food Courts'],
    Queues: ['Switchbacks', 'Pre-Shows', 'Ride Signage', 'Loading Stations'],
    'Maps & Signage': ['Park Maps', 'Directional Signs', 'Entrance Signs', 'Menu Boards'],
  },
  'HOME LIFE': {
    'Living Rooms': ['TV Stands', 'VHS Shelves', 'Sectional Sofas', 'Carpeted Rooms'],
    Bedrooms: ['Posters', 'Toy Shelves', 'Computer Desks', 'Bunk Beds'],
    Kitchens: ['Wallpaper Kitchens', 'Breakfast Nooks', 'Formica Counters', 'Appliances'],
    Basements: ['Rec Rooms', 'Wood Paneling', 'Game Tables', 'Carpeted Stairs'],
    'Game Rooms': ['Console Setups', 'Board Games', 'Arcade Cabinets', 'Bean Bags'],
    'Home Computers': ['Computer Desks', 'CRT Monitors', 'Dial-Up Setups', 'Printer Stations'],
  },
  SCHOOLS: {
    Classrooms: ['Chalkboards', 'Overhead Projectors', 'Desks', 'Bulletin Boards'],
    Cafeterias: ['Lunch Lines', 'Milk Cartons', 'Tray Returns', 'Fold-Out Tables'],
    Hallways: ['Lockers', 'Trophy Cases', 'Water Fountains', 'Posters'],
    Playgrounds: ['Slides', 'Swings', 'Monkey Bars', 'Blacktop Games'],
    Libraries: ['Card Catalogs', 'Book Fairs', 'Reading Corners', 'Computer Stations'],
    'School Events': ['Science Fairs', 'Pep Rallies', 'Auditoriums', 'Field Days'],
  },
  'ARCADES & GAMING': {
    Arcades: ['Fighting Cabinets', 'Racing Cabinets', 'Light Gun Games', 'Pinball Rows'],
    'Store Kiosks': ['Demo Stations', 'Nintendo Kiosks', 'PlayStation Kiosks', 'GameCube Kiosks'],
    'LAN Setups': ['PC Rooms', 'CRT Monitors', 'Network Parties', 'Internet Cafes'],
    'Console Rooms': ['TV Carts', 'Bean Bags', 'Console Shelves', 'Controller Piles'],
    'Prize Areas': ['Ticket Counters', 'Prize Walls', 'Token Machines', 'Redemption Games'],
    'Game Corners': ['Basement Setups', 'Bedroom Setups', 'Store Corners', 'Arcade Corners'],
  },
  'MOVIES & ENTERTAINMENT': {
    'Movie Theaters': ['Cinema Lobbies', 'Ticket Booths', 'Poster Halls', 'Auditoriums'],
    'Drive-Ins': ['Concession Stands', 'Car Rows', 'Speaker Posts', 'Screens'],
    'Video Rentals': ['Blockbuster Video', 'Hollywood Video', 'Movie Gallery', 'VHS Shelves'],
    'Home Media': ['VHS Collections', 'DVD Walls', 'Entertainment Centers', 'Rental Cases'],
    Concessions: ['Popcorn Counters', 'Soda Machines', 'Candy Displays', 'Menu Boards'],
    'Lobby Spaces': ['Arcade Corners', 'Carpeted Lobbies', 'Neon Signs', 'Standee Displays'],
  },
  'TRAVEL & VACATION': {
    Airports: ['Terminals', 'Gate Areas', 'Baggage Claim', 'Ticket Counters'],
    Airplanes: ['Cabins', 'Tray Tables', 'Overhead Bins', 'Window Views'],
    Hotels: ['Lobbies', 'Rooms', 'Pools', 'Breakfast Areas'],
    Motels: ['Roadside Signs', 'Rooms', 'Parking Lots', 'Ice Machines'],
    'Roadside Stops': ['Rest Areas', 'Gas Stations', 'Diners', 'Souvenir Shops'],
    'Travel Interiors': ['Rental Counters', 'Luggage Carts', 'Shuttle Buses', 'Waiting Areas'],
  },
  OUTDOORS: {
    Parks: ['Picnic Shelters', 'Basketball Courts', 'Tennis Courts', 'Walking Paths'],
    Neighborhoods: ['Cul-de-sacs', 'Driveways', 'Sidewalks', 'Front Yards'],
    Pools: ['Public Pools', 'Hotel Pools', 'Diving Boards', 'Snack Bars'],
    Playgrounds: ['Slides', 'Swings', 'Monkey Bars', 'Wooden Playsets'],
    Campgrounds: ['Cabins', 'Camp Stores', 'Fire Pits', 'Picnic Tables'],
    'Skate Parks': ['Ramps', 'Rails', 'Half Pipes', 'Concrete Parks'],
  },
  'CARS & ROAD LIFE': {
    'Car Interiors': ['Back Seats', 'Dashboards', 'Cup Holders', 'Cassette Decks'],
    'Road Trips': ['Highways', 'Rest Stops', 'Maps', 'Backseat Views'],
    'Parking Lots': ['Mall Lots', 'Store Lots', 'Drive-Ins', 'Car Meets'],
    Dealerships: ['Showrooms', 'Lots', 'Service Bays', 'Sales Offices'],
    'Dashboard Views': ['Analog Gauges', 'Tape Decks', 'Steering Wheels', 'Air Vents'],
    'Car Culture': ['Car Shows', 'Cruise Nights', 'Drive-Thrus', 'Gas Pumps'],
  },
  'EVERYDAY SPACES': {
    'Waiting Rooms': ['Doctor Offices', 'Dentist Offices', 'Chairs', 'Magazine Tables'],
    'Doctor Offices': ['Exam Rooms', 'Reception Desks', 'Waiting Areas', 'Posters'],
    Laundromats: ['Washers', 'Dryers', 'Folding Tables', 'Vending Machines'],
    Bathrooms: ['Tile Walls', 'Sinks', 'Hand Dryers', 'Stalls'],
    'Government Buildings': ['DMV', 'Post Offices', 'Courthouses', 'Waiting Lines'],
    'Misc. Spaces': ['Banks', 'Hair Salons', 'Church Halls', 'Community Centers'],
  },
};

function cleanPublicTag(tag: string) {
  return tag
    .replace(/^saved by:\s*/i, 'saved by ')
    .replace(/[^\w\s&'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function publicTags(tags: string[]) {
  return tags
    .filter((tag) => !HIDDEN_PUBLIC_TAGS.has(tag.trim().toLowerCase()))
    .map(cleanPublicTag)
    .filter(Boolean);
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function normalizeSavedItem(raw: unknown): SavedItem {
  const item = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    id: typeof item.id === 'string' ? item.id : `${Date.now()}-${Math.random()}`,
    title: typeof item.title === 'string' ? item.title : 'Untitled memory',
    imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : '',
    thumbUrl:
      typeof item.thumbUrl === 'string'
        ? item.thumbUrl
        : typeof item.imageUrl === 'string'
          ? item.imageUrl
          : '',
    source: typeof item.source === 'string' ? item.source : 'Unknown source',
    sourceUrl: typeof item.sourceUrl === 'string' ? item.sourceUrl : '',
    originalQuery: typeof item.originalQuery === 'string' ? item.originalQuery : '',
    decade: typeof item.decade === 'string' ? item.decade : 'Not Sure',
    category:
      typeof item.category === 'string'
        ? item.category
        : typeof item.channel === 'string'
          ? item.channel
          : 'Unsorted',
    subTags: toStringArray(item.subTags),
    extraTags: toStringArray(item.extraTags),
    savedAt: typeof item.savedAt === 'string' ? item.savedAt : new Date().toLocaleString(),
  };
}

export default function PublicPage() {
  const [page, setPage] = useState<'home' | 'channel'>('home');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [volumeStats, setVolumeStats] = useState<Record<string, VolumeStats>>({});
  const [viewerIndex, setViewerIndex] = useState(0);
  const [era, setEra] = useState<Era>('90s');

  useEffect(() => {
    const loadArchive = async () => {
      try {
        const response = await fetch('/api/archive', { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not load archive.');
        const data = await response.json();
        const archiveItems = Array.isArray(data) ? data.map(normalizeSavedItem) : [];

        setSavedItems(archiveItems);
      } catch {
        setSavedItems([]);
      }
    };

    loadArchive();
  }, []);

  useEffect(() => {
    const loadVolume = async () => {
      try {
        const response = await fetch('/api/volume', { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not load volume.');
        const data = await response.json();
        const stats = Array.isArray(data) ? data : [];

        setVolumeStats(
          Object.fromEntries(
            stats
              .filter((item): item is VolumeStats => typeof item?.id === 'string')
              .map((item) => [item.id, item])
          )
        );
      } catch {
        setVolumeStats({});
      }
    };

    loadVolume();
  }, []);

  const selectedChannel = channelData[selectedIndex];
  const theme = eraThemes[era];
  const channelItems = savedItems.filter((item) => item.category === selectedChannel.category);
  const featuredItems = channelItems;
  const currentItem = featuredItems.length > 0 ? featuredItems[viewerIndex % featuredItems.length] : undefined;
  const channelGuideItems = GUIDE_ITEMS[selectedChannel.category] ?? selectedChannel.subs;
  useEffect(() => {
    if (featuredItems.length < 2) return;

    const timer = window.setInterval(() => {
      setViewerIndex((index) => (index + 1) % featuredItems.length);
    }, 7600);

    return () => window.clearInterval(timer);
  }, [featuredItems.length]);

  const pickChannel = (index: number, nextPage: 'home' | 'channel' = 'channel') => {
    setSelectedIndex(index);
    setViewerIndex(0);
    setPage(nextPage);
  };

  const previewChannel = (index: number) => {
    setSelectedIndex(index);
    setViewerIndex(0);
  };

  const voteOnItem = async (itemId: string, vote: 1 | -1) => {
    const storageKey = `repeat-volume:${itemId}`;
    const previousVote = typeof window !== 'undefined' ? Number(window.localStorage.getItem(storageKey) || 0) : 0;
    const normalizedPreviousVote = previousVote === 1 || previousVote === -1 ? previousVote : 0;

    if (normalizedPreviousVote === vote) return;

    try {
      const response = await fetch('/api/volume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, vote, previousVote: normalizedPreviousVote }),
      });

      if (!response.ok) throw new Error('Could not update volume.');
      const stats: VolumeStats = await response.json();

      setVolumeStats((currentStats) => ({ ...currentStats, [itemId]: stats }));
      window.localStorage.setItem(storageKey, String(vote));
    } catch {
      setVolumeStats((currentStats) => currentStats);
    }
  };

  return (
    <main className={`h-screen overflow-hidden font-mono text-black ${theme.pageBg}`}>
      <div className={`flex h-screen min-h-0 flex-col overflow-y-auto border-4 border-white ${theme.frameBg} shadow-[inset_0_0_0_2px_rgba(0,0,0,0.18)] lg:overflow-hidden`}>
        <Header
          page={page}
          era={era}
          theme={theme}
          onEra={setEra}
          onHome={() => {
            setPage('home');
            setViewerIndex(0);
          }}
        />

        {page === 'home' ? (
          <HomeScreen
            selectedChannel={selectedChannel}
            selectedIndex={selectedIndex}
            previewItems={featuredItems}
            currentPreviewItem={currentItem}
            currentVolume={currentItem ? volumeStats[currentItem.id] : undefined}
            guideItems={homeGuideItems}
            theme={theme}
            onSelect={pickChannel}
            onPreviewChannel={previewChannel}
            onVote={voteOnItem}
          />
        ) : (
          <ChannelScreen
            key={selectedChannel.id}
            channel={selectedChannel}
            items={featuredItems}
            volumeStats={volumeStats}
            guideItems={channelGuideItems}
            theme={theme}
            onVote={voteOnItem}
          />
        )}

        <Ticker channel={selectedChannel} theme={theme} />
      </div>
    </main>
  );
}

function Header({
  page,
  era,
  theme,
  onEra,
  onHome,
}: {
  page: string;
  era: Era;
  theme: EraTheme;
  onEra: (era: Era) => void;
  onHome: () => void;
}) {
  return (
    <div className={`flex min-h-10 flex-wrap items-center justify-between gap-2 border-b-2 border-white px-3 py-1.5 font-bold text-black ${theme.header}`}>
      <span>The Repeat Channel</span>
      <div className="flex items-center gap-2 text-sm">
        <a
          href="https://www.instagram.com/the90srepeat/"
          target="_blank"
          rel="noreferrer"
          className="flex h-8 min-w-10 items-center justify-center border-2 border-black/35 bg-white/85 px-2 text-xs font-black text-black shadow-[2px_2px_0_rgba(0,0,0,0.45)] transition hover:-translate-y-[1px] hover:border-black"
          title="Instagram"
          aria-label="Instagram"
        >
          IG
        </a>
        <Link
          href="/volume"
          className="flex h-8 items-center justify-center border-2 border-black/35 bg-white/85 px-2 text-xs font-black text-black shadow-[2px_2px_0_rgba(0,0,0,0.45)] transition hover:-translate-y-[1px] hover:border-black"
          title="Highest volume photos"
        >
          VOL
        </Link>
        <div className="flex items-center gap-1.5" aria-label="Era theme">
          {(['80s', '90s', '2000s'] as Era[]).map((option) => (
            <button
              key={option}
              onClick={() => onEra(option)}
              className={`h-8 min-w-14 border-2 px-2 text-xs font-black shadow-[2px_2px_0_rgba(0,0,0,0.45)] transition hover:-translate-y-[1px] ${
                era === option
                  ? 'border-black bg-black text-[#39ff14]'
                  : 'border-black/35 bg-white/85 text-black hover:border-black'
              }`}
              aria-pressed={era === option}
              title={`${option} theme`}
            >
              {option}
            </button>
          ))}
        </div>
        {page !== 'home' ? (
          <button
            onClick={onHome}
            className="flex h-9 items-center gap-2 border-2 border-white bg-white px-3 text-xs font-black text-black hover:border-black"
            title="Home"
          >
            <Home size={15} />
            HOME
          </button>
        ) : null}
      </div>
    </div>
  );
}

function HomeScreen({
  selectedChannel,
  selectedIndex,
  previewItems,
  currentPreviewItem,
  currentVolume,
  guideItems,
  theme,
  onSelect,
  onPreviewChannel,
  onVote,
}: {
  selectedChannel: Channel;
  selectedIndex: number;
  previewItems: SavedItem[];
  currentPreviewItem?: SavedItem;
  currentVolume?: VolumeStats;
  guideItems: string[];
  theme: EraTheme;
  onSelect: (index: number) => void;
  onPreviewChannel: (index: number) => void;
  onVote: (itemId: string, vote: 1 | -1) => void;
}) {
  const prevChannel = () => {
    const nextIndex = selectedIndex === 0 ? channelData.length - 1 : selectedIndex - 1;
    onPreviewChannel(nextIndex);
  };
  const nextChannel = () => {
    const nextIndex = selectedIndex === channelData.length - 1 ? 0 : selectedIndex + 1;
    onPreviewChannel(nextIndex);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <section className="grid min-h-0 flex-1 overflow-y-auto gap-0 lg:grid-cols-[1.08fr_0.92fr] lg:overflow-hidden">
        <div className="flex min-h-0 items-center justify-center overflow-hidden border-b-4 border-[#8d99ae] bg-black p-2 lg:border-b-0 lg:border-r-4">
          <MediaStage
            image={
              <ChannelImageSignal
                src={currentPreviewItem?.imageUrl || currentPreviewItem?.thumbUrl}
                alt={currentPreviewItem?.title || selectedChannel.title}
                channelNumber={selectedChannel.number}
                channelTitle={selectedChannel.title}
              />
            }
            volumeControl={
              <FauxVolumeControl
                stats={currentVolume}
                disabled={!currentPreviewItem}
                onUp={() => currentPreviewItem && onVote(currentPreviewItem.id, 1)}
                onDown={() => currentPreviewItem && onVote(currentPreviewItem.id, -1)}
              />
            }
            channelControl={<FauxRemoteControl onUp={prevChannel} onDown={nextChannel} />}
          />
        </div>

        <div className={`relative flex min-h-[280px] flex-col justify-center overflow-hidden border-b-4 border-[#8d99ae] p-5 md:p-8 lg:min-h-0 lg:border-b-0 ${theme.copyPanel} ${theme.panelExtra}`}>
          <div className={`pointer-events-none absolute inset-x-0 top-0 h-3 ${theme.stripe}`} />
          <div className={`pointer-events-none absolute bottom-4 right-5 h-16 w-16 rotate-12 border-4 opacity-25 ${theme.shapeOne}`} />
          <div className={`pointer-events-none absolute right-16 top-8 h-9 w-9 rounded-full opacity-35 ${theme.shapeTwo}`} />
          <div className={`pointer-events-none absolute bottom-20 right-24 h-7 w-16 -rotate-12 opacity-45 ${theme.shapeThree}`} />
          <div className="relative z-10">
            <h1 className={`max-w-xl text-2xl font-black sm:text-3xl md:text-4xl ${theme.titleClass}`}>REMEMBER BEING THERE?</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 md:text-base">
              Browse memories from everyday life from the 80s, 90s, and 2000s.
            </p>
            <div className={`mt-3 w-fit px-2 py-1 text-xs font-black uppercase tracking-[0.12em] ${theme.accentBlock}`}>
              {previewItems.length > 0 ? `Previewing ${previewItems.length} signals` : 'Awaiting archived signal'}
            </div>
            <button
              onClick={() => onSelect(selectedIndex)}
              className={`mt-4 flex min-h-10 w-full max-w-xs items-center justify-center gap-2 border-4 border-black px-5 text-sm font-black sm:w-fit ${theme.primaryButton}`}
            >
              <ArrowRight size={18} />
              ENTER CHANNEL
            </button>
            <Link
              href="/submit"
              className={`mt-3 flex min-h-10 w-full max-w-xs items-center justify-center gap-2 border-4 border-black px-5 text-sm font-black sm:w-fit ${theme.secondaryButton}`}
            >
              SUBMIT A MEMORY
            </Link>
          </div>
        </div>
      </section>

      <TvGuidePanel
        channel={selectedChannel}
        items={previewItems}
        guideItems={guideItems}
        activeGuideIndex={selectedIndex}
        theme={theme}
        onGuideSelect={onPreviewChannel}
      />
    </div>
  );
}

function ChannelScreen({
  channel,
  items,
  volumeStats,
  guideItems,
  theme,
  onVote,
}: {
  channel: Channel;
  items: SavedItem[];
  volumeStats: Record<string, VolumeStats>;
  guideItems: string[];
  theme: EraTheme;
  onVote: (itemId: string, vote: 1 | -1) => void;
}) {
  const [activeDecade, setActiveDecade] = useState('All');
  const [activeMainTag, setActiveMainTag] = useState('All');
  const [activeTag, setActiveTag] = useState('All');
  const [directoryLevel, setDirectoryLevel] = useState<'decade' | 'main' | 'deep'>('decade');
  const [localIndex, setLocalIndex] = useState(0);

  const nestedTagOptions = useMemo(() => {
    const counts = new Map<string, number>();
    const presets =
      activeMainTag === 'All'
        ? Object.values(CHANNEL_DEEP_TAG_PRESETS[channel.category] ?? {}).flat()
        : CHANNEL_DEEP_TAG_PRESETS[channel.category]?.[activeMainTag] ?? [];

    presets.forEach((tag) => counts.set(cleanPublicTag(tag), 0));

    items.forEach((item) => {
      const matchesDecade = activeDecade === 'All' || item.decade === activeDecade;
      const matchesMain = activeMainTag === 'All' || item.subTags.includes(activeMainTag);
      if (!matchesDecade || !matchesMain) return;

      publicTags(item.extraTags).forEach((tag) => {
        const cleanTag = tag.trim();
        if (!cleanTag) return;
        counts.set(cleanTag, (counts.get(cleanTag) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }, [activeDecade, activeMainTag, channel.category, items]);

  const mainTagOptions = useMemo(
    () => [
      {
        tag: 'All',
        count: items.filter((item) => activeDecade === 'All' || item.decade === activeDecade).length,
      },
      ...channel.subs.map((sub) => ({
        tag: sub,
        count: items.filter((item) =>
          (activeDecade === 'All' || item.decade === activeDecade) && item.subTags.includes(sub)
        ).length,
      })),
    ],
    [activeDecade, channel.subs, items]
  );

  const decadeOptions = useMemo(
    () =>
      ['80s', '90s', '2000s', 'All'].map((decade) => ({
        tag: decade,
        count: decade === 'All' ? items.length : items.filter((item) => item.decade === decade).length,
      })),
    [items]
  );

  const filteredItems = useMemo(() => {
    if (activeDecade === 'All' && activeMainTag === 'All' && activeTag === 'All') return items;

    return items.filter((item) =>
      (activeDecade === 'All' || item.decade === activeDecade) &&
      (activeMainTag === 'All' || item.subTags.includes(activeMainTag)) &&
      (activeTag === 'All' ||
        [...publicTags(item.extraTags), cleanPublicTag(item.title)].some((tag) =>
          tag.toLowerCase().includes(activeTag.toLowerCase())
        ))
    );
  }, [activeDecade, activeMainTag, activeTag, items]);

  const currentItem = filteredItems.length > 0 ? filteredItems[localIndex % filteredItems.length] : undefined;

  const prev = () => {
    if (filteredItems.length < 2) return;
    setLocalIndex((index) => (index - 1 + filteredItems.length) % filteredItems.length);
  };

  const next = () => {
    if (filteredItems.length < 2) return;
    setLocalIndex((index) => (index + 1) % filteredItems.length);
  };

  const random = () => {
    if (filteredItems.length < 2) return;
    let nextIndex = Math.floor(Math.random() * filteredItems.length);
    if (nextIndex === localIndex) nextIndex = (nextIndex + 1) % filteredItems.length;
    setLocalIndex(nextIndex);
  };

  const canStepBack = directoryLevel !== 'decade';
  const stepBack = () => {
    if (directoryLevel === 'deep') {
      setDirectoryLevel('main');
      setActiveTag('All');
      setLocalIndex(0);
      return;
    }

    if (directoryLevel === 'main') {
      setDirectoryLevel('decade');
      setActiveMainTag('All');
      setActiveTag('All');
      setLocalIndex(0);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <section className="grid min-h-0 flex-1 overflow-y-auto gap-0 lg:grid-cols-[1.08fr_0.92fr] lg:overflow-hidden">
        <div className="flex min-h-0 items-center justify-center overflow-hidden border-b-4 border-[#8d99ae] bg-black p-2 lg:border-b-0 lg:border-r-4">
          <MediaStage
            image={
              <ChannelImageSignal
                src={currentItem?.imageUrl || currentItem?.thumbUrl}
                alt={currentItem?.title || channel.title}
                channelNumber={channel.number}
                channelTitle={channel.title}
              />
            }
            volumeControl={
              <FauxVolumeControl
                stats={currentItem ? volumeStats[currentItem.id] : undefined}
                disabled={!currentItem}
                onUp={() => currentItem && onVote(currentItem.id, 1)}
                onDown={() => currentItem && onVote(currentItem.id, -1)}
              />
            }
            channelControl={<FauxRemoteControl onUp={prev} onDown={next} disabled={filteredItems.length < 2} />}
          />
        </div>

        <div className={`relative flex min-h-[360px] flex-col overflow-hidden border-b-4 border-[#8d99ae] p-4 sm:p-5 md:p-6 lg:min-h-0 lg:border-b-0 ${theme.copyPanel} ${theme.panelExtra}`}>
          <div className={`pointer-events-none absolute inset-x-0 top-0 h-3 ${theme.stripe}`} />
          <div className={`pointer-events-none absolute bottom-4 right-5 h-16 w-16 rotate-12 border-4 opacity-25 ${theme.shapeOne}`} />
          <div className={`pointer-events-none absolute right-12 top-10 h-9 w-9 rounded-full opacity-35 ${theme.shapeTwo}`} />
          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className={`w-fit px-2 py-1 text-xs font-black uppercase tracking-[0.12em] ${theme.accentBlock}`}>
                  CH {channel.number}
                </div>
                <h1 className={`mt-3 text-3xl font-black md:text-4xl ${theme.titleClass}`}>{channel.title}</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#2b2d42]">{channel.description}</p>
              </div>
              <button
                onClick={random}
                disabled={filteredItems.length < 2}
                className={`flex h-10 items-center gap-2 border-4 border-black px-4 text-xs font-black disabled:opacity-45 ${theme.secondaryButton}`}
                title="Random memory"
              >
                <Shuffle size={15} />
                RANDOM
              </button>
            </div>

            <div className="mb-3 flex flex-wrap gap-2 border-2 border-[#8d99ae] bg-white px-3 py-2 text-xs font-black text-[#2b2d42]">
              <button
                onClick={() => {
                  setDirectoryLevel('decade');
                  setActiveDecade('All');
                  setActiveMainTag('All');
                  setActiveTag('All');
                  setLocalIndex(0);
                }}
                className="hover:underline"
              >
                {channel.title}
              </button>
              <span>/</span>
              <button
                onClick={() => {
                  setDirectoryLevel('decade');
                  setActiveMainTag('All');
                  setActiveTag('All');
                  setLocalIndex(0);
                }}
                className="hover:underline"
              >
                {activeDecade}
              </button>
              {directoryLevel !== 'decade' ? (
                <>
                  <span>/</span>
                  <button
                    onClick={() => {
                      setDirectoryLevel('main');
                      setActiveTag('All');
                      setLocalIndex(0);
                    }}
                    className="hover:underline"
                  >
                    {activeMainTag}
                  </button>
                </>
              ) : null}
              {directoryLevel === 'deep' && activeTag !== 'All' ? (
                <>
                  <span>/</span>
                  <button className="hover:underline">{activeTag}</button>
                </>
              ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-hidden border-4 border-[#8d99ae] bg-white p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-[#3a0ca3]">
                  {directoryLevel === 'decade'
                    ? 'Choose Decade'
                    : directoryLevel === 'main'
                      ? 'Choose Category'
                      : activeMainTag === 'All'
                        ? 'Choose Matching Tag'
                        : `${activeMainTag} Tags`}
                </div>
                <button
                  onClick={stepBack}
                  disabled={!canStepBack}
                  className="min-h-8 border-2 border-[#2b2d42] bg-[#edf2f4] px-3 text-[11px] font-black text-[#2b2d42] shadow-[3px_3px_0_#8d99ae] hover:border-black hover:bg-white disabled:opacity-35"
                  title="Back one directory level"
                >
                  BACK
                </button>
              </div>

              {directoryLevel === 'decade' ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {decadeOptions.map((option) => (
                    <DirectoryButton
                      key={option.tag}
                      label={option.tag}
                      count={option.count}
                      active={activeDecade === option.tag}
                      onClick={() => {
                        setActiveDecade(option.tag);
                        setActiveMainTag('All');
                        setActiveTag('All');
                        setDirectoryLevel('main');
                        setLocalIndex(0);
                      }}
                    />
                  ))}
                </div>
              ) : null}

              {directoryLevel === 'main' ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {mainTagOptions.map((option) => (
                    <DirectoryButton
                      key={option.tag}
                      label={option.tag}
                      count={option.count}
                      active={activeMainTag === option.tag}
                      onClick={() => {
                        setActiveMainTag(option.tag);
                        setActiveTag('All');
                        setDirectoryLevel('deep');
                        setLocalIndex(0);
                      }}
                    />
                  ))}
                </div>
              ) : null}

              {directoryLevel === 'deep' ? (
                <div>
                  {nestedTagOptions.length === 0 ? (
                    <div className="border-2 border-dashed border-[#8d99ae] bg-[#edf2f4] p-3 text-xs font-bold text-[#6c757d]">
                      No deeper tags yet for this category.
                    </div>
                  ) : (
                    <div className="grid max-h-64 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-4">
                      {nestedTagOptions.map((option) => (
                        <DirectoryButton
                          key={option.tag}
                          label={option.tag}
                          count={option.count}
                          active={activeTag === option.tag}
                          onClick={() => {
                            setActiveTag(option.tag);
                            setLocalIndex(0);
                          }}
                          variant="purple"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <TvGuidePanel
        channel={channel}
        items={filteredItems}
        guideItems={guideItems}
        theme={theme}
      />
    </div>
  );
}

function DirectoryButton({
  label,
  count,
  active,
  onClick,
  variant = 'black',
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  variant?: 'black' | 'purple';
}) {
  const activeClass = variant === 'purple'
    ? 'border-black bg-[#ff4d6d] text-white shadow-[4px_4px_0_#3a0ca3]'
    : 'border-black bg-[#ffd166] text-black shadow-[4px_4px_0_#3a0ca3]';

  return (
    <button
      onClick={onClick}
      className={`tag-button-90s flex min-h-10 items-center justify-between gap-3 border-2 px-3 py-2 text-left text-xs font-black transition hover:-translate-y-[1px] ${
        active ? activeClass : 'border-[#2b2d42] bg-[#f8f9fa] text-[#2b2d42] shadow-[3px_3px_0_#8d99ae] hover:border-black hover:bg-white'
      }`}
    >
      <span className="min-w-0 truncate">{label}</span>
      <span className={`shrink-0 ${active ? 'text-white/75' : 'text-[#6c757d]'}`}>{count}</span>
    </button>
  );
}

function ChannelImageSignal({
  src,
  alt,
  channelNumber,
  channelTitle,
}: {
  src?: string;
  alt: string;
  channelNumber: string;
  channelTitle: string;
}) {
  const signalKey = `${src || 'no-signal'}|${alt}|${channelNumber}`;
  const signalKeyRef = useRef(signalKey);
  const [displaySignal, setDisplaySignal] = useState({ src, alt, channelNumber, channelTitle });
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    if (signalKeyRef.current === signalKey) return;

    setIsSwitching(true);

    const swapTimer = window.setTimeout(() => {
      signalKeyRef.current = signalKey;
      setDisplaySignal({ src, alt, channelNumber, channelTitle });
    }, 250);

    const doneTimer = window.setTimeout(() => {
      setIsSwitching(false);
    }, 620);

    return () => {
      window.clearTimeout(swapTimer);
      window.clearTimeout(doneTimer);
    };
  }, [alt, channelNumber, channelTitle, signalKey, src]);

  return (
    <div className={`relative h-full w-full bg-black ${isSwitching ? 'channel-tube-active' : ''}`}>
      <div className={`channel-picture-content relative h-full w-full ${isSwitching ? 'channel-picture-switching' : ''}`}>
        {displaySignal.src ? (
          <img
            src={displaySignal.src}
            alt={displaySignal.alt}
            className="h-full w-full object-cover opacity-85 contrast-[1.08] saturate-[0.92]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#030712] p-8 text-center">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.18em] text-[#39ff14] [font-family:'VCR_OSD_Mono',monospace] [text-shadow:0_0_7px_#39ff14]">
                NO ARCHIVED SIGNAL
              </div>
              <div className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
                CH {displaySignal.channelNumber} {displaySignal.channelTitle}
              </div>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.42)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute left-5 top-5 px-1 text-3xl tracking-[0.12em] text-[#39ff14] [font-family:'VCR_OSD_Mono',monospace] [text-shadow:0_0_6px_#39ff14,0_0_14px_rgba(57,255,20,0.85)] md:text-4xl">
          CH {displaySignal.channelNumber}
        </div>
      </div>
      <div className="channel-static-burst pointer-events-none absolute inset-0" />
      <div className="channel-tube-line pointer-events-none absolute left-0 right-0 top-1/2" />
    </div>
  );
}

function MediaStage({
  image,
  volumeControl,
  channelControl,
}: {
  image: React.ReactNode;
  volumeControl: React.ReactNode;
  channelControl: React.ReactNode;
}) {
  return (
    <div className="flex h-full max-h-full w-full max-w-full flex-col items-center justify-center gap-2 sm:max-w-[94vw] lg:flex-row lg:gap-3">
      <div className="order-2 flex w-full max-w-[520px] items-center justify-between gap-3 px-2 lg:order-1 lg:w-16 lg:max-w-none lg:px-0">
        {volumeControl}
        <div className="lg:hidden">{channelControl}</div>
      </div>
      <div className="order-1 aspect-[4/3] w-full max-w-[min(72vh,680px)] overflow-hidden border-4 border-[#2b2d42] bg-black text-white shadow-inner sm:max-w-[520px] lg:order-2 lg:h-full lg:max-h-full lg:w-auto lg:max-w-[calc(100%-152px)]">
        {image}
      </div>
      <div className="order-3 hidden lg:block">{channelControl}</div>
    </div>
  );
}

function FauxRemoteControl({
  onUp,
  onDown,
  disabled = false,
}: {
  onUp: () => void;
  onDown: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex shrink-0 flex-row items-center justify-center gap-2 lg:w-16 lg:flex-col lg:gap-3">
      <button
        onClick={onUp}
        disabled={disabled}
        className="flex h-12 w-12 items-center justify-center border-4 border-[#2b2d42] bg-[#111827] text-[#39ff14] shadow-[4px_4px_0_rgba(255,255,255,0.12)] hover:bg-black disabled:opacity-35 lg:h-16 lg:w-14"
        title="Channel up"
      >
        ▲
      </button>
      <div className="text-center text-[10px] font-black uppercase tracking-[0.14em] text-white/50">CH</div>
      <button
        onClick={onDown}
        disabled={disabled}
        className="flex h-12 w-12 items-center justify-center border-4 border-[#2b2d42] bg-[#111827] text-[#39ff14] shadow-[4px_4px_0_rgba(255,255,255,0.12)] hover:bg-black disabled:opacity-35 lg:h-16 lg:w-14"
        title="Channel down"
      >
        ▼
      </button>
    </div>
  );
}

function FauxVolumeControl({
  stats,
  disabled = false,
  onUp,
  onDown,
}: {
  stats?: VolumeStats;
  disabled?: boolean;
  onUp: () => void;
  onDown: () => void;
}) {
  const score = (stats?.volumeUp ?? 0) - (stats?.volumeDown ?? 0);

  return (
    <div className="flex shrink-0 flex-row items-center justify-center gap-2 lg:w-16 lg:flex-col">
      <button
        onClick={onUp}
        disabled={disabled}
        className="flex h-12 w-12 items-center justify-center border-4 border-[#2b2d42] bg-[#111827] text-lg font-black text-[#39ff14] shadow-[4px_4px_0_rgba(255,255,255,0.12)] hover:bg-black disabled:opacity-35 lg:h-14 lg:w-14"
        title="Volume up"
      >
        +
      </button>
      <div className="text-center text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
        VOL
        <div className="mt-1 text-[#39ff14]">{score}</div>
      </div>
      <button
        onClick={onDown}
        disabled={disabled}
        className="flex h-12 w-12 items-center justify-center border-4 border-[#2b2d42] bg-[#111827] text-lg font-black text-[#39ff14] shadow-[4px_4px_0_rgba(255,255,255,0.12)] hover:bg-black disabled:opacity-35 lg:h-14 lg:w-14"
        title="Volume down"
      >
        -
      </button>
    </div>
  );
}

function TvGuidePanel({
  channel,
  items,
  guideItems,
  activeGuideIndex,
  theme = eraThemes['90s'],
  onGuideSelect,
}: {
  channel: Channel;
  items: SavedItem[];
  guideItems: string[];
  activeGuideIndex?: number;
  theme?: EraTheme;
  onGuideSelect?: (index: number) => void;
}) {
  const guideRows = [...guideItems, ...guideItems].map((name, index) => ({
    name,
    index: index % guideItems.length,
  }));

  return (
    <section className={`shrink-0 border-t-4 border-[#111827] p-2 text-white ${theme.guideOuter}`}>
      <div className={`border-4 border-white p-2 shadow-[inset_0_0_24px_rgba(0,0,0,0.45)] ${theme.guideInner}`}>
        <div className={`grid grid-cols-[78px_1fr_110px] border-b-2 px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] ${theme.guideHeader}`}>
          <span>Slot</span>
          <span>Listing</span>
          <span className="text-right">Signal</span>
        </div>

        <div className="relative h-[234px] overflow-hidden pt-2 sm:h-[258px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-black/50 to-transparent" />
          <div
            className="space-y-1"
            style={{
              animation: `tv-guide-scroll ${Math.max(34, guideItems.length * 3.2)}s linear infinite`,
            }}
          >
          {guideRows.map((item, rowIndex) => {
            const matchingMemoryCount = items.filter((memory) =>
              [
                ...(memory.subTags ?? []),
                ...publicTags(memory.extraTags ?? []),
                memory.title,
              ].some((tag) => {
                if (typeof tag !== 'string') return false;
                return tag.toLowerCase().includes(item.name.toLowerCase());
              })
            ).length;
            const isLive = activeGuideIndex === undefined
              ? rowIndex % guideItems.length === 0
              : item.index === activeGuideIndex;
            const RowElement = onGuideSelect ? 'button' : 'div';

            return (
              <RowElement
                key={`${item.name}-${rowIndex}`}
                onClick={onGuideSelect ? () => onGuideSelect(item.index) : undefined}
                className={`grid min-h-[62px] grid-cols-[78px_1fr_110px] items-center border-l-4 px-3 py-2 shadow-[inset_0_-1px_0_rgba(255,255,255,0.16)] ${
                  isLive ? theme.guideLive : rowIndex % 2 === 0 ? theme.guideEven : theme.guideOdd
                } ${onGuideSelect ? `w-full cursor-pointer text-left hover:brightness-110 focus:outline-none focus:ring-2 ${theme.guideFocus}` : ''}`}
              >
                <span className="text-sm font-black">#{String(item.index + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black">{item.name}</span>
                  <span className={`block truncate text-[11px] ${isLive ? 'text-black/70' : 'text-white/65'}`}>
                    {channel.title} / {channel.subs[rowIndex % channel.subs.length]}
                  </span>
                </span>
                <span className="text-right text-xs font-black">
                  {matchingMemoryCount > 0 ? `${matchingMemoryCount} SAVED` : isLive ? 'LIVE' : 'READY'}
                </span>
              </RowElement>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker({ channel, theme }: { channel: Channel; theme: EraTheme }) {
  return (
    <div className={`shrink-0 border-t-4 border-[#8d99ae] px-4 py-3 text-sm ${theme.ticker}`}>
      <div className="overflow-x-auto whitespace-nowrap font-bold">
        NOW SURFING: CH {channel.number} {channel.title.toUpperCase()} &nbsp; / &nbsp; SUBCHANNELS:{' '}
        {channel.subs.join(' / ').toUpperCase()}
      </div>
    </div>
  );
}
