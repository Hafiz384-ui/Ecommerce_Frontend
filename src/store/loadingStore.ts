import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  message: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  setLoading: (isLoading: boolean, message?: string) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  message: "Loading...",
  showLoader: (message = "Loading...") =>
    set({ isLoading: true, message }),
  hideLoader: () =>
    set({ isLoading: false, message: "Loading..." }),
  setLoading: (isLoading, message = "Loading...") =>
    set({ isLoading, message }),
}));

// Convenience helper functions to trigger the global loader outside of React components
export const showGlobalLoader = (message?: string) =>
  useLoadingStore.getState().showLoader(message);

export const hideGlobalLoader = () =>
  useLoadingStore.getState().hideLoader();

export default useLoadingStore;
