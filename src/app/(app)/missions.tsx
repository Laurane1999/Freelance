import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Brand } from '@/constants/theme';
import { useSession } from '@/hooks/use-auth';
import { useMissionActions, useMissions } from '@/hooks/use-missions';
import type { Mission, MissionStatus } from '@/types/mission';

const STATUS_COLORS: Record<MissionStatus, string> = {
  pending: Brand.textMuted,
  accepted: Brand.primary,
  completed: Brand.accent,
  cancelled: Brand.error,
};

export default function MissionsScreen() {
  const { user } = useSession();
  const { missions, loading, error, reload } = useMissions(user?.id);
  const { submitting, error: actionError, setStatus } = useMissionActions();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const onSetStatus = async (id: string, status: MissionStatus) => {
    const ok = await setStatus(id, status);
    if (ok) {
      await reload();
    }
  };

  return (
    <Screen scroll={false}>
      <Text style={styles.title}>Missions</Text>
      {actionError ? <Text style={styles.error}>{actionError}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color={Brand.primary} style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={missions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No missions yet. Hire a freelancer from the marketplace.
            </Text>
          }
          renderItem={({ item }) => (
            <MissionCard
              mission={item}
              currentUserId={user?.id ?? ''}
              disabled={submitting}
              onSetStatus={onSetStatus}
            />
          )}
        />
      )}
    </Screen>
  );
}

function MissionCard({
  mission,
  currentUserId,
  disabled,
  onSetStatus,
}: {
  mission: Mission;
  currentUserId: string;
  disabled: boolean;
  onSetStatus: (id: string, status: MissionStatus) => void;
}) {
  const isFreelancer = mission.freelanceId === currentUserId;
  const isClient = mission.clientId === currentUserId;
  const isOpen = mission.status === 'pending' || mission.status === 'accepted';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{mission.serviceTitle ?? 'Mission'}</Text>
        <Text style={[styles.badge, { color: STATUS_COLORS[mission.status] }]}>
          {mission.status}
        </Text>
      </View>
      <Text style={styles.role}>{isFreelancer ? 'You are the freelancer' : 'You are the client'}</Text>

      <View style={styles.actions}>
        {isFreelancer && mission.status === 'pending' ? (
          <>
            <Button
              label="Accept"
              disabled={disabled}
              onPress={() => onSetStatus(mission.id, 'accepted')}
              style={styles.action}
            />
            <Button
              label="Decline"
              variant="ghost"
              disabled={disabled}
              onPress={() => onSetStatus(mission.id, 'cancelled')}
              style={styles.action}
            />
          </>
        ) : null}

        {isFreelancer && mission.status === 'accepted' ? (
          <Button
            label="Mark complete"
            disabled={disabled}
            onPress={() => onSetStatus(mission.id, 'completed')}
            style={styles.action}
          />
        ) : null}

        {isClient && isOpen ? (
          <Button
            label="Cancel mission"
            variant="ghost"
            disabled={disabled}
            onPress={() => onSetStatus(mission.id, 'cancelled')}
            style={styles.action}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Brand.primary,
  },
  loader: {
    marginTop: 48,
  },
  list: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  card: {
    backgroundColor: Brand.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '700',
    color: Brand.text,
  },
  badge: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  role: {
    fontSize: 13,
    color: Brand.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  action: {
    flex: 1,
    height: 44,
  },
  empty: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 15,
    color: Brand.textMuted,
  },
  error: {
    fontSize: 14,
    color: Brand.error,
  },
});
