import "react-multi-carousel/lib/styles.css";
import Loading from "Components/Shared/Loading";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { selectDesigners } from "store/slices/designersSlice";
import { useGetDesignersQuery } from "store/api/queries";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360); // Random hue
  const pastelLightness = Math.floor(Math.random() * 30) + 70; // Lightness between 70-100
  const pastelSaturation = Math.floor(Math.random() * 20) + 30; // Saturation between 30-50
  return `hsl(${hue}, ${pastelSaturation}%, ${pastelLightness}%)`;
};

const generateContrastColor = (hexColor) => {
  const threshold = 130; // Threshold for luminance contrast
  const color = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  if (!color) return "#000000"; // Default to black if invalid color
  const r = parseInt(color[1], 16);
  const g = parseInt(color[2], 16);
  const b = parseInt(color[3], 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > threshold ? "#000000" : "#ffffff"; // White or black text based on luminance
};

const ColorGenerator = ({ name, lastName = "" }) => {
  const backgroundColor = generateRandomColor();
  const textColor = generateContrastColor(backgroundColor);

  return (
    <div
      style={{
        backgroundColor,
        color: textColor,
        padding: "1rem",
        borderRadius: "0.5rem",
        margin: "0.5rem",
      }}
      className="designer-marquee  tw-text-[50px] tw-border-black tw-flex tw-justify-center tw-items-center"
    >
      <div className="tw-uppercase">
        {name?.charAt(0) + lastName?.charAt(0)}
      </div>
    </div>
  );
};

const DesignersMarquee = () => {
  const navigate = useNavigate();

  const {
    isLoading: isDesignerLoading,
    error,
    refetch,
  } = useGetDesignersQuery({
    search: "",
    country: "",
  });
  const storeDesigners = useSelector(selectDesigners);
  const designers = storeDesigners.data
  console.log("here component",designers);
  useEffect(() => {
    refetch();
  }, []);
  const toggleGetUser = (e) => {
    navigate(`/designer-profile?user_id=${e}`);
  };

  if (error) return <p>There has been an error getting the designers.</p>;

  return (
    <>
      <div id="designers-marquee">
        {isDesignerLoading ? (
          <>
            <Loading className="bg-white" />
          </>
        ) : (
          <>
            {designers && designers.length > 0 ? (
              <>
                <Marquee>
                  {designers.map((designer, index) => {
                    // var wishlist_user_ids = designer.wishlist_user_ids ?? [];
                    // const userWishlist =
                    //   wishlist_user_ids.includes(currentUser);
                    return (
                      <div key={index}
                      onClick={() => toggleGetUser(designer.id)}
                      className="cursor-pointer"
                      >
                        {designer?.avatar_secure_url &&
                        designer?.avatar_secure_url != "" ? (
                          <div className="marquee-item">
                            <div
                              className="designer-marquee cursor-pointer"
                              style={{
                                backgroundImage: `url(${designer?.avatar_secure_url})`,
                              }}
                            ></div>
                          </div>
                        ) : (
                          <ColorGenerator
                            name={
                              designer?.first_name
                                ? designer?.first_name
                                : designer?.email
                            }
                            lastName={designer?.last_name}
                          />
                        )}
                      </div>
                    );
                  })}
                </Marquee>
              </>
            ) : (
              <p className="text-center mb-3 mt-3">No records found.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DesignersMarquee;
