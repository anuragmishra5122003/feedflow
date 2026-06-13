import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import Colors from '../../constants/colors';

const { width } = Dimensions.get('window');

const allTopics = [
  { id: 1, label: 'Technology', emoji: '💻' },
  { id: 2, label: 'Artificial Intelligence', emoji: '🤖' },
  { id: 3, label: 'Startups', emoji: '🚀' },
  { id: 4, label: 'Business', emoji: '💼' },
  { id: 5, label: 'Finance', emoji: '💰' },
  { id: 6, label: 'Fitness', emoji: '💪' },
  { id: 7, label: 'Health', emoji: '🏥' },
  { id: 8, label: 'Education', emoji: '📚' },
  { id: 9, label: 'Travel', emoji: '✈️' },
  { id: 10, label: 'Gaming', emoji: '🎮' },
  { id: 11, label: 'Music', emoji: '🎵' },
  { id: 12, label: 'Art & Design', emoji: '🎨' },
  { id: 13, label: 'Food', emoji: '🍕' },
  { id: 14, label: 'Sports', emoji: '⚽' },
  { id: 15, label: 'Science', emoji: '🔬' },
  { id: 16, label: 'Photography', emoji: '📸' },
  { id: 17, label: 'Movies', emoji: '🎬' },
  { id: 18, label: 'Fashion', emoji: '👗' },
];

const avoidTopics = [
  { id: 101, label: 'Politics', emoji: '🏛️' },
  { id: 102, label: 'Drama', emoji: '🎭' },
  { id: 103, label: 'Negativity', emoji: '😤' },
  { id: 104, label: 'Clickbait', emoji: '🎣' },
  { id: 105, label: 'Ads & Promos', emoji: '📢' },
  { id: 106, label: 'Gossip', emoji: '🗣️' },
  { id: 107, label: 'Violence', emoji: '⚠️' },
  { id: 108, label: 'Spam', emoji: '🚫' },
];

export default function Preferences() {
  const [liked, setLiked] = useState([1, 2, 3]);
  const [avoided, setAvoided] = useState([101]);
  const [saved, setSaved] = useState(false);

  const toggleLiked = (id) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setSaved(false);
  };

  const toggleAvoided = (id) => {
    setAvoided((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Interests</Text>
          <Text style={styles.subtitle}>
            Select topics to personalize your Instagram feed
          </Text>
        </View>

        {/* Want More Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>✅</Text>
            <View>
              <Text style={styles.sectionTitle}>See More Of</Text>
              <Text style={styles.sectionSub}>
                {liked.length} topics selected
              </Text>
            </View>
          </View>

          <View style={styles.topicsGrid}>
            {allTopics.map((topic) => {
              const isSelected = liked.includes(topic.id);
              return (
                <TouchableOpacity
                  key={topic.id}
                  onPress={() => toggleLiked(topic.id)}
                  style={[
                    styles.topicChip,
                    isSelected && styles.topicChipSelected,
                  ]}
                >
                  {isSelected && (
                    <LinearGradient
                      colors={['#00D4AA33', '#7C3AED33']}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  )}
                  <Text style={styles.topicEmoji}>{topic.emoji}</Text>
                  <Text
                    style={[
                      styles.topicLabel,
                      isSelected && styles.topicLabelSelected,
                    ]}
                  >
                    {topic.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Want Less Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>🚫</Text>
            <View>
              <Text style={styles.sectionTitle}>See Less Of</Text>
              <Text style={styles.sectionSub}>
                {avoided.length} topics selected
              </Text>
            </View>
          </View>

          <View style={styles.topicsGrid}>
            {avoidTopics.map((topic) => {
              const isSelected = avoided.includes(topic.id);
              return (
                <TouchableOpacity
                  key={topic.id}
                  onPress={() => toggleAvoided(topic.id)}
                  style={[
                    styles.topicChip,
                    isSelected && styles.topicChipAvoid,
                  ]}
                >
                  <Text style={styles.topicEmoji}>{topic.emoji}</Text>
                  <Text
                    style={[
                      styles.topicLabel,
                      isSelected && styles.topicLabelAvoid,
                    ]}
                  >
                    {topic.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmarkRed}>
                      <Text style={styles.checkmarkText}>✕</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
          >
            <LinearGradient
              colors={saved ? ['#00D4AA', '#00D4AA'] : ['#00D4AA', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              <Text style={styles.saveText}>
                {saved ? '✓ Preferences Saved!' : 'Save Preferences'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionEmoji: {
    fontSize: 28,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSub: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  topicChipSelected: {
    borderColor: Colors.primary,
  },
  topicChipAvoid: {
    borderColor: Colors.error,
    backgroundColor: '#EF444411',
  },
  topicEmoji: {
    fontSize: 16,
  },
  topicLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  topicLabelSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  topicLabelAvoid: {
    color: Colors.error,
    fontWeight: '600',
  },
  checkmark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  checkmarkRed: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  saveContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  saveBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  gradientBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  saveText: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
});