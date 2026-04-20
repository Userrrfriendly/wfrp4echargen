import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light';

interface UiState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themeMode: 'dark',
      setThemeMode: (themeMode) => set({ themeMode }),
    }),
    {
      name: 'wfrp4e-ui-settings', //The name is the localStorage key under which the store's state gets saved.
      version: 1, //if you change the shape of your stored state in the future, you can bump a version and provide a migration:
      partialize: (state) => ({ themeMode: state.themeMode }), //don't have to save everything. Use partialize to pick only what you need:
      //In case a future version of the app changes the structure of the persisted state, we can use the migrate function to transform old data to the new format.
      // For now, we just return the persisted state as is.
      // migrate: (persistedState, version) => {
      //   if (version === 2) {
      //     // e.g. rename an old key
      //   }
      //   return persistedState;
      // },
    },
  ),
);
