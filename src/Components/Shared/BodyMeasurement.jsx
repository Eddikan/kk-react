import React, { useEffect, useState } from 'react';
import {Container, Row, Col, Card, Modal, ModalFooter, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IoCloseOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import { IoSaveOutline } from 'react-icons/io5';

const initialBodyMeasurementData = {
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
};

const measurementGuideData = [
    // Female
    {
        id: 1,
        title: 'Upper Neck Circumference',
        image: require('Assets/images/upper-neck-circumference.png'), // Adjust path
        description: 'Measure upper portion of the neck.',
    },
    {
        id: 2,
        title: 'Lower Neck Circumference',
        image: require('Assets/images/lower-neck-circumference.png'), // Adjust path
        description: 'Measure the base of the lower portion of the neck.',
    },
    {
        id: 3,
        title: 'Chest Circumference',
        image: require('Assets/images/chest-circumference.png'), // Adjust path
        description: 'Measure around the chest from back to front keeping the tape runs parallel to the floor.',
    },
    {
        id: 4,
        title: 'Bust Circumference',
        image: require('Assets/images/bust-circumference.png'), // Adjust path
        description: 'Measure around the fullest part of the breast from back to front keeping the tape parallel to the floor.',
    },
    {
        id: 5,
        title: 'Under Bust Circumference',
        image: require('Assets/images/under-bust-circumference.png'), // Adjust path
        description: 'Measure under the bust from back to front keeping the tape parallel to the ground.',
    },
    {
        id: 6,
        title: 'Waist Circumference',
        image: require('Assets/images/waist-circumference.png'), // Adjust path
        description: 'Measure around the narrowest part of the waist from back to front ensuring the tape is parallel to the floor.',
    },
    {
        id: 7,
        title: 'Mid Hip Circumference',
        image: require('Assets/images/mid-hip-circumference.png'), // Adjust path
        description: 'Measure around the area between the widest part of  the hip and the waist line.',
    },
    {
        id: 8,
        title: 'Hip Circumference',
        image: require('Assets/images/hip-circumference.png'), // Adjust path
        description: 'Measure around the widest part of the hip.',
    },
    {
        id: 9,
        title: 'Bust Distance',
        image: require('Assets/images/bust-distance.png'), // Adjust path
        description: 'Measure from the nipple point of one breast to the nipple of the other.',
    },
    {
        id: 10,
        title: 'Front Chest Width',
        image: require('Assets/images/front-chest-width.png'), // Adjust path
        description: 'Measure the distance from one armpit to the other.',
    },
    {
        id: 11,
        title: 'Back Chest Width',
        image: require('Assets/images/back-chest-width.png'), // Adjust path
        description: 'Measure the distance from one armpit to the other.',
    },
    {
        id: 12,
        title: 'Front Waist Length',
        image: require('Assets/images/front-waist-length.png'), // Adjust path
        description: 'Measure from the base of the neck to the front waistline mark, passing the tape over the bust.',
    },
    {
        id: 13,
        title: 'Back Waist Length',
        image: require('Assets/images/back-waist-length.png'), // Adjust path
        description: 'Measure from the base of the neck to the back waistline mark.',
    },
    {
        id: 14,
        title: 'Center Front Length',
        image: require('Assets/images/center-front-length.png'), // Adjust path
        description: 'Measure from the center of the front neck down to the center of the front waistline mark.',
    },
    {
        id: 15,
        title: 'Center Back Length',
        image: require('Assets/images/center-back-length.png'), // Adjust path
        description: 'Measure from the center of  the back neck down to the center of the back waistline mark.',
    },
    {
        id: 16,
        title: 'Front Neck Depth',
        image: require('Assets/images/front-neck-depth.png'), // Adjust path
        description: 'Measure from the front shoulder starting at the base of the neck to your desired front neck depth.',
    },
    {
        id: 17,
        title: 'Back Neck Depth',
        image: require('Assets/images/back-neck-depth.png'), // Adjust path
        description: 'Measure from the base of the neck to the desired back neck depth.',
    },
    {
        id: 18,
        title: 'Bust Depth',
        image: require('Assets/images/bust-depth-radius.png'), // Adjust path
        description: 'Measure from the nipple point on the bust down to under the bust.',
    },
    {
        id: 19,
        title: 'Armhole Depth',
        image: require('Assets/images/armhole-depth.png'), // Adjust path
        description: 'With a ruler placed under the armpit, measure from the tip of the shoulder bone to the armpit, touching the ruler.',
    },
    {
        id: 20,
        title: 'Bust Height',
        image: require('Assets/images/bust-height.png'), // Adjust path
        description: 'Measure from the front shoulder at the base of the neck to the highest point of the bust.',
    },
    {
        id: 21,
        title: 'Front Shoulder Width',
        image: require('Assets/images/front-shoulder-width.png'), // Adjust path
        description: 'Request your assistant to place one end of a tape measure flat against one shoulder point. Then, have them extend the tape measure across your front, tracing the natural curve of your shoulders, until it reaches the opposite shoulder point.',
    },
    {
        id: 22,
        title: 'Back Shoulder Width',
        image: require('Assets/images/back-shoulder-width.png'), // Adjust path
        description: 'Request your assistant to place one end of a tape measure flat against one shoulder point. Then, have them extend the tape measure across your back, tracing the natural curve of your shoulders, until it reaches the opposite shoulder point.',
    },
    {
        id: 23,
        title: 'Shoulder Length',
        image: require('Assets/images/shoulder-length.png'), // Adjust path
        description: 'Measure along the front from base of neck to the shoulder point.',
    },
    {
        id: 24,
        title: 'Shoulder Depth',
        image: require('Assets/images/shoulder-depth.png'), // Adjust path
        description: 'Measure from the nape down to the line that meets the shoulder point.',
    },
    {
        id: 25,
        title: 'Elbow Circumference',
        image: require('Assets/images/elbow-circumference.png'), // Adjust path
        description: 'With your arm slightly bent and hand resting on your hip, measure around the elbow.',
    },
    {
        id: 26,
        title: 'Underarm Length',
        image: require('Assets/images/elbow-circumference.png'), // Adjust path
        description: 'With your arm slightly bent and hand resting on your hip, measure from the armpit to the wrist.',
    },
    {
        id: 27,
        title: 'Sleeve Length',
        image: require('Assets/images/sleeve-length.png'), // Adjust path
        description: 'While the arm is bent, measure from the tip of the shoulder point to the wrist mark, ensuring the measurement passes through the elbow.',
    },
    {
        id: 28,
        title: 'Arm Circumference)',
        image: require('Assets/images/arm-circumference.png'), // Adjust path
        description: 'Measure the widest part of the upper arm.',
    },
    {
        id: 29,
        title: 'Wrist Circumference',
        image: require('Assets/images/wrist-circumference.png'), // Adjust path
        description: 'Measure the narrowest area of the wrist.',
    },
    {
        id: 30,
        title: 'Elbow Length',
        image: require('Assets/images/elbow-circumference.png'), // Adjust path
        description: 'While the arm is bent, measure from the tip of the shoulder point to the tip of the elbow bone.',
    },
    {
        id: 31,
        title: 'Armhole Circumference',
        image: require('Assets/images/armhole-circumference.png'), // Adjust path
        description: 'Measure around the armhole passing over the shoulder point and under the armpit.',
    },
    {
        id: 32,
        title: 'Sleeve Cap Height',
        image: require('Assets/images/sleeve-cap-height.png'), // Adjust path
        description: 'Measure from the tip of the shoulder bone to the widest part of the arm, just below the armpit.',
    },
    {
        id: 33,
        title: 'Hip Depth',
        image: require('Assets/images/hip-depth.png'), // Adjust path
        description: 'Measure from the waistline to a point on the widest part of the hip.',
    },
    {
        id: 34,
        title: 'Crotch Depth',
        image: require('Assets/images/crotch-depth.png'), // Adjust path
        description: 'Take this measurement while sitting straight. Measure from the side waist point, to the surface of the seat.',
    },
    {
        id: 35,
        title: 'Crotch Length',
        image: require('Assets/images/crotch-length.png'), // Adjust path
        description: 'Measure from the center front waistline to the center back waist line passing the measuring tape in between the thighs.',
    },
    {
        id: 36,
        title: 'Pants/Trouser Length',
        image: require('Assets/images/pants-trouser-length.png'), // Adjust path
        description: 'Measure from the waistline to the desired pant/trouser length.',
    },
    {
        id: 37,
        title: 'Knee Length',
        image: require('Assets/images/knee-length.png'), // Adjust path
        description: 'Measure from the waist to the narrowest part of the knee.',
    },
    {
        id: 38,
        title: 'In Seam Length',
        image: require('Assets/images/in-seam-length.png'), // Adjust path
        description: 'Measure from the crotch to the feet.',
    },
    {
        id: 39,
        title: 'Thigh Circumference',
        image: require('Assets/images/thigh-circumference.png'), // Adjust path
        description: 'Measure the widest portion of the thigh.',
    },
    {
        id: 40,
        title: 'Mid-thigh Circumference',
        image: require('Assets/images/mid-thigh-circumference.png'), // Adjust path
        description: 'Measure around the mid-point of the thigh, between the upper thigh and the knee.',
    },
    {
        id: 41,
        title: 'Knee Circumference',
        image: require('Assets/images/knee-circumference.png'), // Adjust path
        description: 'Measure around the narrowest part of the knee.',
    },
    {
        id: 42,
        title: 'Calf Circumference',
        image: require('Assets/images/calf-circumference.png'), // Adjust path
        description: 'Measure the widest part of each calf, as there may be asymmetry between them. Record the measurement for the widest calf.',
    },
    {
        id: 43,
        title: 'Ankle Circumference',
        image: require('Assets/images/ankle-circumference.png'), // Adjust path
        description: 'Measure around the narrowest part of the ankle.',
    },
    {
        id: 44,
        title: 'Ankle-Heel Circumference',
        image: require('Assets/images/ankle-heel-circumference.png'), // Adjust path
        description: 'Measure around the heel and ankle.',
    },
    {
        id: 45,
        title: 'Body Height',
        image: require('Assets/images/body-height.png'), // Adjust path
        description: 'Ask your partner to gently mark the wall with colored tape where the ruler, book, or another flat object meets your head while you stand against the wall. Use a tape measure, preferably a metal one for accuracy, to measure the distance from the floor to the mark on the wall.',
    },
    {
        id: 46,
        title: 'Body Length',
        image: require('Assets/images/body-length.png'), // Adjust path
        description: 'Ask your partner to gently mark the wall with colored tape where the ruler, book, or another flat object meets your nape while you stand against the wall. Use a tape measure, preferably a metal one for accuracy, to measure the distance from the floor to the mark on the wall.',
    },

    // Male
    {
        id: 47,
        title: 'Upper Neck Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/upper-neck.png'), // Adjust path
        description: 'Measure upper portion of the neck.',
    },
    {
        id: 48,
        title: 'Lower Neck Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/lower-neck.png'), // Adjust path
        description: 'Measure the base of the lower portion of the neck.',
    },
    {
        id: 49,
        title: 'Chest Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/chest-circumference.png'), // Adjust path
        description: 'Measure around the chest from back to front keeping the tape runs parallel to the floor.',
    },
    {
        id: 50,
        title: 'Waist Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/waist-circumference.png'), // Adjust path
        description: 'Measure around the narrowest part of the waist from back to front ensuring the tape is parallel to the floor.',
    },
    {
        id: 51,
        title: 'Mid Hip Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/mid-hip-circumference.png'), // Adjust path
        description: 'Measure around the area between the widest part of  the hip and the waist line.',
    },
    {
        id: 52,
        title: 'Hip Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/hip-circumference.png'), // Adjust path
        description: 'Measure around the widest part of the hip.',
    },
    {
        id: 53,
        title: 'Front Waist Length',
        image: require('Assets/images/Male-Measurement-Descriptions/front-waist-length.png'), // Adjust path
        description: 'Measure the shoulder at the base of the neck to the front waistline.',
    },
    {
        id: 54,
        title: 'Back Waist Length',
        image: require('Assets/images/Male-Measurement-Descriptions/back-waist-length.png'), // Adjust path
        description: 'Measure the shoulder at the base of the neck to the back waistline.',
    },
    {
        id: 55,
        title: 'Center Front Length',
        image: require('Assets/images/Male-Measurement-Descriptions/center-front-length.png'), // Adjust path
        description: 'Measure from the center of  the front neck down to the center of the front waistline mark.',
    },
    {
        id: 56,
        title: 'Center Back Length',
        image: require('Assets/images/Male-Measurement-Descriptions/center-back-length.png'), // Adjust path
        description: 'Measure from the center of  the back neck down to the center of the back waistline mark.',
    },
    {
        id: 57,
        title: 'Front Neck Depth',
        image: require('Assets/images/Male-Measurement-Descriptions/front-neck-depth.png'), // Adjust path
        description: 'Measure from the front shoulder starting at the base of the neck to your desired front neck depth.',
    },
    {
        id: 58,
        title: 'Back Neck Depth',
        image: require('Assets/images/Male-Measurement-Descriptions/back-neck-depth.png'), // Adjust path
        description: 'Measure from the base of the neck to the desired back neck depth.',
    },
    {
        id: 59,
        title: 'Armhole Depth',
        image: require('Assets/images/Male-Measurement-Descriptions/armhole-depth.png'), // Adjust path
        description: 'With a ruler placed under the armpit, measure from the tip of the shoulder bone to the armpit, touching the ruler.',
    },
    {
        id: 60,
        title: 'Front Shoulder Width',
        image: require('Assets/images/Male-Measurement-Descriptions/front-shoulder-width.png'), // Adjust path
        description: 'Request your assistant to place one end of a tape measure flat against one shoulder point. Then, have them extend the tape measure across your front, tracing the natural curve of your shoulders, until it reaches the opposite shoulder point.',
    },
    {
        id: 61,
        title: 'Back Shoulder Width',
        image: require('Assets/images/Male-Measurement-Descriptions/back-shoulder-width.png'), // Adjust path
        description: 'Request your assistant to place one end of a tape measure flat against one shoulder point. Then, have them extend the tape measure across your back, tracing the natural curve of your shoulders, until it reaches the opposite shoulder point.',
    },
    {
        id: 62,
        title: 'Shoulder Depth',
        image: require('Assets/images/Male-Measurement-Descriptions/shoulder-depth.png'), // Adjust path
        description: 'Measure from the nape down to the line that meets the shoulder point.',
    },
    {
        id: 63,
        title: 'Elbow Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/elbow-circumference.png'), // Adjust path
        description: 'With your arm slightly bent and hand resting on your hip, measure around the elbow.',
    },
    {
        id: 64,
        title: 'Underarm Length',
        image: require('Assets/images/Male-Measurement-Descriptions/underarm-length.png'), // Adjust path
        description: 'With your arm slightly bent and hand resting on your hip, measure from the armpit to the wrist.',
    },
    {
        id: 65,
        title: 'Side Seam',
        image: require('Assets/images/Male-Measurement-Descriptions/side-seam.png'), // Adjust path
        description: 'With the arm bent, measure from the arm pint to the waistline.',
    },
    {
        id: 66,
        title: 'Sleeve Length',
        image: require('Assets/images/Male-Measurement-Descriptions/sleeve-length.png'), // Adjust path
        description: 'While the arm is bent, measure from the tip of the shoulder point to the wrist mark, ensuring the measurement passes through the elbow.',
    },
    {
        id: 67,
        title: 'Arm Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/arm-circumference.png'), // Adjust path
        description: 'Measure the widest part of the upper arm.',
    },
    {
        id: 68,
        title: 'Wrist Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/wrist-circumference.png'), // Adjust path
        description: 'Measure the narrowest area of the wrist.',
    },
    {
        id: 69,
        title: 'Elbow Length',
        image: require('Assets/images/Male-Measurement-Descriptions/elbow-length.png'), // Adjust path
        description: 'While the arm is bent, measure from the tip of the shoulder point to the tip of the elbow bone.',
    },
    {
        id: 70,
        title: 'Armhole Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/armhole-circumference.png'), // Adjust path
        description: 'Measure around the armhole passing over the shoulder point and under the armpit.',
    },
    {
        id: 71,
        title: 'Sleeve Cap Height',
        image: require('Assets/images/Male-Measurement-Descriptions/sleeve-cap-height.png'), // Adjust path
        description: 'Measure from the tip of the shoulder bone to the widest part of the arm, just below the armpit.',
    },
    {
        id: 72,
        title: 'Hip Depth',
        image: require('Assets/images/Male-Measurement-Descriptions/hip-depth.png'), // Adjust path
        description: 'Measure from the waistline to a point on the widest part of the hip.',
    },
    {
        id: 73,
        title: 'Crotch Depth',
        image: require('Assets/images/Male-Measurement-Descriptions/crotch-depth.png'), // Adjust path
        description: 'Take this measurement while sitting straight. Measure from the side waist point, to the surface of the seat.',
    },
    {
        id: 74,
        title: 'Pants/Trouser Length',
        image: require('Assets/images/Male-Measurement-Descriptions/pants-trouser-length.png'), // Adjust path
        description: 'Measure from the waistline to the desired pant/trouser length.',
    },
    {
        id: 75,
        title: 'Knee Length',
        image: require('Assets/images/Male-Measurement-Descriptions/knee-length.png'), // Adjust path
        description: 'Measure from the waist to the narrowest part of the knee.',
    },
    {
        id: 76,
        title: 'In Seam Length',
        image: require('Assets/images/Male-Measurement-Descriptions/in-seam-length.png'), // Adjust path
        description: 'Measure from the crotch to the feet.',
    },
    {
        id: 77,
        title: 'Thigh Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/thigh-circumference.png'), // Adjust path
        description: 'Measure the widest portion of the thigh.',
    },
    {
        id: 78,
        title: 'Mid-thigh Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/mid-thigh-circumference.png'), // Adjust path
        description: 'Measure around the mid-point of the thigh, between the upper thigh and the knee.',
    },
    {
        id: 79,
        title: 'Knee Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/knee-circumference.png'), // Adjust path
        description: 'Measure around the narrowest part of the knee.',
    },
    {
        id: 80,
        title: 'Calf Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/calf-circumference.png'), // Adjust path
        description: 'Measure the widest part of each calf, as there may be asymmetry between them. Record the measurement for the widest calf.',
    },
    {
        id: 81,
        title: 'Ankle Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/ankle-heel-circumference.png'), // Adjust path
        description: 'Measure around the narrowest part of the ankle.',
    },
    {
        id: 82,
        title: 'Ankle-Heel Circumference',
        image: require('Assets/images/Male-Measurement-Descriptions/ankle-heel-circumference.png'), // Adjust path
        description: 'Measure around the heel and ankle.',
    },
    {
        id: 83,
        title: 'Body Height',
        image: require('Assets/images/Male-Measurement-Descriptions/body-height.png'), // Adjust path
        description: 'Ask your partner to gently mark the wall with colored tape where the ruler, book, or another flat object meets your head while you stand against the wall. Use a tape measure, preferably a metal one for accuracy, to measure the distance from the floor to the mark on the wall.',
    },
    {
        id: 84,
        title: 'Body Length',
        image: require('Assets/images/Male-Measurement-Descriptions/body-length.png'), // Adjust path
        description: 'Ask your partner to gently mark the wall with colored tape where the ruler, book, or another flat object meets your nape while you stand against the wall. Use a tape measure, preferably a metal one for accuracy, to measure the distance from the floor to the mark on the wall.',
    },
];

