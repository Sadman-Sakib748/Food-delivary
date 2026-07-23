// src/app/components/PopularItems.tsx
"use client";

import React, { useEffect, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Types
interface PopularItem {
  id: number;
  name: string;
  image: string;
  link: string;
}

const popularItems: PopularItem[] = [
  { id: 1, name: "Biryani", image: "https://i.ibb.co/KcyNS5wF/Biryani-in-orange-background-for-round-profile-picture.jpg", link: "/menu?search=biryani" },
  { id: 2, name: "Pizza", image: "https://i.ibb.co/TxGwFfsN/Pizza-in-orange-background.jpg", link: "/menu?search=pizza" },
  { id: 3, name: "Noodles", image: "https://i.ibb.co/FqHZcYX1/noodles-in-orange-background-1.jpg", link: "/menu?search=noodles" },
  { id: 4, name: "Shawarma", image: "https://i.ibb.co/B2R3qXw1/shawarma-in-orange-background.jpg", link: "/menu?search=shawarma" },
  { id: 5, name: "Fried Chicken", image: "https://i.ibb.co/S4pQbgpq/fried-chicken-in-orange-background.jpg", link: "/menu?search=fried-chicken" },
  { id: 6, name: "Sushi", image: "https://i.ibb.co/0j2RNP8V/sushi-in-orange-background.jpg", link: "/menu?search=sushi" },
  { id: 7, name: "Soup", image: "https://i.ibb.co/YFkxHZnF/soup-in-orange-background.jpg", link: "/menu?search=soup" },
];

// Custom hook for responsive design
const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkScreenSize = (): void => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);

  return isMobile;
};

