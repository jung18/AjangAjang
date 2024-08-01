import create from 'zustand';
import { persist } from 'zustand/middleware';

const useTokenStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
    }),
    {
      name: 'token-storage', // 저장할 이름
      getStorage: () => sessionStorage, // 사용할 스토리지 (sessionStorage)
    }
  )
);

export default useTokenStore;
