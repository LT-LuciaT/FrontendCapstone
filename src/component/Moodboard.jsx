import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

const Moodboard = ({ images, onUpdateImages }) => {
  const moveImage = (id, left, top) => {
    const updatedImages = images.map((img) => (img.id === id ? { ...img, left, top } : img));
    onUpdateImages(updatedImages);
  };

  const resizeImage = (id, width, height) => {
    const updatedImages = images.map((img) => (img.id === id ? { ...img, width, height } : img));
    onUpdateImages(updatedImages);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="moodboard-container"
        style={{ position: "relative", width: "100%", height: "800px", border: "1px dashed #ccc" }}
      >
        {images.map((image) => (
          <DraggableResizableImage key={image.id} image={image} onMove={moveImage} onResize={resizeImage} />
        ))}
      </div>

      <ImageLibrary images={images} />
    </DndProvider>
  );
};

const DraggableResizableImage = ({ image, onMove, onResize }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "IMAGE",
    item: { id: image.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "IMAGE",
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(image.left + delta.x);
      const top = Math.round(image.top + delta.y);
      onMove(image.id, left, top);
    },
  }));

  const onResizeStop = (e, { size }) => {
    onResize(image.id, size.width, size.height);
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        position: "absolute",
        left: image.left,
        top: image.top,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        zIndex: 1,
      }}
    >
      <Resizable width={image.width} height={image.height} onResizeStop={onResizeStop} lockAspectRatio={true}>
        <div style={{ width: "100%", height: "100%" }}>
          <img
            src={image.src}
            alt={image.alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
      </Resizable>
    </div>
  );
};

const ImageLibrary = ({ images, onAddToMoodboard }) => {
  return (
    <div className="image-library mt-4 p-3" style={{ borderTop: "1px solid #eee" }}>
      <h5>Images from your board</h5>
      <div className="d-flex flex-wrap gap-2">
        {images.map((image) => (
          <LibraryImage key={`lib-${image.id}`} image={image} onAdd={() => onAddToMoodboard(image)} />
        ))}
      </div>
    </div>
  );
};

const LibraryImage = ({ image, onAdd }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "IMAGE",
    item: { id: image.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        width: "100px",
        height: "100px",
        position: "relative",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onAdd();
      }}
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
    </div>
  );
};

export default Moodboard;
