import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import UserPlaceholder from 'Assets/images/placeholders/user.png';
import toast from 'react-hot-toast';
// import getShopByCategoryData from 'Utils/GetShopByCategoryData';
import getPortfolioData from 'Utils/GetPortfolioData';
import { BsThreeDots } from "react-icons/bs";
import { GoPencil, GoTrash, GoHeart, GoBookmark, GoPlus } from "react-icons/go";
import { IoDocumentOutline } from "react-icons/io5";
import Dresses from 'Assets/images/icons/dresses.png';
import Pants from 'Assets/images/icons/pants.png';
import Skirts from 'Assets/images/icons/skirts.png';
import Tops from 'Assets/images/icons/tops.png';

const ShopByCategory = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [designs, setShopByCategory] = useState([]);
    const [designsLoading, setShopByCategoryLoading] = useState(true);

    const fetchData = async (e) => {
        try {
          const designsData = await getPortfolioData(e);
          if (designsData) {
            setShopByCategory(designsData);
            setShopByCategoryLoading(false);
          } else {
            toast.error('An error occured. Please try again or contact the administrator.');
            setShopByCategoryLoading(false);
          }
          // Update state or perform other logic with userData
        } catch (error) {
            toast.error('An error occured. Please try again or contact the administrator.');
            setShopByCategoryLoading(false);
          // Handle the error, if needed
        }
    };

    const handleActionClick = (index) => {
        // Toggle the selected item index
        setSelectedItemIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const addDesigner = () => {
        navigate('/designs/add')
    }

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <>
            <div>
                <h2 className="fs-40 text-center text-black mb-5">Shop by Category</h2>
                <Row>
                    <Col className="category-grid mb-3" xs="4" md="3">
                        <Link className='text-decoration-none' to={`/category/dresses`}>
                            <div className="category-grid-div bg-light w-100">
                                <img src={Dresses} className="w-100" alt="Dresses" />
                            </div>
                            <h4 className='text-black text-center fs-25 fw-600 mt-3'>
                                Dresses
                            </h4>
                        </Link>
                    </Col>
                    <Col className="category-grid mb-3" xs="4" md="3">
                        <Link className='text-decoration-none' to={`/category/tops`}>
                            <div className="category-grid-div bg-light w-100">
                                <img src={Tops} className="w-100" alt="Tops" />
                            </div>
                            <h4 className='text-black text-center fs-25 fw-600 mt-3'>
                                Tops
                            </h4>
                        </Link>
                    </Col>
                    <Col className="category-grid mb-3" xs="4" md="3">
                        <Link className='text-decoration-none' to={`/category/pants`}>
                            <div className="category-grid-div bg-light w-100">
                                <img src={Pants} className="w-100" alt="Pants" />
                            </div>
                            <h4 className='text-black text-center fs-25 fw-600 mt-3'>
                                Pants
                            </h4>
                        </Link>
                    </Col>
                    <Col className="category-grid mb-3" xs="4" md="3">
                        <Link className='text-decoration-none' to={`/category/skirts`}>
                            <div className="category-grid-div bg-light w-100">
                                <img src={Skirts} className="w-100" alt="Skirts" />
                            </div>
                            <h4 className='text-black text-center fs-25 fw-600 mt-3'>
                                Skirts
                            </h4>
                        </Link>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ShopByCategory;