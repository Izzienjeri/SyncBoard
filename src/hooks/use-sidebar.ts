import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (isOpen: boolean) => void;
}

// Set initial state based on window width for better UX on larger screens
const getInitialState = () => {
    if (typeof window !== 'undefined') {
        return window.innerWidth > 1024; // lg breakpoint
    }
    return true;
};

export const useSidebar = create<SidebarState>((set) => ({
  isOpen: getInitialState(),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (isOpen) => set({ isOpen }),
}));