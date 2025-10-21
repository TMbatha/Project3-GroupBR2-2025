import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function TestBackend() {
  const [results, setResults] = useState('');

  const testEndpoint = async (name, url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return `✅ ${name}: ${JSON.stringify(data, null, 2)}\n\n`;
    } catch (error) {
      return `❌ ${name}: ${error.message}\n\n`;
    }
  };

  const runTests = async () => {
    setResults('Testing...\n\n');
    let output = '';

    output += await testEndpoint('Children', 'http://localhost:8080/api/child/all');
    output += await testEndpoint('Nannies', 'http://localhost:8080/api/nanny/all');
    output += await testEndpoint('Drivers', 'http://localhost:8080/api/driver/all');
    output += await testEndpoint('Parents', 'http://localhost:8080/api/parent/all');

    setResults(output);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Backend API Test</Text>
      
      <TouchableOpacity style={styles.button} onPress={runTests}>
        <Text style={styles.buttonText}>Run Tests</Text>
      </TouchableOpacity>

      <ScrollView style={styles.results}>
        <Text style={styles.resultsText}>{results}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F2F2F7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  results: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  resultsText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
