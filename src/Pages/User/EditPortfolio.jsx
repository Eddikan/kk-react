import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "Components/Layout/Layout";
import { Container, Row, Col } from "react-bootstrap";
import "Assets/styles/User/Profile/style.css";
import GoBack from "Components/Shared/GoBack";
import EditPortfolioNormal from "Components/Forms/Portolio/EditPortfolioNormal";
import LoadingPage from "Components/Shared/LoadingPage";
import { useSelector } from "react-redux";
import { selectDesignById } from "store/slices/designersSlice";

const EditPortfolioDetails = () => {
  const navigate = useNavigate();
  const { portfolioId } = useParams();
  const design = useSelector((state) => selectDesignById(state, portfolioId));
  const editSuccess = (e) => {
    if (e) {
      setTimeout(function () {
        if (window.history.length > 1) {
          navigate(-1);
        }
      }, 1000);
    }
  };
  const reloadPage = (e) => {};
  const cancel = (e) => {};
  useEffect(() => {
    if (design) {
      console.log("Design:", design);
    }
  }, [design]);

  return (
    <Layout>
      {false ? (
        <LoadingPage />
      ) : (
        <section className="py-5 px-2">
          <Container>
            <Row>
              <Col lg="8" className="mb-3">
                <h2 className="fs-30 mb-2">Edit Design</h2>
              </Col>
              <Col lg="4" className="mb-3 text-right">
                <GoBack fallBack="/user/profile" />
              </Col>
            </Row>
            <EditPortfolioNormal
              size="normal"
              portfolioId={portfolioId}
              portfolio={design}
              images={design.media}
              withDraft={true}
              onSuccess={editSuccess}
              onReloadPage={reloadPage}
              onCancel={cancel}
            />
          </Container>
        </section>
      )}
    </Layout>
  );
};

export default EditPortfolioDetails;
