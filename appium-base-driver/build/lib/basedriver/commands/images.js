"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.helpers = exports.default = exports.commands = exports.MATCH_TEMPLATE_MODE = exports.DEFAULT_MATCH_THRESHOLD = void 0;

require("source-map-support/register");

var _lodash = _interopRequireDefault(require("lodash"));

var _errors = require("../../protocol/errors");

var _appiumSupport = require("appium-support");

const commands = {},
      helpers = {},
      extensions = {};
exports.helpers = helpers;
exports.commands = commands;
const MATCH_FEATURES_MODE = 'matchFeatures';
const GET_SIMILARITY_MODE = 'getSimilarity';
const MATCH_TEMPLATE_MODE = 'matchTemplate';
exports.MATCH_TEMPLATE_MODE = MATCH_TEMPLATE_MODE;
const DEFAULT_MATCH_THRESHOLD = 0.4;
exports.DEFAULT_MATCH_THRESHOLD = DEFAULT_MATCH_THRESHOLD;

commands.compareImages = async function compareImages(mode, firstImage, secondImage, options = {}) {
  const img1 = Buffer.from(firstImage, 'base64');
  const img2 = Buffer.from(secondImage, 'base64');
  let result = null;

  switch (_lodash.default.toLower(mode)) {
    case MATCH_FEATURES_MODE.toLowerCase():
      result = await _appiumSupport.imageUtil.getImagesMatches(img1, img2, options);
      break;

    case GET_SIMILARITY_MODE.toLowerCase():
      result = await _appiumSupport.imageUtil.getImagesSimilarity(img1, img2, options);
      break;

    case MATCH_TEMPLATE_MODE.toLowerCase():
      result = await _appiumSupport.imageUtil.getImageOccurrence(img1, img2, options);

      if (options.multiple) {
        return result.multiple.map(convertVisualizationToBase64);
      }

      break;

    default:
      throw new _errors.errors.InvalidArgumentError(`'${mode}' images comparison mode is unknown. ` + `Only ${JSON.stringify([MATCH_FEATURES_MODE, GET_SIMILARITY_MODE, MATCH_TEMPLATE_MODE])} modes are supported.`);
  }

  return convertVisualizationToBase64(result);
};

function convertVisualizationToBase64(element) {
  if (!_lodash.default.isEmpty(element.visualization)) {
    element.visualization = element.visualization.toString('base64');
  }

  return element;
}

