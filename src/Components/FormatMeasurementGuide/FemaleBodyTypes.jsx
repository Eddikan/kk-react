import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import femalebodytypes from 'Assets/images/female-body-types.png';
import InvertedTriangle from 'Assets/images/inverted-triangle.png';
import Rectangle from 'Assets/images/rectangle.png';
import HourGlass from 'Assets/images/hour-glass.png';
import Triangle from 'Assets/images/triangle.png';
import Round from 'Assets/images/round.png';


const FemaleBodyTypes = (props) => {
   

    return (
            <Row>
                
                <Col lg={12} className='mb-4'>
                    <div className='fs-30 fw-600 rufina-family'>Female Body Types</div>
                </Col>

                <Col lg={12} className='mb-4'>
                    <img src={femalebodytypes} className='body-type-image w-100'></img>
                </Col>

                <Col lg={12}>
                <table className='table-color'>
                    <tr>
                        <th className='p-3 fs-20'>BODY TYPE</th>
                        <th className='p-3 fs-20'>DESCRIPTION</th>
                        <th className='p-3 fs-20'>STYLE RECOMMENDATION</th>
                    </tr>
                    <tr>
                        <td className='text-center'><img src={InvertedTriangle}/></td>
                        
                        <td>
                            <span>The shoulders are wider than hips</span>
                        </td>

                        <td>
                            <ol>
                                <li>
                                    <p><strong>Minimize Shoulder Volume</strong>: Avoid garments that amplify shoulder width.</p>
                                </li>
                                <li>
                                    <p><strong>Direct Focus Away</strong>: Opt for attire that shifts attention from the shoulders.</p>
                                </li>
                                <li>
                                    <p><strong>Define Your Hips</strong>: Choose structured bottoms and outfits that accentuate the hip area.</p>
                                </li>
                                <li>
                                    <p><strong>Style Objective</strong>: Aim to amplify lower body volume while downplaying emphasis on the upper body.</p>
                                </li>
                            </ol>
                        </td>
                    </tr>

                    <tr>
                        <td className='text-center'><img src={Rectangle}/></td>
                        <td>The chest, waist and hips are equal in size</td>
                        <td>
                            <ol>
                                <li>
                                    <p><strong>Highlight Shoulders and Hips</strong>: Opt for clothing that accentuates your shoulder and hip areas.</p>
                                </li>
                                <li>
                                    <p><strong>Choose Structured Garments</strong>: Select outfits with a tailored, independent fit</p>
                                </li>
                                <li>
                                    <p><strong>Define Your Waist</strong>: Incorporate fitted belts to cinch and emphasize your waistline.</p>
                                </li>
                                <li>
                                    <p><strong>Style Objective</strong>: Achieve a balanced look by adding volume to both the upper and lower body while accentuating the waist.</p>
                                </li>
                            </ol>
                            </td>
                    </tr>

                    <tr>
                    <td className='text-center'><img src={HourGlass}/></td>
                        <td>The shoulders and waist are equally wide, with a narrow waist.</td>
                        <td>
                            <ol>
                                <li>
                                    <p><strong>Emphasize the Waist</strong>: Opt for clothing that directs attention to your waistline.</p>
                                </li>
                                <li>
                                    <p><strong>Strive for Balance</strong>: Ensure that your top and bottom halves complement each other evenly.</p>
                                </li>
                                <li>
                                    <p><strong>Avoid Imbalance</strong>: Overemphasizing one body area over the other can result in an uneven appearance.</p>
                                </li>
                                <li>
                                    <p><strong>Style Objective</strong>: Maintain proportional balance between your upper and lower body, with a focus on defining the waist for a polished look.</p>
                                </li>
                            </ol>
                        </td>
                    </tr>
                    <tr>
                    <td className='text-center'><img src={Triangle}/></td>
                        <td>The hips are wider than the shoulder</td>
                        <td>
                            <ol>
                                <li>
                                    <p><strong>Minimize Hip Attention</strong>: Choose clothing that doesn't emphasize the hips.</p>
                                </li>
                                <li>
                                    <p><strong>Opt for Embellished Tops</strong>: Select tops with eye-catching necklines or decorative elements.</p>
                                </li>
                                <li>
                                    <p><strong>Structured Jackets for Shoulder Emphasis</strong>: Incorporate jackets with shoulder pads to enhance your upper body.</p>
                                </li>
                                <li>
                                    <p><strong>Style Objective</strong>: Add volume to the upper body, define the waist, and reduce emphasis on the lower body for a balanced silhouette.</p>
                                </li>
                            </ol>
                        </td>
                    </tr>
                    <tr>
                        <td className='text-center'><img src={Round}/></td>
                        <td>There is no waistline and the stomach protrudes outwards.</td>
                        <td>
                        <ol>
                                <li>
                                    <p><strong>Direct Attention Strategically</strong>: Choose outfits that highlight the neck, bust, and legs.</p>
                                </li>
                                <li>
                                    <p><strong>Avoid Waistline Volume</strong>: Steer clear of clothing that adds bulk to the waist area.</p>
                                </li>
                                <li>
                                    <p><strong>Opt for Structured Wear</strong>: Select garments that offer support and define the waistline.</p>
                                </li>
                                <li>
                                    <p><strong>Style Objective</strong>: Emphasize the waist and create the illusion of a defined waistline for a polished appearance.</p>
                                </li>
                            </ol>
                        </td>
                    </tr>
                    
                    </table>
                </Col>
            </Row>
            );  
        };

export default FemaleBodyTypes;