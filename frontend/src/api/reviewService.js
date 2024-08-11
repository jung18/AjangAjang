import useTokenStore from "../store/useTokenStore";

export const fetchReviewList = async () => {
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
<<<<<<< HEAD
    const response = await fetch("http://localhost:8080/api/board/all", {
=======
    const response = await fetch("https://i11b210.p.ssafy.io:4443/api/board/all", {
>>>>>>> 06f17c12286bbb37cccc4dc90b8325c587ce8e10
      method: "POST",
      headers: {
        "Authorization": `${accessToken}`,
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body : JSON.stringify({
        "page":0,
        "size":10
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching board list", error);
    throw error;
  }
};