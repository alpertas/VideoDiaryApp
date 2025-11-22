import { create } from 'zustand';

type SortOrder = 'asc' | 'desc';

interface FilterState {
  searchQuery: string;
  sortOrder: SortOrder;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  sortOrder: 'desc',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortOrder: (order) => set({ sortOrder: order }),
  toggleSortOrder: () => set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' })),
  resetFilters: () => set({ searchQuery: '', sortOrder: 'desc' }),
}));
