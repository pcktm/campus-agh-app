import {Auth} from '@supabase/auth-ui-react';
import {ThemeSupa} from '@supabase/auth-ui-shared';
import {Container, Image, Box} from '@chakra-ui/react';
import {client} from '../utils/client.ts';
import logo from '../assets/logo.svg';

export default function AuthView() {
  return (
    <Box backgroundColor="#121f30">
      <Container
        height="100vh"
        display="flex"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        gap="0.5rem"
      >
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
      </Container>
    </Box>
  );
}
