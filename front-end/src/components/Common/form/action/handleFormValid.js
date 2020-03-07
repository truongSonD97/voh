export const handleFormValid = (input ,setErrorState) => {
  let errors = {};
  let formIsValid = true;
  let districtsInput = input.district;
  if(districtsInput.length === 0){
    formIsValid = false;
    errors["district"] = "bắt buộc";
  }
  //number
  if (!input["phoneNumber"]) {
    formIsValid = false;
    errors["phoneNumber"] = "bắt buộc ";
  } else if (input["phoneNumber"].length < 4 || input["phoneNumber"].length > 10) {
    formIsValid = false;
    errors["phoneNumber"] = "Sai định dạng";
  }
  //name
  if (!input["personSharing"]) {
    formIsValid = false;
    errors["personSharing"] = "bắt buộc";
  }
  //address
  if (!input["addresses"]) {
    formIsValid = false;
    errors["addresses"] = "bắt buộc";
  }
  //speed
  if (!input["speeds"]) {
    formIsValid = false;
    errors["speeds"] = "bắt buộc";
  }

  // if (!input["reasons"]) {
  //   formIsValid = false;
  //   errors["reasons"] = "bắt buộc";
  // }

  // this.setState({ errors: errors });
  setErrorState(errors);
  return formIsValid;
};