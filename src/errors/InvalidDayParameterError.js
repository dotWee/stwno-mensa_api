function InvalidDayParameterError(day) {
  this.name = 'InvalidDayParameterError';
  this.message = `Value for day=${day} is invalid. See documentation for possible values.`;
}
InvalidDayParameterError.prototype = Error.prototype;
