import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import 'Assets/styles/User/EditProfile/style.css'
import PinIcon from 'Assets/images/pin.png';
import UserPlaceholder from 'Assets/images/user.png';
import getUserData from 'Utils/GetUserData';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import GoBack from 'Components/Shared/GoBack';

const initialUserData = Object.freeze({
    is_designer: 0,
    is_tailor: 0,
    is_seller: 0,
    email: '',
    short_bio: '',
    long_bio: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    website: '',
    phone_number: '',
    secondary_email_address: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedIn: '',
    pinterest: '',
    areas_of_specialization: [{name: '', year_from: '', year_to: ''}]
});

const EditProfile = () => {
    const [user, setUser] = useState(initialUserData);
    const [profileFormData, setProfileFormData] = useState(initialUserData);
    const [reloadCount, setReloadCount] = useState(0);
    const [profileShow, setProfileShow] = useState(true);
    const [addressShow, setAddressShow] = useState(false);
    const [contactShow, setContactShow] = useState(false);
    const [socialMediaShow, setSocialMediaShow] = useState(false);
    const [skillShow, setSkillShow] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);

    const [areaOfSpecialization, setAreaOfSpecialization] = useState(initialUserData.areas_of_specialization);

    const currentUser = cookies.currentUser;

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 2025 - 1900 }, (_, i) => 1900 + i);

    const showTab = (tab) => {
        if (tab == "profile") {
            setProfileShow(true);
            setAddressShow(false);
            setContactShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
        } else if (tab === "address") {
            setAddressShow(true);
            setProfileShow(false);
            setContactShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
        } else if (tab === "contact") {
            setContactShow(true);
            setAddressShow(false);
            setProfileShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
        } else if (tab === "social_media") {
            setSocialMediaShow(true);
            setAddressShow(false);
            setProfileShow(false);
            setContactShow(false);
            setSkillShow(false);
        } else if (tab === "skill") {
            setSkillShow(true);
            setSocialMediaShow(false);
            setAddressShow(false);
            setProfileShow(false);
            setContactShow(false);
        }
    }

    const handleChange = (e) => {
        setProfileFormData({
            ...profileFormData,
            [e.target.name]: e.target.value,
        })
    };

    const addMoreAos = (e) => {
        const newAos = {name: '', year_from: '', year_to: ''};
        setAreaOfSpecialization((prevAos) => [...prevAos, newAos]);
    };

    const handleChangeAos = (e, index) => {
        const { name, value } = e.target;

        setAreaOfSpecialization((prevAos) =>
            prevAos.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    const handleChangeDob = (e) => {
        setProfileFormData({
            ...profileFormData,
            date_of_birth: {
                ...profileFormData.date_of_birth,
                [e.target.name]: e.target.value,
            },
        });
    };

    const handleRemove = (index) => {
        setAreaOfSpecialization((prevAos) => prevAos.filter((item, i) => i !== index));
    };

    const fetchData = async (e) => {
        try {
            const userData = await getUserData(e);
            if (userData.id) {
                setUser(userData);
            } else {
                toast.error('User does not exist!');
            }
            // Update state or perform other logic with userData
        } catch (error) {
            toast.error('User does not exist!');
            // Handle the error, if needed
        }
    };

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <Layout>
            <section id='profile' className='py-5 px-2'>
                <Container>
                    <Row>
                        <Col lg="12" className='mb-3'>
                            <div className='d-flex column-gap-20 justify-content-between'>
                                <div className="d-flex column-gap-20">
                                    <div>
                                        <img src={UserPlaceholder} className='user-placeholder' />
                                    </div>
                                    <div>
                                        <h2 className='fs-20 mb-2'>Allen Bryle De Sagun</h2>
                                        <div className='icons-d-flex'>
                                            <img src={PinIcon} />
                                            <p className='fs-16 color-light-blue'>Subic, Agoncillo, Batangas</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <GoBack fallBack="/user/profile" />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Form>
                        <Row className='d-flex'>
                            <Col md="3" className='flex-grow-1 flex-shrink-0'>
                                <Card className='h-100'>
                                    <Card.Body>
                                        <p className={`text-black cursor-pointer me-5 mb-3 fs-16 ${profileShow ? 'fw-600' : ''}`} onClick={function () { showTab("profile"); }}>About</p>
                                        <p className={`text-black cursor-pointer me-5 mb-3 fs-16 ${addressShow ? 'fw-600' : ''}`} onClick={function () { showTab("address"); }}>Address</p>
                                        <p className={`text-black cursor-pointer me-5 mb-3 fs-16 ${contactShow ? 'fw-600' : ''}`} onClick={function () { showTab("contact") }}>Contact</p>
                                        <p className={`text-black cursor-pointer me-5 mb-3 fs-16 ${socialMediaShow ? 'fw-600' : ''}`} onClick={function () { showTab("social_media") }}>Social Media</p>
                                        <p className={`text-black cursor-pointer me-5 mb-0 fs-16 ${skillShow ? 'fw-600' : ''}`} onClick={function () { showTab("skill"); }}>Skills</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md="9" className='flex-grow-1 flex-shrink-0'>
                                <Card className='h-100'>
                                    <Card.Body>
                                        {profileShow ?
                                            <div className="edit-profile mt-3">
                                                <Row>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-3'>
                                                            <Form.Label>First Name</Form.Label>
                                                            <FormControl type='text' name='first_name' value={profileFormData.first_name} className='mr-sm-2' onChange={handleChange} required />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-3'>
                                                            <Form.Label>Last Name</Form.Label>
                                                            <FormControl type='text' name='last_name' value={profileFormData.last_name} className='mr-sm-2' onChange={handleChange} required />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-3'>
                                                            <Form.Label>Date of Birth</Form.Label>
                                                            <FormControl type='date' name='date_of_birth' value={profileFormData.date_of_birth} className='mr-sm-2' onChange={handleChange} required />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg="3">
                                                        <Form.Label>Gender</Form.Label>
                                                        <Row>
                                                            <Form.Group as={Col}>
                                                                <Form.Check
                                                                    className="cursor-pointer"
                                                                    type="radio"
                                                                    label="Male"
                                                                    name="gender"
                                                                    value="Male"
                                                                    checked={profileFormData.gender === 'Male'}
                                                                    onChange={handleChange}
                                                                />
                                                            </Form.Group>
                                                            <Form.Group as={Col}>
                                                                <Form.Check
                                                                    className="cursor-pointer"
                                                                    type="radio"
                                                                    label="Female"
                                                                    name="gender"
                                                                    value="Female"
                                                                    checked={profileFormData.gender === 'Female'}
                                                                    onChange={handleChange}
                                                                />
                                                            </Form.Group>
                                                        </Row>
                                                    </Col>

                                                </Row>
                                                <Row>
                                                    <Col lg="12">
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Short Bio <span className='text-gray'>(title)</span></Form.Label>
                                                            <FormControl type='text' name='short_bio' value={profileFormData.short_bio} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-3'>
                                                            <Form.Label>Long Bio <span className='text-gray'>(profile overview)</span></Form.Label>
                                                            <FormControl as="textarea"
                                                                name="long_bio"
                                                                rows={5} // You can adjust the number of rows as needed
                                                                value={profileFormData.long_bio}
                                                                placeholder=''
                                                                onChange={handleChange} required />
                                                        </Form.Group>
                                                        <div className="text-right mt-4 mb-5">
                                                            <Button type='submit' className="btn-save">Save</Button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            :
                                            null
                                        }
                                        {addressShow ?
                                            <div className='edit-address mt-3'>
                                                <Col lg="12">
                                                    <Form.Group className='mb-4'>
                                                        <Form.Label>Address Line 1</Form.Label>
                                                        <FormControl type='text' name='address_line_1' value={profileFormData.address_line_1} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                    </Form.Group>
                                                    <Form.Group className='mb-4'>
                                                        <Form.Label>Address Line 2</Form.Label>
                                                        <FormControl type='text' name='address_line_2' value={profileFormData.address_line_2} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                    </Form.Group>
                                                </Col>
                                                <Row>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>City</Form.Label>
                                                            <FormControl type='text' name='city' value={profileFormData.city} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>State/Region</Form.Label>
                                                            <FormControl type='text' name='province' value={profileFormData.province} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Postal Code</Form.Label>
                                                            <FormControl type='number' name='postal_code' value={profileFormData.postal_code} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Country</Form.Label>
                                                            <FormControl type='text' name='country' value={profileFormData.country} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                        </Form.Group>
                                                    </Col>
                                                    <div className="text-right mt-4 mb-5">
                                                        <Button type='submit' className="btn-save">Save</Button>
                                                    </div>
                                                </Row>
                                            </div>
                                            :
                                            null
                                        }
                                        {contactShow ?
                                            <div className="edit-contact mt-3">
                                                <Col lg="12">
                                                    <Form.Group className='mb-4'>
                                                        <Form.Label>Website</Form.Label>
                                                        <FormControl type='text' name='website' value={profileFormData.website} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                    </Form.Group>
                                                </Col>
                                                <Row>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Phone Number</Form.Label>
                                                            <FormControl type='number' name='phone_number' value={profileFormData.phone_number} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg="6">
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Secondary Email</Form.Label>
                                                            <FormControl type='email' name='secondary_email_address' value={profileFormData.secondary_email_address} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <div className="text-right mt-4 mb-5">
                                                    <Button type='submit' className="btn-save">Save</Button>
                                                </div>
                                            </div>
                                            :
                                            null
                                        }

                                        {socialMediaShow ?
                                            <div className="edit-social-media mt-3">
                                                <Col lg="12">
                                                    <Form.Group className='mb-4'>
                                                        <Form.Label>Facebook</Form.Label>
                                                        <FormControl type='text' name='facebook' value={profileFormData.facebook} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                    </Form.Group>
                                                    <Form.Group className='mb-4'>
                                                        <Form.Label>Twitter</Form.Label>
                                                        <FormControl type='text' name='twitter' value={profileFormData.twitter} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                    </Form.Group>
                                                    <Form.Group className='mb-4'>
                                                        <Form.Label>Instagram</Form.Label>
                                                        <FormControl type='text' name='instagram' value={profileFormData.instagram} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                    </Form.Group>
                                                    <Form.Group className='mb-4'>
                                                        <Form.Label>LinkedIn</Form.Label>
                                                        <FormControl type='text' name='linkedIn' value={profileFormData.linkedIn} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                    </Form.Group>
                                                    <div className="text-right mt-4 mb-5">
                                                        <Button type='submit' className="btn-save">Save</Button>
                                                    </div>
                                                </Col>
                                            </div>
                                            :
                                            null
                                        }
                                        {skillShow ?
                                            <div className="edit-skills mt-3">
                                                <p>Areas of Specialization and Expertise</p>
                                                <Card>
                                                    <Card.Body>
                                                        {areaOfSpecialization && areaOfSpecialization.length > 0 ?
                                                            <>
                                                                {areaOfSpecialization.map((item, index) => (
                                                                    <Row>
                                                                        <Col lg="6">
                                                                            <Form.Group className='mb-4'>
                                                                                <Form.Label>Specify your areas of expertise</Form.Label>
                                                                                <FormControl type='text' name='name' value={item.name} className='mr-sm-2' onChange={(e) => handleChangeAos(e, index)} required placeholder='' />
                                                                            </Form.Group>
                                                                        </Col>
                                                                        <Col lg="3">
                                                                            <Form.Group className='mb-4'>
                                                                                <Form.Label>Year</Form.Label>
                                                                                <FormControl as='select' name='year_from' value={item.year_from} className='mr-sm-2' onChange={(e) => handleChangeAos(e, index)} required>
                                                                                    <option value="">Year</option>
                                                                                    {years.map((year) => (
                                                                                        <option key={year} value={year}>
                                                                                            {year}
                                                                                        </option>
                                                                                    ))}
                                                                                </FormControl>
                                                                            </Form.Group>
                                                                        </Col>
                                                                        <Col lg="3">
                                                                            <Form.Group className='mb-4'>
                                                                                <Form.Label className='year'>Year</Form.Label>
                                                                                <FormControl as='select' name='year_to' value={item.year_to} className='mr-sm-2' onChange={(e) => handleChangeAos(e, index)} required>
                                                                                    <option value="">Year</option>
                                                                                    {years.map((year) => (
                                                                                        <option key={year} value={year}>
                                                                                            {year}
                                                                                        </option>
                                                                                    ))}
                                                                                </FormControl>
                                                                            </Form.Group>
                                                                        </Col>
                                                                        {areaOfSpecialization.length > 1 ?
                                                                            <Col lg="12">
                                                                                <p className="cursor-pointer" onClick={() => {handleRemove(index); }}>Remove</p>
                                                                            </Col>
                                                                            :
                                                                            null
                                                                        }
                                                                    </Row>
                                                                ))}
                                                            </>
                                                            :
                                                            null
                                                        
                                                        }
                                                    </Card.Body>
                                                </Card>
                                                <div className='mt-4'>
                                                    <p className="cursor-pointer" onClick={addMoreAos}>+ <span className='add_more text-gray'>Add more</span></p>
                                                </div>
                                                <div className="text-right mt-4 mb-5">
                                                    <Button type='submit' className="btn-save">Save</Button>
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </section>
        </Layout>
    );
};

export default EditProfile;