import React from "react";
import PropTypes from "prop-types";
import "./IconButton.css";

const IconButton = ({
  activeIcon = '',
  inactiveIcon = '',
  label,
  showText = false,
  isActive = false,
  click = () => {},
}) => (
  <button className="icon-button" onClick = {click}>
    <img
      src={isActive ? activeIcon : inactiveIcon}
      alt={label}
      className="icon-image"
    />
    {showText && <span className={`icon-text ${isActive ? "active" : ""}`}>{label}</span>}
  </button>
);

IconButton.propTypes = {
  activeIcon: PropTypes.string.isRequired,
  inactiveIcon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  showText: PropTypes.bool.isRequired,
  click: PropTypes.func
};

export default IconButton;
