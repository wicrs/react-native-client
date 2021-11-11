import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
  FlatList,
  SectionList,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { HttpClient, Hub, ID } from './api';

const Section: React.FC<{
  title: string;
}> = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const user_id = "a1152b7cf5004b9ab73f69144f8305b5";
  const client = new HttpClient("http://localhost:8080/api", user_id);
  const [isLoading, setLoading] = useState(true);
  const [hub, setHub]: [Hub | undefined, any] = useState();

  const createHub = async () => {
    try {
      const response = await client.createHub("test", "testing hub");
      const hub = await client.getHub(response);
      setHub(hub);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    createHub();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="User Info">
            Your WICRS user ID is <Text style={styles.highlight}>{user_id}</Text>.
          </Section>
          <Section title="Hub Info">
            <Text>A hub {isLoading ? "is being" : "has been"} created for you.</Text>
          </Section>
          <Section title={''}>{isLoading ? <ActivityIndicator /> : (
            <Text>
              <FlatList
                data={[["ID", hub?.id], ["Name", hub?.name], ["Description", hub?.description], ["Created", hub?.created.toString()], ["Owner", hub?.owner], ["Default Group", hub?.default_group]]}
                renderItem={({ item }) => <Text>{item[0]}: {item[1]}</Text>} />
            </Text>
          )}</Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
