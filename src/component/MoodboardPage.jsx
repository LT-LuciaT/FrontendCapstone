import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Row, Col } from "react-bootstrap";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { useEffect, useState, useCallback } from "react";
import YetAnotherLightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const MoodboardDropZone = ({ children, onDropImage }) => {
  const [, drop] = useDrop(() => ({
    accept: "IMAGE",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && item.isInMoodboard) {
        const container = document.querySelector(".moodboard-container").getBoundingClientRect();
        const left = offset.x - container.left;
        const top = offset.y - container.top;
        onDropImage(item.id, left, top);
      }
    },
  }));

  return (
    <div ref={drop} style={{ position: "relative", width: "100%", height: "100%" }}>
      {children}
    </div>
  );
};

const DraggableImage = ({ image, isInMoodboard = true, onClick, onRemove, onResize }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "IMAGE",
    item: { id: image.id, isInMoodboard, left: image.left, top: image.top },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "IMAGE",
    drop: (item) => {
      if (!isInMoodboard && item.isInMoodboard) {
        onRemove(item.id);
      }
    },
  }));

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(image.id);
  };

  const imageElement = (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        boxSizing: "border-box",
      }}
      onClick={handleClick}
    >
      <img
        src={image.src.medium || image.src}
        alt={image.alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
      {isInMoodboard && (
        <Button
          variant="danger"
          size="sm"
          className="position-absolute top-0 end-0 m-1"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(image.id);
          }}
        >
          ×
        </Button>
      )}
    </div>
  );
  return isInMoodboard ? (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        position: "absolute",
        left: image.left,
        top: image.top,
        width: image.width,
        height: image.height,
        zIndex: image.isActive ? 10 : 1,
      }}
      className={`draggable-image-container ${image.isActive ? "active" : ""}`}
    >
      <Resizable
        width={image.width}
        height={image.height}
        onResize={(e, { size }) => {
          e.stopPropagation();
          onResize(image.id, size.width, size.height);
        }}
        resizeHandles={["se"]}
        handle={(handle) => (
          <div
            className={`react-resizable-handle react-resizable-handle-${handle}`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        )}
        lockAspectRatio={true}
      >
        <div style={{ width: "100%", height: "100%" }} onClick={(e) => e.stopPropagation()}>
          {imageElement}
        </div>
      </Resizable>
    </div>
  ) : (
    <div ref={(node) => drag(drop(node))} style={{ width: "100px", height: "100px" }} onClick={handleClick}>
      {imageElement}
    </div>
  );
};

const MoodboardPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [moodboardImages, setMoodboardImages] = useState([]);
  const [libraryImages, setLibraryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (state?.images) {
      const transformedImages = state.images.map((img, index) => ({
        id: img.id || `img-${index}`,
        src: img.src.large || img.src.original || img.src,
        alt: img.alt || `Photo by ${img.photographer}` || "Moodboard image",
        left: 50 + Math.random() * 500,
        top: 50 + Math.random() * 300,
        width: 250,
        height: 200,
        originalData: img,
        isActive: false,
      }));

      setMoodboardImages(transformedImages);
      setLibraryImages(state.images);
      setIsLoading(false);
    } else {
      console.warn("No images received from BoardDetail");
      navigate(`/mymoods/${id}`);
    }
  }, [state, id, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".draggable-image-container")) {
        setMoodboardImages((prev) => prev.map((img) => ({ ...img, isActive: false })));
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const moveImage = useCallback((id, left, top) => {
    setMoodboardImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, left, top, isActive: true } : { ...img, isActive: false }))
    );
  }, []);

  const resizeImage = useCallback((id, width, height) => {
    setMoodboardImages((prev) => prev.map((img) => (img.id === id ? { ...img, width, height } : img)));
  }, []);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (!e.target.closest(".draggable-image-container") && !e.target.classList.contains("react-resizable-handle")) {
        setMoodboardImages((prev) => prev.map((img) => ({ ...img, isActive: false })));
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const toggleActive = useCallback((id) => {
    setMoodboardImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, isActive: true } : { ...img, isActive: false }))
    );
  }, []);

  const addImageToMoodboard = useCallback((image) => {
    const newImage = {
      id: image.id || `new-${Date.now()}`,
      src: image.src.large || image.src.original || image.src,
      alt: image.alt || `Photo by ${image.photographer}`,
      left: 50 + Math.random() * 500,
      top: 50 + Math.random() * 300,
      width: 250,
      height: 200,
      originalData: image,
      isActive: false,
    };
    setMoodboardImages((prev) => [...prev.map((img) => ({ ...img, isActive: false })), newImage]);
  }, []);

  const removeImage = useCallback((id) => {
    setMoodboardImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const saveMoodboard = () => {
    try {
      const savedBoards = JSON.parse(localStorage.getItem("pinterest-boards")) || [];
      const updatedBoards = savedBoards.map((b) => {
        if (b.id === Number(id)) {
          return { ...b, moodboard: moodboardImages };
        }
        return b;
      });
      localStorage.setItem("pinterest-boards", JSON.stringify(updatedBoards));
      navigate(`/mymoods/${id}`);
    } catch (error) {
      console.error("Failed to save moodboard:", error);
      alert("Error saving moodboard");
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p>Loading moodboard...</p>
      </Container>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Edit Moodboard</h1>
          <div>
            <Button variant="outline-secondary" onClick={() => navigate(`/mymoods/${id}`)} className="me-2">
              Back to Board
            </Button>
            <Button variant="primary" onClick={saveMoodboard} disabled={!moodboardImages.length}>
              Save Moodboard
            </Button>
          </div>
        </div>

        <div
          className="moodboard-container mb-4"
          style={{
            position: "relative",
            width: "100%",
            height: "600px",
            border: "2px dashed #ccc",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <MoodboardDropZone onDropImage={moveImage}>
            {moodboardImages.map((image) => (
              <DraggableImage
                key={image.id}
                image={image}
                isInMoodboard
                onClick={toggleActive}
                onRemove={removeImage}
                onResize={resizeImage}
              />
            ))}
          </MoodboardDropZone>
        </div>

        <div className="image-library">
          <h4>Available Images</h4>
          <Row className="g-2">
            {libraryImages.map((image, index) => (
              <Col xs={6} sm={4} md={3} lg={2} key={`lib-${image.id}`}>
                <div className="position-relative" onClick={() => addImageToMoodboard(image)}>
                  <DraggableImage
                    image={image}
                    isInMoodboard={false}
                    onClick={() => {
                      const index = libraryImages.findIndex((img) => img.id === image.id);
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                  />
                  <div className="text-truncate small mt-1">{image.alt || `Image ${index + 1}`}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <YetAnotherLightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={libraryImages.map((img) => ({
            src: img.src.large || img.src.original,
            alt: img.alt || `Photo by ${img.photographer}`,
          }))}
          index={lightboxIndex}
        />
      </Container>
    </DndProvider>
  );
};

export default MoodboardPage;