export default function PopularItems(): ReactNode {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const isMobile: boolean = useIsMobile();

  const containerRadius: number = isMobile ? 130 : 200;
  const profileSize: number = isMobile ? 70 : 90;
  const containerSize: number = containerRadius * 2 + 100;

  const getRotation = useCallback(
    (index: number): number => (index - activeIndex) * (360 / popularItems.length),
    [activeIndex]
  );

  const next = useCallback((): void => {
    setActiveIndex((i: number) => (i + 1) % popularItems.length);
  }, []);

  const prev = useCallback((): void => {
    setActiveIndex((i: number) => (i - 1 + popularItems.length) % popularItems.length);
  }, []);

  const handleProfileClick = useCallback((index: number): void => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  }, [activeIndex]);

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const getImageSrc = (item: PopularItem) => {
    if (imageErrors[item.id]) {
      return "https://placehold.co/100x100/FEE2E2/DC2626?text=Food";
    }
    return item.image;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "ArrowLeft") prev();
      else if (event.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  return (
    <section className="flex flex-col items-center w-full relative min-h-[500px] transition-colors duration-300 py-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side Content */}
          <div
            className="flex flex-col justify-center space-y-6"
            data-aos="fade-left"
          >
            <p className="text-sm uppercase tracking-widest font-medium text-orange-600 mb-1">
              Handpicked by thousands of food lovers across Bangladesh
            </p>
            <h2 className="text-3xl sm:text-4xl text-gray-800 dark:text-white font-extrabold leading-tight mb-4 sm:mb-6">
              Discover Our <br />
              <span className="text-orange-600">Customer Favorites</span> <br />
              Dishes
            </h2>
            <p className="text-base sm:text-lg leading-relaxed max-w-xl mb-6 sm:mb-10 text-gray-800 dark:text-gray-200">
              From sizzling biryani to crispy fried chicken, our popular items
              section showcases the dishes that keep our customers coming back
              for more. Each item is carefully crafted with fresh ingredients,
              authentic recipes, and delivered hot to your doorstep. Join the
              thousands of satisfied customers who have made these dishes their
              favorites!
            </p>
            <Link href={"/menu"}>
              <button className="relative py-3 sm:py-4 px-8 sm:px-10 overflow-hidden cursor-pointer font-bold text-orange-600 bg-white border-2 border-orange-600 rounded-lg shadow-lg hover:shadow-xl group transition-all duration-300">
                <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-orange-600 group-hover:w-full ease"></span>
                <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-orange-600 group-hover:w-full ease"></span>
                <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-orange-600 group-hover:h-full ease"></span>
                <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-orange-600 group-hover:h-full ease"></span>
                <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-orange-600 opacity-0 group-hover:opacity-100"></span>
                <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">
                  Explore Full Menu
                </span>
              </button>
            </Link>
          </div>

          {/* Right side component - Circular Menu */}
          <div
            className="relative flex items-center mx-auto justify-center mb-8"
            data-aos="fade-right"
            style={{
              width: containerSize,
              height: containerSize,
            }}
          >
            {/* Outer circle ring */}
            <div
              className="absolute rounded-full border-2 border-orange-300/50"
              style={{
                width: containerRadius * 2,
                height: containerRadius * 2,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            />

            {/* Center active item display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={popularItems[activeIndex].id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{
                  zIndex: 10,
                  background: "white",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  padding: "12px",
                  width: isMobile ? "192px" : "208px",
                  textAlign: "center",
                  border: "2px solid #fed7aa",
                  position: "relative",
                  marginBottom: "20px"
                }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto -mt-12 border-4 border-white shadow-md overflow-hidden relative bg-orange-100">
                  <Image
                    src={getImageSrc(popularItems[activeIndex])}
                    alt={popularItems[activeIndex].name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(popularItems[activeIndex].id)}
                    priority
                    unoptimized
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-950">
                    {popularItems[activeIndex].name}
                  </h2>
                </div>
                <div className="flex justify-center items-center mt-6 space-x-4">
                  <button
                    onClick={prev}
                    className="p-2 btn-sm cursor-pointer rounded-full bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg"
                    aria-label="Previous item"
                  >
                    <ChevronLeft size={15} className="text-white font-bold" />
                  </button>
                  <Link href={popularItems[activeIndex].link}>
                    <button className="px-3 py-1 text-base cursor-pointer rounded-full btn-sm bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl transition-all duration-300 font-sm">
                      Explore
                    </button>
                  </Link>
                  <button
                    onClick={next}
                    className="p-2 btn-sm cursor-pointer rounded-full bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg"
                    aria-label="Next item"
                  >
                    <ChevronRight size={15} className="text-white font-bold" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Circular items - Using regular div with style */}
            {popularItems.map((item: PopularItem, i: number) => {
              const rotation: number = getRotation(i);
              const isActive = i === activeIndex;
              return (
                <div
                  key={item.id}
                  style={{
                    width: profileSize,
                    height: profileSize,
                    position: "absolute",
                    top: `calc(50% - ${profileSize / 2}px)`,
                    left: `calc(50% - ${profileSize / 2}px)`,
                    transform: `rotate(${rotation}deg) translateY(-${containerRadius}px)`,
                    transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      transform: `rotate(${-rotation}deg)`,
                      transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      width: "100%",
                      height: "100%"
                    }}
                  >
                    <div
                      onClick={() => handleProfileClick(i)}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        boxShadow: isActive 
                          ? "0 20px 25px -5px rgba(0,0,0,0.2), 0 0 0 4px #f97316, 0 0 0 6px #fed7aa"
                          : "0 10px 15px -3px rgba(0,0,0,0.1)",
                        border: isActive ? "4px solid #f97316" : "3px solid #fed7aa"
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0,0,0,0.2)";
                          e.currentTarget.style.border = "3px solid #f97316";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1)";
                          e.currentTarget.style.border = "3px solid #fed7aa";
                        }
                      }}
                    >
                      <Image
                        src={getImageSrc(item)}
                        alt={item.name}
                        width={profileSize}
                        height={profileSize}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(item.id)}
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}