import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { Brand } from '@/constants/theme';
import { useSession } from '@/hooks/use-auth';
import { useCreateService } from '@/hooks/use-services';

export default function ServiceNewScreen() {
  const router = useRouter();
  const { user } = useSession();
  const { submitting, error, clearError, createService } = useCreateService();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  if (user?.role !== 'freelance') {
    return (
      <Screen>
        <Text style={styles.title}>New service</Text>
        <Text style={styles.blocked}>Only freelancers can publish services.</Text>
        <Button label="Back" variant="ghost" onPress={() => router.back()} />
      </Screen>
    );
  }

  const onSubmit = async () => {
    clearError();
    const trimmedTitle = title.trim();
    const parsedPrice = Number(price);
    const trimmedDescription = description.trim();

    const nextTitleError = trimmedTitle ? null : 'Title is required.';
    const nextPriceError =
      price.trim() && Number.isFinite(parsedPrice) && parsedPrice >= 0
        ? null
        : 'Enter a valid price (0 or more).';
    const nextDescriptionError = trimmedDescription
      ? null
      : 'Description is required.';

    setTitleError(nextTitleError);
    setPriceError(nextPriceError);
    setDescriptionError(nextDescriptionError);
    if (nextTitleError || nextPriceError || nextDescriptionError) {
      return;
    }

    const ok = await createService({
      freelanceId: user.id,
      title: trimmedTitle,
      price: parsedPrice,
      description: trimmedDescription,
    });
    if (ok) {
      router.back();
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>New service</Text>
      <Text style={styles.subtitle}>Publish a listing to the marketplace</Text>

      <TextField
        label="Title"
        placeholder="Logo design"
        value={title}
        onChangeText={(value) => {
          setTitle(value);
          if (titleError) setTitleError(null);
        }}
        error={titleError}
      />

      <TextField
        label="Price (USD)"
        placeholder="150"
        keyboardType="numeric"
        value={price}
        onChangeText={(value) => {
          setPrice(value);
          if (priceError) setPriceError(null);
        }}
        error={priceError}
      />

      <TextField
        label="Description"
        placeholder="What's included in this service?"
        multiline
        value={description}
        onChangeText={(value) => {
          setDescription(value);
          if (descriptionError) setDescriptionError(null);
        }}
        error={descriptionError}
        style={styles.multiline}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button label="Publish" loading={submitting} onPress={onSubmit} />
      <Button label="Cancel" variant="ghost" onPress={() => router.back()} />
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
  multiline: {
    height: 112,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  blocked: {
    fontSize: 15,
    color: Brand.textMuted,
  },
  error: {
    fontSize: 14,
    color: Brand.error,
  },
});
