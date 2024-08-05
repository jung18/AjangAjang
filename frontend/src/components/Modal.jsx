import React from "react";

import "./Modal.css";

function Modal({ children, onClose }) {
  return (
    <div className="modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
