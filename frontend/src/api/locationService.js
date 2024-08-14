import useTokenStore from "../store/useTokenStore";
import apiClient from "./apiClient";

export const fetchRoomData = async (id) => { // 추천 위치
    try {
      const response = await apiClient.get("/api/rooms/myRooms/" + id);
      const data = await response.json();
      console.log("locationService: ", data)
      return data;
    } catch (error) {
      console.error("Error fetching recommend locations", error);
      throw error;
    }
  };

  export const fetchUserData = async (id) => { // 추천 위치
    try {
      const response = await apiClient.get("/api/user/" + id);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching recommend locations", error);
      throw error;
    }
};