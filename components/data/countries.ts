
export const GENDER_OPTIONS = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
];


export const BANK_LIST = {
  USA: [
    { name: "JPMorgan Chase", routing: "021000021" },
    { name: "Bank of America", routing: "026009593" },
    { name: "Wells Fargo", routing: "121000248" },
    { name: "Citibank", routing: "021000089" },
    { name: "Goldman Sachs", routing: "021000322" },
  ],
  UK: [
    { name: "HSBC UK", routing: "40-05-30" }, // Sort Code
    { name: "Barclays", routing: "20-00-00" },
    { name: "Lloyds Bank", routing: "30-00-00" },
    { name: "NatWest", routing: "60-00-01" },
    { name: "Monzo", routing: "04-00-04" },
  ]
};


export const locationData:any = {
    "Nigeria": {
        "Lagos": ["Ikeja", "Lekki", "Victoria Island", "Surulere"],
        "Rivers": ["Port Harcourt", "Obio-Akpor", "Bonny"],
        "Abuja": ["Garki", "Wuse", "Maitama", "Asokoro"],
        "Kano": ["Kano City", "Fagge"]
    },
    "United States": {
        "California": ["Los Angeles", "San Francisco", "San Diego"],
        "Texas": ["Houston", "Austin", "Dallas"],
        "New York": ["New York City", "Buffalo", "Albany"]
    },
    "United Kingdom": {
        "England": ["London", "Manchester", "Birmingham"],
        "Scotland": ["Glasgow", "Edinburgh", "Aberdeen"],
        "Wales": ["Cardiff", "Swansea"]
    },
    "Canada": {
        "Ontario": ["Toronto", "Ottawa", "Mississauga"],
        "British Columbia": ["Vancouver", "Victoria"],
        "Quebec": ["Montreal", "Quebec City"]
    },
    "Australia": {
        "New South Wales": ["Sydney", "Newcastle"],
        "Victoria": ["Melbourne", "Geelong"],
        "Queensland": ["Brisbane", "Gold Coast"]
    },
    "Germany": {
        "Bavaria": ["Munich", "Nuremberg"],
        "Berlin": ["Berlin City"],
        "Hesse": ["Frankfurt", "Wiesbaden"]
    },
    "France": {
        "Île-de-France": ["Paris", "Boulogne-Billancourt"],
        "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice"],
        "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble"]
    },
    "India": {
        "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
        "Karnataka": ["Bengaluru", "Mysuru"],
        "Delhi": ["New Delhi", "North Delhi"]
    },
    "South Africa": {
        "Gauteng": ["Johannesburg", "Pretoria"],
        "Western Cape": ["Cape Town", "Stellenbosch"],
        "KwaZulu-Natal": ["Durban"]
    },
    "Ghana": {
        "Greater Accra": ["Accra", "Tema", "Madina"],
        "Ashanti": ["Kumasi", "Obuasi"],
        "Western": ["Sekondi-Takoradi", "Tarkwa"]
    },
    "Kenya": {
        "Nairobi": ["Nairobi City"],
        "Mombasa": ["Mombasa City"],
        "Kisumu": ["Kisumu City"]
    },
    "United Arab Emirates": {
        "Dubai": ["Dubai City"],
        "Abu Dhabi": ["Abu Dhabi City", "Al Ain"],
        "Sharjah": ["Sharjah City"]
    },
    "Japan": {
        "Tokyo": ["Shinjuku", "Shibuya", "Minato"],
        "Osaka": ["Osaka City", "Sakai"],
        "Kyoto": ["Kyoto City"]
    },
    "Brazil": {
        "São Paulo": ["São Paulo City", "Campinas"],
        "Rio de Janeiro": ["Rio de Janeiro City", "Niterói"]
    },
    "Mexico": {
        "Jalisco": ["Guadalajara", "Zapopan"],
        "Nuevo León": ["Monterrey", "Guadalupe"]
    },
    "Italy": {
        "Lombardy": ["Milan", "Bergamo"],
        "Lazio": ["Rome", "Latina"],
        "Tuscany": ["Florence", "Prato"]
    },
    "Spain": {
        "Madrid": ["Madrid City", "Alcalá"],
        "Catalonia": ["Barcelona", "Girona"]
    },
    "Netherlands": {
        "North Holland": ["Amsterdam", "Haarlem"],
        "South Holland": ["Rotterdam", "The Hague"]
    },
    "Singapore": {
        "Central": ["Downtown Core", "Orchard"],
        "West": ["Jurong East", "Clementi"],
        "East": ["Tampines", "Bedok"]
    },
    "Malaysia": {
        "Selangor": ["Shah Alam", "Petaling Jaya"],
        "Johor": ["Johor Bahru"],
        "Penang": ["George Town"]
    },
    "Turkey": {
        "Istanbul": ["Istanbul City", "Üsküdar"],
        "Ankara": ["Ankara City"],
        "Izmir": ["Izmir City"]
    },
    "Saudi Arabia": {
        "Riyadh": ["Riyadh City"],
        "Makkah": ["Jeddah", "Mecca"],
        "Eastern Province": ["Dammam", "Khobar"]
    },
    "Switzerland": {
        "Zurich": ["Zurich City", "Winterthur"],
        "Geneva": ["Geneva City"],
        "Bern": ["Bern City"]
    },
    "Sweden": {
        "Stockholm": ["Stockholm City"],
        "Skåne": ["Malmö", "Lund"]
    },
    "Norway": {
        "Oslo": ["Oslo City"],
        "Vestland": ["Bergen"],
        "Rogaland": ["Stavanger"]
    },
    "Denmark": {
        "Hovedstaden": ["Copenhagen"],
        "Midtjylland": ["Aarhus"]
    },
    "Finland": {
        "Uusimaa": ["Helsinki", "Espoo"],
        "Pirkanmaa": ["Tampere"]
    },
    "Ireland": {
        "Leinster": ["Dublin"],
        "Munster": ["Cork", "Limerick"]
    },
    "New Zealand": {
        "Auckland": ["Auckland City"],
        "Wellington": ["Wellington City"]
    },
    "Portugal": {
        "Lisbon": ["Lisbon City", "Sintra"],
        "Porto": ["Porto City"]
    },
    "Greece": {
        "Attica": ["Athens", "Piraeus"],
        "Central Macedonia": ["Thessaloniki"]
    },
    "Austria": {
        "Vienna": ["Vienna City"],
        "Styria": ["Graz"]
    },
    "Belgium": {
        "Flanders": ["Antwerp", "Ghent"],
        "Wallonia": ["Charleroi"]
    },
    "Poland": {
        "Masovian": ["Warsaw"],
        "Lesser Poland": ["Kraków"]
    },
    "Israel": {
        "Tel Aviv": ["Tel Aviv City", "Holon"],
        "Jerusalem": ["Jerusalem City"]
    },
    "Egypt": {
        "Cairo": ["Cairo City", "Giza"],
        "Alexandria": ["Alexandria City"]
    },
    "Argentina": {
        "Buenos Aires": ["La Plata", "Quilmes"],
        "Córdoba": ["Córdoba City"]
    },
    "Chile": {
        "Santiago": ["Santiago City"],
        "Valparaíso": ["Viña del Mar"]
    },
    "Colombia": {
        "Bogotá": ["Bogotá City"],
        "Antioquia": ["Medellín"]
    },
    "Peru": {
        "Lima": ["Lima City"],
        "Arequipa": ["Arequipa City"]
    },
    "Thailand": {
        "Bangkok": ["Bangkok City"],
        "Chon Buri": ["Pattaya"]
    },
    "Vietnam": {
        "Ho Chi Minh City": ["District 1"],
        "Hanoi": ["Hoan Kiem"]
    },
    "Philippines": {
        "Metro Manila": ["Quezon City", "Manila"],
        "Cebu": ["Cebu City"]
    },
    "Indonesia": {
        "Jakarta": ["Central Jakarta"],
        "West Java": ["Bandung"]
    },
    "South Korea": {
        "Seoul": ["Gangnam"],
        "Busan": ["Haeundae"]
    },
    "China": {
        "Guangdong": ["Guangzhou", "Shenzhen"],
        "Zhejiang": ["Hangzhou"]
    },
    "Russia": {
        "Moscow": ["Moscow City"],
        "Saint Petersburg": ["Saint Petersburg City"]
    },
    "Ukraine": {
        "Kyiv": ["Kyiv City"],
        "Lviv": ["Lviv City"]
    },
    "Czech Republic": {
        "Prague": ["Prague City"],
        "South Moravian": ["Brno"]
    },
    "Hungary": {
        "Central Hungary": ["Budapest"],
        "Csongrád": ["Szeged"]
    },
    "Romania": {
        "Bucharest": ["Bucharest City"],
        "Cluj": ["Cluj-Napoca"]
    }
};

