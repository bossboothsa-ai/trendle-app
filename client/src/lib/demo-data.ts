
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

export const DEMO_BUSINESSES = [
    // COFFEE
    {
        id: 201,
        name: "The Steamery Roast",
        category: "Coffee",
        description: "Industrial chic cafe serving small-batch roasted beans and artisanal pastries. The perfect co-working vibe.",
        location: "Gardens, Cape Town",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
        logo: "https://images.unsplash.com/photo-1559703248-dcaaec9fab78?w=200&q=80",
        hours: "07:00 - 18:00",
        pointsPerVisit: 50,
        distance: "0.2km",
        tags: ["wifi", "specialty coffee", "pet-friendly"],
        activeRewards: [
            { id: 301, title: "Free Cappuccino", points: 500, description: "Redeem for any standard size cappuccino." },
            { id: 302, title: "Pastry Upgrade", points: 250, description: "Upgrade your standard croissant to an almond or chocolate one." }
        ],
        surveys: [
            {
                id: 401,
                title: "Morning Vibe Check",
                questions: [
                    { type: "rating", question: "How would you rate the music energy today?", options: null },
                    { type: "choice", question: "Was your order correct and timely?", options: ["Yes", "Minor delay", "Incorrect order"] },
                    { type: "text", question: "What's one thing we can do to make your stay better?", options: null }
                ]
            }
        ],
        tasks: [
            { id: 501, title: "Latte Art Moment", description: "Snap a photo of your latte art and tag us.", points: 60, deadline: "Today" },
            { id: 502, title: "Loyalty Sprint", description: "Check-in 3 mornings in a row.", points: 200, deadline: "Next 3 days" }
        ]
    },
    {
        id: 202,
        name: "Origin Hearth",
        category: "Coffee",
        description: "Traditional roasting meets modern brewing. Known for our signature dark roast.",
        location: "De Waterkant, Cape Town",
        image: "https://images.unsplash.com/photo-1442119020942-835691461973?w=1200&q=80",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=OH",
        hours: "07:30 - 17:00",
        pointsPerVisit: 40,
        distance: "1.5km",
        tags: ["roastery", "quiet", "outdoor seating"]
    },
    {
        id: 203,
        name: "Brew & Co",
        category: "Coffee",
        description: "Your friendly neighborhood spot with the best flat white in the city.",
        location: "Seapoint, Cape Town",
        image: "https://images.unsplash.com/photo-1501339817302-4476af5a17d3?w=1200&q=80",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=BC",
        hours: "06:30 - 16:00",
        pointsPerVisit: 30,
        distance: "2.1km",
        tags: ["beachfront", "quick service"]
    },
    {
        id: 204,
        name: "Morning Glory",
        category: "Coffee",
        description: "A bright, plant-filled sanctuary for morning reflecton and great breakfast bowls.",
        location: "Greenpoint, Cape Town",
        image: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=1200&q=80",
        hours: "07:00 - 15:00",
        pointsPerVisit: 50,
        distance: "0.8km",
        tags: ["vegan friendly", "instaworthy"]
    },
    {
        id: 205,
        name: "The Bean Counter",
        category: "Coffee",
        description: "Serious coffee for serious people. Precision brewing at its finest.",
        location: "City Bowl, Cape Town",
        image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&q=80",
        hours: "08:00 - 17:00",
        pointsPerVisit: 60,
        distance: "1.1km",
        tags: ["quiet", "specialty"]
    },

    // EAT
    {
        id: 206,
        name: "Table & Vine",
        category: "Eat",
        description: "Modern South African cuisine with a focus on seasonal, local ingredients and wine pairings.",
        location: "Constantia, Cape Town",
        image: "https://images.unsplash.com/photo-1550966848-01ca3047f318?w=1200&q=80",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=TV",
        hours: "12:00 - 22:00",
        pointsPerVisit: 100,
        distance: "8km",
        tags: ["fine dining", "wine garden", "romantic"],
        activeRewards: [
            { id: 303, title: "Free Dessert", points: 800, description: "Enjoy any dessert on the menu with your main meal." },
            { id: 304, title: "Wine Paring Upgrade", points: 400, description: "Add a premium wine pairing to your tasting menu." }
        ]
    },
    {
        id: 207,
        name: "The Green Room",
        category: "Eat",
        description: "Plant-forward dining in a relaxed, garden-like setting. Healthy, vibrant, and delicious.",
        location: "Kloof Street, Cape Town",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
        hours: "10:00 - 21:00",
        pointsPerVisit: 70,
        distance: "0.5km",
        tags: ["vegetarian", "sustainable", "cocktails"]
    },
    {
        id: 208,
        name: "Coastal Grill",
        category: "Eat",
        description: "Fresh seafood caught daily, grilled over open flames. Best views of the Atlantic.",
        location: "Camps Bay, Cape Town",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
        hours: "12:00 - 23:00",
        pointsPerVisit: 120,
        distance: "4.5km",
        tags: ["seafood", "sunset views", "upscale"]
    },
    {
        id: 209,
        name: "Urban Plate",
        category: "Eat",
        description: "Global street food inspired dishes in a trendy industrial setting.",
        location: "Woodstock, Cape Town",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
        hours: "11:00 - 20:00",
        pointsPerVisit: 50,
        distance: "3.2km",
        tags: ["casual", "craft beer", "community"]
    },
    {
        id: 210,
        name: "Mzansi Kitchen",
        category: "Eat",
        description: "Authentic local flavors served with a modern twist. Best malva pudding in town.",
        location: "City Bowl, Cape Town",
        image: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=1200&q=80",
        hours: "11:00 - 22:00",
        pointsPerVisit: 80,
        distance: "0.9km",
        tags: ["local cuisine", "family friendly"]
    },

    // DRINK
    {
        id: 211,
        name: "The Gin Box",
        category: "Drink",
        description: "An intimate bar specializing in South African craft gins and bespoke cocktails.",
        location: "Bree Street, Cape Town",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80",
        hours: "16:00 - 01:00",
        pointsPerVisit: 80,
        distance: "1.0km",
        tags: ["craft gin", "intimate", "late night"],
        activeRewards: [
            { id: 305, title: "Signature G&T", points: 600, description: "Redeem for any signature gin and tonic." }
        ]
    },
    {
        id: 212,
        name: "Skybar CT",
        category: "Drink",
        description: "Rooftop lounge with 360-degree views of Table Mountain and the harbor.",
        location: "De Waterkant, Cape Town",
        image: "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=1200&q=80",
        hours: "15:00 - 02:00",
        pointsPerVisit: 150,
        distance: "1.6km",
        tags: ["rooftop", "DJ sets", "luxury"]
    },
    {
        id: 213,
        name: "The Rusty Anchor",
        category: "Drink",
        description: "A classic pub vibe with a wide selection of local and international craft beers.",
        location: "Muizenberg, Cape Town",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80",
        hours: "11:00 - 00:00",
        pointsPerVisit: 40,
        distance: "18km",
        tags: ["craft beer", "pool tables", "casual"]
    },
    {
        id: 214,
        name: "Moonlight Lounge",
        category: "Drink",
        description: "Speakeasy style lounge with curated jazz playlists and classic cocktails.",
        location: "Gardens, Cape Town",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
        hours: "18:00 - 02:00",
        pointsPerVisit: 90,
        distance: "0.4km",
        tags: ["speakeasy", "jazz", "exclusive"]
    },
    {
        id: 215,
        name: "Barrel & Oak",
        category: "Drink",
        description: "Whiskey and cigar bar with an extensive library of single malts.",
        location: "Seapoint, Cape Town",
        image: "https://images.unsplash.com/photo-1527661591475-527312dd6505?w=1200&q=80",
        hours: "17:00 - 01:00",
        pointsPerVisit: 100,
        distance: "2.5km",
        tags: ["whiskey", "cigar lounge", "sophisticated"]
    },

    // PLAY
    {
        id: 216,
        name: "Waves & Wind",
        category: "Play",
        description: "Surf and kitesurf school with professional instructors and premium equipment hire.",
        location: "Blouberg, Cape Town",
        image: "https://images.unsplash.com/photo-1502680399488-2a6574c5d41b?w=1200&q=80",
        hours: "08:00 - 18:00",
        pointsPerVisit: 200,
        distance: "12km",
        tags: ["surf school", "adventure", "beach"]
    },
    {
        id: 217,
        name: "The Boardroom",
        category: "Play",
        description: "Board game cafe with hundreds of titles and a cozy atmosphere.",
        location: "Kloof Street, Cape Town",
        image: "https://images.unsplash.com/photo-1610890733551-51890f63665a?w=1200&q=80",
        hours: "10:00 - 22:00",
        pointsPerVisit: 50,
        distance: "0.6km",
        tags: ["board games", "coffee", "community"]
    },
    {
        id: 218,
        name: "Mountain Escape",
        category: "Play",
        description: "Guided hiking tours uncovering the secret trails of Table Mountain National Park.",
        location: "Newlands, Cape Town",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
        hours: "06:00 - 18:00",
        pointsPerVisit: 250,
        distance: "6km",
        tags: ["hiking", "outdoors", "fitness"]
    },
    {
        id: 219,
        name: "ZipCT",
        category: "Play",
        description: "Adrenaline-fueled zipline canopy tours with breathtaking canyon views.",
        location: "Constantia, Cape Town",
        image: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=1200&q=80",
        hours: "09:00 - 17:00",
        pointsPerVisit: 300,
        distance: "9km",
        tags: ["adrenaline", "viewpoint", "group fun"]
    },
    {
        id: 220,
        name: "Glow Golf",
        category: "Play",
        description: "Neon-lit indoor mini-golf course with immersive themed holes.",
        location: "V&A Waterfront, Cape Town",
        image: "https://images.unsplash.com/photo-1523313222784-242643a68270?w=1200&q=80",
        hours: "10:00 - 23:00",
        pointsPerVisit: 100,
        distance: "2.3km",
        tags: ["mini golf", "indoor", "kids stay"]
    },

    // SHOP
    {
        id: 221,
        name: "Vintage Threads",
        category: "Shop",
        description: "Curated vintage and pre-loved fashion from every decade.",
        location: "Observatory, Cape Town",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
        hours: "10:00 - 18:00",
        pointsPerVisit: 50,
        distance: "4.8km",
        tags: ["vintage", "sustainable", "retro"]
    },
    {
        id: 222,
        name: "The Local Market",
        category: "Shop",
        description: "Support local artisans. Everything from handmade ceramics to organic skincare.",
        location: "Woodstock, Cape Town",
        image: "https://images.unsplash.com/photo-1534452203294-49c8913721b2?w=1200&q=80",
        hours: "09:00 - 17:00",
        pointsPerVisit: 40,
        distance: "3.5km",
        tags: ["local", "artisanal", "skincare"]
    },
    {
        id: 223,
        name: "Chic Boutique",
        category: "Shop",
        description: "High-end designer labels and contemporary fashion pieces.",
        location: "Seapoint, Cape Town",
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80",
        hours: "10:00 - 19:00",
        pointsPerVisit: 150,
        distance: "2.0km",
        tags: ["luxury", "designer", "modern"]
    },
    {
        id: 224,
        name: "Artisan Alley",
        category: "Shop",
        description: "A collective space for local jewelers and leather crafters.",
        location: "Bree Street, Cape Town",
        image: "https://images.unsplash.com/photo-1582559930331-50e56214041d?w=1200&q=80",
        hours: "10:00 - 18:00",
        pointsPerVisit: 80,
        distance: "1.2km",
        tags: ["jewelry", "leather", "handmade"]
    },
    {
        id: 225,
        name: "Sole Search",
        category: "Shop",
        description: "Exclusive sneaker boutique with the latest drops and rare collectibles.",
        location: "Loop Street, Cape Town",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
        hours: "10:00 - 19:00",
        pointsPerVisit: 200,
        distance: "1.3km",
        tags: ["sneakers", "streetwear", "hype"]
    },

    // GLOW
    {
        id: 226,
        name: "Mirror Mirror",
        category: "Glow",
        description: "Luxury hair styling and color specialists in a high-fashion setting.",
        location: "Gardens, Cape Town",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80",
        hours: "09:00 - 18:00",
        pointsPerVisit: 200,
        distance: "0.1km",
        tags: ["hair", "stylists", "luxury"],
        activeRewards: [
            { id: 306, title: "Deep Condition Upgrade", points: 500, description: "Add a luxury deep conditioning treatment to any service." }
        ]
    },
    {
        id: 227,
        name: "The Nail Bar",
        category: "Glow",
        description: "The ultimate destination for intricate nail art and classic manicures.",
        location: "Seapoint, Cape Town",
        image: "https://images.unsplash.com/photo-1604654894610-df490998710c?w=1200&q=80",
        hours: "09:00 - 19:00",
        pointsPerVisit: 80,
        distance: "2.4km",
        tags: ["nails", "art", "pamper"]
    },
    {
        id: 228,
        name: "Skin & Soul",
        category: "Glow",
        description: "Holistic skincare clinic specializing in organic facials and stress-relieving massages.",
        location: "Constantia, Cape Town",
        image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1200&q=80",
        hours: "10:00 - 17:00",
        pointsPerVisit: 250,
        distance: "9.5km",
        tags: ["facials", "massage", "organic"]
    },
    {
        id: 229,
        name: "Barber & Bloom",
        category: "Glow",
        description: "Traditional barbering with a modern edge. Sharp cuts and smooth shaves.",
        location: "Bree Street, Cape Town",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80",
        hours: "08:00 - 20:00",
        pointsPerVisit: 100,
        distance: "1.1km",
        tags: ["barber", "grooming", "sharp"]
    },
    {
        id: 230,
        name: "Velvet Salon",
        category: "Glow",
        description: "All-in-one beauty destination from brow threading to complete makeovers.",
        location: "Claremont, Cape Town",
        image: "https://images.unsplash.com/photo-1522335789253-06109963266b?w=1200&q=80",
        hours: "09:00 - 18:00",
        pointsPerVisit: 150,
        distance: "7km",
        tags: ["makeup", "brows", "full service"]
    }
];

