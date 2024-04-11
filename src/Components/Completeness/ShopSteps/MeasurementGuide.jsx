// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Row, Col, Button, Form, FormControl } from 'react-bootstrap';
// import { GoPlus } from "react-icons/go";
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import { useCookies } from 'react-cookie';
// import Countries from 'Utils/Countries';

// const MeasurementGuide = ({ user, currentUser, reload, token }) => {
//     const navigate = useNavigate();

//     const addNewPortfolio = () => {
//         navigate('/user/center/design/add')
//     };
    

//     return (
//         <>
//             <div className='fs-25 rufina-family mb-4'>Build your measurement guide</div>

//             <div>
//                                         <Row className="mb-4">
//                                             <Col lg={11}>
//                                             </Col>

//                                             <Col lg={1} className='text-right'>
//                                                 <GoBack fallBack="/" />
//                                             </Col>

//                                             <Col lg={8} className='d-flex justify-content-left align-items-center'>
//                                                 <h2 className='fs-30 fw-600'>Measurement Guide</h2>
//                                             </Col>

//                                             <Col lg={4} className="text-right">
//                                                 {elements && elements.length > 0 && (
//                                                     <Button className='btn-primary bg-transparent border-black text-black bg-black-hover border-black-hover text-white-hover me-3' type="button" onClick={() => { toggleGuideModal(); handleActionType("edit"); }}><GoPencil size="20px" className='me-2' /> Edit</Button>
//                                                 )}
//                                                 <Button className='btn-primary bg-gold-hover border-gold-hover text-white-hover' type="button" onClick={() => { toggleGuideModal(); handleActionType("add"); }}><GoPlus size="20px" className='me-2' /> New Element</Button>

//                                             </Col>
//                                         </Row>
//                                         <Row>
//                                             <Col lg={8}>
//                                                 <Card>
//                                                     <Card.Body>
//                                                         <h4 className="fw-600 mb-3">Preview</h4>
//                                                         <div>
//                                                             {elements && elements.length > 0 ?
//                                                                 <>
//                                                                     <hr />
//                                                                     {/* Preview based on selected input type */}
//                                                                     {elements.map((element, index) => (
//                                                                         <>
//                                                                             {element.type == "Heading" ?
//                                                                                 <h3 className='fw-600 my-4' key={index}>{element.value}</h3>
//                                                                                 : element.type == "Paragraph" ?
//                                                                                     <p key={index}>{element.value}</p>
//                                                                                     : element.type == "Image" ?
//                                                                                         <>
//                                                                                             {element.value && element.value.length > 0 && element.value != "" ?
//                                                                                                 <>
//                                                                                                     {element.value.map((image, imageIndex) => (
//                                                                                                         <img key={imageIndex} src={process.env.REACT_APP_STORAGE_URL + 'product/' + image?.image_url} className="w-100 mb-3 image-height-preview" alt="" />
//                                                                                                     ))}
//                                                                                                 </>
//                                                                                                 :
//                                                                                                 null
//                                                                                             }
//                                                                                         </>
//                                                                                         :
//                                                                                         <>
//                                                                                             {(element.type == "YouTube Embed Link" || element.type == "Vimeo Embed Link") && element.value != "" ?
//                                                                                                 <>
//                                                                                                     <div className="mb-3">
//                                                                                                         <ResponsiveEmbedVideo src={element.value} title={element.type} />
//                                                                                                     </div>
//                                                                                                 </>
//                                                                                                 : element.type == "Video" && element.value != "" ?
//                                                                                                     <>
//                                                                                                         <div className="mb-3">
//                                                                                                             <ResponsiveVideo src={process.env.REACT_APP_STORAGE_URL + 'products/videos/' + element.value} />
//                                                                                                         </div>
//                                                                                                     </>
//                                                                                                     : element.type == "Line Break" ?
//                                                                                                         <p className="py-4 mb-0"></p>
//                                                                                                         :
//                                                                                                         null
//                                                                                             }
//                                                                                         </>
//                                                                             }

//                                                                         </>
//                                                                     ))}
//                                                                 </>
//                                                                 :
//                                                                 <Card className="mb-3 mt-3">
//                                                                     <Card.Body className="bg-lgray">
//                                                                         <p className="text-center mb-0">No measurement guide added.</p>
//                                                                     </Card.Body>
//                                                                 </Card>

//                                                             }
//                                                         </div>
//                                                     </Card.Body>
//                                                 </Card>
//                                             </Col>
//                                             <Col lg="4">
//                                                 <Card>
//                                                     <Card.Body className="bg-white">
//                                                         <h4 className="fw-600 mb-3">Elements</h4>
//                                                         <DragDropContext onDragEnd={onDragEnd}>
//                                                             <Droppable droppableId="elements">
//                                                                 {/* {provided => (
//                                                                     <div {...provided.droppableProps} ref={provided.innerRef}>
//                                                                         {elements.map((element, index) => (
//                                                                             <Draggable key={index} draggableId={index.toString()} index={index}>
//                                                                                 {provided => (
//                                                                                     <Card
//                                                                                         className="mb-3"
//                                                                                         ref={provided.innerRef}
//                                                                                         {...provided.draggableProps}
//                                                                                         {...provided.dragHandleProps}
//                                                                                     >
//                                                                                         <Card.Body className="bg-lgray">
//                                                                                             <h3 className="fw-600 fs-18">{element.type}</h3>
//                                                                                         </Card.Body>
//                                                                                     </Card>
//                                                                                 )}
//                                                                             </Draggable>
//                                                                         ))}
//                                                                         {provided.placeholder}
//                                                                     </div>
//                                                                 )} */}
//                                                             </Droppable>
//                                                         </DragDropContext>
//                                                     </Card.Body>
//                                                 </Card>
//                                             </Col>
//                                         </Row>
//                                     </div>
//         </>
//     )
// }

// export default MeasurementGuide;
