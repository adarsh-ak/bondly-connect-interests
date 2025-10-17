import React, { useState } from 'react';
import { 
  Search, Plus, Heart, MessageCircle, Share2, MoreHorizontal,
  ArrowLeft, Camera, MapPin, Clock
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import Navigation from '../components/Navigation';

const Feed = ({ navigate, user }) => {
  const samplePosts = [
    {
      id: 1,
      user: { name: "Sarah Chen", initials: "SC", avatar: undefined },
      activity: "Morning Yoga",
      timeAgo: "2 hours ago",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
      content: "What an amazing start to the day! Today's yoga session focused on mindfulness and flexibility. 🧘‍♀️✨ The sunrise made it even more magical!",
      likes: 24,
      comments: 8,
      isLiked: true,
      location: "Riverside Park"
    },
    {
      id: 2,
      user: { name: "Mike Rodriguez", initials: "MR", avatar: undefined },
      activity: "Guitar Lessons",
      timeAgo: "4 hours ago",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
      content: "Finally nailed that chord progression I've been struggling with! 🎸 Thanks to everyone in the music group for the encouragement.",
      likes: 31,
      comments: 12,
      isLiked: false,
      location: "Community Center"
    },
    {
      id: 3,
      user: { name: "Emma Thompson", initials: "ET", avatar: undefined },
      activity: "Book Club",
      timeAgo: "6 hours ago",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
      content: "Great discussion today about 'The Seven Husbands of Evelyn Hugo'! 📚 Love how this book brings different perspectives together.",
      likes: 18,
      comments: 15,
      isLiked: true,
      location: "Downtown Library"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Community Feed</h1>
              <p className="text-muted-foreground">
                See what your neighbors are up to and share your own experiences
              </p>
            </div>
            
            <Button 
              onClick={() => user ? navigate('upload') : navigate('login')}
              className="bg-gradient-primary hover:bg-primary-hover shadow-soft"
            >
              <Plus className="h-4 w-4 mr-2" />
              {user ? 'Create Post' : 'Sign in to Post'}
            </Button>
          </div>

          {/* Create Post Quick Action */}
          {user && (
            <Card className="mb-8 border-none shadow-card bg-card/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className="flex-1 bg-accent rounded-full px-4 py-3 cursor-pointer hover:bg-accent/80 transition-colors"
                    onClick={() => navigate('upload')}
                  >
                    <p className="text-muted-foreground">Share your community experience...</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('upload')}
                    className="text-primary hover:bg-primary-light"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sign In Prompt for Unauthenticated Users */}
          {!user && (
            <Card className="mb-8 border-none shadow-card bg-card/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Join the Conversation</h3>
                <p className="text-muted-foreground mb-4">
                  Sign in to share your own community experiences and connect with neighbors
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => navigate('login')}
                    className="bg-gradient-primary hover:bg-primary-hover"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('signup')}
                    variant="outline"
                    className="border-border"
                  >
                    Create Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts */}
          <div className="space-y-6">
            {samplePosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </div>
  );
};

// Post Card Component
const PostCard = ({ user, activity, timeAgo, image, content, likes, comments, isLiked = false, location }) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <Card className="border-none shadow-card bg-card/70 backdrop-blur-sm overflow-hidden hover:shadow-soft transition-all duration-300">
      {/* Header */}
      <CardContent className="p-0">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-card-foreground">{user?.email?.split('@')[0] || 'User'}</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Joined {activity}</span>
                  <span>•</span>
                  <span>{timeAgo}</span>
                  {location && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="relative overflow-hidden">
          <img 
            src={image} 
            alt={`${activity} session`}
            className="w-full h-80 object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-card-foreground leading-relaxed mb-4">{content}</p>
          
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  liked ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                <span className="font-medium">{likeCount}</span>
              </button>
              <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">{comments}</span>
              </button>
            </div>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Feed;