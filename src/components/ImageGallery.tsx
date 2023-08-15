/* eslint-disable import/no-unresolved */
import React, {Suspense, useState} from 'react';
import {Box, Button, Skeleton} from '@chakra-ui/react';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';

import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import {RiGalleryFill} from 'react-icons/ri';

type Props = {
  buttonText: string;
  images: {
    url: string;
    id: string | number;
  }[]
}

export default function ImageGallery({images, buttonText}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Lightbox
        open={open}
        plugins={[Counter]}
        close={() => setOpen(false)}
        styles={{container: {backgroundColor: 'rgba(0, 0, 0, .85)'}}}
        slides={images.map((img) => ({
          src: img.url,
          alt: `${img.id}`,
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
