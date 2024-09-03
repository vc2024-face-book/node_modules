"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.helpers = exports.default = exports.commands = void 0;

require("source-map-support/register");

var _logger = _interopRequireDefault(require("../logger"));

var _lodash = _interopRequireDefault(require("lodash"));

const commands = {},
      helpers = {},
      extensions = {};
exports.helpers = helpers;
exports.commands = commands;
extensions.supportedLogTypes = {};

commands.getLogTypes = async function getLogTypes() {
  _logger.default.debug('Retrieving supported log types');

  return _lodash.default.keys(this.supportedLogTypes);
};

commands.getLog = async function getLog(logType) {
  _logger.default.debug(`Retrieving '${logType}' logs`);

  if (!(await this.getLogTypes()).includes(logType)) {
    const logsTypesWithDescriptions = _lodash.default.reduce(this.supportedLogTypes, (acc, value, key) => {
      acc[key] = value.description;
      return acc;
    }, {});

    throw new Error(`Unsupported log type '${logType}'. ` + `Supported types: ${JSON.stringify(logsTypesWithDescriptions)}`);
  }

  return await this.supportedLogTypes[logType].getter(this);
};

Object.assign(extensions, commands, helpers);
var _default = extensions;
exports.default = _default;require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9iYXNlZHJpdmVyL2NvbW1hbmRzL2xvZy5qcyJdLCJuYW1lcyI6WyJjb21tYW5kcyIsImhlbHBlcnMiLCJleHRlbnNpb25zIiwic3VwcG9ydGVkTG9nVHlwZXMiLCJnZXRMb2dUeXBlcyIsImxvZyIsImRlYnVnIiwiXyIsImtleXMiLCJnZXRMb2ciLCJsb2dUeXBlIiwiaW5jbHVkZXMiLCJsb2dzVHlwZXNXaXRoRGVzY3JpcHRpb25zIiwicmVkdWNlIiwiYWNjIiwidmFsdWUiLCJrZXkiLCJkZXNjcmlwdGlvbiIsIkVycm9yIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldHRlciIsIk9iamVjdCIsImFzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFHQSxNQUFNQSxRQUFRLEdBQUcsRUFBakI7QUFBQSxNQUFxQkMsT0FBTyxHQUFHLEVBQS9CO0FBQUEsTUFBbUNDLFVBQVUsR0FBRyxFQUFoRDs7O0FBVUFBLFVBQVUsQ0FBQ0MsaUJBQVgsR0FBK0IsRUFBL0I7O0FBR0FILFFBQVEsQ0FBQ0ksV0FBVCxHQUF1QixlQUFlQSxXQUFmLEdBQThCO0FBQ25EQyxrQkFBSUMsS0FBSixDQUFVLGdDQUFWOztBQUNBLFNBQU9DLGdCQUFFQyxJQUFGLENBQU8sS0FBS0wsaUJBQVosQ0FBUDtBQUNELENBSEQ7O0FBS0FILFFBQVEsQ0FBQ1MsTUFBVCxHQUFrQixlQUFlQSxNQUFmLENBQXVCQyxPQUF2QixFQUFnQztBQUNoREwsa0JBQUlDLEtBQUosQ0FBVyxlQUFjSSxPQUFRLFFBQWpDOztBQUVBLE1BQUksQ0FBQyxDQUFDLE1BQU0sS0FBS04sV0FBTCxFQUFQLEVBQTJCTyxRQUEzQixDQUFvQ0QsT0FBcEMsQ0FBTCxFQUFtRDtBQUNqRCxVQUFNRSx5QkFBeUIsR0FBR0wsZ0JBQUVNLE1BQUYsQ0FBUyxLQUFLVixpQkFBZCxFQUFpQyxDQUFDVyxHQUFELEVBQU1DLEtBQU4sRUFBYUMsR0FBYixLQUFxQjtBQUN0RkYsTUFBQUEsR0FBRyxDQUFDRSxHQUFELENBQUgsR0FBV0QsS0FBSyxDQUFDRSxXQUFqQjtBQUNBLGFBQU9ILEdBQVA7QUFDRCxLQUhpQyxFQUcvQixFQUgrQixDQUFsQzs7QUFJQSxVQUFNLElBQUlJLEtBQUosQ0FBVyx5QkFBd0JSLE9BQVEsS0FBakMsR0FDYixvQkFBbUJTLElBQUksQ0FBQ0MsU0FBTCxDQUFlUix5QkFBZixDQUEwQyxFQUQxRCxDQUFOO0FBRUQ7O0FBRUQsU0FBTyxNQUFNLEtBQUtULGlCQUFMLENBQXVCTyxPQUF2QixFQUFnQ1csTUFBaEMsQ0FBdUMsSUFBdkMsQ0FBYjtBQUNELENBYkQ7O0FBZUFDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjckIsVUFBZCxFQUEwQkYsUUFBMUIsRUFBb0NDLE9BQXBDO2VBRWVDLFUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbG9nIGZyb20gJy4uL2xvZ2dlcic7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbmNvbnN0IGNvbW1hbmRzID0ge30sIGhlbHBlcnMgPSB7fSwgZXh0ZW5zaW9ucyA9IHt9O1xuXG4vLyBvdmVycmlkZSBpbiBzdWItY2xhc3Nlcywgd2l0aCBhcHByb3ByaWF0ZSBsb2dzXG4vLyBpbiB0aGUgZm9ybSBvZlxuLy8gICB7XG4vLyAgICAgdHlwZToge1xuLy8gICAgICAgZGVzY3JpcHRpb246ICdzb21lIHVzZWZ1bCB0ZXh0Jyxcbi8vICAgICAgIGdldHRlcjogKCkgPT4ge30sIC8vIHNvbWUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB0byBnZXQgdGhlIGxvZ3Ncbi8vICAgICB9XG4vLyAgIH1cbmV4dGVuc2lvbnMuc3VwcG9ydGVkTG9nVHlwZXMgPSB7fTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtYXdhaXRcbmNvbW1hbmRzLmdldExvZ1R5cGVzID0gYXN5bmMgZnVuY3Rpb24gZ2V0TG9nVHlwZXMgKCkge1xuICBsb2cuZGVidWcoJ1JldHJpZXZpbmcgc3VwcG9ydGVkIGxvZyB0eXBlcycpO1xuICByZXR1cm4gXy5rZXlzKHRoaXMuc3VwcG9ydGVkTG9nVHlwZXMpO1xufTtcblxuY29tbWFuZHMuZ2V0TG9nID0gYXN5bmMgZnVuY3Rpb24gZ2V0TG9nIChsb2dUeXBlKSB7XG4gIGxvZy5kZWJ1ZyhgUmV0cmlldmluZyAnJHtsb2dUeXBlfScgbG9nc2ApO1xuXG4gIGlmICghKGF3YWl0IHRoaXMuZ2V0TG9nVHlwZXMoKSkuaW5jbHVkZXMobG9nVHlwZSkpIHtcbiAgICBjb25zdCBsb2dzVHlwZXNXaXRoRGVzY3JpcHRpb25zID0gXy5yZWR1Y2UodGhpcy5zdXBwb3J0ZWRMb2dUeXBlcywgKGFjYywgdmFsdWUsIGtleSkgPT4ge1xuICAgICAgYWNjW2tleV0gPSB2YWx1ZS5kZXNjcmlwdGlvbjtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgbG9nIHR5cGUgJyR7bG9nVHlwZX0nLiBgICtcbiAgICAgIGBTdXBwb3J0ZWQgdHlwZXM6ICR7SlNPTi5zdHJpbmdpZnkobG9nc1R5cGVzV2l0aERlc2NyaXB0aW9ucyl9YCk7XG4gIH1cblxuICByZXR1cm4gYXdhaXQgdGhpcy5zdXBwb3J0ZWRMb2dUeXBlc1tsb2dUeXBlXS5nZXR0ZXIodGhpcyk7XG59O1xuXG5PYmplY3QuYXNzaWduKGV4dGVuc2lvbnMsIGNvbW1hbmRzLCBoZWxwZXJzKTtcbmV4cG9ydCB7IGNvbW1hbmRzLCBoZWxwZXJzfTtcbmV4cG9ydCBkZWZhdWx0IGV4dGVuc2lvbnM7XG4iXSwiZmlsZSI6ImxpYi9iYXNlZHJpdmVyL2NvbW1hbmRzL2xvZy5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLiJ9
