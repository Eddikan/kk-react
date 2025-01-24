import { useEffect, useState } from "react";
import { Row, Col, Modal, Card } from "react-bootstrap";
import "Assets/styles/DesignerCalendar/style.css";
import { useCookies } from "react-cookie";
import Container from "react-bootstrap/Container";
import Sidebar from "Components/Shared/Sidebar";
import MyCalendar from "Components/Shared/MyCalendar";
import GoBack from "Components/Shared/GoBack";
import LayoutSellerCenter from "Components/Layout/LayoutSellerCenter";
import SetAvailability from "Components/Completeness/ShopSteps/SetAvailability";
import useCalendar from "hooks/useCalendar";

const Calendar = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "currentUser",
    "isLoggedIn",
    "userDetails",
    "userRole",
  ]);
  const designerId = cookies.currentUserDesigner;
  const [designerBusinessHoursModalShow, setDesignerBusinessHoursModalShow] =
    useState(false);

  const [currentTimezone, setCurrentTimezone] = useState(null);
  const [noAvailableHours, setNoAvailableHors] = useState(false);

  useEffect(() => {
    document.body.classList.add("designer-calendar-body");
    const getTimezone = () => {
      const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
      setCurrentTimezone(timezone);
    };

    getTimezone();
  }, []);
const {colors} = useCalendar()
  return (
    <LayoutSellerCenter>
      <section>
        <Container fluid>
          <Row>
            <Col lg={2} className="p-0">
              <Sidebar />
            </Col>

            <Col
              lg={10}
              className="mx-auto py-5 padding-right-admin max-width-column"
            >
              <Row>
                <Col lg={12}>
                  <Row className="pb-4">
                    <Col lg={11}></Col>

                    <Col lg={1} className="text-right">
                      <GoBack fallBack="/" />
                    </Col>

                    <Col
                      md={4}
                      className="d-flex justify-content-left align-items-center"
                    >
                      <h3 className="fs-30 fw-600 text-black mb-0">Calendar</h3>
                    </Col>
                    <Col
                      md={5}
                      className="d-flex justify-content-left align-items-center"
                    >
                      <div className="tw-flex tw-items-center tw-mr-4">
                        <div className="tw-w-4 tw-h-4  tw-mr-2"
                        style={{ backgroundColor: colors.holidayColor }}
                        
                        ></div>
                        <span>Holidays</span>
                      </div>
                      <div className="tw-flex tw-items-center">
                        <div className="tw-w-4 tw-h-4  tw-mr-2"
                        style={{ backgroundColor: colors.availableColor }}
                        
                        ></div>
                        <span>Available</span>
                      </div>{" "}
                    </Col>

                    <Col md={3} className="text-right">
                      <button
                        className="btn-primary btn"
                        onClick={() => {
                          setDesignerBusinessHoursModalShow(true);
                        }}
                      >
                        Availability
                      </button>
                    </Col>
                  </Row>
                  {noAvailableHours ? (
                    <Row>
                      <Col lg="12">
                        <div
                          role="alert"
                          className="fade alert alert-warning show"
                        >
                          You haven&lsquo;t set your schedule yet. To enable
                          appointments, please update your availability settings
                          now!
                        </div>
                      </Col>
                    </Row>
                  ) : null}
                  <div className="calendar-container">
                    <MyCalendar designerId={designerId} />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal
        show={designerBusinessHoursModalShow}
        onHide={() => setDesignerBusinessHoursModalShow(false)}
        id="business-hours-modal"
      >
        <Modal.Header closeButton className="pb-0">
          <Modal.Title className="rufina-family fs-22">
            Availability
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <SetAvailability
                edit
                cancel={() => {
                  setDesignerBusinessHoursModalShow(false);
                }}
              />
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </LayoutSellerCenter>
  );
};

export default Calendar;
