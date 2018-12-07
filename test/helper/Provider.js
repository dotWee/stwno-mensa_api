const assert = require('assert');
const Provider = require('../../src/helper/Provider');

const TEST_LOCATION_VALUES_VALID = ['regensburg-universität', 'regensburg-oth', 'regensburg-oth-evening'];
const TEST_LOCATION_VALUES_INVALID = ['oth-r', 'unis', 'univ', 'prufening', 'othre', 'prfening'];

describe('Provider', () => {
  describe('isValidLocation', () => {
    TEST_LOCATION_VALUES_VALID.forEach((locationValue) => {
      it('should return true for location ' + locationValue, () => {
        assert.equal(Provider.isValidLocation(locationValue), true);      
      });
    });

    TEST_LOCATION_VALUES_INVALID.forEach((locationValue) => {
      it('should return false for location ' + locationValue, () => {
        assert.equal(Provider.isValidLocation(locationValue), false);      
      });
    });
  });

  describe('resolveLocation', () => {
    it('should resolve the location value', () => {
      assert.equal(Provider.resolveLocation('regensburg-university'), 'UNI-R');
    });
  });
});

const TEST_DAY_VALUES_VALID = ["mo", "dienstag", "sonntag", "fr"];
const TEST_DAY_VALUES_INVALID = ["mon", "dienst", "frei", "sonn"];

describe('Provider', () => {
  describe('isValidDay', () => {
    TEST_DAY_VALUES_VALID.forEach((dayValue) => {
      it('should return true for day ' + dayValue, () => {
        assert.equal(Provider.isValidDay(dayValue), true);      
      });
    });

    TEST_DAY_VALUES_INVALID.forEach((dayValue) => {
      it('should return false for day ' + dayValue, () => {
        assert.equal(Provider.isValidDay(dayValue), false);      
      });
    });
  });

  describe('resolveDay', () => {
    it('should resolve the day value', () => {
      assert.equal(Provider.resolveDay("sonntag"), "sunday");
    });
  });

  describe('resolveToday', () => {
    it('should resolve and validates the todays weekday', () => {
      const todayValue = Provider.resolveToday();
      assert.equal(Provider.isValidDay(todayValue), true);
    });
  });
});
