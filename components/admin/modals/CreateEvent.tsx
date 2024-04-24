import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

type Props = {};

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CreateEvent = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState<File | null>(null);
  const {
    ready,
    value: address,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setLocation(`${address}, ${lat}, ${lng}`);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUploadEvent = async () => {
    if (image) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`events/${image.name}`, image);

      if (uploadError) {
        toast({
          title: 'Error uploading image.',
          description: uploadError.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      const { data: publicURL } = supabase.storage
        .from('images')
        .getPublicUrl(`events/${image.name}`);

      if (!publicURL) {
        toast({
          title: 'Error getting image URL.',
          description: publicURL,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      const { data, error } = await supabase.from('Events').insert({
        title,
        location,
        date,
        imageUrl: publicURL,
      });

      if (error) {
        toast({
          title: 'Error creating event.',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } else {
        onClose(); // Close the modal
        toast({
          title: 'Event created successfully.',
          description: 'Your event has been created.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Create Event</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Event Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Location</FormLabel>
              <Input
                value={address}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                placeholder="Type address"
              />
              {status === 'OK' &&
                data.map(({ id, description }) => (
                  <div
                    key={id}
                    onClick={() => handleSelect(description)}
                    style={{ cursor: 'pointer' }}
                  >
                    {description}
                  </div>
                ))}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Date</FormLabel>
              <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)}
                showTimeSelect
                dateFormat="Pp"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Image Upload</FormLabel>
              <Input type="file" onChange={handleImageChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUploadEvent}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateEvent;
