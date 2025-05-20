import { Navbar, Nav, Container } from "react-bootstrap";

const MyNavBar = () => {
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

      {/* Navbar per desktop (verticale) */}
      <Navbar bg="light" className="d-none d-md-flex vh-100 navbar-vertical">
        <Container fluid className="flex-column h-100 p-0">
          <Navbar.Brand href="#home" className=" mb-4 ps-3">
            La Mia App
          </Navbar.Brand>
          <Nav className="flex-column w-100">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#categories">Categories</Nav.Link>
            <Nav.Link href="#mymoods">MyMoods</Nav.Link>
            <Nav.Link href="#news">News</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default MyNavBar;
