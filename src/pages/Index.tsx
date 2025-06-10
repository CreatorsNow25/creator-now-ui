import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Play, ArrowRight, Star, Users, Zap, Shield, CheckCircle, Facebook, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContactForm from '@/components/ContactForm';

const Index = () => {
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);

  const creators = [
    {
      name: "Alex T.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: 4.9,
      specialty: "Sci-Fi Trailers",
      thumbnail: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=200&h=120&fit=crop"
    },
    {
      name: "Sarah C.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&h=80&fit=crop&crop=face",
      rating: 4.8,
      specialty: "Fantasy Adventures",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=120&fit=crop"
    },
    {
      name: "Jordan K.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: "New",
      specialty: "Drama & Thriller",
      thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=120&fit=crop"
    }
  ];

  const testimonials = [
    {
      name: "Emily R.",
      role: "Indie Filmmaker",
      content: "Found the perfect creator for my sci-fi short. The AI trailer exceeded all expectations!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Marcus R.",
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
              Storyteller
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3"
            >
              AI Creator
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
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
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
              Storyteller
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-3"
            >
              AI Creator
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black-section py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
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
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">For Creators</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Join As Creator</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
                <li><button onClick={() => setShowContactForm(true)} className="hover:text-white text-left">Contact Us</button></li>
              </ul>
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq" className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">FAQ</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="what-is">
                <AccordionTrigger className="text-white hover:text-gray-300">What Is Creators Now?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Creators Now is a two-sided marketplace that connects storytellers with experienced AI Creators who specialize in producing trailers, short films, and visual concepts using generative tools.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="storytellers">
                <AccordionTrigger className="text-white hover:text-gray-300">Who Are Storytellers?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Storytellers are screenwriters, filmmakers, producers, or anyone with a story to tell.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="ai-creators">
                <AccordionTrigger className="text-white hover:text-gray-300">Who Are AI Creators?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  AI Creators are visual artists and technologists who use tools like Runway, Pika, Sora, Midjourney, ElevenLabs, and others.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="how-it-works">
                <AccordionTrigger className="text-white hover:text-gray-300">How Does The Platform Work?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Storytellers browse AI Creators</li>
                    <li>Send a direct message or request a proposal</li>
                    <li>Collaborate in-platform</li>
                    <li>Final delivery and payment handled inside the platform</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="what-can-be-created">
                <AccordionTrigger className="text-white hover:text-gray-300">What Can Be Created?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <ul className="list-disc list-inside space-y-1">
                    <li>AI-generated trailers</li>
                    <li>Mood reels</li>
                    <li>Visual treatments</li>
                    <li>Animated shorts</li>
                    <li>Music videos</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="cost">
                <AccordionTrigger className="text-white hover:text-gray-300">How Much Does It Cost?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Storytellers pay a 15% platform fee</li>
                    <li>AI Creators keep 95% of their earnings</li>
                    <li>New AI Creators may qualify for 0% platform fee for 90 days</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="ownership">
                <AccordionTrigger className="text-white hover:text-gray-300">Who Owns The Final Work?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Ownership is defined in the proposal and confirmed on project start. Storytellers typically own final deliverables; AI Creators can showcase work unless told otherwise.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="tools">
                <AccordionTrigger className="text-white hover:text-gray-300">What Tools Do AI Creators Use?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Common tools: Runway, Pika, Sora, Stable Diffusion, Midjourney, ElevenLabs, Kaiber, etc.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="international">
                <AccordionTrigger className="text-white hover:text-gray-300">Is It International?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes. Payments are handled via Stripe.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="payments">
                <AccordionTrigger className="text-white hover:text-gray-300">How Do Payments Work?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Project is funded up front</li>
                    <li>Funds held in escrow</li>
                    <li>Released upon approval</li>
                    <li>Stripe handles secure payments</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="become-creator">
                <AccordionTrigger className="text-white hover:text-gray-300">How Do I Become An AI Creator?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Click "AI Creator," complete onboarding, upload your portfolio.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="showcase">
                <AccordionTrigger className="text-white hover:text-gray-300">Can Creators Showcase Their Work?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes, portfolio uploads are encouraged and help with visibility.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="prohibited">
                <AccordionTrigger className="text-white hover:text-gray-300">What Content Is Prohibited?</AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  No illegal, violent, hateful, or explicit non-consensual content. Public NSFW content is not allowed.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* TOS Section */}
          <div id="terms" className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Terms of Service</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="terms-full">
                <AccordionTrigger className="text-white hover:text-gray-300">Terms of Service</AccordionTrigger>
                <AccordionContent className="text-gray-300 space-y-4">
                  <p className="font-medium">Last Updated: {new Date().getFullYear()}</p>
                  <p>By accessing or using Creators Now, you agree to these Terms. If you do not agree, do not use the platform.</p>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">1. About The Platform</h4>
                    <p>Creators Now is a marketplace connecting Storytellers (clients) with AI Creators (freelancers) for the production of AI-powered media content such as trailers, short films, and creative assets.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">2. Account Registration</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Users must be 18 years or older to use the platform.</li>
                      <li>All account information must be accurate, complete, and updated regularly.</li>
                      <li>Creators Now reserves the right to suspend or terminate accounts for any violation of these Terms or applicable laws.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">3. Fees & Payments</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Storytellers pay a 15% platform fee in addition to the Creator's quoted price.</li>
                      <li>AI Creators keep 95% of their earnings; a 5% platform fee applies.</li>
                      <li>All payments are securely processed via Stripe.</li>
                      <li>Funds may be held in escrow until project milestones or final deliverables are confirmed.</li>
                      <li>Refund and chargeback requests are reviewed on a case-by-case basis.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">4. Project Scope & Revisions</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Storytellers must provide a clear project brief and any necessary materials upfront.</li>
                      <li>AI Creators must deliver agreed-upon work according to the brief and deadlines.</li>
                      <li>Creators Now may mediate disputes over deliverables or revisions but is not responsible for final project outcomes.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">5. Intellectual Property</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Upon full payment, Storytellers own the rights to final deliverables unless otherwise agreed in writing.</li>
                      <li>AI Creators retain the right to showcase work in their portfolio unless the client requests otherwise.</li>
                      <li>All users are responsible for ensuring they have the legal right to any content or assets uploaded to the platform.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">6. Platform Rules</h4>
                    <p>You may not use Creators Now to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Harass, abuse, or impersonate others</li>
                      <li>Solicit payments or contact outside the platform</li>
                      <li>Post spam, misleading content, or engage in fraudulent behavior</li>
                      <li>Violate any applicable law or regulation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">7. Limitation Of Liability</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Creators Now is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of the platform.</li>
                      <li>The platform is provided "as is" and without warranties of any kind, express or implied.</li>
                      <li>We do not guarantee uninterrupted service or error-free operation.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">8. Termination</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>You may delete your account at any time.</li>
                      <li>We reserve the right to suspend or terminate access without notice for behavior that violates our policies, disrupts the platform, or involves fraudulent or illegal activity.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">9. Modifications</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>We may update these Terms at any time.</li>
                      <li>Continued use of the platform after changes take effect indicates your acceptance of the new Terms.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">10. Contact</h4>
                    <p>Questions? Reach us at: info@creators.now</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">11. Content Restrictions</h4>
                    <p>You may not upload, create, or distribute content that:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Violates any local, state, federal, or international laws or regulations</li>
                      <li>Promotes or glorifies hate, violence, exploitation, or discrimination</li>
                      <li>Includes sexually explicit material involving minors or non-consensual acts</li>
                    </ul>
                    <p className="mt-2">Creators Now reserves the right to determine, at its sole discretion, whether content violates these rules.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Social Media Links */}
          <div className="mb-8">
            <h4 className="font-bold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://x.com/joincreatorsnow" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              </a>
              <a href="https://instagram.com/joincreatorsnow" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com/@joincreatorsnow" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.204-1.864-1.204-2.804V1H12.68v14.66c0 .917-.283 1.793-.82 2.535a4.37 4.37 0 01-2.24 1.629c-.897.309-1.864.309-2.761 0a4.37 4.37 0 01-2.24-1.629c-.537-.742-.82-1.618-.82-2.535 0-.917.283-1.793.82-2.535a4.37 4.37 0 012.24-1.629c.448-.154.923-.231 1.398-.231v-3.89c-1.381.077-2.716.464-3.89 1.127-1.174.664-2.145 1.635-2.808 2.808C.674 12.644.287 13.98.21 15.36v.3c0 2.12.84 4.156 2.34 5.66C4.05 22.82 6.086 23.66 8.206 23.66s4.156-.84 5.66-2.34c1.5-1.504 2.34-3.54 2.34-5.66V8.542a9.1 9.1 0 005.115 1.55V6.235c-.795-.077-1.55-.385-2.145-.964-.595-.58-.964-1.35-.964-2.145-.077-.232-.154-.463-.231-.695z"></path></svg>
              </a>
              <a href="https://threads.net/@joincreatorsnow" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.001 1.5 8.416 2.35 5.562 3.995 3.51 5.845 1.205 8.598.024 12.179 0h.014c3.581.024 6.334 1.205 8.184 3.509C21.65 5.56 22.5 8.414 22.5 11.999c0 3.585-.85 6.439-2.495 8.49-1.85 2.305-4.603 3.486-8.184 3.51zm5.267-13.566c-.684-5.207-3.88-8.77-7.454-8.77s-6.77 3.563-7.454 8.77c.684 5.207 3.88 8.77 7.454 8.77s6.77-3.563 7.454-8.77z"></path></svg>
              </a>
              <a href="https://facebook.com/joincreatorsnow" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Creators Now. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Contact Form Modal */}
      {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
    </div>
  );
};

export default Index;
