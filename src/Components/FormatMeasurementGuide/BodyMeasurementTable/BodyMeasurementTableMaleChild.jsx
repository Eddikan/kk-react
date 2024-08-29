import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutNoFooter from 'Components/Layout/LayoutNoFooter';
import { Container, Row, Col, Button, Modal, Card, Form } from 'react-bootstrap';
import 'Assets/styles/FormatMeasurementGuide/style.css';



const BodyMeasurementTableMaleChild = (props) => {


    return (
        <Row>
            <Col lg={12} className='mb-4'>
                <div>
                    <div className='rufina-family fs-30 fw-600 mb-3'>Body Measurement Table - Male Child</div>
                </div>

                <div className='mb-4'>
                    <Card>
                        <Card.Body>
                            <p className='mb-0'>Download and print a copy of this body measurement table to accurately record your measurements. Alternatively, you can enter your measurements directly into the table. Please indicate your chosen unit of measurement by circling it on the chart.</p>
                        </Card.Body>
                    </Card>
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
                        <td>Upper Neck Circumference</td>
                        <td>A1</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className='text-center'>2</td>
                        <td>Lower Neck Circumference</td>
                        <td>A</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className='text-center'>3</td>
                        <td>Chest Circumference</td>
                        <td>C</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className='text-center'>4</td>
                        <td>Waist Circumference</td>
                        <td>D</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className='text-center'>5</td>
                        <td>Mid Hip Circumference</td>
                        <td>E</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className='text-center'>6</td>
                        <td>Hip Circumference</td>
                        <td>F</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>7</td>
                        <td>Front Waist Length</td>
                        <td>Front M-D</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>8</td>
                        <td>Back Waist Length</td>
                        <td>Back M-D</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>9</td>
                        <td>Center Front Length</td>
                        <td>Front A-D</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>10</td>
                        <td>Center Back Length</td>
                        <td>Back A-D</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>11</td>
                        <td>Front Neck Depth</td>
                        <td>A - Desired Length</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>12</td>
                        <td>Back Neck Depth</td>
                        <td>A - Desired Length</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>13</td>
                        <td>Armhole Depth</td>
                        <td>N-C Line</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>14</td>
                        <td>Back Shoulder Width</td>
                        <td>Back N-N</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>15</td>
                        <td>Front Shoulder Width</td>
                        <td>Front N-N</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>16</td>
                        <td>Back Width</td>
                        <td>Back C-C</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>17</td>
                        <td>Shoulder Length</td>
                        <td>M-N</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>18</td>
                        <td>Shoulder Depth</td>
                        <td>A-N</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>19</td>
                        <td>Elbow Circumference</td>
                        <td>P</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>20</td>
                        <td>Under Arm Length</td>
                        <td>C-P-Q</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>21</td>
                        <td>Side Seam Length</td>
                        <td>C-D</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>22</td>
                        <td>Sleeve Length</td>
                        <td>N-P-Q</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>23</td>
                        <td>Arm Circumference</td>
                        <td>O</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>24</td>
                        <td>Wrist Circumference</td>
                        <td>Q</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>25</td>
                        <td>Elbow Length</td>
                        <td>N-P</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>26</td>
                        <td>Armhole Circumference</td>
                        <td>Around N</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>27</td>
                        <td>Sleeve Cap Height </td>
                        <td>N -O</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>28</td>
                        <td>Hip Depth</td>
                        <td>Side D-F</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>29</td>
                        <td>Crotch Depth</td>
                        <td>Front D-F</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>30</td>
                        <td>Crotch Length</td>
                        <td>Front D-D Back</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>31</td>
                        <td>Trouser Length</td>
                        <td>Side D-L</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>32</td>
                        <td>Knee Length</td>
                        <td>Side D-I</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>33</td>
                        <td>Inner Trouser Length</td>
                        <td>F-L</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>34</td>
                        <td>Thigh Circumference</td>
                        <td>G</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>35</td>
                        <td>Mid-Thigh Circumference</td>
                        <td>H</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>36</td>
                        <td>Knee Circumference</td>
                        <td>I</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>37</td>
                        <td>Calf Circumference</td>
                        <td>J</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>38</td>
                        <td>Ankle Circumference</td>
                        <td>K</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>39</td>
                        <td>Head Length</td>
                        <td>Forehead A3-A1</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>40</td>
                        <td>Head Circumference</td>
                        <td>Around Head A3</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>41</td>
                        <td>Head Height</td>
                        <td>A2-A1</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>42</td>
                        <td>Body Height</td>
                        <td>A2-L</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>43</td>
                        <td>Body Length</td>
                        <td>A1-L</td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>44</td>
                        <td>Body Type</td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className='text-center'>45</td>
                        <td>Body Size (S-M-L)</td>
                        <td>
                            <td>Chest</td>
                            <td>Waist</td>
                            <td>Hips</td>
                        </td>
                        <td></td>
                    </tr>
                </table>
            </Col>
        </Row>
    );
};

export default BodyMeasurementTableMaleChild;