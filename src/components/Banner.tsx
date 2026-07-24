"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Swiper as SwiperType } from 'swiper';

// ✅ FIX: Use single CSS import
import 'swiper/swiper-bundle.css';

// Types
interface SlideContent {
    image: string;
    title: ReactNode;
    description: string;
}

// SVG Icons
const LocationIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#FF7E8B"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        className="mr-2 flex-shrink-0"
    >
        <path d="M10.2 0.42c-4.5 0-8.2 3.7-8.2 8.3 0 6.2 7.5 11.3 7.8 11.6 0.2 0.1 0.3 0.1 0.4 0.1s0.3 0 0.4-0.1c0.3-0.2 7.8-5.3 7.8-11.6 0.1-4.6-3.6-8.3-8.2-8.3zM10.2 11.42c-1.7 0-3-1.3-3-3s1.3-3 3-3c1.7 0 3 1.3 3 3s-1.3 3-3 3z"></path>
    </svg>
);

const CaretDownIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#4F4F4F"
        width="12"
        height="12"
        viewBox="0 0 20 20"
        className="flex-shrink-0"
    >
        <path d="M20 5.42l-10 10-10-10h20z"></path>
    </svg>
);

const SearchIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#828282"
        width="18"
        height="18"
        viewBox="0 0 20 20"
        className="mr-2 flex-shrink-0"
    >
        <path d="M19.78 19.12l-3.88-3.9c1.28-1.6 2.080-3.6 2.080-5.8 0-5-3.98-9-8.98-9s-9 4-9 9c0 5 4 9 9 9c2.2 0 4.2-0.8 5.8-2.1l3.88 3.9c0.1 0.1 0.3 0.2 0.5 0.2s0.4-0.1 0.5-0.2c0.4-0.3 0.4-0.8 0.1-0.1zM1.5 9.42c0-4.1 3.4-7.5 7.5-7.5s7.48 3.4 7.48 7.5-3.38 7.5-7.48 7.5c-4.1 0-7.5-3.4-7.5-7.5z"></path>
    </svg>
);

const ClearIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#FFFFFF"
        width="16"
        height="16"
        viewBox="0 0 20 20"
        className="flex-shrink-0"
    >
        <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"></path>
    </svg>
);

const ScrollDownIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="ml-2 flex-shrink-0"
    >
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
    </svg>
);

// Voice Search Icons
const MicIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#FFFFFF"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className="flex-shrink-0"
    >
        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
    </svg>
);

const ListeningIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#4CAF50"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className="flex-shrink-0 animate-pulse"
    >
        <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14S10 13.1 10 12V4C10 2.9 10.9 2 12 2ZM17 12C17 14.8 14.8 17 12 17S7 14.8 7 12H5C5 15.9 8.1 19 12 19S19 15.9 19 12H17Z" />
    </svg>
);

// Slider content
const sliderContent: SlideContent[] = [
    {
        image: "/banner1.webp",
        title: (
            <>
                Endless
                <span className="text-orange-600"> Choices, Delivered </span>Fast
            </>
        ),
        description:
            "From burgers to biryani, pizza to pasta - discover new favorites and old classics with FastFeast delivery.",
    },
    {
        image: "/banner2.webp",
        title: (
            <>
                Craving Something
                <span className="text-orange-600"> Delicious?</span>
            </>
        ),
        description:
            "Get your favorite meals delivered in minutes. From local favorites to international cuisine, FastFeast brings the feast to you!",
    },
    {
        image: "/banner3.webp",
        title: (
            <>
                <span className="text-orange-600">Fast</span> Food,{" "}
                <span className="text-orange-600">Feast</span> Quality
            </>
        ),
        description:
            "Experience the perfect blend of speed and quality. Fresh ingredients, amazing flavors, delivered when you're hungry.",
    },
];

