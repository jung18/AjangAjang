import useTokenStore from "../store/useTokenStore";

export const fetchSearchResults = async (searchTerm, searchCategory, isRetry) => {

  const getCategoryString = (category) => {
    switch (category) {
      case '전체':
        return '';
      case '유모차':
        return 'BABY_CARRIAGE';
      case '장난감':
        return 'TOY';
      case '아기옷':
        return 'BABY_CLOTHES';
      case '카시트':
        return "CAR_SEAT";
      case '생활용품':
        return "DAILY_SUPPLIES";
      case '가구':
        return "FURNITURE";
      default:
        return '';
    }
  };
  
  try {
    console.log(searchTerm + " " + searchCategory + " " + isRetry);
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
        category: getCategoryString(searchCategory),
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
