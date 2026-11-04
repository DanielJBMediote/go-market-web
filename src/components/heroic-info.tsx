"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroList {
  title: string;
  descriptions: string[];
  imageSrc: string;
}

const heroicList: HeroList[] = [
  {
    title: "Total Control of Your Shop",
    descriptions: [
      "💼 Manage your business simply and efficiently!",
      "📦 Register, edit and organize your products and stock in just a few clicks.",
      "🚀 Access everything in real time and make faster decisions to increase your sales!",
    ],
    imageSrc: "/dashboard-slide.svg",
  },
  {
    title: "Smart Reports",
    descriptions: [
      "📊 Get valuable data on your sales and performance",
      "💰 Track turnover, orders and stock with interactive graphs.",
      "🎯 Discover opportunities to sell more and grow your business!",
    ],
    imageSrc: "/report-slide.svg",
  },
  {
    title: "Real-time Orders & Customers",
    descriptions: [
      "🔔 Never miss an order!",
      "👥 Manage your customers' purchases practically and efficiently.",
      "📍 Get instant updates on orders, delivery status, and payments!",
    ],
    imageSrc: "/catalog-slide.svg",
  },
  {
    title: "Orders and Customers in Real Time",
    descriptions: [
      "🔔 Never miss an order!",
      "👥 Manage your customers' purchases in a practical and organized way.",
      "📍 Instant updates on orders, delivery status and payments!",
    ],
    imageSrc: "/onlinestore-slide.svg",
  },
];

export function HeroicInfo() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroicList.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-transparent border-none">
      <CardContent className="flex items-center space-x-10 justify-center p-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-10"
          >
            <div className="space-y-6 p-6 w-xl">
              <p className="text-5xl font-extrabold text-foreground">
                {heroicList[currentSlide].title}
              </p>
              <div className="space-y-2">
                {heroicList[currentSlide].descriptions.map((desc) => (
                  <p key={desc} className="text-accent-foreground font-medium">
                    {desc}
                  </p>
                ))}
              </div>
            </div>
            <Image
              src={heroicList[currentSlide].imageSrc}
              alt=""
              width={500}
              height={500}
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
