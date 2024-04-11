import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button, Form, FormControl } from 'react-bootstrap';
import { Card, CardBody, CardFooter, ModalHeader, ModalBody, Modal } from 'reactstrap';
import NewPortfolioShopManager from 'Components/Forms/Portolio/NewPortfolioShopManager';
import { GoPlus } from "react-icons/go";
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Countries from 'Utils/Countries';

const UploadPortfolio = ({ user, currentUser, reload, token }) => {
    const navigate = useNavigate();
    const [uploadFileShow, setUploadFileShow] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);

    const toggleuploadFile = (e) => {
        e.preventDefault();
        setUploadFileShow(!uploadFileShow);
    }

    // const refreshPortfolio = (e) => {
    //     if (e) {
    //         setReloadCount(reloadCount + 1);
    //     }
    // }

    // const savePortfolioItems = (e) => {
    //     if (portfolioItems && portfolioItems.length > 0) {
    //         setPortfolioItems([...portfolioItems, e]);
    //     } else {
    //         setPortfolioItems([e]);
    //     }
    // }

    const addNewPortfolio = () => {
        navigate('/user/center/design/add')
    };
    

    return (
        <>
            {/* <div className='fs-25 rufina-family mb-4'>Upload at least one item on your portfolio</div> */}

            <Row className=" text-center my-5">
                <Col className='background-dashed p-5'>
                    <div className="mb-1 fs-20">
                        Upload your design
                    </div>
                    <div className="mb-4 fs-16 mt-1 small">
                        Showcase your best work, get feedback, likes, and join a growing community.
                    </div>
                    <div>
                    <Button className='btn-primary'
                        onClick={toggleuploadFile}
                        type="button"
                    >
                        Upload Your Design
                    </Button>
                    </div>
                </Col>
            </Row>


            <Modal
                isOpen={uploadFileShow}
                className='modal-preview'
                fade={false}
                style={{ minWidth: '1000px' }}
                centered
            >
                <ModalHeader className="pb-0">
                    <button type='button' className='close react-modal-close' onClick={toggleuploadFile} data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    <h2 className='modal-title fs-25 fw-600 text-center'>Upload your Design</h2>
                    <Card className="border-0">
                        <CardBody className="p-2">
                            <NewPortfolioShopManager 
                            // size="small" 
                            // withDraft={false} 
                            // onSuccess={refreshPortfolio} 
                            // onCancel={hideUpload} 
                            // onSave={savePortfolioItems} 
                            />
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>

            {/* <div onClick={addNewPortfolio} className="portfolio-grid-div add-more-box w-100 text-center cursor-pointer background-dashed">
                <GoPlus color="#a4a4a4" size="150px" className="mt-3" />
                <p className="text-dgray" style={{ marginTop: '-15px' }}>Add More</p>
            </div> */}
        </>
    )
}

export default UploadPortfolio;
