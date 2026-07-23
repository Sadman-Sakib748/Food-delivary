// src/app/components/TopCuisine.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import {
    EffectCoverflow,
    Pagination,
    Navigation,
    Autoplay,
} from "swiper/modules";
import { ArrowLeft, ArrowRight, Star, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Types
interface Cuisine {
    name: string;
    description: string;
    highlight: string;
    image: string;
    icon: string;
    rating: number;
    deliveryTime: string;
    link: string;
}

interface ColorScheme {
    from: string;
    to: string;
    glow: string;
}

const TopCuisine = () => {
    const cuisines: Cuisine[] = [
        {
            name: "Thai Food",
            description: "Experience the perfect balance of sweet, sour, salty, and spicy flavors with our authentic Thai dishes.",
            highlight: "Spicy & Aromatic",
            image: "https://i.ibb.co.com/dwsf56Wd/Chicken-Drums.jpg",
            icon: "🍛",
            rating: 4.8,
            deliveryTime: "25-35 min",
            link: "/thaifood"
        },
        {
            name: "Japanese",
            description: "Fresh sushi, savory ramen, and delicate flavors that bring Tokyo to your doorstep.",
            highlight: "Fresh & Delicate",
            image: "https://i.ibb.co.com/jZBvwWF7/Crispy-Chicken-Sandwich.jpg",
            icon: "🍣",
            rating: 4.9,
            deliveryTime: "30-40 min",
            link: "/japanesefood"
        },
        {
            name: "Indian",
            description: "Rich, aromatic curries and tandoori specialties that will transport you to the streets of Delhi.",
            highlight: "Rich & Spicy",
            image: "https://i.ibb.co.com/hRPM5mts/Korean-Fried-Chicken-1.jpg",
            icon: "🍛",
            rating: 4.7,
            deliveryTime: "20-30 min",
            link: "/indianfood"
        },
        {
            name: "Chinese",
            description: "From classic fried rice to sizzling stir-fries, authentic Chinese cuisine made just for you.",
            highlight: "Classic & Savory",
            image: "https://i.ibb.co.com/5gW2CT6C/Honey-Garlic-Chicken.jpg",
            icon: "🥢",
            rating: 4.6,
            deliveryTime: "25-35 min",
            link: "/chinesefood"
        },
        {
            name: "Italian",
            description: "Handcrafted pasta, wood-fired pizzas, and Mediterranean flavors that taste like Italy.",
            highlight: "Authentic & Hearty",
            image: "https://i.ibb.co.com/qYj6sWzL/Chicken-Nuggets.jpg",
            icon: "🍝",
            rating: 4.8,
            deliveryTime: "35-45 min",
            link: "/italianfood"
        },
        {
            name: "Turkish",
            description: "Succulent kebabs, flavorful mezes, and traditional dishes from the heart of Turkey.",
            highlight: "Grilled & Flavorful",
            image: "https://i.ibb.co.com/yFh1d3Ss/Popcorn-Chicken.jpg",
            icon: "🥙",
            rating: 4.5,
            deliveryTime: "30-40 min",
            link: "/turkishfood"
        },
        {
            name: "Korean",
            description: "Bold flavors, kimchi, BBQ, and authentic Korean dishes that will awaken your taste buds.",
            highlight: "Bold & Fermented",
            image: "https://i.ibb.co.com/mrNX7tGL/Chicken-Tenders.jpg",
            icon: "🍲",
            rating: 4.7,
            deliveryTime: "25-35 min",
            link: "/koreanfood"
        }
    ];

    const colors: ColorScheme[] = [
        { from: "from-orange-500", to: "to-red-500", glow: "orange" },
        { from: "from-emerald-500", to: "to-teal-500", glow: "emerald" },
        { from: "from-yellow-500", to: "to-amber-500", glow: "yellow" },
        { from: "from-red-500", to: "to-pink-500", glow: "red" },
        { from: "from-blue-500", to: "to-indigo-500", glow: "blue" },
        { from: "from-purple-500", to: "to-pink-500", glow: "purple" },
        { from: "from-rose-500", to: "to-orange-500", glow: "rose" },
    ];

    return (
        <>
            <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-float-up { animation: float-up 4s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #f97316;
          opacity: 0.5;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          width: 32px;
          border-radius: 6px;
          background: linear-gradient(90deg, #f97316, #ef4444);
        }
      `}</style>

            <div className="relative container w-full mx-auto mt-10 px-4 pb-16 lg:pb-20 overflow-hidden">
                {/* Background gradients */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl -z-10"></div>

                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-4xl text-gray-800 dark:text-white md:text-5xl font-extrabold text-center mb-4">
                        Top <span className="text-orange-600">Cuisines</span>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
                        Discover world-class flavors delivered fresh to your doorstep from our partner restaurants
                    </p>
                </div>

                {/* Swiper Carousel */}
                <div className="relative">
                    <Swiper
                        effect={"coverflow"}
                        grabCursor={true}
                        centeredSlides={true}
                        loop={true}
                        slidesPerView={1}
                        spaceBetween={20}
                        coverflowEffect={{
                            rotate: 10,
                            stretch: 0,
                            depth: 200,
                            modifier: 1.5,
                            slideShadows: false,
                        }}
                        pagination={{
                            el: ".swiper-pagination",
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={{
                            nextEl: ".pagination-next",
                            prevEl: ".pagination-pre",
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1.5,
                                spaceBetween: 25
                            },
                            1024: {
                                slidesPerView: 2.5,
                                spaceBetween: 30
                            },
                            1280: {
                                slidesPerView: 3,
                                spaceBetween: 35
                            },
                        }}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                        className="!pb-16"
                    >
                        {cuisines.map((cuisine, index) => {
                            const colorScheme = colors[index % colors.length];
                            return (
                                <SwiperSlide key={index} className="!h-auto">
                                    <Link href={cuisine.link} className="block">
                                        <div className="group relative h-full rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white cursor-pointer">
                                            {/* Image Section */}
                                            <div className="relative h-48 sm:h-56 overflow-hidden">
                                                <Image
                                                    src={cuisine.image}
                                                    alt={cuisine.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    priority={index < 3}
                                                />

                                                {/* Cuisine Name Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border-2 border-white/50">
                                                        <span className={`text-lg font-bold bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} bg-clip-text text-transparent`}>
                                                            {cuisine.name}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Cuisine Icon */}
                                                <div className="absolute top-4 right-4">
                                                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-2xl animate-float-up border-2 border-white/50">
                                                        {cuisine.icon}
                                                    </div>
                                                </div>

                                                {/* Rating & Delivery Time */}
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                            <span className="text-white text-sm font-semibold">{cuisine.rating}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full">
                                                            <Clock className="w-4 h-4 text-white" />
                                                            <span className="text-white text-sm font-semibold">{cuisine.deliveryTime}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-6 relative">
                                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} opacity-5 rounded-bl-full`}></div>

                                                <h3 className={`text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 origin-left`}>
                                                    {cuisine.name}
                                                </h3>

                                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                                                    {cuisine.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className={`px-4 py-2 bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} rounded-xl shadow-lg backdrop-blur-sm`}>
                                                        <div className="flex items-center justify-center gap-2 text-white font-bold text-sm">
                                                            <span>{cuisine.highlight}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-gray-500 font-medium">Explore →</span>
                                                </div>

                                                {/* Bottom progress bar */}
                                                <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} rounded-full group-hover:w-full transition-all duration-500`}></div>
                                            </div>

                                            {/* Hover overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}></div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <button
                        className="pagination-pre absolute left-0 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center group transition-all duration-300 hover:scale-110 border-2 border-orange-500/20"
                        aria-label="Previous slide"
                    >
                        <ArrowLeft className="w-5 h-5 text-orange-600 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        className="pagination-next absolute right-0 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center group transition-all duration-300 hover:scale-110 border-2 border-orange-500/20"
                        aria-label="Next slide"
                    >
                        <ArrowRight className="w-5 h-5 text-orange-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="swiper-pagination !bottom-0"></div>
                </div>
            </div>
        </>
    );
};

export default TopCuisine;