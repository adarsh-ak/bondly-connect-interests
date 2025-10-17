import React, { useState } from 'react';
import { Camera, Image, Video, MapPin, Send, Users, ChevronLeft } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const CreatePost = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('post');
  const [postData, setPostData] = useState({
    content: '',
    activity: '',
    location: '',
    privacy: 'public'
  });

  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    privacy: 'public',
    meetingType: 'in-person'
  });

  const handlePostSubmit = (e) => {
    e.preventDefault();
    // Handle post submission
    onClose();
  };

  const handleGroupSubmit = (e) => {
    e.preventDefault();
    // Handle group creation
    onClose();
  };

  const handleGroupChange = (field, value) => {
    setGroupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="post">Create Post</TabsTrigger>
          <TabsTrigger value="group">Create Group</TabsTrigger>
        </TabsList>

        <TabsContent value="post" className="space-y-6">
          <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    {user?.email?.split('@')[0] || 'User'}
                  </h3>
                  <p className="text-sm text-muted-foreground">Sharing to community</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostSubmit} className="space-y-6">
                <div>
                  <Textarea
                    value={postData.content}
                    onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="What did you do today? Share your community experience..."
                    rows={4}
                    className="border-border resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Activity Type
                    </label>
                    <Input
                      type="text"
                      value={postData.activity}
                      onChange={(e) => setPostData(prev => ({ ...prev, activity: e.target.value }))}
                      placeholder="e.g., Morning Yoga, Book Club"
                      className="border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={postData.location}
                        onChange={(e) => setPostData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Where did this happen?"
                        className="pl-10 border-border"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center space-x-2">
                    <Button type="button" variant="ghost" size="sm" className="text-primary">
                      <Image className="h-4 w-4 mr-2" />
                      Add Photo
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="text-primary">
                      <Video className="h-4 w-4 mr-2" />
                      Add Video
                    </Button>
                  </div>

                  <Button 
                    type="submit"
                    className="bg-gradient-primary hover:bg-primary-hover"
                    disabled={!postData.content.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Share Post
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="group" className="space-y-6">
          <Card className="border-none shadow-card bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-card-foreground">Create New Group</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGroupSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Community Name *
                  </label>
                  <Input
                    type="text"
                    value={groupData.name}
                    onChange={(e) => handleGroupChange('name', e.target.value)}
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
                    value={groupData.description}
                    onChange={(e) => handleGroupChange('description', e.target.value)}
                    rows={4}
                    placeholder="Describe what your community is about..."
                    required
                    className="border-border"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Category *
                    </label>
                    <Select onValueChange={(value) => handleGroupChange('category', value)}>
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
                    <Select onValueChange={(value) => handleGroupChange('meetingType', value)} defaultValue="in-person">
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
                      value={groupData.location}
                      onChange={(e) => handleGroupChange('location', e.target.value)}
                      placeholder="e.g., Downtown Area, Community Center"
                      className="pl-10 border-border"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:bg-primary-hover shadow-soft"
                    disabled={!groupData.name || !groupData.description || !groupData.category}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Create Community
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatePost;