function InvalidLocationParameterError(location) {
  this.name = 'InvalidLocationParameterError';
  this.message = `Value for location=${location} is invalid. See documentation for possible values.`;
}
InvalidLocationParameterError.prototype = Error.prototype;
module.exports = InvalidLocationParameterError;
