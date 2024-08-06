// src/store/pageStore.js
import { create } from "zustand";

const usePageStore = create((set) => ({
  currentPage: "direct",
  setCurrentPage: (page) => set({ currentPage: page }),
}));

export default usePageStore;
