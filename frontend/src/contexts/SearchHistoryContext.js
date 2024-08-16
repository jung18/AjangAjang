import React, { createContext, useState, useEffect } from "react";

export const SearchHistoryContext = createContext();

export const SearchHistoryProvider = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 검색 기록을 불러옴
    const savedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    const savedAutoSave = JSON.parse(localStorage.getItem("autoSave"));
    setRecentSearches(savedSearches);
    if (savedAutoSave !== null) {
      setAutoSave(savedAutoSave);
    }
  }, []);

  useEffect(() => {
    // 검색 기록 또는 자동 저장 상태가 변경될 때 로컬 스토리지에 저장
    if (autoSave) {
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
    localStorage.setItem("autoSave", JSON.stringify(autoSave));
  }, [recentSearches, autoSave]);

  const addSearchTerm = (term) => {
    if (autoSave && term && !recentSearches.includes(term)) {
      setRecentSearches([...recentSearches, term]);
    }
  };

  const clearSearchHistory = () => {
    setRecentSearches([]);
  };

  const toggleAutoSave = () => {
    setAutoSave(!autoSave);
  };

  const removeSearchTerm = (index) => {
    const newSearches = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(newSearches);
  };

  return (
    <SearchHistoryContext.Provider
      value={{
        recentSearches,
        autoSave,
        addSearchTerm,
        clearSearchHistory,
        toggleAutoSave,
        removeSearchTerm,
      }}
    >
      {children}
    </SearchHistoryContext.Provider>
  );
};
