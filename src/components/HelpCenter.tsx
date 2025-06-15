
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search, MessageCircle, Book, Mail } from 'lucide-react';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpCenter = ({ isOpen, onClose }: HelpCenterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  const faqItems = [
    {
      question: "How do I create a new project?",
      answer: "Click the 'Create New Project' button on your dashboard and follow the step-by-step project brief form. You'll need to provide project details, budget, timeline, and specific requirements for AI creators."
    },
    {
      question: "How does the matching process work?",
      answer: "Our AI algorithm matches your project with qualified creators based on their expertise, portfolio, availability, and your specific requirements. You'll receive 3-5 matched creators to choose from."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. Payments are held in escrow until you approve the final deliverables."
    },
    {
      question: "How do I request revisions?",
      answer: "In your project workroom, click 'Request Revisions' and provide detailed feedback about what changes you'd like. Most creators include 2-3 revision rounds in their base price."
    },
    {
      question: "What if I'm not satisfied with the final result?",
      answer: "We offer a satisfaction guarantee. If you're not happy with the final deliverables, contact our support team and we'll work with you and the creator to resolve the issue or provide a refund."
    }
  ];

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Help Center</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowContactForm(true)}>
              <CardContent className="p-4 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium">Contact Support</h3>
                <p className="text-sm text-gray-600">Get help from our team</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Book className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium">User Guide</h3>
                <p className="text-sm text-gray-600">Learn how to use the platform</p>
              </CardContent>
            </Card>
          </div>

          {showContactForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <Input placeholder="What can we help you with?" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <Textarea 
                    placeholder="Please describe your issue or question in detail..."
                    rows={4}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowContactForm(false)}>Send Message</Button>
                  <Button variant="outline" onClick={() => setShowContactForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFAQs.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600">support@creators.now</p>
                        <Badge variant="secondary" className="mt-1">24-48h response</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpCenter;

