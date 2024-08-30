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
import LoadingPage from 'Components/Shared/LoadingPage';
import { TagsInput } from "react-tag-input-component";
import axios from 'axios';
import Countries from 'Utils/Countries';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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

const initialChecklistData = {
    measurement_checklist: 1,
    upper_neck_circumference: '',
    lower_neck_circumference: '',
    chest_circumference: '',
    bust_circumference: '',
    under_bust_circumference: '',
    waist_circumference: '',
    mid_hip_circumference: '',
    hip_circumference: '',
    bust_distance: '',
    front_chest_width: '',
    back_chest_width: '',
    front_waist_length: '',
    back_waist_length: '',
    center_front_length: '',
    center_back_length: '',
    front_neck_depth: '',
    back_neck_depth: '',
    bust_depth: '',
    armhole_depth: '',
    bust_height: '',
    front_shoulder_width: '',
    back_shoulder_width: '',
    shoulder_length: '',
    shoulder_depth: '',
    elbow_circumference: '',
    underarm_length: '',
    sleeve_length: '',
    arm_circumference: '',
    wrist_circumference: '',
    elbow_length: '',
    armhole_circumference: '',
    sleeve_cap_height: '',
    hip_depth: '',
    crotch_depth: '',
    crotch_length: '',
    pants_length: '',
    knee_length: '',
    in_seam_length: '',
    thigh_circumference: '',
    mid_thigh_circumference: '',
    knee_circumference: '',
    calf_circumference: '',
    ankle_circumference: '',
    ankle_heel_circumference: '',
    body_height: '',
    body_length: '',
    side_seam: '',
    pants_trouser_length: '',

}

const initialDesignerData = Object.freeze({
    areas_of_specialization: [""],
});

