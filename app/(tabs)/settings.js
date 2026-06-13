import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/colors';

const VERSION = '1.0.0';

export default function Settings() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [autoRun, setAutoRun] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [activityLog, setActivityLog] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) setUserData(snap.data());
    });
    return unsub;
  }, [user]);

  const handleConnect = () => {
    router.push('/connect');
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Instagram',
      'This will stop all automation. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'users', user.uid), {
                igConnected: false,
                igUsername: '',
                automationActive: false,
              });
            } catch (e) {}
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const displayName = userData?.name || user?.name || 'User';
  const displayEmail = userData?.email || user?.email || '';
  const igUsername = userData?.igUsername || '';
  const igConnected = userData?.igConnected || false;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#00D4AA22', '#7C3AED22']}
            style={styles.profileCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <LinearGradient
              colors={['#00D4AA', '#7C3AED']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{displayEmail}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Instagram Connection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instagram</Text>
          <View style={styles.card}>
            <View style={styles.igRow}>
              <View style={styles.igLeft}>
                <Text style={styles.igEmoji}>📸</Text>
                <View>
                  <Text style={styles.igName}>
                    {igConnected ? `@${igUsername}` : 'Not Connected'}
                  </Text>
                  <View style={styles.connectedBadge}>
                    <View style={[
                      styles.connectedDot,
                      !igConnected && styles.connectedDotOff
                    ]} />
                    <Text style={[
                      styles.connectedText,
                      !igConnected && styles.connectedTextOff
                    ]}>
                      {igConnected ? 'Connected' : 'Disconnected'}
                    </Text>
                  </View>
                </View>
              </View>
              {igConnected && (
                <TouchableOpacity
                  style={styles.disconnectBtn}
                  onPress={handleDisconnect}
                >
                  <Text style={styles.disconnectText}>Disconnect</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.connectIgBtn}
              onPress={handleConnect}
            >
              <Text style={styles.connectIgText}>
                {igConnected ? '🔄 Reconnect Account' : '➕ Connect Instagram'}
              </Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.syncRow}>
              <Text style={styles.syncLabel}>Last Sync</Text>
              <Text style={styles.syncValue}>
                {igConnected ? '5 minutes ago' : 'Never'}
              </Text>
            </View>
          </View>
        </View>

        {/* Automation Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automation</Text>
          <View style={styles.card}>
            <SettingRow
              emoji="🤖"
              label="Auto-Run"
              sub="Run automation in background"
              value={autoRun}
              onChange={setAutoRun}
            />
            <View style={styles.divider} />
            <SettingRow
              emoji="📋"
              label="Activity Log"
              sub="Track all automation actions"
              value={activityLog}
              onChange={setActivityLog}
            />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <View style={styles.card}>
            <SettingRow
              emoji="🔔"
              label="Notifications"
              sub="Get updates on automation"
              value={notifications}
              onChange={setNotifications}
            />
            <View style={styles.divider} />
            <SettingRow
              emoji="🌙"
              label="Dark Mode"
              sub="Always on for best experience"
              value={darkMode}
              onChange={setDarkMode}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <LinkRow emoji="📄" label="Privacy Policy" />
            <View style={styles.divider} />
            <LinkRow emoji="📋" label="Terms of Service" />
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <Text style={styles.rowEmoji}>⚡</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Version</Text>
              </View>
              <Text style={styles.rowValue}>{VERSION}</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

function SettingRow({ emoji, label, sub, value, onChange }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.rowEmoji}>{emoji}</Text>
      <View style={styles.rowInfo}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.surfaceLight, true: Colors.primary }}
        thumbColor={value ? '#fff' : Colors.textMuted}
      />
    </View>
  );
}

function LinkRow({ emoji, label }) {
  return (
    <TouchableOpacity style={styles.settingRow}>
      <Text style={styles.rowEmoji}>{emoji}</Text>
      <View style={styles.rowInfo}>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
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
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  profileCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  profileInfo: { flex: 1 },
  profileName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  igRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  igLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  igEmoji: { fontSize: 24 },
  igName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  connectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  connectedDotOff: {
    backgroundColor: Colors.textMuted,
  },
  connectedText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  connectedTextOff: {
    color: Colors.textMuted,
  },
  disconnectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  disconnectText: {
    color: Colors.error,
    fontSize: 13,
    fontWeight: '600',
  },
  connectIgBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  connectIgText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  syncLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  syncValue: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  rowEmoji: { fontSize: 20 },
  rowInfo: { flex: 1 },
  rowLabel: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  rowSub: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  rowValue: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  chevron: {
    color: Colors.textMuted,
    fontSize: 22,
  },
  logoutBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '700',
  },
});