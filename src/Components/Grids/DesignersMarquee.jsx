import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MalePlaceholder from 'Assets/images/placeholders/male-placeholder.jpg';
import FemalePlaceholder from 'Assets/images/placeholders/female-placeholder.jpg';
import toast from 'react-hot-toast';
import { BsBroadcast } from "react-icons/bs";
import 'react-multi-carousel/lib/styles.css';
import { GoHeart } from 'react-icons/go';
import Loading from 'Components/Shared/Loading';
import Marquee from 'react-fast-marquee';
import axios from "axios";

const DesignersMarquee = (props) => {
    const navigate = useNavigate();
    const reloadCount = props.reloadCount;
    const currentUser = props.currentUser;
    const userRole = props.userRole;
    const [designers, setDesigners] = useState([]);
    const [designersLoading, setDesignersLoading] = useState(true);

    const getDesigners = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'designer');
    };

    const toggleGetUser = (e) => {
        window.location.href = "/designer-profile?user_id=" + e;
    }

    async function wishlistDesignerUpdate(e) {
        axios.post(process.env.REACT_APP_API_ENDPOINT + 'designer/wishlist/update', e).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
            } else {
                toast.error('Something went wrong, please contact the administrator!');
            }
        }).catch((error) => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    };

    useEffect(() => {
        getDesigners()
            .then((response) => {
                setDesignersLoading(false);
                const selectedDesigners = response.data.data;
                if (selectedDesigners) {
                    setDesigners(selectedDesigners);
                } else {
                    toast.error('There has been an error getting the designers, please try again!');
                    setDesignersLoading(false);
                }
            })
            .catch((error) => {
                toast.error('There has been an error getting the designers, please try again!');
                setDesignersLoading(false);
            });
    }, [reloadCount]);

    return (
        <>
            <div id="designers-marquee">
                {designersLoading ?
                    <>
                        <Loading className="bg-white"/>
                    </>
                    :
                    <>
                        {designers && designers.length > 0 ? (
                            <>
                                <Marquee>
                                    {designers.map((designer, index) => {
                                        var wishlist_user_ids = designer.wishlist_user_ids ?? [];
                                        const userWishlist = wishlist_user_ids.includes(currentUser);
                                        return (
                                            <>
                                                {designer.user.image && designer.user.image != "" ?
                                                    <div className="marquee-item">
                                                        <div onClick={() => toggleGetUser(designer.user.id)} className="designer-marquee cursor-pointer" style={{ backgroundImage: `url(${process.env.REACT_APP_STORAGE_URL}user/${designer.user.image})`}}>
                                                            
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                                    
                                                }
                                            </>
                                        )
                                    })}
                                    
                                </Marquee>
                            </>
                        ) : (
                            <p className="text-center mb-3 mt-3">No records found.</p>
                        )}
                    </>
                }
            </div>
        </>
    );
};

export default DesignersMarquee;