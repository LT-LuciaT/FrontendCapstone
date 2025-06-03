import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import YetAnotherLightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem("pinterest-boards")) || [];
    const foundBoard = savedBoards.find((b) => b.id === Number(id));
    setBoard(foundBoard);
  }, [id]);

  const deleteImage = (imageId) => {
    const updatedBoards = JSON.parse(localStorage.getItem("pinterest-boards"))
      .map((b) => {
        if (b.id === Number(id)) {
          const updatedImages = b.images.filter((img) => img.id !== imageId);
          return {
            ...b,
            images: updatedImages,
            pinCount: updatedImages.length,
            coverImage: updatedImages[0]?.src.medium || "",
          };
        }
        return b;
      })
      .filter((b) => b.pinCount > 0);

    localStorage.setItem("pinterest-boards", JSON.stringify(updatedBoards));
    const updatedBoard = updatedBoards.find((b) => b.id === Number(id));
    setBoard(updatedBoard);

    if (!updatedBoard) {
      navigate("/mymoods");
    }
  };

  if (!board) {
    return (
      <Container className="text-center py-5">
        <h4>Board not found</h4>
        <Link to="/mymoods" className="btn btn-primary mt-3">
          Back to Boards
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>{board.title}</h1>
          <p className="text-muted">
            {board.pinCount} {board.pinCount === 1 ? "pin" : "pins"}
          </p>
        </div>
        <Link to="/mymoods" className="btn btn-outline-secondary">
          Back to Boards
        </Link>
      </div>

      {board.images.length === 0 ? (
        <div className="text-center py-5">
          <h4>No pins in this board</h4>
          <Link to="/" className="btn btn-primary">
            Explore Images
          </Link>
        </div>
      ) : (
        <Row className="g-4">
          {board.images.map((image, index) => (
            <Col key={`${image.id}-${index}`} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm">
                <div
                  className="position-relative"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={image.src.medium}
                    alt={image.alt || `Photo by ${image.photographer}`}
                    style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 m-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Remove this image from board?")) {
                        deleteImage(image.id);
                      }
                    }}
                  >
                    ×
                  </Button>
                </div>
                <Card.Body>
                  <Card.Text className="text-truncate">{image.alt || `Photo by ${image.photographer}`}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <YetAnotherLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={board.images.map((img) => ({
          src: img.src.large || img.src.original,
          alt: img.alt || `Photo by ${img.photographer}`,
        }))}
        index={lightboxIndex}
      />
    </Container>
  );
};

export default BoardDetail;
