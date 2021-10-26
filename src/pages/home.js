import DatePicker from 'react-datepicker';
import Hero from '../components/Hero';
import Layout from '../layouts/Layout';
import ListingCard from '../components/ListingCard';
import Nav from '../components/Nav';
import React, {useState} from 'react';
import {
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text
} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import {format} from 'date-fns';
import {gql, useQuery} from '@apollo/client';

import 'react-datepicker/dist/react-datepicker.css';

export const FEATURED_LISTINGS = gql`
  query getFeaturedListings {
    featuredListings {
      id
      title
      photoThumbnail
      numOfBeds
      overallRating
    }
  }
`;
export default function Home() {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [numOfBeds, setNumOfBeds] = useState(1);

  const INPUT_PROPS = {size: 'lg', width: '300px'};
  const DATEPICKER_PROPS = {
    ...INPUT_PROPS,
    type: 'date',
    as: DatePicker,
    dateFormat: 'MM-dd-yyyy',
    minDate: today,
    startDate,
    endDate,
    onChange: date => {
      setStartDate(date);

      // match end date with start date if start date was changed to be farther in the future than the current end date
      if (endDate < date) {
        setEndDate(date);
      }
    }
  };

  const {loading, error, data} = useQuery(FEATURED_LISTINGS);
  if (loading) return 'Loading...';
  if (error) return `uhoh error! ${error.message}`;
  return (
    <div>
      <Hero>
        <Nav isLight />
        <Container maxW="container.md" textColor="white">
          <Flex
            direction="column"
            justify="space-between"
            minH="300px"
            align="center"
          >
            <Flex direction="row" justify="space-between" minWidth="100%">
              <Stack direction="column" spacing={2}>
                <Text fontSize="large" fontWeight="bold">
                  Check in
                </Text>
                <Input {...DATEPICKER_PROPS} selected={startDate} />
              </Stack>
              <Stack direction="column" spacing={2}>
                <Text fontSize="large" fontWeight="bold">
                  Check out
                </Text>
                <Input
                  {...DATEPICKER_PROPS}
                  minDate={today < startDate ? startDate : today}
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                />
              </Stack>
            </Flex>
            <Select
              placeholder="number of beds"
              {...INPUT_PROPS}
              onChange={e => setNumOfBeds(e.target.value)}
              value={numOfBeds}
            >
              <option value={1}>1 bed</option>
              <option value={2}>2 beds</option>
              <option value={3}>3 beds</option>
            </Select>
            <Button
              as={Link}
              to={`/search/?startDate=${format(
                startDate,
                'MM-dd-yyyy'
              )}&endDate=${format(
                endDate,
                'MM-dd-yyyy'
              )}&numOfBeds=${numOfBeds}`}
              colorScheme="pink"
              {...INPUT_PROPS}
            >
              Find a place
            </Button>
          </Flex>
        </Container>
      </Hero>
      <Layout noNav>
        <Container maxW="container.xl" pt="4">
          <Heading as="h1" fontSize="3xl" fontWeight="bold" mb="4">
            Explore Space
          </Heading>
          <SimpleGrid columns={[2, null, 3]} spacing={4}>
            {data &&
              data.featuredListings.map(listing => (
                <ListingCard key={listing.title} {...listing} />
              ))}
          </SimpleGrid>
        </Container>
      </Layout>
    </div>
  );
}
