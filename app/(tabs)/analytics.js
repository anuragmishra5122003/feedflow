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
import { useState, useEffect } from 'react';
import { API } from '../../constants/api';
import Colors from '../../constants/colors';

const { width } = Dimensions.get('window');

const weeklyData = [
  { day: 'Mon', actions: 18 },
  { day: 'Tue', actions: 32 },
  { day: 'Wed', actions: 27 },
  { day: 'Thu', actions: 45 },
  { day: 'Fri', actions: 38 },
  { day: 'Sat', actions: 52 },
  { day: 'Sun', actions: 36 },
];

const maxActions = Math.max(...weeklyData.map((d) => d.actions));

const topicStats = [
  { label: 'Artificial Intelligence', emoji: '🤖', percent: 34, color: '#00D4AA' },
  { label: 'Technology', emoji: '💻', percent: 28, color: '#7C3AED' },
  { label: 'Startups', emoji: '🚀', percent: 18, color: '#F59E0B' },
  { label: 'Business', emoji: '💼', percent: 12, color: '#3B82F6' },
  { label: 'Others', emoji: '✨', percent: 8, color: '#EC4899' },
];

export default function Analytics() {
  const [automationOn, setAutomationOn] = useState(false);
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([
    { emoji: '❤️', msg: 'Liked 3 AI posts', time: '5m ago' },
    { emoji: '➕', msg: 'Followed @openai', time: '22m ago' },
    { emoji: '❤️', msg: 'Liked 2 startup posts', time: '1h ago' },
    { emoji: '🗑️', msg: 'Unfollowed spam account', time: '2h ago' },
    { emoji: '❤️', msg: 'Liked 5 tech posts', time: '3h ago' },
    { emoji: '➕', msg: 'Followed @ycombinator', time: '5h ago' },
  ]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch(API.status);
      const data = await res.json();
      setStatus(data);
      setAutomationOn(data.active);
      if (data.logs && data.logs.length > 0) {
        const formatted = data.logs.map((log) => ({
          emoji: getEmoji(log.message),
          msg: log.message,
          time: formatTime(log.time),
        }));
        setLogs(formatted);
      }
    } catch (e) {
      console.log('Backend not reachable');
    }
  };

  const handleToggle = async () => {
    try {
      if (automationOn) {
        await fetch(API.stop, { method: 'POST' });
        setAutomationOn(false);
      } else {
        await fetch(API.start, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: process.env.IG_USERNAME || 'testuser',
            password: process.env.IG_PASSWORD || 'testpass',
            preferences: { liked: [1, 2, 3] },
          }),
        });
        setAutomationOn(true);
      }
    } catch (e) {
      console.log('Toggle error:', e.message);
    }
  };

  const getEmoji = (message) => {
    if (message.includes('❤️')) return '❤️';
    if (message.includes('✅')) return '✅';
    if (message.includes('🚀')) return '🚀';
    if (message.includes('❌')) return '❌';
    if (message.includes('🔍')) return '🔍';
    if (message.includes('🔐')) return '🔐';
    return '⚡';
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'just now';
    const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your feed personalization</Text>
        </View>

        {/* Automation Toggle Card */}
        <View style={styles.section}>
          <View style={styles.automationCard}>
            <LinearGradient
              colors={automationOn ? ['#00D4AA22', '#7C3AED22'] : ['#1A1A26', '#1A1A26']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.automationLeft}>
              <Text style={styles.automationEmoji}>🤖</Text>
              <View>
                <Text style={styles.automationTitle}>Automation Engine</Text>
                <Text style={styles.automationSub}>
                  {status?.lastActivity
                    ? `Last active: ${formatTime(status.lastActivity)}`
                    : 'Not started yet'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.toggle, automationOn && styles.toggleOn]}
              onPress={handleToggle}
            >
              <View style={[styles.toggleThumb, automationOn && styles.toggleThumbOn]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {status?.actionsCount || 248}
              </Text>
              <Text style={styles.statLabel}>Total Actions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {status?.feedScore || 72}%
              </Text>
              <Text style={styles.statLabel}>Feed Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>12d</Text>
              <Text style={styles.statLabel}>Running</Text>
            </View>
          </View>
        </View>

        {/* Weekly Bar Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {weeklyData.map((item, i) => (
                <View key={i} style={styles.barGroup}>
                  <Text style={styles.barValue}>{item.actions}</Text>
                  <View style={styles.barTrack}>
                    <LinearGradient
                      colors={['#00D4AA', '#7C3AED']}
                      style={[
                        styles.bar,
                        { height: `${(item.actions / maxActions) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.barDay}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Topic Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topic Breakdown</Text>
          <View style={styles.card}>
            {topicStats.map((topic, i) => (
              <View key={i} style={styles.topicRow}>
                <Text style={styles.topicEmoji}>{topic.emoji}</Text>
                <View style={styles.topicInfo}>
                  <View style={styles.topicLabelRow}>
                    <Text style={styles.topicLabel}>{topic.label}</Text>
                    <Text style={[styles.topicPercent, { color: topic.color }]}>
                      {topic.percent}%
                    </Text>
                  </View>
                  <View style={styles.topicBar}>
                    <View
                      style={[
                        styles.topicBarFill,
                        {
                          width: `${topic.percent}%`,
                          backgroundColor: topic.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Activity Log */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Log</Text>
          <View style={styles.card}>
            {logs.map((log, i) => (
              <View key={i} style={[styles.logItem, i < logs.length - 1 && styles.logBorder]}>
                <View style={styles.logIconBox}>
                  <Text style={styles.logEmoji}>{log.emoji}</Text>
                </View>
                <Text style={styles.logMsg}>{log.msg}</Text>
                <Text style={styles.logTime}>{log.time}</Text>
              </View>
            ))}
          </View>
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
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  automationCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  automationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  automationEmoji: {
    fontSize: 28,
  },
  automationTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  automationSub: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.textMuted,
  },
  toggleThumbOn: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  statValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  barValue: {
    color: Colors.textSecondary,
    fontSize: 10,
  },
  barTrack: {
    flex: 1,
    width: 28,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
  },
  barDay: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  topicEmoji: {
    fontSize: 20,
  },
  topicInfo: {
    flex: 1,
    gap: 6,
  },
  topicLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topicLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  topicPercent: {
    fontSize: 13,
    fontWeight: '700',
  },
  topicBar: {
    height: 6,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  topicBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  logBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logEmoji: {
    fontSize: 16,
  },
  logMsg: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  logTime: {
    color: Colors.textMuted,
    fontSize: 11,
  },
});