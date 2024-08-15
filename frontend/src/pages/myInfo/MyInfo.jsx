import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./MyInfo.css";
import AddIcon from "../../assets/icons/add.png";
import DeleteIcon from "../../assets/icons/close.png";

import usePageStore from "../../store/currentPageStore";

import Modal from "../../components/Modal";

import {
  fetchMyAddressList,
  fetchMyChildrenList,
  updateAddressRep,
  addAddress,
  deleteAddress,
  setNearType,
  updateChildrenRep,
  addChild,
  deleteChild,
} from "../../api/myInfoService";

function MyInfo() {
  const navigate = useNavigate();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);

  const [myAddressList, setMyAddressList] = useState([]);
  const [myChildrenList, setMyChildrenList] = useState([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingChild, setIsEditingChild] = useState(false); // 아이 목록 편집 상태
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null); // 선택된 아이 상태
  const [newAddress, setNewAddress] = useState(""); // 새로운 주소 상태 추가
  const [editingRangeIndex, setEditingRangeIndex] = useState(null); // 범위 설정 모드 인덱스
  const [selectedNearType, setSelectedNearType] = useState(""); // 선택된 nearType 상태 추가

  // 모달 상태 및 form data 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "FEMALE", // 기본값 FEMALE
    birthDate: "", // 생년월일 (yyyy-mm-dd 형식으로 입력받음)
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // birthDate를 year, month, day로 분리
      const [year, month, day] = formData.birthDate.split("-").map(Number);

      // ChildInputDto 형식의 데이터로 변환
      const childData = {
        name: formData.name,
        year: year,
        month: month,
        day: day,
        gender: formData.gender,
      };

      // API 호출 부분 (주석처리 해제하여 사용)
      await addChild(childData);
      
      // 아이 목록 다시 불러오기
      const updatedChildrenListResponse = await fetchMyChildrenList();
      setMyChildrenList(updatedChildrenListResponse.data); // 상태를 업데이트하여 재렌더링

      closeModal(); // 모달 창을 닫습니다.
    } catch (error) {
      console.error("Failed to add child:", error);
    }
  };

  useEffect(() => {
    const loadAddressList = async () => {
      try {
        const response = await fetchMyAddressList();
        setMyAddressList(response.data);

        const defaultAddressIndex = response.data.findIndex(
          (address) => address.rep
        );
        if (defaultAddressIndex !== -1) {
          setSelectedAddress(defaultAddressIndex);
        }
      } catch (error) {
        console.error("Failed to fetch address list:", error);
      }

      window.setNewAddress = setNewAddress;
    };

    const loadChildrenList = async () => {
      try {
        const response = await fetchMyChildrenList();
        setMyChildrenList(response.data);

        const defaultChildIndex = response.data.findIndex((child) => child.rep);
        if (defaultChildIndex !== -1) {
          setSelectedChild(defaultChildIndex);
        }
      } catch (error) {
        console.error("Failed to fetch children list:", error);
      }
    };

    loadAddressList();
    loadChildrenList();

    // 전역 함수 설정
    window.setAddressName = setNewAddress;
  }, []);

  const editBtnClickHandler = () => {
    setCurrentPage("/user/myinfo");
    navigate("/user/myinfo/edit");
  };

  const toggleEditMode = () => {
    setIsEditingAddress((prevState) => !prevState);
  };

  const toggleChildEditMode = () => {
    setIsEditingChild((prevState) => !prevState);
  };

  const handleAddressSelect = (index) => {
    setSelectedAddress(index);
  };

  const handleChildSelect = (index) => {
    setSelectedChild(index);
  };

  const handleSaveChanges = async () => {
    try {
      const selectedAddressId = myAddressList[selectedAddress].addressId;
      await updateAddressRep(selectedAddressId); // 대표 주소 업데이트

      // 대표 주소가 업데이트된 후에 주소 목록을 다시 불러옵니다.
      const updatedAddressListResponse = await fetchMyAddressList();
      setMyAddressList(updatedAddressListResponse.data); // 상태를 업데이트하여 재렌더링

      // 주소 목록이 업데이트된 후, 대표 주소를 다시 설정합니다.
      const defaultAddressIndex = updatedAddressListResponse.data.findIndex(
        (address) => address.rep
      );
      if (defaultAddressIndex !== -1) {
        setSelectedAddress(defaultAddressIndex);
      }

      setIsEditingAddress(false);
      console.log("Updated address list:", updatedAddressListResponse.data);
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  const handleChildSaveChanges = async () => {
    try {
      const selectedChildId = myChildrenList[selectedChild].id;
      await updateChildrenRep(selectedChildId);

      // 아이 대표 설정이 완료된 후 다시 불러오기
      const updatedChildrenListResponse = await fetchMyChildrenList();
      setMyChildrenList(updatedChildrenListResponse.data);

      const defaultChildIndex = updatedChildrenListResponse.data.findIndex(
        (child) => child.rep
      );
      if (defaultChildIndex !== -1) {
        setSelectedChild(defaultChildIndex);
      }

      setIsEditingChild(false);
      console.log("Updated children list:", updatedChildrenListResponse.data);
    } catch (error) {
      console.error("Failed to save child changes:", error);
    }
  };

  const addAddressBtnClickHandler = async () => {
    try {
      const address = await window.findAddr2();
      await addAddress(address); // 주소 추가 요청을 보냅니다.

      // 주소가 추가된 후에 주소 목록을 다시 불러옵니다.
      const updatedAddressListResponse = await fetchMyAddressList();
      setMyAddressList(updatedAddressListResponse.data); // 상태를 업데이트하여 재렌더링

      // 주소 목록이 업데이트된 후, 대표 주소를 다시 설정합니다.
      const defaultAddressIndex = updatedAddressListResponse.data.findIndex(
        (address) => address.rep
      );
      if (defaultAddressIndex !== -1) {
        setSelectedAddress(defaultAddressIndex);
      }
    } catch (error) {
      console.error("Failed to get address:", error);
    }
  };

  const addChildBtnClikcHandler = () => {
    openModal();
  };

  const deleteAddressBtnClickHandler = async (address) => {
    try {
      if (address.rep) {
        alert(
          "대표 주소는 삭제할 수 없습니다. 먼저 다른 주소를 대표로 설정해주세요."
        );
        return; // 삭제 중단
      }

      await deleteAddress(address.addressId); // 주소 삭제 요청을 보냅니다.

      // 주소가 삭제된 후에 주소 목록을 다시 불러옵니다.
      const updatedAddressListResponse = await fetchMyAddressList();
      setMyAddressList(updatedAddressListResponse.data); // 상태를 업데이트하여 재렌더링

      // 주소 목록이 업데이트된 후, 대표 주소를 다시 설정합니다.
      const defaultAddressIndex = updatedAddressListResponse.data.findIndex(
        (address) => address.rep
      );
      if (defaultAddressIndex !== -1) {
        setSelectedAddress(defaultAddressIndex);
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const deleteChildBtnClickHandler = async (child) => {
    try {
      if (child.rep) {
        alert(
          "대표 아이는 삭제할 수 없습니다. 먼저 다른 아이를 대표로 설정해주세요."
        );
        return; // 삭제 중단
      }

      await deleteChild(child.id);

      // 아이가 삭제된 후에 아이 목록을 다시 불러옵니다.
      const updatedChildrenListResponse = await fetchMyChildrenList();
      setMyChildrenList(updatedChildrenListResponse.data); // 상태를 업데이트하여 재렌더링

      const defaultChildIndex = updatedChildrenListResponse.data.findIndex(
        (child) => child.rep
      );
      if (defaultChildIndex !== -1) {
        setSelectedChild(defaultChildIndex);
      }
    } catch (error) {
      console.error("Failed to delete child:", error);
    }
  };

  const setTypeClickHandler = (index) => {
    setEditingRangeIndex(index); // 해당 주소 인덱스를 설정하여 select box를 표시
    setSelectedNearType(myAddressList[index].nearType); // 현재 nearType 설정
  };

  const handleRangeChange = (event) => {
    setSelectedNearType(event.target.value); // 선택된 nearType 업데이트
  };

  const handleRangeSave = async () => {
    try {
      await setNearType(selectedNearType); // 서버에 범위 설정 저장
      const updatedAddressListResponse = await fetchMyAddressList();
      setMyAddressList(updatedAddressListResponse.data); // 상태를 업데이트하여 재렌더링
    } catch (error) {
      console.error("Failed to set nearType:", error);
    }
    setEditingRangeIndex(null); // 범위 설정 모드 종료
  };

  return (
    <div>
      {/* 모달 UI */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="child-modal-title">아이 정보 입력</div>
          <form className="child-modal-form">
            <label>
              이름 
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>
            <label>
              성별<br/>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="FEMALE">FEMALE</option>
                <option value="MALE">MALE</option>
              </select>
            </label>
            <label>
              생년월일<br/>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </label>
            <div className="modal-buttons">
              <button type="button" onClick={handleSubmit}>
                확인
              </button>
              <button type="button" onClick={closeModal}>
                취소
              </button>
            </div>
          </form>
        </Modal>
      )}
      <div className="board-title">내 정보</div>
      <div className="myPage">
        <div className="page-top">
          <div className="profile">
            <img src="https://via.placeholder.com/100" alt="Profile" />
            <div className="profile-info">
              <div className="profile-info-top">
                <div className="profile-nickname">닉네임</div>
                <div className="profile-level">레벨 0</div>
              </div>
            </div>
          </div>
        </div>

        {/* 주소 목록 */}
        <div className="address">
          <div className="address-header">
            <div className="address-title">주소 목록</div>
            <div className="address-btns">
              {!isEditingAddress ? (
                <>
                  <div className="change-rep" onClick={toggleEditMode}>
                    대표변경
                  </div>
                  <img
                    onClick={addAddressBtnClickHandler}
                    src={AddIcon}
                    alt="icon"
                    className="add-address"
                  />
                </>
              ) : (
                <div className="save-changes" onClick={handleSaveChanges}>
                  변경완료
                </div>
              )}
            </div>
          </div>
          <div className="address-list">
            <div className="address-list-wrap">
              {myAddressList.map((address, index) => (
                <div key={index} className="address-item">
                  {isEditingAddress && (
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === index}
                      onChange={() => handleAddressSelect(index)}
                    />
                  )}
                  <div
                    className={`address-content ${address.rep ? "rep" : ""}`}
                  >
                    {address.fullAddress}
                  </div>
                  <div className="address-item-btns">
                    {editingRangeIndex === index ? (
                      <>
                        <select
                          value={selectedNearType}
                          onChange={handleRangeChange}
                        >
                          <option value="CLOSE">CLOSE</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="FAR">FAR</option>
                        </select>
                        <button onClick={handleRangeSave}>완료</button>
                      </>
                    ) : (
                      <>
                        <div
                          className="address-type-set"
                          onClick={() => setTypeClickHandler(index)}
                        >
                          범위설정
                        </div>
                        <img
                          alt="icon"
                          src={DeleteIcon}
                          onClick={() => deleteAddressBtnClickHandler(address)}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 아이 목록 */}
        <div className="children">
          <div className="children-header">
            <div className="children-title">아이 목록</div>
            <div className="children-btns">
              {!isEditingChild ? (
                <>
                  <div className="change-rep" onClick={toggleChildEditMode}>
                    대표변경
                  </div>
                  <img
                    src={AddIcon}
                    alt="icon"
                    onClick={addChildBtnClikcHandler}
                    className="add-children"
                  />
                </>
              ) : (
                <div className="save-changes" onClick={handleChildSaveChanges}>
                  변경완료
                </div>
              )}
            </div>
          </div>
          <div className="children-list">
            {myChildrenList.map((child, index) => (
              <div
                key={index}
                className={`children-item ${child.rep ? "rep" : ""}`}
              >
                {isEditingChild && (
                  <input
                    type="radio"
                    name="child"
                    checked={selectedChild === index}
                    onChange={() => handleChildSelect(index)}
                  />
                )}
                <div className="children-content">
                  {child.name} / {child.gender} / {child.birthDate}
                </div>
                <div className="children-item-btns">
                  <img
                    alt="icon"
                    src={DeleteIcon}
                    onClick={() => deleteChildBtnClickHandler(child)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyInfo;
