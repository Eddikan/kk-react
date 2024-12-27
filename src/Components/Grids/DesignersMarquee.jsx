import "react-multi-carousel/lib/styles.css";
import Loading from "Components/Shared/Loading";
import Marquee from "react-fast-marquee";
import { useCookies } from "react-cookie";
import { useFetchDesignersQuery } from "store/api/designersApi";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const DesignersMarquee = (props) => {
  const [cookies] = useCookies(["currentUser", "token"]);
  // const currentUser = props.currentUser;

  const current_user_id = cookies.currentUser;
  const token = cookies.token;

  const toggleGetUser = (e) => {
    window.location.href = "/designer-profile?user_id=" + e;
  };

  const {
    data: designers,
    error,
    isLoading,
  } = useFetchDesignersQuery({
    current_user_id,
    token,
  });
  useEffect(() => {
    if (error) {
      toast.error("error");
    }
  }, [error]);
  if (error) return <p>There has been an error getting the designers.</p>;

  return (
    <>
      <div id="designers-marquee">
        {isLoading ? (
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
                      <>
                        {designer.user.image && designer.user.image != "" ? (
                          <div key={index} className="marquee-item">
                            <div
                              onClick={() => toggleGetUser(designer.user.id)}
                              className="designer-marquee cursor-pointer"
                              style={{
                                backgroundImage: `url(${
                                  import.meta.env.VITE_REACT_APP_STORAGE_URL
                                }user/${designer.user.image})`,
                              }}
                            ></div>
                          </div>
                        ) : null}
                      </>
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
