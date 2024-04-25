import { useState, useEffect } from "react";
import { Box, Button, Image, Input, Flex, useToast } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/app/api/createClient";
import AsyncSelect from 'react-select/async';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';

export const CreateEventModal = ({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) => {
  const [eventData, setEventData] = useState({ title: '', promoter: '', date: '', location: '', image_url: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      // Optional: Reset state or fetch data
    }
  }, [isOpen]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); };
      reader.readAsDataURL(file);

      const { data, error } = await supabase.storage.from('images').upload(`events/${new Date().getTime()}`, file);
      if (error) {
        console.error("Image upload error:", error.message);
        toast({ title: 'Error uploading image.', status: 'error', duration: 3000, isClosable: true });
        return;
      }
      const publicUrl = data.path;
      const { data: signedData, error: signedError } = await supabase.storage.from('images').createSignedUrl(publicUrl, 315360000); // 10 years
      if (signedError) {
        console.error("Signed URL creation error:", signedError.message);
        toast({ title: 'Error signing URL.', status: 'error', duration: 3000, isClosable: true });
        return;
      }
      setEventData({ ...eventData, image_url: signedData.signedUrl });
    }
  };

  const handleCreateEvent = async () => {
    const { data, error } = await supabase.from('Events').insert([eventData]);
    if (error) {
      console.error("Event creation error:", error.message);
      toast({ title: 'Error creating event.', status: 'error', duration: 3000, isClosable: true });
    } else {
      toast({ title: 'Event created successfully.', status: 'success', duration: 3000, isClosable: true });
      closeModal();
    }
  };

  const loadPromoters = async (inputValue: string) => {
    const { data, error } = await supabase.from('Promoter').select('name').ilike('name', `%${inputValue}%`);

    if (error) {
      console.error('Error loading promoters:', error.message);
      return [];
    }
    return data.map(promoter => ({ label: promoter.name, value: promoter.name }));
  };

  const handleLocationChange = (value: any) => {
    geocodeByPlaceId(value.value.place_id).then(results => {setEventData(prevState => ({ ...prevState, location: results[0].formatted_address }));}).catch(error => {console.error('Error getting location details:', error);});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center" onClick={closeModal}>
          <Box className="flex flex-col gap-4" width={'80%'} p={4} bg="white" rounded="md" onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()} as={motion.div} initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
            <Box className="w-full flex justify-end"><Button onClick={closeModal} className="mb-4">x</Button></Box>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <Image src={imagePreview} alt="Preview" />}
            <Flex className="gap-4">
              <Input className="flex-1" placeholder="Title" value={eventData.title} onChange={(e) => setEventData({ ...eventData, title: e.target.value })} />
              <div className="flex-1">
                <AsyncSelect cacheOptions defaultOptions loadOptions={loadPromoters} onInputChange={(inputValue) => setEventData({ ...eventData, promoter: inputValue })} placeholder="Promoter" styles={{ control: (provided) => ({ ...provided, minHeight: '40px', }), container: (provided) => ({ ...provided, width: '100%' }) }} />
              </div>
              <Input className="flex-1" type="date" value={eventData.date} onChange={(e) => setEventData({ ...eventData, date: e.target.value })} />
            </Flex>
            <GooglePlacesAutocomplete apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY} selectProps={{ onChange: handleLocationChange, styles: { input: base => ({ ...base, color: 'black', }), }, }} />
            <Button onClick={handleCreateEvent} mt={4}>Create</Button>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
