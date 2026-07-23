'use client'

import Link from 'next/link'
import { ArrowRight, Star, Clock, Truck, Shield, ChefHat } from 'lucide-react'
import Button from '@/components/ui/Button'
import Banner from '@/components/Banner'
import SpecialOffers from '@/components/SpecialOffers'
import PopularItemsDynamic from '@/components/PopularItemsDynamic'
import TopCuisineDynamic from '@/components/TopCuisineDynamic'
import MarqueeSection from '@/components/MarqueeSection'

export default function HomePage() {


  return (
    <div className="min-h-screen">

      <Banner />
      <SpecialOffers />
      <PopularItemsDynamic />
      <TopCuisineDynamic />
      <MarqueeSection />
    </div>
  )
}