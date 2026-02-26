import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DEMO_POSTS, DEMO_USERS, isInDemoMode } from "@/lib/demo-data";

interface LaunchContextType {
    isSoftLaunch: boolean;
    setIsSoftLaunch: (active: boolean) => void;
    launchState: {
        posts: any[];
        likes: Record<number, number>;
        comments: Record<number, any[]>;
    };
    simulateLike: (postId: number) => void;
    simulateComment: (postId: number, author: any, text: string) => void;
}

const LaunchContext = createContext<LaunchContextType | undefined>(undefined);

export const LaunchProvider = ({ children }: { children: ReactNode }) => {
    const [isSoftLaunch, setIsSoftLaunch] = useState(() => {
        // Priority: 1. APP_MODE, 2. Storage
        if (process.env.APP_MODE === 'soft_launch') return true;
        
        const stored = localStorage.getItem("TRENDLE_SOFT_LAUNCH");
        if (stored === "true") return true;
        if (stored === "false") return false;

        return isInDemoMode();
    });

    const [launchState, setLaunchState] = useState({
        posts: DEMO_POSTS,
        likes: DEMO_POSTS.reduce((acc, post) => {
            acc[post.id] = post.likesCount;
            return acc;
        }, {} as Record<number, number>),
        comments: DEMO_POSTS.reduce((acc, post) => {
            acc[post.id] = []; // Initialize empty local comments
            return acc;
        }, {} as Record<number, any[]>),
    });

    useEffect(() => {
        localStorage.setItem("TRENDLE_SOFT_LAUNCH", isSoftLaunch.toString());
    }, [isSoftLaunch]);

    // LIVE ACTIVITY SIMULATION (Subtle)
    useEffect(() => {
        if (!isSoftLaunch) return;

        const timer = setInterval(() => {
            // 1. Randomly increment some likes (simulating real activity)
            const randomPostIndex = Math.floor(Math.random() * DEMO_POSTS.length);
            const postId = DEMO_POSTS[randomPostIndex].id;

            setLaunchState(prev => ({
                ...prev,
                likes: {
                    ...prev.likes,
                    [postId]: (prev.likes[postId] || 0) + 1
                }
            }));

            // 2. Occasionally add a simulated comment
            if (Math.random() > 0.8) {
                const commenter = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];
                const comments = ["Love this!", "Amazing vibe!", "Need to visit soon.", "Cape Town magic! ✨", "Great shot!", "Wish I was there."];
                const commentText = comments[Math.floor(Math.random() * comments.length)];

                simulateComment(postId, commenter, commentText);
            }
        }, 30000); // Every 30 seconds for subtle liveliness

        return () => clearInterval(timer);
    }, [isSoftLaunch]);

    const simulateLike = (postId: number) => {
        setLaunchState(prev => ({
            ...prev,
            likes: {
                ...prev.likes,
                [postId]: (prev.likes[postId] || 0) + 1
            }
        }));
    };

    const simulateComment = (postId: number, author: any, text: string) => {
        setLaunchState(prev => ({
            ...prev,
            comments: {
                ...prev.comments,
                [postId]: [
                    ...(prev.comments[postId] || []),
                    {
                        id: Date.now(),
                        user: author,
                        text,
                        createdAt: "just now"
                    }
                ]
            }
        }));
    };

    return (
        <LaunchContext.Provider value={{ isSoftLaunch, setIsSoftLaunch, launchState, simulateLike, simulateComment }}>
            {children}
        </LaunchContext.Provider>
    );
};

export const useLaunch = () => {
    const context = useContext(LaunchContext);
    if (context === undefined) {
        throw new Error("useLaunch must be used within a LaunchProvider");
    }
    return context;
};
