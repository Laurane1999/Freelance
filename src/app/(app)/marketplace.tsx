import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Brand } from '@/constants/theme';
import { useSession } from '@/hooks/use-auth';
import { useMissionActions } from '@/hooks/use-missions';
import { useServices } from '@/hooks/use-services';
import type { Service } from '@/types/service';

export default function MarketplaceScreen() {
  const router = useRouter();
  const { user } = useSession();
  const { services, loading, error, reload } = useServices();
  const { submitting, error: hireError, hire } = useMissionActions();

  const isFreelancer = user?.role === 'freelance';
  const isClient = user?.role === 'client';

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const onHire = async (service: Service) => {
    if (!user) return;
    const ok = await hire({
      clientId: user.id,
      freelanceId: service.freelanceId,
      serviceId: service.id,
      serviceTitle: service.title,
    });
    if (ok) {
      router.push('/(app)/missions');
    }
  };

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        {isFreelancer ? (
          <Button
            label="+ New"
            onPress={() => router.push('/(app)/service-new')}
            style={styles.newButton}
          />
        ) : null}
      </View>

      {hireError ? <Text style={styles.error}>{hireError}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color={Brand.primary} style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No services yet. Check back soon.</Text>
          }
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              isOwn={item.freelanceId === user?.id}
              canHire={isClient}
              hiring={submitting}
              onHire={onHire}
            />
          )}
        />
      )}
    </Screen>
  );
}

function ServiceCard({
  service,
  isOwn,
  canHire,
  hiring,
  onHire,
}: {
  service: Service;
  isOwn: boolean;
  canHire: boolean;
  hiring: boolean;
  onHire: (service: Service) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{service.title}</Text>
        <Text style={styles.cardPrice}>${service.price}</Text>
      </View>
      <Text style={styles.cardDescription}>{service.description}</Text>
      {isOwn ? <Text style={styles.ownBadge}>Your listing</Text> : null}
      {canHire && !isOwn ? (
        <Button
          label="Hire"
          disabled={hiring}
          onPress={() => onHire(service)}
          style={styles.hireButton}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Brand.primary,
  },
  newButton: {
    height: 40,
    paddingHorizontal: 16,
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
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.accent,
  },
  cardDescription: {
    fontSize: 14,
    color: Brand.textMuted,
  },
  ownBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.primary,
  },
  hireButton: {
    marginTop: 8,
    height: 44,
  },
  empty: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 15,
    color: Brand.textMuted,
  },
  error: {
    marginTop: 24,
    fontSize: 14,
    color: Brand.error,
  },
});
