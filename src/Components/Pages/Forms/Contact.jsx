import React from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";

const Contact = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submit = (e) => {
    console.log(e);
  }

  return (
    <>
      <p>Simple Contact Form utilizing useForm react hook to validate inputs</p>
      <form onSubmit={handleSubmit(submit)}>
        <input type='text' className={`form-control ${errors.first_name ? 'is-invalid mb-0' : 'mb-3'}`}
          {...register(
            "first_name",
            {
              required: "First name field is required"
            }
          )}
        />
        {errors.first_name ? <p role="alert" className="invalid-feedback">{errors.first_name.message}</p> : null}
        <input type='text' className={`form-control ${errors.last_name ? 'is-invalid mb-0' : 'mb-3'}`}
          {...register(
            "last_name",
            {
              required: "Last name field is required"
            }
          )}
        />
        {errors.last_name ? <p role="alert" className="invalid-feedback">{errors.last_name.message}</p> : null}
        <input type='email' className={`form-control ${errors.email ? 'is-invalid mb-0' : 'mb-3'}`}
          {...register(
            "email",
            {
              required: "Email field is required"
            }
          )}
        />
        {errors.email ? <p role="alert" className="invalid-feedback">{errors.email.message}</p> : null}
        <input type='tel' className={`form-control ${errors.phone ? 'is-invalid mb-0' : 'mb-3'}`}
          {...register(
            "phone",
            {
              required: "Phone field is required"
            }
          )}
        />
        {errors.phone ? <p role="alert" className="invalid-feedback">{errors.phone.message}</p> : null}
        <Button className="me-2" variant="primary" type='submit'>Submit</Button>
      </form>
    </>
  )
}

export default Contact;