import { useEffect, useState } from 'react';
import { supabase } from '@/app/api/createClient';
import { Box, Button, Input, Flex, Image, Text } from '@chakra-ui/react';
import Sidebar from '../global/Sidebar';
import { CreateEventModal } from './modals/CreateEvent';

type Event = {
  id: number;
  title: string;
  location: string;
  promoter: string;
  date: string;
  imageUrl: string;
};

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('Events').select('*').ilike('title', `%${searchQuery}%`);
    if (error) {
      console.error('Error fetching events:', error);
      return;
    }
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, [searchQuery]);

  const handleCreateEvent = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      <div className="z-50">
      <CreateEventModal isOpen={isModalOpen} closeModal={closeModal} />
      </div>
      <Sidebar />
      <Box flex="1" p="4">
        <Flex justifyContent="space-between" mb="4">
          <Input placeholder="Search events" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Button onClick={handleCreateEvent}>Create Event</Button>
        </Flex>
        <div>
          {events.map((event, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" mb="4" p="4">
              <Flex gap="4">
                <Image src={event.imageUrl} alt={event.title} objectFit="cover" w="28" h="16" />
                <Box flex="1">
                  <Text fontSize="xl">{event.title}</Text>
                  <Text>{event.location}</Text>
                  <Text>{event.promoter}</Text>
                  <Text>{event.date}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </div>
      </Box>
    </div>
  );
};

export default AdminDashboard;
