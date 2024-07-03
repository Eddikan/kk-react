import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import LoadingPage from 'Components/Shared/LoadingPage';
import { TagsInput } from "react-tag-input-component";
import axios from 'axios';
import Countries from 'Utils/Countries';

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
    occupation: '',
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
    linkedin: '',
    pinterest: '',
    behance: '',
    youtube: '',
});

const initialDesignerData = Object.freeze({
    areas_of_specialization: [""],
});

const EditDesigner = () => {
    const { designerId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(initialUserData);
    const [designer, setDesigner] = useState()
    const [userLoading, setUserLoading] = useState(true);
    const [userFormData, setUserFormData] = useState(initialUserData);
    const [userFormLoading, setUserFormLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [designerShow, setDesignerShow] = useState(true);
    const [addressShow, setAddressShow] = useState(false);
    const [contactShow, setContactShow] = useState(false);
    const [socialMediaShow, setSocialMediaShow] = useState(false);
    const [skillShow, setSkillShow] = useState(false);
    const [userImage, setUserImage] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
    const [areasOfSpecializationData, setAreaOfSpecializationData] = useState(initialDesignerData.areas_of_specialization);

    const [areasOfSpecialization, setAreaOfSpecialization] = useState(initialDesignerData.areas_of_specialization);

    const currentUser = cookies.currentUser;
    const token = cookies.token;

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 2025 - 1900 }, (_, i) => 1900 + i);

    const showTab = (tab) => {
        if (tab == "user") {
            setDesignerShow(true);
            setAddressShow(false);
            setContactShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
        } else if (tab === "address") {
            setAddressShow(true);
            setDesignerShow(false);
            setContactShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
        } else if (tab === "contact") {
            setContactShow(true);
            setAddressShow(false);
            setDesignerShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
        } else if (tab === "social_media") {
            setSocialMediaShow(true);
            setAddressShow(false);
            setDesignerShow(false);
            setContactShow(false);
            setSkillShow(false);
        } else if (tab === "skill") {
            setSkillShow(true);
            setSocialMediaShow(false);
            setAddressShow(false);
            setDesignerShow(false);
            setContactShow(false);
        }
    }

    const handleChange = (e) => {
        setUserFormData({
            ...userFormData,
            [e.target.name]: e.target.value,
        })
    };

    async function submitProfile(e) {
        e.preventDefault();
        setUserFormLoading(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + designerId + '?user_id=' + designerId + '&token=' + token, userFormData).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                const user = data.user;
                const user_details = { designerId: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at }
                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                toast.success('Designer updated successfully!');
                setTimeout(() => {
                    setReloadCount(prevReloadCount => prevReloadCount + 1);
                    navigate('/admin/designers');
                }, 1000);
            } else {
                const errors = response.data.errors;
            }
            setUserFormLoading(false);
        }).catch((error) => {
            setUserFormLoading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    async function submitDesigner(e) {
        if (areasOfSpecializationData.length > 0) {
            e.preventDefault();
            setUserFormLoading(true);
            axios.put(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designer.id + '?user_id=' + designerId + '&token=' + token, { areas_of_specialization: areasOfSpecializationData }).then((response) => {
                const success = response.data.status;
                if (success == 'Success') {
                    const data = response.data.data;
                    const user = data.user;
                    toast.success('Designer updated successfully!');
                    setTimeout(() => {
                        setReloadCount(prevReloadCount => prevReloadCount + 1);
                        navigate('/admin/designers');
                    }, 1000);
                } else {
                    const errors = response.data.errors;
                }
                setUserFormLoading(false);
            }).catch((error) => {
                setUserFormLoading(false);
                toast.error('Something went wrong, please contact the administrator!');
            });
        } else {
            setUserFormLoading(false);
            toast.error('Please insert your specialization and experties!');
        }

    }

    const fetchData = async (e) => {
        try {
            const userData = await getUserData(e);
            if (userData.id) {
                setUser(userData);
                setUserFormData(userData);
                setUserImage(userData.image);
                setCookie('userDetails', JSON.stringify(userData), { path: '/' });
                setUserLoading(false);
                if (userData.designer) {
                    setDesigner(userData.designer);
                    setAreaOfSpecialization(userData.designer.areas_of_specialization);
                    setAreaOfSpecializationData(userData.designer.areas_of_specialization);
                }
            } else {
                setUserLoading(false);
                toast.error('An error occured. Please try again or contact the administrator.');
            }
        } catch (error) {
            setUserLoading(false);
            toast.error('An error occured. Please try again or contact the administrator.');
        }
    };

    useEffect(() => {
        fetchData({ currentUser: designerId, token: token });
    }, [reloadCount]);

    return (
        <Layout>
            {userLoading ?
                <LoadingPage />
                :
                <section id='profile' className='py-5 px-2'>
                    <Container>
                        <Row>
                            <Col lg="12" className='mb-3'>
                                <div className='d-flex column-gap-20 justify-content-between'>
                                    <div className="d-flex column-gap-20">
                                        <div>
                                            {userImage ?
                                                <div className="profile-image-view" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'user/' + userImage + ")" }}></div>
                                                :
                                                <div className="profile-image-view" style={{ backgroundImage: "url(" + UserPlaceholder + ")" }}></div>
                                            }
                                        </div>
                                        <div>
                                            <h2 className='fs-20 mb-2'>
                                                {user.first_name || user.last_name ?
                                                    <span>{user.first_name} {user.last_name}</span>
                                                    :
                                                    <span>-</span>
                                                }
                                            </h2>
                                            <div className='icons-d-flex'>
                                                <img src={PinIcon} className='mt-1' />
                                                {user.city || user.province || user.country ?
                                                    <p className='fs-16 color-light-blue'>
                                                        {user.province ? user.province + ',' : user.city ? user.city + ','  : "" } {user.country ? user.country : ""}
                                                        {/* {user.city ? user.city + ',' : ""} {user.province ? user.province + "," : ""} {user.country ? user.country : ""} */}
                                                    </p>
                                                    :
                                                    <p className='fs-16 color-light-blue'>-</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <GoBack fallBack="/user/profile" />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Form onSubmit={submitProfile}>
                            <Row className='d-flex'>
                                <Col md="3" className='flex-grow-1 flex-shrink-0'>
                                    <Card className='h-100'>
                                        <Card.Body>
                                            <p className={`cursor-pointer me-5 mb-3 fs-16 ${designerShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("user"); }}>About</p>
                                            <p className={`cursor-pointer me-5 mb-3 fs-16 ${addressShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("address"); }}>Address</p>
                                            <p className={`cursor-pointer me-5 mb-3 fs-16 ${contactShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("contact") }}>Contact</p>
                                            <p className={`cursor-pointer me-5 mb-3 fs-16 ${socialMediaShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("social_media") }}>Social Media</p>
                                            {user && user.is_designer ?
                                                <p className={`cursor-pointer me-5 mb-0 fs-16 ${skillShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("skill"); }}>Skills</p>
                                                :
                                                null
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md="9" className='flex-grow-1 flex-shrink-0'>
                                    <Card className='h-100'>
                                        <Card.Body>
                                            {designerShow ?
                                                <div className="edit-profile mt-3">
                                                    <Row>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-3'>
                                                                <Form.Label>First Name</Form.Label>
                                                                <FormControl type='text' name='first_name' value={userFormData.first_name} className='mr-sm-2' onChange={handleChange} required />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-3'>
                                                                <Form.Label>Last Name</Form.Label>
                                                                <FormControl type='text' name='last_name' value={userFormData.last_name} className='mr-sm-2' onChange={handleChange} required />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-3'>
                                                                <Form.Label>Date of Birth</Form.Label>
                                                                <FormControl type='date' name='date_of_birth' value={userFormData.date_of_birth} className='mr-sm-2' onChange={handleChange} />
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
                                                                        checked={userFormData.gender === 'Male'}
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
                                                                        checked={userFormData.gender === 'Female'}
                                                                        onChange={handleChange}
                                                                    />
                                                                </Form.Group>
                                                            </Row>
                                                        </Col>

                                                    </Row>
                                                    <Row>
                                                        <Col lg="12">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>Occupation</Form.Label>
                                                                <FormControl type='text' name='occupation' value={userFormData.occupation} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                            </Form.Group>
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>Short Bio <span className='text-gray'>(title)</span></Form.Label>
                                                                <FormControl type='text' name='short_bio' value={userFormData.short_bio} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                            </Form.Group>
                                                            <Form.Group className='mb-3'>
                                                                <Form.Label>Long Bio <span className='text-gray'>(profile overview)</span></Form.Label>
                                                                <FormControl as="textarea"
                                                                    name="long_bio"
                                                                    rows={5} // You can adjust the number of rows as needed
                                                                    value={userFormData.long_bio}
                                                                    placeholder=''
                                                                    onChange={handleChange} />
                                                            </Form.Group>
                                                            <div className="text-right mt-4 mb-2">
                                                                {userFormLoading ?
                                                                    <Button type='button' className="btn-save">Saving...</Button>
                                                                    :
                                                                    <Button type='submit' className="btn-save">Save</Button>
                                                                }
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
                                                            <FormControl type='text' name='address_line_1' value={userFormData.address_line_1} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Address Line 2</Form.Label>
                                                            <FormControl type='text' name='address_line_2' value={userFormData.address_line_2} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                    </Col>
                                                    <Row>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>City</Form.Label>
                                                                <FormControl type='text' name='city' value={userFormData.city} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>State/Region</Form.Label>
                                                                <FormControl type='text' name='province' value={userFormData.province} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>Postal Code</Form.Label>
                                                                <FormControl type='number' name='postal_code' value={userFormData.postal_code} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>Country</Form.Label>
                                                                {/* <FormControl type='text' name='country' value={profileFormData.country} className='mr-sm-2' onChange={handleChange} required placeholder='' /> */}
                                                                <Form.Control as='select' name='country' value={userFormData.country} className='mr-sm-2' onChange={handleChange} required>
                                                                    <option value=''>Select Country</option>
                                                                    {Countries.map((country, index) => (
                                                                        <option key={country + "-" + index} value={country}>
                                                                            {country}
                                                                        </option>
                                                                    ))}
                                                                </Form.Control>
                                                            </Form.Group>
                                                        </Col>
                                                        <div className="text-right mt-0 mb-2">
                                                            {userFormLoading ?
                                                                <Button type='button' className="btn-save">Saving...</Button>
                                                                :
                                                                <Button type='submit' className="btn-save">Save</Button>
                                                            }
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
                                                            <FormControl type='text' name='website' value={userFormData.website} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                    </Col>
                                                    <Row>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>Phone Number</Form.Label>
                                                                <FormControl type='number' name='phone_number' value={userFormData.phone_number} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>Secondary Email</Form.Label>
                                                                <FormControl type='email' name='secondary_email_address' value={userFormData.secondary_email_address} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <div className="text-right mt-0 mb-2">
                                                        {userFormLoading ?
                                                            <Button type='button' className="btn-save">Saving...</Button>
                                                            :
                                                            <Button type='submit' className="btn-save">Save</Button>
                                                        }
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
                                                            <FormControl type='text' name='facebook' value={userFormData.facebook} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Twitter</Form.Label>
                                                            <FormControl type='text' name='twitter' value={userFormData.twitter} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Instagram</Form.Label>
                                                            <FormControl type='text' name='instagram' value={userFormData.instagram} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>LinkedIn</Form.Label>
                                                            <FormControl type='text' name='linkedin' value={userFormData.linkedin} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Pinterest</Form.Label>
                                                            <FormControl type='text' name='pinterest' value={userFormData.pinterest} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Behance</Form.Label>
                                                            <FormControl type='text' name='behance' value={userFormData.behance} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        {/* <Form.Group className='mb-4'>
                                                            <Form.Label>YouTube</Form.Label>
                                                            <FormControl type='text' name='youtube' value={userFormData.youtube} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group> */}
                                                        <div className="text-right mt-4 mb-2">
                                                            {userFormLoading ?
                                                                <Button type='button' className="btn-save">Saving...</Button>
                                                                :
                                                                <Button type='submit' className="btn-save">Save</Button>
                                                            }
                                                        </div>
                                                    </Col>
                                                </div>
                                                :
                                                null
                                            }

                                            {skillShow ?
                                                <div className="edit-skills mt-3">
                                                    <Form.Label className='mb-1 fs-18'>
                                                        Areas of Specialization and Expertise
                                                    </Form.Label>
                                                    <Form.Label className="mb-3 mt-2 small">
                                                        Specify your areas of expertise (e.g., bridal wear, ready-to-wear women’s clothing, casual, haute couture, sustainable fashion)
                                                    </Form.Label>
                                                    <Form.Group>
                                                        <TagsInput
                                                            value={areasOfSpecializationData}
                                                            onChange={setAreaOfSpecializationData}
                                                            name="areas_of_specialization"
                                                            className="form-control"
                                                            isEditOnRemove={true}
                                                            onBlur={(e) => {
                                                                const value = e.target.value;
                                                                if (!areasOfSpecializationData.includes(value) && value !== "") {
                                                                    setAreaOfSpecializationData([...areasOfSpecializationData, value]);
                                                                    e.target.value = "";
                                                                }
                                                            }}
                                                        />
                                                    </Form.Group>
                                                    <div className="text-right mt-4 mb-2">
                                                        {userFormLoading ?
                                                            <Button type='button' className="btn-save">Saving...</Button>
                                                            :
                                                            <Button type='button' onClick={submitDesigner} className="btn-save">Save</Button>
                                                        }
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
            }

        </Layout>
    );
};

export default EditDesigner;