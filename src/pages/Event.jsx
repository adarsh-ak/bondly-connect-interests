import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus, MapPin, Users, Clock, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar } from "../components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { supabase } from '../intergrations/supabase/client';
import { useToast } from "../hooks/use-toast";
import { format } from "date-fns";

const Events = ({ navigate, user }) => {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const { toast } = useToast();

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    group_id: "",
    event_date: new Date(),
    event_time: "10:00",
    location: "",
  });

  useEffect(() => {
    if (user) {
      fetchEvents();
      fetchUserGroups();
      fetchMyEvents();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const eventsChannel = supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
        fetchMyEvents();
      })
      .subscribe();

    const participantsChannel = supabase
      .channel('event-participants-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_participants' }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;

    const { data: memberGroups } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', user.id);

    if (!memberGroups || memberGroups.length === 0) {
      setEvents([]);
      return;
    }

    const groupIds = memberGroups.map(gm => gm.group_id);

    const { data: eventsData, error } = await supabase
      .from('events')
      .select(`
        *,
        groups (name)
      `)
      .in('group_id', groupIds)
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    if (error) {
      toast({ title: "Error fetching events", description: error.message, variant: "destructive" });
      return;
    }

    const eventsWithDetails = await Promise.all(
      (eventsData || []).map(async (event) => {
        const { data: participants } = await supabase
          .from('event_participants')
          .select('*')
          .eq('event_id', event.id);

        const isParticipant = participants?.some(p => p.user_id === user.id) || false;

        return {
          ...event,
          group_name: event.groups?.name || 'Unknown Group',
          is_participant: isParticipant,
          participant_count: participants?.length || 0,
        };
      })
    );

    setEvents(eventsWithDetails);
  };

  const fetchMyEvents = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        groups (name)
      `)
      .eq('created_by', user.id)
      .order('event_date', { ascending: true });

    if (error) {
      toast({ title: "Error fetching your events", description: error.message, variant: "destructive" });
      return;
    }

    const eventsWithDetails = await Promise.all(
      (data || []).map(async (event) => {
        const { data: participants } = await supabase
          .from('event_participants')
          .select('*')
          .eq('event_id', event.id);

        return {
          ...event,
          group_name: event.groups?.name || 'Unknown Group',
          participant_count: participants?.length || 0,
        };
      })
    );

    setMyEvents(eventsWithDetails);
  };

  const fetchUserGroups = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('group_members')
      .select('group_id, groups (id, name)')
      .eq('user_id', user.id);

    if (error) {
      toast({ title: "Error fetching groups", description: error.message, variant: "destructive" });
      return;
    }

    const groups = data?.map(item => item.groups).filter(Boolean) || [];
    setUserGroups(groups);
  };

  const handleCreateEvent = async () => {
    if (!user || !newEvent.title || !newEvent.group_id) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const eventDateTime = new Date(newEvent.event_date);
    const [hours, minutes] = newEvent.event_time.split(':');
    eventDateTime.setHours(parseInt(hours), parseInt(minutes));

    const { error } = await supabase.from('events').insert({
      title: newEvent.title,
      description: newEvent.description,
      group_id: newEvent.group_id,
      event_date: eventDateTime.toISOString(),
      location: newEvent.location,
      created_by: user.id,
    });

    if (error) {
      toast({ title: "Error creating event", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Event created successfully!" });
    setIsCreateDialogOpen(false);
    setNewEvent({ title: "", description: "", group_id: "", event_date: new Date(), event_time: "10:00", location: "" });
    fetchEvents();
    fetchMyEvents();
  };

  const handleJoinEvent = async (eventId, isJoining) => {
    if (!user) return;

    if (isJoining) {
      const { error } = await supabase.from('event_participants').insert({
        event_id: eventId,
        user_id: user.id,
        status: 'going',
      });

      if (error) {
        toast({ title: "Error joining event", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "You're going to this event!" });
    } else {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) {
        toast({ title: "Error leaving event", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "You left the event" });
    }

    fetchEvents();
  };

  const handleDeleteEvent = async (eventId) => {
    const { error } = await supabase.from('events').delete().eq('id', eventId);

    if (error) {
      toast({ title: "Error deleting event", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Event deleted successfully" });
    fetchMyEvents();
    fetchEvents();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Please sign in to view events</h2>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Events</h1>
          <p className="text-muted-foreground">Join exciting community activities</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Weekend Photography Walk"
                />
              </div>
              
              <div>
                <Label htmlFor="group">Group *</Label>
                <Select value={newEvent.group_id} onValueChange={(value) => setNewEvent({ ...newEvent, group_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {userGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Event Date *</Label>
                  <div className="mt-2 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={newEvent.event_date}
                      onSelect={(date) => date && setNewEvent({ ...newEvent, event_date: date })}
                      className="rounded-md border w-fit"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="time">Event Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.event_time}
                    onChange={(e) => setNewEvent({ ...newEvent, event_time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Central Park"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Event details..."
                  rows={4}
                />
              </div>

              <Button onClick={handleCreateEvent} className="w-full bg-gradient-primary hover:bg-primary-hover">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="organized">My Organized Events</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select a Date</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-fit"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Events on {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => (
                      <Card key={event.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{event.group_name}</p>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {format(new Date(event.event_date), 'h:mm a')}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {event.participant_count || 0} attending
                            </div>
                          </div>
                          <Button
                            onClick={() => handleJoinEvent(event.id, !event.is_participant)}
                            size="sm"
                            variant={event.is_participant ? "outline" : "default"}
                            className="mt-3 w-full"
                          >
                            {event.is_participant ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Going
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Join Event
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No events on this date</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                        <CardDescription>{event.group_name}</CardDescription>
                      </div>
                      <Badge variant={event.is_participant ? "default" : "secondary"}>
                        {event.is_participant ? "Going" : "Not Going"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {format(new Date(event.event_date), 'MMMM d, yyyy')} at {format(new Date(event.event_date), 'h:mm a')}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.participant_count || 0} attending
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinEvent(event.id, !event.is_participant)}
                      variant={event.is_participant ? "outline" : "default"}
                      className="w-full"
                    >
                      {event.is_participant ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Leave Event
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Join Event
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No upcoming events in your groups</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="organized" className="space-y-4">
          {myEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {myEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                        <CardDescription>{event.group_name}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setEditingEvent(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {format(new Date(event.event_date), 'MMMM d, yyyy')} at {format(new Date(event.event_date), 'h:mm a')}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.participant_count || 0} attending
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't organized any events yet</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  Create Your First Event
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;