import React, { useState } from 'react';
import { ArrowLeft, MapPin, Users, Calendar } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import Navigation from "../components/Navigation";
import { supabase } from '../intergrations/supabase/client';
import { useToast } from '../hooks/use-toast';

const CreateGroup = ({ navigate, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    privacy: 'public',
    meetingType: 'in-person'
  });

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a group',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // First, get the category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', formData.category)
        .single();

      if (categoryError) throw categoryError;

      // Create the group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: formData.name,
          description: formData.description,
          category_id: categoryData.id,
          creator_id: user.id,
          is_private: formData.privacy === 'private',
          member_count: 1
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as a member with admin role
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast({
        title: 'Success',
        description: 'Group created successfully!'
      });
      navigate('groups');
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create group',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Community</h1>
            <p className="text-muted-foreground text-lg">
              Start a new group and bring people together around shared interests
            </p>
          </div>

          <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-card-foreground">Group Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Community Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Weekend Coffee Explorers"
                    required
                    className="border-border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    placeholder="Describe what your community is about, what activities you'll do, and what kind of people you'd like to attract..."
                    required
                    className="border-border"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Category *
                    </label>
                    <Select onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger className="border-border">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="skills">Skills & Learning</SelectItem>
                        <SelectItem value="fitness">Fitness & Health</SelectItem>
                        <SelectItem value="culture">Arts & Culture</SelectItem>
                        <SelectItem value="environment">Environment</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="food">Food & Cooking</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Meeting Type
                    </label>
                    <Select onValueChange={(value) => handleChange('meetingType', value)} defaultValue="in-person">
                      <SelectTrigger className="border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-person">In-Person</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="e.g., Downtown Area, Community Center"
                      className="pl-10 border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Privacy Setting
                  </label>
                  <Select onValueChange={(value) => handleChange('privacy', value)} defaultValue="public">
                    <SelectTrigger className="border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex flex-col">
                          <span>Public</span>
                          <span className="text-xs text-muted-foreground">Anyone can find and join</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex flex-col">
                          <span>Private</span>
                          <span className="text-xs text-muted-foreground">Invitation only</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:bg-primary-hover shadow-soft"
                    disabled={!formData.name || !formData.description || !formData.category || loading}
                  >
                    {loading ? 'Creating...' : 'Create Community'}
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-accent rounded-lg">
                <h3 className="font-semibold text-accent-foreground mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Tips for Success
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific about what activities your group will do</li>
                  <li>• Set clear expectations for frequency and commitment</li>
                  <li>• Choose a welcoming and inclusive tone</li>
                  <li>• Consider starting with a simple first meetup</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default CreateGroup;