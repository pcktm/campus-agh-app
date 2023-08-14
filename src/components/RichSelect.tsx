import {useState, useEffect} from 'react';
import {useCombobox} from 'downshift';
import {
  Button, Input, ListItem, Stack, UnorderedList, Text, FormLabel, Box, IconButton, FormControl,
} from '@chakra-ui/react';
import {RiArrowDownLine, RiArrowUpLine} from 'react-icons/ri';

export type RichSelectItem = {
  id: string | number;
  title: string;
  subtitle?: string;
}

const filterItems = (inputValue: string) => (item: RichSelectItem) => item.title.toLowerCase().includes(inputValue.toLowerCase());

type Props = {
  items: RichSelectItem[];
  label: string;
  onSelect: (item: RichSelectItem) => void;
  placeholder?: string;
}

export default function RichSelect({
  items: inputItems, label, onSelect, placeholder,
}: Props) {
  const [items, setItems] = useState(inputItems);
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    onInputValueChange({inputValue}) {
      if (!inputValue) {
        setItems(inputItems);
        return;
      }
      setItems(inputItems.filter(filterItems(inputValue)));
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

  return (
    <Box>
      <Stack direction="column" gap={0}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <FormLabel {...getLabelProps()}>
          {label}
        </FormLabel>
        <FormControl as={Stack} gap={0.5} direction="row" align="center">
          <Input
            placeholder={placeholder}
            {...getInputProps()}
          />
          <IconButton
            aria-label="toggle menu"
            type="button"
            icon={
              !isOpen ? <RiArrowDownLine /> : <RiArrowUpLine />
            }
            {...getToggleButtonProps()}
          />
        </FormControl>
      </Stack>
      <UnorderedList
        className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
          !(isOpen && items.length) && 'hidden'
        }`}
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
