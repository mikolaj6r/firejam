import Application from './components/Application';
import { UserProvider } from "./context/UserContext";
import { SidebarProvider } from './context/SidebarContext'

import messages_en from "./messages/en.json";
import messages_pl from "./messages/pl.json";

import { IntlProvider } from 'react-intl'

const messages = {
  'en': messages_en,
  'pl': messages_pl
};

const language = navigator.language.split(/[-_]/)[0];

function App() {
  return (
    <IntlProvider defaultLocale="en" locale={language} messages={messages[language]}>
      <UserProvider>
        <SidebarProvider>
          <Application />
        </SidebarProvider>
      </UserProvider>
    </IntlProvider>
  );
}

export default App;
