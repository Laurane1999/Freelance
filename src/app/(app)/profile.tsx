import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { Brand } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { parseSkills, skillsToText } from '@/utils/skills';
import { validateName } from '@/utils/validation';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { user, submitting, error, clearError, updateProfile } = useProfile();

  const [name, setName] = useState(user?.name ?? '');
  const [photo, setPhoto] = useState(user?.photo ?? '');
  const [skills, setSkills] = useState(skillsToText(user?.skills ?? []));
  const [nameError, setNameError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const onSave = async () => {
    clearError();
    setSaved(false);
    const nameValidation = validateName(name);
    setNameError(nameValidation);
    if (nameValidation) {
      return;
    }

    const ok = await updateProfile({
      name: name.trim(),
      photo: photo.trim() ? photo.trim() : null,
      skills: parseSkills(skills),
    });
    if (ok) {
      setSaved(true);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Edit profile</Text>
      <Text style={styles.subtitle}>Update how others see you</Text>

      <TextField
        label="Full name"
        placeholder="Jane Doe"
        value={name}
        onChangeText={(value) => {
          setName(value);
          if (nameError) setNameError(null);
          if (saved) setSaved(false);
        }}
        error={nameError}
      />

      <TextField
        label="Photo URL"
        placeholder="https://…"
        autoCapitalize="none"
        keyboardType="url"
        value={photo}
        onChangeText={(value) => {
          setPhoto(value);
          if (saved) setSaved(false);
        }}
      />

      <TextField
        label="Skills (comma separated)"
        placeholder="React Native, Firebase, UI Design"
        autoCapitalize="none"
        value={skills}
        onChangeText={(value) => {
          setSkills(value);
          if (saved) setSaved(false);
        }}
      />

      <View style={styles.readonly}>
        <Text style={styles.readonlyLabel}>Role</Text>
        <Text style={styles.readonlyValue}>{user?.role ?? '—'}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {saved ? <Text style={styles.success}>Profile updated.</Text> : null}

      <Button label="Save changes" loading={submitting} onPress={onSave} />
      <Button label="Log out" variant="accent" onPress={onLogout} style={styles.logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Brand.primary,
  },
  subtitle: {
    fontSize: 15,
    color: Brand.textMuted,
    marginBottom: 8,
  },
  readonly: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Brand.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 16,
  },
  readonlyLabel: {
    fontSize: 15,
    color: Brand.textMuted,
  },
  readonlyValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.text,
    textTransform: 'capitalize',
  },
  error: {
    fontSize: 14,
    color: Brand.error,
  },
  success: {
    fontSize: 14,
    color: Brand.accent,
    fontWeight: '600',
  },
  logout: {
    marginTop: 8,
  },
});
