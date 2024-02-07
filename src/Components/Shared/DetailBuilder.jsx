import React, { useState } from 'react';
import { Button, Row, Col, Card, Form } from 'react-bootstrap';
import { GoX } from 'react-icons/go';
import ImageDragAndDrop from './ImageDragAndDrop';

const DetailBuilder = (props) => {
    const elementProps = props.elements;
    const size = props.size;

    const [elements, setElements] = useState(elementProps ?? []);
    const [addElementShow, setAddElementShow] = useState(false);
    const [elementType, setElementType] = useState(null);
    const [elementValue, setElementValue] = useState(null);

    const handleAddElement = () => {
        if (elementType && elementType !== '' && elementValue !== '') {
            let type;
            if (elementType === 'YouTube Embed Link' || elementType === 'Vimeo  Embed Link') {
                type = 'embed';
            } else if (elementType === 'Text') {
                type = 'text';
            } else if (elementType === "Image") {
                type = 'image';
            } else if (elementType === "Video") {
                type = 'video';
            }
            
            setElements(prevElements => [...prevElements, { type, value: elementValue }]);
            // Reset input fields
            setElementType('');
            setElementValue('');
            setAddElementShow(false);
        }
    };

    const handleDone = () => {
        if (elementType && elementType !== '' && elementValue !== '') {
            let type;
            if (elementType === 'YouTube Embed Link' || elementType === 'Vimeo  Embed Link') {
                type = 'embed';
            } else if (elementType === 'Text') {
                type = 'text';
            } else if (elementType === "Image") {
                type = 'image';
            } else if (elementType === "Video") {
                type = 'video';
            }
            
            setElements(prevElements => [...prevElements, { type, value: elementValue }]);
            // Reset input fields
            setElementType('');
            setElementValue('');
            setAddElementShow(false);
            props.addElement([...elements, { type, value: elementValue }]);
            props.closeModal(true);
        }
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

    const handleElementImagesChange = (index, images) => {
        setElements(prevElements => {
            const updatedElements = [...prevElements];
            updatedElements[index].value = images;
            return updatedElements;
        });
    };

    return (
        <div>
            {/* Form for inputting element name and type */}
            <Form.Group className='mb-3'>
                <Form.Label htmlFor="elementType">Type</Form.Label>
                <Form.Control id="elementType" as='select' name='element_type' value={elementType} onChange={(e) => setElementType(e.target.value)} required>
                    <option value="">Select Element Type</option>
                    <option value="Text">Text</option>
                    <option value="Image">Image</option>
                    <option value="Video">Video</option>
                    <option value="YouTube Embed Link">YouTube Embed</option>
                    <option value="Vimeo  Embed Link">Vimeo Embed</option>
                </Form.Control>
            </Form.Group>
            {elementType && elementType != "" ?
                <Form.Group className='mb-3 mt-2'>
                    <Form.Label htmlFor="elementValue">{elementType}</Form.Label>
                    {elementType == "Text" ?
                        <Form.Control id="elementValue" type='text' name='element_name' value={elementValue} onChange={(e) => setElementValue(e.target.value)} required placeholder='' />
                        : elementType == "Image" ?
                        <ImageDragAndDrop type="product" onImagesChange={(e) => { handleImagesChange(e); } } size={size} />
                        :
                        <Form.Control id="elementValue" type='text' name='element_name' value={elementValue} onChange={(e) => setElementValue(e.target.value)} required placeholder='' />
                    }
                    
                </Form.Group>
                :
                null
            }
            <div className="text-right">
                {/* Add button */}
                <Button className='btn-primary mt-3' type="button" onClick={handleAddElement} disabled={!elementType || !elementValue}>Add</Button>
            </div>
            {size == "large" || size == "normal" ?
                <div>
                    {elements && elements.length > 0 && (
                        <>
                            <Form.Label><strong>Elements</strong></Form.Label>
                            <Card>
                                <Card.Body className="bg-lgray">
                                    <>
                                        {/* Input fields based on selected input type */}
                                        {elements.map((element, index) => (
                                            <Row key={index}>
                                                <Col lg={11}>
                                                    <Form.Group className='mb-3 mt-2'>
                                                        <Form.Label>{element.name}</Form.Label>
                                                        {element.type === 'embed' ? (
                                                            <Form.Control type='text' value={element.value} onChange={(e) => handleInputChange(index, e.target.value)} placeholder='' />
                                                        ) : element.type === 'text' ? (
                                                            <Form.Control rows={3} as="textarea" value={element.value} onChange={(e) => handleInputChange(index, e.target.value)} placeholder='' />
                                                        ) : element.type === 'image' ? (
                                                            <ImageDragAndDrop type="product" images={element.value} onImagesChange={(e) => { handleElementImagesChange(index, e); } } size={size} />
                                                            ) : (
                                                            <input
                                                                type="file"
                                                                onChange={(e) => handleFileChange(index, e.target.files)}
                                                                accept="video/*"
                                                            />
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                                <Col lg={1}>
                                                    <div class="kouture-tooltip mt-5">
                                                        <div className="action-button bg-danger me-2"  onClick={() => handleRemoveElement(index)}>
                                                            <GoX className="text-white" />
                                                        </div>
                                                        <div class="kouture-tooltiptext">
                                                            Remove
                                                        </div>
                                                    </div>
                                                </Col>

                                            </Row>
                                        ))}
                                    </>
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </div>
                :
                null
            }
            <div className="text-right">
                {/* Add button */}
                <Button className='btn-primary mt-3' type="button" onClick={handleDone}>Done</Button>
            </div>
        </div>
    );
};

export default DetailBuilder;