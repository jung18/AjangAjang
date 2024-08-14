import useTokenStore from "../store/useTokenStore";
import apiClient from "./apiClient";

export const fetchRoomData = async (id) => { // 추천 위치
    try {
      const response = await apiClient.get("/api/rooms/myRooms/" + id);
      console.log("fetchRoomData: ", response)
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching room data", error);
      throw error;
    }
  };

  export const fetchUserData = async (id) => { // 추천 위치
    try {
      const response = await apiClient.get("/api/user/" + id);
      console.log("fetchUserData: ", response)
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data", error);
      throw error;
    }
};