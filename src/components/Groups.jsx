import React, { useState, useEffect } from 'react';
import { supabase } from '../intergrations/supabase/client';
import { useToast } from "../hooks/use-toast";
import { 
  Search, Plus, Users, MapPin, Sparkles, Calendar, Star,
  Filter, TrendingUp, Heart, Coffee, Gamepad2, BookOpen
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import Navigation from '../components/Navigation';

const Groups = ({ navigate, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [dbGroups, setDbGroups] = useState([]);
  const [userGroupIds, setUserGroupIds] = useState([]);
  const { toast } = useToast();

  const dummyGroups = [
    {
      id: 1,
      name: 'Weekend Coffee Explorers',
      description: 'Discover hidden coffee spots in our neighborhood every Saturday morning. Perfect for introverts looking to socialize over great coffee!',
      members: 24,
      category: 'Social',
      location: 'Downtown Area',
      distance: '1.2km',
      nextEvent: 'Tomorrow, 10 AM',
      tags: ['Coffee', 'Weekends', 'Local'],
      icon: '☕',
      color: 'bg-amber-100 text-amber-700',
      isRecommended: true,
      socialImpact: false,
      joined: false,
      type: 'interest'
    },
    {
      id: 2,
      name: 'Coding & Chill',
      description: 'After-work coding sessions where we work on personal projects together.',
      members: 18,
      category: 'Skills',
      location: 'Tech Hub',
      distance: '2.1km',
      nextEvent: 'Wed, 7 PM',
      tags: ['Programming', 'After-work', 'Learning'],
      icon: '💻',
      color: 'bg-blue-100 text-blue-700',
      isRecommended: true,
      socialImpact: false,
      joined: true,
      type: 'interest'
    },
    {
      id: 3,
      name: 'Community Garden Club',
      description: 'Growing together! Join us for weekly gardening sessions and learn sustainable practices.',
      members: 32,
      category: 'Environment',
      location: 'Community Garden',
      distance: '0.8km',
      nextEvent: 'Saturday, 9 AM',
      tags: ['Gardening', 'Sustainability', 'Environment'],
      icon: '🌱',
      color: 'bg-green-100 text-green-700',
      isRecommended: false,
      socialImpact: true,
      joined: true,
      type: 'interest'
    },
    {
      id: 4,
      name: 'Book Lovers Society',
      description: 'Monthly book discussions and literary events. Currently reading contemporary fiction.',
      members: 15,
      category: 'Culture',
      location: 'Downtown Library',
      distance: '1.5km',
      nextEvent: 'Next Thursday, 7 PM',
      tags: ['Books', 'Literature', 'Discussion'],
      icon: '📚',
      color: 'bg-purple-100 text-purple-700',
      isRecommended: false,
      socialImpact: false,
      joined: false,
      type: 'interest'
    },
    {
      id: 5,
      name: 'Housing Help Network',
      description: 'Find apartments, roommates, and housing advice. Connect with local realtors and residents.',
      members: 450,
      category: 'Housing',
      location: 'Citywide',
      distance: '0km',
      nextEvent: 'Always Available',
      tags: ['Housing', 'Apartments', 'Roommates'],
      icon: '🏠',
      color: 'bg-orange-100 text-orange-700',
      isRecommended: true,
      socialImpact: false,
      joined: false,
      type: 'necessity'
    },
    {
      id: 6,
      name: 'Tutoring Network',
      description: 'Connect with tutors for all subjects and grade levels. Study groups and educational support.',
      members: 320,
      category: 'Education',
      location: 'Various Locations',
      distance: '1.0km',
      nextEvent: 'Daily Sessions',
      tags: ['Tutoring', 'Education', 'Study Groups'],
      icon: '📖',
      color: 'bg-indigo-100 text-indigo-700',
      isRecommended: true,
      socialImpact: true,
      joined: false,
      type: 'necessity'
    },
    {
      id: 7,
      name: 'Local Transportation',
      description: 'Carpooling, ride-sharing, and local transit information for daily commutes.',
      members: 280,
      category: 'Transport',
      location: 'City Routes',
      distance: '0km',
      nextEvent: 'Daily Carpool',
      tags: ['Carpool', 'Transit', 'Commute'],
      icon: '🚗',
      color: 'bg-cyan-100 text-cyan-700',
      isRecommended: false,
      socialImpact: true,
      joined: false,
      type: 'necessity'
    },
    {
      id: 8,
      name: 'Home Services',
      description: 'Trusted recommendations for plumbers, electricians, cleaners, and home repairs.',
      members: 190,
      category: 'Services',
      location: 'Local Area',
      distance: '0.5km',
      nextEvent: 'On Demand',
      tags: ['Handyman', 'Repairs', 'Services'],
      icon: '🔧',
      color: 'bg-red-100 text-red-700',
      isRecommended: false,
      socialImpact: false,
      joined: false,
      type: 'necessity'
    }
  ];

  useEffect(() => {
    fetchGroups();
    if (user) {
      fetchUserGroups();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const groupsChannel = supabase
      .channel('groups-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, () => {
        fetchGroups();
      })
      .subscribe();

    const membersChannel = supabase
      .channel('group-members-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members' }, () => {
        fetchUserGroups();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(groupsChannel);
      supabase.removeChannel(membersChannel);
    };
  }, [user]);

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        categories (name, type)
      `)
      .order('member_count', { ascending: false });

    if (error) {
      toast({ title: "Error fetching groups", description: error.message, variant: "destructive" });
      return;
    }

    setDbGroups(data || []);
  };

  const fetchUserGroups = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', user.id);

    if (error) {
      toast({ title: "Error fetching user groups", description: error.message, variant: "destructive" });
      return;
    }

    const groupIds = data?.map(item => item.group_id).filter(Boolean) || [];
    setUserGroupIds(groupIds);
  };

  const categories = [
    { id: 'all', label: 'All', icon: '🌟' },
    { id: 'social', label: 'Social', icon: '☕' },
    { id: 'skills', label: 'Skills', icon: '🎯' },
    { id: 'culture', label: 'Culture', icon: '📚' },
    { id: 'environment', label: 'Environment', icon: '🌱' },
  ];

  const handleJoinGroup = async (groupId) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const groupIdStr = String(groupId);
      
      const { data: existing } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupIdStr)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        toast({ title: "You're already a member of this group" });
        return;
      }

      const { error: memberError } = await supabase
        .from('group_members')
        .insert([{ group_id: groupIdStr, user_id: user.id }]);

      if (memberError) throw memberError;

      const { data: group } = await supabase
        .from('groups')
        .select('member_count')
        .eq('id', groupIdStr)
        .maybeSingle();
      
      if (group) {
        await supabase
          .from('groups')
          .update({ member_count: (group.member_count || 0) + 1 })
          .eq('id', groupIdStr);
      }

      toast({ 
        title: "Joined group successfully!", 
        description: "You can now participate in group activities." 
      });

      fetchGroups();
      fetchUserGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast({ title: "Failed to join group", variant: "destructive" });
    }
  };

  // Map database groups to match dummy group structure
  const mappedDbGroups = dbGroups.map(group => ({
    ...group,
    members: group.member_count || 0,
    category: group.categories?.name || 'General',
    type: group.categories?.type || 'interest',
    description: group.description || '',
    tags: [],
    location: 'Local',
    distance: '0km',
    nextEvent: 'TBD',
    icon: '👥',
    color: 'bg-blue-100 text-blue-700',
    isRecommended: false,
    socialImpact: false,
    joined: userGroupIds.includes(group.id)
  }));

  const groups = mappedDbGroups.length > 0 ? mappedDbGroups : dummyGroups;

  const filteredGroups = groups.filter(group => {
    const name = group.name || '';
    const description = group.description || '';
    const category = group.category || '';
    const type = group.type || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || category.toLowerCase() === selectedCategory;
    const matchesTab = activeTab === 'all' || type === activeTab;
    return matchesSearch && matchesCategory && matchesTab;
  });

  const joinedGroups = groups.filter(group => userGroupIds.includes(group.id));

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Groups</h1>
            <p className="text-muted-foreground">
              You're active in {joinedGroups.length} groups • Discover new communities
            </p>
          </div>
          
          <Button 
            onClick={() => user ? navigate('/create-group') : navigate('/auth')} 
            className="bg-gradient-primary hover:bg-primary-hover shadow-soft"
          >
            <Plus className="h-4 w-4 mr-2" />
            {user ? 'Create Group' : 'Sign in to Create'}
          </Button>
        </div>

        {/* My Groups Section */}
        {joinedGroups.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              My Groups ({joinedGroups.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {joinedGroups.map((group) => (
                <Card key={group.id} className="border-none shadow-card bg-card/70 backdrop-blur-sm hover:shadow-soft transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/group-details/${group.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={`https://images.unsplash.com/photo-${group.id === 1 ? '1495474472287-c24bd4b09b3a?w=100' : group.id === 2 ? '1581091226825-b9b93c6b0bbc?w=100' : group.id === 3 ? '1416879595882-3373a0480b5b?w=100' : '1507003211169-0a1dd7228f2d?w=100'}&h=100&fit=crop`}
                        alt={group.name}
                        className="w-12 h-12 rounded-xl object-cover shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.members} members</p>
                      </div>
                      <Badge variant="secondary" className="bg-primary-light text-primary">
                        Joined
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {group.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      Next: {group.nextEvent}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-gradient-primary rounded-3xl p-8 text-primary-foreground mb-8 shadow-primary">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">
              Discover Amazing
              <span className="block text-yellow-300">Communities</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-6">
              Break free from the cycle of stressful weekdays and empty weekends. 
              Join local communities that understand your journey and share your interests.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="all">All Groups</TabsTrigger>
            <TabsTrigger value="interest">Interests</TabsTrigger>
            <TabsTrigger value="necessity">Necessities</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border"
              />
            </div>
            <Button variant="outline" className="border-border">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-gradient-primary'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="border-none shadow-card bg-card/70 backdrop-blur-sm hover:shadow-soft transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={`https://images.unsplash.com/photo-${group.id === 1 ? '1495474472287-c24bd4b09b3a?w=100' : group.id === 2 ? '1581091226825-b9b93c6b0bbc?w=100' : group.id === 3 ? '1416879595882-3373a0480b5b?w=100' : '1507003211169-0a1dd7228f2d?w=100'}&h=100&fit=crop`}
                      alt={group.name}
                      className="w-14 h-14 rounded-xl object-cover shadow-sm"
                    />
                    <div className="flex flex-col">
                      {group.isRecommended && (
                        <div className="flex items-center space-x-1 mb-1">
                          <Sparkles className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600 font-medium">Recommended</span>
                        </div>
                      )}
                      {group.socialImpact && (
                        <div className="flex items-center space-x-1 mb-1">
                          <Heart className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Social Impact</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold text-card-foreground mb-2 text-lg">{group.name}</h3>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{group.members} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{group.distance}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                  {group.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    {(group.tags || []).slice(0, 2).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-accent text-accent-foreground text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Next: {group.nextEvent}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate(`/group-details/${group.id}`)}
                    variant="outline"
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (userGroupIds.includes(group.id)) {
                        navigate(`/group-details/${group.id}`);
                      } else {
                        handleJoinGroup(group.id);
                      }
                    }}
                    className={`flex-1 ${
                      userGroupIds.includes(group.id)
                        ? 'bg-success hover:bg-success/90' 
                        : 'bg-gradient-primary hover:bg-primary-hover'
                    } shadow-soft`}
                  >
                    {userGroupIds.includes(group.id) ? 'Joined' : user ? 'Join' : 'Sign in to Join'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No groups found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or browse different categories
            </p>
            <Button 
              onClick={() => navigate('/create-group')}
              variant="outline"
              className="border-border"
            >
              Create Your Own Group
            </Button>
          </div>
        )}
      </div>
  );
};

export default Groups;