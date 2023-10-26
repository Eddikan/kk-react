import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, CardHeader, CardFooter, Container, Row, Col, Modal, ModalBody, ModalHeader, Input, Label} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import 'Assets/styles/Customer/style.css';

const initialNewCustomerData = Object.freeze({
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    company_name: '',
    position: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    zip: '',
    country: ''
})

const CustomerPage = () => {
    const [newCustomerFormData, setNewCustomerFormData] = useState(initialNewCustomerData);
    const isSuccess = 'success';
    const isWarning = 'warning';
    const isError = 'error';
    const [formStatus, setFormStatus] = useState('standby');
    const [reloadCount, setReloadCount] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);


    const submitCustomer = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'customer', data);
    }

    const handleChangeNewCustomer = (e) => {
        setNewCustomerFormData({
          ...newCustomerFormData,
          [e.target.name]: e.target.value
        });
    }

    const submitNewCustomer = () => {
        setFormStatus('loading');
        const toSubmit = {
            ...newCustomerFormData
        };
        submitCustomer(toSubmit).then((response) => {
            console.log(response);
            const status = response.data.status;
            setFormStatus('standby');
            if (status === 'Success') {
                const message = 'Customer added successfully!';
                toastAlert(isSuccess, message);
                setReloadCount(reloadCount + 1);
                resetAddFormData();
            } else {
                const message = 'Error adding customer!';
                toastAlert(isWarning, message);
                resetAddFormData();
            }
        }).catch(() => {
            setFormStatus('standby');
            const message = 'There has been an error with the server, please try again later!';
            toastAlert(isError, message);
            resetAddFormData();
        });
    }

    const resetAddFormData = (missingInput) => {
        if (!missingInput) {
            setNewCustomerFormData(initialNewCustomerData);
            setShowAddModal(!showAddModal);
        }
        setFormStatus('standby');
    }

    const toastAlert = (type, message) => {
        if (type === isError) {
            toast.error(message, {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else if (type === isWarning) {
            toast.warning(message, {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.success(message, {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    return (<>
        <ToastContainer style={{ width: '370px' }} />
        <section>
            <Container>
                <Row>
                    <Col lg="6">
                        <Label>First Name</Label>
                        <Input type='text' className='mb-3' name='first_name' value={newCustomerFormData.first_name} onChange={handleChangeNewCustomer} />
                    </Col>
                    <Col lg="6">
                        <Label>Last Name</Label>
                        <Input type='text' className='mb-3' name='last_name' value={newCustomerFormData.last_name} onChange={handleChangeNewCustomer} />
                    </Col>
                    <Col lg="6">
                        <Label>Email</Label>
                        <Input type='text' className='mb-3' name='email' value={newCustomerFormData.email} onChange={handleChangeNewCustomer} />
                    </Col>
                    <Col lg="6">
                        <Label>Contact Number</Label>
                        <Input type='text' className='mb-3' name='contact_number' value={newCustomerFormData.contact_number} onChange={handleChangeNewCustomer} />
                    </Col>
                    <Col lg="6">
                        <Label>Company Name</Label>
                        <Input type='text' className='mb-3' name='company_name' value={newCustomerFormData.company_name} onChange={handleChangeNewCustomer} />
                    </Col>
                    <Col lg="6">
                        <Label>Position</Label>
                        <Input type='text' className='mb-3' name='position' value={newCustomerFormData.position} onChange={handleChangeNewCustomer} />
                    </Col>
                    <Col lg="6">
                        <Label>Address Line 1</Label>
                        <Input type='text' className='mb-3' name='address_line_1' value={newCustomerFormData.address_line_1} onChange={handleChangeNewCustomer} />
                    </Col>
                    <Col lg="6">
                        <Label>Address Line 2</Label>
                        <Input type='text' className='mb-3' name='address_line_2' value={newCustomerFormData.address_line_2} onChange={handleChangeNewCustomer} />
                    </Col>
                    <Col lg="6">
                        <Label>City</Label>
                        <Input type='text' className='mb-3' name='city' value={newCustomerFormData.city} onChange={handleChangeNewCustomer} />
                    </Col>
                    <Col lg="6">
                        <Label>Province</Label>
                        <Input type='text' className='mb-3' name='province' value={newCustomerFormData.province} onChange={handleChangeNewCustomer} />
                    </Col>
                    <Col lg="6">
                        <Label>Zip</Label>
                        <Input type='text' className='mb-3' name='zip' value={newCustomerFormData.zip} onChange={handleChangeNewCustomer} />
                    </Col>

                    <Col lg="6">
                        <Label>Country</Label>
                        <Input type='text' className='mb-3' name='country' value={newCustomerFormData.country} onChange={handleChangeNewCustomer} />
                    </Col>
                    {formStatus !== 'standby' ?
                        <button className='action-btn'>SUBMITTING...</button> :
                        <button className='action-btn' onClick={submitNewCustomer}>SUBMIT</button>
                    }
                </Row>
            </Container>
        </section>
    </>
    );
}

export default CustomerPage;