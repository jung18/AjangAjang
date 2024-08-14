import useTokenStore from "../store/useTokenStore";

export const fetchSearchResults = async (searchTerm, searchCategory, isRetry) => {
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    const response = await fetch("https://i11b210.p.ssafy.io:4443/api/board/search", {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        page: 0,
        size: 10,
        title: searchTerm,
        category: searchCategory,
        retry: isRetry,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching board list", error);
    throw error;
  }
};
