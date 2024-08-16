// store.js
import { create } from "zustand";

const useStore = create((set) => ({
  likedBoards: {}, // 좋아요 상태를 저장할 객체
  toggleLike: (id) =>
    set((state) => ({
      likedBoards: {
        ...state.likedBoards,
        [id]: !state.likedBoards[id],
      },
    })),
  getLikedBoards: () => {
    const { likedBoards } = useStore.getState();
    return Object.keys(likedBoards).filter((id) => likedBoards[id]);
  },
}));

export default useStore;
