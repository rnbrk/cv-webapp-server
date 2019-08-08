/**
 * Uses JSON parsing to convert all Date objects in objectWithDates into ISO strings
 * such as "2019-08-08T10:18:53.211Z"
 * @param {object} objectWithDates - An object with Date objects in them
 * @returns {object} - An object without dates
 */
const convertDatesToISOStrings = objectWithDates =>
  JSON.parse(JSON.stringify(objectWithDates));

/**
 * Returns true if array contains an item which is contained in otherArray as well, false if otherwise
 * @param {array} array
 * @param {array} otherArray
 * @returns {boolean}
 */
const arrayContainsItemOfOtherArray = (array, otherArray) =>
  array.every(arrayItem => otherArray.includes(arrayItem));

module.exports = {
  convertDatesToISOStrings,
  arrayContainsItemOfOtherArray
};
