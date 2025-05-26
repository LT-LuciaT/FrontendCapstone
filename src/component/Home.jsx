import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("nature");

  const API_KEY = "4PyLSwqUOM1IZ3vjlveQwmzID6zvBxPOZMIBF4zxFblcI9MsrDQ29FwX";
  const BASE_URL = "https://api.pexels.com/v1/";

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        let url;

        if (query.trim() === "") {
          url = `${BASE_URL}curated?per_page=15`;
        } else {
          url = `${BASE_URL}search?query=${query}&per_page=15`;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error("Errore nel fetch delle immagini");
        }

        const data = await response.json();
        setImages(data.photos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [query]);

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-3" role="alert">
        Errore: {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <SearchBar onSearch={handleSearch} />

      {/* griglia di immagini */}
      <div className="row">
        {images.map((image) => (
          <div key={image.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={image.src.medium}
                className="card-img-top"
                alt={image.photographer}
                style={{ height: "250px", objectFit: "cover" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
