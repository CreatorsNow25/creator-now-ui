
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, ArrowRight, Star, Users, Zap, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const creators = [
    {
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: 4.9,
      specialty: "Sci-Fi Trailers",
      thumbnail: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=200&h=120&fit=crop"
    },
    {
      name: "Maya Patel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
      rating: 4.8,
      specialty: "Fantasy Adventures",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=120&fit=crop"
    },
    {
      name: "Jordan Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      rating: "New",
      specialty: "Drama & Thriller",
      thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=120&fit=crop"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Indie Filmmaker",
      content: "Found the perfect creator for my sci-fi short. The AI trailer exceeded all expectations!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      role: "Content Creator",
      content: "As a creator, this platform helps me showcase my work and find amazing projects.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-black-section sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold text-white">Creators Now</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/auth')} className="text-white hover:text-black">
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')} className="bg-white text-black hover:bg-gray-200">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-black-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Connect With AI Creators.
            <br />
            <span className="text-gray-300">Bring Your Story To Life.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The marketplace where storytellers meet talented AI creators to produce cinematic trailers, 
            short films, and visual content that captivates audiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3"
            >
              Join As A Storyteller
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="text-white border-white hover:bg-white hover:text-black text-lg px-8 py-3"
            >
              Join As An AI Creator
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-black mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">1. Discover Talent</h3>
              <p className="text-gray-600">Browse portfolios of AI creators who specialize in film trailers, shorts, and story-driven visuals.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">2. Collaborate Seamlessly</h3>
              <p className="text-gray-600">Chat, exchange drafts, and shape your vision together in real time.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">3. Approve And Get Paid</h3>
              <p className="text-gray-600">Once the final cut is approved, payment is released and both sides leave a review.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated AI Creators */}
      <section className="py-20 bg-black-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Top Rated AI Creators</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {creators.map((creator, index) => (
              <Card key={index} className="bg-dark-card text-white">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <img 
                      src={creator.thumbnail}
                      alt={creator.specialty}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <img 
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-white">{creator.name}</h3>
                      <p className="text-sm text-gray-300">{creator.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-white text-white" />
                    <span className="font-medium text-white">
                      {creator.rating === "New" ? "New" : creator.rating}
                    </span>
                    <Badge variant="secondary" className="bg-gray-700 text-white">Pro</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-black mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4">{testimonial.content}</p>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-black">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 bg-black-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-16">Built For Trust & Security</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Escrow Protection</h3>
              <p className="text-gray-300">Your payments are protected until you're 100% satisfied.</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Verified Creators</h3>
              <p className="text-gray-300">All creators are vetted and verified for quality work.</p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Review System</h3>
              <p className="text-gray-300">Transparent reviews help you make informed decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Ready To Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of storytellers and creators bringing amazing projects to life.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-3"
            >
              Join As A Storyteller
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="text-black border-black hover:bg-black hover:text-white text-lg px-8 py-3"
            >
              Join As An AI Creator
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black-section py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-black" />
                </div>
                <span className="text-xl font-bold text-white">Creators Now</span>
              </div>
              <p className="text-gray-300">Connecting storytellers with AI creators worldwide.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">For Storytellers</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Browse Creators</a></li>
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">For Creators</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Join As Creator</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
                <li><a href="#" className="hover:text-white">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Terms & Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Creators Now. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
