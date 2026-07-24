"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

// ✅ Import Swiper styles - USE THIS SINGLE IMPORT
import 'swiper/swiper-bundle.css';

// Partner logos array with proper typing
interface PartnerLogo {
    src: string;
    alt: string;
}

const partnerLogos: PartnerLogo[] = [
    { src: "https://i.ibb.co.com/VcC54xRN/1.png", alt: "Partner Logo 1" },
    { src: "https://i.ibb.co.com/fm2tYG4/2.png", alt: "Partner Logo 2" },
    { src: "https://i.ibb.co.com/tTzpTRXx/3.png", alt: "Partner Logo 3" },
    { src: "https://i.ibb.co.com/8Dtwjvjn/4.png", alt: "Partner Logo 4" },
    { src: "https://i.ibb.co.com/LXJM9jKV/5.png", alt: "Partner Logo 5" },
    { src: "https://i.ibb.co.com/sppkFvDq/6.png", alt: "Partner Logo 6" },
    { src: "https://i.ibb.co.com/j9cR6QFK/7.png", alt: "Partner Logo 7" },
];

const OurPartner = () => {
    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto py-16 px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">
                        Our <span className="text-orange-600">Partners</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        We collaborate with the best brands and restaurants to serve you delicious food.
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full mt-4"></div>
                </div>

                {/* Swiper Carousel */}
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    breakpoints={{
                        320: { slidesPerView: 2, spaceBetween: 20 },
                        640: { slidesPerView: 3, spaceBetween: 25 },
                        768: { slidesPerView: 4, spaceBetween: 30 },
                        1024: { slidesPerView: 5, spaceBetween: 40 },
                    }}
                    className="mySwiper"
                    style={{ padding: "10px 0" }}
                >
                    {partnerLogos.map((logo, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex items-center justify-center h-32 md:h-40 lg:h-48 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-100 dark:border-gray-700">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={logo.src}
                                        alt={logo.alt}
                                        fill
                                        className="object-contain p-2 transition-all duration-300 hover:scale-110"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Partner Counter */}
                <div className="text-center mt-12">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Trusted by <span className="font-bold text-orange-600">{partnerLogos.length}+</span> partners worldwide
                    </p>
                </div>
            </div>
        </section>
    );
};

export default OurPartner;