'use client'

import Link from 'next/link'
import { ArrowRight, Star, Clock, Truck, Shield, ChefHat } from 'lucide-react'
import Button from '@/components/ui/Button'
import Banner from '@/components/Banner'
import SpecialOffers from '@/components/SpecialOffers'
import PopularItemsDynamic from '@/components/PopularItemsDynamic'
import TopCuisineDynamic from '@/components/TopCuisineDynamic'
import MarqueeSection from '@/components/MarqueeSection'
import FoodCompare from '@/components/FoodCompare'
import PopularBlogs from '@/components/PopularBlogs'
import RestaurantSection from '@/components/RestaurantSection'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import FAQSection from '@/components/FAQSection'
import OurPartner from '@/components/OurPartner'
import CustomersReview from '@/components/CustomersReview'

export default function HomePage() {


  return (
    <div className="min-h-screen">

      <Banner />
      <SpecialOffers />
      <PopularItemsDynamic />
      <TopCuisineDynamic />
      <MarqueeSection />
      <FoodCompare />
      <PopularBlogs />
      <RestaurantSection />
      <Stats />
      <Services />
      <FAQSection />
      <OurPartner />
      <CustomersReview />
    </div>
  )
}