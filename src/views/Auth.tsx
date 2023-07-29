import {
  Box, Center,
  Container, Image,
} from '@chakra-ui/react';
import {Auth} from '@supabase/auth-ui-react';
import {ThemeSupa} from '@supabase/auth-ui-shared';
import logo from '../assets/logo.svg';
import {useSupabase} from '../hooks/useSupabase.ts';

export default function AuthView() {
  const client = useSupabase();
  return (
    <Center
      height="100vh"
    >
      <Box
        as={Container}
        maxW="sm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box>
          <Image
            src={logo}
            alt="Logo Campusu"
            width="200px"
            height="auto"
            margin="0 auto"
          />
          <Auth
            supabaseClient={client}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#e61b5a',
                    brandAccent: '#eb497b',
                    anchorTextColor: '#f4fafb',
                    brandButtonText: '#f4fafb',
                    inputLabelText: '#f4fafb',
                    inputBorder: '#8e9495',
                    inputBorderFocus: '#f4fafb',
                    inputBorderHover: '#8e9495',
                    inputText: '#f4fafb',
                  },
                  fonts: {
                    bodyFontFamily: 'Lato',
                    inputFontFamily: 'Lato',
                    buttonFontFamily: 'Lato',
                    labelFontFamily: 'Lato',
                  },
                },
              },
            }}
            providers={[]}
            showLinks={false}
            localization={{
              variables: {
                sign_in: {
                  button_label: 'Zaloguj się',
                  password_label: 'Hasło',
                  email_label: 'Email',
                  password_input_placeholder: 'Twoje hasło',
                  email_input_placeholder: 'Twój email',
                },
              },
            }}
          />
        </Box>
      </Box>
    </Center>
  );
}
