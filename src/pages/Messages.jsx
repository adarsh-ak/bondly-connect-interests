import { useState, useEffect, useRef } from 'react';
import { Send, UserPlus, Users, UserMinus, Search, Phone, Video, Camera, Circle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../intergrations/supabase/client';
import { useToast } from '../hooks/use-toast';

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mainTab, setMainTab] = useState('chats');
  const scrollRef = useRef(null);

  // Load friends and suggestions
  useEffect(() => {
    if (!user) return;

    const loadFriendsAndSuggestions = async () => {
      // Load friends
      const { data: friendshipsData, error: friendshipsError } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (friendshipsError) {
        console.error('Error loading friendships:', friendshipsError);
        return;
      }

      const friendIds = friendshipsData?.map(f => f.friend_id) || [];

      // Load friend profiles
      const { data: friendsData, error: friendsError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', friendIds);

      if (!friendsError && friendsData) {
        setFriends(friendsData.map(f => ({
          id: f.user_id,
          username: f.username || f.full_name || 'User',
          full_name: f.full_name || '',
          status: 'accepted',
          isFriend: true
        })));
      }

      // Load suggestions (users who are not friends)
      const { data: suggestionsData, error: suggestionsError } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id)
        .not('user_id', 'in', `(${friendIds.join(',')})`);

      if (!suggestionsError && suggestionsData) {
        setSuggestions(suggestionsData.slice(0, 10).map(f => ({
          id: f.user_id,
          username: f.username || f.full_name || 'User',
          full_name: f.full_name || '',
          status: 'suggestion',
          isFriend: false
        })));
      }
    };

    loadFriendsAndSuggestions();

    // Set up realtime subscription for friendships
    const friendshipsChannel = supabase
      .channel('friendships-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: `user_id=eq.${user.id}`
        },
        () => loadFriendsAndSuggestions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(friendshipsChannel);
    };
  }, [user]);

  // Load messages for active friend
  useEffect(() => {
    if (!user || !activeFriend) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeFriend.id}),and(sender_id.eq.${activeFriend.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
        
        // Mark messages as read
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('receiver_id', user.id)
          .eq('sender_id', activeFriend.id)
          .eq('read', false);
      }
    };

    loadMessages();

    // Set up realtime subscription for messages
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMsg = payload.new;
          if (
            (newMsg.sender_id === user.id && newMsg.receiver_id === activeFriend.id) ||
            (newMsg.sender_id === activeFriend.id && newMsg.receiver_id === user.id)
          ) {
            setMessages(prev => [...prev, newMsg]);
            
            // Auto-scroll to bottom
            setTimeout(() => {
              scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [user, activeFriend]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!user || !activeFriend || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: activeFriend.id,
          content: newMessage.trim(),
          read: false
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const addFriend = async (friendId) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'accepted'
        });

      // Also create reverse friendship
      await supabase
        .from('friendships')
        .insert({
          user_id: friendId,
          friend_id: user.id,
          status: 'accepted'
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Friend added successfully'
      });
    } catch (error) {
      console.error('Error adding friend:', error);
      toast({
        title: 'Error',
        description: 'Failed to add friend',
        variant: 'destructive'
      });
    }
  };

  const removeFriend = async (friendId) => {
    if (!user) return;

    try {
      await supabase
        .from('friendships')
        .delete()
        .eq('user_id', user.id)
        .eq('friend_id', friendId);

      // Also delete reverse friendship
      await supabase
        .from('friendships')
        .delete()
        .eq('user_id', friendId)
        .eq('friend_id', user.id);

      toast({
        title: 'Success',
        description: 'Friend removed'
      });

      if (activeFriend?.id === friendId) {
        setActiveFriend(null);
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove friend',
        variant: 'destructive'
      });
    }
  };

  const filteredFriends = friends.filter(f => 
    f.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(f => 
    f.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col bg-background" style={{ height: 'calc(100vh - 64px)' }}>
      {/* WhatsApp-style Main Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto">
          <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-14 rounded-none bg-transparent">
              <TabsTrigger value="chats" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <Users className="h-5 w-5 mr-2" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="status" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <Circle className="h-5 w-5 mr-2" />
                Status
              </TabsTrigger>
              <TabsTrigger value="calls" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <Phone className="h-5 w-5 mr-2" />
                Calls
              </TabsTrigger>
              <TabsTrigger value="communities" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <Users className="h-5 w-5 mr-2" />
                Communities
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {mainTab === 'chats' && (
          <div className="h-full flex">
            {/* Sidebar */}
            <div className="w-80 border-r border-border flex flex-col bg-card">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Tabs defaultValue="chatbox" className="flex-1 flex flex-col">
                <TabsList className="w-full grid grid-cols-2 m-4">
                  <TabsTrigger value="chatbox">
                    <Users className="h-4 w-4 mr-2" />
                    Chatbox ({friends.length})
                  </TabsTrigger>
                  <TabsTrigger value="friends">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Friends
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chatbox" className="flex-1 overflow-y-auto px-4">
                  <div className="space-y-2">
                    {filteredFriends.map((friend) => (
                      <Card
                        key={friend.id}
                        className={`cursor-pointer transition-all ${
                          activeFriend?.id === friend.id ? 'bg-accent' : 'hover:bg-accent/50'
                        }`}
                        onClick={() => setActiveFriend(friend)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{friend.username}</p>
                                {friend.full_name && (
                                  <p className="text-xs text-muted-foreground">{friend.full_name}</p>
                                )}
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFriend(friend.id);
                              }}
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="friends" className="flex-1 overflow-y-auto px-4">
                  <div className="space-y-2">
                    {filteredFriends.map((friend) => (
                      <Card key={friend.id} className="hover:bg-accent/50 transition-all">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{friend.username}</p>
                                {friend.full_name && (
                                  <p className="text-xs text-muted-foreground">{friend.full_name}</p>
                                )}
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFriend(friend.id);
                              }}
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {activeFriend ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{activeFriend.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{activeFriend.username}</h3>
                          {activeFriend.full_name && (
                            <p className="text-sm text-muted-foreground">{activeFriend.full_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost">
                          <Video className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Phone className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender_id === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-accent text-accent-foreground'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border bg-card">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select a friend to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {mainTab === 'status' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Camera className="h-16 w-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Status Updates</h2>
              <p className="text-muted-foreground max-w-md">
                Share photos, text, and videos that disappear after 24 hours. Your status updates will appear here.
              </p>
              <Button className="mt-4">
                <Camera className="h-4 w-4 mr-2" />
                Add Status
              </Button>
            </div>
          </div>
        )}

        {mainTab === 'calls' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="h-16 w-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Voice & Video Calls</h2>
              <p className="text-muted-foreground max-w-md">
                Make crystal-clear voice and video calls to your friends. Your call history will appear here.
              </p>
              <div className="flex gap-3 justify-center mt-4">
                <Button>
                  <Phone className="h-4 w-4 mr-2" />
                  Voice Call
                </Button>
                <Button variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
              </div>
            </div>
          </div>
        )}

        {mainTab === 'communities' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-16 w-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Communities</h2>
              <p className="text-muted-foreground max-w-md">
                Connect with groups of people who share your interests. Join communities to participate in group conversations.
              </p>
              <Button className="mt-4" onClick={() => window.location.href = '/groups'}>
                <Users className="h-4 w-4 mr-2" />
                Browse Communities
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;