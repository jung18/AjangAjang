import useTokenStore from "../store/useTokenStore";

export const fetchBoardList = async () => {
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    const response = await fetch("https://i11b210.p.ssafy.io:8443/api/board/all", {
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

export const fetchMyBoardList = async () => { // 내 작성글
  try {
    const { accessToken } = useTokenStore.getState();

    const response = await fetch("https://i11b210.p.ssafy.io:8443/api/user/my/boards", {
      method: "GET",
      headers: {
        "Authorization": `${accessToken}`
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching my board list", error);
    throw error;
  }
};

export const fetchMyLikeList = async () => { // 내 찜 목록
  try {
    const { accessToken } = useTokenStore.getState();

    const response = await fetch("https://i11b210.p.ssafy.io:8443/api/user/my/likes", {
      method: "GET",
      headers: {
        "Authorization": `${accessToken}`
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching my like list", error);
    throw error;
  }
};