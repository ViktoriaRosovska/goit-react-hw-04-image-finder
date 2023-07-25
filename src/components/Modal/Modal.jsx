import { useEffect } from 'react';
import css from './Modal.module.css';
import PropTypes from 'prop-types';

export function Modal({ image, onCloseModal }) {
  useEffect(() => {
    const onEsc = e => {
      if (e.code === 'Escape') {
        onCloseModal();
      }
    };

    window.addEventListener('keydown', onEsc);

    return () => window.removeEventListener('keydown', onEsc);
  }, [onCloseModal]);

  const onClose = e => {
    if (e.target === e.currentTarget) {
      onCloseModal();
    }
  };

  const { largeImageURL, tags } = image;

  return (
    <div className={css.Overlay} onClick={onClose}>
      <div className={css.Modal}>
        <img src={largeImageURL} alt={tags} />
      </div>
    </div>
  );
}

Modal.propTypes = {
  image: PropTypes.object.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};
