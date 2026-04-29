'use client';

import {
  BookmarkPlus,
  ExternalLink,
  FolderOpen,
  LockKeyhole,
  Search,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type SearchResult = {
  id: string;
  title: string;
  imageUrl: string;
  thumbUrl: string;
  source: string;
  sourceUrl?: string;
};

type SavedItem = SearchResult & {
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
  category: string;
  query: string;
  subs: string[];
};

type TagNavLevel = 'decade' | 'channel' | 'main' | 'deep';

const DECADE_OPTIONS = ['80s', '90s', '2000s', 'Not Sure'];

const FAST_FOOD_PRESETS = [
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
];

const CASUAL_RESTAURANT_PRESETS = [
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
];

const MALL_FOOD_COURT_PRESETS = [
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
];

const channelData: Channel[] = [
  {
    id: 'stores',
    number: '01',
    title: 'Stores',
    category: 'STORES',
    query: '90s big box toy store electronics aisle',
    subs: ['Big Box', 'Toy Stores', 'Electronics', 'Grocery', 'Department', 'Video Stores'],
  },
  {
    id: 'malls',
    number: '02',
    title: 'Malls',
    category: 'MALLS',
    query: '90s shopping mall food court interior',
    subs: ['Mall Interiors', 'Food Courts', 'Anchor Stores', 'Specialty Shops', 'Kiosks', 'Mall Events'],
  },
  {
    id: 'themeparks',
    number: '03',
    title: 'Theme Parks',
    category: 'THEME PARKS',
    query: '1990s theme park queue signage resort food court',
    subs: ['Rides', 'Park Areas', 'Resorts', 'Food & Dining', 'Queues', 'Maps & Signage'],
  },
  {
    id: 'restaurants',
    number: '04',
    title: 'Restaurants',
    category: 'RESTAURANTS',
    query: '90s fast food restaurant interior play place pizza buffet',
    subs: ['Fast Food', 'Pizza Places', 'Casual Dining', 'Play Places', 'Buffets', 'Drive-Thru'],
  },
  {
    id: 'homelife',
    number: '05',
    title: 'Home Life',
    category: 'HOME LIFE',
    query: '90s living room bedroom computer setup basement',
    subs: ['Living Rooms', 'Bedrooms', 'Kitchens', 'Basements', 'Game Rooms', 'Home Computers'],
  },
  {
    id: 'schools',
    number: '06',
    title: 'Schools',
    category: 'SCHOOLS',
    query: '90s school classroom cafeteria hallway lockers library',
    subs: ['Classrooms', 'Cafeterias', 'Hallways', 'Playgrounds', 'Libraries', 'School Events'],
  },
  {
    id: 'arcades',
    number: '07',
    title: 'Arcades & Gaming',
    category: 'ARCADES & GAMING',
    query: '90s arcade game room console kiosk prize counter',
    subs: ['Arcades', 'Store Kiosks', 'LAN Setups', 'Console Rooms', 'Prize Areas', 'Game Corners'],
  },
  {
    id: 'movies',
    number: '08',
    title: 'Movies & Entertainment',
    category: 'MOVIES & ENTERTAINMENT',
    query: '90s movie theater lobby video rental store VHS shelves',
    subs: ['Movie Theaters', 'Drive-Ins', 'Video Rentals', 'Home Media', 'Concessions', 'Lobby Spaces'],
  },
  {
    id: 'travel',
    number: '09',
    title: 'Travel & Vacation',
    category: 'TRAVEL & VACATION',
    query: '90s hotel airport airplane diner roadside stop interior',
    subs: ['Airports', 'Airplanes', 'Hotels', 'Motels', 'Roadside Stops', 'Travel Interiors'],
  },
  {
    id: 'outdoors',
    number: '10',
    title: 'Outdoors',
    category: 'OUTDOORS',
    query: '90s neighborhood park pool playground campground skate park',
    subs: ['Parks', 'Neighborhoods', 'Pools', 'Playgrounds', 'Campgrounds', 'Skate Parks'],
  },
  {
    id: 'cars',
    number: '11',
    title: 'Cars & Road Life',
    category: 'CARS & ROAD LIFE',
    query: '90s car interior road trip parking lot dealership dashboard',
    subs: ['Car Interiors', 'Road Trips', 'Parking Lots', 'Dealerships', 'Dashboard Views', 'Car Culture'],
  },
  {
    id: 'everyday',
    number: '12',
    title: 'Everyday Spaces',
    category: 'EVERYDAY SPACES',
    query: '90s waiting room laundromat doctor office DMV bathroom',
    subs: ['Waiting Rooms', 'Doctor Offices', 'Laundromats', 'Bathrooms', 'Government Buildings', 'Misc. Spaces'],
  },
];

const CATEGORY_TREE = {
  ...Object.fromEntries(
  channelData.map((channel) => [channel.category, channel.subs])
  ),
  RESTAURANTS: [
    'Fast Food',
    'Pizza Places',
    'Casual Dining',
    'Play Places',
    'Buffets',
    'Drive-Thru',
    ...FAST_FOOD_PRESETS,
    ...CASUAL_RESTAURANT_PRESETS,
  ],
  MALLS: [
    'Mall Interiors',
    'Food Courts',
    'Anchor Stores',
    'Specialty Shops',
    'Kiosks',
    'Mall Events',
    ...MALL_FOOD_COURT_PRESETS,
  ],
} as Record<string, string[]>;

const CHANNEL_DEEP_TAG_PRESETS: Record<string, Record<string, string[]>> = {
  STORES: {
    'Big Box': ['Walmart', 'Kmart', 'Target', 'Ames', 'Hills', 'Service Merchandise', 'Woolworth'],
    'Toy Stores': ['Toys R Us', 'KB Toys', 'Kay-Bee Toys'],
    Electronics: ['Circuit City', 'RadioShack', 'Best Buy', 'CompUSA'],
    Grocery: ['ShopRite', 'Kroger', 'Publix', 'Winn-Dixie', 'Pathmark', 'A&P', 'Albertsons', 'Safeway'],
    Department: ['Sears', 'JCPenney', "Macy's", 'Montgomery Ward'],
    'Video Stores': ['Blockbuster Video', 'Hollywood Video', 'Movie Gallery'],
  },
  MALLS: {
    'Mall Interiors': ['Fountains', 'Escalators', 'Skylights', 'Directories', 'Seating Areas'],
    'Food Courts': MALL_FOOD_COURT_PRESETS,
    'Anchor Stores': ['Sears', 'JCPenney', "Macy's", "Dillard's", 'Nordstrom'],
    'Specialty Shops': ['Sam Goody', 'KB Toys', 'Waldenbooks', 'Suncoast', 'Spencer Gifts'],
    Kiosks: ['Calendar Kiosks', 'Phone Cases', 'Perfume Carts', 'Pretzel Stands'],
    'Mall Events': ['Santa Display', 'Easter Bunny', 'Car Giveaways', 'Center Court Events'],
  },
  RESTAURANTS: {
    'Fast Food': FAST_FOOD_PRESETS,
    'Pizza Places': ["Domino's Pizza", 'Little Caesars', "Papa John's", 'Pizza Hut', 'Sbarro'],
    'Casual Dining': CASUAL_RESTAURANT_PRESETS,
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

function normalizeTagInput(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
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
    title: typeof item.title === 'string' ? item.title : 'Untitled image',
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

function normalizeComparableUrl(value?: string) {
  return value?.trim().toLowerCase() ?? '';
}

function getImageKeys(item: Pick<SearchResult, 'imageUrl' | 'thumbUrl' | 'sourceUrl'>) {
  const imageKeys = [normalizeComparableUrl(item.imageUrl), normalizeComparableUrl(item.thumbUrl)].filter(Boolean);

  return imageKeys.length > 0 ? imageKeys : [normalizeComparableUrl(item.sourceUrl)].filter(Boolean);
}

function isAlreadyArchived(item: SearchResult, archivedKeys: Set<string>) {
  return getImageKeys(item).some((key) => archivedKeys.has(key));
}

function previewProxyUrl(url: string) {
  return `/api/image-preview?url=${encodeURIComponent(url)}`;
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function addSearchTerm(query: string, term: string) {
  const cleanTerm = term.trim();
  if (!cleanTerm) return query;
  const queryTerms = query.toLowerCase().split(/\s+/);

  if (queryTerms.includes(cleanTerm.toLowerCase())) return query;

  return `${query.trim()} ${cleanTerm}`.trim();
}

export default function AdminToolPage() {
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [adminError, setAdminError] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState('malls');
  const [query, setQuery] = useState(channelData[1].query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [activeImage, setActiveImage] = useState<SearchResult | null>(null);
  const [selectedDecade, setSelectedDecade] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(channelData[1].category);
  const [selectedSubTags, setSelectedSubTags] = useState<string[]>([]);
  const [extraTagInput, setExtraTagInput] = useState('');
  const [presetDecade, setPresetDecade] = useState('');
  const [presetCategory, setPresetCategory] = useState(channelData[1].category);
  const [presetSubTags, setPresetSubTags] = useState<string[]>([]);
  const [tagNavLevel, setTagNavLevel] = useState<TagNavLevel>('decade');
  const [tagNavDecade, setTagNavDecade] = useState('');
  const [tagNavChannelId, setTagNavChannelId] = useState(channelData[1].id);
  const [tagNavMainTag, setTagNavMainTag] = useState('');

  const expectedAdminPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'nostalgia';
  const selectedChannel = channelData.find((channel) => channel.id === selectedChannelId) ?? channelData[1];
  const categoryOptions = channelData.map((channel) => channel.category);
  const availableSubTags = selectedCategory ? CATEGORY_TREE[selectedCategory] ?? [] : [];
  const channelSavedCount = useMemo(
    () => savedItems.filter((item) => item.category === selectedChannel.category).length,
    [savedItems, selectedChannel.category]
  );
  const archivedImageKeys = useMemo(() => {
    const keys = new Set<string>();

    savedItems.forEach((item) => {
      getImageKeys(item).forEach((key) => keys.add(key));
    });

    return keys;
  }, [savedItems]);
  const visibleResults = useMemo(
    () => results.filter((item) => !isAlreadyArchived(item, archivedImageKeys)),
    [archivedImageKeys, results]
  );
  useEffect(() => {
    const storedSecret = sessionStorage.getItem('nostalgia-admin-secret') || '';
    if (sessionStorage.getItem('nostalgia-admin-unlocked') === 'true' && storedSecret) {
      queueMicrotask(() => {
        setAdminSecret(storedSecret);
        setAdminUnlocked(true);
      });
    }
  }, []);

  useEffect(() => {
    const loadArchive = async () => {
      try {
        const response = await fetch('/api/archive', { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not load archive.');
        const data = await response.json();
        setSavedItems(Array.isArray(data) ? data.map(normalizeSavedItem) : []);
      } catch {
        setSavedItems([]);
      }
    };

    loadArchive();
  }, []);

  const unlockAdmin = () => {
    if (adminPasscode === expectedAdminPasscode) {
      sessionStorage.setItem('nostalgia-admin-unlocked', 'true');
      sessionStorage.setItem('nostalgia-admin-secret', adminPasscode);
      setAdminSecret(adminPasscode);
      setAdminUnlocked(true);
      setAdminError('');
      return;
    }

    setAdminError('Wrong passcode.');
  };

  const chooseChannel = (channelId: string) => {
    const channel = channelData.find((item) => item.id === channelId) ?? channelData[1];
    setSelectedChannelId(channel.id);
    setTagNavChannelId(channel.id);
    setTagNavMainTag('');
    setQuery(channel.query);
    setSelectedCategory(channel.category);
    setSelectedSubTags([]);
    setPresetCategory(channel.category);
    setPresetSubTags([]);
    setError('');
    setNotice('');
  };

  const applyNavigatorSelection = ({
    decade = tagNavDecade,
    channelId = tagNavChannelId,
    mainTag = tagNavMainTag,
    deepTag = '',
  }: {
    decade?: string;
    channelId?: string;
    mainTag?: string;
    deepTag?: string;
  }) => {
    const channel = channelData.find((item) => item.id === channelId) ?? selectedChannel;
    const terms = [decade && decade !== 'Not Sure' ? decade : '', channel.title, mainTag, deepTag].filter(Boolean);

    setSelectedChannelId(channel.id);
    setSelectedCategory(channel.category);
    setPresetDecade(decade);
    setPresetCategory(channel.category);
    setSelectedSubTags([mainTag, deepTag].filter(Boolean));
    setPresetSubTags([mainTag, deepTag].filter(Boolean));
    setQuery((currentQuery) => terms.reduce((nextQuery, term) => addSearchTerm(nextQuery, term), currentQuery));
  };

  const runSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setNotice('');

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Search request failed.');
      }

      const data: SearchResult[] = await response.json();
      setResults(data.filter((item) => !isAlreadyArchived(item, archivedImageKeys)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const openSaveModal = (item: SearchResult) => {
    setActiveImage(item);
    setSelectedDecade(presetDecade);
    setSelectedCategory(presetCategory || selectedChannel.category);
    setSelectedSubTags(presetSubTags);
    setExtraTagInput('');
  };

  const saveImage = async () => {
    if (!activeImage || !selectedDecade || !selectedCategory || saving) return;

    const entry = {
      ...activeImage,
      id: activeImage.id,
      originalQuery: query,
      decade: selectedDecade,
      category: selectedCategory,
      subTags: selectedSubTags,
      extraTags: normalizeTagInput(extraTagInput),
      savedAt: new Date().toLocaleString(),
    };

    setSaving(true);
    setError('');
    setNotice('');

    try {
      const response = await fetch('/api/archive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify(entry),
      });
      const data = await response.json().catch(() => null);

      if (response.status === 409) {
        const duplicate = normalizeSavedItem(data?.item);
        setSavedItems((items) => (items.some((item) => item.id === duplicate.id) ? items : [duplicate, ...items]));
        setResults((items) => items.filter((item) => !isAlreadyArchived(item, new Set(getImageKeys(duplicate)))));
        setNotice('Already archived. Removed it from the search results.');
        setActiveImage(null);
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Could not save archive item.');
      }

      const saved = normalizeSavedItem(data);
      setSavedItems((items) => [saved, ...items]);
      setResults((items) => items.filter((item) => !isAlreadyArchived(item, new Set(getImageKeys(saved)))));
      setNotice('Saved to archive and removed from results.');
      setActiveImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save archive item.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSubTag = (tag: string) => {
    setSelectedSubTags((prev) =>
      prev.includes(tag) ? prev.filter((savedTag) => savedTag !== tag) : [...prev, tag]
    );
  };

  if (!adminUnlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101426] p-4 font-mono text-black">
        <section className="w-full max-w-md border-4 border-white bg-[#f8f9fa] shadow-[8px_8px_0_rgba(0,0,0,0.45)]">
          <div className="bg-gradient-to-r from-[#ff4d6d] via-[#ffbe0b] to-[#7bdff2] px-3 py-2 font-bold">
            Nostalgia.exe Admin
          </div>
          <div className="p-5">
            <div className="mb-4 flex h-14 w-14 items-center justify-center border-4 border-[#8d99ae] bg-[#1b2a52] text-white">
              <LockKeyhole size={26} />
            </div>
            <h1 className="text-2xl font-black">ADMIN ACCESS</h1>
            <p className="mt-2 text-sm font-bold leading-6 text-[#495057]">
              Unlock the sourcing tool. Public archive browsing lives on the main site.
            </p>
            <input
              value={adminPasscode}
              onChange={(event) => setAdminPasscode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') unlockAdmin();
              }}
              type="password"
              className="mt-5 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
              placeholder="Passcode"
            />
            {adminError ? <div className="mt-3 border-2 border-red-300 bg-red-50 p-3 text-sm font-bold text-red-700">{adminError}</div> : null}
            <button
              onClick={unlockAdmin}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 border-2 border-black bg-black px-4 text-sm font-black text-white"
            >
              <LockKeyhole size={16} />
              UNLOCK TOOL
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#101426] p-3 font-mono text-black md:p-6">
      <div className="mx-auto max-w-7xl border-4 border-white bg-[#f8f9fa] shadow-[8px_8px_0_rgba(0,0,0,0.45)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#8d99ae] bg-gradient-to-r from-[#ff4d6d] via-[#ffbe0b] to-[#7bdff2] px-3 py-2 font-bold">
          <div>
            <div>Nostalgia.exe Admin</div>
            <div className="text-xs font-black uppercase tracking-[0.12em] text-black/65">Sourcing Tool</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/auto-tag"
              className="flex h-10 items-center gap-2 border-2 border-white bg-white px-3 text-xs font-black text-black hover:border-black"
            >
              <Sparkles size={16} />
              AUTO TAGGER
            </Link>
            <Link
              href="/admin/archive"
              className="flex h-10 items-center gap-2 border-2 border-white bg-white px-3 text-xs font-black text-black hover:border-black"
            >
              <FolderOpen size={16} />
              SAVED ARCHIVES
            </Link>
          </div>
        </header>

        <section className="grid gap-0 lg:grid-cols-[360px_1fr]">
          <aside className="border-b-4 border-[#8d99ae] bg-[#edf2f4] p-4 lg:border-b-0 lg:border-r-4">
            <div className="mb-4 text-sm font-black uppercase tracking-[0.12em] text-[#3a0ca3]">Search Setup</div>

            <label className="block text-sm font-black text-[#2b2d42]">
              Channel
              <select
                value={selectedChannelId}
                onChange={(event) => chooseChannel(event.target.value)}
                className="mt-2 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
              >
                {channelData.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    CH {channel.number} / {channel.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm font-black text-[#2b2d42]">
              Query
              <textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="mt-2 min-h-28 w-full resize-y border-2 border-[#8d99ae] bg-white p-3 text-sm font-bold outline-none focus:border-black"
                placeholder="Search images..."
              />
            </label>

            <button
              onClick={runSearch}
              disabled={loading || !query.trim()}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 border-2 border-black bg-black px-4 text-sm font-black text-white disabled:opacity-50"
            >
              <Search size={16} />
              {loading ? 'SEARCHING' : 'SEARCH IMAGES'}
            </button>

            {error ? <div className="mt-4 border-2 border-red-300 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div> : null}
            {notice ? <div className="mt-4 border-2 border-[#7bdff2] bg-[#e8fbff] p-3 text-sm font-bold text-[#1b2a52]">{notice}</div> : null}

            <AdminTagNavigator
              channelData={channelData}
              savedItems={savedItems}
              selectedChannel={selectedChannel}
              selectedDecade={tagNavDecade}
              selectedChannelId={tagNavChannelId}
              selectedMainTag={tagNavMainTag}
              level={tagNavLevel}
              channelSavedCount={channelSavedCount}
              onLevel={setTagNavLevel}
              onDecade={(decade) => {
                setTagNavDecade(decade);
                setTagNavLevel('channel');
                applyNavigatorSelection({ decade });
              }}
              onChannel={(channelId) => {
                setTagNavChannelId(channelId);
                setTagNavMainTag('');
                setTagNavLevel('main');
                applyNavigatorSelection({ channelId, mainTag: '', deepTag: '' });
              }}
              onMainTag={(tag) => {
                setTagNavMainTag(tag);
                setTagNavLevel('deep');
                applyNavigatorSelection({ mainTag: tag, deepTag: '' });
              }}
              onDeepTag={(tag) => applyNavigatorSelection({ mainTag: tagNavMainTag, deepTag: tag })}
            />

          </aside>

          <section className="bg-[#dfe8f6] p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black uppercase tracking-[0.12em] text-[#3a0ca3]">Search Results</div>
                <div className="mt-1 text-xs font-bold text-[#495057]">{visibleResults.length} results loaded</div>
              </div>
            </div>

            {loading ? (
              <div className="border-2 border-dashed border-[#8d99ae] bg-white p-6 text-sm font-bold text-[#495057]">Loading results...</div>
            ) : visibleResults.length === 0 ? (
              <div className="border-2 border-dashed border-[#8d99ae] bg-white p-6 text-sm font-bold text-[#495057]">
                {results.length > 0
                  ? 'All results from this search are already archived.'
                  : 'Run a search to start collecting archive candidates.'}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visibleResults.map((item) => (
                  <article key={item.id} className="overflow-hidden border-2 border-[#8d99ae] bg-white shadow-[4px_4px_0_rgba(141,153,174,0.45)]">
                    <img src={item.thumbUrl || item.imageUrl} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                    <div className="space-y-3 p-3">
                      <div>
                        <h2 className="line-clamp-2 text-sm font-black text-[#2b2d42]">{item.title}</h2>
                        <p className="text-xs font-bold text-[#6c757d]">{item.source}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openSaveModal(item)}
                          className="flex h-10 flex-1 items-center justify-center gap-2 border-2 border-black bg-black px-3 text-xs font-black text-white"
                        >
                          <BookmarkPlus size={15} />
                          SAVE
                        </button>
                        {item.sourceUrl ? (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-10 w-11 items-center justify-center border-2 border-[#8d99ae] bg-white text-black hover:border-black"
                            title="Open source"
                          >
                            <ExternalLink size={15} />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>

      {activeImage ? (
        <SaveModal
          image={activeImage}
          selectedDecade={selectedDecade}
          selectedCategory={selectedCategory}
          selectedSubTags={selectedSubTags}
          extraTagInput={extraTagInput}
          categoryOptions={categoryOptions}
          availableSubTags={availableSubTags}
          onClose={() => setActiveImage(null)}
          onSave={saveImage}
          saving={saving}
          onDecade={setSelectedDecade}
          onCategory={(category) => {
            setSelectedCategory(category);
            setSelectedSubTags([]);
          }}
          onToggleSubTag={toggleSubTag}
          onExtraTags={setExtraTagInput}
        />
      ) : null}
    </main>
  );
}

function SaveModal({
  image,
  selectedDecade,
  selectedCategory,
  selectedSubTags,
  extraTagInput,
  categoryOptions,
  availableSubTags,
  onClose,
  onSave,
  saving,
  onDecade,
  onCategory,
  onToggleSubTag,
  onExtraTags,
}: {
  image: SearchResult;
  selectedDecade: string;
  selectedCategory: string;
  selectedSubTags: string[];
  extraTagInput: string;
  categoryOptions: string[];
  availableSubTags: string[];
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  onDecade: (value: string) => void;
  onCategory: (value: string) => void;
  onToggleSubTag: (value: string) => void;
  onExtraTags: (value: string) => void;
}) {
  const directCandidates = uniqueValues([image.imageUrl, image.thumbUrl]);
  const previewCandidates = uniqueValues([
    ...directCandidates.map(previewProxyUrl),
    ...directCandidates,
  ]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const previewSrc = previewCandidates[previewIndex] ?? '';
  const previewFailed = previewCandidates.length === 0 || previewIndex >= previewCandidates.length;
  const usingFallback = previewIndex > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="max-h-[96vh] w-full max-w-[96vw] overflow-y-auto border-4 border-white bg-[#f8f9fa] p-4 text-black shadow-[8px_8px_0_rgba(0,0,0,0.55)] md:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">SAVE MEMORY</h2>
            <p className="mt-1 text-sm font-bold text-[#6c757d]">{image.title}</p>
          </div>
          <button onClick={onClose} className="border-2 border-[#8d99ae] bg-white px-3 py-1 text-sm font-black hover:border-black">
            CLOSE
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.75fr)]">
          <div>
            <div className="flex h-[62vh] min-h-[420px] items-center justify-center overflow-hidden border-4 border-[#8d99ae] bg-black">
              {previewFailed ? (
                <div className="p-6 text-center text-white">
                  <div className="text-lg font-black">PREVIEW BLOCKED</div>
                  <p className="mt-2 text-sm font-bold leading-6 text-white/75">
                    This source is blocking both the full image and thumbnail preview. Open the source before saving this one.
                  </p>
                </div>
              ) : (
                <img
                  src={previewSrc}
                  alt={image.title}
                  onError={() => setPreviewIndex((index) => index + 1)}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-[#495057]">
              <span>{image.source}</span>
              <span className="border-2 border-[#8d99ae] bg-white px-2 py-1 text-xs font-black text-[#2b2d42]">
                {usingFallback ? 'Preview fallback active' : 'Preview loaded'}
              </span>
              {image.sourceUrl ? (
                <a
                  href={image.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-2 border-2 border-[#8d99ae] bg-white px-3 text-xs font-black text-black hover:border-black"
                >
                  <ExternalLink size={15} />
                  OPEN SOURCE
                </a>
              ) : null}
            </div>
          </div>

          <div className="space-y-5">
            <TagButtonGroup title="Decade" options={DECADE_OPTIONS} selected={[selectedDecade]} onPick={onDecade} />
            <TagButtonGroup title="Channel" options={categoryOptions} selected={[selectedCategory]} onPick={onCategory} />
            {selectedCategory ? (
              <TagButtonGroup title="Sub-tags" options={availableSubTags} selected={selectedSubTags} onPick={onToggleSubTag} multi />
            ) : null}

            <label className="block text-sm font-black uppercase tracking-[0.12em] text-[#3a0ca3]">
              Extra Tags
              <input
                value={extraTagInput}
                onChange={(event) => onExtraTags(event.target.value)}
                placeholder="comma-separated tags"
                className="mt-2 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm normal-case tracking-normal outline-none focus:border-black"
              />
            </label>

            <button
              onClick={onSave}
              disabled={!selectedDecade || !selectedCategory || saving}
              className="flex min-h-12 w-full items-center justify-center gap-2 border-2 border-black bg-black px-4 text-sm font-black text-white disabled:opacity-50"
            >
              <BookmarkPlus size={16} />
              {saving ? 'SAVING' : 'SAVE TO ARCHIVE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminTagNavigator({
  channelData,
  savedItems,
  selectedChannel,
  selectedDecade,
  selectedChannelId,
  selectedMainTag,
  level,
  channelSavedCount,
  onLevel,
  onDecade,
  onChannel,
  onMainTag,
  onDeepTag,
}: {
  channelData: Channel[];
  savedItems: SavedItem[];
  selectedChannel: Channel;
  selectedDecade: string;
  selectedChannelId: string;
  selectedMainTag: string;
  level: TagNavLevel;
  channelSavedCount: number;
  onLevel: (level: TagNavLevel) => void;
  onDecade: (decade: string) => void;
  onChannel: (channelId: string) => void;
  onMainTag: (tag: string) => void;
  onDeepTag: (tag: string) => void;
}) {
  const navChannel = channelData.find((channel) => channel.id === selectedChannelId) ?? selectedChannel;
  const deepTags = CHANNEL_DEEP_TAG_PRESETS[navChannel.category]?.[selectedMainTag] ?? [];

  const countFor = (match: (item: SavedItem) => boolean) => savedItems.filter(match).length;
  const decadeOptions = DECADE_OPTIONS.map((decade) => ({
    label: decade,
    count: countFor((item) => item.decade === decade),
  }));
  const channelOptions = channelData.map((channel) => ({
    label: channel.title,
    id: channel.id,
    count: countFor((item) => item.category === channel.category),
  }));
  const mainOptions = navChannel.subs.map((tag) => ({
    label: tag,
    count: countFor((item) => item.category === navChannel.category && item.subTags.includes(tag)),
  }));
  const deepOptions = deepTags.map((tag) => ({
    label: tag,
    count: countFor(
      (item) =>
        item.category === navChannel.category &&
        (item.subTags.includes(tag) || item.extraTags.includes(tag) || item.title.toLowerCase().includes(tag.toLowerCase()))
    ),
  }));

  const canGoBack = level !== 'decade';
  const goBack = () => {
    if (level === 'deep') onLevel('main');
    if (level === 'main') onLevel('channel');
    if (level === 'channel') onLevel('decade');
  };

  const visibleOptions =
    level === 'decade'
      ? decadeOptions
      : level === 'channel'
        ? channelOptions
        : level === 'main'
          ? mainOptions
          : deepOptions;
  const heading =
    level === 'decade'
      ? 'Choose Decade'
      : level === 'channel'
        ? 'Choose Channel'
        : level === 'main'
          ? 'Choose Category'
          : selectedMainTag
            ? `${selectedMainTag} Tags`
            : 'Choose Tag';

  return (
    <section className="mt-5 border-2 border-[#8d99ae] bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.12em] text-[#3a0ca3]">Search Tag Navigator</div>
          <div className="mt-1 text-[11px] font-black text-[#6c757d]">{selectedChannel.title}: {channelSavedCount} saved</div>
        </div>
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className="h-8 border-2 border-[#2b2d42] bg-[#edf2f4] px-3 text-[11px] font-black text-[#2b2d42] shadow-[2px_2px_0_#8d99ae] hover:border-black hover:bg-white disabled:opacity-35"
        >
          BACK
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 border-2 border-[#8d99ae] bg-[#edf2f4] px-2 py-2 text-[11px] font-black text-[#2b2d42]">
        <button onClick={() => onLevel('decade')} className="hover:underline">
          {selectedDecade || 'Decade'}
        </button>
        <span>/</span>
        <button onClick={() => onLevel('channel')} className="hover:underline">
          {navChannel.title}
        </button>
        {selectedMainTag ? (
          <>
            <span>/</span>
            <button onClick={() => onLevel('main')} className="hover:underline">
              {selectedMainTag}
            </button>
          </>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-[0.12em] text-[#3a0ca3]">{heading}</div>
        <div className="text-[11px] font-black text-[#6c757d]">{visibleOptions.length} options</div>
      </div>

      <div className="mt-3 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
        {visibleOptions.length > 0 ? (
          visibleOptions.map((option) => {
            const optionId = 'id' in option && typeof option.id === 'string' ? option.id : '';
            const optionKey = optionId || option.label;
            const optionActive =
              (level === 'decade' && option.label === selectedDecade) ||
              (level === 'channel' && optionId === selectedChannelId) ||
              (level === 'main' && option.label === selectedMainTag);
            const onClick =
              level === 'decade'
                ? () => onDecade(option.label)
                : level === 'channel' && optionId
                  ? () => onChannel(optionId)
                  : level === 'main'
                    ? () => onMainTag(option.label)
                    : () => onDeepTag(option.label);

            return (
              <button
                key={optionKey}
                onClick={onClick}
                className={`tag-button-90s flex min-h-10 items-center justify-between gap-2 border-2 px-2 py-2 text-left text-[11px] font-black transition hover:-translate-y-[1px] ${
                  optionActive
                    ? 'border-black bg-[#ffd166] text-black shadow-[3px_3px_0_#3a0ca3]'
                    : 'border-[#2b2d42] bg-[#f8f9fa] text-[#2b2d42] shadow-[2px_2px_0_#8d99ae] hover:border-black hover:bg-white'
                }`}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                <span className="shrink-0 text-[#6c757d]">{option.count}</span>
              </button>
            );
          })
        ) : (
          <div className="col-span-2 border-2 border-dashed border-[#8d99ae] bg-[#edf2f4] p-3 text-xs font-bold text-[#495057]">
            No deeper tags yet. Use this category as-is.
          </div>
        )}
      </div>
    </section>
  );
}

function TagButtonGroup({
  title,
  options,
  selected,
  onPick,
  multi = false,
}: {
  title: string;
  options: string[];
  selected: string[];
  onPick: (value: string) => void;
  multi?: boolean;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-black uppercase tracking-[0.12em] text-[#3a0ca3]">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onPick(option)}
              className={`min-h-10 border-2 px-3 text-sm font-bold ${
                active ? 'border-black bg-black text-white' : 'border-[#8d99ae] bg-white text-black hover:border-black'
              }`}
              aria-pressed={multi ? active : undefined}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
