import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import UpperNeck from 'Assets/images/upper-neck-circumference.png';
import LowerNeck from 'Assets/images/lower-neck-circumference.png';
import ChestCircumference from 'Assets/images/chest-circumference.png';
import BustCircumference from 'Assets/images/bust-circumference.png';
import UnderBustCircumference from 'Assets/images/under-bust-circumference.png';
import WaistCircumference from 'Assets/images/waist-circumference.png';
import MidHipCircumference from 'Assets/images/mid-hip-circumference.png';
import HipCircumference from 'Assets/images/hip-circumference.png';
import BustDistance from 'Assets/images/bust-distance.png';
import FrontChestWidth from 'Assets/images/front-chest-width.png';
import BackChestWidth from 'Assets/images/back-chest-width.png';
import FrontWaistLength from 'Assets/images/front-waist-length.png';
import BackWaistLength from 'Assets/images/back-waist-length.png';
import CenterFrontLength from 'Assets/images/center-front-length.png';
import CenterBackLength from 'Assets/images/center-back-length.png';
import FrontNeckDepth from 'Assets/images/front-neck-depth.png';
import BackNeckDepth from 'Assets/images/back-neck-depth.png';
import BustDepthRadius from 'Assets/images/bust-depth-radius.png';
import ArmholeDepth from 'Assets/images/armhole-depth.png';
import BustHeight from 'Assets/images/bust-height.png';
import FrontShoulderWidth from 'Assets/images/front-shoulder-width.png';
import BackShoulderWidth from 'Assets/images/back-shoulder-width.png';
import ShoulderLength from 'Assets/images/shoulder-length.png';
import ShoulderDepth from 'Assets/images/shoulder-depth.png';
import ElbowCircumference from 'Assets/images/elbow-circumference.png';
import UnderarmLength from 'Assets/images/underarm-length.png';



import SleeveLength from 'Assets/images/sleeve-length.png';
import ArmCircumference from 'Assets/images/arm-circumference.png';
import WristCircumference from 'Assets/images/wrist-circumference.png';
import ElbowLength from 'Assets/images/elbow-length.png';
import ArmholeCircumference from 'Assets/images/armhole-circumference.png';
import SleeveCapHeight from 'Assets/images/sleeve-cap-height.png';
import HipDepth from 'Assets/images/hip-depth.png';
import CrotchDepth from 'Assets/images/crotch-depth.png';
import CrotchLength from 'Assets/images/crotch-length.png';
import PantsTrouserLength from 'Assets/images/pants-trouser-length.png';
import KneeLength from 'Assets/images/knee-length.png';
import InSeamLength from 'Assets/images/in-seam-length.png';
import ThighCircumference from 'Assets/images/thigh-circumference.png';
import MidthighCircumference from 'Assets/images/mid-thigh-circumference.png';
import KneeCircumference from 'Assets/images/knee-circumference.png';
import CalfCircumference from 'Assets/images/calf-circumference.png';
import AnkleCircumference from 'Assets/images/ankle-circumference.png';
import AnkleHeelCircumference from 'Assets/images/ankle-heel-circumference.png';
import BodyHeight from 'Assets/images/body-height.png';
import BodyLength from 'Assets/images/body-length.png';







