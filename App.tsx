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
  ListRenderItem,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { HttpClient, Hub, ID } from './api';

const Section: React.FC<{
  title: string;
}> = ({ children, title }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle]}>
        {title}
      </Text>
      <Text style={[styles.sectionDescription]}>
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

  interface HubInfoItem {
    id: ID;
    data: string;
  }

  const renderItem: ListRenderItem<HubInfoItem> = ({ item }) => (
    <Text>{item.id}: {item.data}</Text>
  );

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <Section title="User Info">
          Your WICRS user ID is <Text style={styles.highlight}>{user_id}</Text>.
        </Section>
        <Section title="Hub Info">
          {isLoading ? <ActivityIndicator /> : (
            <FlatList
              data={[{ id: "ID", data: hub!.id }, { id: "Name", data: hub!.name }, { id: "Description", data: hub!.description }]}
              renderItem={renderItem}
              scrollEnabled={false}
              keyExtractor={item => item.id} />
          )}
        </Section>
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
