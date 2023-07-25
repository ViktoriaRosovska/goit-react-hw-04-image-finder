import { ImageGallery } from './ImageGallery/ImageGallery';
import { Searchbar } from './Searchbar/Searchbar';
import * as APIservices from '../APIservices/APIservices';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { useEffect, useState } from 'react';

export function App() {
  const [, setHasError] = useState(null); // const [hasError, setHasError] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [IsShowModal, setIsShowModal] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const [IsShowLoadMore, setIsShowLoadMore] = useState(false);
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!query) {
      return;
    }

    const getImage = async () => {
      try {
        const { totalHits, hits } = await APIservices.fetchImage(query, page);
        if (totalHits === 0) {
          return toast.error(`There are no images with query "${query}"`);
        }
        const totalPages = Math.ceil(totalHits / 12);
        if (page === 1) {
          toast.success(
            `${totalHits} images  and ${totalPages} pages were found for the query: "${query}"`
          );
        }
        setIsShowLoadMore(page < totalPages);
        setImages(images => [...images, ...hits]);
      } catch (error) {
        setHasError(error.message);
        return toast.error(
          `There is some error in the application: "${error.message}"`
        );
      } finally {
        setIsLoading(false);
      }
    };

    getImage();
  }, [query, page]);

  const onLoadMore = () => {
    setPage(page => page + 1);
  };

  const setHandleQuery = value => {
    setIsShowLoadMore(false);
    setPage(1);
    setQuery(value);
    setImages([]);
    setIsLoading(true);
    setHasError(false);
  };

  const onHandleImage = image => {
    setIsShowModal(IsShowModal => !IsShowModal);
    setShowImage(image);
  };

  const onCloseModal = () => {
    setIsShowModal(false);
  };

  const hasImages = images.length > 0;

  return (
    <div>
      <Searchbar onSubmit={setHandleQuery} />
      {IsLoading && <Loader />}
      {hasImages && (
        <ImageGallery images={images} onHandleImage={onHandleImage} />
      )}
      <ToastContainer
        icon={false}
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        theme="colored"
      />
      {IsShowLoadMore && <Button onLoadMore={onLoadMore} />}
      {IsShowModal && <Modal image={showImage} onCloseModal={onCloseModal} />}
    </div>
  );
}
