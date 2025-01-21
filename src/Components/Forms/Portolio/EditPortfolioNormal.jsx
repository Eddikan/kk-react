import  { useEffect, useState, useRef } from "react";
import {  Row, Col, Button, Card } from "react-bootstrap";
import "Assets/styles/Components/ImageDragAndDrop/style.css";
import toast from "react-hot-toast";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { TagsInput } from "react-tag-input-component";
import { useNavigate } from "react-router-dom";

import Loading from "Components/Shared/Loading";
import { FaTimesCircle } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { useSelector } from "react-redux";
import { selectDesignFilters } from "store/slices/designersSlice";
import {
  useDeleteDesignerImageMutation,
  useDeleteMyDesignMutation,
} from "store/api/mutations";

import { useGetDesignFiltersQuery } from "store/api/queries";
const initialPortfolioData = Object.freeze({
  image_urls: [],
  name: "",
  description: "",
  season: "",
  collection_type: "Regular",
});

const EditPortfolio = (props) => {
  const [deleteDesignerImage] = useDeleteDesignerImageMutation();
  const [deleteMyDesign, { isLoading }] = useDeleteMyDesignMutation();

  const size = props.size;
  const withDraft = props.withDraft;
  const portfolio = props.portfolio;
  const image_urls = props.images;

  const fileInputRef = useRef(null);

  // Category Search
  const [portfolioData, setPortfolioData] = useState(initialPortfolioData);

  const [images, setImages] = useState([]);

  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioDraftLoading, setPortfolioDraftLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("standby");

  const [colors, setColors] = useState([]);
  const [tags, setTags] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [genders, setGenders] = useState([]);
  const designFilters = useSelector(selectDesignFilters);
  const categories = designFilters.categories;
  const availableSeasons = designFilters.seasons;



  const formSuccess = (e) => {
    props.onSuccess(e);
  };

  const handleCancel = () => {
    props.onCancel(true);
  };

  const handleChange = (e) => {
    setPortfolioData({
      ...portfolioData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMore = () => {
    // Trigger the file input when the "Add More" button is clicked
    fileInputRef.current.click();
  };

  const handleFileInput = (e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  };

  const handleFiles = (files) => {
    const newImageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setImages((prevImageUrls) => [...prevImageUrls, { url: newImageUrls[0] }]);
  };

  const handleRemove = (e) => {
    const selectedImg = images.find((img, index) => index === e);
    if (selectedImg.id) {
      deleteDesignerImage(selectedImg.id).unwrap();
    }
    setImages((prevImages) => prevImages.filter((img, index) => index !== e));
  };
  const [categoryIds, setCategoryIds] = useState(
    portfolio.categories.map((each) => Number(each)) || []
  );

  useEffect(() => {
    if (portfolio) {
      if (portfolio.colors) {
        setColors(portfolio.colors);
      }
      if (portfolio.seasons) {
        setSeasons(portfolio.seasons);
      }
      if (portfolio.materials) {
        setMaterials(portfolio.materials);
      }
      if (portfolio.tags) {
        setTags(portfolio.tags);
      }
      if (portfolio.genders) {
        setGenders(portfolio.genders);
      }

      if (image_urls) {
        setImages(image_urls);
      }
    } else {
      toast.error("Design does not exist!");
      setTimeout(function () {
        handleCancel();
      }, 1500);
    }
  }, []);

  async function PortfolioSubmit(e) {
    e.preventDefault();
    if (images) {
      setPortfolioLoading(true);
      if (true) {
        toast.success("Design updated successfully!");
        setPortfolioLoading(false);
        formSuccess(true);
      }
    } else {
      toast.error("Please upload design images!");
    }
  }

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setGenders((prevState) =>
      prevState.includes(value)
        ? prevState.filter((g) => g !== value)
        : [...prevState, value]
    );
  };
  const handleSeasonClick = (season) => {
    setSeasons((prev) =>
      prev.includes(season)
        ? prev.filter((s) => s !== season)
        : [...prev, season]
    );
  };
  const designFiltersQuery = useGetDesignFiltersQuery();

  useEffect(() => {
    designFiltersQuery.refetch();
  }, []);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const res = await deleteMyDesign(portfolio.id).unwrap();
    if (res.success) {
      toast.success(res.message);
      navigate(-1);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("here", {
      ...portfolioData,
      colors,
      tags,
      materials,
      genders,
      seasons,
      categories: categoryIds,
      images,
    });
    return;
    PortfolioSubmit(e);
  };
  const handleCategoryChange = (id) => {
    setCategoryIds((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  };
  return (
    <Form onSubmit={handleSave}>
      <div className="tw-flex tw-mb-2 tw-justify-end">
        <Button className="btn-shop me-3" type="button" onClick={handleDelete}>
          {isLoading ? "...loading" : "Delete"}
        </Button>{" "}
      </div>

      <Row>
        <Col lg="8">
          <Card className="mb-3">
            <Card.Body className="bg-lgray">
              <Form.Group className="mb-3">
                <Form.Label>Photos</Form.Label>
                <Card>
                  <Card.Body>
                    <Row>
                      {images ? (
                        <>
                          {images.map((image, index) => (
                            <>
                              {size == "small" ? (
                                <>
                                  {images.length > 6 && index + 1 > 6 ? (
                                    <Col
                                      lg={2}
                                      key={image.id}
                                      className="image-preview mt-3"
                                    >
                                      <div
                                        className="image-dnd"
                                        style={{
                                          backgroundImage:
                                            "url(" + image.url + ")",
                                          minHeight: "170px",
                                        }}
                                      >
                                        <div className="dnd-actions-overlay">
                                          <FaTimesCircle
                                            size="25px"
                                            onClick={() => handleRemove(index)}
                                            className="remove-icon cursor-pointer text-danger"
                                          />
                                        </div>
                                      </div>
                                    </Col>
                                  ) : (
                                    <Col
                                      lg={2}
                                      key={image.id}
                                      className="image-preview"
                                    >
                                      <div
                                        className="image-dnd"
                                        style={{
                                          backgroundImage:
                                            "url(" + image.url + ")",
                                          minHeight: "170px",
                                        }}
                                      >
                                        <div className="dnd-actions-overlay">
                                          <FaTimesCircle
                                            size="25px"
                                            onClick={() => handleRemove(index)}
                                            className="remove-icon cursor-pointer text-danger"
                                          />
                                        </div>
                                      </div>
                                    </Col>
                                  )}
                                </>
                              ) : size == "normal" ? (
                                <>
                                  {images.length > 4 && index + 1 > 4 ? (
                                    <Col
                                      lg={3}
                                      key={image.id}
                                      className="image-preview mt-3"
                                    >
                                      <div
                                        className="image-dnd"
                                        style={{
                                          backgroundImage:
                                            "url(" + image.url + ")",
                                          minHeight: "175px",
                                        }}
                                      >
                                        <div className="dnd-actions-overlay">
                                          <FaTimesCircle
                                            size="25px"
                                            onClick={() => handleRemove(index)}
                                            className="remove-icon cursor-pointer text-danger"
                                          />
                                        </div>
                                      </div>
                                    </Col>
                                  ) : (
                                    <Col
                                      lg={3}
                                      key={image.id}
                                      className="image-preview"
                                    >
                                      <div
                                        className="image-dnd  "
                                        style={{
                                          backgroundImage:
                                            "url(" + image.url + ")",
                                          minHeight: "175px",
                                        }}
                                      >
                                        <div className="dnd-actions-overlay">
                                          <FaTimesCircle
                                            size="25px"
                                            onClick={() => handleRemove(index)}
                                            className="remove-icon cursor-pointer text-danger"
                                          />
                                        </div>
                                      </div>
                                    </Col>
                                  )}
                                </>
                              ) : (
                                <>
                                  {images.length > 6 && index + 1 > 6 ? (
                                    <Col
                                      lg={2}
                                      key={image.id}
                                      className="image-preview mt-3"
                                    >
                                      <div
                                        className="image-dnd"
                                        style={{
                                          backgroundImage:
                                            "url(" + image.url + ")",
                                          minHeight: "170px",
                                        }}
                                      >
                                        <div className="dnd-actions-overlay">
                                          <FaTimesCircle
                                            size="25px"
                                            onClick={() => handleRemove(index)}
                                            className="remove-icon cursor-pointer text-danger"
                                          />
                                        </div>
                                      </div>
                                    </Col>
                                  ) : (
                                    <Col
                                      lg={2}
                                      key={image.id}
                                      className="image-preview"
                                    >
                                      <div
                                        className="image-dnd"
                                        style={{
                                          backgroundImage:
                                            "url(" + image.url + ")",
                                          minHeight: "170px",
                                        }}
                                      >
                                        <div className="dnd-actions-overlay">
                                          <FaTimesCircle
                                            size="25px"
                                            onClick={() => handleRemove(index)}
                                            className="remove-icon cursor-pointer text-danger"
                                          />
                                        </div>
                                      </div>
                                    </Col>
                                  )}
                                </>
                              )}
                            </>
                          ))}
                        </>
                      ) : null}
                      {uploadStatus != "standby" ? (
                        <>
                          {size == "small" ? (
                            <>
                              {images.length >= 6 ? (
                                <Col
                                  lg={2}
                                  className="image-preview mt-3"
                                  style={{ minHeight: "170px" }}
                                >
                                  <Loading />
                                </Col>
                              ) : (
                                <Col
                                  lg={2}
                                  className="image-preview"
                                  style={{ minHeight: "170px" }}
                                >
                                  <Loading />
                                </Col>
                              )}
                            </>
                          ) : size == "normal" ? (
                            <>
                              {images.length >= 4 ? (
                                <Col
                                  lg={3}
                                  className="image-preview mt-3"
                                  style={{ minHeight: "175px" }}
                                >
                                  <Loading />
                                </Col>
                              ) : (
                                <Col
                                  lg={3}
                                  className="image-preview"
                                  style={{ minHeight: "175px" }}
                                >
                                  <Loading />
                                </Col>
                              )}
                            </>
                          ) : (
                            <>
                              {images.length >= 6 ? (
                                <Col
                                  lg={2}
                                  className="image-preview mt-3"
                                  style={{ minHeight: "170px" }}
                                >
                                  <Loading />
                                </Col>
                              ) : (
                                <Col
                                  lg={2}
                                  className="image-preview"
                                  style={{ minHeight: "170px" }}
                                >
                                  <Loading />
                                </Col>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {size == "small" ? (
                            <>
                              <Col
                                lg={2}
                                className={`image-preview ${
                                  images && images.length >= 6 ? "mt-3" : ""
                                }`}
                              >
                                <div
                                  onClick={handleAddMore}
                                  className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed bg-lgray"
                                  style={{ minHeight: "170px" }}
                                >
                                  <GoPlus
                                    color="#a4a4a4"
                                    size="130px"
                                    className="mt-2"
                                  />
                                  <p
                                    className="text-dgray"
                                    style={{ marginTop: "-15px" }}
                                  >
                                    Add More
                                  </p>
                                </div>
                              </Col>
                            </>
                          ) : size == "normal" ? (
                            <Col
                              lg={3}
                              className={`image-preview ${
                                images && images.length >= 4 ? "mt-3" : ""
                              }`}
                            >
                              <div
                                onClick={handleAddMore}
                                className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed bg-lgray"
                                style={{ minHeight: "175px" }}
                              >
                                <GoPlus
                                  color="#a4a4a4"
                                  size="130px"
                                  className="mt-2"
                                />
                                <p
                                  className="text-dgray"
                                  style={{ marginTop: "-15px" }}
                                >
                                  Add More
                                </p>
                              </div>
                            </Col>
                          ) : (
                            <Col
                              lg={2}
                              className={`image-preview ${
                                images && images.length >= 6 ? "mt-3" : ""
                              }`}
                            >
                              <div
                                onClick={handleAddMore}
                                className="product-grid-div add-more-box w-100 text-center cursor-pointer background-dashed bg-lgray"
                                style={{ minHeight: "170px" }}
                              >
                                <GoPlus
                                  color="#a4a4a4"
                                  size="130px"
                                  className="mt-2"
                                />
                                <p
                                  className="text-dgray"
                                  style={{ marginTop: "-15px" }}
                                >
                                  Add More
                                </p>
                              </div>
                            </Col>
                          )}
                        </>
                      )}
                    </Row>
                    <input
                      type="file"
                      id="fileInput"
                      onChange={handleFileInput}
                      className="file-input d-block opacity-0 d-none"
                      ref={fileInputRef}
                      accept="image/*"
                      multiple
                    />
                  </Card.Body>
                </Card>
              </Form.Group>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body className="bg-lgray">
              <Form.Group className="mb-3 mt-2">
                <Form.Label>Name</Form.Label>
                <FormControl
                  type="text"
                  name="name"
                  value={portfolioData.name}
                  className="mr-sm-2"
                  onChange={handleChange}
                  required
                  placeholder=""
                />
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label>Description</Form.Label>
                <FormControl
                  as="textarea"
                  name="description"
                  rows={3} // You can adjust the number of rows as needed
                  value={portfolioData.description}
                  placeholder=""
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Card.Body>
          </Card>
          <div className="text-left mt-5">
            <Button
              className="btn-outline me-3"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            {portfolioLoading ? (
              <Button className="btn-primary" type="button">
                {size == "small" ? "Uploading..." : "Saving..."}
              </Button>
            ) : (
              <Button className="btn-primary" type="submit">
                {size == "small" ? "Upload" : "Save"}
              </Button>
            )}
            {withDraft ? (
              <>
                {portfolioDraftLoading ? (
                  <span className="cursor-pointer text-black ms-3">
                    Saving as Draft...
                  </span>
                ) : (
                  <span
                    className="cursor-pointer text-black ms-3"
                    onClick={() => {}}
                  >
                    Save as Draft <HiOutlineArrowLongRight />
                  </span>
                )}
              </>
            ) : null}
          </div>
        </Col>
        <Col lg="4">
          <Card className="mb-3">
            <Card.Body className="bg-lgray">
              <Form.Group className="mb-3 mt-2">
                <Form.Label>Categories</Form.Label>

                <Row className="position-relative">
                  {categories && categories.length > 0 ? (
                    <>
                      {categories.map(({ name, id }) => (
                        <Form.Group
                          key={id}
                          as={Col}
                          lg={6}
                          className="d-flex mt-1"
                        >
                          <Form.Check
                            className="cursor-pointer me-2"
                            type="checkbox"
                            checked={categoryIds.includes(id)}
                            onChange={() => handleCategoryChange(id)}
                          />
                          <span>{name} </span>
                        </Form.Group>
                      ))}
                    </>
                  ) : null}
                </Row>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label>Season</Form.Label>
                <Row className="position-relative">
                  {availableSeasons.map((season) => (
                    <Form.Group
                      key={season}
                      as={Col}
                      lg={6}
                      className="d-flex mt-1"
                    >
                      <Form.Check
                        className="cursor-pointer me-2"
                        type="checkbox"
                        checked={seasons.includes(season)}
                        onChange={() => handleSeasonClick(season)}
                      />
                      <span>{season}</span>
                    </Form.Group>
                  ))}
                </Row>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label>Colors</Form.Label>
                <TagsInput
                  value={colors}
                  onChange={setColors}
                  name="colors"
                  className="form-control"
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (!colors.includes(value) && value !== "") {
                      setColors([...colors, value]);
                      e.target.value = "";
                    }
                  }}
                />
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label>Materials</Form.Label>
                <TagsInput
                  value={materials}
                  onChange={setMaterials}
                  name="materials"
                  className="form-control"
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (!materials.includes(value) && value !== "") {
                      setMaterials([...materials, value]);
                      e.target.value = "";
                    }
                  }}
                />
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label>Tags</Form.Label>
                <TagsInput
                  value={tags}
                  onChange={setTags}
                  name="tags"
                  className="form-control"
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (!tags.includes(value) && value !== "") {
                      setTags([...tags, value]);
                      e.target.value = "";
                    }
                  }}
                />
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label>Gender</Form.Label>
                <Row className="mt-1">
                  <Form.Group as={Col} lg={4}>
                    <Form.Check
                      className="cursor-pointer"
                      type="checkbox"
                      label="Male"
                      name="genders"
                      value="Male"
                      checked={genders.includes("Male")}
                      onChange={handleGenderChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} lg={4}>
                    <Form.Check
                      className="cursor-pointer"
                      type="checkbox"
                      label="Female"
                      name="genders"
                      value="Female"
                      checked={genders.includes("Female")}
                      onChange={handleGenderChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} lg={4}>
                    <Form.Check
                      className="cursor-pointer"
                      type="checkbox"
                      label="Other"
                      name="genders"
                      value="Other"
                      checked={genders.includes("Other")}
                      onChange={handleGenderChange}
                    />
                  </Form.Group>
                </Row>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label>Collections</Form.Label>
                <Row className="mt-2">
                  <Form.Group as={Col} lg={3}>
                    <Form.Check
                      className="cursor-pointer"
                      type="radio"
                      label="Regular"
                      name="collection_type"
                      value="Regular"
                      checked={portfolioData.collection_type === "Regular"}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} lg={3}>
                    <Form.Check
                      className="cursor-pointer"
                      type="radio"
                      label="Limited"
                      name="collection_type"
                      value="Limited"
                      checked={portfolioData.collection_type === "Limited"}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default EditPortfolio;
