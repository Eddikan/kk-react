import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Row, Col } from "react-bootstrap";

const MultiFields = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      text: [{string: ''}]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'text',
    control,
  });

  const submit = (e) => {
    console.log(e)
  }

  return (
    <>
      <p>Multi Data Forms utilizing useForm</p>
      <form onSubmit={handleSubmit(submit)}>
        {fields.length > 0 ?
          <>
            {fields.map((field, index) => (
              <Row key={field.id}>
                <Col lg='10'>
                  <div >
                    <input
                      type='text'
                      className={`form-control ${errors[`text`]?.[index]?.string ? 'is-invalid mb-0' : 'mb-3'}`}
                      {...register(
                        `text.${index}.string`,
                        {
                          required: "field is required",
                          // onChange: (e) => handleChange(e, index)
                        }
                      )}
                    />
                    {errors[`text`]?.[index]?.string ? <p role="alert" className="invalid-feedback">{errors[`text`]?.[index]?.string.message}</p> : null}
                  </div>
                </Col>
                <Col lg='2'>
                  {index > 0 && (
                    <Button className="me-2" variant="outline-danger" onClick={() => remove(index)}>Remove</Button>
                  )}
                </Col>
              </Row>
            ))}
          </>
          :
          <p>No Data</p>
        }
        <Button className="me-2" variant="outline-success" onClick={() => append({string: ''})}>Add</Button>
        <Button className="me-2" variant="primary" type='submit'>Submit</Button>
      </form>
    </>
  )
};

export default MultiFields;