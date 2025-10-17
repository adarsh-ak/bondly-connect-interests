import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, MapPin, Calendar, Users, 
  Camera, Plus, TrendingUp, Bell, MessageSquare, Star,
  ChevronRight, Zap, Gift, Coffee, Music, BookOpen
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import CreatePost from './CreatePost';
import NecessaryServicesSection from './NecessaryServicesSection';

const EnhancedFeed = ({ user, navigate }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const posts = [
    {
      id: 1,
      user: { name: 'Sarah Chen', initials: 'SC', avatar: null },
      content: 'Just finished an amazing morning yoga session in the park! The sunrise was absolutely beautiful, and our group is growing every week. 🧘‍♀️',
      activity: 'Morning Yoga',
      location: 'Central Park',
      likes: 24,
      comments: 8,
      time: '2 hours ago',
      image: null,
      group: 'Morning Wellness Group'
    },
    {
      id: 2,
      user: { name: 'Mike Rodriguez', initials: 'MR', avatar: null },
      content: 'Successfully organized our first community book swap! 📚 We exchanged over 50 books and made some great new connections. Next month we\'re planning a book discussion meetup.',
      activity: 'Book Swap Event',
      location: 'Community Center',
      likes: 31,
      comments: 12,
      time: '4 hours ago',
      image: null,
      group: 'Book Lovers Society'
    },
    {
      id: 3,
      user: { name: 'Emily Zhang', initials: 'EZ', avatar: null },
      content: 'Weekend coding session was productive! We helped 3 beginners set up their first websites and had some great discussions about React best practices. 💻',
      activity: 'Coding Workshop',
      location: 'Tech Hub',
      likes: 18,
      comments: 6,
      time: '6 hours ago',
      image: null,
      group: 'Coding & Chill'
    }
  ];

  const promotions = [
    {
      id: 1,
      title: 'Free Yoga Classes',
      description: 'Join our morning yoga sessions this week',
      badge: 'Limited Time',
      icon: Heart,
      color: 'text-pink-600'
    },
    {
      id: 2,
      title: 'Coffee Tasting Event',
      description: 'Explore local coffee shops together',
      badge: 'This Weekend',
      icon: Coffee,
      color: 'text-amber-600'
    },
    {
      id: 3,
      title: 'Music Jam Session',
      description: 'Bring your instruments and join us',
      badge: 'Tonight',
      icon: Music,
      color: 'text-purple-600'
    }
  ];

  const recentMessages = [
    {
      id: 1,
      group: 'Morning Wellness Group',
      message: 'Sarah: Thanks for the great session today!',
      time: '5 min ago',
      unread: true
    },
    {
      id: 2,
      group: 'Book Lovers Society',
      message: 'Mike: Next book recommendations?',
      time: '15 min ago',
      unread: true
    },
    {
      id: 3,
      group: 'Coding & Chill',
      message: 'Emily: Great workshop yesterday!',
      time: '1 hour ago',
      unread: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Create Post Card */}
          <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                  <DialogTrigger asChild>
                    <div 
                      className="flex-1 bg-accent rounded-full px-6 py-3 text-muted-foreground cursor-pointer hover:bg-accent/80 transition-colors"
                    >
                      What's happening in your community?
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <CreatePost user={user} onClose={() => setShowCreatePost(false)} />
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-primary"
                  onClick={() => setShowCreatePost(true)}
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Necessary Services Section */}
          <NecessaryServicesSection navigate={navigate} user={user} />

          {/* Group Showcase */}
          <Card className="border-none shadow-card bg-gradient-primary/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Discover Groups by Interest</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/groups')}
                  className="text-primary"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Fitness & Health', icon: '💪', count: 12, color: 'bg-red-100 text-red-700' },
                  { name: 'Learning & Skills', icon: '📚', count: 8, color: 'bg-blue-100 text-blue-700' },
                  { name: 'Social Events', icon: '🎉', count: 15, color: 'bg-purple-100 text-purple-700' },
                  { name: 'Food & Cooking', icon: '🍳', count: 6, color: 'bg-orange-100 text-orange-700' }
                ].map((category, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-card rounded-lg hover:shadow-soft transition-all cursor-pointer"
                    onClick={() => navigate('/groups')}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color} mb-3`}>
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-card-foreground mb-1">{category.name}</h4>
                    <p className="text-xs text-muted-foreground">{category.count} groups</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="border-none shadow-card bg-card/70 backdrop-blur-sm hover:shadow-soft transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                          {post.user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{post.user.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>in {post.group}</span>
                          <span>•</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary-light text-primary">
                      {post.activity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-card-foreground mb-4 leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{post.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-6">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Heart className="w-4 h-4 mr-2" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/groups')}
                      className="border-border"
                    >
                      Join Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Promotions Box */}
          <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-card-foreground">Featured Events</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {promotions.map((promo) => (
                <div key={promo.id} className="p-3 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-card rounded-lg">
                      <promo.icon className={`h-4 w-4 ${promo.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm text-card-foreground">{promo.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {promo.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{promo.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-border"
                onClick={() => navigate('/groups')}
              >
                View All Events
              </Button>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-card-foreground">Recent Messages</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/chat')}
                  className="text-primary"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMessages.map((message) => (
                <div 
                  key={message.id} 
                  className="p-3 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors cursor-pointer"
                  onClick={() => navigate('/chat')}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-sm text-card-foreground truncate">{message.group}</h4>
                    {message.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{message.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trending Groups */}
          <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-card-foreground">Trending This Week</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Weekend Hikers', members: '+12 this week', trend: 'up' },
                { name: 'Coffee Enthusiasts', members: '+8 this week', trend: 'up' },
                { name: 'Book Club Central', members: '+6 this week', trend: 'up' }
              ].map((group, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-accent/50 rounded transition-colors cursor-pointer"
                  onClick={() => navigate('/groups')}
                >
                  <div>
                    <h4 className="font-semibold text-sm text-card-foreground">{group.name}</h4>
                    <p className="text-xs text-muted-foreground">{group.members}</p>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFeed;