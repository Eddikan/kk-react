import {
  FaPhone,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaPinterest,
  FaXTwitter,
} from "react-icons/fa6";
import { useState } from "react";
import { FaLink, FaBehance } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";
function MyProfile({ user }) {
  const [areasOfSpecialization, setAreaOfSpecialization] = useState([
    "dummy data",
  ]);
  return (
    <div className="profile-container">
      <Row>
        <Col lg="6">
          <p className="title-designer mb-2">Short Bio</p>
          <p className="short-bio-designer fs-14 mb-4">
            {user?.business_profile?.short_bio?.trim()
              ? user.business_profile.short_bio
              : "-"}
          </p>
          <>
            <p className="long-bio-title mb-1">Long Bio</p>
            <p className="long-bio-designer fs-14 mb-0 scroll-body">
              {user?.business_profile?.long_bio?.trim()
                ? user.business_profile.long_bio
                : "-"}
            </p>
          </>

          {user?.type === "designer" && (
            <>
              <p className="areas-specialization mt-3 mb-3">
                Areas of Specialization and Expertise
              </p>
              <div className="mb-4">
                {areasOfSpecialization?.length > 0 ? (
                  <>
                    {areasOfSpecialization.map((item, index) => (
                      <span
                        key={index}
                        className="text-gray600 fs-14 pill-span bg-light item-designer"
                      >
                        {item}
                      </span>
                    ))}
                  </>
                ) : null}
              </div>
            </>
          )}
        </Col>
        <Col lg="6">
          <div className="profile-details address mb-4 pt-0">
            <p className="profile-details-title fw-bold">Contact Information</p>
            {(user?.address?.address_line_1 ||
              user?.address?.address_line_2 ||
              user?.address?.city_name ||
              user?.address?.country_name) && (
              <div className="icons-d-flex">
                <FaLocationDot
                  size="15px"
                  color="#cea835"
                  className="profile-icon"
                />
                <p className="information-font fs-14">
                  {user?.address?.address_line_1
                    ? `${user.address.address_line_1}, `
                    : "_"}{" "}
                  {user?.address?.city_name
                    ? `${user.address.city_name}, `
                    : ""}{" "}
                  {user?.address?.country_name || ""}
                </p>
              </div>
            )}
            {user?.business_profile?.website && (
              <div className="icons-d-flex">
                <FaLink size="15px" color="#cea835" className="profile-icon" />
                <p className="information-font fs-14">
                  <a
                    href={
                      user.business_profile.website.startsWith("http")
                        ? user.business_profile.website
                        : `https://${user.business_profile.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.business_profile.website}
                  </a>
                </p>
              </div>
            )}
            {user?.phone?.number && (
              <div className="icons-d-flex">
                <FaPhone size="15px" color="#cea835" className="profile-icon" />
                <p className="information-font mb-0 fs-14">
                  <a
                    href={`tel:${user.phone.country_code}${user.phone.number}`}
                  >
                    {user.phone.country_code + user.phone.number}
                  </a>
                </p>
              </div>
            )}
          </div>
          <div className="profile-details social">
            <p className="social-profile">Social</p>
            {user?.socials?.facebook && (
              <div className="icons-d-flex">
                <FaFacebookF
                  size="20px"
                  color="#3b5998"
                  className="profile-icon"
                />
                <p className="information-font ellipsis-profile fs-14">
                  <a
                    href={
                      user?.socials?.facebook.startsWith("http")
                        ? user.socials.facebook
                        : `https://${user.socials.facebook}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.socials.facebook}
                  </a>
                </p>
              </div>
            )}
            {user?.socials?.twitter && (
              <div className="icons-d-flex">
                <FaXTwitter
                  size="20px"
                  color="#000000"
                  className="profile-icon"
                />
                <p className="information-font ellipsis-profile fs-14">
                  <a
                    href={
                      user?.socials?.twitter.startsWith("http")
                        ? user.socials.twitter
                        : `https://${user.socials.twitter}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.socials.twitter}
                  </a>
                </p>
              </div>
            )}
            {user?.socials?.instagram && (
              <div className="icons-d-flex">
                <FaInstagram
                  size="20px"
                  color="#E1306C"
                  className="profile-icon"
                />
                <p className="information-font ellipsis-profile fs-14">
                  <a
                    href={
                      user?.socials?.instagram.startsWith("http")
                        ? user.socials.instagram
                        : `https://${user.socials.instagram}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.socials.instagram}
                  </a>
                </p>
              </div>
            )}
            {user?.socials?.linkedin && (
              <div className="icons-d-flex">
                <FaLinkedinIn
                  size="20px"
                  color="#0a66c2"
                  className="profile-icon"
                />
                <p className="information-font ellipsis-profile fs-14">
                  <a
                    href={
                      user?.socials?.linkedin.startsWith("http")
                        ? user.socials.linkedin
                        : `https://${user.socials.linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.socials.linkedin}
                  </a>
                </p>
              </div>
            )}
            {user?.socials?.pinterest && (
              <div className="icons-d-flex">
                <FaPinterest
                  size="20px"
                  color="#E60023"
                  className="profile-icon"
                />
                <p className="information-font ellipsis-profile fs-14">
                  <a
                    href={
                      user?.socials?.pinterest.startsWith("http")
                        ? user.socials.pinterest
                        : `https://${user.socials.pinterest}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.socials.pinterest}
                  </a>
                </p>
              </div>
            )}
            {user?.socials?.behance && (
              <div className="icons-d-flex">
                <FaBehance
                  size="20px"
                  color="#1769ff"
                  className="profile-icon"
                />
                <p className="information-font ellipsis-profile fs-14">
                  <a
                    href={
                      user?.socials?.behance.startsWith("http")
                        ? user.socials.behance
                        : `https://${user.socials.behance}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.socials.behance}
                  </a>
                </p>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default MyProfile;
