import "./SelectBox.css";
import React, { useEffect, useState } from "react";
import useSelectStore from "../store/useSelectStore";

import ArrowIcon from "../assets/icons/expand-arrow.png";
import NarrowIcon from "../assets/icons/narrow-arrow.png"

function SelectOption({ optionList }) {
  const [showOptions, setShowOptions] = useState(false);
  const selectedOption = useSelectStore((state) => state.selectedOption);
  const setSelectedOption = useSelectStore((state) => state.setSelectedOption);
  const setOptionList = useSelectStore((state) => state.setOptionList);

  useEffect(() => {
    setOptionList(optionList);
    if (optionList.length > 0) {
      setSelectedOption(optionList[0]);
    }
  }, [optionList, setOptionList, setSelectedOption]);

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
  };

  return (
    <div className="select">
      <div className="select-box" onClick={toggleOptions}>
        <div className="location">{selectedOption || "위치 선택"}</div>
        <img alt="arrow" src={showOptions ? NarrowIcon : ArrowIcon} />
      </div>
      {showOptions && (
        <div className="option-box">
          <div className="option-content">
            {optionList.map((option, index) => (
              <div key={index} onClick={() => handleOptionClick(option)}>
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectOption;
