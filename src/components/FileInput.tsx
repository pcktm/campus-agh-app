import type {UseFormRegisterReturn} from 'react-hook-form';
import {useRef, type ReactNode} from 'react';
import {InputGroup} from '@chakra-ui/react';

type Props = {
  register: UseFormRegisterReturn;
  accept?: string;
  multiple?: boolean;
  children?: ReactNode;
}

export default function FileUploadInput({
  register, accept, multiple, children,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {ref, ...rest} = register;

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <InputGroup onClick={handleClick}>
      <input
        type="file"
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
        accept={accept}
        multiple={multiple}
        hidden
        {...rest}
      />
      {children}
    </InputGroup>
  );
}

FileUploadInput.defaultProps = {
  accept: undefined,
  multiple: false,
  children: undefined,
};
