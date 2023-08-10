import Button from 'react-bootstrap/Button';
import Layout from '../../Components/Layout/Layout';
import { Container } from 'react-bootstrap';

function Buttons() {
    return (
    <Layout>
        <Container className="py-4">
            <>
                <div className="mb-4">
                    <h3>Button Variants</h3>
                    <p>Use any of the available button style types to quickly create a styled button. Just modify the variant prop.</p>
                    <Button className="me-2" variant="primary">Primary</Button>
                    <Button className="me-2" variant="secondary">Secondary</Button>
                    <Button className="me-2" variant="success">Success</Button>
                    <Button className="me-2" variant="warning">Warning</Button>
                    <Button className="me-2" variant="danger">Danger</Button>
                    <Button className="me-2" variant="info">Info</Button>
                    <Button className="me-2" variant="light">Light</Button>
                    <Button className="me-2" variant="dark">Dark</Button>
                    <Button className="me-2" variant="link">Link</Button>
                </div>
                <div className="mb-4">
                    <h3>Button Outline Variants</h3>
                    <p>For a lighter touch, Buttons also come in outline-* variants with no background color.</p>
                    <Button className="me-2" variant="outline-primary">Primary</Button>
                    <Button className="me-2" variant="outline-secondary">Secondary</Button>
                    <Button className="me-2" variant="outline-success">Success</Button>
                    <Button className="me-2" variant="outline-warning">Warning</Button>
                    <Button className="me-2" variant="outline-danger">Danger</Button>
                    <Button className="me-2" variant="outline-info">Info</Button>
                    <Button className="me-2" variant="outline-light">Light</Button>
                    <Button className="me-2" variant="outline-dark">Dark</Button>
                </div>

                <div className="mb-4">
                    <h3>Button Tags</h3>
                    <p>Normally Buttoncomponents will render a HTML button element. However you can render whatever you'd like, adding a href prop will automatically render an <a /> element. You can use the as prop to render whatever your heart desires. React Bootstrap will take care of the proper ARIA roles for you.</p>
                    <Button href="#">Link</Button> <Button type="submit">Button</Button>
                    <Button as="input" type="button" value="Input" />
                    <Button as="input" type="submit" value="Submit" />
                    <Button as="input" type="reset" value="Reset" />
                </div>
                <div className="mb-4">
                    <h3>Button Sizes</h3>
                    <div className="mb-2">
                        <Button variant="primary" size="lg">
                        Large button
                        </Button>
                        <Button variant="secondary" size="lg">
                        Large button
                        </Button>
                    </div>
                    <div>
                        <Button variant="primary" size="sm">
                        Small button
                        </Button>
                        <Button variant="secondary" size="sm">
                        Small button
                        </Button>
                    </div>
                </div>
            </>
      </Container>
    </Layout>
    );
  }
  
  export default Buttons;