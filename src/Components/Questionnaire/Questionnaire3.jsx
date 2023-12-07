import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, FormGroup, ModalFooter }  from 'react-bootstrap';
import { IoIosArrowRoundForward } from "react-icons/io";
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import { IoCloudUploadOutline } from "react-icons/io5";

const initialQuestionnaire3Data = Object.freeze({
    fabric_type: '',
    fabric_process_insights: '',
    pricing_structure: '',
    selectedImage: '',
    fabrics_image_title: '',
    fabrics_image_description: '',
    fabrics_image_colors: '',
    fabrics_image_materials: '',
    fabrics_image_tags: '',
  });

const Questionnaire3 = (props) => {
  const navigate = useNavigate();
  const currentStep = props.step;
  const currentUser = props.currentUser;

  const [questionnaire3Data, setQuestionnaire3Data] = useState(initialQuestionnaire3Data);
  const [questionnaire3Loading, setQuestionnaire3Loading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [reloadCount, setReloadCount] = useState(0);
  const [uploadFileShow, setUploadFileShow] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn','userDetails','userRole', 'token']);

  const toggleuploadFile = (e) => {
    e.preventDefault();
    setUploadFileShow(!uploadFileShow);
  }

  const back = (e) => {
    props.onHideQuestionnaire(e);
  };

  const skip = (e) => {
    props.onSkip(e);
  };

  const handleChange = (e) => {
    setQuestionnaire3Data({
      ...questionnaire3Data,
      [e.target.name]: e.target.value,
    })
  }

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState('');

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    displayImage(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    displayImage(file);
  };

  const displayImage = (file) => {
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };


  async function questionnaire3Submit(e) {
    e.preventDefault();
    setQuestionnaire3Loading(true);
    setTimeout(function(){
        skip(currentStep + 1);
        setQuestionnaire3Loading(false);
    }, 1500)
    // axios.post(process.env.REACT_APP_API_ENDPOINT + 'user/'+currentUser, {clothing_sizes: questionnaire2Data, user_id: currentUser }).then((response) => {
    //   const success = response.data.status;
    //   if (success == 'Success') {
    //     const data = response.data.data;
    //     const user = data.user;
    //     toast.success('Successfully signed up!');
    //     setCookie('currentUser', JSON.stringify(user.id), { path: '/' });
    //     setCookie('userRole', JSON.stringify(user.role), { path: '/' });
    //     setCookie('userDetails', JSON.stringify(user), { path: '/' });
    //     setCookie('isLoggedIn', true, { path: '/' });
    //     setTimeout(function(){
    //       navigate("/email-confirmation");
    //     }, 1500)
    //   } else {
    //     const errors = response.data.errors;
    //     if (errors.email) {
    //       toast.error(errors.email[0]);
    //     } if (errors.password) {
    //       toast.error(errors.password[0]);
    //     } else {
    //       errors.map((error, index) => {
    //         toast.error(error);
    //         return null; // React requires a return value, so we return null here
    //       });
    //     }
    //   }
    //   setQuestionnaire2Loading(false);
    // }).catch((error) => {
    //     setQuestionnaire2Loading(false);
    //   toast.error('Something went wrong, please contact the administrator!');
    // });  
  }

  return (
    <>
        <Container className='q1 narrow-750 py-5 px-4 mt-5 text-dgrey'>
            <Row>
                <Col lg='12' className='text-center'>
                    <h2 className='form-title pb-2 mb-3'>Showcase the rich textures, and pattern of your fabrics</h2>
                </Col>
            </Row>
            <Form onSubmit={questionnaire3Submit}>
                <Row className="mb-3">
                    <Col lg="12">
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-1 fs-18'>
                                    Type of Fabric
                                </Form.Label>
                                <Form.Label className="mb-3">
                                     Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut aliquyam erat voluptua.
                                </Form.Label>
                                <Col lg="12">
                                    <Row>
                                        <div className="form-control d-flex" id="fabric-buttons">
                                            <Button className='me-3' type="button">Cotton</Button>
                                            <Button className='me-3' type="button">Linen</Button>
                                            <Button className='me-3' type="button">Nylon</Button>
                                        </div>
                                    </Row>
                                </Col>
                            </CardBody>
                        </Card>
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Card className='background-dashed'>
                                    <CardBody>
                                        {/* Top */}
                                        <Row className="align-items-center text-center my-5">
                                            <Col>
                                                <Form.Label className="mb-1 fs-20">
                                                    Upload your fabrics
                                                </Form.Label>
                                                <Form.Label className="mb-4 fs-16">
                                                    Share your fabric snapshot to uncover a realm of creative possibilities.
                                                </Form.Label>
                                                <Button className='btn-primary' onClick={toggleuploadFile} type="button">
                                                    Upload Your First Shot
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </CardBody>
                        </Card>
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-1 fs-18 d-block'>
                                    Fabric Process Insights
                                </Form.Label>
                                <Form.Label className="mb-3">
                                    Provide information about fabric..
                                </Form.Label>
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        name="fabric_process_insights"
                                        rows={5} // You can adjust the number of rows as needed
                                        value={questionnaire3Data.fabric_process_insights}
                                        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </CardBody>
                        </Card>
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-1 fs-18'>
                                    Pricing Structure
                                </Form.Label>
                                <Form.Label className="mb-3">
                                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
                                </Form.Label>
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        name="pricing_structure"
                                        rows={5} // You can adjust the number of rows as needed
                                        value={questionnaire3Data.pricing_structure}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" className="text-right">
                        <Button className='btn-outline me-3' type="button" onClick={function() { back(1); }}>Back</Button>
                        {questionnaire3Loading ?
                            <Button className='btn-primary me-3' type="button">Saving...</Button>
                            :
                            <Button className='btn-primary me-3' type="submit">Save</Button>
                        }
                        <span className="cursor-pointer text-black" onClick={function() {back(1); skip(currentStep + 1);}}>Skip <IoIosArrowRoundForward /></span>
                    </Col>
                </Row>
            </Form>
        </Container>
        {/* Schedule */}
        <Modal
            isOpen={uploadFileShow}
            className='modal-preview'
            fade={false}
            centered
        >
            <ModalHeader className="pb-0">
                <button type='button' className='close react-modal-close' onClick={toggleuploadFile} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                </button>
            </ModalHeader>
            <ModalBody>
                <h2 className='modal-title fs-25 fw-600 text-center'>Upload your Fabrics</h2>
                <Form onSubmit={questionnaire3Submit}>
                    <Card  className="border-0">
                        <CardBody className="p-2">
                            <Row className="text-center my-3">
                                <Col lg="12">
                                    <Form.Group controlId="imageUpload" className='background-dashed py-4 image-upload'>
                                        <IoCloudUploadOutline className="upload-logo"/>
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            style={{
                                            cursor: 'pointer',
                                            }}
                                        >
                                        <Form.Control
                                            type="file"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                        />
                                        <p className="mt-2 mb-1">Drag and drop file here</p>
                                        <p className="mb-1">or</p>
                                        <Button className="imageUpload-button" onClick={() => document.getElementById('imageUpload').click()}>
                                            Browse Files
                                        </Button>
                                        </div>
                                        
                                        {imageName && (
                                            <div>
                                                <p className='mt-2'>Selected Image: {imageName}</p>
                                                <div>
                                                    <img style={{ width: '150px', height: 'auto' }} src={selectedImage} alt="Preview" thumbnail />
                                                </div>
                                            </div>
                                        )}
                                    </Form.Group>
                                    
                                    <Form.Group className="d-block text-left mt-4">
                                        <Form.Label className="mb-2">
                                            Title
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fabrics_image_title"
                                            value={questionnaire3Data.fabrics_image_title}
                                        />
                                    </Form.Group>

                                    <Form.Group className="d-block text-left mt-3">
                                        <Form.Label className="mb-2">
                                            Description
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            onChange={handleChange}
                                            name="fabrics_image_description"
                                            value={questionnaire3Data.fabrics_image_description}
                                        />
                                    </Form.Group>

                                    <Form.Group className="d-block text-left mt-3">
                                        <Form.Label className="mb-2">
                                            Colors
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fabrics_image_colors"
                                            value={questionnaire3Data.fabrics_image_colors}
                                        />
                                    </Form.Group>

                                    <Form.Group className="d-block text-left mt-3">
                                        <Form.Label className="mb-2">
                                            Materials
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fabrics_image_materials"
                                            value={questionnaire3Data.fabrics_image_materials}
                                        />
                                    </Form.Group>

                                    <Form.Group className="d-block text-left mt-3">
                                        <Form.Label className="mb-2">
                                            Tags
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fabrics_image_tags"
                                            value={questionnaire3Data.fabrics_image_tags}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="12" className="text-right save-fabrics-buttons">
                                    <Button className='btn-outline me-3' type="button" onClick={toggleuploadFile}>Cancel</Button>
                                    {questionnaire3Loading ?
                                        <Button className='btn-primary me-3' type="button">Uploading...</Button>
                                        :
                                        <Button className='btn-primary' type="submit">Upload</Button>
                                    }
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Form>
            </ModalBody>
        </Modal>
    </>
  );
};

export default Questionnaire3;