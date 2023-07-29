import {
  Card, CardBody, CardHeader, Heading, LinkOverlay,
} from '@chakra-ui/react';
import React from 'react';
import {Link as RouterLink} from 'react-router-dom';

export type LinkCardProps = {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

export default function LinkCard(props: LinkCardProps) {
  const {
    title, description, link, icon,
  } = props;
  return (
    <LinkOverlay as={RouterLink} to={link}>
      <Card>
        <CardHeader>
          {icon}
        </CardHeader>
        <CardBody>
          <Heading as="h3" size="md" mb={2}>{title}</Heading>
          {description}
        </CardBody>
      </Card>
    </LinkOverlay>
  );
}
