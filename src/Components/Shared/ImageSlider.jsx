import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "Assets/styles/ImageSlider/style.css";
const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 767, min: 464 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    }
};

const ImageSlider = (props) => {
    const images = props.images;
    const type = props.type ?? 'portfolio';

    const handleActiveImageChange = (image) => {
        props.onActiveImageChange(image);
        // You can perform additional actions when the active image changes
    };

    useEffect(() => {
        // Set the initial active image when images change
        if (images && images.length > 0) {
            props.onActiveImageChange(images[0]);
        }
    }, [images]);

    return (
        <div className="parent">
            <Carousel
                responsive={responsive}
                autoPlay={true}
                autoPlaySpeed={3000}
                swipeable={true}
                draggable={true}
                showDots={false}
                infinite={true}
                partialVisible={false}
                // beforeChange={(current, next) => handleActiveImageChange(images[next])}
                removeArrowOnDeviceType={['tablet', 'mobile', 'desktop']}
                dotListClass="custom-dot-list-style"
            >
                {images.map((image, index) => {
                    return (
                        <div className="slider" key={index}>
                            {type == 'product' ?
                                <div className="slider-image" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'product/'+image.image_url+")"}}>

                                </div>
                                :
                                <div className="slider-image" style={{ backgroundImage: "url("+process.env.REACT_APP_STORAGE_URL+'portfolio/'+image.image_url+")"}}>

                                </div>
                            }
                            
                        </div>
                    );
                })}
            </Carousel>
        </div>
    );
};
export default ImageSlider;