const BodyMeasurement = ({ userData }) => {

    const [modalHeadingMeasurementGuide, setModalHeadingMeasurementGuide] = useState('');
    const [measurementGuideDescription, setModalMeasurementGuideDescription] = useState('');
    const [measurementGuideImage, setModalMeasurementGuideImage] = useState('');
    const [measurementGuideModalShow, setMeasurementGuideModalShow] = useState(false);
    const [measurementGuidedataLookup, setMeasurementGuideDataLookup] = useState({});
    const [bodyMeasurementFormData, setBodyMeasurementFormData] = useState(initialBodyMeasurementData);
    const [formLoading, setFormLoading] = useState(false);
    const [user, setUser] = useState(userData);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'token']);

    const currentUser = cookies.currentUser;
    const current_user_id = cookies.currentUser;
    const token = cookies.token;

    const toggleMeasurementGuideModal = (id) => {
        // setModalHeadingMeasurementGuide(heading);
        const data = measurementGuidedataLookup[id];
        if (data) {
            setModalHeadingMeasurementGuide(data.title);
            setModalMeasurementGuideDescription(data.description);
            setModalMeasurementGuideImage(data.image);
        } else {
            setModalHeadingMeasurementGuide('-');
            setModalMeasurementGuideDescription('-');
            setModalMeasurementGuideImage('-');
        }
        setMeasurementGuideModalShow(!measurementGuideModalShow);
    };

    const handleChangeBodyMeasurement = (e) => {
        setBodyMeasurementFormData({
            ...bodyMeasurementFormData,
            [e.target.name]: e.target.value,
        })
    };

    useEffect(() => {
        // Create lookup object
        const lookup = measurementGuideData.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {});
        setMeasurementGuideDataLookup(lookup);
        if (user.body_measurement) {
            setBodyMeasurementFormData(user.body_measurement);
        }
    }, []);

    async function submitBodyMeasurements(e) {
        e.preventDefault();
        setFormLoading(true);

        const updatedProfileFormData = {body_measurement: JSON.stringify(bodyMeasurementFormData)};

        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?current_user_id=' + current_user_id + '&token=' + token, updatedProfileFormData).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                toast.success('Body measurements updated successfully!');
            } else {
                const errors = response.data.errors;
            }
            setFormLoading(false);
        }).catch((error) => {
            setFormLoading(false);
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    const hasEmptyMeasurement = Object.values(user.body_measurement).some(value => value !== "");

    return (
        <>
            {user.gender === "Male" ?
                <>
                    <div className="neck-container">
                        <p className='title-designer mb-1 lh-25'>Neck </p>
                        <div className="ms-60">
                            <Row className="mb-4">
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Upper Neck Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(47)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="upper_neck_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.upper_neck_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Lower Neck Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(48)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="lower_neck_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.lower_neck_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Front Neck Depth </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(57)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="front_neck_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.front_neck_depth} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Back Neck Depth </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(58)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="back_neck_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.back_neck_depth} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <hr />
                        </div>
                    </div>
                    <div className="chest-container">
                        <p className='title-designer mb-1 lh-25 mt-4'>Chest </p>
                        <div className="ms-60">
                            <Row className="mb-4">
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Chest Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(49)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="chest_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.chest_circumference} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <hr />
                        </div>
                    </div>
                    <div className="waist-container">
                        <p className='title-designer mb-1 lh-25 mt-4'>Waist </p>
                        <div className="ms-60">
                            <Row className="mb-4">
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Waist Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(50)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="waist_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.waist_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Mid Hip Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(51)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="mid_hip_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.mid_hip_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Hip Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(52)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="hip_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.hip_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Back Waist Length </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(54)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="back_waist_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.back_waist_length} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Front Waist Length </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(53)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="front_waist_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.front_waist_length} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Center Front Length </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(55)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="center_front_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.center_front_length} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Center Back Length </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(56)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="center_back_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.center_back_length} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <hr />
                        </div>
                    </div>
                    <div className="arm-container">
                        <p className='title-designer mb-1 lh-25 mt-4'>Arm </p>
                        <div className="ms-60">
                            <Row className="mb-4">
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Armhole Depth </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(59)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="armhole_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.armhole_depth} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Front Shoulder Width </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(60)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="front_shoulder_width" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.front_shoulder_width} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Back Shoulder Width </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(61)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="back_shoulder_width" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.back_shoulder_width} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Shoulder Depth </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(62)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="shoulder_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.shoulder_depth} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Elbow Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(63)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="elbow_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.elbow_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Underarm Length </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(64)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="underarm_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.underarm_length} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Sleeve Length </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(66)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="sleeve_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.sleeve_length} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Arm Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(67)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="arm_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.arm_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Armhole Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(70)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="armhole_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.armhole_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Sleeve Cap Height </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(71)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="sleeve_cap_height" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.sleeve_cap_height} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Wrist Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(68)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="wrist_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.wrist_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Elbow Length </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(69)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="elbow_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.elbow_length} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Side Seam </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(65)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="side_seam" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.side_seam} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <hr />
                        </div>
                    </div>
                    <div className="lower-body-container">
                        <p className='title-designer mb-1 lh-25 mt-4'>Lower Body </p>
                        <div className="ms-60">
                            <Row className="mb-4">
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Hip Depth </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(72)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="hip_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.hip_depth} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Crotch Depth </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(73)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="crotch_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.crotch_depth} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Pants/Trouser Length </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(74)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="pants_trouser_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.pants_trouser_length} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Knee Length </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(75)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="knee_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.knee_length} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">In Seam Length </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(76)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="in_seam_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.in_seam_length} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Thigh Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(77)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="thigh_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.thigh_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Mid-thigh Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(78)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="mid_thigh_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.mid_thigh_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Knee Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(79)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="knee_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.knee_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Calf Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(80)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="calf_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.calf_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Ankle Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(81)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="ankle_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.ankle_circumference} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Ankle-Heel Circumference </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(82)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="ankle_heel_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.ankle_heel_circumference} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <hr />
                        </div>
                    </div>
                    <div className="body-height-length-container">
                        <p className='title-designer mb-1 lh-25 mt-4'>Body Height & Length </p>
                        <div className="ms-60">
                            <Row className="mb-4">
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Body Height </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(83)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="body_height" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.body_height} />
                                    </Form.Group>
                                </Col>
                                <Col lg="4">
                                    <Form.Group className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="lh-25">Body Length </Form.Label>
                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(84)} />
                                        </Form.Group>
                                        <Form.Control type="number" name="body_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.body_length} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <hr />
                        </div>
                    </div>
                    <hr />
                    <div className="text-right mt-30">
                        {formLoading ?
                            <Button
                                className='btn-save btn btn btn-primary fs-14'
                                type='button'
                                style={{ cursor: 'not-allowed' }}
                            >
                                <IoSaveOutline size="20px"/> Saving...
                            </Button>
                            :
                            <Button
                                className='btn-save btn btn btn-primary fs-14'
                                type='button'
                                onClick={submitBodyMeasurements}
                            >
                                <IoSaveOutline size="20px"/> Save
                            </Button>
                        }
                    </div>
                </>
                : user.gender === "Female" ?
                    <>
                        <div className="neck-container">
                            <p className='title-designer mb-1 lh-25'>Neck </p>
                            <div className="ms-60">
                                <Row className="mb-4">
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Upper Neck Circumference </Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(1)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="upper_neck_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.upper_neck_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Lower Neck Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(2)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="lower_neck_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.lower_neck_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Front Neck Depth</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(16)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="front_neck_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.front_neck_depth} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Back Neck Depth</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(17)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="back_neck_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.back_neck_depth} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                            </div>
                        </div>

                        <div className="chest-container">
                            <p className='title-designer mb-1 lh-25 mt-4'>Chest </p>
                            <div className="ms-60">
                                <Row className="mb-4">
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Chest Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(3)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="chest_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.chest_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Back Chest Width</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(11)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="back_chest_width" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.back_chest_width} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Front Chest Width</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(10)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="front_chest_width" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.front_chest_width} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Bust Distance</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(9)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="bust_distance" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.bust_distance} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Bust Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(4)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="bust_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.bust_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Under Bust Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(5)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="under_bust_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.under_bust_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Bust Depth</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(18)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="bust_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.bust_depth} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Bust Height</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(20)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="bust_height" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.bust_height} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                            </div>
                        </div>
                        
                        <div className="waist-container">
                            <p className='title-designer mb-1 lh-25 mt-4'>Waist </p>
                            <div className="ms-60">
                                <Row className="mb-4">
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Waist Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(6)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="waist_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.waist_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Mid Hip Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(7)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="mid_hip_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.mid_hip_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Hip Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(8)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="hip_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.hip_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Back Waist Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(13)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="back_waist_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.back_waist_length} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Front Waist Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(12)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="front_waist_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.front_waist_length} />
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Center Front Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(14)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="center_front_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.center_front_length} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Center Back Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(15)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="center_back_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.center_back_length} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                            </div>
                        </div>
                        
                        <div className="arm-container">
                            <p className='title-designer mb-1 lh-25 mt-4'>Arm </p>
                            <div className="ms-60">
                                <Row className="mb-4">
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Armhole Depth</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(19)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="armhole_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.armhole_depth} />
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Front Shoulder Width</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(21)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="front_shoulder_width" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.front_shoulder_width} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Back Shoulder Width</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(22)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="back_shoulder_width" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.back_shoulder_width} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Shoulder Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(23)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="shoulder_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.shoulder_length} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Shoulder Depth</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(24)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="shoulder_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.shoulder_depth} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Elbow Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(25)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="elbow_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.elbow_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Underarm Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(26)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="underarm_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.underarm_length} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Sleeve Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(27)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="sleeve_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.sleeve_length} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Arm Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(28)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="arm_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.arm_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Armhole Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(31)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="armhole_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.armhole_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Sleeve Cap Height</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(32)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="sleeve_cap_height" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.sleeve_cap_height} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Wrist Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(29)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="wrist_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.wrist_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Elbow Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(30)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="elbow_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.elbow_length} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                            </div>
                        </div>
                        
                        <div className="lower-body-container">
                            <p className='title-designer mb-1 lh-25 mt-4'>Lower Body </p>
                            <div className="ms-60">
                                <Row className="mb-4">
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Hip Depth</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(33)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="hip_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.hip_depth} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Crotch Depth</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(34)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="crotch_depth" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.crotch_depth} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Crotch Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(35)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="crotch_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.crotch_length} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Pants Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(36)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="pants_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.pants_length} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Knee Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(37)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="knee_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.knee_length} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">In seam Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(38)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="in_seam_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.in_seam_length} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Thigh Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(39)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="thigh_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.thigh_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Mid Thigh Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(40)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="mid_thigh_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.mid_thigh_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Knee Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(41)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="knee_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.knee_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Calf Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(42)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="calf_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.calf_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Ankle Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(43)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="ankle_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.ankle_circumference} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Ankle Heel Circumference</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(44)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="ankle_heel_circumference" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.ankle_heel_circumference} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                            </div>
                        </div>

                        <div className="body-height-length-container">
                            <p className='title-designer mb-1 lh-25 mt-4'>Body Height & Length </p>
                            <div className="ms-60">
                                <Row className="mb-4">
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Body Height</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(45)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="body_height" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.body_height} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="4">
                                        <Form.Group className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lh-25">Body Length</Form.Label>
                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(46)} />
                                            </Form.Group>
                                            <Form.Control type="number" name="body_length" placeholder="" onChange={handleChangeBodyMeasurement} value={user.body_measurement.body_length} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                            </div>
                        </div>
                        <hr />
                        <div className="text-right mt-30">
                            {formLoading ?
                                <Button
                                    className='btn-save btn btn btn-primary fs-14'
                                    type='button'
                                    style={{ cursor: 'not-allowed' }}
                                >
                                    <IoSaveOutline size="20px"/> Saving...
                                </Button>
                                :
                                <Button
                                    className='btn-save btn btn btn-primary fs-14'
                                    type='button'
                                    onClick={submitBodyMeasurements}
                                >
                                    <IoSaveOutline size="20px"/> Save
                                </Button>
                            }
                        </div>
                    </>
                : 
                <p className="text-center mb-3 mt-3">Please update your gender <Link to="/user/profile/edit">here</Link> before filling up your measurements</p>
            }

            <Modal
                show={measurementGuideModalShow}
                className='modal-preview measurement-guide-modal'
                fade={false}
                centered
                size="lg"
            >
                <Modal.Header className="py-0">
                    <h5 className='modal-title text-left rufina-family fs-22 mt-3'>{modalHeadingMeasurementGuide}</h5>
                    <button
                        type='button'
                        className='close react-modal-close'
                        onClick={() => setMeasurementGuideModalShow(false)}
                    >
                        <IoCloseOutline color="#7e7e7e" size={25} className='mt-2' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body className="text-left">
                            <Row>
                                <Col lg={12}>
                                    <div>
                                        <p dangerouslySetInnerHTML={{ __html: measurementGuideDescription }} className="fs-16 mb-2 text-black" />
                                        <img src={measurementGuideImage} className="measurement-image" />
                                    </div>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Modal.Body>

                <ModalFooter className='border-none pt-0'>
                    <div className='text-right'>
                        <button
                            className="btn btn-secondary border-black bg-white text-black btn-style"
                            onClick={() => setMeasurementGuideModalShow(false)}
                            type="button">
                            Close
                        </button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default BodyMeasurement;