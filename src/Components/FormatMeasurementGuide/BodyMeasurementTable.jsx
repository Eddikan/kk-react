import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import 'Assets/styles/FormatMeasurementGuide/style.css';



const BodyMeasurementTable = (props) => {
   

    return (
            <Row>
                <Col lg={12} className='mb-4'>
                    <div>
                            <div className='rufina-family fs-30 fw-600 mb-3'>Body Measurement Table</div>
                            <p className='mb-3'>Download and print a copy of this body measurement table to accurately record your measurements. Alternatively, you can enter your measurements directly into the table. Please indicate your chosen unit of measurement by circling it on the chart.</p>
                    </div>

                    <table className='w-100'>
                        <tr>
                            <th></th>
                            <th className='p-3 fs-20'>BODY AREA</th>
                            <th className='p-3 fs-20'>REFERENCE POINT</th>
                            <th className='p-3 fs-20'>RECORD YOUR MEASUREMENT inches / cm</th>
                        </tr>
                        <tr>
                            <td className='text-center'>1</td>
                            <td>Upper Neck Circumference***</td>
                            <td>A</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className='text-center'>2</td>
                            <td>Lower Neck Circumference***</td>
                            <td>A1</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className='text-center'>3</td>
                            <td>Chest Circumference***</td>
                            <td>C</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className='text-center'>4</td>
                            <td>Bust Circumference***</td>
                            <td>C1</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className='text-center'>5</td>
                            <td>Under Bust Circumference*** </td>
                            <td>C2</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className='text-center'>6</td>  
                            <td>Waist Circumference***</td>
                            <td>D</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>7</td>  
                            <td>Mid Hip Circumference***</td>
                            <td>E</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>8</td>  
                            <td>Hip Circumference***</td>
                            <td>F</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>9</td>  
                            <td>Bust Distance</td>
                            <td>C3 - C5</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>10</td>  
                            <td>Front Chest Width</td>
                            <td>C6 - C7 (Front)</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>11</td>  
                            <td>Back Chest Width</td>
                            <td>C6 - C7 (Back)</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>12</td>  
                            <td>Front Waist Length</td>
                            <td>M - Line mark D (Front)</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>13</td>  
                            <td>Back Waist Length</td>
                            <td>M - Line mark D (Back)</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>14</td>  
                            <td>Center Front Length</td>
                            <td>A1 - D (Front)</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>15</td>  
                            <td>Center Back Length</td>
                            <td>A1 - D (Back)</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>16</td>  
                            <td>Front Neck Depth</td>
                            <td>A1 - desired length</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>17</td>  
                            <td>Back Neck Depth</td>
                            <td>A1 - desired length</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>18</td>  
                            <td>Bust Depth/Radius</td>
                            <td>C3 - C4</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>19</td>  
                            <td>Armhole Depth</td>
                            <td>NC Line</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>20</td>  
                            <td>Bust Height</td>
                            <td>AN - C3 Line</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>21</td>  
                            <td>Front Shoulder Width</td>
                            <td>N - N (Front)</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>22</td>  
                            <td>Back Shoulder Width </td>
                            <td>N- N (Back)</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>23</td>  
                            <td>Shoulder Length</td>
                            <td>M - N</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>24</td>  
                            <td>Shoulder Depth</td>
                            <td>A1 - M</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>25</td>  
                            <td>Elbow Circumference***</td>
                            <td>P</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>26</td>  
                            <td>Under Arm  Length</td>
                            <td>Line C - Q</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>27</td>  
                            <td>Sleeve Length</td>
                            <td>N - P - O</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>28</td>  
                            <td>Arm Circumference***</td>
                            <td>O</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>29</td>  
                            <td>Wrist Circumference***</td>
                            <td>Q</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>30</td>  
                            <td>Hand Circumference***</td>
                            <td>Line R</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>31</td>  
                            <td>Elbow Length</td>
                            <td>N - P</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>32</td>  
                            <td>Armhole Circumference***</td>
                            <td>N - Line C</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>33</td>  
                            <td>Sleeve Cap Height</td>
                            <td>N - O</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>34</td>  
                            <td>Hip Depth</td>
                            <td>D - F (side)</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>35</td>  
                            <td>Crotch Depth</td>
                            <td>D - F (mid-line)</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>36</td>  
                            <td>Crotch Length</td>
                            <td>Front D - F - Back D</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>37</td>  
                            <td>Pants/Trouser Length</td>
                            <td>D - L</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>38</td>  
                            <td>Knee Length</td>
                            <td>D - L</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>39</td>  
                            <td>In Seam Length</td>
                            <td>F - L</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>40</td>  
                            <td>Thigh Circumference***</td>
                            <td>G</td>
                            <td></td>
                        </tr> 

                        <tr>
                            <td className='text-center'>41</td>  
                            <td>Mid-thigh Circumference***</td>
                            <td>H</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>42</td>  
                            <td>Knee Circumference***</td>
                            <td>I</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>43</td>  
                            <td>Calf Circumference***</td>
                            <td>J</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>44</td>  
                            <td>Ankle Circumference***</td>
                            <td>K</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>45</td>  
                            <td>Ankle-Heel Circumference***</td>
                            <td>K1</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>46</td>  
                            <td>Body Height</td>
                            <td>A0 - L</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>47</td>  
                            <td>Body Length</td>
                            <td>A1 - L</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td className='text-center'>48</td>  
                            <td>Body Type</td>
                            <td>See Female Body Type Diagram</td>
                            <td></td>
                        </tr>
                        </table>
                </Col>
            </Row>
            );  
        };

export default BodyMeasurementTable;