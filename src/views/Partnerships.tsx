import {
  Container, Heading, Box, Image, SimpleGrid, Flex, Center,
} from '@chakra-ui/react';
import {Balancer} from 'react-wrap-balancer';
import AcademicaLogo from '../assets/partners/academica.png';
import StudioLogo from '../assets/partners/studio.png';
import BGHLogo from '../assets/partners/bgh.jpg';
import GreenColaLogo from '../assets/partners/greencola.png';

type Partner = {
  logo: string;
  name: string;
}

const partners: Partner[] = [
  {
    name: 'Fundacja Studentów i Absolwentów Akademii Górniczo-Hutniczej w Krakowie ACADEMICA',
    logo: AcademicaLogo,
  },
  {
    name: 'Klub Studio',
    logo: StudioLogo,
  },
  {
    name: 'Browar Górniczo-Hutniczy',
    logo: BGHLogo,
  },
  {
    name: 'Green Cola',
    logo: GreenColaLogo,
  },
];

export default function PartnershipView() {
  return (
    <Container py={5} maxW="container.md">
      <Heading as="h1" size="lg" mb={5}>Nasi partnerzy</Heading>
      <SimpleGrid columns={[1, 1, 2]} spacing={[2, 3]} mb={5}>
        {
          partners.map((partner) => (
            <Center
              key={partner.name}
              textAlign="center"
              flexDirection="column"
              p={5}
              bg="white"
              alignItems="center"
              boxShadow="sm"
              borderRadius="md"
              minH="200px"
            >
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                maxHeight="150px"
                pb={2}
              />
              <Balancer>
                <Heading
                  as="h2"
                  size={['sm', 'md']}
                  mt={2}
                >
                  {partner.name}
                </Heading>
              </Balancer>
            </Center>
          ))
        }
      </SimpleGrid>
    </Container>
  );
}
