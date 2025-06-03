import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const MyMood = () => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem("pinterest-boards")) || [];
    setBoards(savedBoards);
  }, []);

  const deleteBoard = (boardId) => {
    const updatedBoards = boards.filter((board) => board.id !== boardId);
    setBoards(updatedBoards);
    localStorage.setItem("pinterest-boards", JSON.stringify(updatedBoards));
  };

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">My Mood Boards</h1>
        <Button as={Link} to="/" variant="primary">
          Discover More
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-5">
          <h4>You don't have any boards yet</h4>
          <p>Save images from the home page to create your first board</p>
          <Button as={Link} to="/" variant="primary">
            Explore Images
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {boards.map((board) => (
            <Col key={board.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm">
                <Link to={`/board/${board.id}`} className="text-decoration-none">
                  <Card.Img
                    variant="top"
                    src={board.coverImage}
                    alt={board.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </Link>
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title>{board.title}</Card.Title>
                    <Card.Text>
                      <small className="text-muted">
                        {board.pinCount} {board.pinCount === 1 ? "pin" : "pins"}
                      </small>
                    </Card.Text>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Delete board "${board.title}"?`)) {
                        deleteBoard(board.id);
                      }
                    }}
                  >
                    ×
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyMood;
