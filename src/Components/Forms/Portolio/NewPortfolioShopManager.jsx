import { useEffect, useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import toast from "react-hot-toast";
import ImageDragAndDrop from "Components/Shared/ImageDragAndDrop";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { TagsInput } from "react-tag-input-component";
import { useCreateDesignMutation } from "store/api/mutations";
import { selectDesignFilters } from "store/slices/designersSlice";
import { useSelector } from "react-redux";
import { useGetProfileQuery, useGetMyDesignsQuery } from "store/api/queries";
import { useGetDesignFiltersQuery } from "store/api/queries";
import AutocompleteTags from "Components/Forms/TagsWithAutocomplete";
const initialPortfolioData = Object.freeze({
  name: "",
  description: "",
  collection_type: "Regular",
});

const NewPortfolioShopManager = (props) => {
  const { refetch: refetchUser } = useGetProfileQuery();
  const { refetch: refetchMyDesigns } = useGetMyDesignsQuery();

  const { refetch: refetchDesignFilters } = useGetDesignFiltersQuery();
  const refetchCalls = () => {
    refetchUser();
    refetchMyDesigns();
    refetchDesignFilters();
  };
  useEffect(() => {
    refetchCalls();
  }, []);
  const designFilters = useSelector(selectDesignFilters);
  console.log("filters", designFilters);
  const [categoryIds, setCategoryIds] = useState([]);

  const [createDesign, { isLoading: isCreating }] = useCreateDesignMutation();

  const size = props.size;
  const [portfolioData, setPortfolioData] = useState(initialPortfolioData);
  const [colors, setColors] = useState([]);

  const [seasons, setSeasons] = useState([]);

  const [tags, setTags] = useState([]);
  const [genders, setGenders] = useState([]);

  const [materials, setMaterials] = useState([]);
  const handleCheckBoxChange = (e, setFunction) => {
    const value = e;
    setFunction((prevState) =>
      prevState.includes(value)
        ? prevState.filter((g) => g !== value)
        : [...prevState, value]
    );
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

  const convertToFormData = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        // Append each item with an index (e.g., image[0], image[1])
        data[key].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        // Append single values directly
        formData.append(key, data[key]);
      }
    });

    return formData;
  };
  async function PortfolioSubmit(e) {
    e.preventDefault();

    if (!images.length) {
      toast.error("Please upload atleast one photo!");
      return;
    } else if (
      portfolioData.name == "" ||
      portfolioData.description == "" ||
      categoryIds.length == 0
    ) {
      toast.error("Kindly complete the fields marked as required!");
      return;
    } else {
      const payload = {
        ...portfolioData,
        colors: colors,
        tags: tags,
        categories: categoryIds,
        genders,
        materials: materials,
        seasons,
        images,
        status: "Active",
      };

      console.log("payload", { ...payload });
      // Convert JSON object to FormData
      const formData = convertToFormData(payload);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      const res = await createDesign(formData).unwrap();
      if (res.success) {
        refetchCalls();
        toast.success(res.message);
        props.onCancel(true);
        props.onSuccess(true);
      }
    }
  }
  const [images, setImages] = useState([]);
  useEffect(() => {
    console.log("images", images);
  }, [images]);
  return (
    <Row>
      <Col lg="12">
        <Card className="mb-3">
          <Card.Body className="bg-lgray">
            <ImageDragAndDrop
              type="portfolio"
              setImages={setImages}
              size={size}
            />
          </Card.Body>
        </Card>
      </Col>
      <Col lg="12">
        <Card>
          <Card.Body className="bg-lgray">
            <Form.Group className="mb-4 mt-2">
              <Form.Label>
                Name<span className="text-danger">*</span>
              </Form.Label>
              <FormControl
                type="text"
                name="name"
                value={portfolioData.name}
                className="mr-sm-2"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="my-4">
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
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

            <Row>
              <Col lg="12">
                <Form.Group className="my-4">
                  <Form.Label>Categories</Form.Label>
                  <Row className="position-relative">
                    {designFilters?.categories &&
                    designFilters?.categories?.length > 0 ? (
                      <>
                        {designFilters?.categories?.map(({ name, id }) => (
                          <Form.Group
                            as={Col}
                            lg={3}
                            className="d-flex mt-1"
                            key={id}
                          >
                            <Form.Check
                              className="cursor-pointer me-2"
                              type="checkbox"
                              checked={categoryIds.includes(id)}
                              onChange={() =>
                                handleCheckBoxChange(id, setCategoryIds)
                              }
                            />
                            <span>{name}</span>
                          </Form.Group>
                        ))}
                      </>
                    ) : null}
                  </Row>
                  {/* <TagsInput
                                    value={categories}
                                    onChange={setCategories}
                                    name="categories"
                                    className="form-control"
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        if (!categories.includes(value) && value !== "") {
                                            setCategories([...categories, value]);
                                            e.target.value = "";
                                        }
                                    }}
                                /> */}
                </Form.Group>
              </Col>

              <Col lg="12">
                <Form.Group className="my-4">
                  <Form.Label>Season</Form.Label>
                  <Row className="position-relative">
                    {designFilters?.seasons &&
                    designFilters?.seasons?.length > 0 ? (
                      <>
                        {designFilters?.seasons?.map((name) => (
                          <Form.Group
                            as={Col}
                            lg={3}
                            className="d-flex mt-1"
                            key={name}
                          >
                            <Form.Check
                              className="cursor-pointer me-2"
                              type="checkbox"
                              checked={seasons.includes(name)}
                              onChange={() =>
                                handleCheckBoxChange(name, setSeasons)
                              }
                            />
                            <span>{name}</span>
                          </Form.Group>
                        ))}
                      </>
                    ) : null}
                  </Row>
                  {/* <TagsInput
                                    value={categories}
                                    onChange={setCategories}
                                    name="categories"
                                    className="form-control"
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        if (!categories.includes(value) && value !== "") {
                                            setCategories([...categories, value]);
                                            e.target.value = "";
                                        }
                                    }}
                                /> */}
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="my-4 relative">
                  <Form.Label>Colors</Form.Label>
                  <AutocompleteTags
                    value={colors}
                    onChange={setColors}
                    name="colors"
                    suggestions={designFilters?.colors}
                  />
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="my-4">
                  <Form.Label>Materials</Form.Label>
                  <AutocompleteTags
                    value={materials}
                    onChange={setMaterials}
                    name="materials"
                    suggestions={designFilters?.materials}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="my-4">
              <Form.Label>Tags</Form.Label>
              <AutocompleteTags
                value={tags}
                onChange={setTags}
                name="tags"
                suggestions={designFilters?.tags}
              />
            </Form.Group>
            <Form.Group className="my-4">
              <Form.Label>Gender</Form.Label>
              <Row className="position-relative">
                {designFilters?.genders &&
                designFilters?.genders?.length > 0 ? (
                  <>
                    {designFilters?.genders?.map((name) => (
                      <Form.Group
                        as={Col}
                        lg={3}
                        className="d-flex mt-1"
                        key={name}
                      >
                        <Form.Check
                          className="cursor-pointer me-2"
                          type="checkbox"
                          checked={genders.includes(name)}
                          onChange={() =>
                            handleCheckBoxChange(name, setGenders)
                          }
                        />
                        <span>{name}</span>
                      </Form.Group>
                    ))}
                  </>
                ) : null}
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>Collections</Form.Label>
              <Row className="mt-1">
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
                <Form.Group as={Col} lg={2}>
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
      <Col lg="12" className="text-right mt-4">
        <Button className="btn-back me-3" type="button" onClick={handleCancel}>
          Cancel
        </Button>
        {isCreating ? (
          <Button className="btn-save btn" type="button">
            {size == "small" ? "Uploading..." : "Saving..."}
          </Button>
        ) : (
          <Button
            className="btn-save btn"
            type="button"
            onClick={PortfolioSubmit}
          >
            {size == "small" ? "Upload" : "Save"}
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default NewPortfolioShopManager;
