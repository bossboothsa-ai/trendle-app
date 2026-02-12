
// --- Media Keywords Mapping ---
const CAT_KEYWORDS: Record<string, string[]> = {
    "Coffee": ["coffee", "latte", "cafe", "pastry", "laptop", "cozy"],
    "Brunch": ["brunch", "pancakes", "eggs", "mimosas", "breakfast"],
    "Nightlife": ["cocktails", "bar", "drinks", "party", "neon", "beer"],
    "Food": ["restaurant", "dining", "steak", "lunch", "dinner", "plate"],
    "Wellness": ["spa", "massage", "candles", "yoga", "meditation"],
    "Grooming": ["barbershop", "haircut", "shave", "barber"],
    "Beauty": ["nails", "manicure", "salon", "makeup", "luxury"],
    "Fashion": ["boutique", "clothing", "fashion", "shopping", "clothes"]
};

const ID_POOL: Record<string, string[]> = {
    "Coffee": ["1509042239860-f550ce710b93", "1495474472287-4d71bcdd2085", "1521017432531-fbd92d768814", "1501339847302-ac426a4a7cbb", "1497933048642-fe8b8b7ed2f2", "1554118811-1e0d58224f24"],
    "Brunch": ["1496042399014-1730045450d5", "1533089860892-a7c6f0a88666", "1517048676732-d65bc937f952", "1559620191-030c62145d52", "1497034825429-c343d7c6a68f"],
    "Nightlife": ["1514362545857-3bc16549766b", "1574096079513-d8259312b785", "1510812431401-41d2bd2722f3"],
    "Food": ["1555396273-367ea4eb4db5", "1504674900247-0877df9cc836", "1579871494447-9811cf80d66c"],
    "Wellness": ["1540555700478-4be289fbecef", "1544161515-4af6b1d462c2", "1545208393-216c7ad59645"],
    "Grooming": ["1503951914875-452162b0f3f1", "1585747860715-2ba37e788b70", "1521444470432-be521cab2bb3"],
    "Beauty": ["1522335789203-aabd1fc54bc9", "1604654894610-df63bc536371", "1562322140-8baeececf3df"],
    "Fashion": ["1441986300917-64674bd600d8", "1441984904996-e0b6ba687e04", "1483985988355-763728e1935b", "1515886657613-9f3515b0c78f"]
};

const getUnsplash = (cat: string, w = 1000) => {
    const ids = ID_POOL[cat] || ["1494790108377-be9c29b29330"];
    const id = ids[Math.floor(Math.random() * ids.length)];
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
};

const genGallery = (category: string) => {
    return Array.from({ length: 4 }).map(() => getUnsplash(category));
};

