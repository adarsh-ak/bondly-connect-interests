import React from 'react';
import { ArrowLeft, MapPin, Phone, Users, Calendar, MessageCircle, Settings } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import Navigation from '../components/Navigation';

const GroupDetails = ({ navigate, groupId, user }) => {
  const group = {
    id: 1,
    name: 'Weekend Coffee Explorers',
    leader: 'Sarah Chen',
    address: '21 Melbourne, Australia',
    phone: '0900 009 900',
    avatar: '☕',
    description: 'Discover hidden coffee spots in our neighborhood every Saturday morning. Perfect for coffee lovers who want to explore and socialize in a relaxed environment.',
    stats: { members: 24, requests: 5, totalHelp: 36 },
    category: 'Social',
    nextEvent: {
      title: 'Exploring Little Italy Cafés',
      date: 'Tomorrow',
      time: '10:00 AM',
      location: 'Little Italy District'
    },
    members: [
      { name: 'Sarah Chen', role: 'Leader', avatar: 'SC' },
      { name: 'Mike Rodriguez', role: 'Member', avatar: 'MR' },
      { name: 'Emma Thompson', role: 'Member', avatar: 'ET' },
      { name: 'Alex Kim', role: 'Member', avatar: 'AK' }
    ]
  };

  const isJoined = true; // Mock joined status

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('groups')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Groups
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Group Header */}
              <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-soft">
                      {group.avatar}
                    </div>
                    <h1 className="text-3xl font-bold text-card-foreground mb-2">{group.name}</h1>
                    <p className="text-muted-foreground mb-4">Led by {group.leader}</p>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      {group.category}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-primary-light rounded-xl">
                      <div className="text-2xl font-bold text-primary">{group.stats.members}</div>
                      <div className="text-sm text-muted-foreground">Members</div>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-xl">
                      <div className="text-2xl font-bold text-pink-600">{group.stats.requests}</div>
                      <div className="text-sm text-muted-foreground">Requests</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">{group.stats.totalHelp}</div>
                      <div className="text-sm text-muted-foreground">Events Held</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-2">About This Group</h3>
                      <p className="text-muted-foreground leading-relaxed">{group.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-2">Location</h3>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {group.address}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-2">Contact</h3>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {group.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Event */}
              <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Next Event
                  </h2>
                  <div className="bg-accent rounded-lg p-4">
                    <h3 className="font-semibold text-accent-foreground mb-2">{group.nextEvent.title}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{group.nextEvent.date} at {group.nextEvent.time}</p>
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {group.nextEvent.location}
                      </p>
                    </div>
                    <Button className="mt-4 bg-gradient-primary hover:bg-primary-hover" size="sm">
                      {isJoined ? 'Going' : 'Join Event'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {isJoined ? (
                      <>
                        <Button 
                          onClick={() => navigate('community-chat')}
                          className="w-full bg-gradient-primary hover:bg-primary-hover"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Group Chat
                        </Button>
                        <Button variant="outline" className="w-full border-border">
                          <Settings className="h-4 w-4 mr-2" />
                          Group Settings
                        </Button>
                        <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                          Leave Group
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full bg-gradient-primary hover:bg-primary-hover">
                        <Users className="h-4 w-4 mr-2" />
                        Join Group
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Members */}
              <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Members ({group.stats.members})
                  </h3>
                  <div className="space-y-3">
                    {group.members.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                    {group.stats.members > 4 && (
                      <Button variant="ghost" size="sm" className="w-full text-primary">
                        View All Members
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
};

export default GroupDetails;