// Extend Window interface for Speech Recognition
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const Banner = () => {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
    const [isListening, setIsListening] = useState<boolean>(false);
    const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(false);
    const [transcript, setTranscript] = useState<string>("");
    const [activeSlide, setActiveSlide] = useState<number>(0);

    const recognitionRef = useRef<any>(null);
    const locationDropdownRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    const availableLocations = useMemo<string[]>(
        () => ["Dhanmondi", "Mirpur", "Uttara", "Banani", "Gulshan"],
        []
    );

    useEffect(() => {
        let isMounted = true;

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (isMounted) {
            setIsSpeechSupported(!!SpeechRecognition);
        }

        if (SpeechRecognition && isMounted) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event: any) => {
                if (!isMounted) return;
                const currentTranscript = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join("");
                setTranscript(currentTranscript);
                setSearchQuery(currentTranscript);
            };

            recognitionRef.current.onend = () => {
                if (!isMounted) return;
                setIsListening(false);
                setTranscript("");
            };

            recognitionRef.current.onerror = (event: any) => {
                if (!isMounted) return;
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
                setTranscript("");
            };
        }

        return () => {
            isMounted = false;
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore errors
                }
                recognitionRef.current = null;
            }
        };
    }, []);

    const handleLocationSelect = useCallback(
        (selectedLocation: string) => {
            setLocation(selectedLocation);
            setIsLocationOpen(false);
        },
        []
    );

    const handleSearch = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
            if (e.type === "keydown") {
                const keyboardEvent = e as React.KeyboardEvent<HTMLInputElement>;
                if (keyboardEvent.key !== "Enter") return;
            }
            if (searchQuery || location) {
                const params = new URLSearchParams();
                if (searchQuery) params.append('search', searchQuery);
                if (location) params.append('location', location);
                router.push(`/menus?${params.toString()}`);
            }
        },
        [router, searchQuery, location]
    );

    const handleExploreMenu = useCallback(() => {
        router.push("/menus");
    }, [router]);

    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
    }, []);

    const handleClearLocation = useCallback(() => {
        setLocation("");
    }, []);

    const clearAllFilters = useCallback(() => {
        setSearchQuery("");
        setLocation("");
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setTranscript("");
            } catch (error) {
                console.error("Error starting speech recognition:", error);
                setIsListening(false);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                locationDropdownRef.current &&
                !locationDropdownRef.current.contains(event.target as Node)
            ) {
                setIsLocationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleScrollDown = useCallback(() => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
        });
    }, []);

    const hasActiveFilters = useMemo(
        () => !!(searchQuery || location),
        [searchQuery, location]
    );

    useEffect(() => {
        return () => {
            if (swiperRef.current) {
                swiperRef.current.destroy(true, true);
                swiperRef.current = null;
            }
        };
    }, []);

    const handleSlideChange = useCallback((swiper: SwiperType) => {
        setActiveSlide(swiper.activeIndex);
    }, []);

    const handleSwiperInit = useCallback((swiper: SwiperType) => {
        swiperRef.current = swiper;
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                effect={"fade"}
                fadeEffect={{
                    crossFade: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                speed={1200}
                modules={[Autoplay, EffectFade]}
                className="h-full w-full"
                onSlideChange={handleSlideChange}
                onSwiper={handleSwiperInit}
            >
                {sliderContent.map((slide, index) => (
                    <SwiperSlide key={index} className="relative">
                        <div className="absolute inset-0 overflow-hidden">
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-[10s] ease-out will-change-transform"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                    transform: "scale(1.1)",
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/20"></div>
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                            <AnimatePresence mode="wait">
                                {activeSlide === index && (
                                    <motion.div
                                        key={`content-${index}`}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -50 }}
                                        transition={{ duration: 0.8 }}
                                        style={{
                                            textAlign: "center",
                                            marginBottom: "2rem",
                                        }}
                                    >
                                        <motion.h1
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                            style={{
                                                fontSize: "clamp(1.5rem, 4vw, 3rem)",
                                                fontWeight: "bold",
                                                marginBottom: "1rem",
                                                lineHeight: "1.2",
                                                color: "white",
                                            }}
                                        >
                                            {slide.title}
                                        </motion.h1>

                                        <motion.p
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.4 }}
                                            style={{
                                                marginBottom: "1.5rem",
                                                opacity: 0.9,
                                                color: "white",
                                                maxWidth: "42rem",
                                                marginLeft: "auto",
                                                marginRight: "auto",
                                            }}
                                        >
                                            {slide.description}
                                        </motion.p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="w-full max-w-3xl">
                                <div className="flex w-full items-center rounded-lg bg-orange-500/50 backdrop-blur-sm p-3 shadow-lg">
                                    <div className="relative w-2/5" ref={locationDropdownRef}>
                                        <div
                                            className="flex items-center pr-2 cursor-pointer"
                                            onClick={() => setIsLocationOpen(!isLocationOpen)}
                                        >
                                            <LocationIcon />
                                            <input
                                                type="text"
                                                placeholder="Select Location"
                                                value={location}
                                                readOnly
                                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white cursor-pointer"
                                            />
                                            <CaretDownIcon />
                                        </div>

                                        {isLocationOpen && (
                                            <div className="absolute top-full mt-2 w-full rounded-md bg-orange-500/90 shadow-lg z-10 border border-orange-500/30">
                                                <ul>
                                                    {availableLocations.map((loc) => (
                                                        <li
                                                            key={loc}
                                                            onClick={() => handleLocationSelect(loc)}
                                                            className="px-4 py-2 text-sm text-white hover:bg-orange-600 cursor-pointer"
                                                        >
                                                            {loc}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-6 border-l border-gray-300"></div>

                                    <div className="flex flex-1 items-center pl-4">
                                        <SearchIcon />
                                        <input
                                            type="text"
                                            placeholder="Search for restaurant, cuisine or a dish"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={handleSearch}
                                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white"
                                        />

                                        {isSpeechSupported && (
                                            <button
                                                onClick={toggleListening}
                                                className={`ml-2 p-1 rounded-full transition-all duration-300 ${isListening
                                                    ? "bg-green-500 hover:bg-green-600"
                                                    : "bg-white/20 hover:bg-white/30"
                                                    }`}
                                                aria-label={
                                                    isListening ? "Stop listening" : "Start voice search"
                                                }
                                            >
                                                {isListening ? <ListeningIcon /> : <MicIcon />}
                                            </button>
                                        )}
                                    </div>

                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="ml-2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                                            aria-label="Clear filters"
                                        >
                                            <ClearIcon />
                                        </button>
                                    )}
                                </div>

                                {isListening && (
                                    <div className="mt-2 text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <p className="text-green-300 text-sm font-medium">
                                                Listening... {transcript && `"${transcript}"`}
                                            </p>
                                            <button
                                                onClick={stopListening}
                                                className="text-green-300 hover:text-white text-xs underline"
                                            >
                                                Stop
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {hasActiveFilters && !isListening && (
                                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                                        {searchQuery && (
                                            <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                                                <span>Search: {searchQuery}</span>
                                                <button
                                                    onClick={handleClearSearch}
                                                    className="ml-1"
                                                    aria-label="Clear search"
                                                >
                                                    <ClearIcon />
                                                </button>
                                            </div>
                                        )}
                                        {location && (
                                            <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                                                <span>Location: {location}</span>
                                                <button
                                                    onClick={handleClearLocation}
                                                    className="ml-1"
                                                    aria-label="Clear location"
                                                >
                                                    <ClearIcon />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-4 mt-8 justify-center">
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleSearch}
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                                    >
                                        Search Now
                                    </button>
                                )}

                                <button
                                    onClick={handleExploreMenu}
                                    className="relative inline-flex cursor-pointer items-center px-12 py-3 overflow-hidden text-lg font-medium text-orange-600 border-2 border-orange-600 rounded-full hover:text-white group hover:bg-gray-50"
                                >
                                    <span className="absolute left-0 block w-full h-0 transition-all bg-orange-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-500 ease"></span>
                                    <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span className="relative">Explore Menu</span>
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div
                className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex animate-bounce cursor-pointer items-center"
                onClick={handleScrollDown}
            >
                <div className="text-sm text-white xl:text-base 2xl:text-lg flex items-center">
                    Scroll down
                    <ScrollDownIcon />
                </div>
            </div>
        </section>
    );
};

export default Banner;