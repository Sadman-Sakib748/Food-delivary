"use client"

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";

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

interface BlogCardProps {
    blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
    const router = useRouter();
    const [imageError, setImageError] = useState(false);
    const {
        _id,
        title,
        excerpt,
        content,
        coverImage,
        image,
        featuredImage,
        tags = [],
        visitCount,
        views,
        author,
        createdAt,
        publishedAt,
    } = blog;

    // Get image URL - with fallback
    const imageUrl = coverImage || image || featuredImage || "/images/default-blog.jpg";
    
    // Get view count
    const viewCount = visitCount || views || 0;
    
    // Get author name
    const authorName = typeof author === 'string' ? author : author?.name || "Mr. Blogger";
    
    // Get date
    const date = createdAt || publishedAt || new Date().toISOString();

    const handleReadMore = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/popularblogs/${_id}`);
    };

    return (
        <section className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Cover image */}
            <figure className="relative h-60 md:h-72 overflow-hidden bg-gray-100 dark:bg-gray-800">
                {!imageError ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => setImageError(true)}
                        priority={false}
                        unoptimized={true}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100">
                        <span className="text-6xl">📝</span>
                    </div>
                )}

                {/* Tags */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                    {tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-xs font-semibold bg-orange-500/90 text-white px-3 py-1 rounded-full shadow-md">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* View count */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium shadow-md border border-white/10 text-white">
                    <FaEye className="w-4 h-4" /> {viewCount}
                </div>
            </figure>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                <h1 className="text-lg md:text-xl font-bold mb-2 line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-orange-500 transition-colors">
                    {title}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-medium text-xs">
                            {authorName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-xs">{authorName}</span>
                            <span className="text-xs">
                                {new Date(date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Excerpt */}
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
                    {excerpt || content?.substring(0, 120) || "Read this amazing blog post..."}
                </p>

                <hr className="border-orange-200 dark:border-gray-700 mb-3" />

                {/* Read More */}
                <div className="flex flex-1 items-center justify-end">
                    <Link
                        href={`/popularblogs/${_id}`}
                        onClick={handleReadMore}
                        className="flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                    >
                        Read More
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}