import { useEffect, useState } from 'react';
import { supabase } from '@/app/api/createClient';
import { Box, Button, Input, Flex, Image, Text } from '@chakra-ui/react';
import Sidebar from '../global/Sidebar';

type Event = {
  id: number;
  name: string;
  location: string;
  promoter: string;
  date: string;
  imageUrl: string;
};

const CreateEventModal = ({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview

  useEffect(() => { setIsModalOpen(isOpen); }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  // Empty functions for title, location, and date
  const handleTitleChange = (title: string) => {
    // Implement logic for title
  };

  const handleLocationChange = (location: string) => {
    // Implement logic for location
  };

  const handleDateChange = (date: Date) => {
    // Implement logic for date
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <Box width={'50%'} p={8} bg="white" rounded="md">
            <Button onClick={closeModal} className="absolute top-2 right-2">
              Close
            </Button>
            {/* Image upload container */}
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <Image src={imagePreview} width={100} height={100} alt="Preview" style={{ width: '100%', height: 'auto' }} />}
            <Input type="text" placeholder="Title" onChange={(e) => handleTitleChange(e.target.value)} />
            <Input type="text" placeholder="Location" onChange={(e) => handleLocationChange(e.target.value)} />
            <Text>Modal Content</Text>
          </Box>
        </div>
      )}
    </>
  );
};

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('Events').select('*').ilike('name', `%${searchQuery}%`);
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
      <Sidebar />
      <Box flex="1" p="4">
        <Flex justifyContent="space-between" mb="4">
          <Input placeholder="Search events" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Button onClick={handleCreateEvent}>Create Event</Button>
        </Flex>
        <div>
          {events.map((event) => (
            <Box key={event.id} borderWidth="1px" borderRadius="lg" overflow="hidden" mb="4" p="4">
              <Flex gap="4">
                <Image src={event.imageUrl} alt={event.name} objectFit="cover" w="28" h="16" />
                <Box flex="1">
                  <Text fontSize="xl">{event.name}</Text>
                  <Text>{event.location}</Text>
                  <Text>{event.promoter}</Text>
                  <Text>{event.date}</Text>
                  <CreateEventModal isOpen={isModalOpen} closeModal={closeModal} />
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
