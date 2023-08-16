import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup, InputRightElement,
  ListItem, Stack,
  Text,
  UnorderedList,
  useBreakpointValue,
} from '@chakra-ui/react';
import {useCombobox} from 'downshift';
import {useEffect, useState} from 'react';
import {RiArrowDownLine, RiArrowUpLine, RiCloseLine} from 'react-icons/ri';

export type RichSelectItem = {
  id: string;
  title: string;
  subtitle?: string | null;
}

const filterItems = (inputValue: string) => (item: RichSelectItem) => item.title.toLowerCase().includes(inputValue.toLowerCase());

type Props = {
  items: RichSelectItem[];
  label: string;
  onSelect: (item: RichSelectItem | null) => void;
  placeholder?: string;
}

export default function RichSelect({
  items: inputItems, label, onSelect, placeholder,
}: Props) {
  const [items, setItems] = useState(inputItems);
  const maxItems = useBreakpointValue({base: 3, md: 3}, {ssr: false});

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    reset,
  } = useCombobox({
    onInputValueChange({inputValue}) {
      if (!inputValue) {
        setItems(inputItems);
        return;
      }
      setItems(inputItems.filter(filterItems(inputValue)).slice(0, maxItems));
    },
    items,
    itemToString(item) {
      return item ? item.title : '';
    },
    onSelectedItemChange({selectedItem: item}) {
      if (item && onSelect) {
        onSelect(item);
      }
    },
  });

  useEffect(() => {
    reset();
    setItems(inputItems);
  }, [inputItems, reset]);

  return (
    <Box>
      <Stack direction="column" gap={0}>
        <FormLabel {...getLabelProps()}>
          {label}
        </FormLabel>
        <FormControl as={Stack} gap={0.5} direction="row" align="center">
          <InputGroup>
            <Input
              pr="4.5rem"
              placeholder={placeholder}
              {...getInputProps()}
            />
            <InputRightElement width="3rem">

              <IconButton
                h="1.75rem"
                size="sm"
                aria-label="toggle menu"
                type="button"
                icon={
                  !isOpen ? <RiArrowDownLine /> : <RiArrowUpLine />
                }
                {...getToggleButtonProps()}
              />
            </InputRightElement>
          </InputGroup>
          <IconButton
            aria-label="clear input"
            icon={<RiCloseLine />}
            onClick={() => {
              reset();
              onSelect(null);
            }}
          />
        </FormControl>
      </Stack>
      <UnorderedList
        sx={{
          position: 'absolute',
          zIndex: 10,
          backgroundColor: 'white',
          padding: 0,
          maxHeight: '20rem',
          overflowY: 'scroll',
          boxShadow: 'md',
          width: '18rem',
          marginTop: '0.25rem',
          display: !(isOpen && items.length) && 'none',
        }}
        {...getMenuProps()}
      >
        {isOpen
            && items.map((item, index) => (
              <ListItem
                key={item.id}
                sx={{
                  backgroundColor: highlightedIndex === index ? 'gray.100' : 'white',
                  fontWeight: selectedItem === item ? 'bold' : 'normal',
                  paddingY: '0.5rem',
                  paddingX: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                {...getItemProps({item, index})}
              >
                <Text>{item.title}</Text>
                {
                  item.subtitle && (<Text color="gray.600" fontSize="sm">{item.subtitle}</Text>)
                }
              </ListItem>
            ))}
      </UnorderedList>
    </Box>
  );
}

RichSelect.defaultProps = {
  placeholder: 'Wybierz...',
};
