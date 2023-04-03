class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }
  static UsernotExist(message = "username or password is wrong!") {
    return new CustomErrorHandler(401, message);
  }
  static UnAuthorized(message = "UnAuthorized") {
    return new CustomErrorHandler(401, message);
  }
  static NotFound(message = "User NotFound!") {
    return new CustomErrorHandler(404, message);
  }
  static serverError(message = "Internal server error!!") {
    return new CustomErrorHandler(500, message);
  }
}

export default CustomErrorHandler;