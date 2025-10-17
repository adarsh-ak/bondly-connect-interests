import React from 'react';
import { 
  Users, Calendar, Activity, Heart, MessageCircle
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Navigation from '../components/Navigation';
import FriendsSection from '../components/FriendsSection';
import UpcomingEvents from '../components/UpcomingEvents';

const Dashboard = ({ navigate, user }) => {
  // Mock data - in real app, this would come from database
  const userStats = {
    groupsJoined: 5,
    communityFriends: 23,
    activitiesParticipated: 12,
    eventsScheduled: 6
  };

  const stats = [
    {
      label: 'Active Groups',
      value: userStats.groupsJoined,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary-light'
    },
    {
      label: 'Activities Joined',
      value: userStats.activitiesParticipated,
      icon: Activity,
      color: 'text-success',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Community Friends',
      value: userStats.communityFriends,
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    },
    {
      label: 'Events Scheduled',
      value: userStats.eventsScheduled,
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
              </h1>
              <p className="text-muted-foreground mt-2">
                Here's what's happening in your community today
              </p>
            </div>
            <Button 
              onClick={() => navigate('groups')}
              className="bg-gradient-primary hover:bg-primary-hover shadow-soft"
            >
              Explore Groups
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-none shadow-card bg-card/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <UpcomingEvents navigate={navigate} />

        {/* Friends Section */}
        <FriendsSection navigate={navigate} />

        {/* Quick Actions */}
        <div className="mt-8">
            {/* Quick Actions */}
            <Card className="border-none shadow-card bg-card/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-card-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('feed')}
                  variant="outline" 
                  className="w-full justify-start border-border hover:bg-accent"
                >
                  <MessageCircle className="h-4 w-4 mr-3" />
                  Share an Update
                </Button>
                <Button 
                  onClick={() => navigate('messages')}
                  variant="outline" 
                  className="w-full justify-start border-border hover:bg-accent"
                >
                  <Users className="h-4 w-4 mr-3" />
                  Community Chat
                </Button>
                <Button 
                  onClick={() => navigate('groups')}
                  variant="outline" 
                  className="w-full justify-start border-border hover:bg-accent"
                >
                  <Users className="h-4 w-4 mr-3" />
                  Find New Groups
                </Button>
              </CardContent>
            </Card>
          </div>
      </div>
  );
};

export default Dashboard;