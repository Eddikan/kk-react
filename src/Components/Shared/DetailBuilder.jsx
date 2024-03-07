import React, { useState } from 'react';
import { Button, Row, Col, Card, Form } from 'react-bootstrap';
import { GoX } from 'react-icons/go';
import ImageDragAndDrop from './ImageDragAndDrop';
import ImageUploader from './ImageUploader';
import VideoDragAndDrop from './VideoDragAndDrop';
import VideoUploader from './VideoUploader';

const DetailBuilder = (props) => {
    const elementProps = props.elements;
    const size = props.size;
    const actionType = props.actionType;

    const [elements, setElements] = useState(elementProps ?? []);
    const [addElementShow, setAddElementShow] = useState(false);
    const [elementType, setElementType] = useState(null);
    const [elementValue, setElementValue] = useState(null);

    const handleAddElement = () => {
        if (elementType && elementType !== '' && elementValue !== '') {
            setElements(prevElements => [...prevElements, { type: elementType, value: elementValue }]);
            // Reset input fields
            setElementType('');
            setElementValue('');
            setAddElementShow(false);
            props.addElement([...elements, { type: elementType, value: elementValue }]);
            props.closeModal(true);
        }
    };

    const handleDone = () => {
        setElementType('');
        setElementValue('');
        setAddElementShow(false);
        props.addElement(elements);
        props.closeModal(true);
    };

    const handleInputChange = (index, value) => {
        setElements(prevElements => {
            const updatedElements = [...prevElements];
            updatedElements[index].value = value;
            return updatedElements;
        });
    };

    const handleFileChange = (index, files) => {
        setElements(prevElements => {
            const updatedElements = [...prevElements];
            updatedElements[index].value = files[0];
            return updatedElements;
        });
    };

    const handleRemoveElement = (index) => {
        setElements(prevElements => {
            const updatedElements = [...prevElements];
            updatedElements.splice(index, 1);
            return updatedElements;
        });
    };

    const handleImagesChange = (images) => {
        // Use the images as needed in the parent component (e.g., for uploading)
        setElementValue(images);
    };

    const handleVideoChange = (video) => {
        // Use the images as needed in the parent component (e.g., for uploading)
        setElementValue(video);
    };

    const handleElementImagesChange = (index, images) => {
        setElements(prevElements => {
            const updatedElements = [...prevElements];
            updatedElements[index].value = images;
            return updatedElements;
        });
    };

    const handleElementVideoChange = (index, video) => {
        setElements(prevElements => {
            const updatedElements = [...prevElements];
            updatedElements[index].value = video;
            return updatedElements;
        });
    };

    return (
        <div>
            {actionType == "edit" ?
                <>
                    <div>
                        {elements && elements.length > 0 && (
                            <>
                                {/* Input fields based on selected input type */}
                                {elements.map((element, index) => (
                                    <Card className='mb-3'>
                                        <Card.Body className='p-4'>
                                            <Card className={`${elements.length > 1 ? "mb-3" : ""}`}>
                                                <Card.Body className="bg-lgray">
                                                    <Row key={index}>
                                                        <Col lg={11}>
                                                            <Form.Group className='mb-3 mt-2'>
                                                                <Form.Label>{element.type}</Form.Label>
                                                                {element.type === 'YouTube Embed Link' || element.type === 'Vimeo Embed Link' ? (
                                                                    <Form.Control type='text' value={element.value} onChange={(e) => handleInputChange(index, e.target.value)} placeholder='' />
                                                                ) : element.type === 'Paragraph' ? (
                                                                    <Form.Control rows={5} as="textarea" value={element.value} onChange={(e) => handleInputChange(index, e.target.value)} placeholder='' />
                                                                ) : element.type === 'Heading' ? (
                                                                    <Form.Control type="text" value={element.value} onChange={(e) => handleInputChange(index, e.target.value)} placeholder='' />
                                                                ) : element.type === 'Image' ? (
                                                                    <ImageUploader type="product" images={element.value} onImagesChange={(e) => { handleElementImagesChange(index, e); }} size={size} />
                                                                ) : element.type === 'Video' ? (
                                                                    <VideoUploader type="product" videoLink={element.value} onVideoChange={(e) => { handleElementVideoChange(index, e); }} />
                                                                ) : null}
                                                            </Form.Group>
                                                        </Col>
                                                        <Col lg={1}>
                                                            {element.type != "Line Break" ?
                                                                <div className="kouture-tooltip mt-5">
                                                                    <div className="action-button bg-danger me-2" onClick={() => handleRemoveElement(index)}>
                                                                        <GoX className="text-white" />
                                                                    </div>
                                                                    <div className="kouture-tooltiptext">
                                                                        Remove
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className="kouture-tooltip">
                                                                    <div className="action-button bg-danger me-2" onClick={() => handleRemoveElement(index)}>
                                                                        <GoX className="text-white" />
                                                                    </div>
                                                                    <div className="kouture-tooltiptext">
                                                                        Remove
                                                                    </div>
                                                                </div>
                                                            }

                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Card.Body>
                                    </Card>
                                ))}

                            </>
                        )}

                        <div className="text-right">
                            {/* Done button */}
                            <button className='btn-primary mt-2' type="button" onClick={handleDone} style={{ minWidth: '100px', padding: '9px 20px' }}>Save</button>
                        </div>
                    </div>
                </>
                :
                <>
                    {/* Form for inputting element name and type */}
                    <Card className='mb-3'>
                        <Card.Body className='p-4'>
                            <Card>
                                <Card.Body className='bg-lgray'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label htmlFor="elementType">Type</Form.Label>
                                        <Form.Control id="elementType" as='select' name='element_type' value={elementType} onChange={(e) => setElementType(e.target.value)} required>
                                            <option value="">Select Element Type</option>
                                            <option value="Heading">Heading</option>
                                            <option value="Paragraph">Pargraph</option>
                                            <option value="Image">Image</option>
                                            <option value="Video">Video Upload</option>
                                            <option value="YouTube Embed Link">YouTube Embed</option>
                                            <option value="Vimeo Embed Link">Vimeo Embed</option>
                                            <option value="Line Break">Line Break</option>
                                        </Form.Control>
                                    </Form.Group>
                                    {elementType && elementType != "" ?
                                        <Form.Group className='mb-3 mt-2'>
                                            {elementType != "Line Break" && (
                                                <Form.Label htmlFor="elementValue">{elementType}</Form.Label>
                                            )}
                                            {elementType == "Paragraph" ?
                                                <Form.Control id="elementValue" as="textarea" rows={5} name='element_name' value={elementValue} onChange={(e) => setElementValue(e.target.value)} required placeholder='' />
                                                : elementType == "Heading" ?
                                                    <Form.Control id="elementValue" type='text' name='element_name' value={elementValue} onChange={(e) => setElementValue(e.target.value)} required placeholder='' />
                                                    : elementType == "Image" ?
                                                        <ImageDragAndDrop type="product" onImagesChange={(e) => { handleImagesChange(e); }} size={size} />
                                                        : elementType === 'YouTube Embed Link' || elementType === 'Vimeo Embed Link' ?
                                                            <Form.Control id="elementValue" type='text' name='element_name' value={elementValue} onChange={(e) => setElementValue(e.target.value)} required placeholder='' />
                                                            : elementType === 'Video' ?
                                                                <VideoDragAndDrop type="product" onVideoChange={(e) => { handleVideoChange(e); }} />
                                                                :
                                                                null
                                            }
                                        </Form.Group>
                                        :
                                        null
                                    }
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    </Card>
                    <div className="text-right">
                        {/* Add button */}
                        {elementType == "Line Break" ?
                            <Button className='btn-primary mt-2 btn-style' type="button" onClick={handleAddElement}>Add</Button>
                            :
                            <Button className='btn-primary mt-2 btn-style' type="button" onClick={handleAddElement} disabled={!elementType || !elementValue} >Add</Button>
                        }
                    </div>
                </>

            }

        </div>
    );
};

export default DetailBuilder;