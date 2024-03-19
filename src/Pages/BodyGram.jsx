import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import frontPhoto from 'Assets/images/bodygram/front.jpg';
import rightPhoto from 'Assets/images/bodygram/right.jpg';
import axios from 'axios';
import ResponsiveIframe from 'Components/Shared/ResponsiveIframe';

const BodyGram = () => {
    const [frontPhotoBase64, setFrontPhotoBase64] = useState('');
    const [rightPhotoBase64, setRightPhotoBase64] = useState('');
    const [iframeToken, setIframeToken] = useState('');
    const orgId = process.env.REACT_APP_ORG_ID;
    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        const tokenUrl = `https://platform.bodygram.com/api/orgs/${orgId}/scan-tokens`;

        const headers = {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
        };

        const data = {
            customScanId: 'myFirstScan',
            photoScan: {
                age: 29,
                weight: 54000,
                height: 1640,
                gender: 'female',
                frontPhoto: frontPhotoBase64,
                rightPhoto: rightPhotoBase64,
            },
        };

        const scanData = {
            scope: [
                'api.platform.bodygram.com/scans:create',
                'api.platform.bodygram.com/scans:read'
            ]
        };

        axios.post(tokenUrl, scanData, { headers: headers })
            .then((response) => {
                const returnData = response.data;
                const token = returnData.token;
                if (token) {
                    setIframeToken(token);
                }
            })
            .catch((error) => {
                console.error('Request failed:', error);
            });

        // if (frontPhotoBase64 && rightPhotoBase64 ) {
        //     const url = `https://platform.bodygram.com/api/orgs/${orgId}/scans`;
        //     const tokenUrl = `https://platform.bodygram.com/api/orgs/${orgId}/scan-tokens`;

        //     const headers = {
        //         'Authorization': apiKey,
        //         'Content-Type': 'application/json',
        //     };

        //     const data = {
        //         customScanId: 'myFirstScan',
        //         photoScan: {
        //             age: 29,
        //             weight: 54000,
        //             height: 1640,
        //             gender: 'female',
        //             frontPhoto: frontPhotoBase64,
        //             rightPhoto: rightPhotoBase64,
        //         },
        //     };

        //     const scanData = {
        //         scope: [
        //             'api.platform.bodygram.com/scans:create',
        //             'api.platform.bodygram.com/scans:read'
        //         ]
        //     };

        //     // axios.post(url, data, { headers: headers })
        //     //     .then((response) => {
        //     //         console.log('Request successful:', response.data);
        //     //     })
        //     //     .catch((error) => {
        //     //         console.error('Request failed:', error);
        //     //     });

        //     axios.post(tokenUrl, scanData, { headers: headers })
        //         .then((response) => {
        //             const returnData = response.data;
        //             const token = returnData.token;
        //             if (token) {
        //                 setIframeToken(token);
        //             }
        //         })
        //         .catch((error) => {
        //             console.error('Request failed:', error);
        //         });

        // } else {
        //     const convertImageToBase64 = (imageURL) => {
        //         fetch(imageURL)
        //             .then(response => response.blob())
        //             .then(blob => {
        //                 const reader = new FileReader();
        //                 reader.readAsDataURL(blob);
        //                 reader.onload = () => {
        //                     const base64String = reader.result;
        //                     console.log('Base64 string:', base64String);
        //                     if (imageURL === frontPhoto) {
        //                         setFrontPhotoBase64(base64String);
        //                     } else if (imageURL === rightPhoto) {
        //                         setRightPhotoBase64(base64String);
        //                     }
        //                 };
        //                 reader.onerror = (error) => console.error('Error converting image to base64:', error);
        //             })
        //             .catch(error => console.error('Error fetching image:', error));
        //     };

        //     convertImageToBase64(frontPhoto);
        //     convertImageToBase64(rightPhoto);
        // }


    }, []);

    return (
        <div>
            {iframeToken && (
                <Card>
                    <Card.Body>
                        <ResponsiveIframe src={`https://platform.bodygram.com/en/${orgId}/scan?token=${iframeToken}&system=metric`} />
                    </Card.Body>
                </Card>
            )
            }
        </div>
    );
};

export default BodyGram;
