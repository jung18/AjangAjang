import useTokenStore from "../store/useTokenStore";

export const fetchBoardList = async (page = 0, size = 10) => {
  try {
    const { accessToken } = useTokenStore.getState();

    const response = await fetch("https://i11b210.p.ssafy.io:4443/api/board/all", {
      method: "POST",
      headers: {
        "Authorization": `${accessToken}`,
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body : JSON.stringify({
        "page": page,
        "size": size
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

    const response = await fetch("https://i11b210.p.ssafy.io:4443/api/user/my/boards", {
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

    const response = await fetch("https://i11b210.p.ssafy.io:4443/api/user/my/likes", {
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

export const deleteMyBoard = async (id) => { // 내 찜 목록
  try {
    const { accessToken } = useTokenStore.getState();

    await fetch("https://i11b210.p.ssafy.io:4443/api/board/" + id, {
      method: "DELETE",
      headers: {
        "Authorization": `${accessToken}`
      },
      credentials: 'include'
    });

  } catch (error) {
    console.error("Error delete", error);
    throw error;
  }
};
