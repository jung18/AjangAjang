import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTokenStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: 'token-storage', // 저장할 이름
      storage: sessionStorage, // 사용할 스토리지 (sessionStorage)
    }
  )
);

export default useTokenStore;
