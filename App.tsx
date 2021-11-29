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
  LogBox,
  TextInput,
  Button,
} from 'react-native';

import { HttpClient, Hub } from './api';

const Section: React.FC<{
  title?: string;
}> = ({ children, title }) => {
  return (
    <View style={styles.sectionContainer}>
      {title !== null ? <Text style={[styles.sectionTitle]}>
        {title}
      </Text> : null}
      <Text>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

  const user_id = "a1152b7cf5004b9ab73f69144f8305b5";
  const client = new HttpClient("http://localhost:8080/api", user_id);
  const [joinFailed, setJoinFailed] = useState<boolean | null>(null);
  const [joinLoading, setJoinLoading] = useState<boolean>(false);
  const [joinId, setJoinId] = useState<string>("");
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [createFailed, setCreateFailed] = useState<boolean | null>(null);
  const [getFailed, setGetFailed] = useState<boolean | null>(null);
  const [getLoading, setGetLoading] = useState<boolean>(false);
  const [getId, setGetId] = useState<string>("");
  const [hub, setHub] = useState<Hub | null>(null);



  const renderItem: ListRenderItem<{ id: string; data: string; }> = ({ item }) => (
    <Text>{item.id}: {item.data}</Text>
  );

  return (
    <SafeAreaView>
      <Section title="User Info">
        Your WICRS user ID is <Text style={styles.highlight}>{user_id}</Text>.
      </Section>
      <Section title="Join hub">
        <View style={styles.part}>
          <TextInput
            style={{ ...styles.input, width: "100%" }}
            placeholder="Enter UUID here..."
            onChangeText={id => setJoinId(id)}
            value={joinId}
          />
          <Button
            onPress={() => { setJoinLoading(true); client.joinHub(joinId).then(() => setJoinFailed(false)).catch(() => setJoinFailed(true)).finally(() => setJoinLoading(false)) }}
            title="Join"
            accessibilityLabel="Joins the hub with the given ID, giving access to it."
          />
          {joinFailed !== null ? (joinFailed ? <Text>Failed to join hub</Text> : <Text>Success</Text>) : (joinLoading ? <ActivityIndicator /> : null)}
        </View>
      </Section>
      <Section title="Hub Info">
        <View style={styles.part}>
          <TextInput
            style={{ ...styles.input, width: "100%" }}
            placeholder="Enter UUID here..."
            onChangeText={id => setGetId(id)}
            value={getId}
          />
          <Button
            onPress={() => { setGetLoading(true); client.getHub(joinId).then((data) => { setHub(data); setGetFailed(false) }).catch(() => setGetFailed(true)).finally(() => setGetLoading(false)) }}
            title="Get"
            accessibilityLabel="Gets the hub with the given ID and displays it below."
          />
        </View>
        <View style={styles.part}>
          {getFailed !== null ? (getFailed ? <Text>Failed to load hub</Text> : (getLoading ? (<ActivityIndicator />) : (
            <Text>Name: {hub?.name}{"\n"}Description: {hub?.description}{"\n"}Channels: {JSON.stringify(hub?.channels)}</Text>
          ))) : null}
        </View>
      </Section>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    width: "100%",
    paddingHorizontal: 12,
  },
  part: {
    marginTop: 2,
    width: "100%",
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
