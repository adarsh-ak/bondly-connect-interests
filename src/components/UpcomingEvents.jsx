import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { supabase } from '../intergrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import EventDetailsModal from './EventDetailsModal';

const UpcomingEvents = ({ navigate }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        groups (name)
      `)
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
      .limit(3);

    if (!error && data) {
      const eventsWithDetails = await Promise.all(
        data.map(async (event) => {
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
      setEvents(eventsWithDetails);
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 bg-muted/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
          <p className="text-muted-foreground">Join exciting community activities happening soon</p>
        </div>
        <Button variant="outline" onClick={() => navigate('events')}>
          View All Events
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card 
            key={event.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedEvent(event);
              setIsModalOpen(true);
            }}
          >
            <div className="relative h-40 overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop`}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm">
                {event.group_name}
              </Badge>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{event.group_name}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(event.event_date).toLocaleDateString()}
              </div>
              {event.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
              )}
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                {event.participant_count} attending
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EventDetailsModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </section>
  );
};

export default UpcomingEvents;