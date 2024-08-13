import useTokenStore from "../store/useTokenStore";

export const fetchBoardDetail = async (id) => {
  try {
    const { accessToken } = useTokenStore.getState();

    const url = "https://i11b210.p.ssafy.io:4443/" + id;
    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `${accessToken}`
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching board detail", error);
    throw error;
  }
};
