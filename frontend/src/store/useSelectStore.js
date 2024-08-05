import { create } from "zustand";

const useSelectStore = create((set) => ({
  optionList: [], // 초기 옵션 목록은 빈 배열
  selectedOption: null, // 초기 선택된 옵션은 없음
  setOptionList: (newOptionList) => set({ optionList: newOptionList }),
  setSelectedOption: (option) =>
    set((state) => ({
      selectedOption: option,
      optionList: state.optionList.filter((opt) => opt !== option),
    })),
  resetSelectedOption: () =>
    set((state) => ({
      selectedOption: null,
      optionList: [...state.optionList, state.selectedOption].filter(Boolean),
    })),
}));

export default useSelectStore;