export const DEMO_POSTS = [
    {
        id: 601,
        userId: 103, // Leo
        author: DEMO_USERS.find(u => u.id === 103),
        media: [{ type: 'image', url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80" }],
        caption: "The morning light at The Steamery is unmatched. Best espresso in Gardens. ☕✨ #Steamery #CapeTownCoffee",
        placeId: 201,
        place: DEMO_BUSINESSES.find(b => b.id === 201),
        likesCount: 145,
        commentsCount: 12,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
        hasLiked: true
    },
    {
        id: 602,
        userId: 107, // Tasha
        author: DEMO_USERS.find(u => u.id === 107),
        media: [{ type: 'image', url: "https://images.unsplash.com/photo-1550966848-01ca3047f318?w=800&q=80" }],
        caption: "Vineyard views and incredible food. Constantia has outdone itself today. 🍷🍴 #TableAndVine #FoodieCT",
        placeId: 206,
        place: DEMO_BUSINESSES.find(b => b.id === 206),
        likesCount: 382,
        commentsCount: 24,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        hasLiked: false
    },
    {
        id: 603,
        userId: 105, // Kevin
        author: DEMO_USERS.find(u => u.id === 105),
        media: [{ type: 'image', url: "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&q=80" }],
        caption: "Weekend mode engaged at Skybar. Come through for the sunset! 🍸🌆 #SkybarCT #MotherCityVibes",
        placeId: 212,
        place: DEMO_BUSINESSES.find(b => b.id === 212),
        likesCount: 215,
        commentsCount: 8,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        hasLiked: true
    },
    {
        id: 604,
        userId: 109, // Skylar
        author: DEMO_USERS.find(u => u.id === 109),
        media: [{ type: 'image', url: "https://images.unsplash.com/photo-1502680399488-2a6574c5d41b?w=800&q=80" }],
        caption: "Morning swell at Blouberg. Nothing beats this feeling. 🏄‍♀️🌊 #SurfLife #WavesAndWind",
        placeId: 216,
        place: DEMO_BUSINESSES.find(b => b.id === 216),
        likesCount: 540,
        commentsCount: 42,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
        hasLiked: false
    },
    {
        id: 605,
        userId: 110, // Lara
        author: DEMO_USERS.find(u => u.id === 110),
        media: [{ type: 'image', url: "https://images.unsplash.com/photo-1604654894610-df490998710c?w=800&q=80" }],
        caption: "Obsessed with this nail art! The Nail Bar never misses. 💅✨ #NailArt #GlowMode",
        placeId: 227,
        place: DEMO_BUSINESSES.find(b => b.id === 227),
        likesCount: 165,
        commentsCount: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    },
    // Add more to reach ~30 posts in the next step or expand here
    // Generating a loop for variety
    ...Array.from({ length: 25 }).map((_, i) => ({
        id: 700 + i,
        userId: DEMO_USERS[i % 10].id,
        author: DEMO_USERS[i % 10],
        media: [{ type: 'image', url: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=800&q=80` }], // Placeholder-ish
        caption: `Having a blast at ${DEMO_BUSINESSES[i % 30].name}! Highly recommend checking this place out. #Trendle #CapeTown`,
        placeId: DEMO_BUSINESSES[i % 30].id,
        place: DEMO_BUSINESSES[i % 30],
        likesCount: Math.floor(Math.random() * 200) + 10,
        commentsCount: Math.floor(Math.random() * 20),
        createdAt: new Date(Date.now() - (i + 1) * 3600000 * 3).toISOString(), // Staggered by 3 hours
        hasLiked: i % 2 === 0
    }))
];

export const DEMO_COMMENTS = (postId: number) => [
    { id: 801, userId: 102, user: DEMO_USERS[1], text: "Wow, need to go there!", createdAt: "5m ago" },
    { id: 802, userId: 104, user: DEMO_USERS[3], text: "Best coffee in town for sure.", createdAt: "10m ago" },
    { id: 803, userId: 106, user: DEMO_USERS[5], text: "Added to my list!", createdAt: "1h ago" }
];

export const DEMO_NOTIFICATIONS = [
    { id: 901, type: "like", userId: 102, user: DEMO_USERS[1], text: "liked your post", createdAt: "2m ago" },
    { id: 902, type: "comment", userId: 103, user: DEMO_USERS[2], text: "commented: 'Love this vibe!'", createdAt: "15m ago" },
    { id: 903, type: "follow", userId: 105, user: DEMO_USERS[4], text: "started following you", createdAt: "1h ago" }
];

export const DEMO_WALKTHROUGH = {
    wallet: {
        points: 4250,
        history: [
            { id: 1, amount: 50, reason: "Check-in at The Steamery", createdAt: "Today" },
            { id: 2, amount: 100, reason: "Completed Survey: Morning Vibe Check", createdAt: "Yesterday" },
            { id: 3, amount: 60, reason: "Task: Latte Art Moment", createdAt: "2 days ago" }
        ],
        redemptions: [
            { id: 1, title: "Free Cappuccino", points: 500, status: "completed", date: "Last week" }
        ]
    }
};
