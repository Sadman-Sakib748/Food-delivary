"use client";

import React, { useState } from "react";
import Image from "next/image";

const servicesData = [
    {
        id: "01",
        icon: "https://i.ibb.co.com/4nD9P4ct/Navigation-amico.png",
        title: "Real-Time Order Tracking",
        description:
            "Track your food live with GPS and get real-time updates from kitchen to doorstep, knowing exactly when your meal will arrive.",
    },
    {
        id: "02",
        icon: "https://i.ibb.co.com/gMrpH4ds/Take-Away-pana.png",
        title: "Fast Delivery by Riders",
        description:
            "Experience speedy, reliable delivery handled by trained riders who ensure your food arrives hot, fresh, and right on schedule.",
    },
    {
        id: "03",
        icon: "https://i.ibb.co.com/gZ4RTFpj/Order-food-pana.png",
        title: "Online Food Ordering",
        description:
            "Easily browse restaurants, explore diverse menus, customize your dishes, and place secure orders within just a few quick taps.",
    },
    {
        id: "04",
        icon: "https://i.ibb.co.com/5g4RzxQC/Business-deal-bro.png",
        title: "Restaurant Partnership",
        description:
            "Expand your restaurant's reach, manage orders efficiently, update menus anytime, and grow your sales with our trusted platform.",
    },
];

interface Service {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export default function Services() {
    const [flipped, setFlipped] = useState<string | null>(null);

    const toggleFlip = (id: string) => {
        setFlipped((prev) => (prev === id ? null : id));
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    How <span className="text-orange-600">FastFeast</span> Works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {servicesData.map((service: Service, index: number) => (
                        <div
                            key={service.id}
                            className="group relative h-[420px] cursor-pointer"
                            style={{ 
                                perspective: "1000px",
                                opacity: 0,
                                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s forwards`
                            }}
                            onClick={() => toggleFlip(service.id)}
                        >
                            <style jsx>{`
                                @keyframes fadeInUp {
                                    from {
                                        opacity: 0;
                                        transform: translateY(50px);
                                    }
                                    to {
                                        opacity: 1;
                                        transform: translateY(0);
                                    }
                                }
                            `}</style>

                            {/* Card Inner */}
                            <div
                                className="relative w-full h-full transition-transform duration-700"
                                style={{
                                    transformStyle: "preserve-3d",
                                    transform: flipped === service.id ? "rotateY(180deg)" : "",
                                }}
                            >
                                {/* Front Side */}
                                <div
                                    className="absolute inset-0 flex flex-col bg-white rounded-xl shadow-md p-6 items-center justify-center border border-gray-100"
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    <div className="h-[180px] w-[180px] relative">
                                        <Image
                                            src={service.icon}
                                            alt={service.title}
                                            fill
                                            className="object-contain transition-transform duration-300 group-hover:scale-110"
                                            unoptimized
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 text-center group-hover:text-orange-500 transition-colors duration-300 pt-4">
                                        {service.title}
                                    </h3>
                                    <span className="text-sm text-orange-500 font-semibold mt-2">
                                        {service.id}
                                    </span>
                                </div>

                                {/* Back Side */}
                                <div
                                    className="absolute inset-0 flex flex-col rounded-xl items-center justify-center px-6 text-center shadow-md bg-white border border-gray-100"
                                    style={{
                                        transform: "rotateY(180deg)",
                                        backfaceVisibility: "hidden",
                                    }}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 text-center group-hover:text-orange-500 transition-colors duration-300 pb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                    <span className="text-sm text-orange-500 font-semibold mt-4">
                                        {service.id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}