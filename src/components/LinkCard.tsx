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
  borderColor?: string;
}

export default function LinkCard(props: LinkCardProps) {
  const {
    title, description, link, icon, borderColor,
  } = props;
  return (

    <Card borderColor={borderColor} borderWidth={borderColor ? 1 : 0}>
      <LinkOverlay as={RouterLink} to={link}>
        <CardHeader pb={0} mb={0}>
          {icon}
        </CardHeader>
        <CardBody>
          <Heading as="h3" size="md" mb={2}>{title}</Heading>
          {description}
        </CardBody>
      </LinkOverlay>
    </Card>
  );
}

LinkCard.defaultProps = {
  borderColor: null,
};
