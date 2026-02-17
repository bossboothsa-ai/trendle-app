
// ============================================
// TRENDLE DEMO SHOWCASE DATA
// ============================================

export const DEMO_USERS = [
    {
        id: 101,
        username: "demo_user",
        displayName: "Alexander Thorne",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
        cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
        bio: "Explorer of urban vibes and hidden gems in Cape Town. Marketing lead by day, foodie by night. ☕🍕🍸",
        location: "Gardens, Cape Town",
        level: "Gold",
        points: 4250,
        followersCount: 842,
        followingCount: 315,
        joinedDate: "Feb 2024",
        socialLinks: { instagram: "alex_explorer", twitter: "a_thorne" },
        interests: ["coffee", "cocktails", "photography", "hiking"]
    },
    {
        id: 102,
        username: "mia_travels",
        displayName: "Mia van der Walt",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
        bio: "Student nomad. Always looking for the best study spots and caffeine fixes. 🎓☕",
        location: "Rondebosch, Cape Town",
        level: "Silver",
        points: 1200,
        followersCount: 520,
        followingCount: 410,
        joinedDate: "Jan 2025"
    },
    {
        id: 103,
        username: "leo_creatives",
        displayName: "Leo Dube",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        bio: "Visual storyteller. Capturing the soul of Mother City one frame at a time. 📸✨",
        location: "Seapoint, Cape Town",
        level: "Platinum",
        points: 8500,
        followersCount: 15400,
        followingCount: 890,
        joinedDate: "May 2023"
    },
    {
        id: 104,
        username: "sarah_styles",
        displayName: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
        bio: "Fashion design student. Lover of local boutiques and thrifting. 👗♻️",
        location: "Woodstock, Cape Town",
        level: "Bronze",
        points: 450,
        followersCount: 320,
        followingCount: 280,
        joinedDate: "Mar 2026"
    },
    {
        id: 105,
        username: "dj_pulse",
        displayName: "Kevin 'Pulse' Smith",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
        bio: "Chasing the best beats and the coolest bars. Resident at Sunsets CT. 🎧🍸",
        location: "Greenpoint, Cape Town",
        level: "Gold",
        points: 3900,
        followersCount: 2800,
        followingCount: 1200,
        joinedDate: "Jun 2024"
    },
    {
        id: 106,
        username: "yoga_zane",
        displayName: "Zane Richards",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
        bio: "Mindfulness and movement. Finding peace in the heart of the city. 🧘‍♂️🌿",
        location: "Claremont, Cape Town",
        level: "Silver",
        points: 2100,
        followersCount: 1200,
        followingCount: 600,
        joinedDate: "Oct 2024"
    },
    {
        id: 107,
        username: "tasha_bites",
        displayName: "Natasha Khoza",
        avatar: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=800&q=80",
        bio: "Full-time foodie, part-time critic. Will travel for the perfect croissant. 🥐🍷",
        location: "Vredehoek, Cape Town",
        level: "Platinum",
        points: 7200,
        followersCount: 8900,
        followingCount: 450,
        joinedDate: "Dec 2023"
    },
    {
        id: 108,
        username: "urban_josh",
        displayName: "Josh Miller",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
        bio: "Urban planning nerd. Documenting Cape Town architecture. 🏛️🚶‍♂️",
        location: "City Bowl, Cape Town",
        level: "Bronze",
        points: 300,
        followersCount: 150,
        followingCount: 300,
        joinedDate: "Jan 2026"
    },
    {
        id: 109,
        username: "surf_sky",
        displayName: "Skylar Reed",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
        bio: "Ocean soul. Surfer, skater, and sunset seeker. 🏄‍♀️🌅",
        location: "Muizenberg, Cape Town",
        level: "Gold",
        points: 4800,
        followersCount: 5600,
        followingCount: 700,
        joinedDate: "Jul 2024"
    },
    {
        id: 110,
        username: "lara_glows",
        displayName: "Lara Abrahams",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
        bio: "Beauty enthusiast. Testing all the best salons in town. 💅✨",
        location: "Constantia, Cape Town",
        level: "Silver",
        points: 1800,
        followersCount: 2300,
        followingCount: 1100,
        joinedDate: "Sep 2024"
    }
];

