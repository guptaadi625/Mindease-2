// screens/ChatbotScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics'; // For haptic feedback

export default function ChatbotScreen({ route }) {
  const { surveyAnswers } = route.params || {}; // Receive survey answers
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef(null);

  const API_KEY = "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"; // Replace with your actual API key

  useEffect(() => {
    const analyzeSurveyAndGreet = async () => {
      const userAnalysis = analyzeSurvey(surveyAnswers);

      try {
        const systemMessage = {
          role: 'system',
          content: `You are MindEase, a friendly mental health support chatbot created by Aditya.
          Here are the user's mental health survey results: ${JSON.stringify(surveyAnswers)}.
          Your tasks:
          - Greet the user warmly
          - Analyze the user’s mental health status and provide a suggestion
          - Offer clinic details or help when needed.
          Only talk about emotional wellness, mental health support, stress management, self-care.`,
        };

        const userMessage = {
          role: 'user',
          content: `Please analyze my survey results and provide suggestions and clinic details if needed: ${JSON.stringify(surveyAnswers)}`,
        };

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [systemMessage, userMessage],
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
          }),
        });

        const data = await response.json();
        const botReply = data.choices[0]?.message?.content || "Welcome to MindEase!";

        const assistantMessage = { role: 'assistant', content: botReply };
        setMessages([assistantMessage]);

      } catch (error) {
        console.error('Error during initial greeting:', error.message);
        setMessages([{ role: 'assistant', content: "Welcome to MindEase! I'm here to support you!" }]);
      }
    };

    analyzeSurveyAndGreet();
  }, [surveyAnswers]); // make sure useEffect runs when surveyAnswers changes

  const analyzeSurvey = (answers) => {
    let problemStatement = '';
    let clinicDetails = 'For further help, please contact a local mental health clinic or hotline.';
    
    // Example basic analysis based on answers
    if (answers.stress === 'Always' || answers.anxiety === 'Always') {
      problemStatement = 'You might be experiencing high levels of stress and anxiety. It’s important to focus on self-care and consider seeking professional help.';
    } else if (answers.sleep === 'Poorly') {
      problemStatement = 'It seems like you’re not getting enough rest. Poor sleep can contribute to mental health challenges, so improving your sleep habits could help.';
    } else if (answers.loneliness === 'Often') {
      problemStatement = 'Feeling lonely often can impact your mental well-being. Reaching out to a support system or professional might be helpful.';
    } else {
      problemStatement = 'Your answers suggest you may be managing well overall, but continue to engage in self-care activities to maintain your well-being.';
    }

    // Example of clinic details (could be dynamic based on location or severity)
    clinicDetails = `
      - National Mental Health Helpline: 1-800-123-4567
      - Visit a nearby clinic for professional counseling support: [Insert Clinic Info Here]
      - Consider scheduling a session with a therapist through [Insert Therapy Service]
    `;

    return { problemStatement, clinicDetails };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // ✅ Vibrate on Send

    const userMessage = { role: 'user', content: input };

    const systemMessage = {
      role: 'system',
      content: `You are MindEase, a friendly mental health support chatbot created by 5 people as a final year group project namely Aditya, Gaurav, Miransh, Pawandeep, Shrey.
      You can use the user's survey results: ${JSON.stringify(surveyAnswers)}.
      Only answer questions about mental health, emotions, anxiety, depression, stress, emotional wellness.
      If asked unrelated things, politely reply it's out of capabilities.`
    };

    const updatedMessages = [systemMessage, ...messages, userMessage];

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    Keyboard.dismiss();

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: updatedMessages.slice(-10),
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API error:', errorData);
        throw new Error('Groq API returned error');
      }

      const data = await response.json();
      const botReply = data.choices[0]?.message?.content || "Sorry, I couldn't understand.";

      const assistantMessage = { role: 'assistant', content: botReply };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);

    } catch (error) {
      console.error('Chatbot error:', error.message);
      const errorAssistant = { role: 'assistant', content: "Error contacting AI. Please try again." };
      setMessages(prevMessages => [...prevMessages, errorAssistant]);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';
    return (
      <View
        key={index}
        style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}
      >
        <Text>{msg.content}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.chatContainer}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {messages.map(renderMessage)}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  messageBubble: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#c8e6c9',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#e1bee7',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 44,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
  },
});
