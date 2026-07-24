"use client"

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { blogAPI } from '@/lib/api';
import BlogCard from "./BlogCard";

interface Blog {
    _id: string;
    title: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    image?: string;
    featuredImage?: string;
    tags?: string[];
    visitCount?: number;
    views?: number;
    author?: string | { name: string; avatar?: string };
    createdAt?: string;
    publishedAt?: string;
}

export default function PopularBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await blogAPI.getAll({ limit: 8 });
                console.log('📦 Blog API Full Response:', response);
                
                let arr: Blog[] = [];
                
                // Handle different response structures
                if (response) {
                    // If response is an array
                    if (Array.isArray(response)) {
                        arr = response;
                    } 
                    // If response has data property
                    else if (response.data) {
                        if (Array.isArray(response.data)) {
                            arr = response.data;
                        } else if (response.data.blogs) {
                            arr = response.data.blogs;
                        } else if (response.data.items) {
                            arr = response.data.items;
                        }
                    }
                    // If response has blogs property
                    else if (response.blogs && Array.isArray(response.blogs)) {
                        arr = response.blogs;
                    }
                    // If response has items property
                    else if (response.items && Array.isArray(response.items)) {
                        arr = response.items;
                    }
                    // If response has results property
                    else if (response.results && Array.isArray(response.results)) {
                        arr = response.results;
                    }
                    // If response has success and data
                    else if (response.success && response.data) {
                        if (Array.isArray(response.data)) {
                            arr = response.data;
                        } else if (response.data.blogs) {
                            arr = response.data.blogs;
                        } else if (response.data.items) {
                            arr = response.data.items;
                        }
                    }
                }
                
                console.log('📊 Parsed Blogs Count:', arr.length);
                if (arr.length > 0) {
                    console.log('📊 First Blog Sample:', arr[0]);
                }
                
                setBlogs(arr);
                
                if (arr.length === 0) {
                    setError('No blogs found');
                }
            } catch (err) {
                console.error("❌ Failed to fetch posts:", err);
                setError('Failed to load blogs');
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Sort by visitCount and get top 4
    const topPosts = blogs.length > 0
        ? [...blogs]
            .sort((a, b) => (b.visitCount || b.views || 0) - (a.visitCount || a.views || 0))
            .slice(0, 4)
        : [];

    const directions = [
        { x: -60, y: 0 },
        { x: 60, y: 0 },
        { x: 0, y: 60 },
        { x: 0, y: -60 },
    ];

    if (loading) {
        return (
            <section className="relative py-20 overflow-hidden">
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg font-semibold text-gray-600">Loading Popular Blogs...</p>
                </div>
            </section>
        );
    }

    if (error || topPosts.length === 0) {
        return (
            <section className="relative py-20 overflow-hidden">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Blogs Available</h3>
                    <p className="text-gray-500">{error || "Check back later for new content!"}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-20 overflow-hidden transition-colors duration-500">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,179,71,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(255,140,0,0.15),transparent_60%)] pointer-events-none"></div>

            {/* Header */}
            <div
                style={{
                    opacity: 0,
                    animation: "slideUp 0.8s ease-out 0.2s forwards"
                }}
                className="text-center max-w-2xl font-serif mx-auto mb-16 px-4"
            >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
                    Popular{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-400">
                        Blogs
                    </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                    Discover what everyone's reading! These trending articles are handpicked for
                    food lovers — full of stories, flavors, and culinary secrets.
                </p>
                <div className="mt-5 mx-auto w-20 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full shadow-md shadow-orange-300/30"></div>
            </div>

            {/* Blog Cards */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {topPosts.map((blog, i) => (
                        <div
                            key={blog._id || i}
                            className="hover:scale-[1.02] transition-transform duration-300"
                            style={{
                                opacity: 0,
                                animation: `fadeIn 0.7s ease-out ${i * 0.15}s forwards`,
                                transform: `translate(${directions[i % 4].x}px, ${directions[i % 4].y}px)`,
                            }}
                        >
                            <BlogCard blog={blog} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Show All button */}
            <div
                style={{
                    opacity: 0,
                    animation: "slideUp 0.6s ease-out 0.4s forwards"
                }}
                className="flex items-center justify-center mt-16"
            >
                <Link
                    href="/blogs"
                    className="flex items-center gap-2 px-10 py-3.5 bg-transparent text-gray-900 hover:bg-orange-500 hover:bg-gradient-to-r from-orange-600 to-orange-400 hover:text-white font-semibold rounded-xl hover:shadow-lg shadow-none hover:shadow-orange-400/60 hover:-translate-y-0.5 transition-all duration-300 my-8"
                >
                    Show All
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>

            {/* CSS Animations */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
                @keyframes fadeIn {
                    0% { 
                        opacity: 0; 
                        transform: scale(0.9) translateY(20px); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: scale(1) translateY(0); 
                    }
                }
                @keyframes slideUp {
                    0% { 
                        opacity: 0; 
                        transform: translateY(40px); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
                .animate-shimmer {
                    animation: shimmer 2.5s linear infinite;
                }
            `}</style>
        </section>
    );
}