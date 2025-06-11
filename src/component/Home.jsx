import { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { Button, Modal, Form } from "react-bootstrap";

function Home({ isAuthenticated }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("nature");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");

  const API_KEY = "4PyLSwqUOM1IZ3vjlveQwmzID6zvBxPOZMIBF4zxFblcI9MsrDQ29FwX";
  const BASE_URL = "https://api.pexels.com/v1/";
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("pinterest-boards")) || [];
    setBoards(saved);
  }, []);

  const fetchImages = useCallback(
    async (reset = false, pageToFetch = 1) => {
      try {
        if (reset) {
          setLoading(true);
          setImages([]);
          setPage(1);
          setHasMore(true);
        }

        const url = query
          ? `${BASE_URL}search?query=${query}&page=${pageToFetch}&per_page=15`
          : `${BASE_URL}curated?page=${pageToFetch}&per_page=15`;

        const res = await fetch(url, {
          headers: { Authorization: API_KEY },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const newImgs = data.photos.map((photo) => ({
          ...photo,
          src: { ...photo.src, original: photo.src.original || photo.src.large },
        }));

        setImages((prev) => (reset ? newImgs : [...prev, ...newImgs]));
        setHasMore(data.photos.length > 0);
        if (!reset) setPage((prev) => prev + 1);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    fetchImages(true, 1);
  }, [fetchImages]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    fetchImages(true, 1);
  };

  const handleSaveImage = (image) => {
    // bypass login — modale sempre visibile
    setSelectedImage(image);
    setShowSaveModal(true);
  };

  const createNewBoard = () => {
    if (!newBoardName.trim()) return;
    const newB = {
      id: Date.now(),
      title: newBoardName.trim(),
      coverImage: selectedImage.src.medium,
      images: [selectedImage],
      pinCount: 1,
    };
    const updated = [...boards, newB];
    setBoards(updated);
    localStorage.setItem("pinterest-boards", JSON.stringify(updated));
    setSelectedBoard(newB.id);
    setNewBoardName("");
  };

  const addImageToBoard = () => {
    if (!selectedBoard) return;
    const updated = boards.map((b) => {
      if (b.id === Number(selectedBoard)) {
        if (b.images.some((img) => img.id === selectedImage.id)) return b;
        return {
          ...b,
          images: [...b.images, selectedImage],
          pinCount: b.images.length + 1,
          coverImage: b.coverImage || selectedImage.src.medium,
        };
      }
      return b;
    });
    setBoards(updated);
    localStorage.setItem("pinterest-boards", JSON.stringify(updated));
    setShowSaveModal(false);
  };

  const saveImage = () => {
    if (selectedBoard) addImageToBoard();
    else if (newBoardName.trim()) createNewBoard();
    setShowSaveModal(false);
  };

  if (loading && images.length === 0) {
    return <div className="spinner-border text-primary mt-5" role="status"></div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-3" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="app-container">
      <SearchBar onSearch={handleSearch} />

      <div className="scroll-container">
        <InfiniteScroll
          dataLength={images.length}
          next={() => fetchImages(false, page + 1)}
          hasMore={hasMore}
          loader={
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          }
          endMessage={
            <p className="text-center py-4 text-muted">
              {images.length > 0 ? "You've seen all images!" : "No results found"}
            </p>
          }
        >
          <div className="image-grid">
            {images.map((img) => (
              <div key={img.id} className="card">
                <div className="card-img-container" onClick={() => navigate(`/photo/${img.id}`)}>
                  <img
                    src={img.src.medium}
                    alt={img.alt || `Photo by ${img.photographer}`}
                    loading="lazy"
                    className="card-img-top img-fluid"
                  />
                </div>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <p className="card-text mb-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="me-1">
                      <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1z"></path>
                    </svg>
                    {img.photographer}
                  </p>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveImage(img);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Save to board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select a board</Form.Label>
              <Form.Select value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)}>
                <option value="">Choose a board...</option>
                {boards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.pinCount})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="text-center my-2">OR</div>

            <Form.Group className="mb-3">
              <Form.Label>Create new board</Form.Label>
              <Form.Control
                type="text"
                placeholder="Board name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveImage}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
