import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, CardHeader, CardFooter, Container, Row, Col, Modal, ModalBody, ModalHeader, Input, Label, Table} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import 'Assets/styles/Customer/style.css';
import { BsThreeDotsVertical, BsTrash } from 'react-icons/bs';
import { FaPencilAlt } from 'react-icons/fa';

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

const initialEditCustomerData = Object.freeze({
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
    const isSuccess = 'success';
    const isWarning = 'warning';
    const isError = 'error';
    const [customers, setCustomers] = useState([]);
    const [customersLoading, setCustomersLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(1);
    const [formStatus, setFormStatus] = useState('standby');
    const [newCustomerFormData, setNewCustomerFormData] = useState(initialNewCustomerData);
    const [editCustomerFormData, setEditCustomerFormData] = useState(initialEditCustomerData);
    const [selectedCustomer, setSelectedCustomer] = useState();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // API CALL FOR GET ALL (START)
    const getCustomers = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'customer');
    }
    // API CALL FOR GET ALL (END)

    // API CALL FOR POST (START)
    const submitCustomer = async (data) => {
        return await axios.post(process.env.REACT_APP_API_ENDPOINT + 'customer', data);
    }
    // API CALL FOR POST (END)

    // API CALL FOR UPDATE (START)
    const updateCustomer = async (data) => {
        return await axios.put(process.env.REACT_APP_API_ENDPOINT + 'customer/' + data.id, data);
    }
    // API CALL FOR UPDATE (END)

    // API CALL FOR DELETE (START)
    const deleteCustomer = async () => {
        return await axios.delete(process.env.REACT_APP_API_ENDPOINT + 'customer/' + selectedCustomer);
    }
    // API CALL FOR DELETE (END)

    // FUNCTION FOR GET (START)
    const getCustomersToState = () => {
        setCustomersLoading(true);
        getCustomers().then(response => {
            const result = response.data.data;
            if (result) {
                setCustomers(result);
                console.log('customers',result);
                setCustomersLoading(false);
            }
        }).catch((error) => {
            console.log(error);
            setCustomersLoading(false);
            const message = 'There has been an error getting customers, please try again later!';
            toastAlert('error', message);
        });
    }
    // FUNCTION FOR GET (END)

    // FUNCTION FOR POST (START)
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
    // FUNCTION FOR POST (END)

    // FUNCTION FOR UPDATE (START)
    const submitChanges = () => {
        setFormStatus('loading');
        const toSubmit = {
            ...editCustomerFormData
        };
        updateCustomer(toSubmit).then((response) => {
            const status = response.data.status;
            setFormStatus('standby');
            if (status === 'Success') {
                const message = 'Customer updated successfully!';
                toastAlert(isSuccess, message);
                setShowEditModal(!showEditModal);
                setReloadCount(reloadCount + 1);
            } else {
                const message = 'Error updating customer!';
                toastAlert(isWarning, message);
                setShowEditModal(!showEditModal);
            }
        }).catch((error) => {
            console.log(error);
            setFormStatus('standby');
            const message = 'There has been an error with the server, please try again later!';
            toastAlert(isError, message);
            setShowEditModal(!showEditModal);
        });
    }
    
    const handleChange = (e) => {
        setEditCustomerFormData({
            ...editCustomerFormData,
            [e.target.name]: e.target.value
        });
    }
    // FUNCTION FOR UPDATE (END)

    // FUNCTION FOR DELETE (START)
    const promptDelete = () => {
        setFormStatus('loading');
        deleteCustomer().then((response) => {
            const status = response.data.status;
            setFormStatus('standby');
            if (status === 'Success') {
                const message = 'Customer deleted successfully!';
                toastAlert(isSuccess, message);
                setShowDeleteModal(false);
                setReloadCount(reloadCount + 1);
            }
        }).catch(() => {
            setFormStatus('standby');
            const message = 'There has been an error with the server, please try again later!';
            toastAlert(isError, message);
        });
    }
    // FUNCTION FOR DELETE (END)

    // FUNCTION FOR TOAST (START)
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
    // FUNCTION FOR TOAST (END)

    // FOR MODALS (START)
    const handleClose = () => {
        setShowEditModal(false);
        setShowAddModal(false);
        setShowDeleteModal(false);
    }

    const toggleAddCustomerModal = () => {
        setShowAddModal(!showAddModal);
    }

    const toggleEditModal = (index) => {
        setEditCustomerFormData({
          ...customers[index]
        });
        setShowEditModal(!showEditModal);
    }

    const toggleDeleteModal = (id) => {
        setSelectedCustomer(id);
        setShowDeleteModal(!showDeleteModal);
    }
    // FOR MODALS (END)

    useEffect(() => {
        getCustomersToState();
    }, [reloadCount]);
    return (<>
        <ToastContainer style={{ width: '370px' }} />
        <Container>
            <Row>
                <Col lg='12'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className='cursor-pointer' onClick={() => toggleAddCustomerModal()} style={{ display: 'flex', alignItems: 'center' }}>
                            ADD CUSTOMER
                        </span>
                    </div>
                    {customers && customers.length > 0 ? 
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                        First Name
                                    </th>
                                    <th>
                                        Last Name
                                    </th>
                                    <th>
                                        Company Name
                                    </th>
                                    <th>
                                        Country
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map(({ id, first_name, last_name, email, contact_number, company_name, position, address_line_1, address_line_2, city, province, zip, country }, index) => (
                                    <tr>
                                        <td>
                                            {first_name}
                                        </td>
                                        <td>
                                            {last_name}
                                        </td>
                                        <td>
                                            {company_name}
                                        </td>
                                        <td>
                                            {country}
                                        </td>
                                        <td>
                                            <div className="action_table">
                                                <BsThreeDotsVertical />
                                                    <Card className="action_content">
                                                        <CardBody className="action_container">
                                                            <div className="link_container" onClick={() => toggleEditModal(index)}>
                                                                <FaPencilAlt /><a>EDIT</a>
                                                            </div>
                                                            <hr />
                                                            <div className="link_container d-flex justify-content-between" onClick={() => toggleDeleteModal(id)}>
                                                                <BsTrash /> <a>DELETE</a>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    :
                    null
                    }
                </Col>
            </Row>
            <Modal isOpen={showAddModal} className='modal-preview' fade={false} centered id='edit-judge-modal'>
                <ModalHeader className='text-uppercase text-left'>
                    ADD CUSTOMER
                    <button type='button' className='close react-modal-close' data-dismiss='modal' aria-label='Close'
                    onClick={handleClose}>
                    <span aria-hidden='true'>&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
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
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            <Modal isOpen={showEditModal} className='modal-preview' fade={false} centered id='edit-judge-modal'>
                <ModalHeader className='text-uppercase text-left'>
                    EDIT CUSTOMER
                    <button type='button' className='close react-modal-close' data-dismiss='modal' aria-label='Close'
                    onClick={handleClose}>
                    <span aria-hidden='true'>&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col lg="6">
                                            <Label>First Name</Label>
                                            <Input type='text' className='mb-3' name='first_name' value={editCustomerFormData.first_name} onChange={handleChange} />
                                        </Col>
                                        <Col lg="6">
                                            <Label>Last Name</Label>
                                            <Input type='text' className='mb-3' name='last_name' value={editCustomerFormData.last_name} onChange={handleChange} />
                                        </Col>
                                        <Col lg="6">
                                            <Label>Email</Label>
                                            <Input type='text' className='mb-3' name='email' value={editCustomerFormData.email} onChange={handleChange} />
                                        </Col>
                                        <Col lg="6">
                                            <Label>Contact Number</Label>
                                            <Input type='text' className='mb-3' name='contact_number' value={editCustomerFormData.contact_number} onChange={handleChange} />
                                        </Col>
                                        <Col lg="6">
                                            <Label>Company Name</Label>
                                            <Input type='text' className='mb-3' name='company_name' value={editCustomerFormData.company_name} onChange={handleChange} />
                                        </Col>
                                        <Col lg="6">
                                            <Label>Position</Label>
                                            <Input type='text' className='mb-3' name='position' value={editCustomerFormData.position} onChange={handleChange} />
                                        </Col>
                                        <Col lg="6">
                                            <Label>Address Line 1</Label>
                                            <Input type='text' className='mb-3' name='address_line_1' value={editCustomerFormData.address_line_1} onChange={handleChange} />
                                        </Col>
                                        <Col lg="6">
                                            <Label>Address Line 2</Label>
                                            <Input type='text' className='mb-3' name='address_line_2' value={editCustomerFormData.address_line_2} onChange={handleChange} />
                                        </Col>
                                        <Col lg="6">
                                            <Label>City</Label>
                                            <Input type='text' className='mb-3' name='city' value={editCustomerFormData.city} onChange={handleChange} />
                                        </Col>
                                        <Col lg="6">
                                            <Label>Province</Label>
                                            <Input type='text' className='mb-3' name='province' value={editCustomerFormData.province} onChange={handleChange} />
                                        </Col>
                                        <Col lg="6">
                                            <Label>Zip</Label>
                                            <Input type='text' className='mb-3' name='zip' value={editCustomerFormData.zip} onChange={handleChange} />
                                        </Col>

                                        <Col lg="6">
                                            <Label>Country</Label>
                                            <Input type='text' className='mb-3' name='country' value={editCustomerFormData.country} onChange={handleChange} />
                                        </Col>
                                        {formStatus !== 'standby' ?
                                            <button className='action-btn'>SUBMITTING...</button> :
                                            <button className='action-btn' onClick={submitChanges}>SUBMIT</button>
                                        }
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            <Modal isOpen={showDeleteModal} className="modal-preview" fade={false} centered id="edit-judge-modal">
                <ModalHeader className="text-uppercase text-left">
                    Delete blurb?
                    <button type="button" className="close react-modal-close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody className="card_container">
                                    <h3 style={{ fontSize: 16 }}>Are you sure you want to delete this blurb?</h3>
                                </CardBody>
                                <CardFooter className="text-right">
                                    <button type="button" className="btn btn-main btn-main-alt mr-2" data-dismiss="modal" onClick={handleClose}>Close</button>
                                    {formStatus !== "standby" ?
                                    <button className="action-btn btn newbtntheme text-uppercase primary-btn">Deleting...</button>
                                    :
                                    <button className="action-btn btn newbtntheme text-uppercase primary-btn" onClick={promptDelete}>Delete</button>
                                    }
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Container>
    </>
    );
};

export default CustomerPage;