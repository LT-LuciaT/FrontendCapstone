import { Navbar, Nav, Container } from "react-bootstrap";

const MyNavBar = () => {
  const navItems = [
    { id: 1, title: "Home", colors: { i: "#a955ff", j: "#ea51ff" } },
    { id: 2, title: "Categories", colors: { i: "#56ccf2", j: "#2f80ed" } },
    { id: 3, title: "MyMoods", colors: { i: "#f2994a", j: "#f2c94c" } },
    { id: 4, title: "News", colors: { i: "#eb5757", j: "#000000" } },
  ];

  return (
    <>
      {/* Navbar per mobile (orizzontale) */}
      <Navbar bg="light" expand="md" className="d-md-none">
        <Container>
          <Navbar.Brand href="#home" className="">
            La Mia App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar" />
          <Navbar.Collapse id="responsive-navbar">
            <Nav className="me-auto ">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#categories">Categories</Nav.Link>
              <Nav.Link href="#mymoods">MyMoods</Nav.Link>
              <Nav.Link href="#news">News</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Navbar per desktop (verticale) - versione personalizzata */}
      <Navbar bg="light" className="d-none d-md-flex vh-100 navbar-vertical">
        <Container fluid className="flex-column h-100 p-0">
          <Navbar.Brand href="#home" className="mb-4 ps-3">
            La Mia App
          </Navbar.Brand>
          <Nav className="flex-column w-100 px-3">
            <ul className="custom-nav-list">
              {navItems.map((item) => (
                <li key={item.id} style={{ "--i": item.colors.i, "--j": item.colors.j }}>
                  <a href={`#${item.title.toLowerCase()}`} className="nav-link-custom">
                    <span className="icon"></span>
                    <span className="title">{item.title}</span>
                  </a>
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
