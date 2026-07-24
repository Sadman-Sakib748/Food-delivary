"use client";

import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import Image from "next/image";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How fast is the delivery?",
    answer:
      "Average delivery times in your area are displayed for each restaurant before you order, typically ranging from 25-45 minutes.",
  },
  {
    question: "How can I place an order?",
    answer:
      "You can place an order through our website or mobile app. Simply browse restaurants, choose your meal, add it to the cart, and proceed to checkout.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards, mobile banking services like bKash and Nagad, and also offer Cash on Delivery (COD) in most areas.",
  },
  {
    question: "Can I track my order in real-time?",
    answer:
      "Absolutely! Once your order is confirmed and a rider is assigned, you'll receive a live tracking link to monitor your delivery's progress on a map until it reaches your doorstep.",
  },
  {
    question: "What if there's an issue with my order?",
    answer:
      "We're here to help! You can contact our customer support team directly through the app's help section. We'll work to resolve any issues with your order as quickly as possible.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white mb-6">
              Frequently Asked <span className="text-orange-600">Questions</span>
            </h2>

            <div className="space-y-2 cursor-pointer">
              {faqs.map((faq: FAQ, index: number) => (
                <div 
                  key={index} 
                  className="transition-all cursor-pointer duration-300 hover:shadow-md rounded-lg overflow-hidden bg-white border border-gray-100"
                >
                  <button
                    className="w-full flex justify-between items-center p-4 sm:p-5 text-left font-medium text-gray-800 hover:bg-orange-50 transition-colors duration-200"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openIndex === index}
                  >
                    <span className="text-base hover:text-orange-600 sm:text-lg transition-colors duration-200">
                      {faq.question}
                    </span>
                    <IoChevronForward
                      className={`h-5 w-5 text-gray-800 hover:text-orange-600 transition-transform duration-300 flex-shrink-0 ${
                        openIndex === index ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                      openIndex === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-600 text-sm sm:text-base">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Full Height Image */}
          <div className="relative w-full h-full min-h-[400px] md:min-h-[600px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://i.ibb.co/jZ5HNJ7s/FAQ-in-orange-for-food-quary-in-a-website-faq-section-1.jpg"
              alt="FAQ Illustration - Food delivery questions and answers"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}