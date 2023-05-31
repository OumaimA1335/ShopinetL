import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const ReclamationScreen = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    // Handle submission of feedback
    if (feedback.trim() !== '') {
      // Send feedback to server or display confirmation message
      Alert.alert('Thank you for your feedback!');
    } else {
      // Display error message if feedback is empty
      Alert.alert('Please enter your feedback.');
    }
  };

  return (
    <View>
      <TextInput
        multiline
        placeholder="Enter your feedback here..."
        value={feedback}
        onChangeText={setFeedback}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default ReclamationScreen;