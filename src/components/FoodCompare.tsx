"use client";
import React from "react";
import ReactCompareImage from "react-compare-image";

export default function FoodCompare() {
    return (
        <section>
            <div className=" container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                {/* Left Side Content */}
                <div>
                    {/* CHANGED: text-white to text-gray-900 */}
                    <h2 className="text-4xl text-gray-900 lg:text-5xl font-extrabold leading-tight mb-6">
                        Nothing But <br />
                        The <span className="text-orange-600">Best Ingredients</span>
                    </h2>
                    {/* CHANGED: text-white to text-gray-700 */}
                    <p className="text-lg leading-relaxed text-gray-700 max-w-xl mb-10">
                        We believe great food starts with great ingredients. That’s why we
                        use only the freshest produce, quality grains, and carefully
                        sourced proteins for every recipe.
                    </p>
                </div>

                {/* Right Side Compare Slider */}
                <div className="relative w-full h-full shadow-md rounded-lg overflow-hidden">
                    <ReactCompareImage
                        leftImage="https://i.ibb.co.com/jvm9VWcv/raw-meet-in-bowl-with-some-spices-prepared-for-cook-in-white-background.jpg"
                        rightImage="https://i.ibb.co.com/5hNKqbQc/mutton-curry-in-bowl-in-white-background-upper-view.jpg"
                        sliderLineColor="#ffffff"
                        handleSize={40}
                        sliderPositionPercentage={0.5}
                    />

                    {/* Labels */}
                    <span className="absolute top-4 left-4 text-orange-600 font-semibold text-sm bg-white/70 px-2 py-1 rounded">
                        Using...
                    </span>
                    <span className="absolute top-4 right-4 text-orange-600 font-semibold text-sm bg-white/70 px-2 py-1 rounded">
                        You Feed...
                    </span>
                </div>
            </div>
        </section>
    );
}