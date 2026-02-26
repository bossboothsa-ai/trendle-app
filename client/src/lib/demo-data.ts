// TRENDLE DEMO SHOWCASE DATA
// ============================================

export const isInDemoMode = () => {
    if (typeof window === "undefined") return false;
    
    // Support soft launch mode as a "live" feeling demo
    if (process.env.APP_MODE === 'soft_launch') return true;

    const isDemoHost =
        window.location.hostname.includes("github.io") ||
        window.location.hostname.includes("localhost") ||
        window.location.hostname.includes("onrender.com");
    return localStorage.getItem("TRENDLE_DEMO_MODE") === "true" || isDemoHost;
};

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
        points: 850,
        followersCount: 842,
        followingCount: 315,
        joinedDate: "Feb 2024",
        socialLinks: { instagram: "alex_explorer", twitter: "a_thorne" },
        interests: ["coffee", "cocktails", "photography", "hiking"],
        isHost: false,
        hostName: null,
        hostBio: null,
        hostVerified: false,
        hostCreatedAt: null,
        hostMembershipTier: null,
        hostMembershipStatus: null,
        hostMembershipStartDate: null,
        hostMembershipEndDate: null,
        hostCategories: [],
        hostApplicationStatus: null,
        hostApplicationDate: null,
        paymentReference: null,
        proofOfPayment: null,
        paymentVerified: false,
        paymentDate: null
    },
    {
        id: 102,
        username: "Alex_Creative",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        bio: "Digital Artist & Coffee Addict. Always hunting for the perfect light and the strongest espresso. 🎨📸",
        level: "Trendsetter",
        points: 2100,
        followingCount: 450,
        followersCount: 1200,
        publicActivityId: "ALEX-404",
    },
    {
        id: 103,
        username: "Sarah_Wellness",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        bio: "Yoga teacher | Plant-based foodie | Sea point lover. Promoting health and happiness in CT. 🧘‍♀️🍏",
        level: "Local Guide",
        points: 1850,
        followingCount: 67,
        followersCount: 432,
        publicActivityId: "SARAH-551",
    },
    {
        id: 104,
        username: "David_Hikes",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        bio: "Table Mountain is my backyard. 🧗‍♂️ Weekly hikes and outdoor adventures. Join the journey!",
        level: "Explorer",
        points: 920,
        followingCount: 230,
        followersCount: 156,
        publicActivityId: "DAVE-220",
    },
    {
        id: 105,
        username: "kevin_pulse",
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
        joinedDate: "Oct 2024",
        isHost: false,
        hostName: "Zen Events",
        hostBio: "Hosting mindful wellness events and yoga retreats",
        hostVerified: false,
        hostMembershipTier: "starter",
        hostMembershipStatus: "inactive",
        hostApplicationStatus: "pending",
        hostApplicationDate: new Date("2024-03-01"),
        paymentReference: "TRND-HOST-106",
        proofOfPayment: "https://example.com/payment/106",
        paymentVerified: false,
        hostCategories: ["Wellness", "Community"]
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
        joinedDate: "Dec 2023",
        isHost: false,
        hostName: "Tasha's Food Tours",
        hostBio: "Exploring Cape Town's culinary scene through curated food tours",
        hostVerified: false,
        hostMembershipTier: "pro",
        hostMembershipStatus: "inactive",
        hostApplicationStatus: "rejected",
        hostApplicationDate: new Date("2024-02-28"),
        paymentReference: "TRND-HOST-107",
        proofOfPayment: "https://example.com/payment/107",
        paymentVerified: false,
        hostCategories: ["Social", "Other"]
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
    {
        id: 1,
        name: "Origin Coffee Roasting",
        description: "The pioneer of artisan coffee in South Africa. Our warehouse space in De Waterkant is where the magic happens. Experience the art of the perfect pour.",
        category: "Coffee",
        location: "De Waterkant, Cape Town",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
        rating: 4.9,
        pointsPerVisit: 50,
        distance: "0.8km",
        hours: "07:00 - 18:00",
        gallery: [
            "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80",
            "https://images.unsplash.com/photo-1442115994334-03290680fd74?w=600&q=80",
            "https://images.unsplash.com/photo-1497933321162-041002ee3c0e?w=600&q=80"
        ],
        activeRewards: [
            { id: 201, title: "Free Flat White", description: "Enjoy a complimentary signature flat white on your 5th visit.", cost: 250, category: "product", image: "https://images.unsplash.com/photo-1574313217646-e570f806938b?w=400&q=80", placeId: 1, locked: false },
            { id: 202, title: "Origin Beans (250g)", description: "Take the taste of Origin home with a bag of our best beans.", cost: 1200, category: "product", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80", placeId: 1, locked: false },
            { id: 203, title: "Brewing Workshop", description: "Master the V60 and AeroPress with our lead roaster.", cost: 5000, category: "experience", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", placeId: 1, locked: true }
        ],
        surveys: [
            {
                id: 301,
                title: "Your Coffee Experience",
                description: "Tell us how we did and earn 100 points!",
                points: 100,
                questions: [
                    { type: "choice", question: "How would you rate the brew quality?", options: ["Excellent", "Good", "Average", "Below Expectations"] },
                    { type: "choice", question: "Did our baristas make you feel welcome?", options: ["Yes, very!", "Somewhat", "Not really"] }
                ]
            }
        ],
        tasks: [
            { id: 401, title: "Morning Ritual", description: "Check in before 10 AM to earn bonus points.", points: 25, type: "Check-in", active: true, placeId: 1 }
        ]
    },
    {
        id: 2,
        name: "The Test Kitchen Fledgelings",
        description: "A philanthropic initiative by Luke Dale Roberts. Incredible fine dining with a heart. Every dish tells a story of mentorship and passion.",
        category: "Eat",
        location: "Woodstock, Cape Town",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
        rating: 4.8,
        pointsPerVisit: 150,
        distance: "2.4km",
        hours: "12:00 - 22:00",
        gallery: [
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
            "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80"
        ],
        activeRewards: [
            { id: 301, title: "Glass of MCC", description: "A celebratory glass of South Africa's finest sparkling wine.", cost: 500, category: "drink", image: "https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=400&q=80", placeId: 2, locked: false },
            { id: 302, title: "Chef's Special Dessert", description: "A unique seasonal creation from the kitchen.", cost: 800, category: "product", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80", placeId: 2, locked: false }
        ],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 3,
        name: "Fyn Restaurant",
        description: "Where South Africa meets Japan. Explore an urban, sophisticated dining experience overlooking the city bowl.",
        category: "Eat",
        location: "CBD, Cape Town",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        rating: 4.9,
        pointsPerVisit: 200,
        distance: "1.2km",
        hours: "12:00 - 22:00",
        gallery: [
            "https://images.unsplash.com/photo-1550966841-3ee5ad01104a?w=600&q=80",
            "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600&q=80"
        ],
        activeRewards: [
            { id: 303, title: "Sake Pairing Upgrade", description: "Elevate your journey with premium sake selections.", cost: 1500, category: "drink", image: "https://images.unsplash.com/photo-1571767454098-246b94fbcf70?w=400&q=80", placeId: 3, locked: false }
        ],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 4,
        name: "The Power & The Glory",
        description: "The neighborhood staple. By day a bustling cafe, by night a legendary bar. The heart of Tamboerskloof.",
        category: "Drink",
        location: "Tamboerskloof, Cape Town",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
        rating: 4.7,
        pointsPerVisit: 75,
        distance: "1.5km",
        hours: "07:00 - 01:00",
        gallery: [
            "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80",
            "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80"
        ],
        activeRewards: [
            { id: 304, title: "Neighborhood Pint", description: "Any local craft beer on tap.", cost: 400, category: "drink", image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80", placeId: 4, locked: false }
        ],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    },
    {
        id: 5,
        name: "Honest Chocolate",
        description: "Small-batch organic chocolate cafe. Try our famous chocolate cake or a rich hot cocoa in our secret courtyard.",
        category: "Play",
        location: "CBD, Cape Town",
        image: "https://images.unsplash.com/photo-1511381939415-e4401546383a?w=800&q=80",
        rating: 4.8,
        pointsPerVisit: 60,
        distance: "1.1km",
        hours: "09:00 - 18:00",
        gallery: [
            "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&q=80",
            "https://images.unsplash.com/photo-1511914265872-c40672604a80?w=600&q=80"
        ],
        activeRewards: [
            { id: 305, title: "Artisan Chocolate Box", description: "A curated selection of 4 handcrafted truffles.", cost: 600, category: "product", image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80", placeId: 5, locked: false }
        ],
        surveys: [DEFAULT_SURVEY],
        tasks: DEFAULT_TASKS
    }
];

// Mock Content Engine for Realism (Phase 2 constraint: no repeats)
const REALISTIC_CAPTIONS = [
    "Just found my new favorite spot in the city. The energy here is absolutely unmatched tonight! 🌃✨ #CityVibes",
    "Nothing beats a slow morning with a perfect flat white. Definitely coming back. ☕🥐 #SlowLiving",
    "Sunset views and great company. What more do you need? 🌇🥂 #GoldenHour",
    "Hidden gem alert! 🚨 The aesthetic here is crazy. #LocalHunters",
    "Honestly the best matcha I've had all year. Don't sleep on this place! 🍵🌿",
    "Weekend mode activated. The playlist here is exactly what I needed. 🎧💃",
    "A little slice of paradise right in the neighborhood. Highly recommend the signature special! 🍕💯",
    "Mid-week escape. Loving the minimalist design and calm vibes. 🌿✨ #Aesthetics",
    "Can we talk about this lighting?! The perfect date night spot. 🍷🕯️",
    "Finally made it here! The hype is 100% real. Such a cool crowd tonight. 🔥",
    "Sunday kind of love. Great food, better people. 🥞🥑 #BrunchLife",
    "Ending the day on a high note. This rooftop is everything. 🏙️🍹",
    "Such a creative pop-up event! Loving the community energy here today. 🎨🤝",
    "Working from 'home' today. The Wi-Fi is fast and the coffee is strong. 💻☕ #RemoteWork",
    "First time here and I'm blown away by the hospitality. 10/10 experience! ⭐⭐⭐⭐⭐",
    "Just the right amount of chaos and charm. This city never sleeps. 🚦🚕 #UrbanExploration",
    "Stumbled upon this place by accident and it just made my day. 🍀✨",
    "Post-workout refuel! The smoothies here are literal magic. 🍓🍌 #Wellness",
    "Vintage shopping and cafe hopping. A perfect Saturday. 👗🛍️ #Thrifty",
    "Taking a moment to just breathe and enjoy the view. Quality time. 🌊🌅",
    "The details in this interior design are stunning. Very inspiring space. 🛋️🖼️",
    "Catching up with old friends over some amazing tapas. 🫒🍷",
    "Live music, cold drinks, summer breeze. Perfection. 🎸🍺 #LiveMusic",
    "They really know how to throw an event! Such an immersive experience. 🎭✨",
    "Starting the week with good intentions and a great breakfast. 🍳🥑",
    "If you haven't been here yet, what are you doing? Absolute must-visit. 🏆",
    "Late night cravings sorted. The street food scene here is elite. 🌮🌶️",
    "Finding peace in the middle of the city hustle. A true urban oasis. 🌴🏙️",
    "The barista remembered my order! Little things like this make me loyal. ❤️☕",
    "Supporting local businesses always! Every detail feels made with love. 🛍️🤝",
    "Escaping the rain in the coziest corner I could find. 🌧️📚",
    "Celebrating a small win today! Treat yourself, you deserve it. 🍾🎉",
    "The textures and colors here are giving me so much life. 🎨🌺",
    "A spontaneous night out that turned into one of the best memories. 🌌💫",
    "Morning run led me to this cute little spot. Perfect detour! 🏃‍♀️☕",
    "The flavor profiles in this dish are insane. Chef understood the assignment. 👨‍🍳🔥",
    "Just sitting here people-watching. The best free entertainment. 👀🚶‍♂️",
    "Good vibes only. The energy in this room is contagious! ⚡💃",
    "My safe space for when I need to focus and get things done. 🎧📝",
    "Closing out the weekend the right way. Until next time! ✌️🌇"
];

const TIME_SPREAD = [
    "2m ago", "5m ago", "12m ago", "24m ago", "45m ago", "1h ago", "2h ago", "3h ago", "5h ago", "8h ago", 
    "12h ago", "Yesterday", "Yesterday", "2 days ago", "2 days ago", "3 days ago"
];

export const DEMO_POSTS = Array.from({ length: 40 }).map((_, i) => {
    const user = DEMO_USERS[i % DEMO_USERS.length];
    const biz = DEMO_BUSINESSES[i % DEMO_BUSINESSES.length];
    
    // Ensure unique captions by using index directly (up to 40)
    const caption = REALISTIC_CAPTIONS[i % REALISTIC_CAPTIONS.length];
    
    // Varied engagement
    const likesCount = Math.floor(Math.random() * 830) + 12; // 12-842 rule
    const commentsCount = Math.floor(Math.random() * 43); // 0-43 rule
    
    // Realistic timestamps
    const timeSpreadIndex = Math.min(Math.floor(i / 2), TIME_SPREAD.length - 1);
    
    // Calculate an actual date based on the index to keep ordering logical
    const minutesToSubtract = i === 0 ? 2 : (i < 5 ? i * 10 : (i < 15 ? i * 45 : i * 120));
    const postDate = new Date(Date.now() - minutesToSubtract * 60000);

    return {
        id: 601 + i,
        userId: user.id,
        author: user,
        media: [{ type: 'image', url: biz.image }],
        caption,
        placeId: biz.id,
        place: biz,
        likesCount,
        commentsCount,
        createdAt: postDate.toISOString(),
        timeDisplay: TIME_SPREAD[timeSpreadIndex], // Optional helper format
        hasLiked: i % 4 === 0,
        hasFollowed: i % 5 === 0
    };
});

export const DEMO_COMMENTS = (postId: number) => [
    { id: 801, userId: 101, user: DEMO_USERS[0], text: "Wow, need to go there! ✨", createdAt: "5m ago" },
    { id: 802, userId: 102, user: DEMO_USERS[1], text: "Best vibes in town for sure.", createdAt: "10m ago" },
    { id: 803, userId: 103, user: DEMO_USERS[2], text: "Added to my list! 📍", createdAt: "1h ago" },
    { id: 804, userId: 104, user: DEMO_USERS[3], text: "The service here is top-notch. 🏆", createdAt: "3h ago" },
    { id: 805, userId: 105, user: DEMO_USERS[4], text: "Incredible views! 😍", createdAt: "5h ago" }
];

export const DEMO_STORIES = Array.from({ length: 15 }).map((_, i) => ({
    id: 901 + i,
    userId: DEMO_USERS[i % 5].id,
    user: DEMO_USERS[i % 5],
    media: [{ type: 'image', url: DEMO_BUSINESSES[i % DEMO_BUSINESSES.length].image }],
    createdAt: new Date(Date.now() - i * 1800000).toISOString(),
    caption: "Live from the city! 🏙️"
}));

export const DEMO_NOTIFICATIONS = [
    { id: 1001, type: "like", userId: 102, user: DEMO_USERS[1], text: "liked your post", createdAt: "2m ago" },
    { id: 1002, type: "comment", userId: 103, user: DEMO_USERS[2], text: "commented: 'Love this vibe!'", createdAt: "15m ago" },
    { id: 1003, type: "follow", userId: 105, user: DEMO_USERS[4], text: "started following you", createdAt: "1h ago" },
    { id: 1004, type: "reward", userId: 1, name: "Origin Coffee Roasting", text: "Points earned for check-in", createdAt: "2h ago" }
];

export const DEMO_WALKTHROUGH = {
    wallet: {
        points: 850,
        history: [
            { id: 1, type: "earned", amount: 50, description: "Check-in at Origin Coffee Roasting", status: "completed", date: new Date().toISOString() },
            { id: 2, type: "earned", amount: 100, description: "Experience Survey: Origin", status: "completed", date: new Date(Date.now() - 86400000).toISOString() },
            { id: 3, type: "earned", amount: 25, description: "Task: Morning Ritual", status: "completed", date: new Date(Date.now() - 172800000).toISOString() },
            { id: 4, type: "earned", amount: 500, description: "Trendsetter Achievement Bonus", status: "completed", date: new Date(Date.now() - 604800000).toISOString() },
            { id: 5, type: "earned", amount: 150, description: "Verified Moment Reward", status: "completed", date: new Date(Date.now() - 1209600000).toISOString() },
            { id: 6, type: "earned", amount: 200, description: "Referral Bonus: Invited Sarah", status: "completed", date: new Date(Date.now() - 2592000000).toISOString() },
            { id: 7, type: "redeemed", amount: 250, description: "Free Flat White - Origin", status: "completed", date: new Date(Date.now() - 1500000).toISOString() },
            { id: 8, type: "redeemed", amount: 500, description: "Glass of MCC - Test Kitchen", status: "completed", date: new Date(Date.now() - 432000000).toISOString() },
            { id: 9, type: "cashout", amount: 500, description: "Bank Transfer Payout", status: "pending", date: new Date(Date.now() - 3600000).toISOString() }
        ],
        redemptions: [
            { id: 1, title: "Free Flat White", points: 250, status: "completed", date: "Last week", image: "https://images.unsplash.com/photo-1574313217646-e570f806938b?w=400&q=80" },
            { id: 2, title: "Glass of MCC", points: 500, status: "completed", date: "Last month", image: "https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=400&q=80" },
            { id: 3, title: "Artisan Chocolate Box", points: 600, status: "completed", date: "2 months ago", image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80" },
            { id: 4, title: "Neighborhood Pint", points: 400, status: "pending", date: "Today", image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80" }
        ],
        cashouts: [
            { id: 1, amount: 500, type: "bank", status: "pending", createdAt: new Date(Date.now() - 3600000).toISOString() },
            { id: 2, amount: 1000, type: "mobile", status: "completed", createdAt: new Date(Date.now() - 1209600000).toISOString() }
        ]
    }
};

export const DEMO_TRANSACTIONS = DEMO_WALKTHROUGH.wallet.history;
export const DEMO_CASHOUTS = DEMO_WALKTHROUGH.wallet.cashouts;

