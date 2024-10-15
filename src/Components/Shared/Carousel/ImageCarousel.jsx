import React, { useRef, useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Row, Col } from 'react-bootstrap';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import 'Assets/styles/Carousel/image-slider.css';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

const ImageSlider = (props) => {
    const images = props.images;
    const finalProductImages = props.finalProductImages;
    const type = props.type ?? 'portfolio';

    const [allImages, setAllImages] = useState([]);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    useEffect(() => {
        if (finalProductImages && finalProductImages.length > 0) {
            const combinedImages = [...images, ...finalProductImages];
            setAllImages(combinedImages);
        } else {
            setAllImages(images);
        }
        if (thumbsSwiper && thumbsSwiper.slideTo) {
            thumbsSwiper.slideTo(0);
        }
    }, [images, finalProductImages, thumbsSwiper]);

    return (
        <div className="parent">
            <Row>
                <Col lg="2">
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={6}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper"
                        direction="vertical"
                        initialSlide={0}
                        >
                        {allImages.map((image, index) => (
                            <>
                                {index == 0 ?
                                    <SwiperSlide className="swiper-slide-thumb-active side-swiper" key={index}>
                                        {type == 'product' ?
                                            <div className="slider-image cursor-pointer side-slider-image" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")" }}></div>
                                            :
                                            <div className="slider-image cursor-pointer side-slider-image" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image.image_url + ")" }}></div>
                                        }
                                    </SwiperSlide>
                                    :
                                    <SwiperSlide key={index}  className="side-swiper">
                                        {type == 'product' ?
                                            <div className="slider-image cursor-pointer side-slider-image" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")" }}></div>
                                            :
                                            <div className="slider-image cursor-pointer side-slider-image" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image.image_url + ")" }}></div>
                                        }
                                    </SwiperSlide>
                                }
                            </>
                        ))}
                    </Swiper>
                </Col>
                <Col lg="10">
                    <Swiper
                        style={{
                            '--swiper-navigation-color': '#fff',
                            '--swiper-pagination-color': '#fff',
                        }}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper2"
                        initialSlide={0}
                    >
                        {allImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                {type == 'product' ?
                                    <div className="slider-image cursor-pointer" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")" }}></div>
                                    :
                                    <div className="slider-image cursor-pointer" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image.image_url + ")" }}></div>
                                }
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Col>
            </Row>
        </div>
    );
};

export default ImageSlider;
