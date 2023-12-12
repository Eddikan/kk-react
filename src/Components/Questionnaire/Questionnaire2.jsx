import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, FormGroup, ModalFooter }  from 'react-bootstrap';
import { IoIosArrowRoundForward } from "react-icons/io";
import Form from 'react-bootstrap/Form';
import { IoCloudUploadOutline } from "react-icons/io5";
import FormControl from 'react-bootstrap/FormControl';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TagsInput } from "react-tag-input-component";
import ImageDragAndDrop from 'Components/Shared/ImageDragAndDrop';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import AddPortfolio from 'Components/Pages/Forms/AddPortfolio';
import GetUserPortfolioData from 'Utils/GetPortfolioData';

const initialQuestionnaire2Data = Object.freeze({
    design_collection: '',
    design_image_tags: '',
    design_materials: '',
    design_color: '',
    design_season: '',
    category: '',
    design_image_description: '',
    design_name: '',
    inspirations_and_influences: '',
    pricing_structure: '',
    lead_time: '',
    specialization_and_expertise: '',
    design_process_insights: '',
    is_designer: 1,
  });

const Questionnaire2 = (props) => {
  const navigate = useNavigate();
  const currentStep = props.step;
  const currentUser = props.currentUser;

  const [questionnaire2Data, setQuestionnaire2Data] = useState(initialQuestionnaire2Data);
  const [questionnaire2Loading, setQuestionnaire2Loading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [reloadCount, setReloadCount] = useState(0);
  const [scheduleShow, setScheduleShow] = useState(false);
  const [uploadFileShow, setUploadFileShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [selectedSpecialitation, setSelectedSpecialitation] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [portfolioLoading, setPortfolioLoading] = useState([]);

  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn','userDetails','userRole', 'token']);

  const fetchData = async (e) => {
    try {
      const portfolioData = await GetUserPortfolioData(e);
      if (portfolioData) {
        setPortfolio(portfolioData);
        setPortfolioLoading(false);
      } else {
        toast.error('Fail!');
      }
      // Update state or perform other logic with userData
    } catch (error) {
        toast.error('Fail!');
      // Handle the error, if needed
    }
};



  const toggleSchedule = (e) => {
    e.preventDefault();
    setScheduleShow(!scheduleShow);
  }

  const toggleuploadFile = (e) => {
    e.preventDefault();
    setUploadFileShow(!uploadFileShow);
  }

  const hideUpload = (e) => {
    setUploadFileShow(false);
  }

  const hideAll = (e) => {
    props.onHideAll(e);
  };

  const handleChange = (e) => {
    setQuestionnaire2Data({
      ...questionnaire2Data,
      [e.target.name]: e.target.value,
    })
  }

  const refreshPortfolio = (e) => {
    if (e) {
        setReloadCount(reloadCount + 1);
    }
  }

  async function questionnaire2Submit(e) {
    e.preventDefault();
    setQuestionnaire2Loading(true);
    setTimeout(function(){
        hideAll(3);
        setQuestionnaire2Loading(false);
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

  useEffect(() => {
    fetchData(currentUser);
}, [reloadCount]);

  return (
    <>
        <Container className='q1 narrow-750 py-5 px-4 mt-5 text-dgray'>
            <Row>
                <Col lg='12' className='text-center'>
                    <h2 className='form-title pb-2 mb-3'>Showcase your talent</h2>
                </Col>
            </Row>
            <Form onSubmit={questionnaire2Submit}>
                <Row className="mb-3">
                    <Col lg="12">
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-1 fs-18'>
                                    Areas of Specialization and Expertise
                                </Form.Label>
                                <Form.Label className="mb-3">
                                    Specify your areas of expertise (e.g., bridal wear, ready-to-wear women’s clothing, casual, haute couture, sustainable fashion)
                                </Form.Label>
                                <Form.Group>
                                    {/* <Form.Control
                                        type="text"
                                        name="specialization_and_expertise"
                                        value={questionnaire2Data.specialization_and_expertise}
                                        onChange={handleChange}
                                    /> */}
                                    <TagsInput
                                        value={selectedSpecialitation}
                                        onChange={setSelectedSpecialitation}
                                        name="specialization_and_expertise"
                                        // placeHolder="Fabric Type"
                                    />
                                </Form.Group>
                            </CardBody>
                        </Card>
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-3 fs-18'>
                                    Portfolio Showcase
                                </Form.Label>
                                <Card className='background-dashed'>
                                    <CardBody>
                                        {/* Top */}
                                        <Row className="align-items-center text-center my-5">
                                            <Col>
                                                <Form.Label className="mb-1 fs-20">
                                                    Upload your design
                                                </Form.Label>
                                                <Form.Label className="mb-4 fs-16">
                                                    Showcase your best work, get feedback, likes, and join a growing community.
                                                </Form.Label>
                                                <Button className='btn-primary' 
                                                    onClick={toggleuploadFile} 
                                                    type="button"
                                                >
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
                                    Design Process Insights
                                </Form.Label>
                                <Form.Label className="mb-3">
                                    Provider information about your design process, from ideation to creation.
                                </Form.Label>
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        name="design_process_insights"
                                        rows={5} // You can adjust the number of rows as needed
                                        value={initialQuestionnaire2Data.design_process_insights}
                                        placeholder=""
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </CardBody>
                        </Card>
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-1 fs-18 d-block'>
                                    Lead Time and Pricing Structure
                                </Form.Label>
                                <Form.Label className="mb-3">
                                    Provide information about the typical lead time for designing, 
                                    creatung, and delivering garments, along with transparent 
                                    pricing structyres, helps set expectations.
                                </Form.Label>
                                <Form.Label className="mb-3">
                                    Lead Time
                                </Form.Label>
                                <Form.Group className='mb-3'>
                                    <Form.Control
                                        type="text"
                                        name="lead_time"
                                        value={questionnaire2Data.lead_time}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Label className="mb-3">
                                    Pricing Structure
                                </Form.Label>
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        name="pricing_structure"
                                        rows={5} // You can adjust the number of rows as needed
                                        value={questionnaire2Data.pricing_structure}
                                        placeholder=""
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </CardBody>
                        </Card>
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-3 fs-18 d-block'>
                                    Design Inspirations and Influences
                                </Form.Label>
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        name="inspirations_and_influences"
                                        rows={5} // You can adjust the number of rows as needed
                                        value={questionnaire2Data.inspirations_and_influences}
                                        placeholder=""
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </CardBody>
                        </Card>
                        <Card className='mb-4 border-white'>
                            <CardBody>
                                <Form.Label className='mb-2 fs-18'>
                                    Calendary Availability
                                </Form.Label>
                                <Form.Group>
                                    <Button className='btn-primary' onClick={toggleSchedule} type="button">Schedule</Button>
                                </Form.Group>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg="12" className="text-right">
                        <Button className='btn-outline me-3' type="button" onClick={function() { hideAll(2); }}>Back</Button>
                        {questionnaire2Loading ?
                            <Button className='btn-primary me-3' type="button">Saving...</Button>
                            :
                            <Button className='btn-primary me-3' type="submit">Save</Button>
                        }
                        <span className="cursor-pointer text-black" onClick={function() { hideAll(3); }}>Skip <IoIosArrowRoundForward /></span>
                    </Col>
                </Row>
            </Form>
        </Container>
        {/* Schedule */}
        <Modal
            isOpen={scheduleShow}
            className='modal-preview'
            fade={false}
            centered
        >
            <ModalHeader className="pb-0">
                <h5 className='modal-title text-uppercase text-left'></h5>
                <button type='button' className='close react-modal-close' onClick={toggleSchedule} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                </button>
            </ModalHeader>
            <ModalBody>
                <h4 className='text-center fs-25 fw-600'>Schedule</h4>
                <Card  className='border-white'>
                    <CardBody>

                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>
        <Modal
            isOpen={uploadFileShow}
            className='modal-preview'
            fade={false}
            style={{minWidth: '600px'}}
            centered
        >
            <ModalHeader className="pb-0">
                <button type='button' className='close react-modal-close' onClick={toggleuploadFile} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                </button>
            </ModalHeader>
            <ModalBody>
                <h2 className='modal-title fs-25 fw-600 text-center'>Upload your Design</h2>
                <Card  className="border-0">
                    <CardBody className="p-2">
                        <AddPortfolio size="small" withDraft={false} onSuccess={refreshPortfolio} onCancel={hideUpload} />
                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>
    </>
  );
};

export default Questionnaire2;