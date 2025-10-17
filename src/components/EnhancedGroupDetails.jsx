import React, { useState } from 'react';
import { 
  ArrowLeft, Users, MapPin, Calendar, Settings, MessageCircle, 
  Heart, Share2, Clock, Trophy, Star, UserPlus, UserMinus,
  Edit, Trash2, Crown, Shield, AlertCircle, ChevronRight, Pin
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";

const EnhancedGroupDetails = ({ navigate, groupId, user }) => {
  const [isJoined, setIsJoined] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock group data - in real app, fetch based on groupId
  const group = {
    id: groupId,
    name: 'Weekend Coffee Explorers',
    description: 'Discover hidden coffee spots in our neighborhood every Saturday morning. Perfect for introverts looking to socialize over great coffee!',
    longDescription: 'Our community is dedicated to exploring the rich coffee culture in our city. Every weekend, we visit different local coffee shops, from cozy neighborhood cafes to artisanal roasters. We discuss brewing techniques, taste different beans, and share our love for coffee in a relaxed, welcoming environment.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-c24bd4b09b3a?w=400&h=300&fit=crop',
    members: 24,
    category: 'Social',
    location: 'Downtown Area',
    distance: '1.2km',
    nextEvent: 'Tomorrow, 10 AM',
    tags: ['Coffee', 'Weekends', 'Local'],
    isPrivate: false,
    createdAt: '2024-01-15',
    admin: {
      id: 'admin-1',
      name: 'Sarah Chen',
      bio: 'Coffee enthusiast and community organizer',
      joinedDate: '2024-01-15'
    },
    motive: 'To build a community of coffee lovers who appreciate quality, local businesses, and meaningful connections over great coffee.',
    goals: [
      'Visit every local coffee shop in the area',
      'Support local coffee businesses',
      'Build lasting friendships through shared experiences',
      'Learn about different coffee brewing methods'
    ],
    memberDetails: [
      { id: 1, name: 'Sarah Chen', role: 'Admin', joinedDate: '2024-01-15', avatar: 'SC' },
      { id: 2, name: 'Mike Rodriguez', role: 'Moderator', joinedDate: '2024-01-20', avatar: 'MR' },
      { id: 3, name: 'Emily Zhang', role: 'Member', joinedDate: '2024-02-01', avatar: 'EZ' },
      { id: 4, name: 'Alex Johnson', role: 'Member', joinedDate: '2024-02-05', avatar: 'AJ' }
    ],
    events: [
      {
        id: 1,
        title: 'Blue Bottle Coffee Tasting',
        date: 'Tomorrow, 10 AM',
        location: 'Blue Bottle Coffee, Downtown',
        attendees: 12,
        description: 'Join us for a special tasting session featuring single-origin beans.'
      },
      {
        id: 2,
        title: 'Latte Art Workshop',
        date: 'Next Saturday, 2 PM',
        location: 'Local Roasters Co.',
        attendees: 8,
        description: 'Learn the basics of latte art from a professional barista.'
      }
    ],
    achievements: [
      { title: 'Explorer', description: 'Visited 10+ coffee shops', icon: Trophy },
      { title: 'Community Builder', description: 'Active member for 3+ months', icon: Star },
      { title: 'Coffee Guru', description: 'Shared 5+ brewing tips', icon: Heart }
    ]
  };

  const isAdmin = user?.id === group.admin.id;
  const isModerator = group.memberDetails.find(member => member.id === user?.id)?.role === 'Moderator';
  const hasAdminAccess = isAdmin || isModerator;

  const handleJoinLeave = () => {
    setIsJoined(!isJoined);
  };

  const handleEditGroup = () => {
    setShowEditDialog(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/groups')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </div>

        {/* Group Header */}
        <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-start space-x-6">
                  <img 
                    src={group.imageUrl}
                    alt={group.name}
                    className="w-24 h-24 rounded-xl object-cover shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">{group.name}</h1>
                        <div className="flex items-center space-x-4 text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{group.members} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{group.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Founded {group.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      {hasAdminAccess && (
                        <Button 
                          variant="outline" 
                          onClick={handleEditGroup}
                          className="border-border"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {group.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-accent text-accent-foreground">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Card className="border-border">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Next Event</h3>
                    <p className="text-primary font-medium">{group.nextEvent}</p>
                    <p className="text-sm text-muted-foreground mt-1">Blue Bottle Coffee</p>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  {user ? (
                    <>
                      <Button 
                        onClick={handleJoinLeave}
                        className={`w-full ${
                          isJoined 
                            ? 'bg-success hover:bg-success/90' 
                            : 'bg-gradient-primary hover:bg-primary-hover'
                        } shadow-soft`}
                      >
                        {isJoined ? (
                          <>
                            <UserMinus className="h-4 w-4 mr-2" />
                            Leave Group
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Join Group
                          </>
                        )}
                      </Button>
                      
                      {isJoined && (
                        <Button 
                          variant="outline" 
                          className="w-full border-border"
                          onClick={() => navigate('/chat')}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Group Chat
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="w-full bg-gradient-primary hover:bg-primary-hover"
                    >
                      Sign in to Join
                    </Button>
                  )}

                  <Button variant="ghost" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Group
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Group Mission */}
                <Card className="border-none shadow-card bg-card/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-primary" />
                      <span>Our Mission</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {group.motive}
                    </p>
                  </CardContent>
                </Card>

                {/* Goals */}
                <Card className="border-none shadow-card bg-card/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span>Our Goals</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {group.goals.map((goal, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Admin Info */}
                <Card className="border-none shadow-card bg-card/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-primary" />
                      <span>Group Admin</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {group.admin.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-foreground">{group.admin.name}</h4>
                        <p className="text-sm text-muted-foreground">{group.admin.bio}</p>
                        <p className="text-xs text-muted-foreground">Admin since {group.admin.joinedDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="border-none shadow-card bg-card/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-primary" />
                      <span>Achievements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {group.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                        <achievement.icon className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card className="border-none shadow-card bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Members ({group.members})</span>
                  {hasAdminAccess && (
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Members
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.memberDetails.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-foreground">{member.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={member.role === 'Admin' ? 'default' : member.role === 'Moderator' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {member.role === 'Admin' && <Crown className="h-3 w-3 mr-1" />}
                              {member.role === 'Moderator' && <Shield className="h-3 w-3 mr-1" />}
                              {member.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Since {member.joinedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      {hasAdminAccess && member.role !== 'Admin' && (
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.events.map((event) => (
                <Card key={event.id} className="border-none shadow-card bg-card/70 backdrop-blur-sm hover:shadow-soft transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{event.title}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                      </div>
                      {hasAdminAccess && (
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <Button className="w-full bg-gradient-primary hover:bg-primary-hover">
                      RSVP for Event
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[400px] overflow-y-auto space-y-3 p-4 bg-accent/20 rounded-lg">
                <div className="text-sm text-muted-foreground text-center">Start chatting with group members</div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Type your message..." />
                <Button><MessageCircle className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pin className="h-5 w-5" />
                Pinned Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-primary/5">
                <div className="flex items-start gap-3">
                  <Pin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Next Meetup Location Changed</p>
                    <p className="text-sm text-muted-foreground">We'll be meeting at Central Park instead. See you there!</p>
                    <p className="text-xs text-muted-foreground mt-2">Posted 2 hours ago by Admin</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
            <Card className="border-none shadow-card bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>About This Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Full Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {group.longDescription}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Group Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="text-foreground">{group.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Privacy:</span>
                        <span className="text-foreground">{group.isPrivate ? 'Private' : 'Public'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="text-foreground">{group.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="text-foreground">{group.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Community Guidelines</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Be respectful and welcoming to all members</li>
                      <li>• Support local coffee businesses</li>
                      <li>• Share your coffee experiences and knowledge</li>
                      <li>• Attend events regularly if possible</li>
                      <li>• Help newcomers feel included</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Group Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Group Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Edit className="h-6 w-6" />
                  <span>Edit Details</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Manage Members</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>Create Event</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Settings className="h-6 w-6" />
                  <span>Group Settings</span>
                </Button>
              </div>
              
              {isAdmin && (
                <div className="border-t pt-4">
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Group
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EnhancedGroupDetails;