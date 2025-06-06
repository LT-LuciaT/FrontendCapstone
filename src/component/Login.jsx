import { useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { apiService } from "../API/apiService";

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiService.post("/auth/login", credentials);
      // Assumendo che il backend restituisca un token
      localStorage.setItem("token", response.token);
      onLogin(response.token);
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="login-card shadow">
            <Card.Body>
              <div className="text-center mb-4">
                <h2 className="login-title">Welcome to Moodboard</h2>
                <p className="text-muted">Discover and save creative ideas</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                    className="login-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    className="login-input"
                  />
                </Form.Group>

                <Button variant="danger" type="submit" className="w-100 login-button">
                  Log in
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p className="text-muted">OR</p>
              </div>

              <Button variant="outline-dark" className="w-100 mb-3">
                Continue with Google
              </Button>

              <div className="text-center mt-4">
                <p>
                  Not on Moodboard yet?{" "}
                  <Button variant="link" className="p-0" onClick={onSwitchToSignup}>
                    Sign up
                  </Button>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
