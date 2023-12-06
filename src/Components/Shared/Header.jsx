import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { Container, Button }  from 'react-bootstrap';
import { FaMagnifyingGlass } from "react-icons/fa6";
import Logo from '../../Assets/images/kouture-konect-logo.png';

function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-primary">
      <Container>
        <Navbar.Brand href="/"><img src={Logo}/></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-between" id="responsive-navbar-nav">
          <Nav className="align-items-center">
            <Nav.Link href="/find-designs">Find Designs</Nav.Link>
            <Nav.Link href="/inspirations">Inspirations</Nav.Link>
            <Nav.Link href="/inspirations">Blog</Nav.Link>
          </Nav>
          <Nav className="align-items-center d-grid-mobile">
            <Form inline className='search d-flex column-gap-70 align-items-center'>
              <FormControl type='text' placeholder='Search' className='mr-sm-2' />
              <FaMagnifyingGlass />
            </Form>
            <Nav.Link href="/login">Log in</Nav.Link>
            <Nav.Link href="/sign-up"><Button className="btn-primary" variant="primary">Sign Up</Button></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;