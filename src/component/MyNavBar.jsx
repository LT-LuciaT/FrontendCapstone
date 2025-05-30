import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

const MyNavBar = () => {
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
            La Mia App
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
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Desktop Navbar */}
      <Navbar bg="light" className="d-none d-md-flex vh-100 navbar-vertical">
        <Container fluid className="flex-column h-100 p-0">
          <Navbar.Brand as={Link} to="/" className="mb-4 ps-3">
            La Mia App
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
            </ul>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default MyNavBar;
