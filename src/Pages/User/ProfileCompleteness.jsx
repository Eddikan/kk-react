import { useEffect, useState } from "react";
import Layout from "Components/Layout/Layout";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import LoadingPage from "Components/Shared/LoadingPage";
import AboutStep from "Components/Completeness/ProfileSteps/About";
import AddressStep from "Components/Completeness/ProfileSteps/Address";
import ContactStep from "Components/Completeness/ProfileSteps/Contact";
import SocialMediaStep from "Components/Completeness/ProfileSteps/SocialMedia";
import ThankyouStep from "Components/Completeness/ProfileSteps/Thankyou";
import ProfileProgress from "Components/Completeness/Wizards/ProfileCompletenessProgress";
import BodyMeasurementStep from "Components/Completeness/ProfileSteps/BodyMeasurement";
import { useGetProfileQuery } from "store/api/queries";
import GoBack from "Components/Shared/GoBack";

const initialUserData = Object.freeze({
  is_designer: 0,
  is_tailor: 0,
  is_seller: 0,
  email: "",
  short_bio: "",
  long_bio: "",
  first_name: "",
  last_name: "",
  gender: "",
  date_of_birth: "",
  occupation: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  province: "",
  postal_code: "",
  country: "",
  website: "",
  phone_number: "",
  secondary_email_address: "",
  facebook: "",
  twitter: "",
  instagram: "",
  linkedin: "",
  pinterest: "",
  behance: "",
});

const ProfileCompleteness = () => {
  const [profileFormData, setProfileFormData] = useState(initialUserData);
  const [reloadCount, setReloadCount] = useState(0);
  const [aboutDone, setAboutDone] = useState("No");
  const [addressDone, setAddressDone] = useState("No");
  const [contactDone, setContactDone] = useState("No");
  const [socialDone, setSocialDone] = useState("No");
  const [bodyMeasurementDone, setBodyMeasurementDone] = useState("No");
  const [cookies] = useCookies([
    "currentUser",
    "aboutDone",
    "addressDone",
    "contactDone",
    "socialDone",
    "measurementDone",
  ]);
  const currentUser = useSelector((state) => state.user.user.email);
  const currentStoreUser = useSelector((state) => state.user.user);

  const token = cookies.token;

  const { isLoading, refetch: refetchUser } = useGetProfileQuery();

  useEffect(() => {
    refetchUser();
    // fetchData({ currentUser: currentUser, token: token });
    // if (reloadCount === 0) {
    //   setCookie("aboutDone", "No", { path: "/" });
    //   setCookie("addressDone", "No", { path: "/" });
    //   setCookie("contactDone", "No", { path: "/" });
    //   setCookie("socialDone", "No", { path: "/" });
    //   setCookie("measurementDone", "No", { path: "/" });
    // } else {
    setAboutDone(cookies.aboutDone ?? "No");
    setAddressDone(cookies.addressDone ?? "No");
    setContactDone(cookies.contactDone ?? "No");
    setSocialDone(cookies.socialDone ?? "No");
    setBodyMeasurementDone(cookies.measurementDone ?? "No");
    // }
  }, [reloadCount]);

  return (
    <Layout>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <section id="profile" className="pt-30 pb-5 px-5">
          <div>
            <GoBack fallBack="/user/profile" />
          </div>
          <Container>
            <Row className="">
              <Col md="3" className={`flex-grow-1 flex-shrink-0`}>
                <Card className="h-100">
                  <Card.Body>
                    <ProfileProgress
                      reloadCount={reloadCount}
                      reload={() => setReloadCount(reloadCount + 1)}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={"9"} className="flex-grow-1 flex-shrink-0">
                <Card className="h-100">
                  <Card.Body>
                    {aboutDone === "No" &&
                      addressDone === "No" &&
                      contactDone === "No" &&
                      socialDone === "No" && (
                        <AboutStep
                          currentUser={currentUser}
                          token={token}
                          user={profileFormData}
                          reload={() => setReloadCount(reloadCount + 1)}
                        />
                      )}
                    {aboutDone === "Yes" && addressDone === "No" && (
                      <AddressStep
                        currentUser={currentUser}
                        token={token}
                        reload={() => setReloadCount(reloadCount + 1)}
                      />
                    )}
                    {addressDone === "Yes" && contactDone === "No" && (
                      <ContactStep
                        currentUser={currentUser}
                        token={token}
                        reload={() => setReloadCount(reloadCount + 1)}
                      />
                    )}
                    {currentStoreUser.type !== "customer" &&
                      contactDone === "Yes" &&
                      socialDone === "No" && (
                        <SocialMediaStep
                          currentUser={currentUser}
                          token={token}
                          user={profileFormData}
                          reload={() => setReloadCount(reloadCount + 1)}
                        />
                      )}
                    {socialDone === "Yes" && bodyMeasurementDone === "No" && (
                      <BodyMeasurementStep
                        currentUser={currentUser}
                        token={token}
                        user={profileFormData}
                        reload={() => setReloadCount(reloadCount + 1)}
                      />
                    )}
                    {contactDone === "Yes" &&
                      addressDone === "Yes" &&
                      socialDone === "Yes" &&
                      aboutDone === "Yes" &&
                      bodyMeasurementDone === "Yes" && (
                        <ThankyouStep
                          currentUser={currentUser}
                          token={token}
                          user={profileFormData}
                          reload={() => setReloadCount(reloadCount + 1)}
                        />
                      )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </Layout>
  );
};

export default ProfileCompleteness;