Object.assign(extensions, commands, helpers);
var _default = extensions;
exports.default = _default;require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9iYXNlZHJpdmVyL2NvbW1hbmRzL2ltYWdlcy5qcyJdLCJuYW1lcyI6WyJjb21tYW5kcyIsImhlbHBlcnMiLCJleHRlbnNpb25zIiwiTUFUQ0hfRkVBVFVSRVNfTU9ERSIsIkdFVF9TSU1JTEFSSVRZX01PREUiLCJNQVRDSF9URU1QTEFURV9NT0RFIiwiREVGQVVMVF9NQVRDSF9USFJFU0hPTEQiLCJjb21wYXJlSW1hZ2VzIiwibW9kZSIsImZpcnN0SW1hZ2UiLCJzZWNvbmRJbWFnZSIsIm9wdGlvbnMiLCJpbWcxIiwiQnVmZmVyIiwiZnJvbSIsImltZzIiLCJyZXN1bHQiLCJfIiwidG9Mb3dlciIsInRvTG93ZXJDYXNlIiwiaW1hZ2VVdGlsIiwiZ2V0SW1hZ2VzTWF0Y2hlcyIsImdldEltYWdlc1NpbWlsYXJpdHkiLCJnZXRJbWFnZU9jY3VycmVuY2UiLCJtdWx0aXBsZSIsIm1hcCIsImNvbnZlcnRWaXN1YWxpemF0aW9uVG9CYXNlNjQiLCJlcnJvcnMiLCJJbnZhbGlkQXJndW1lbnRFcnJvciIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbGVtZW50IiwiaXNFbXB0eSIsInZpc3VhbGl6YXRpb24iLCJ0b1N0cmluZyIsIk9iamVjdCIsImFzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQSxNQUFNQSxRQUFRLEdBQUcsRUFBakI7QUFBQSxNQUFxQkMsT0FBTyxHQUFHLEVBQS9CO0FBQUEsTUFBbUNDLFVBQVUsR0FBRyxFQUFoRDs7O0FBRUEsTUFBTUMsbUJBQW1CLEdBQUcsZUFBNUI7QUFDQSxNQUFNQyxtQkFBbUIsR0FBRyxlQUE1QjtBQUNBLE1BQU1DLG1CQUFtQixHQUFHLGVBQTVCOztBQUVBLE1BQU1DLHVCQUF1QixHQUFHLEdBQWhDOzs7QUFxQ0FOLFFBQVEsQ0FBQ08sYUFBVCxHQUF5QixlQUFlQSxhQUFmLENBQThCQyxJQUE5QixFQUFvQ0MsVUFBcEMsRUFBZ0RDLFdBQWhELEVBQTZEQyxPQUFPLEdBQUcsRUFBdkUsRUFBMkU7QUFDbEcsUUFBTUMsSUFBSSxHQUFHQyxNQUFNLENBQUNDLElBQVAsQ0FBWUwsVUFBWixFQUF3QixRQUF4QixDQUFiO0FBQ0EsUUFBTU0sSUFBSSxHQUFHRixNQUFNLENBQUNDLElBQVAsQ0FBWUosV0FBWixFQUF5QixRQUF6QixDQUFiO0FBQ0EsTUFBSU0sTUFBTSxHQUFHLElBQWI7O0FBRUEsVUFBUUMsZ0JBQUVDLE9BQUYsQ0FBVVYsSUFBVixDQUFSO0FBQ0UsU0FBS0wsbUJBQW1CLENBQUNnQixXQUFwQixFQUFMO0FBQ0VILE1BQUFBLE1BQU0sR0FBRyxNQUFNSSx5QkFBVUMsZ0JBQVYsQ0FBMkJULElBQTNCLEVBQWlDRyxJQUFqQyxFQUF1Q0osT0FBdkMsQ0FBZjtBQUNBOztBQUNGLFNBQUtQLG1CQUFtQixDQUFDZSxXQUFwQixFQUFMO0FBQ0VILE1BQUFBLE1BQU0sR0FBRyxNQUFNSSx5QkFBVUUsbUJBQVYsQ0FBOEJWLElBQTlCLEVBQW9DRyxJQUFwQyxFQUEwQ0osT0FBMUMsQ0FBZjtBQUNBOztBQUNGLFNBQUtOLG1CQUFtQixDQUFDYyxXQUFwQixFQUFMO0FBRUVILE1BQUFBLE1BQU0sR0FBRyxNQUFNSSx5QkFBVUcsa0JBQVYsQ0FBNkJYLElBQTdCLEVBQW1DRyxJQUFuQyxFQUF5Q0osT0FBekMsQ0FBZjs7QUFFQSxVQUFJQSxPQUFPLENBQUNhLFFBQVosRUFBc0I7QUFDcEIsZUFBT1IsTUFBTSxDQUFDUSxRQUFQLENBQWdCQyxHQUFoQixDQUFvQkMsNEJBQXBCLENBQVA7QUFDRDs7QUFDRDs7QUFDRjtBQUNFLFlBQU0sSUFBSUMsZUFBT0Msb0JBQVgsQ0FBaUMsSUFBR3BCLElBQUssdUNBQVQsR0FDbkMsUUFBT3FCLElBQUksQ0FBQ0MsU0FBTCxDQUFlLENBQUMzQixtQkFBRCxFQUFzQkMsbUJBQXRCLEVBQTJDQyxtQkFBM0MsQ0FBZixDQUFnRix1QkFEcEYsQ0FBTjtBQWhCSjs7QUFvQkEsU0FBT3FCLDRCQUE0QixDQUFDVixNQUFELENBQW5DO0FBQ0QsQ0ExQkQ7O0FBbUNBLFNBQVNVLDRCQUFULENBQXVDSyxPQUF2QyxFQUFnRDtBQUM5QyxNQUFJLENBQUNkLGdCQUFFZSxPQUFGLENBQVVELE9BQU8sQ0FBQ0UsYUFBbEIsQ0FBTCxFQUF1QztBQUNyQ0YsSUFBQUEsT0FBTyxDQUFDRSxhQUFSLEdBQXdCRixPQUFPLENBQUNFLGFBQVIsQ0FBc0JDLFFBQXRCLENBQStCLFFBQS9CLENBQXhCO0FBQ0Q7O0FBRUQsU0FBT0gsT0FBUDtBQUNEOztBQUVESSxNQUFNLENBQUNDLE1BQVAsQ0FBY2xDLFVBQWQsRUFBMEJGLFFBQTFCLEVBQW9DQyxPQUFwQztlQUVlQyxVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGVycm9ycyB9IGZyb20gJy4uLy4uL3Byb3RvY29sL2Vycm9ycyc7XG5pbXBvcnQgeyBpbWFnZVV0aWwgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5cbmNvbnN0IGNvbW1hbmRzID0ge30sIGhlbHBlcnMgPSB7fSwgZXh0ZW5zaW9ucyA9IHt9O1xuXG5jb25zdCBNQVRDSF9GRUFUVVJFU19NT0RFID0gJ21hdGNoRmVhdHVyZXMnO1xuY29uc3QgR0VUX1NJTUlMQVJJVFlfTU9ERSA9ICdnZXRTaW1pbGFyaXR5JztcbmNvbnN0IE1BVENIX1RFTVBMQVRFX01PREUgPSAnbWF0Y2hUZW1wbGF0ZSc7XG5cbmNvbnN0IERFRkFVTFRfTUFUQ0hfVEhSRVNIT0xEID0gMC40O1xuXG4vKipcbiAqIFBlcmZvcm1zIGltYWdlcyBjb21wYXJpc29uIHVzaW5nIE9wZW5DViBmcmFtZXdvcmsgZmVhdHVyZXMuXG4gKiBJdCBpcyBleHBlY3RlZCB0aGF0IGJvdGggT3BlbkNWIGZyYW1ld29yayBhbmQgb3BlbmN2NG5vZGVqc1xuICogbW9kdWxlIGFyZSBpbnN0YWxsZWQgb24gdGhlIG1hY2hpbmUgd2hlcmUgQXBwaXVtIHNlcnZlciBpcyBydW5uaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlIC0gT25lIG9mIHBvc3NpYmxlIGNvbXBhcmlzb24gbW9kZXM6XG4gKiBtYXRjaEZlYXR1cmVzLCBnZXRTaW1pbGFyaXR5LCBtYXRjaFRlbXBsYXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlyc3RJbWFnZSAtIEJhc2U2NC1lbmNvZGVkIGltYWdlIGZpbGUuXG4gKiBBbGwgaW1hZ2UgZm9ybWF0cywgdGhhdCBPcGVuQ1YgbGlicmFyeSBpdHNlbGYgYWNjZXB0cywgYXJlIHN1cHBvcnRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWNvbmRJbWFnZSAtIEJhc2U2NC1lbmNvZGVkIGltYWdlIGZpbGUuXG4gKiBBbGwgaW1hZ2UgZm9ybWF0cywgdGhhdCBPcGVuQ1YgbGlicmFyeSBpdHNlbGYgYWNjZXB0cywgYXJlIHN1cHBvcnRlZC5cbiAqIEBwYXJhbSB7P09iamVjdH0gb3B0aW9ucyBbe31dIC0gVGhlIGNvbnRlbnQgb2YgdGhpcyBkaWN0aW9uYXJ5IGRlcGVuZHNcbiAqIG9uIHRoZSBhY3R1YWwgYG1vZGVgIHZhbHVlLlxuICogRm9yIE1BVENIX1RFTVBMQVRFX01PREU6XG4gKiAgIC0gdmlzdWFsaXplOiBpbmNsdWRlIHRoZSB2aXN1YWxpemF0aW9uIG9mIHRoZSBtYXRjaCBpbiB0aGUgcmVzdWx0XG4gKiAgICAgICAgICAgICAgICAoZGVmYXVsdDogZmFsc2UpXG4gKiAgIC0gdGhyZXNob2xkOiB0aGUgaW1hZ2UgbWF0Y2ggdGhyZXNob2xkLCBoaWdoZXIgdmFsdWVzXG4gKiAgICAgICAgICAgICAgICByZXF1aXJlIGEgY2xvc2VyIGltYWdlIHNpbWlsYXJpdHkgdG8gbWF0Y2hcbiAqICAgICAgICAgICAgICAgIChkZWZhdWx0OiAwLjUpXG4gKiAgIC0gbXVsdGlwbGU6IHJldHVybiBtdWx0aXBsZSBtYXRjaGVzIGluIHRoZSBpbWFnZVxuICogICAgICAgICAgICAgICAoZGVmYXVsdDogZmFsc2UpXG4gKiAgIC0gbWF0Y2hOZWlnaGJvdXJUaHJlc2hvbGQ6IGlmIG11bHRpcGxlIGlzIHNwZWNpZmllZCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lIHRoZSBudW1iZXIgb2YgcGl4ZWxzIHdpdGhpblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGljaCB0byBjb25zaWRlciBhIHBpeGVsIGFzIHBhcnQgb2YgdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbWUgbWF0Y2ggcmVzdWx0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChkZWZhdWx0OiAxMClcbiAqIFNlZSB0aGUgZG9jdW1lbnRhdGlvbiBpbiB0aGUgYGFwcGl1bS1zdXBwb3J0YFxuICogbW9kdWxlIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgY29udGVudCBvZiB0aGUgcmVzdWx0aW5nIGRpY3Rpb25hcnkgZGVwZW5kc1xuICogb24gdGhlIGFjdHVhbCBgbW9kZWAgYW5kIGBvcHRpb25zYCB2YWx1ZXMuIFNlZSB0aGUgZG9jdW1lbnRhdGlvbiBvblxuICogYGFwcGl1bS1zdXBwb3J0YCBtb2R1bGUgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEB0aHJvd3Mge0Vycm9yfSBJZiByZXF1aXJlZCBPcGVuQ1YgbW9kdWxlcyBhcmUgbm90IGluc3RhbGxlZCBvclxuICogaWYgYG1vZGVgIHZhbHVlIGlzIGluY29ycmVjdCBvciBpZiB0aGVyZSB3YXMgYW4gdW5leHBlY3RlZCBpc3N1ZSB3aGlsZVxuICogbWF0Y2hpbmcgdGhlIGltYWdlcy5cbiAqL1xuY29tbWFuZHMuY29tcGFyZUltYWdlcyA9IGFzeW5jIGZ1bmN0aW9uIGNvbXBhcmVJbWFnZXMgKG1vZGUsIGZpcnN0SW1hZ2UsIHNlY29uZEltYWdlLCBvcHRpb25zID0ge30pIHtcbiAgY29uc3QgaW1nMSA9IEJ1ZmZlci5mcm9tKGZpcnN0SW1hZ2UsICdiYXNlNjQnKTtcbiAgY29uc3QgaW1nMiA9IEJ1ZmZlci5mcm9tKHNlY29uZEltYWdlLCAnYmFzZTY0Jyk7XG4gIGxldCByZXN1bHQgPSBudWxsO1xuXG4gIHN3aXRjaCAoXy50b0xvd2VyKG1vZGUpKSB7XG4gICAgY2FzZSBNQVRDSF9GRUFUVVJFU19NT0RFLnRvTG93ZXJDYXNlKCk6XG4gICAgICByZXN1bHQgPSBhd2FpdCBpbWFnZVV0aWwuZ2V0SW1hZ2VzTWF0Y2hlcyhpbWcxLCBpbWcyLCBvcHRpb25zKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgR0VUX1NJTUlMQVJJVFlfTU9ERS50b0xvd2VyQ2FzZSgpOlxuICAgICAgcmVzdWx0ID0gYXdhaXQgaW1hZ2VVdGlsLmdldEltYWdlc1NpbWlsYXJpdHkoaW1nMSwgaW1nMiwgb3B0aW9ucyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIE1BVENIX1RFTVBMQVRFX01PREUudG9Mb3dlckNhc2UoKTpcbiAgICAgIC8vIGZpcnN0SW1hZ2UvaW1nMSBpcyB0aGUgZnVsbCBpbWFnZSBhbmQgc2Vjb25kSW1hZ2UvaW1nMiBpcyB0aGUgcGFydGlhbCBvbmVcbiAgICAgIHJlc3VsdCA9IGF3YWl0IGltYWdlVXRpbC5nZXRJbWFnZU9jY3VycmVuY2UoaW1nMSwgaW1nMiwgb3B0aW9ucyk7XG5cbiAgICAgIGlmIChvcHRpb25zLm11bHRpcGxlKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQubXVsdGlwbGUubWFwKGNvbnZlcnRWaXN1YWxpemF0aW9uVG9CYXNlNjQpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuSW52YWxpZEFyZ3VtZW50RXJyb3IoYCcke21vZGV9JyBpbWFnZXMgY29tcGFyaXNvbiBtb2RlIGlzIHVua25vd24uIGAgK1xuICAgICAgICBgT25seSAke0pTT04uc3RyaW5naWZ5KFtNQVRDSF9GRUFUVVJFU19NT0RFLCBHRVRfU0lNSUxBUklUWV9NT0RFLCBNQVRDSF9URU1QTEFURV9NT0RFXSl9IG1vZGVzIGFyZSBzdXBwb3J0ZWQuYCk7XG4gIH1cblxuICByZXR1cm4gY29udmVydFZpc3VhbGl6YXRpb25Ub0Jhc2U2NChyZXN1bHQpO1xufTtcblxuLyoqXG4gKiBiYXNlNjQgZW5jb2RlcyB0aGUgdmlzdWFsaXphdGlvbiBwYXJ0IG9mIHRoZSByZXN1bHRcbiAqIChpZiBuZWNlc3NhcnkpXG4gKlxuICogQHBhcmFtIHtPY2N1cmVuY2VSZXN1bHR9IGVsZW1lbnQgLSBvY2N1cnJlbmNlIHJlc3VsdFxuICpcbiAqKi9cbmZ1bmN0aW9uIGNvbnZlcnRWaXN1YWxpemF0aW9uVG9CYXNlNjQgKGVsZW1lbnQpIHtcbiAgaWYgKCFfLmlzRW1wdHkoZWxlbWVudC52aXN1YWxpemF0aW9uKSkge1xuICAgIGVsZW1lbnQudmlzdWFsaXphdGlvbiA9IGVsZW1lbnQudmlzdWFsaXphdGlvbi50b1N0cmluZygnYmFzZTY0Jyk7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuT2JqZWN0LmFzc2lnbihleHRlbnNpb25zLCBjb21tYW5kcywgaGVscGVycyk7XG5leHBvcnQgeyBjb21tYW5kcywgaGVscGVycywgREVGQVVMVF9NQVRDSF9USFJFU0hPTEQsIE1BVENIX1RFTVBMQVRFX01PREUgfTtcbmV4cG9ydCBkZWZhdWx0IGV4dGVuc2lvbnM7XG4iXSwiZmlsZSI6ImxpYi9iYXNlZHJpdmVyL2NvbW1hbmRzL2ltYWdlcy5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLiJ9
