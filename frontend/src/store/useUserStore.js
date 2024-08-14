import create from 'zustand';

const useUserStore = create((set) => ({
  user: null, // 초기 사용자 상태는 null로 설정

  // 사용자 정보를 업데이트하는 함수
  setUser: (userData) => set({ user: userData }),

  // 사용자 상태를 초기화하는 함수
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
