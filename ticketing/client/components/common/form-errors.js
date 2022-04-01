const FormErrors = ({ errors }) =>
  errors.length > 0 ? (
    <div className="alert alert-danger">
      <h4>Oops...</h4>
      <ul className="my-0">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  ) : null;

export default FormErrors;
