import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "Assets/styles/ImageSlider/style.css";

const ImageSlider = (props) => {
    const images = props.images;
    const final_product_image_urls = props.finalProductImages
    const type = props.type ?? 'portfolio';
    const slidesToShow = props.slidesToShow ?? 3;
    const [allImages, setAllImages] = useState([]);

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,
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

    const handleActiveImageChange = () => {
        // props.onActiveImageChange(image);
        const activeItem = document.querySelector('.react-multi-carousel-item--active');

        if (activeItem) {
            // Select the first child with class '.slider-image' within the active item
            const sliderImage = activeItem.querySelector('.slider-image');

            // Check if there's a '.slider-image' within the active item before proceeding
            if (sliderImage) {
                // Get the background image of the '.slider-image'
                const backgroundImage = window.getComputedStyle(sliderImage).backgroundImage;

                // Check if there's a background image and it's not "none"
                if (backgroundImage && backgroundImage !== "none") {
                    // Use regular expression to extract the URL
                    const urlMatch = backgroundImage.match(/url\("(.+)"\)/);

                    // Check if there is a match and get the URL
                    const imageUrl = urlMatch ? urlMatch[1] : null;
                    if (type == "product") {
                        const imageUrlWithoutPrefix = imageUrl?.replace('https://kouture-konect.jenocabrera.online/storage/product/', '');
                        props.onActiveImageChange(imageUrl);
                    } else {
                        const imageUrlWithoutPrefix = imageUrl?.replace('https://kouture-konect.jenocabrera.online/storage/portfolio/', '');
                        props.onActiveImageChange(imageUrl);
                    }
                }
            }
        }
    };

    useEffect(() => {
        // Set the initial active image when images change
        if (images && images.length > 0) {
            props.onActiveImageChange(images[0]);
        }

        if (final_product_image_urls && final_product_image_urls.length > 0) {
            const combinedImages = [...images, ...final_product_image_urls];
            setAllImages(combinedImages);
        } else {
            setAllImages(images);
        }
        
    }, []);


    return (
        <div className="parent">
            <Carousel
                focusOnSelect={true}
                responsive={responsive}
                autoPlay={false}
                autoPlaySpeed={3000}
                swipeable={true}
                draggable={true}
                showDots={false}
                infinite={true}
                partialVisible={false}
                // beforeChange={(current, next) => handleActiveImageChange(images[next])}
                removeArrowOnDeviceType={['tablet', 'mobile', 'desktop']}
                dotListClass="custom-dot-list-style"
                afterChange={handleActiveImageChange}
            >
                {allImages.map((image, index) => {
                    return (
                        <div className="slider pt-0" key={index}>
                            {type == 'product' ?
                                <div className="slider-image cursor-pointer" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'product/' + image.image_url + ")" }}>

                                </div>
                                :
                                <div className="slider-image cursor-pointer" style={{ backgroundImage: "url(" + process.env.REACT_APP_STORAGE_URL + 'portfolio/' + image.image_url + ")" }}>

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