export const fictionalPlaces = [
    { name: "Neon Bean", category: "Coffee", description: "Cyberpunk aesthetic and strong cold brews.", location: "Central District", distance: "0.2km", image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1000", pointsPerVisit: 50, activeOffers: 2, tags: ["coffee", "work"], gallery: genGallery("Coffee") },
    { name: "The Velvet Whisk", category: "Brunch", description: "Gold-leaf pancakes and velvet lattes.", location: "Harbour Side", distance: "1.1km", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1000", pointsPerVisit: 50, activeOffers: 1, tags: ["brunch", "desserts"], gallery: genGallery("Brunch") },
    { name: "Lunar Lounge", category: "Nightlife", description: "Cocktails served under a glowing moon replica.", location: "Highlands", distance: "2.4km", image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=1000", pointsPerVisit: 50, activeOffers: 3, tags: ["nightlife"], gallery: genGallery("Nightlife") },
    { name: "Ember & Ash", category: "Food", description: "Open-fire cooking in a rustic stone cellar.", location: "Oak Street", distance: "0.8km", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000", pointsPerVisit: 50, activeOffers: 2, tags: ["food"], gallery: genGallery("Food") },
    { name: "Crystal Cove", category: "Wellness", description: "Salt therapy and floating meditation pods.", location: "Coastal Road", distance: "4.2km", image: "https://images.unsplash.com/photo-1544161515-4af6b1d462c2?w=1000", pointsPerVisit: 50, activeOffers: 1, tags: ["wellness"], gallery: genGallery("Wellness") },
    { name: "Iron & Ivory", category: "Grooming", description: "Precision fades and premium whiskey while you wait.", location: "The Quarter", distance: "0.5km", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000", pointsPerVisit: 50, activeOffers: 1, tags: ["grooming"], gallery: genGallery("Grooming") },
    { name: "Aria Atelier", category: "Fashion", description: "Minimalist fashion for the modern creator.", location: "Central Avenue", distance: "0.3km", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000", pointsPerVisit: 50, activeOffers: 4, tags: ["fashion"], gallery: genGallery("Fashion") },
    { name: "Zenith Brew", category: "Coffee", description: "Panoramic city views and single-origin beans.", location: "Summit Point", distance: "3.1km", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000", pointsPerVisit: 50, activeOffers: 2, tags: ["coffee", "work"], gallery: genGallery("Coffee") },
    { name: "Gilded Petal", category: "Beauty", description: "Botanical-infused facials and luxury skincare.", location: "Gardens East", distance: "1.5km", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000", pointsPerVisit: 50, activeOffers: 1, tags: ["beauty", "wellness"], gallery: genGallery("Beauty") },
    { name: "Solstice Social", category: "Brunch", description: "Sun-drenched patio and bottomless mimosas.", location: "South Shore", distance: "5.0km", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1000", pointsPerVisit: 50, activeOffers: 2, tags: ["brunch", "nightlife"], gallery: genGallery("Brunch") },
    { name: "Titan’s Table", category: "Food", description: "Huge portions and viking-inspired feast hall.", location: "Nordic District", distance: "2.2km", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000", pointsPerVisit: 50, activeOffers: 3, tags: ["food"], gallery: genGallery("Food") },
    { name: "The Quiet Quill", category: "Coffee", description: "Silent library-vibes and great Wi-Fi.", location: "Scholar’s Row", distance: "1.2km", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000", pointsPerVisit: 50, activeOffers: 1, tags: ["coffee", "work"], gallery: genGallery("Coffee") },
    { name: "Midnight Marquee", category: "Nightlife", description: "Vintage cinema converted into a jazz club.", location: "Classic District", distance: "0.9km", image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=1000", pointsPerVisit: 50, activeOffers: 2, tags: ["nightlife"], gallery: genGallery("Nightlife") },
    { name: "Aura Nails", category: "Beauty", description: "Color-changing manicures and chilled vibes.", location: "Neon Plaza", distance: "0.6km", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1000", pointsPerVisit: 50, activeOffers: 1, tags: ["beauty"], gallery: genGallery("Beauty") },
    { name: "Forge & Fabric", category: "Fashion", description: "Industrial-style streetwear and rugged accessories.", location: "Warehouse Way", distance: "1.8km", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000", pointsPerVisit: 50, activeOffers: 3, tags: ["fashion"], gallery: genGallery("Fashion") },
    { name: "Frost & Flour", category: "Brunch", description: "Artisanal ice cream and warm cookies.", location: "Central District", distance: "0.4km", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=1000", pointsPerVisit: 50, activeOffers: 2, tags: ["desserts"], gallery: genGallery("Brunch") },
    { name: "Veridian Spa", category: "Wellness", description: "Lush indoor forest and thermal springs.", location: "Eden Grove", distance: "2.7km", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000", pointsPerVisit: 50, activeOffers: 1, tags: ["wellness"], gallery: genGallery("Wellness") },
    { name: "The Sharp Edge", category: "Grooming", description: "Old school barber with a modern twist.", location: "Highlands", distance: "2.1km", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1000", pointsPerVisit: 50, activeOffers: 1, tags: ["grooming"], gallery: genGallery("Grooming") },
    { name: "Mizu Sushi", category: "Food", description: "Conveyor belt sushi in an underwater-themed room.", location: "Marina Wharf", distance: "1.3km", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000", pointsPerVisit: 50, activeOffers: 2, tags: ["food"], gallery: genGallery("Food") },
    { name: "Cloud Nine Coffee", category: "Coffee", description: "Everything is white, soft, and very caffeinated.", location: "Skyline Tower", distance: "3.5km", image: "https://images.unsplash.com/photo-1497933048642-fe8b8b7ed2f2?w=1000", pointsPerVisit: 50, activeOffers: 2, tags: ["coffee", "work"], gallery: genGallery("Coffee") },
    { name: "Pulse Boutique", category: "Fashion", description: "Neon-accented gear for active creators.", location: "Pulse Plaza", distance: "0.7km", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000", pointsPerVisit: 50, activeOffers: 3, tags: ["fashion"], gallery: genGallery("Fashion") },
    { name: "Truffle & Toast", category: "Brunch", description: "Luxurious eggs and truffle-infused everything.", location: "Oak Street", distance: "0.9km", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1000", pointsPerVisit: 50, activeOffers: 1, tags: ["brunch"], gallery: genGallery("Brunch") },
    { name: "Bonsai Bar", category: "Nightlife", description: "Miniature trees and giant cocktails.", location: "Harbour Side", distance: "1.2km", image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=1000", pointsPerVisit: 50, activeOffers: 4, tags: ["nightlife"], gallery: genGallery("Nightlife") },
    { name: "Pastel Parlor", category: "Brunch", description: "Macarons that look too good to eat.", location: "Gardens East", distance: "1.6km", image: "https://images.unsplash.com/photo-1559620191-030c62145d52?w=1000", pointsPerVisit: 50, activeOffers: 2, tags: ["desserts"], gallery: genGallery("Brunch") },
    { name: "Ethereal Echoes", category: "Fashion", description: "Handcrafted jewelry and flowing fabrics.", location: "Artistic Alley", distance: "0.6km", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000", pointsPerVisit: 50, activeOffers: 2, tags: ["fashion"], gallery: genGallery("Fashion") },
    { name: "Prism Hair", category: "Beauty", description: "Vibrant color experts and bold cuts.", location: "The Quarter", distance: "0.5km", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1000", pointsPerVisit: 50, activeOffers: 1, tags: ["beauty"], gallery: genGallery("Beauty") },
    { name: "Steam & Sip", category: "Coffee", description: "Victorian steampunk coffee house.", location: "Classic District", distance: "0.7km", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500", pointsPerVisit: 50, activeOffers: 2, tags: ["coffee", "work"], gallery: genGallery("Coffee") },
    { name: "The Grilling Ground", category: "Food", description: "Upscale BBQ in an urban garden.", location: "Meadow View", distance: "2.5km", image: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=500", pointsPerVisit: 50, activeOffers: 3, tags: ["food"], gallery: genGallery("Food") },
    { name: "Zen Den", category: "Wellness", description: "Tea ceremonies and complete silence.", location: "Peaceful Path", distance: "3.8km", image: "https://images.unsplash.com/photo-1545208393-216c7ad59645?w=1000", pointsPerVisit: 50, activeOffers: 1, tags: ["wellness"], gallery: genGallery("Wellness") },
    { name: "Urban Fade", category: "Grooming", description: "Fast, fresh, and very cool vibes.", location: "Metro Station", distance: "0.2km", image: "https://images.unsplash.com/photo-1521444470432-be521cab2bb3?w=1000", pointsPerVisit: 50, activeOffers: 2, tags: ["grooming"], gallery: genGallery("Grooming") },
    { name: "Velvet Vine", category: "Nightlife", description: "Sophisticated wine bar with live cello.", location: "Noble Square", distance: "1.1km", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1000", pointsPerVisit: 50, activeOffers: 3, tags: ["nightlife"], gallery: genGallery("Nightlife") },
];

export const mockUsers = [
    { username: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200", points: 450, level: "Silver", bio: "Just loving Cape Town vibes!", interests: ["coffee", "brunch", "nightlife"] },
    { username: "jessica_ct", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", points: 1200, level: "Gold", bio: "Coffee addict ☕\ufe0f", interests: ["coffee", "work spots", "desserts"] },
    { username: "mike_surfer", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200", points: 2100, level: "Platinum", bio: "Waves & Vibes", interests: ["nightlife", "outdoors", "fitness"] },
    { username: "foodie_sam", avatar: "https://images.unsplash.com/photo-1527980965255-d3b4e-e15d-4b67-bcd2-699d850ae446?w=200", points: 800, level: "Gold", bio: "Eating my way through CBD", interests: ["brunch", "desserts", "food"] },
    { username: "travel_kai", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", points: 150, level: "Silver", bio: "New in town", interests: ["outdoors", "coffee", "nightlife"] },
    { username: "fashion_mia", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", points: 950, level: "Gold", bio: "Always in style", interests: ["fashion", "beauty", "nightlife"] },
    { username: "wellness_will", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", points: 1300, level: "Gold", bio: "Mind, body, spirit", interests: ["wellness", "outdoors", "coffee"] },
    { username: "brunch_bella", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200", points: 600, level: "Silver", bio: "Weekends were made for mimosas", interests: ["brunch", "desserts", "food"] },
    { username: "groom_gabriel", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200", points: 400, level: "Silver", bio: "Keeping it sharp", interests: ["grooming", "fashion", "nightlife"] },
    { username: "sasha_nails", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200", points: 720, level: "Gold", bio: "Nail art is life 💅", interests: ["beauty", "art"] },
    { username: "tom_coffee", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200", points: 310, level: "Silver", bio: "Searching for the best crema", interests: ["coffee", "work"] },
    { username: "elena_fit", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200", points: 1850, level: "Gold", bio: "Fitness \u0026 Green Juice", interests: ["wellness", "outdoors"] },
];

export const mockPostsData: any[] = [];

// Helper to generate enriched posts
const generateEnrichedPosts = (count: number) => {
    const posts = [];
    const usersCount = mockUsers.length;
    const placesCount = fictionalPlaces.length;

    const captions = [
        "Exploring new corners of the city today. 🏙️",
        "This vibe is unmatched. ✨",
        "Hidden gem alert! 💎",
        "Can't get enough of this place.",
        "Quick visit turned into a whole afternoon. ☕️",
        "Weekend goals achieved. 🙌",
        "Treat yourself. Always.",
        "Current mood: obsessed. 😍",
        "Monday motivation found here.",
        "Golden hour at my favorite spot. 🌅",
        "The details here are incredible.",
        "New favorite discovery! 🌈",
        "Perfect afternoon vibes. 🍃",
        "Feeling inspired today. ✨",
        "Good coffee, good people, good day. ☕️",
        "Living my best life. 🥂",
        "The aesthetic is just... chefs kiss. 👌",
        "Needed this reset. 💆‍♀️",
        "Found my new local. 📍",
        "Style is a way to say who you are. 👗"
    ];

    const videoUrls = [
        "https://assets.mixkit.co/videos/preview/mixkit-coffee-being-poured-into-a-cup-3444-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-bartender-preparing-a-cocktail-4131-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-cooking-a-steak-4530-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-woman-practicing-yoga-under-a-tree-4355-large.mp4"
    ];

    for (let i = 0; i < count; i++) {
        const userIdx = Math.floor(Math.random() * usersCount);
        const placeIdx = Math.floor(Math.random() * placesCount);
        const place = fictionalPlaces[placeIdx];

        // 2 Images + 1 Video
        const media = [
            { type: "image", url: getUnsplash(place.category) },
            { type: "image", url: getUnsplash(place.category) },
            { type: "video", url: videoUrls[Math.floor(Math.random() * videoUrls.length)] }
        ];

        posts.push({
            userId: userIdx + 1,
            placeId: placeIdx + 1,
            caption: captions[Math.floor(Math.random() * captions.length)],
            tags: place.tags,
            likes: Math.floor(Math.random() * 200) + 10,
            comments: Math.floor(Math.random() * 25),
            media: media
        });
    }
    return posts;
};

mockPostsData.push(...generateEnrichedPosts(110));

export const venueSurveys = [
    {
        title: "Café / Coffee Shop Survey",
        description: "Tell us about your caffeine fix!",
        points: 150,
        questions: [
            { question: "How would you rate the coffee quality?", options: ["1", "2", "3", "4", "5"] },
            { question: "How friendly was the staff?", options: ["1", "2", "3", "4", "5"] },
            { question: "Was the service time reasonable?", options: ["Yes", "No"] },
            { question: "How clean was the space?", options: ["1", "2", "3", "4", "5"] },
            { question: "Did the café feel comfortable to sit and relax?", options: ["Yes", "No"] },
            { question: "Would you come back to work here?", options: ["Yes", "No"] },
            { question: "What did you order?", options: [] },
            { question: "Was pricing fair for what you received?", options: ["1", "2", "3", "4", "5"] },
            { question: "Would you recommend this café?", options: ["Yes", "No"] },
            { question: "What could be improved?", options: [] }
        ]
    },
    // ... rest of the surveys (kept for completeness)
];
