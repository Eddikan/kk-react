import React, { useState } from 'react';
import { Button, Row, Col, Card, Form } from 'react-bootstrap';
import { GoX } from 'react-icons/go';

const FormBuilder = (props) => {
    const elementProps = props.elements;

    const [elements, setElements] = useState(elementProps ?? []);
    const [addElementShow, setAddElementShow] = useState(false);
    const [elementType, setElementType] = useState('');
    const [elementName, setElementName] = useState('');

    const handleAddElement = () => {
        if (elementType && elementType !== '' && elementName !== '') {
            let type;
            if (elementType === 'youtube' || elementType === 'vimeo') {
                type = 'embed';
            } else {
                type = elementType;
            }
            setElements(prevElements => [...prevElements, { name: elementName, type, value: '' }]);
            // Reset input fields
            setElementType('');
            setElementName('');
            setAddElementShow(false);
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

    return (
        <div>
            {/* Form for inputting element name and type */}
            {addElementShow ?
                <>
                    <Form.Label><strong>Add Element</strong></Form.Label>
                        <Card className="mb-4">
                            <Card.Body className="bg-lgray">
                                <Form.Group className='mb-3 mt-2'>
                                    <Form.Label htmlFor="elementName">Element Name</Form.Label>
                                    <Form.Control id="elementName" type='text' name='element_name' value={elementName} onChange={(e) => setElementName(e.target.value)} required placeholder='' />
                                </Form.Group>
                                <Form.Group className='my-3'>
                                    <Form.Label htmlFor="elementType">Element Type</Form.Label>
                                    <Form.Control id="elementType" as='select' name='element_type' value={elementType} onChange={(e) => setElementType(e.target.value)} required>
                                        <option value="">Select Element Type</option>
                                        <option value="text">Description</option>
                                        <option value="image">Image</option>
                                        <option value="video">Video</option>
                                        <option value="youtube">YouTube Embed</option>
                                        <option value="vimeo">Vimeo Embed</option>
                                    </Form.Control>
                                </Form.Group>
                                <div className="text-right">
                                    {/* Add button */}
                                    <Button className='btn-primary' type="button" onClick={handleAddElement} disabled={!elementType || !elementName}>Add</Button>
                                </div>
                            </Card.Body>
                        </Card>
                </>
                :
                <Button className='btn-primary mb-4' type="button" onClick={() => setAddElementShow(true)}>Add Element</Button>
            }
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
                                                <div className="kouture-tooltip mt-5">
                                                    <div className="action-button bg-danger me-2"  onClick={() => handleRemoveElement(index)}>
                                                        <GoX className="text-white" />
                                                    </div>
                                                    <div className="kouture-tooltiptext">
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
            {/* Display formData */}
            <pre>{JSON.stringify(elements, null, 2)}</pre>
        </div>
    );
};

export default FormBuilder;