const EditProfile = () => {
    const [user, setUser] = useState(initialUserData);
    const [designer, setDesigner] = useState()
    const [userLoading, setUserLoading] = useState(true);
    const [profileFormData, setProfileFormData] = useState(initialUserData);
    const [checklistData, setChecklistData] = useState(initialChecklistData);
    const [bodyMeasurement, setBodyMeasurement] = useState([]);
    const [profileFormLoading, setProfileFormLoading] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [profileShow, setProfileShow] = useState(true);
    const [addressShow, setAddressShow] = useState(false);
    const [contactShow, setContactShow] = useState(false);
    const [socialMediaShow, setSocialMediaShow] = useState(false);
    const [skillShow, setSkillShow] = useState(false);
    const [bodyMeasurementShow, setBodyMeasurementShow] = useState(false);
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
        if (tab == "profile") {
            setProfileShow(true);
            setAddressShow(false);
            setContactShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
            setBodyMeasurementShow(false);
            setChecklistData(() => bodyMeasurement);
        } else if (tab === "address") {
            setAddressShow(true);
            setProfileShow(false);
            setContactShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
            setBodyMeasurementShow(false);
            setChecklistData(() => bodyMeasurement);
        } else if (tab === "contact") {
            setContactShow(true);
            setAddressShow(false);
            setProfileShow(false);
            setSocialMediaShow(false);
            setSkillShow(false);
            setBodyMeasurementShow(false);
            setChecklistData(() => bodyMeasurement);
        } else if (tab === "social_media") {
            setSocialMediaShow(true);
            setAddressShow(false);
            setProfileShow(false);
            setContactShow(false);
            setSkillShow(false);
            setBodyMeasurementShow(false);
            setChecklistData(() => bodyMeasurement);
        } else if (tab === "skill") {
            setSkillShow(true);
            setSocialMediaShow(false);
            setAddressShow(false);
            setProfileShow(false);
            setContactShow(false);
            setBodyMeasurementShow(false);
            setChecklistData(() => bodyMeasurement);
        } else if (tab === "body_measurement") {
            setSkillShow(false);
            setSocialMediaShow(false);
            setAddressShow(false);
            setProfileShow(false);
            setContactShow(false);
            setBodyMeasurementShow(true);
            setChecklistData(() => bodyMeasurement);
        }
    }

    const handleChange = (e) => {
        setProfileFormData({
            ...profileFormData,
            [e.target.name]: e.target.value,
        })
    };

    const handleChangeBodyMeasurement = (e) => {
        setChecklistData({
            ...checklistData,
            [e.target.name]: e.target.value,
        })
    };

    const handleChangeGender = (e) => {
        const { value } = e.target;
        setProfileFormData({
            ...profileFormData,
            gender: value
        });

        e.preventDefault();
            setProfileFormLoading(true);
            axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token + '&gender=' + value).then((response) => {
                const success = response.data.status;
                if (success == 'Success') {
                    const data = response.data.data;
                    const user = data.user;
                    const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at }
                    setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                    toast.success('Profile updated successfully!');
                    setReloadCount((prevReloadCount) => prevReloadCount + 1);
                } else {
                    const errors = response.data.errors;
                }
                setProfileFormLoading(false);
            }).catch((error) => {
                setProfileFormLoading(false);
                toast.error('Something went wrong, please contact the administrator!');
            });
    };

    const handleChangePhone = (e) => {
        setProfileFormData({
            ...profileFormData,
            phone_number: e
        });
    };

    async function submitProfile(e) {
        e.preventDefault();
        setProfileFormLoading(true);

        const updatedProfileFormData = {
            ...profileFormData,
            body_measurement: JSON.stringify(checklistData)
            // ...(bodyMeasurementShow && { body_measurement: JSON.stringify(checklistData) }),
        };

        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, updatedProfileFormData).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                const user = data.user;
                const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at }
                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                toast.success('Profile updated successfully!');
                setReloadCount((prevReloadCount) => prevReloadCount + 1);
            } else {
                const errors = response.data.errors;
            }
            setProfileFormLoading(false);
        }).catch((error) => {
            setProfileFormLoading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    async function submitDesigner(e) {
        if (areasOfSpecializationData.length > 0) {
            e.preventDefault();
            setProfileFormLoading(true);
            axios.put(process.env.REACT_APP_API_ENDPOINT + 'designer/' + designer.id + '?user_id=' + currentUser + '&token=' + token, { areas_of_specialization: areasOfSpecializationData }).then((response) => {
                const success = response.data.status;
                if (success == 'Success') {
                    const data = response.data.data;
                    const user = data.user;
                    toast.success('Profile updated successfully!');
                    setReloadCount((prevReloadCount) => prevReloadCount + 1);
                } else {
                    const errors = response.data.errors;
                }
                setProfileFormLoading(false);
            }).catch((error) => {
                setProfileFormLoading(false);
                toast.error('Something went wrong, please contact the administrator!');
            });
        } else {
            setProfileFormLoading(false);
            toast.error('Please insert your specialization and experties!');
        }

    }

    const fetchData = async (e) => {
        try {
            const userData = await getUserData(e);
            if (userData.id) {
                setUser(userData);
                setProfileFormData(userData);
                setUserImage(userData.image);
                setBodyMeasurement(userData.body_measurement);
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
            // Update state or perform other logic with userData
        } catch (error) {
            setUserLoading(false);
            toast.error('An error occured. Please try again or contact the administrator.');
            // Handle the error, if needed
        }
    };

    useEffect(() => {
        fetchData({ currentUser: currentUser, token: token });
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
                                                <div className="profile-image" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'user/' + userImage + ")" }}></div>
                                                :
                                                <div className="profile-image" style={{ backgroundImage: "url(" + UserPlaceholder + ")" }}></div>
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
                                            <p className={`cursor-pointer me-5 mb-3 fs-16 ${profileShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("profile"); }}>About</p>
                                            <p className={`cursor-pointer me-5 mb-3 fs-16 ${addressShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("address"); }}>Address</p>
                                            <p className={`cursor-pointer me-5 mb-3 fs-16 ${contactShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("contact") }}>Contact</p>
                                            <p className={`cursor-pointer me-5 mb-3 fs-16 ${socialMediaShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("social_media") }}>Social Media</p>
                                            {user && user.is_designer ?
                                                <p className={`cursor-pointer me-5 mb-3 fs-16 ${skillShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("skill"); }}>Skills</p>
                                                :
                                                null
                                            }
                                            <p className={`cursor-pointer me-5 mb-3 fs-16 ${bodyMeasurementShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("body_measurement") }}>Body Measurement</p>
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
                                                                <FormControl type='date' name='date_of_birth' value={profileFormData.date_of_birth} className='mr-sm-2' onChange={handleChange} />
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
                                                            {/* {user && (user.is_designer || user.is_seller) ?
                                                                <Form.Group className='mb-4'>
                                                                    <Form.Label>Occupation</Form.Label>
                                                                    <FormControl type='text' name='occupation' value={profileFormData.occupation} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                                </Form.Group>
                                                                :
                                                                null
                                                            } */}
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>Short Bio <span className='text-gray'>(title)</span></Form.Label>
                                                                <FormControl type='text' name='short_bio' value={profileFormData.short_bio} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                            </Form.Group>
                                                            <Form.Group className='mb-3'>
                                                                <Form.Label>Long Bio <span className='text-gray'>(profile overview)</span></Form.Label>
                                                                <FormControl as="textarea"
                                                                    name="long_bio"
                                                                    rows={5} // You can adjust the number of rows as needed
                                                                    value={profileFormData.long_bio}
                                                                    placeholder=''
                                                                    onChange={handleChange} />
                                                            </Form.Group>
                                                            <div className="text-right mt-4 mb-2">
                                                                {profileFormLoading ?
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
                                                            <FormControl type='text' name='address_line_1' value={profileFormData.address_line_1} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Address Line 2</Form.Label>
                                                            <FormControl type='text' name='address_line_2' value={profileFormData.address_line_2} className='mr-sm-2' onChange={handleChange} placeholder='' />
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
                                                                {/* <FormControl type='text' name='country' value={profileFormData.country} className='mr-sm-2' onChange={handleChange} required placeholder='' /> */}
                                                                <Form.Control as='select' name='country' value={profileFormData.country} className='mr-sm-2' onChange={handleChange} required>
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
                                                            {profileFormLoading ?
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
                                                            <FormControl type='text' name='website' value={profileFormData.website} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                    </Col>
                                                    <Row>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>Phone Number</Form.Label>
                                                                {/* <FormControl type='number' name='phone_number' value={profileFormData.phone_number} className='mr-sm-2' onChange={handleChange} placeholder='' /> */}
                                                                <PhoneInput
                                                                    enableSearch={true}
                                                                    country={'us'}
                                                                    value={profileFormData.phone_number || ""}
                                                                    onChange={handleChangePhone}
                                                                    // placeholder='Phone*'
                                                                    containerStyle={{
                                                                        width: "100%",
                                                                    }}
                                                                    inputStyle={{
                                                                        backgroundColor: 'transparent',
                                                                        width: "100%",
                                                                        boxShadow: "none",
                                                                        padding: '7px 15px',
                                                                        paddingLeft: '50px',
                                                                        fontSize: '14px',
                                                                        fontFamily: 'Poppins',
                                                                        border: '1px solid #f3f3f3',
                                                                        minHeight: '40px'
                                                                    }}
                                                                    buttonStyle={{ 
                                                                        backgroundColor: 'transparent',
                                                                        borderRight: 'none',
                                                                        border: '1px solid #f3f3f3'
                                                                    }}
                                                                    searchStyle={{ 
                                                                        width: "80%"
                                                                    }}
                                                                    countryListStyle={{ 
                                                                        width: "225px"
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>Secondary Email</Form.Label>
                                                                <FormControl type='email' name='secondary_email_address' value={profileFormData.secondary_email_address} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <div className="text-right mt-0 mb-2">
                                                        {profileFormLoading ?
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
                                                            <FormControl type='text' name='facebook' value={profileFormData.facebook} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Twitter</Form.Label>
                                                            <FormControl type='text' name='twitter' value={profileFormData.twitter} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Instagram</Form.Label>
                                                            <FormControl type='text' name='instagram' value={profileFormData.instagram} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>LinkedIn</Form.Label>
                                                            <FormControl type='text' name='linkedin' value={profileFormData.linkedin} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Pinterest</Form.Label>
                                                            <FormControl type='text' name='pinterest' value={profileFormData.pinterest} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        <Form.Group className='mb-4'>
                                                            <Form.Label>Behance</Form.Label>
                                                            <FormControl type='text' name='behance' value={profileFormData.behance} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group>
                                                        {/* <Form.Group className='mb-4'>
                                                            <Form.Label>YouTube</Form.Label>
                                                            <FormControl type='text' name='youtube' value={profileFormData.youtube} className='mr-sm-2' onChange={handleChange} placeholder='' />
                                                        </Form.Group> */}
                                                        <div className="text-right mt-4 mb-2">
                                                            {profileFormLoading ?
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
                                                    <Form.Label className="mb-3 mt-2 small d-block">
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
                                                        {profileFormLoading ?
                                                            <Button type='button' className="btn-save">Saving...</Button>
                                                            :
                                                            <Button type='button' onClick={submitDesigner} className="btn-save">Save</Button>
                                                        }
                                                    </div>
                                                </div>
                                                :
                                                null
                                            }
                                            {bodyMeasurementShow ?
                                                <div className="mt-3">
                                                    <Row>
                                                        {user.gender === "Male" ?
                                                            <>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Upper Neck Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="upper_neck_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.upper_neck_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Lower Neck Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="lower_neck_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.lower_neck_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Chest Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="chest_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.chest_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Waist Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="waist_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.waist_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Mid Hip Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="mid_hip_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.mid_hip_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Hip Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="hip_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.hip_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Front Waist Length </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="front_waist_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_waist_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Back Waist Length </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="back_waist_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_waist_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Center Front Length </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="center_front_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.center_front_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Center Back Length </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="center_back_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.center_back_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Front Neck Depth </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="front_neck_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_neck_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Back Neck Depth </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="back_neck_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_neck_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Armhole Depth </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="armhole_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.armhole_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Front Shoulder Width </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="front_shoulder_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_shoulder_width} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Back Shoulder Width </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="back_shoulder_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_shoulder_width} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Shoulder Depth </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="shoulder_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.shoulder_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Elbow Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="elbow_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.elbow_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Underarm Length </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="underarm_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.underarm_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Side Seam </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="side_seam" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.side_seam} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Sleeve Length </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="sleeve_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.sleeve_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Arm Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="arm_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.arm_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Wrist Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="wrist_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.wrist_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Elbow Length </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="elbow_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.elbow_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Armhole Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="armhole_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.armhole_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Sleeve Cap Height </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="sleeve_cap_height" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.sleeve_cap_height} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Hip Depth </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="hip_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.hip_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Crotch Depth </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="crotch_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.crotch_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Pants/Trouser Length </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="pants_trouser_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.pants_trouser_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Knee Length </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="knee_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.knee_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>In Seam Length </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="in_seam_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.in_seam_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Thigh Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="thigh_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.thigh_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Mid-thigh Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="mid_thigh_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.mid_thigh_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Knee Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="knee_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.knee_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Calf Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="calf_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.calf_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Ankle Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="ankle_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.ankle_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Ankle-Heel Circumference </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="ankle_heel_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.ankle_heel_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Body Height </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="body_height" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.body_height} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Body Length </Form.Label>
                                                                        </Form.Group>
                                                                        <Form.Control name="body_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.body_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <div className="text-right mt-4 mb-2">
                                                                    {profileFormLoading ?
                                                                        <Button type='button' className="btn-save">Saving...</Button>
                                                                        :
                                                                        <Button type='submit' className="btn-save">Save</Button>
                                                                    }
                                                                </div>
                                                            </>
                                                            : user.gender === "Female" ?
                                                                <>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Upper Neck Circumference </Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="upper_neck_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.upper_neck_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Lower Neck Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="lower_neck_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.lower_neck_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Chest Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="chest_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.chest_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Bust Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="bust_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.bust_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Under Bust Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="under_bust_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.under_bust_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Waist Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="waist_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.waist_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Mid Hip Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="mid_hip_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.mid_hip_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Hip Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="hip_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.hip_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Bust Distance</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="bust_distance" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.bust_distance} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Front Chest Width</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="front_chest_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_chest_width} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Back Chest Width</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="back_chest_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_chest_width} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Front Waist Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="front_waist_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_waist_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Back Waist Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="back_waist_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_waist_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Center Front Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="center_front_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.center_front_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Center Back Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="center_back_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.center_back_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Front Neck Depth</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="front_neck_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_neck_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Back Neck Depth</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="back_neck_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_neck_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Bust Depth</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="bust_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.bust_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Armhole Depth</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="armhole_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.armhole_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Bust Height</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="bust_height" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.bust_height} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Front Shoulder Width</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="front_shoulder_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_shoulder_width} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Back Shoulder Width</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="back_shoulder_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_shoulder_width} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Shoulder Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="shoulder_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.shoulder_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Shoulder Depth</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="shoulder_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.shoulder_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Elbow Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="elbow_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.elbow_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Underarm Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="underarm_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.underarm_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Sleeve Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="sleeve_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.sleeve_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Arm Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="arm_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.arm_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Wrist Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="wrist_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.wrist_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Elbow Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="elbow_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.elbow_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Armhole Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="armhole_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.armhole_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Sleeve Cap Height</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="sleeve_cap_height" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.sleeve_cap_height} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Hip Depth</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="hip_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.hip_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Crotch Depth</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="crotch_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.crotch_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Crotch Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="crotch_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.crotch_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Pants Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="pants_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.pants_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Knee Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="knee_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.knee_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>In seam Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="in_seam_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.in_seam_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Thigh Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="thigh_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.thigh_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Mid Thigh Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="mid_thigh_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.mid_thigh_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Knee Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="knee_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.knee_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Calf Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="calf_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.calf_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Ankle Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="ankle_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.ankle_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Ankle Heel Circumference</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="ankle_heel_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.ankle_heel_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Body Height</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="body_height" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.body_height} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Body Length</Form.Label>
                                                                            </Form.Group>
                                                                            <Form.Control name="body_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.body_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <div className="text-right mt-4 mb-2">
                                                                        {profileFormLoading ?
                                                                            <Button type='button' className="btn-save">Saving...</Button>
                                                                            :
                                                                            <Button type='submit' className="btn-save">Save</Button>
                                                                        }
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <Form.Group as={Col} lg={1} md={1} sm={1}>
                                                                        <Form.Check
                                                                            className="cursor-pointer"
                                                                            type="radio"
                                                                            label="Male"
                                                                            name="gender"
                                                                            value="Male"
                                                                            checked={profileFormData.gender === 'Male'}
                                                                            onChange={handleChangeGender}
                                                                        />
                                                                    </Form.Group>
                                                                    <Form.Group as={Col} lg={1} md={1} sm={1}>
                                                                        <Form.Check
                                                                            className="cursor-pointer"
                                                                            type="radio"
                                                                            label="Female"
                                                                            name="gender"
                                                                            value="Female"
                                                                            checked={profileFormData.gender === 'Female'}
                                                                            onChange={handleChangeGender}
                                                                        />
                                                                    </Form.Group>
                                                                </>
                                                        }
                                                    </Row>
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

export default EditProfile;