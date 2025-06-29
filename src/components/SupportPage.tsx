import React, { useState } from 'react';
import { 
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  Book,
  Video,
  Users,
  Search,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Heart,
  Shield,
  Zap,
  Globe,
  FileText,
  Headphones,
  Play
} from 'lucide-react';

interface SupportPageProps {
  onBackToWelcome: () => void;
}

export default function SupportPage({ onBackToWelcome }: SupportPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const supportCategories = [
    { id: 'all', label: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', label: 'Getting Started', icon: Star },
    { id: 'conversations', label: 'Conversations', icon: MessageCircle },
    { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
    { id: 'technical', label: 'Technical Issues', icon: Zap },
    { id: 'resources', label: 'Resources', icon: Book }
  ];

  const faqItems = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I start my first conversation with Bloom?',
      answer: 'Simply click the "Start Your First Conversation" button on the welcome screen. You can share how you\'re feeling using the emotion buttons or describe your feelings in your own words. Bloom will respond with empathy and ask thoughtful follow-up questions.',
      helpful: 24,
      views: 156
    },
    {
      id: 2,
      category: 'conversations',
      question: 'Can I continue a conversation later?',
      answer: 'Yes! All your conversations are automatically saved in the sidebar. You can access them anytime by clicking on "Conversations" in the left panel. Each conversation maintains its context and history.',
      helpful: 18,
      views: 89
    },
    {
      id: 3,
      category: 'privacy',
      question: 'Is my data private and secure?',
      answer: 'Absolutely. Your conversations are stored locally on your device and are never shared with third parties. We use end-to-end encryption for all data transmission, and you can delete your conversations at any time.',
      helpful: 42,
      views: 234
    },
    {
      id: 4,
      category: 'conversations',
      question: 'What is reflection depth and how does it work?',
      answer: 'Reflection depth measures how deeply you explore your feelings in a conversation. As you share more and reflect deeper, Bloom provides more personalized and insightful responses. Higher reflection depths often lead to more meaningful therapeutic insights.',
      helpful: 31,
      views: 167
    },
    {
      id: 5,
      category: 'technical',
      question: 'Why isn\'t the voice feature working?',
      answer: 'The voice feature requires a stable internet connection and browser permissions for audio. Make sure your browser allows audio playback and check your internet connection. You can also try refreshing the page or switching to a different browser.',
      helpful: 15,
      views: 78
    },
    {
      id: 6,
      category: 'resources',
      question: 'How do I bookmark insights and sources?',
      answer: 'Click the bookmark icon on any insight or source you want to save. Your bookmarks are accessible from the "Bookmarks" section in the sidebar, where you can organize and revisit your saved content.',
      helpful: 22,
      views: 134
    },
    {
      id: 7,
      category: 'privacy',
      question: 'Can I export or delete my conversation data?',
      answer: 'Yes, you have full control over your data. You can export your conversations from the settings menu, and you can delete individual conversations or all your data at any time. We believe in giving you complete ownership of your therapeutic journey.',
      helpful: 28,
      views: 198
    },
    {
      id: 8,
      category: 'getting-started',
      question: 'What makes Bloom different from other AI chatbots?',
      answer: 'Bloom is specifically designed for emotional support and mental health conversations. It uses therapeutic techniques like reflective listening, validation, and gentle questioning. Unlike general chatbots, Bloom focuses on creating a safe, judgment-free space for emotional exploration.',
      helpful: 35,
      views: 289
    }
  ];

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'Start a Conversation',
      description: 'Get immediate support by talking with Bloom',
      action: () => {
        // Navigate back to welcome and start conversation
        onBackToWelcome();
        setTimeout(() => {
          const event = new CustomEvent('navigate', { detail: { page: 'chat' } });
          window.dispatchEvent(event);
        }, 100);
      },
      color: 'from-primary-cta to-muted-teal-500'
    },
    {
      icon: Mail,
      title: 'Contact Support',
      description: 'Reach out to our human support team',
      action: () => {
        window.open('mailto:support@bloom.ai?subject=Bloom Support Request&body=Hi Bloom Support Team,%0D%0A%0D%0APlease describe your issue or question here:%0D%0A%0D%0A', '_blank');
      },
      color: 'from-accent-primary to-accent-dark'
    },
    {
      icon: Book,
      title: 'User Guide',
      description: 'Learn how to make the most of Bloom',
      action: () => {
        // Scroll to FAQ section
        const faqSection = document.getElementById('faq-section');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' });
        }
      },
      color: 'from-muted-teal-500 to-muted-teal-600'
    }
  ];

  const helpResources = [
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      items: ['Getting Started with Bloom', 'Understanding Reflection Depth', 'Privacy Settings'],
      color: 'red',
      action: () => {
        // Open YouTube or video platform
        window.open('https://www.youtube.com/results?search_query=mental+health+therapy+ai+tutorial', '_blank');
      }
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Detailed guides and references',
      items: ['User Manual', 'Privacy Policy', 'Terms of Service'],
      color: 'blue',
      action: () => {
        // Create and download a simple user manual
        const userManual = `
BLOOM USER MANUAL

Getting Started:
1. Click "Start Your First Conversation" on the welcome screen
2. Share how you're feeling using emotion buttons or your own words
3. Engage with Bloom's thoughtful responses and questions

Features:
- Private, secure conversations
- Emotional support and reflection
- Progress tracking and insights
- Community resources and bookmarks

Privacy:
- All conversations are stored locally on your device
- No data is shared with third parties
- You can delete conversations at any time

Support:
- Email: support@bloom.ai
- FAQ section in the Support page
- Crisis resources available 24/7

Remember: Bloom is here to support you, but is not a replacement for professional therapy when needed.
        `;
        
        const blob = new Blob([userManual], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bloom-user-manual.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with other users',
      items: ['Community Forum', 'Success Stories', 'Tips & Tricks'],
      color: 'green',
      action: () => {
        // Navigate to insights page to see community content
        const event = new CustomEvent('navigate', { detail: { page: 'insights' } });
        window.dispatchEvent(event);
      }
    }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-therapeutic-gradient">
      {/* Header */}
      <div className="border-b border-primary-cta/20 p-6 bg-therapeutic-pearl backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToWelcome}
                className="p-2 rounded-xl bg-primary-cta/10 hover:bg-primary-cta/20 text-primary-cta transition-all duration-200 hover:scale-105"
                title="Back to welcome"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-light bg-gradient-to-r from-primary-cta via-muted-teal-500 to-accent-primary bg-clip-text text-transparent">
                  Support Center
                </h1>
                <p className="text-therapy-gray-600 mt-1">
                  Get help, find answers, and learn how to make the most of Bloom
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle size={24} className="text-primary-cta" />
              <span className="text-sm text-therapy-gray-500">Here to help</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`
                    p-4 rounded-xl transition-all duration-300 hover:scale-105
                    bg-gradient-to-r ${action.color} text-white shadow-gentle hover:shadow-calm
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <IconComponent size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-sm text-white/80">{action.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              <div className="flex flex-wrap gap-2">
                {supportCategories.map(category => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategory === category.id;
                  const count = category.id === 'all' ? faqItems.length : faqItems.filter(item => item.category === category.id).length;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105
                        ${isSelected 
                          ? 'bg-gradient-to-r from-primary-cta to-muted-teal-500 text-white shadow-gentle' 
                          : 'bg-therapeutic-pearl hover:bg-white text-therapy-gray-600 border border-primary-cta/20'
                        }
                      `}
                    >
                      <IconComponent size={16} />
                      {category.label}
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs
                        ${isSelected ? 'bg-white/20 text-white' : 'bg-primary-cta/10 text-primary-cta'}
                      `}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-therapy-gray-400" />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-primary-cta/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-cta/30 bg-therapeutic-pearl backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12" id="faq-section">
            <div className="flex items-center gap-2 mb-6">
              <Info size={20} className="text-primary-cta" />
              <h2 className="text-2xl font-semibold text-therapy-gray-700">Frequently Asked Questions</h2>
            </div>

            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto mb-4 text-therapy-gray-400" />
                <h3 className="text-xl font-semibold text-therapy-gray-600 mb-2">No results found</h3>
                <p className="text-therapy-gray-500">
                  {searchQuery 
                    ? `No help articles match "${searchQuery}"`
                    : `No articles in this category`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map(item => (
                  <div
                    key={item.id}
                    className="p-6 bg-therapeutic-pearl border border-primary-cta/20 rounded-2xl hover:shadow-gentle transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-therapy-gray-700 pr-4">
                        {item.question}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-therapy-gray-500 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <CheckCircle size={14} className="text-green-500" />
                          {item.helpful} helpful
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          {formatViews(item.views)} views
                        </div>
                      </div>
                    </div>
                    <p className="text-therapy-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Help Resources */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Book size={20} className="text-muted-teal-500" />
              <h2 className="text-2xl font-semibold text-therapy-gray-700">Additional Resources</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {helpResources.map((resource, index) => {
                const IconComponent = resource.icon;
                
                return (
                  <div
                    key={index}
                    className="p-6 bg-therapeutic-pearl border border-primary-cta/20 rounded-2xl hover:shadow-gentle transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={resource.action}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center
                        ${resource.color === 'red' ? 'bg-red-100 text-red-600' :
                          resource.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }
                      `}>
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-therapy-gray-700">{resource.title}</h3>
                        <p className="text-sm text-therapy-gray-500">{resource.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {resource.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2 text-sm text-therapy-gray-600 hover:text-primary-cta transition-colors">
                          <ChevronRight size={14} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-primary-cta/10 to-accent-primary/10 border border-primary-cta/20 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="text-accent-primary" size={24} />
              <h2 className="text-2xl font-semibold text-therapy-gray-700">Still Need Help?</h2>
              <Heart className="text-accent-primary" size={24} />
            </div>
            <p className="text-therapy-gray-600 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you on your emotional wellness journey. 
              Don't hesitate to reach out if you need assistance or have questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open('mailto:support@bloom.ai?subject=Bloom Support Request&body=Hi Bloom Support Team,%0D%0A%0D%0APlease describe your issue or question here:%0D%0A%0D%0A', '_blank')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-cta to-muted-teal-500 hover:from-primary-cta-hover hover:to-muted-teal-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Mail size={18} />
                Email Support
              </button>
              <button
                onClick={() => {
                  // Navigate back to welcome and start conversation
                  onBackToWelcome();
                  setTimeout(() => {
                    const event = new CustomEvent('navigate', { detail: { page: 'chat' } });
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-therapeutic-pearl hover:bg-white border border-primary-cta/20 hover:border-primary-cta/40 text-therapy-gray-700 font-medium rounded-xl transition-all duration-300 hover:scale-105"
              >
                <MessageCircle size={18} />
                Talk to Bloom
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}