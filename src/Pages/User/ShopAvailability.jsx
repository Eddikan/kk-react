import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "Assets/styles/DesignerCalendar/style.css";
import "Assets/styles/Cart/style.css";
import LayoutSellerCenter from "Components/Layout/LayoutSellerCenter";
import SetAvailability from "Components/Completeness/ShopSteps/SetAvailability";
import UploadPortfolio from "Components/Completeness/ShopSteps/UploadPortfolio";
import UploadProduct from "Components/Completeness/ShopSteps/UploadProduct";

import MeasurementGuide from "Components/Completeness/ShopSteps/MeasurementGuide";
import ShopManagerProgress from "Components/Completeness/Wizards/ShopManagerProgress";
import ThankYouProgress from "Components/Completeness/ShopSteps/Thankyou";
import SellerShopManager from "Components/Completeness/Wizards/SellerShopManager";
import SellerDesignerShopManager from "Components/Completeness/Wizards/SellerDesignerShopManager";
import { useSelector } from "react-redux";
import { useGetMyDesignsQuery } from "store/api/queries";

const ShopAvailability = () => {
  const { refetch: refetchMyDesigns } = useGetMyDesignsQuery();
  useEffect(() => {
    refetchMyDesigns();
  }, []);
  const userDetails = useSelector((state) => state.user.user);
  const is_seller = userDetails.type == "seller" ? true : false;
  const is_designer = userDetails.type == "designer" ? true : false;
  const [step, setStep] = useState(1);

  return (
    <LayoutSellerCenter>
      <section>
        <Container fluid>
          <Row className="bg-color-page">
            <Col lg={12} className="mx-auto py-5 max-width-column">
              <div>
                <Row>
                  <Col md={3} className={`flex-grow-1 flex-shrink-0`}>
                    <Card className="h-100">
                      <Card.Body>
                        {is_designer && (
                          <>
                            <ShopManagerProgress progress={step} />
                          </>
                        )}

                        {is_seller && (
                          <>
                            <SellerShopManager progress={step} />
                          </>
                        )}

                        {is_seller && is_designer && (
                          <>
                            <SellerDesignerShopManager progress={step} />
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md="9" className="flex-grow-1 flex-shrink-0">
                    <Card className="h-100">
                      <Card.Body className="pt-4">
                        {is_designer && (
                          <>
                            {step === 1 ? (
                              <>
                                <SetAvailability
                                  onStepPlusOne={() => setStep(step + 1)}
                                />
                              </>
                            ) : (
                              <>
                                {step === 2 ? (
                                  <UploadPortfolio
                                    onStepPlusTwo={() => setStep(step + 1)}
                                    onStepMinusTwo={() => setStep(step - 1)}
                                  />
                                ) : (
                                  <>
                                    {step === 3 ? (
                                      <ThankYouProgress />
                                    ) : (
                                      <ThankYouProgress />
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                        {is_seller && (
                          <>
                            {step === 1 ? (
                              <>
                                <UploadProduct
                                  onStepPlusTwo={() => setStep(step + 1)}
                                  onStepMinusTwo={() => setStep(step - 1)}
                                  singleStep={true}
                                />
                              </>
                            ) : (
                              <>
                                <ThankYouProgress />
                              </>
                            )}
                          </>
                        )}

                        {is_designer && is_seller && (
                          <>
                            {step === 1 ? (
                              <>
                                <SetAvailability
                                  onStepPlusOne={() => setStep(step + 1)}
                                />
                              </>
                            ) : (
                              <>
                                {step === 2 ? (
                                  <UploadPortfolio
                                    onStepPlusTwo={() => setStep(step + 1)}
                                    onStepMinusTwo={() => setStep(step - 1)}
                                  />
                                ) : (
                                  <>
                                    {step === 3 ? (
                                      <UploadProduct
                                        onStepPlusTwo={() => setStep(step + 1)}
                                        onStepMinusTwo={() => setStep(step - 1)}
                                        singleStep={false}
                                      />
                                    ) : (
                                      <>
                                        {step === 4 ? (
                                          <MeasurementGuide
                                            onStepPlusThree={() =>
                                              setStep(step + 1)
                                            }
                                            onStepMinusThree={() =>
                                              setStep(step - 1)
                                            }
                                          />
                                        ) : (
                                          <ThankYouProgress />
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      ;
    </LayoutSellerCenter>
  );
};

export default ShopAvailability;
