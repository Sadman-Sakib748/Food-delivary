import Link from 'next/link'
import { ArrowRight, Star, Clock, Truck, Shield } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function HomePage() {
  const features = [
    { icon: Clock, title: 'Fast Delivery', description: 'Get your food delivered in 30 minutes or less' },
    { icon: Star, title: 'Top Restaurants', description: 'Choose from the best restaurants in your area' },
    { icon: Truck, title: 'Free Delivery', description: 'Free delivery on orders over $20' },
    { icon: Shield, title: 'Secure Payment', description: '100% secure payment with multiple options' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Order Food from Your{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                Favorite Restaurants
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Discover the best food & drinks in your area. Order now and get it delivered to your doorstep.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/restaurants">
                <Button size="lg">
                  Order Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-500">Restaurants</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">50K+</p>
                <p className="text-sm text-gray-500">Orders Delivered</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl p-8 text-white text-center">
              <div className="text-6xl mb-4">🍕</div>
              <h3 className="text-2xl font-bold">Delicious Food</h3>
              <p className="mt-2">Order now and get 20% off your first order!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why Choose Us?</h2>
          <p className="text-center text-gray-600 mb-12">We make ordering food easy, fast, and reliable</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}