import { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("nature");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const API_KEY = "4PyLSwqUOM1IZ3vjlveQwmzID6zvBxPOZMIBF4zxFblcI9MsrDQ29FwX";
  const BASE_URL = "https://api.pexels.com/v1/";
  const navigate = useNavigate();

  const fetchImages = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        const currentPage = reset ? 1 : page;
        const url = query
          ? `${BASE_URL}search?query=${query}&page=${currentPage}&per_page=15`
          : `${BASE_URL}curated?page=${currentPage}&per_page=15`;

        const response = await fetch(url, {
          headers: { Authorization: API_KEY },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const newImages = data.photos.map((photo) => ({
          ...photo,
          src: { ...photo.src, original: photo.src.original || photo.src.large },
        }));

        setImages((prev) => (reset ? newImages : [...prev, ...newImages]));
        setPage(currentPage + 1);
        setHasMore(data.photos.length > 0);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [query, page]
  );

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
    setImages([]);
  };

  useEffect(() => {
    fetchImages(true);
  }, [query]);

  if (loading && images.length === 0) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
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

      <div className="scroll-container" id="scrollableDiv">
        <InfiniteScroll
          dataLength={images.length}
          next={fetchImages}
          hasMore={hasMore}
          loader={
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
          endMessage={
            <p className="text-center py-4 text-muted">
              {images.length > 0 ? "You've seen all images!" : "No results found"}
            </p>
          }
          scrollableTarget="scrollableDiv"
        >
          <div className="image-grid">
            {images.map((image) => (
              <div key={image.id} className="card" onClick={() => navigate(`/photo/${image.id}`)}>
                <div className="card-img-container">
                  <img
                    src={image.src.medium}
                    className="card-img-top"
                    alt={image.alt || `Photo by ${image.photographer}`}
                    loading="lazy"
                  />
                </div>
                <div className="card-body">
                  <p className="card-text">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="me-1">
                      <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1z"></path>
                    </svg>
                    {image.photographer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Home;