const DEFAULT_TASKS = [
    { id: 501, title: "Capture the Vibe", description: "Share a moment and describe the energy.", points: 50, deadline: "Today" },
    { id: 502, title: "Playlist Energy", description: "Rate today's music energy.", points: 30, deadline: "Today" },
    { id: 503, title: "Barista's Choice", description: "Try a recommended item and review it.", points: 40, deadline: "Tomorrow" }
];

const DEFAULT_SURVEY = {
    id: 401,
    title: "Experience Survey",
    questions: [
        { type: "rating", question: "How welcoming was the staff?", options: null },
        { type: "choice", question: "Would you return with friends?", options: ["Yes", "Maybe", "No"] },
        { type: "choice", question: "How likely are you to recommend us?", options: ["Very Likely", "Likely", "Unlikely"] },
        { type: "text", question: "What could improve your experience?", options: null }
    ]
};

export const DEMO_BUSINESSES = [
    // COFFEE
    {
        id: 201,
        name: "Artisan Brew Lab",
        category: "Coffee",
        description: "Precision brewing and artisanal pastries in a sun-drenched industrial space.",
        location: "Gardens, Cape Town",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
        hours: "07:00 - 18:00",
        pointsPerVisit: 50,
        activeRewards: [{ id: 301, title: "Free Cappuccino", points: 500 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 202,
        name: "The Roasted Bean",
        category: "Coffee",
        description: "Small-batch roastery with a focus on ethical sourcing and bold flavors.",
        location: "De Waterkant, Cape Town",
        image: "https://images.unsplash.com/photo-1442119020942-835691461973?w=1200&q=80",
        hours: "07:30 - 17:00",
        pointsPerVisit: 40,
        activeRewards: [{ id: 302, title: "Espresso Shot", points: 200 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 203,
        name: "Coastal Coffee Co",
        category: "Coffee",
        description: "Ocean-side cafe serving the best flat white in the Atlantic Seaboard.",
        location: "Seapoint, Cape Town",
        image: "https://images.unsplash.com/photo-1501339817302-4476af5a17d3?w=1200&q=80",
        hours: "06:30 - 16:00",
        pointsPerVisit: 30,
        activeRewards: [{ id: 303, title: "Scone & Jam", points: 400 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 204,
        name: "Morning Glory Hub",
        category: "Coffee",
        description: "Bright, plant-filled sanctuary for morning reflection and healthy bowls.",
        location: "Greenpoint, Cape Town",
        image: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=1200&q=80",
        hours: "07:00 - 15:00",
        pointsPerVisit: 50,
        activeRewards: [{ id: 304, title: "Oat Milk Upgrade", points: 150 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 205,
        name: "Urban Roast",
        category: "Coffee",
        description: "Serious coffee for the city bowl's working crowd. Precision brewing.",
        location: "City Bowl, Cape Town",
        image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&q=80",
        hours: "08:00 - 17:00",
        pointsPerVisit: 60,
        activeRewards: [{ id: 305, title: "Pastry of Choice", points: 450 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },

    // EAT
    {
        id: 206,
        name: "Vineyard Table",
        category: "Eat",
        description: "Modern South African cuisine with seasonal local ingredients and wine pairings.",
        location: "Constantia, Cape Town",
        image: "https://images.unsplash.com/photo-1550966848-01ca3047f318?w=1200&q=80",
        hours: "12:00 - 22:00",
        pointsPerVisit: 100,
        activeRewards: [{ id: 306, title: "Signature Dessert", points: 800 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 207,
        name: "The Zen Garden",
        category: "Eat",
        description: "Plant-forward dining in a relaxed setting. Vibrant and delicious.",
        location: "Kloof Street, Cape Town",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
        hours: "10:00 - 21:00",
        pointsPerVisit: 70,
        activeRewards: [{ id: 307, title: "Fresh Juice", points: 350 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 208,
        name: "Atlantic Grill",
        category: "Eat",
        description: "Fresh seafood caught daily and grilled over open flames.",
        location: "Camps Bay, Cape Town",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
        hours: "12:00 - 23:00",
        pointsPerVisit: 120,
        activeRewards: [{ id: 308, title: "Platter Upgrade", points: 1200 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 209,
        name: "Street Soul",
        category: "Eat",
        description: "Global street food in a trendy, industrial Woodstock setting.",
        location: "Woodstock, Cape Town",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
        hours: "11:00 - 20:00",
        pointsPerVisit: 50,
        activeRewards: [{ id: 309, title: "Taco Trio", points: 600 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 210,
        name: "Mama Africa Modern",
        category: "Eat",
        description: "Authentic local flavors served with a sleek modern twist.",
        location: "City Bowl, Cape Town",
        image: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=1200&q=80",
        hours: "11:00 - 22:00",
        pointsPerVisit: 80,
        activeRewards: [{ id: 310, title: "Traditional Platter", points: 900 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },

    // DRINK
    {
        id: 211,
        name: "Botanical Bar",
        category: "Drink",
        description: "Craft gin specialists using unique local fynbos botanicals.",
        location: "Bree Street, Cape Town",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80",
        hours: "16:00 - 01:00",
        pointsPerVisit: 80,
        activeRewards: [{ id: 311, title: "Classic G&T", points: 600 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 212,
        name: "Cloud 9 Lounge",
        category: "Drink",
        description: "Rooftop lounge with 360-degree views and premium DJ sets.",
        location: "De Waterkant, Cape Town",
        image: "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=1200&q=80",
        hours: "15:00 - 02:00",
        pointsPerVisit: 150,
        activeRewards: [{ id: 312, title: "Signature Martini", points: 750 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 213,
        name: "The Anchor Pub",
        category: "Drink",
        description: "Classic surf pub vibes with a massive craft beer selection.",
        location: "Muizenberg, Cape Town",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80",
        hours: "11:00 - 00:00",
        pointsPerVisit: 40,
        activeRewards: [{ id: 313, title: "Craft Pint", points: 400 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 214,
        name: "Velvet Jazz Bar",
        category: "Drink",
        description: "Speakeasy lounge featuring live jazz and prohibition-era cocktails.",
        location: "Gardens, Cape Town",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
        hours: "18:00 - 02:00",
        pointsPerVisit: 90,
        activeRewards: [{ id: 314, title: "Old Fashioned", points: 800 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 215,
        name: "Copper & Oak",
        category: "Drink",
        description: "Sophisticated whiskey bar with an extensive rare malt library.",
        location: "Seapoint, Cape Town",
        image: "https://images.unsplash.com/photo-1527661591475-527312dd6505?w=1200&q=80",
        hours: "17:00 - 01:00",
        pointsPerVisit: 100,
        activeRewards: [{ id: 315, title: "Whiskey Flight", points: 1500 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },

    // PLAY
    {
        id: 216,
        name: "Surf Collective",
        category: "Play",
        description: "Premium surf lessons and equipment hire for all skill levels.",
        location: "Blouberg, Cape Town",
        image: "https://images.unsplash.com/photo-1502680399488-2a6574c5d41b?w=1200&q=80",
        hours: "08:00 - 18:00",
        pointsPerVisit: 200,
        activeRewards: [{ id: 316, title: "Board Hire (2hr)", points: 1000 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 217,
        name: "Game Night Cafe",
        category: "Play",
        description: "Hundreds of board games and cozy vibes for an immersive evening.",
        location: "Kloof Street, Cape Town",
        image: "https://images.unsplash.com/photo-1610890733551-51890f63665a?w=1200&q=80",
        hours: "10:00 - 22:00",
        pointsPerVisit: 50,
        activeRewards: [{ id: 317, title: "Cover Charge Waived", points: 300 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 218,
        name: "National Park Hikes",
        category: "Play",
        description: "Guided tours through the world-famous Table Mountain trails.",
        location: "Newlands, Cape Town",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
        hours: "06:00 - 18:00",
        pointsPerVisit: 250,
        activeRewards: [{ id: 318, title: "Sunrise Tour", points: 2000 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 219,
        name: "Zipline Canopy CT",
        category: "Play",
        description: "Adrenaline-fueled canopy tours with incredible valley views.",
        location: "Constantia, Cape Town",
        image: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=1200&q=80",
        hours: "09:00 - 17:00",
        pointsPerVisit: 300,
        activeRewards: [{ id: 319, title: "GoPro Footage", points: 1500 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 220,
        name: "Waterfront Mini-Golf",
        category: "Play",
        description: "Neon-lit mini-golf fun for groups and families.",
        location: "V&A Waterfront, Cape Town",
        image: "https://images.unsplash.com/photo-1523313222784-242643a68270?w=1200&q=80",
        hours: "10:00 - 23:00",
        pointsPerVisit: 100,
        activeRewards: [{ id: 320, title: "Extra Round", points: 500 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },

    // SHOP
    {
        id: 221,
        name: "Retro Revival",
        category: "Shop",
        description: "Curated vintage fashion and accessories from every decade.",
        location: "Observatory, Cape Town",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
        hours: "10:00 - 18:00",
        pointsPerVisit: 50,
        activeRewards: [{ id: 321, title: "R100 Voucher", points: 1000 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 222,
        name: "The Maker's Hub",
        category: "Shop",
        description: "Handmade local goods, ceramics, and organic beauty products.",
        location: "Woodstock, Cape Town",
        image: "https://images.unsplash.com/photo-1534452203294-49c8913721b2?w=1200&q=80",
        hours: "09:00 - 17:00",
        pointsPerVisit: 40,
        activeRewards: [{ id: 322, title: "Canvas Tote", points: 400 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 223,
        name: "Luxe Boutique",
        category: "Shop",
        description: "Exclusive designer labels and contemporary high-end fashion.",
        location: "Seapoint, Cape Town",
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80",
        hours: "10:00 - 19:00",
        pointsPerVisit: 150,
        activeRewards: [{ id: 323, title: "Personal Stylist Session", points: 5000 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 224,
        name: "Thread & Leather",
        category: "Shop",
        description: "Bespoke leather goods and handcrafted jewelry collective.",
        location: "Bree Street, Cape Town",
        image: "https://images.unsplash.com/photo-1582559930331-50e56214041d?w=1200&q=80",
        hours: "10:00 - 18:00",
        pointsPerVisit: 80,
        activeRewards: [{ id: 324, title: "Leather Care Kit", points: 600 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 225,
        name: "Sneaker Grail",
        category: "Shop",
        description: "Exclusive sneaker boutique with the rarest hype drops.",
        location: "Loop Street, Cape Town",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
        hours: "10:00 - 19:00",
        pointsPerVisit: 200,
        activeRewards: [{ id: 325, title: "Shoe Shield Treatment", points: 350 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },

    // GLOW
    {
        id: 226,
        name: "Prism Hair Studio",
        category: "Glow",
        description: "Expert colorists and high-fashion styling specialists.",
        location: "Gardens, Cape Town",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80",
        hours: "09:00 - 18:00",
        pointsPerVisit: 200,
        activeRewards: [{ id: 326, title: "Deep Treatment", points: 900 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 227,
        name: "Neon Nails",
        category: "Glow",
        description: "Creative nail art and luxury manicures in a trendy setting.",
        location: "Seapoint, Cape Town",
        image: "https://images.unsplash.com/photo-1604654894610-df490998710c?w=1200&q=80",
        hours: "09:00 - 19:00",
        pointsPerVisit: 80,
        activeRewards: [{ id: 327, title: "Nail Art Upgrade", points: 400 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 228,
        name: "Pure Skin Spa",
        category: "Glow",
        description: "Holistic facials and stress-relief massages using organic oils.",
        location: "Constantia, Cape Town",
        image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1200&q=80",
        hours: "10:00 - 17:00",
        pointsPerVisit: 250,
        activeRewards: [{ id: 328, title: "Express Facial", points: 1500 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 229,
        name: "Sharp Barber Co",
        category: "Glow",
        description: "Traditional grooming for the modern man. Sharp fades and hot towel shaves.",
        location: "Bree Street, Cape Town",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80",
        hours: "08:00 - 20:00",
        pointsPerVisit: 100,
        activeRewards: [{ id: 329, title: "Hot Towel Shave", points: 800 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 230,
        name: "Aura Beauty & Brows",
        category: "Glow",
        description: "Specialized brow shaping and full-service beauty transformations.",
        location: "Claremont, Cape Town",
        image: "https://images.unsplash.com/photo-1522335789253-06109963266b?w=1200&q=80",
        hours: "09:00 - 18:00",
        pointsPerVisit: 150,
        activeRewards: [{ id: 330, title: "Brow Tint", points: 500 }],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    }
];

// Generate 50 posts with varied timestamps and content
export const DEMO_POSTS = Array.from({ length: 50 }).map((_, i) => {
    const user = DEMO_USERS[i % 10];
    const biz = DEMO_BUSINESSES[i % 30];
    const category = biz.category;

    let caption = `Loved my visit to ${biz.name}! The vibes are perfect. #Trendle #CapeTown`;
    if (category === "Coffee") caption = `Best caffeine fix at ${biz.name}. The latte art is incredible! ☕✨ #CoffeeLovers`;
    if (category === "Drink") caption = `Sipping on perfection at ${biz.name}. The sunset views are unbeatable. 🍸🌆 #Nightlife`;
    if (category === "Eat") caption = `Best meal I've had in a while at ${biz.name}. Highy recommend! 🍕🍴 #CTFoodie`;
    if (category === "Glow") caption = `Feeling fresh after my session at ${biz.name}. 💅✨ #GlowUp #SelfCare`;

    return {
        id: 601 + i,
        userId: user.id,
        author: user,
        media: [{ type: 'image', url: biz.image }], // Using biz image as post media for visual consistency
        caption,
        placeId: biz.id,
        place: biz,
        likesCount: Math.floor(Math.random() * 500) + 50,
        commentsCount: Math.floor(Math.random() * 50) + 5,
        createdAt: new Date(Date.now() - i * 3600000 * 2).toISOString(), // Staggered by 2 hours
        hasLiked: i % 3 === 0
    };
});

export const DEMO_COMMENTS = (postId: number) => [
    { id: 801, userId: 102, user: DEMO_USERS[1], text: "Wow, need to go there! ✨", createdAt: "5m ago" },
    { id: 802, userId: 104, user: DEMO_USERS[3], text: "Best vibes in town for sure.", createdAt: "10m ago" },
    { id: 803, userId: 106, user: DEMO_USERS[5], text: "Added to my list! 📍", createdAt: "1h ago" },
    { id: 804, userId: 108, user: DEMO_USERS[7], text: "The service here is top-notch. 🏆", createdAt: "3h ago" },
    { id: 805, userId: 109, user: DEMO_USERS[8], text: "Incredible views! 😍", createdAt: "5h ago" }
];

export const DEMO_STORIES = Array.from({ length: 15 }).map((_, i) => ({
    id: 901 + i,
    userId: DEMO_USERS[i % 10].id,
    user: DEMO_USERS[i % 10],
    media: [{ type: 'image', url: DEMO_BUSINESSES[i % 30].image }],
    createdAt: new Date(Date.now() - i * 1800000).toISOString(),
    caption: "Live from the city! 🏙️"
}));

export const DEMO_NOTIFICATIONS = [
    { id: 1001, type: "like", userId: 102, user: DEMO_USERS[1], text: "liked your post", createdAt: "2m ago" },
    { id: 1002, type: "comment", userId: 103, user: DEMO_USERS[2], text: "commented: 'Love this vibe!'", createdAt: "15m ago" },
    { id: 1003, type: "follow", userId: 105, user: DEMO_USERS[4], text: "started following you", createdAt: "1h ago" },
    { id: 1004, type: "reward", userId: 106, user: DEMO_BUSINESSES[0], text: "Points earned for check-in", createdAt: "2h ago" }
];

export const DEMO_WALKTHROUGH = {
    wallet: {
        points: 4250,
        history: [
            { id: 1, amount: 50, reason: "Check-in at Artisan Brew Lab", createdAt: "Today" },
            { id: 2, amount: 100, reason: "Completed Survey: Experience Survey", createdAt: "Yesterday" },
            { id: 3, amount: 60, reason: "Task: Capture the Vibe", createdAt: "2 days ago" },
            { id: 4, amount: 500, reason: "Bonus for Gold Level achievement", createdAt: "1 week ago" }
        ],
        redemptions: [
            { id: 1, title: "Free Cappuccino", points: 500, status: "completed", date: "Last week" },
            { id: 2, title: "Signature Dessert", points: 800, status: "pending", date: "Today" }
        ]
    }
};
