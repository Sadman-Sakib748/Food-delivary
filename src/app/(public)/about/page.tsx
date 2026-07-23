import { Users, Award, Truck, Heart } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function AboutPage() {
  const values = [
    { icon: Users, title: 'Customer First', description: 'We put our customers at the heart of everything we do.' },
    { icon: Award, title: 'Quality Food', description: 'We partner with the best restaurants to ensure quality.' },
    { icon: Truck, title: 'Fast Delivery', description: 'Quick and reliable delivery to your doorstep.' },
    { icon: Heart, title: 'Community', description: 'Building a community of food lovers and local businesses.' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
        <p className="text-xl text-gray-600 mt-2 max-w-2xl mx-auto">
          We're on a mission to connect people with the best food in their city
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            Founded in 2024, Food Delivery App was created with a simple vision: 
            to make ordering food easy, fast, and enjoyable. We believe that great 
            food should be accessible to everyone, and we're working hard to connect 
            people with the best restaurants in their area.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Today, we're proud to serve thousands of customers across the country, 
            partnering with hundreds of local restaurants to bring delicious meals 
            straight to your door.
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl p-8 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold">Serving Since 2024</h3>
            <p className="mt-2">10,000+ Happy Customers</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((value, index) => (
          <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <value.icon className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
            <p className="text-gray-600 text-sm">{value.description}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}