const BodyMeasurementDescriptionWomen = (props) => {
   

    return (
            <Row>
                
                <Col lg={12} className='mb-4'>
                    <div className='fs-30 fw-600 rufina-family'>Body Measurement Descriptions for Women</div>
                </Col>

                <Col lg={12} className='mb-4'>
                <table className='w-100'>
                    <tr>
                        <td className='text-center'>
                            <img src={UpperNeck}/>
                        </td>

                        <td className='text-center'>
                            <strong>Upper Neck Circumference***
                            : (Reference Point A)
                            </strong>:  
                            <br/>
                            Measure upper portion of the neck.
                        </td>

                        <td className='text-center'>
                             <img src={LowerNeck}/>
                        </td>
                        <td className='text-center'>
                            <strong>Lower Neck Circumference*** (Reference Point A1)</strong>
                            : 
                            <br/>
                            Measure the base of the lower portion of the neck.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={ChestCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Chest Circumference*** (Reference Point Line C)</strong>
                            : 
                            <br/>
                            Measure around the chest from back to front keeping the tape runs parallel to the floor.
                        </td>


                        <td className='text-center'>
                             <img src={BustCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Bust Circumference*** (Reference Line C1)</strong>
                            : 
                            <br/>
                            Measure around the fullest part of the breast from back to front keeping the tape parallel to the floor.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={UnderBustCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Under Bust Circumference*** (Reference Line C2)</strong>
                            : 
                            <br/>
                            Measure under the bust from back to front keeping the tape parallel to the ground.
                        </td>

                        <td className='text-center'>
                             <img src={WaistCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Waist Circumference*** (Reference Line D)</strong>
                            : 
                            <br/>
                            Measure around the narrowest part of the waist from back to front ensuring the tape is parallel to the floor.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={MidHipCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Mid Hip Circumference*** (Reference Line E)</strong>
                            : 
                            <br/>
                            Measure around the area between the widest part of  the hip and the waist line.
                        </td>

                        <td className='text-center'>
                             <img src={HipCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Hip Circumference*** (Reference Line F)</strong>
                            : 
                            <br/>
                            Measure around the widest part of the hip.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={BustDistance}/>
                        </td>
                        <td className='text-center'>
                            <strong>Bust Distance (Reference Points C3 - C5)</strong>
                            : 
                            <br/>
                            Measure from the nipple point of one breast to the nipple of the other.
                        </td>

                        <td className='text-center'>
                             <img src={FrontChestWidth}/>
                        </td>
                        <td className='text-center'>
                            <strong>Front Chest Width (Reference Points C6 - C7)</strong>
                            : 
                            <br/>
                            Measure the distance from one armpit to the other.
                        </td>
                    </tr>




                    <tr>
                        <td className='text-center'>
                             <img src={BackChestWidth}/>
                        </td>
                        <td className='text-center'>
                            <strong>Back Chest Width (Reference Points C6 - C7)</strong>
                            : 
                            <br/>
                            Measure the distance from one armpit to the other.
                        </td>

                        <td className='text-center'>
                             <img src={FrontWaistLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Front Waist Length (Reference Point M to Line D)</strong>
                            : 
                            <br/>
                            Measure from the base of  the neck to the front waistline mark, passing the tape over the bust.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={BackWaistLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Back Waist Length (Reference Point M to Line D)</strong>
                            : 
                            <br/>
                            Measure from the base of  the neck to the back waistline mark.
                        </td>

                        <td className='text-center'>
                             <img src={CenterFrontLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Center Front Length (Reference Point A1 to Front Line D)</strong>
                            : 
                            <br/>
                            Measure from the center of  the front neck down to the center of the front waistline mark.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={CenterBackLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Center Back Length  (Reference Point A1 to Back Line D)</strong>
                            : 
                            <br/>
                            Measure from the center of  the back neck down to the center of the back waistline mark.
                        </td>

                        <td className='text-center'>
                             <img src={FrontNeckDepth}/>
                        </td>
                        <td className='text-center'>
                            <strong>Front Neck Depth (Reference Point M to the desired length)</strong>
                            : 
                            <br/>
                            Measure from the front shoulder starting at the base of the neck to your desired front neck depth.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={BackNeckDepth}/>
                        </td>
                        <td className='text-center'>
                            <strong>Back Neck Depth (Reference Point A1 to your desired length)</strong>
                            : 
                            <br/>
                            Measure from the base of the neck to the desired back neck depth.
                        </td>

                        <td className='text-center'>
                             <img src={BustDepthRadius}/>
                        </td>
                        <td className='text-center'>
                            <strong>Bust Depth/Radius (Reference Point C3 - C4)</strong>
                            : 
                            <br/>
                            Measure from the nipple point on the bust down to under the bust.
                        </td>
                    </tr>



                    <tr>
                        <td className='text-center'>
                             <img src={ArmholeDepth}/>
                        </td>
                        <td className='text-center'>
                            <strong>Armhole Depth (Reference Point N to under the armpit line on line C)</strong>
                            : 
                            <br/>
                            With a ruler placed under the armpit, measure from the tip of the shoulder bone to the armpit, touching the ruler.

                        </td>

                        <td className='text-center'>
                             <img src={BustHeight}/>
                        </td>
                        <td className='text-center'>
                            <strong>Bust Height (Reference Point M - Line C3)</strong>
                            : 
                            <br/>
                            Measure from the front shoulder at the base of the neck to the highest point of the bust.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={FrontShoulderWidth}/>
                        </td>
                        <td className='text-center'>
                            <strong>Front Shoulder Width (Reference Point N - N)</strong>
                            : 
                            <br/>
                            Request your assistant to place one end of a tape measure flat against one shoulder point. Then, have them extend the tape measure across your front, tracing the natural curve of your shoulders, until it reaches the opposite shoulder point.

                        </td>

                        <td className='text-center'>
                             <img src={BackShoulderWidth}/>
                        </td>
                        <td className='text-center'>
                            <strong>Back Shoulder Width (Reference Point N - N)</strong>
                            : 
                            <br/>
                            Request your assistant to place one end of a tape measure flat against one shoulder point. Then, have them extend the tape measure across your back, tracing the natural curve of your shoulders, until it reaches the opposite shoulder point.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={ShoulderLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Shoulder Length (Reference Point M - N)</strong>
                            : 
                            <br/>
                            Measure along the front from base of neck to the shoulder point.

                        </td>

                        <td className='text-center'>
                             <img src={ShoulderDepth}/>
                        </td>
                        <td className='text-center'>
                            <strong>Shoulder Depth (Reference point A1 - back line point N)</strong>
                            : 
                            <br/>
                            Measure from the nape down to the line that meets the shoulder point.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={ElbowCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Elbow Circumference*** (Reference Point P)</strong>
                            : 
                            <br/>
                            With your arm slightly bent and hand resting on your hip, measure around the elbow

                        </td>

                        <td className='text-center'>
                             <img src={UnderarmLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Underarm  Length (Lince C - Reference point Q)</strong>
                            : 
                            <br/> 
                            With your arm slightly bent and hand resting on your hip, measure from the armpit to the wrist.
                        </td>
                    </tr>
                    


                    <tr>
                        <td className='text-center'>
                             <img src={SleeveLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Sleeve Length (Reference Points N - P - O)</strong>
                            : 
                            <br/>
                            While the arm is bent, measure from the tip of the shoulder point to the wrist mark, ensuring the measurement passes through the elbow.

                        </td>

                        <td className='text-center'>
                             <img src={ArmCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Arm Circumference*** (Reference Point O)</strong>
                            : 
                            <br/>
                            Measure the widest part of the upper arm.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={WristCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Wrist Circumference*** (Reference Point Q)</strong>
                            : 
                            <br/>
                            Measure the narrowest area of the wrist.

                        </td>

                        <td className='text-center'>
                             <img src={ElbowLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Elbow Length (Reference Point N - P)</strong>
                            : 
                            <br/>
                            While the arm is bent, measure from the tip of the shoulder point to the tip of the elbow bone.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={ArmholeCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Armhole Circumference*** (Reference Point N - C6)</strong>
                            : 
                            <br/>
                            Measure around the armhole passing over the shoulder point and under the armpit.
                        </td>

                        <td className='text-center'>
                             <img src={SleeveCapHeight}/>
                        </td>
                        <td className='text-center'>
                            <strong>Sleeve Cap Height (Reference Point N - O)</strong>
                            : 
                            <br/> 
                            Measure from the tip of the shoulder bone to the widest part of the arm, just below the armpit.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={HipDepth}/>
                        </td>
                        <td className='text-center'>
                            <strong>Hip Depth ( Reference Point Side line mark D - F)</strong>
                            : 
                            <br/>
                            Measure from the waistline to a point on the widest part of the hip.
                        </td>

                        <td className='text-center'>
                             <img src={CrotchDepth}/>
                        </td>
                        <td className='text-center'>
                            <strong>Crotch Depth (Reference Point D - F)</strong>
                            : 
                            <br/>
                            Take this measurement while sitting straight. Measure from the side waist point, to the surface of the seat.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={CrotchLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Crotch Length ( Reference Point Front D - F - back D)</strong>
                            : 
                            <br/>
                            Measure from the center front waistline to the center back waist line passing the measuring tape in between the thighs.
                        </td>

                        <td className='text-center'>
                             <img src={PantsTrouserLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Pants/Trouser Length ( Reference Point D - L)</strong>
                            : 
                            <br/>
                            Measure from the waistline to the desired pant/trouser length.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={KneeLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Knee Length (Reference Point D - I)</strong>
                            : 
                            <br/>
                            Measure from the waist to the narrowest part of the knee.
                        </td>

                        <td className='text-center'>
                             <img src={InSeamLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>In Seam Length (Reference Point F - L)</strong>
                            : 
                            <br/>
                            Measure from the crotch to the feet.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={ThighCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Thigh Circumference*** (Line G)</strong>
                            : 
                            <br/>
                            Measure the widest portion of the thigh.
                        </td>

                        <td className='text-center'>
                             <img src={MidthighCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Mid-thigh Circumference*** (Line H)</strong>
                            : 
                            <br/>
                            Measure around the mid-point of the thigh, between the upper thigh and the knee.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={KneeCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Knee Circumference*** (Line I)</strong>
                            : 
                            <br/>
                            Measure around the narrowest part of the knee.
                        </td>

                        <td className='text-center'>
                             <img src={CalfCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Calf Circumference*** (Line J)</strong>
                            : 
                            <br/>
                            Measure the widest part of each calf, as there may be asymmetry between them. Record the measurement for the widest calf.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={AnkleCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Ankle Circumference*** (Line K)</strong>
                            : 
                            <br/>
                            Measure around the narrowest part of the ankle.
                        </td>

                        <td className='text-center'>
                             <img src={AnkleHeelCircumference}/>
                        </td>
                        <td className='text-center'>
                            <strong>Ankle-Heel Circumference*** (Line K1)</strong>
                            : 
                            <br/>
                            Measure around the heel and ankle.
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'>
                             <img src={BodyHeight}/>
                        </td>
                        <td className='text-center'>
                            <strong>Body Height (Reference Point A0 - L)</strong>
                            : 
                            <br/>
                            Ask your partner to gently mark the wall with colored tape where the ruler, book, or another flat object meets your head while you stand against the wall. Use a tape measure, preferably a metal one for accuracy, to measure the distance from the floor to the mark on the wall.
                        </td>

                        <td className='text-center'>
                             <img src={BodyLength}/>
                        </td>
                        <td className='text-center'>
                            <strong>Body Length (Reference Point A1 - L)</strong>
                            : 
                            <br/>
                            Ask your partner to gently mark the wall with colored tape where the ruler, book, or another flat object meets your nape while you stand against the wall. Use a tape measure, preferably a metal one for accuracy, to measure the distance from the floor to the mark on the wall.
                        </td>
                    </tr>
                   
                    </table>
                </Col>
            </Row>
            );  
        };

export default BodyMeasurementDescriptionWomen;