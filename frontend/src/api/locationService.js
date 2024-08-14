import useTokenStore from "../store/useTokenStore";

export const fetchRoomData = async (id) => { // 추천 위치
    try {
      const { accessToken } = useTokenStore.getState();
  
      const response = await fetch("https://i11b210.p.ssafy.io:4443/api/rooms/myRooms/" + id, {
        method: "GET",
        headers: {
          "Authorization": `${accessToken}`
        },
        credentials: 'include'
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching recommend locations", error);
      throw error;
    }
  };

  export const fetchUserData = async (id) => { // 추천 위치
    try {
      const { accessToken } = useTokenStore.getState();
  
      const response = await fetch("https://i11b210.p.ssafy.io:4443/api/user/" + id, {
        method: "GET",
        headers: {
          "Authorization": `${accessToken}`
        },
        credentials: 'include'
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching recommend locations", error);
      throw error;
    }
};

export const fetchMyData = async () => { // 추천 위치
    try {
      const { accessToken } = useTokenStore.getState();
  
      const response = await fetch("https://i11b210.p.ssafy.io:4443/api/user/my", {
        method: "GET",
        headers: {
          "Authorization": `${accessToken}`
        },
        credentials: 'include'
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching recommend locations", error);
      throw error;
    }
};