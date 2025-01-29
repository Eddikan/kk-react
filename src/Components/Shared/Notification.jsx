import { useState, useRef, useEffect } from "react";
import BellIcon from "Assets/images/icons/bell.png";
import NewAppointment from "Assets/images/new-appointment-icon.png";
import { Col, Row } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { useGetNotificationsQuery } from "store/api/queries";

const Notification = () => {
  const bellRef = useRef(null);
  const [userBellOpen, setUserBellOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const toggleBellMenu = () => {
    setUserBellOpen(!userBellOpen);
  };

  const notificationsQuery = useGetNotificationsQuery();

  useEffect(() => {
    if (notificationsQuery.data) {
      setNotifications(notificationsQuery.data.data.data);
    }
  }, [notificationsQuery.data]);

  return (
    <div
      className="user-dropdown nav-link cursor-pointer d-block position-relative"
      ref={bellRef}
      onClick={toggleBellMenu}
    >
      <div className="nav-link header-tooltip">
        <span className="icon-tooltiptext fs-14">Notifications</span>
        <img src={BellIcon} className="navigation-icon" alt="Notifications" />
      </div>
      {userBellOpen && (
        <div className="action-box-bell scroll-bar user-menu-bell" id="style-2">
          {notifications?.length > 0 ? (
            <>
              {notifications.map((notification, index) => {
                const options = {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                };

                const today = new Date(
                  notification.created_at
                ).toLocaleDateString("en-ES", options);
                return (
                  <>
                    <Row key={index} className="mb-2">
                      <Col lg={2}>
                        <img
                          src={NewAppointment}
                          className="new-appointment-image"
                          alt="New Appointment"
                        />
                      </Col>

                      <Col lg={10} className="pb-2">
                        <div className="body-text-bell">
                          <div className="fs-16 fw-600 text-black">
                            {notification?.notifiable_type}
                          </div>
                          <span className="fs-14 text-black">
                            {notification?.data?.data.message}
                          </span>
                          <div className="hours-bell fs-14 mt-1">{today}</div>
                        </div>
                      </Col>
                    </Row>
                    <hr className="mt-0 mb-3" />
                  </>
                );
              })}
            </>
          ) : (
            <>
              {notificationsQuery.isLoading ? (
                <Card>
                  <Card.Body className="text-center">Loading...</Card.Body>
                </Card>
              ) : (
                <Card>
                  <Card.Body className="text-center">
                    No notifications were found.
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
