import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

const MyNavBar = ({ isAuthenticated, onLogout }) => {
  const navItems = [
    { id: 1, title: "Home", path: "/" },
    { id: 2, title: "Categories", path: "/categories" },
    { id: 3, title: "MyMoods", path: "/mymoods" },
    { id: 4, title: "News", path: "/news" },
  ];

  return (
    <>
      {/* Mobile Navbar */}
      <Navbar bg="light" expand="md" className="d-md-none">
        <Container>
          <Navbar.Brand as={Link} to="/">
            ARTKIVE
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar" />
          <Navbar.Collapse id="responsive-navbar">
            <Nav className="me-auto">
              {navItems.map((item) => (
                <Nav.Link
                  as={NavLink}
                  to={item.path}
                  key={item.id}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {item.title}
                </Nav.Link>
              ))}
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <Nav.Link onClick={onLogout} className="text-danger">
                  Logout
                </Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/login" className="text-primary">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Desktop Navbar */}
      <Navbar bg="light" className="d-none d-md-flex vh-100 navbar-vertical">
        <Container fluid className="flex-column h-100 p-0">
          <Navbar.Brand as={Link} to="/" className="mb-4 ps-3">
            ARTKIVE
          </Navbar.Brand>
          <Nav className="flex-column w-100 px-3">
            <ul className="custom-nav-list">
              {navItems.map((item) => (
                <li key={item.id}>
                  <NavLink to={item.path} className={({ isActive }) => `nav-link-custom ${isActive ? "active" : ""}`}>
                    <span className="icon"></span>
                    <span className="title">{item.title}</span>
                  </NavLink>
                </li>
              ))}
              <li>
                {isAuthenticated ? (
                  <button
                    onClick={onLogout}
                    className="nav-link-custom text-danger border-0 bg-transparent w-100 text-start"
                  >
                    <span className="icon"></span>
                    <span className="title">Logout</span>
                  </button>
                ) : (
                  <NavLink to="/login" className={({ isActive }) => `nav-link-custom ${isActive ? "active" : ""}`}>
                    <span className="icon"></span>
                    <span className="title">Login</span>
                  </NavLink>
                )}
              </li>
            </ul>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default MyNavBar;
