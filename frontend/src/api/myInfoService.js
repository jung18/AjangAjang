import useTokenStore from "../store/useTokenStore";

export const fetchMyAddressList = async () => {
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    const response = await fetch("http://localhost:8080/api/address/my", {
      method: "GET",
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching address list", error);
    throw error;
  }
};

export const fetchMyChildrenList = async () => {
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    const response = await fetch("http://localhost:8080/api/user/child", {
      method: "GET",
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching children list", error);
    throw error;
  }
};

export const updateAddressRep = async (id) => {
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    const response = await fetch("http://localhost:8080/api/address/main", {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: id,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching children list", error);
    throw error;
  }
};

export const addAddress = async (address) => {
  console.log(address);
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    const response = await fetch("http://localhost:8080/api/address/name", {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ addressName: address }), 
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching children list", error);
    throw error;
  }
};

export const deleteAddress = async (id) => {
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    await fetch("http://localhost:8080/api/address/my/" + JSON.stringify(id), {
      method: "DELETE",
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Error fetching children list", error);
    throw error;
  }
};

export const setNearType = async (type) => {
  console.log(type);
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    await fetch("http://localhost:8080/api/address/main/range", {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ nearType: type }), 
    });
  } catch (error) {
    console.error("Error fetching children list", error);
    throw error;
  }
}

export const updateChildrenRep = async (id) => {
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    await fetch("http://localhost:8080/api/user/child/" + JSON.stringify(id), {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Error fetching children list", error);
    throw error;
  }
};

export const addChild = async (child) => {
  console.log(child);
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    await fetch("http://localhost:8080/api/user/child", {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(child),
    });
  } catch (error) {
    console.error("Error fetching children list", error);
    throw error;
  }
};

export const deleteChild = async (id) => {
  try {
    const { accessToken } = useTokenStore.getState();

    //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요
    await fetch("http://localhost:8080/api/user/child/" + JSON.stringify(id), {
      method: "DELETE",
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Error fetching children list", error);
    throw error;
  }
};