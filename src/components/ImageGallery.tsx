/* eslint-disable import/no-unresolved */
import {Box, Button} from '@chakra-ui/react';
import {useState} from 'react';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/captions.css';

import {RiGalleryFill} from 'react-icons/ri';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Captions from 'yet-another-react-lightbox/plugins/captions';

export type GalleryImage = {
  url: string;
  id: string | number;
  title?: string;
  description?: string;
}

type Props = {
  buttonText: string;
  images: GalleryImage[]
}

export default function ImageGallery({images, buttonText}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Lightbox
        open={open}
        plugins={[Counter, Captions]}
        close={() => setOpen(false)}
        styles={{container: {backgroundColor: 'rgba(0, 0, 0, .85)'}}}
        slides={images.map((img) => ({
          src: img.url,
          alt: `${img.title ?? img.description ?? 'Zdjęcie'}'`,
          title: img.title,
          description: img.description,
        }))}
      />
      <Button
        variant="link"
        colorScheme="blue"
        isDisabled={images.length === 0}
        onClick={() => setOpen(true)}
        leftIcon={<RiGalleryFill />}
      >
        {buttonText}
      </Button>
    </Box>
  );
}
