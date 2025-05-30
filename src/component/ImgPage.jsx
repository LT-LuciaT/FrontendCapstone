import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const ImgPage = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [similarPhotos, setSimilarPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "4PyLSwqUOM1IZ3vjlveQwmzID6zvBxPOZMIBF4zxFblcI9MsrDQ29FwX";

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        setLoading(true);

        const photoResponse = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
          headers: { Authorization: API_KEY },
        });

        if (!photoResponse.ok) throw new Error("Foto non trovata");
        const photoData = await photoResponse.json();
        setPhoto(photoData);

        const similarResponse = await fetch(`https://api.pexels.com/v1/photos/${id}/related?per_page=8`, {
          headers: { Authorization: API_KEY },
        });

        const similarData = similarResponse.ok ? await similarResponse.json() : { photos: [] };
        setSimilarPhotos(similarData.photos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotoDetails();
  }, [id]);

  const openLightbox = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger my-5">{error}</div>;
  }

  if (!photo) {
    return <div className="alert alert-warning my-5">Foto non trovata</div>;
  }

  const slides = [{ src: photo.src.original }, ...similarPhotos.map((img) => ({ src: img.src.original }))];

  return (
    <div className="container my-5" style={{ height: "100vh", overflowY: "auto" }}>
      <div className="card mb-5 shadow-sm" style={{ maxHeight: "70vh" }}>
        <div className="row g-0 h-100">
          <div className="col-md-8 h-100">
            <img
              src={photo.src.large}
              alt={photo.alt || photo.photographer}
              className="img-fluid rounded-start h-100"
              style={{ cursor: "zoom-in", objectFit: "cover" }}
              onClick={() => openLightbox(0)}
            />
          </div>

          <div className="col-md-4 h-100 d-flex flex-column">
            <div className="card-body overflow-auto">
              <h2 className="card-title">{photo.alt || "Immagine senza titolo"}</h2>
              <p className="card-text text-muted">Fotografo: {photo.photographer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Immagini simili */}
      <h3 className="mb-4">Immagini simili</h3>
      <div style={{ height: "30vh", overflowY: "auto" }}>
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
          {similarPhotos.map((similar, index) => (
            <div key={similar.id} className="col">
              <div
                className="card h-100 shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() => openLightbox(index + 1)}
              >
                <img
                  src={similar.src.medium}
                  alt={similar.alt || similar.photographer}
                  className="card-img-top"
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <div className="card-body p-3">
                  <p className="card-text small text-truncate">{similar.alt || "Nessuna descrizione"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
        plugins={[Thumbnails]}
        carousel={{
          finite: slides.length <= 1,
        }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
      />
    </div>
  );
};

export default ImgPage;
