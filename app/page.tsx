'use client';

import { ArrowLeft, ArrowRight, Home, Shuffle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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
    pageBg: 'bg-[radial-gradient(circle_at_10%_0%,#ff4fd8_0%,#6437ff_30%,#10105c_62%,#050015_100%)]',
    frameBg: 'bg-[#fff1ff]',
    header: 'bg-gradient-to-r from-[#ff4fd8] via-[#00e5ff] to-[#fff200]',
    copyPanel: 'bg-[#f9e6ff]',
    stripe: 'bg-[repeating-linear-gradient(90deg,#ff4fd8_0_48px,#00e5ff_48px_96px,#fff200_96px_144px,#7cff00_144px_192px)]',
    titleClass: 'era-title-80s',
    accentBlock: 'bg-[#2714a8] text-[#fff200]',
    primaryButton: 'bg-[#ff4fd8] text-white shadow-[5px_5px_0_#00e5ff] hover:bg-[#fff200] hover:text-black',
    secondaryButton: 'bg-white text-black shadow-[5px_5px_0_#00e5ff] hover:bg-[#fff200]',
    shapeOne: 'border-[#ff4fd8]',
    shapeTwo: 'bg-[#fff200]',
    shapeThree: 'bg-[#00e5ff]',
    guideOuter: 'bg-[#ff4fd8]',
    guideInner: 'bg-[#150052]',
    guideHeader: 'border-[#00e5ff]/70 bg-[#07002d] text-[#fff200]',
    guideLive: 'border-[#fff200] bg-[#fff200] text-black',
    guideEven: 'border-[#00e5ff] bg-[#1b3bbf] text-white',
    guideOdd: 'border-[#ff4fd8] bg-[#5a168c] text-white',
    guideFocus: 'focus:ring-[#fff200]',
    ticker: 'bg-[#150052] text-white',
  },
  '90s': {
    label: '90s',
    pageBg: 'bg-[radial-gradient(circle_at_15%_0%,#7bdff2_0%,#4361ee_28%,#3a0ca3_58%,#16002f_100%)]',
    frameBg: 'bg-[#fff8e8]',
    header: 'bg-gradient-to-r from-[#ff4d6d] via-[#ffbe0b] to-[#7bdff2]',
    copyPanel: 'bg-[#dff7ff]',
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
    pageBg: 'bg-[radial-gradient(circle_at_15%_0%,#d7f7ff_0%,#7aa7ff_30%,#2855d9_62%,#071844_100%)]',
    frameBg: 'bg-[#eef8ff]',
    header: 'bg-gradient-to-r from-[#d7f7ff] via-[#9db7ff] to-[#b8ff4d]',
    copyPanel: 'bg-[#edf6ff]',
    stripe: 'bg-[repeating-linear-gradient(90deg,#c7ddff_0_52px,#ffffff_52px_104px,#b8ff4d_104px_156px,#7aa7ff_156px_208px)]',
    titleClass: 'era-title-2000s',
    accentBlock: 'bg-[#1f4ed8] text-white',
    primaryButton: 'bg-[#1f4ed8] text-white shadow-[5px_5px_0_#8fc7ff] hover:bg-[#b8ff4d] hover:text-black',
    secondaryButton: 'bg-white text-black shadow-[5px_5px_0_#8fc7ff] hover:bg-[#b8ff4d]',
    shapeOne: 'border-[#7aa7ff]',
    shapeTwo: 'bg-[#b8ff4d]',
    shapeThree: 'bg-[#8fc7ff]',
    guideOuter: 'bg-[#9db7ff]',
    guideInner: 'bg-[#061d5a]',
    guideHeader: 'border-[#b8ff4d]/70 bg-[#03113c] text-[#b8ff4d]',
    guideLive: 'border-[#b8ff4d] bg-[#b8ff4d] text-black',
    guideEven: 'border-[#8fc7ff] bg-[#1946ad] text-white',
    guideOdd: 'border-[#9db7ff] bg-[#1a2f7c] text-white',
    guideFocus: 'focus:ring-[#b8ff4d]',
    ticker: 'bg-[#071844] text-white',
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

  return (
    <main className={`h-screen overflow-hidden font-mono text-black ${theme.pageBg}`}>
      <div className={`flex h-screen min-h-0 flex-col overflow-hidden border-4 border-white ${theme.frameBg} shadow-[inset_0_0_0_2px_rgba(0,0,0,0.18)]`}>
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
            guideItems={homeGuideItems}
            theme={theme}
            onSelect={pickChannel}
            onPreviewChannel={previewChannel}
          />
        ) : (
          <ChannelScreen
            key={selectedChannel.id}
            channel={selectedChannel}
            items={featuredItems}
            guideItems={channelGuideItems}
            theme={theme}
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
      <span>Nostalgia.exe</span>
      <div className="flex items-center gap-2 text-sm">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em]">
          <span className="hidden sm:inline">Era</span>
          <select
            value={era}
            onChange={(event) => onEra(event.target.value as Era)}
            className="h-8 border-2 border-black/35 bg-white/85 px-2 text-xs font-black text-black outline-none focus:border-black"
          >
            <option value="80s">80s</option>
            <option value="90s">90s</option>
            <option value="2000s">2000s</option>
          </select>
        </label>
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
  guideItems,
  theme,
  onSelect,
  onPreviewChannel,
}: {
  selectedChannel: Channel;
  selectedIndex: number;
  previewItems: SavedItem[];
  currentPreviewItem?: SavedItem;
  guideItems: string[];
  theme: EraTheme;
  onSelect: (index: number) => void;
  onPreviewChannel: (index: number) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <section className="grid min-h-0 flex-1 overflow-hidden gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex min-h-0 items-center justify-center overflow-hidden border-b-4 border-[#8d99ae] bg-black p-2 lg:border-b-0 lg:border-r-4">
          <div className="aspect-[4/3] h-full max-h-full max-w-full overflow-hidden border-4 border-[#2b2d42] bg-black text-white shadow-inner">
            <div className="relative h-full w-full">
              {currentPreviewItem ? (
                <img
                  src={currentPreviewItem.imageUrl || currentPreviewItem.thumbUrl}
                  alt={currentPreviewItem.title}
                  className="h-full w-full object-cover opacity-85 contrast-[1.08] saturate-[0.92]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#030712] p-8 text-center">
                  <div>
                    <div className="text-sm font-black uppercase tracking-[0.18em] text-[#39ff14] [font-family:'VCR_OSD_Mono',monospace] [text-shadow:0_0_7px_#39ff14]">
                      NO ARCHIVED SIGNAL
                    </div>
                    <div className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
                      CH {selectedChannel.number} {selectedChannel.title}
                    </div>
                  </div>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.42)_100%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent" />
              <div className="absolute left-5 top-5 px-1 text-3xl tracking-[0.12em] text-[#39ff14] [font-family:'VCR_OSD_Mono',monospace] [text-shadow:0_0_6px_#39ff14,0_0_14px_rgba(57,255,20,0.85)] md:text-4xl">
                CH {selectedChannel.number}
              </div>
            </div>
          </div>
        </div>

        <div className={`relative flex min-h-0 flex-col justify-center overflow-hidden border-b-4 border-[#8d99ae] p-5 md:p-8 lg:border-b-0 ${theme.copyPanel}`}>
          <div className={`pointer-events-none absolute inset-x-0 top-0 h-3 ${theme.stripe}`} />
          <div className={`pointer-events-none absolute bottom-4 right-5 h-16 w-16 rotate-12 border-4 opacity-25 ${theme.shapeOne}`} />
          <div className={`pointer-events-none absolute right-16 top-8 h-9 w-9 rounded-full opacity-35 ${theme.shapeTwo}`} />
          <div className={`pointer-events-none absolute bottom-20 right-24 h-7 w-16 -rotate-12 opacity-45 ${theme.shapeThree}`} />
          <div className="relative z-10">
            <h1 className={`max-w-xl text-3xl font-black md:text-4xl ${theme.titleClass}`}>REMEMBER BEING THERE?</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 md:text-base">
              Browse memories from everyday life from the 80s, 90s, and 2000s.
            </p>
            <div className={`mt-3 w-fit px-2 py-1 text-xs font-black uppercase tracking-[0.12em] ${theme.accentBlock}`}>
              {previewItems.length > 0 ? `Previewing ${previewItems.length} signals` : 'Awaiting archived signal'}
            </div>
            <button
              onClick={() => onSelect(selectedIndex)}
              className={`mt-4 flex h-10 w-fit items-center gap-2 border-4 border-black px-5 text-sm font-black ${theme.primaryButton}`}
            >
              <ArrowRight size={18} />
              ENTER CHANNEL
            </button>
            <Link
              href="/submit"
              className={`mt-3 flex h-10 w-fit items-center gap-2 border-4 border-black px-5 text-sm font-black ${theme.secondaryButton}`}
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
  guideItems,
  theme,
}: {
  channel: Channel;
  items: SavedItem[];
  guideItems: string[];
  theme: EraTheme;
}) {
  const [activeTag, setActiveTag] = useState('All');
  const [localIndex, setLocalIndex] = useState(0);

  const tagOptions = useMemo(() => {
    const counts = new Map<string, number>();
    const register = (tag: string, count = 0) => {
      const cleanTag = tag.trim();
      if (!cleanTag) return;
      counts.set(cleanTag, (counts.get(cleanTag) ?? 0) + count);
    };

    channel.subs.forEach((sub) => register(sub, 0));
    items.forEach((item) => {
      [...item.subTags, ...item.extraTags].forEach((tag) => register(tag, 1));
    });

    return [
      { tag: 'All', count: items.length },
      ...Array.from(counts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag)),
    ];
  }, [channel.subs, items]);

  const filteredItems = useMemo(() => {
    if (activeTag === 'All') return items;

    return items.filter((item) =>
      [...item.subTags, ...item.extraTags, item.title].some((tag) =>
        tag.toLowerCase().includes(activeTag.toLowerCase())
      )
    );
  }, [activeTag, items]);

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

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <section className="grid min-h-0 flex-1 overflow-hidden gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex min-h-0 items-center justify-center overflow-hidden border-b-4 border-[#8d99ae] bg-black p-2 lg:border-b-0 lg:border-r-4">
          <div className="aspect-[4/3] h-full max-h-full max-w-full overflow-hidden border-4 border-[#2b2d42] bg-black text-white shadow-inner">
            <div className="relative h-full w-full">
              {currentItem ? (
                <img
                  src={currentItem.imageUrl || currentItem.thumbUrl}
                  alt={currentItem.title}
                  className="h-full w-full object-cover opacity-85 contrast-[1.08] saturate-[0.92]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#030712] p-8 text-center">
                  <div>
                    <div className="text-sm font-black uppercase tracking-[0.18em] text-[#39ff14] [font-family:'VCR_OSD_Mono',monospace] [text-shadow:0_0_7px_#39ff14]">
                      NO ARCHIVED SIGNAL
                    </div>
                    <div className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
                      CH {channel.number} {channel.title}
                    </div>
                  </div>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.42)_100%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent" />
              <div className="absolute left-5 top-5 px-1 text-3xl tracking-[0.12em] text-[#39ff14] [font-family:'VCR_OSD_Mono',monospace] [text-shadow:0_0_6px_#39ff14,0_0_14px_rgba(57,255,20,0.85)] md:text-4xl">
                CH {channel.number}
              </div>

              {filteredItems.length > 1 ? (
                <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/75 text-white hover:bg-black"
                  title="Previous memory"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/75 text-white hover:bg-black"
                  title="Next memory"
                >
                  <ArrowRight size={18} />
                </button>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className={`relative flex min-h-0 flex-col overflow-hidden border-b-4 border-[#8d99ae] p-5 md:p-6 lg:border-b-0 ${theme.copyPanel}`}>
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

            <div className="mb-3 grid grid-cols-3 gap-2">
              <div className="border-2 border-[#8d99ae] bg-white p-2">
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6c757d]">Archive</div>
                <div className="mt-1 text-xl font-black text-[#2b2d42]">{items.length}</div>
              </div>
              <div className="border-2 border-[#8d99ae] bg-white p-2">
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6c757d]">Showing</div>
                <div className="mt-1 text-xl font-black text-[#2b2d42]">{filteredItems.length}</div>
              </div>
              <div className="border-2 border-[#8d99ae] bg-white p-2">
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6c757d]">Filter</div>
                <div className="mt-1 truncate text-sm font-black text-[#2b2d42]">{activeTag}</div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden border-4 border-[#8d99ae] bg-white p-3">
              <div className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-[#3a0ca3]">Sort By Channel Tags</div>
              <div className="grid max-h-full gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                {tagOptions.map((option) => (
                  <button
                    key={option.tag}
                    onClick={() => {
                      setActiveTag(option.tag);
                      setLocalIndex(0);
                    }}
                    className={`flex min-h-10 items-center justify-between gap-3 border-2 px-3 py-2 text-left text-xs font-black ${
                      activeTag === option.tag
                        ? 'border-black bg-black text-white'
                        : 'border-[#8d99ae] bg-[#edf2f4] text-[#2b2d42] hover:border-black hover:bg-white'
                    }`}
                  >
                    <span className="min-w-0 truncate">{option.tag}</span>
                    <span className={`shrink-0 ${activeTag === option.tag ? 'text-white/75' : 'text-[#6c757d]'}`}>
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {currentItem ? (
              <div className="mt-3 border-2 border-[#8d99ae] bg-white px-3 py-2">
                <div className="truncate text-sm font-black text-[#2b2d42]">{currentItem.title}</div>
                <div className="mt-1 text-xs font-bold text-[#6c757d]">
                  {currentItem.decade} / {localIndex + 1} of {filteredItems.length}
                </div>
              </div>
            ) : null}
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

        <div className="relative h-[258px] overflow-hidden pt-2">
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
                ...(memory.extraTags ?? []),
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
