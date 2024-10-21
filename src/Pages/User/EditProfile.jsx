import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, ModalFooter, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import 'Assets/styles/User/EditProfile/style.css'
import PinIcon from 'Assets/images/pin.png';
import UserPlaceholder from 'Assets/images/user.png';
import getUserData from 'Utils/GetUserData';
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import GoBack from 'Components/Shared/GoBack';
import LoadingPage from 'Components/Shared/LoadingPage';
import { TagsInput } from "react-tag-input-component";
import axios from 'axios';
import Countries from 'Utils/Countries';
import CountryData from 'Utils/CountryData';
import CountryCodes from 'Utils/CountryCodes';
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

const initialLatLon = Object.freeze({
    latitude: 0,
    longitude: 0,
});

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
    const [errors, setErrors] = useState();

    const [measurementGuideModalShow, setMeasurementGuideModalShow] = useState(false);
    const [modalHeadingMeasurementGuide, setModalHeadingMeasurementGuide] = useState('');
    const [measurementGuideDescription, setModalMeasurementGuideDescription] = useState('');
    const [measurementGuideImage, setModalMeasurementGuideImage] = useState('');
    const [measurementGuidedataLookup, setMeasurementGuideDataLookup] = useState({});

    // Locations
    const [cities, setCities] = useState([]);
    const [provinces, setProvinces] = useState([]);

    const [provincesLoading, setProvincesLoading] = useState(false);
    const [citiesLoading, setCitiesLoading] = useState(false);
    const [coordinates, setCoordinates] = useState(initialLatLon);

    const currentUser = cookies.currentUser;
    const token = cookies.token;

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 2025 - 1900 }, (_, i) => 1900 + i);

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
    };

    const getCountryCode = (countryName) => {
        // Find the country code based on the country name
        const entries = Object.entries(CountryCodes);
        for (const [code, name] of entries) {
            if (name.toLowerCase() === countryName.toLowerCase()) {
                return code; // Return the corresponding country code
            }
        }
        return null; // Return null if no match is found
    };

    const getCoordinates = async (requestData) => {
        const API_KEY = '7ba22fb46e866c41cd6bd744126fa733'; // Replace with your OpenWeatherMap API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${requestData}&appid=${API_KEY}`;
        setProfileFormLoading(true);
        try {
            const response = await axios.get(url);
            const { lat, lon } = response.data.coord; // Extracting latitude and longitude
            if (response.status == 200) {
                setCoordinates({
                    ...coordinates,
                    latitude: lat,
                    longitude: lon,
                });
            } else {
                toast.error('Failed to fetch coordinates. Please check the city name and try again.');
            }
            setProfileFormLoading(false);
            
        } catch (error) {
            toast.error('Failed to fetch coordinates. Please check the city name and try again.');
            console.error(error);
            setProfileFormLoading(false);
        }
    };

    const getCountryStates = async (requestData) => {
        try {
            setProvincesLoading(true);
            const response = await axios.post(
                process.env.REACT_APP_LOCATION_API_ENDPOINT + 'countries/states',
                requestData, // JSON body with country
                {
                    headers: {
                        'Content-Type': 'application/json', // Ensure it's sending as JSON
                    },
                }
            );

            const { error, data } = response.data;

            if (!error) {
                setProvinces(data.states); // Assuming the response has the states in `data.states`
                setProvincesLoading(false);
            } else {
                const errors = response.data.errors;
                if (errors) {
                    setErrors(errors);
                    toast.error('There has been an error getting the states, please try again!');
                } else {
                    toast.error('There has been an error getting the states, please try again!');
                }
                setProvincesLoading(false);
            }
        } catch (err) {
            toast.error('There has been an error getting the states, please try again!');
            setProvincesLoading(false);
        }
    };

    const getStateCities = async (requestData) => {
        try {
            setCitiesLoading(true);
            const response = await axios.post(
                process.env.REACT_APP_LOCATION_API_ENDPOINT + 'countries/state/cities',
                requestData, // JSON body with country and state
                {
                    headers: {
                        'Content-Type': 'application/json', // Ensure it's sending as JSON
                    },
                }
            );

            const { error, data } = response.data;

            if (!error) {
                setCities(data); // Assuming the response has the cities in `data`
                setCitiesLoading(false);
            } else {
                const errors = response.data.errors;
                if (errors) {
                    setErrors(errors);
                    toast.error('There has been an error getting the cities, please try again!');
                } else {
                    toast.error('There has been an error getting the cities, please try again!');
                }
                setCitiesLoading(false);
            }
        } catch (err) {
            toast.error('There has been an error getting the cities, please try again!');
            setCitiesLoading(false);
        }
    };

    const handleChange = (e) => {
        var { name, value } = e.target;

        if (name == "country") {
            const country = Object.values(CountryData).find(country => country.name === value);
            let currency = 'USD';
            let currencyCode = '$';
            let country_code = 'US';

            if (country) {
                currency = country.currency;
                currencyCode = country.currencyCode;
            }

            if (value && value != "") {
                country_code = getCountryCode(value);
            }

            setProfileFormData({
                ...profileFormData,
                [e.target.name]: e.target.value,
                currency: currency,
                currency_code: currencyCode,
                country_code: country_code ?? "US",
                province: "",
                province_code: "",
                city: "",
            });
        } else if (name == "province") {
            const selectedProvince = e.target.selectedOptions[0];
            const provinceCode = selectedProvince.getAttribute('data-province-code');

            setProfileFormData({
                ...profileFormData,
                [e.target.name]: e.target.value,
                province_code: provinceCode,
                city: "",
            });
        } else {
            setProfileFormData({
                ...profileFormData,
                [e.target.name]: e.target.value,
            });
        }
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
            body_measurement: JSON.stringify(checklistData),
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
            // ...(bodyMeasurementShow && { body_measurement: JSON.stringify(checklistData) }),
        };

        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, updatedProfileFormData).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                const user = data.user;
                const user_details = { currentUser: user.id, id: user.id, first_name: user.first_name, last_name: user.last_name, image: user.image, email_verified_at: user.email_verified_at, signup_type: user.signup_type, email: user.email, is_seller: user.is_seller, is_designer: user.is_designer, shop_completed: user.shop_completed, profile_completeness: user.profile_completeness }
                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });

                setCookie('userCurrency', JSON.stringify(user.currency ?? 'USD'), { path: '/' });
                setCookie('userCurrencyCode', JSON.stringify(user.currency_code ?? '$'), { path: '/' });

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

    useEffect(() => {
        // Create lookup object
        const lookup = measurementGuideData.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {});
        setMeasurementGuideDataLookup(lookup);
    }, []);

    const fetchData = async (e) => {
        try {
            const userData = await getUserData(e);
            if (userData.id) {
                setUser(userData);
                setProfileFormData(userData);
                setUserImage(userData.image);
                setBodyMeasurement(userData.body_measurement);
                setChecklistData(userData.body_measurement);
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

    useEffect(() => {
        var userCountry = profileFormData.country;

        if (userCountry && userCountry != "") {
            var data = {
                country: userCountry
            };
            setProvinces([]);
            setCities([]);

            getCountryStates(data);
        }
    }, [profileFormData.country]);

    useEffect(() => {
        var userCountry = profileFormData.country;
        var userProvince = profileFormData.province;

        if (userCountry && userCountry != "" && userProvince && userProvince != "") {
            var data = {
                country: userCountry,
                state: userProvince
            };
            setCities([]);

            getStateCities(data);
        }
    }, [profileFormData.country, profileFormData.province]);

    useEffect(() => {
        var userCity = profileFormData.city;

        if (userCity && userCity != "") {
            var data = userCity;
            getCoordinates(data);
        }
    }, [profileFormData.city]);

    return (
        <Layout>
            {userLoading ?
                <LoadingPage />
                :
                <section id='profile' className='py-5 px-5'>
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
                                            <h2 className='fs-25 mb-1'>
                                                {user.first_name || user.last_name ?
                                                    <span>{user.first_name} {user.last_name}</span>
                                                    :
                                                    <span>-</span>
                                                }
                                            </h2>
                                            <div className='icons-d-flex' style={{ columnGap: '5px' }}>
                                                <img src={PinIcon} className='mt-1' />
                                                {user.city || user.province || user.country ?
                                                    <p className='fs-14 color-light-blue'>
                                                        {user.province ? user.province + ',' : user.city ? user.city + ',' : ""} {user.country ? user.country : ""}
                                                        {/* {user.city ? user.city + ',' : ""} {user.province ? user.province + "," : ""} {user.country ? user.country : ""} */}
                                                    </p>
                                                    :
                                                    <p className='fs-14 color-light-blue'>-</p>
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
                                            {/* <p className={`cursor-pointer me-5 mb-3 fs-16 ${bodyMeasurementShow ? 'fw-600 text-gold' : 'text-black'}`} onClick={function () { showTab("body_measurement") }}>Body Measurement</p> */}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md="9" className='flex-grow-1 flex-shrink-0'>
                                    <Card className='h-100'>
                                        <Card.Body>
                                            {profileShow ?
                                                <div className="edit-profile">
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
                                                <div className='edit-address'>
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
                                                                <Form.Label>Country</Form.Label>
                                                                {/* <FormControl type='text' name='country' value={profileFormData.country} className='mr-sm-2' onChange={handleChange} required placeholder='' /> */}
                                                                <Form.Control as='select' name='country' value={profileFormData.country} className='mr-sm-2' onChange={handleChange} required>
                                                                    <option value='' disabled>Select Country</option>
                                                                    {Countries.map((country, index) => (
                                                                        <option key={country + "-" + index} value={country}>
                                                                            {country}
                                                                        </option>
                                                                    ))}
                                                                </Form.Control>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>State/Province</Form.Label>
                                                                {provincesLoading ?
                                                                    <>
                                                                        <Form.Control as='select' name='province' value="" className='mr-sm-2' disabled required>
                                                                            <option value='' selected>Loading...</option>
                                                                        </Form.Control>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {profileFormData.country && provinces && provinces.length > 0 ?
                                                                            <Form.Control as='select' name='province' value={profileFormData.province} className='mr-sm-2' onChange={handleChange} required>
                                                                                <option value='' disabled>Select Province</option>
                                                                                {provinces.map((province, index) => {
                                                                                    if (province.name != "American Samoa") {
                                                                                        return (
                                                                                            <option key={province.name + "-" + index} value={province.name} data-province-code={province.state_code}>
                                                                                                {province.name}
                                                                                            </option>
                                                                                        )
                                                                                    }
                                                                                })}
                                                                            </Form.Control>
                                                                            :
                                                                            <Form.Control as='select' name='province' value="" className='mr-sm-2' disabled required>
                                                                                <option value='' selected>Please select country first</option>
                                                                            </Form.Control>
                                                                        }
                                                                    </>
                                                                }
                                                            </Form.Group>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>City</Form.Label>
                                                                {citiesLoading ?
                                                                    <>
                                                                        <Form.Control as='select' name='city' value="" className='mr-sm-2' disabled required>
                                                                            <option value='' selected>Loading...</option>
                                                                        </Form.Control>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {profileFormData.province && cities && cities.length > 0 ?
                                                                            <Form.Control as='select' name='city' value={profileFormData.city} className='mr-sm-2' onChange={handleChange} required>
                                                                                <option value='' disabled>Select City</option>
                                                                                {cities.map((city, index) => (
                                                                                    <option key={city + "-" + index} value={cities.name}>
                                                                                        {city}
                                                                                    </option>
                                                                                ))}
                                                                            </Form.Control>
                                                                            :
                                                                            <Form.Control as='select' name='city' value="" className='mr-sm-2' disabled required>
                                                                                <option value='' selected>Please select a province first</option>
                                                                            </Form.Control>
                                                                        }
                                                                    </>
                                                                }
                                                            </Form.Group>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Form.Group className='mb-4'>
                                                                <Form.Label>Postal Code</Form.Label>
                                                                <FormControl type='number' name='postal_code' value={profileFormData.postal_code} className='mr-sm-2' onChange={handleChange} required placeholder='' />
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
                                                <div className="edit-contact">
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
                                                <div className="edit-social-media">
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
                                                <div className="edit-skills">
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
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(47)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="upper_neck_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.upper_neck_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Lower Neck Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(48)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="lower_neck_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.lower_neck_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Chest Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(49)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="chest_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.chest_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Waist Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(50)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="waist_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.waist_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Mid Hip Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(51)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="mid_hip_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.mid_hip_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Hip Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(52)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="hip_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.hip_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Front Waist Length </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(53)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="front_waist_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_waist_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Back Waist Length </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(54)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="back_waist_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_waist_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Center Front Length </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(55)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="center_front_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.center_front_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Center Back Length </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(56)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="center_back_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.center_back_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Front Neck Depth </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(57)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="front_neck_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_neck_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Back Neck Depth </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(58)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="back_neck_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_neck_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Armhole Depth </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(59)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="armhole_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.armhole_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Front Shoulder Width </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(60)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="front_shoulder_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_shoulder_width} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Back Shoulder Width </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(61)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="back_shoulder_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_shoulder_width} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Shoulder Depth </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(62)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="shoulder_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.shoulder_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Elbow Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(63)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="elbow_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.elbow_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Underarm Length </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(64)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="underarm_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.underarm_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Side Seam </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(65)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="side_seam" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.side_seam} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Sleeve Length </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(66)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="sleeve_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.sleeve_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Arm Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(67)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="arm_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.arm_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Wrist Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(68)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="wrist_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.wrist_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Elbow Length </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(69)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="elbow_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.elbow_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Armhole Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(70)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="armhole_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.armhole_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Sleeve Cap Height </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(71)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="sleeve_cap_height" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.sleeve_cap_height} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Hip Depth </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(72)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="hip_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.hip_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Crotch Depth </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(73)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="crotch_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.crotch_depth} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Pants/Trouser Length </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(74)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="pants_trouser_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.pants_trouser_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Knee Length </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(75)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="knee_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.knee_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>In Seam Length </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(76)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="in_seam_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.in_seam_length} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Thigh Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(77)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="thigh_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.thigh_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Mid-thigh Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(78)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="mid_thigh_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.mid_thigh_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Knee Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(79)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="knee_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.knee_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Calf Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(80)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="calf_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.calf_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Ankle Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(81)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="ankle_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.ankle_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Ankle-Heel Circumference </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(82)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="ankle_heel_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.ankle_heel_circumference} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Body Height </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(83)} />
                                                                        </Form.Group>
                                                                        <Form.Control name="body_height" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.body_height} />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Group>
                                                                            <Form.Label>Body Length </Form.Label>
                                                                            <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(84)} />
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
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(1)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="upper_neck_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.upper_neck_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Lower Neck Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(2)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="lower_neck_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.lower_neck_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Chest Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(3)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="chest_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.chest_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Bust Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(4)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="bust_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.bust_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Under Bust Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(5)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="under_bust_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.under_bust_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Waist Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(6)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="waist_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.waist_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Mid Hip Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(7)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="mid_hip_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.mid_hip_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Hip Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(8)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="hip_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.hip_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Bust Distance</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(9)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="bust_distance" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.bust_distance} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Front Chest Width</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(10)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="front_chest_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_chest_width} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Back Chest Width</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(11)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="back_chest_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_chest_width} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Front Waist Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(12)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="front_waist_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_waist_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Back Waist Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(13)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="back_waist_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_waist_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Center Front Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(14)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="center_front_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.center_front_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Center Back Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(15)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="center_back_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.center_back_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Front Neck Depth</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(16)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="front_neck_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_neck_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Back Neck Depth</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(17)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="back_neck_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_neck_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Bust Depth</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(18)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="bust_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.bust_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Armhole Depth</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(19)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="armhole_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.armhole_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Bust Height</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(20)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="bust_height" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.bust_height} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Front Shoulder Width</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(21)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="front_shoulder_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.front_shoulder_width} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Back Shoulder Width</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(22)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="back_shoulder_width" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.back_shoulder_width} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Shoulder Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(23)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="shoulder_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.shoulder_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Shoulder Depth</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(24)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="shoulder_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.shoulder_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Elbow Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(25)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="elbow_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.elbow_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Underarm Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(26)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="underarm_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.underarm_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Sleeve Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(27)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="sleeve_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.sleeve_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Arm Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(28)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="arm_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.arm_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Wrist Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(29)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="wrist_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.wrist_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Elbow Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(30)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="elbow_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.elbow_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Armhole Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(31)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="armhole_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.armhole_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Sleeve Cap Height</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(32)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="sleeve_cap_height" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.sleeve_cap_height} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Hip Depth</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(33)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="hip_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.hip_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Crotch Depth</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(34)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="crotch_depth" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.crotch_depth} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Crotch Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(35)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="crotch_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.crotch_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Pants Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(36)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="pants_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.pants_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Knee Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(37)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="knee_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.knee_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>In seam Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(38)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="in_seam_length" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.in_seam_length} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Thigh Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(39)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="thigh_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.thigh_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Mid Thigh Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(40)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="mid_thigh_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.mid_thigh_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Knee Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(41)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="knee_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.knee_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Calf Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(42)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="calf_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.calf_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Ankle Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(43)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="ankle_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.ankle_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Ankle Heel Circumference</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(44)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="ankle_heel_circumference" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.ankle_heel_circumference} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Body Height</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(45)} />
                                                                            </Form.Group>
                                                                            <Form.Control name="body_height" onChange={handleChangeBodyMeasurement} placeholder="" value={checklistData.body_height} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Group>
                                                                                <Form.Label>Body Length</Form.Label>
                                                                                <IoIosHelpCircleOutline size={20} className="question-btn" onClick={() => toggleMeasurementGuideModal(46)} />
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
                    </Container>
                </section>
            }

        </Layout>
    );
};

export default EditProfile;