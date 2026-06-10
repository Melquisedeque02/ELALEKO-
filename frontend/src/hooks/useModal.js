import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const openModal = (config = {}) => {
    setModalConfig(config);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalConfig({});
  };

  return {
    isOpen,
    ...modalConfig,
    openModal,
    closeModal
  };
};