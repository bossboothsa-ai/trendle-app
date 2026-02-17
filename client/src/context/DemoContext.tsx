import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DEMO_POSTS, DEMO_USERS, isInDemoMode } from "@/lib/demo-data";

interface DemoContextType {
    isDemoMode: boolean;
    setIsDemoMode: (active: boolean) => void;
    demoState: {
        posts: any[];
        likes: Record<number, number>;
        comments: Record<number, any[]>;
    };
    simulateLike: (postId: number) => void;
    simulateComment: (postId: number, author: any, text: string) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
    const [isDemoMode, setIsDemoMode] = useState(() => {
        // Priority: 1. Query Param, 2. isInDemoMode (Host/Storage)
        const params = new URLSearchParams(window.location.search);
        const demoParam = params.get("demo");

        if (demoParam === "true") {
            localStorage.setItem("TRENDLE_DEMO_MODE", "true");
            return true;
        }
        if (demoParam === "false") {
            localStorage.setItem("TRENDLE_DEMO_MODE", "false");
            return false;
        }

        return isInDemoMode();
    });

    const [demoState, setDemoState] = useState({
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
        localStorage.setItem("TRENDLE_DEMO_MODE", isDemoMode.toString());
    }, [isDemoMode]);

    // LIVE ACTIVITY SIMULATION
    useEffect(() => {
        if (!isDemoMode) return;

        const timer = setInterval(() => {
            // 1. Randomly increment some likes
            const randomPostIndex = Math.floor(Math.random() * DEMO_POSTS.length);
            const postId = DEMO_POSTS[randomPostIndex].id;

            setDemoState(prev => ({
                ...prev,
                likes: {
                    ...prev.likes,
                    [postId]: (prev.likes[postId] || 0) + 1
                }
            }));

            // 2. Occasionally add a simulated comment
            if (Math.random() > 0.7) {
                const commenter = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];
                const comments = ["Love this!", "Amazing vibe!", "Need to visit soon.", "Cape Town magic! ✨", "Great shot!", "Wish I was there."];
                const commentText = comments[Math.floor(Math.random() * comments.length)];

                simulateComment(postId, commenter, commentText);
            }
        }, 20000); // Every 20 seconds for demo liveliness

        return () => clearInterval(timer);
    }, [isDemoMode]);

    const simulateLike = (postId: number) => {
        setDemoState(prev => ({
            ...prev,
            likes: {
                ...prev.likes,
                [postId]: (prev.likes[postId] || 0) + 1
            }
        }));
    };

    const simulateComment = (postId: number, author: any, text: string) => {
        setDemoState(prev => ({
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
        <DemoContext.Provider value={{ isDemoMode, setIsDemoMode, demoState, simulateLike, simulateComment }}>
            {children}
        </DemoContext.Provider>
    );
};

export const useDemo = () => {
    const context = useContext(DemoContext);
    if (context === undefined) {
        throw new Error("useDemo must be used within a DemoProvider");
    }
    return context;
};
