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
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../constants/api';
import Colors from '../../constants/colors';

const { width } = Dimensions.get('window');

export default function Home() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    // Listen to real user data from Firestore
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) setUserData(snap.data());
    });

    return unsub;
  }, [user]);

  useEffect(() => {
    fetchBackendStatus();
    const interval = setInterval(fetchBackendStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBackendStatus = async () => {
    try {
      const res = await fetch(API.status);
      const data = await res.json();
      setBackendStatus(data);
    } catch (e) {}
  };

  const actionsCount = backendStatus?.actionsCount || userData?.actionsCount || 0;
  const feedScore = backendStatus?.feedScore || userData?.feedScore || 0;
  const isActive = backendStatus?.active || userData?.automationActive || false;
  const userName = userData?.name || user?.name || 'there';

  const recentActivity = backendStatus?.logs?.slice(0, 5).map((log) => ({
    action: log.message,
    time: formatTime(log.time),
    emoji: getEmoji(log.message),
    topic: getTopic(log.message),
  })) || [
    { action: 'Liked post about AI', topic: 'Artificial Intelligence', time: '2m ago', emoji: '🤖' },
    { action: 'Followed @techcrunch', topic: 'Technology', time: '15m ago', emoji: '💻' },
    { action: 'Liked post about startups', topic: 'Startups', time: '32m ago', emoji: '🚀' },
    { action: 'Unfollowed irrelevant account', topic: 'Cleanup', time: '1h ago', emoji: '🧹' },
    { action: 'Liked post about fitness', topic: 'Health', time: '2h ago', emoji: '💪' },
  ];

  function formatTime(isoString) {
    if (!isoString) return 'just now';
    const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  }

  function getEmoji(message) {
    if (message.includes('❤️')) return '❤️';
    if (message.includes('✅')) return '✅';
    if (message.includes('🚀')) return '🚀';
    if (message.includes('❌')) return '❌';
    if (message.includes('🔍')) return '🔍';
    if (message.includes('🔐')) return '🔐';
    if (message.includes('➕')) return '➕';
    return '⚡';
  }

  function getTopic(message) {
    if (message.toLowerCase().includes('ai') || message.toLowerCase().includes('artificial')) return 'AI';
    if (message.toLowerCase().includes('tech')) return 'Technology';
    if (message.toLowerCase().includes('startup')) return 'Startups';
    return 'General';
  }

  const stats = [
    { label: 'Actions Done', value: actionsCount.toString(), emoji: '⚡' },
    { label: 'Feed Score', value: `${feedScore}%`, emoji: '📈' },
    { label: 'Topics Active', value: (userData?.preferences?.liked?.length || 3).toString(), emoji: '🎯' },
    { label: 'Days Running', value: getDaysRunning(userData?.createdAt), emoji: '🔥' },
  ];

  function getDaysRunning(createdAt) {
    if (!createdAt) return '0';
    const days = Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    return days.toString();
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <LinearGradient colors={['#12121A', '#0A0A0F']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning 👋</Text>
              <Text style={styles.username}>{userName}</Text>
            </View>
            <View style={[styles.statusBadge, !isActive && styles.statusBadgeOff]}>
              <View style={[styles.statusDot, !isActive && styles.statusDotOff]} />
              <Text style={[styles.statusText, !isActive && styles.statusTextOff]}>
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          {/* Main Card */}
          <LinearGradient
            colors={['#00D4AA22', '#7C3AED22']}
            style={styles.mainCard}
          >
            <View style={styles.mainCardInner}>
              <Text style={styles.mainCardLabel}>Personalization Score</Text>
              <Text style={styles.mainCardValue}>{feedScore}%</Text>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#00D4AA', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${feedScore}%` }]}
                />
              </View>
              <Text style={styles.mainCardSub}>
                {feedScore > 50
                  ? 'Your feed is improving! Keep automation running.'
                  : 'Start automation to improve your feed score.'}
              </Text>
            </View>
          </LinearGradient>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={styles.statEmoji}>{stat.emoji}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Automation Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automation</Text>
          <View style={styles.automationCard}>
            <View style={styles.automationLeft}>
              <View style={styles.automationIconContainer}>
                <Text style={styles.automationIcon}>🤖</Text>
              </View>
              <View>
                <Text style={styles.automationTitle}>Auto-Personalization</Text>
                <Text style={styles.automationSub}>
                  {isActive
                    ? `${actionsCount} actions completed`
                    : 'Go to Analytics to start'}
                </Text>
              </View>
            </View>
            <View style={[styles.automationBadge, !isActive && styles.automationBadgeOff]}>
              <View style={[styles.pulseDot, !isActive && styles.pulseDotOff]} />
              <Text style={[styles.automationStatus, !isActive && styles.automationStatusOff]}>
                {isActive ? 'ON' : 'OFF'}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivity.map((item, i) => (
              <View key={i} style={styles.activityItem}>
                <View style={styles.activityIconBox}>
                  <Text style={styles.activityEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityAction}>{item.action}</Text>
                  <Text style={styles.activityTopic}>{item.topic}</Text>
                </View>
                <Text style={styles.activityTime}>{item.time}</Text>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  username: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D4AA22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#00D4AA44',
  },
  statusBadgeOff: {
    backgroundColor: '#ffffff11',
    borderColor: Colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  statusDotOff: {
    backgroundColor: Colors.textMuted,
  },
  statusText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  statusTextOff: {
    color: Colors.textMuted,
  },
  mainCard: {
    borderRadius: 20,
    padding: 1,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mainCardInner: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
  },
  mainCardLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },
  mainCardValue: {
    color: Colors.text,
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  mainCardSub: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: (width - 52) / 2,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  statEmoji: { fontSize: 28 },
  statValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  automationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  automationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  automationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  automationIcon: { fontSize: 22 },
  automationTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  automationSub: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  automationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D4AA22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#00D4AA44',
  },
  automationBadgeOff: {
    backgroundColor: '#ffffff11',
    borderColor: Colors.border,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  pulseDotOff: {
    backgroundColor: Colors.textMuted,
  },
  automationStatus: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  automationStatusOff: {
    color: Colors.textMuted,
  },
  activityList: { gap: 12 },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activityIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityEmoji: { fontSize: 20 },
  activityInfo: { flex: 1 },
  activityAction: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  activityTopic: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  activityTime: {
    color: Colors.textMuted,
    fontSize: 11,
  },
});