import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { v4 as uuidv4 } from "uuid";
import { HttpClient, ID } from './Api';

export default function App() {
  const user_id = uuidv4();
  const client = new HttpClient("http://localhost:8080/api", user_id);
  const [isLoading, setLoading] = useState(true);
  const [data, setData]: [ID | undefined, any] = useState();
  console.log("test");

  const createHub = async () => {
    try {
      const response = await client.createHub("test", "testing hub");
      setData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    createHub();
    console.log("done");
  }, []);

  return (
    <View style={styles.container}>
      <Text>Your UUID is {user_id}</Text>
      {isLoading ? <ActivityIndicator /> : (
        <Text>Created a hub, it's ID is {data}</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
