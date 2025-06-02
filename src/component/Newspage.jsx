import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const NewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "4PyLSwqUOM1IZ3vjlveQwmzID6zvBxPOZMIBF4zxFblcI9MsrDQ29FwX";

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        setLoading(true);

        const articleResponse = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
          headers: { Authorization: API_KEY },
        });

        if (!articleResponse.ok) throw new Error("Article not found");
        const articleData = await articleResponse.json();

        const enhancedArticle = {
          ...articleData,
          title: articleData.alt || `News by ${articleData.photographer}`,
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          ${articleData.photographer} captured this moment on ${new Date().toLocaleDateString()}. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
          publishedDate: new Date().toLocaleDateString(),
          author: articleData.photographer,
          category: "General",
        };

        setArticle(enhancedArticle);

        const relatedResponse = await fetch(`https://api.pexels.com/v1/photos/${id}/related?per_page=4`, {
          headers: { Authorization: API_KEY },
        });

        const relatedData = relatedResponse.ok ? await relatedResponse.json() : { photos: [] };

        const enhancedRelated = (relatedData.photos || []).map((photo) => ({
          ...photo,
          title: photo.alt || `Related news by ${photo.photographer}`,
          summary: `Brief summary about this related news item captured by ${photo.photographer}`,
          publishedDate: new Date().toLocaleDateString(),
        }));

        setRelatedArticles(enhancedRelated);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
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

  if (!article) {
    return <div className="alert alert-warning my-5">Article not found</div>;
  }

  const slides = [{ src: article.src.original }, ...relatedArticles.map((img) => ({ src: img.src.original }))];

  return (
    <div className="container my-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        &larr; Back to News
      </button>

      <div className="card mb-5 shadow">
        <div className="row g-0">
          <div className="col-lg-8">
            <img
              src={article.src.large2x}
              alt={article.title}
              className="img-fluid rounded-start"
              style={{ cursor: "zoom-in", width: "100%", height: "400px", objectFit: "cover" }}
              onClick={() => openLightbox(0)}
            />
          </div>

          <div className="col-lg-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-primary">{article.category}</span>
                <small className="text-muted">{article.publishedDate}</small>
              </div>

              <h1 className="card-title mb-3">{article.title}</h1>

              <div className="d-flex align-items-center mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="me-2">
                  <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1z"></path>
                </svg>
                <span className="text-muted">By {article.author}</span>
              </div>

              <div className="card-text">
                {article.content.split("\n").map((paragraph, i) => (
                  <p key={`para-${i}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mb-4">Related News</h3>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
        {relatedArticles.map((related) => (
          <div key={related.id} className="col">
            <div
              className="card h-100 shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/news/${related.id}`)}
            >
              <img
                src={related.src.medium}
                alt={related.title}
                className="card-img-top"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title" style={{ fontSize: "1rem" }}>
                  {related.title}
                </h5>
                <p className="card-text small text-muted">{related.summary}</p>
              </div>
              <div className="card-footer bg-white border-0">
                <small className="text-muted">{related.publishedDate}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default NewsPage;
