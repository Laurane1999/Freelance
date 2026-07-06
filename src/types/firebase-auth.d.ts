import type { Persistence } from 'firebase/auth';

/**
 * `getReactNativePersistence` exists at runtime (the `firebase/auth` meta entry
 * re-exports the scoped package's React Native build), but its type is dropped
 * because the package's `exports` map lists the top-level `types` entry before
 * the `react-native` condition. This augmentation restores the missing type.
 */
declare module 'firebase/auth' {
  export interface ReactNativeAsyncStorage {
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
  }

  export function getReactNativePersistence(
    storage: ReactNativeAsyncStorage,
  ): Persistence;
}
