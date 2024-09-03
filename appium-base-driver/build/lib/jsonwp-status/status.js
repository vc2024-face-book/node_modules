"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.codes = void 0;
exports.getSummaryByCode = getSummaryByCode;

require("source-map-support/register");

var _lodash = _interopRequireDefault(require("lodash"));

const codes = {
  Success: {
    code: 0,
    summary: 'The command executed successfully.'
  },
  NoSuchDriver: {
    code: 6,
    summary: 'A session is either terminated or not started'
  },
  NoSuchElement: {
    code: 7,
    summary: 'An element could not be located on the page using the given search parameters.'
  },
  NoSuchFrame: {
    code: 8,
    summary: 'A request to switch to a frame could not be satisfied because the frame could not be found.'
  },
  UnknownCommand: {
    code: 9,
    summary: 'The requested resource could not be found, or a request was received using an HTTP method that is not supported by the mapped resource.'
  },
  StaleElementReference: {
    code: 10,
    summary: 'An element command failed because the referenced element is no longer attached to the DOM.'
  },
  ElementNotVisible: {
    code: 11,
    summary: 'An element command could not be completed because the element is not visible on the page.'
  },
  InvalidElementState: {
    code: 12,
    summary: 'An element command could not be completed because the element is in an invalid state (e.g. attempting to click a disabled element).'
  },
  UnknownError: {
    code: 13,
    summary: 'An unknown server-side error occurred while processing the command.'
  },
  ElementIsNotSelectable: {
    code: 15,
    summary: 'An attempt was made to select an element that cannot be selected.'
  },
  JavaScriptError: {
    code: 17,
    summary: 'An error occurred while executing user supplied JavaScript.'
  },
  XPathLookupError: {
    code: 19,
    summary: 'An error occurred while searching for an element by XPath.'
  },
  Timeout: {
    code: 21,
    summary: 'An operation did not complete before its timeout expired.'
  },
  NoSuchWindow: {
    code: 23,
    summary: 'A request to switch to a different window could not be satisfied because the window could not be found.'
  },
  InvalidCookieDomain: {
    code: 24,
    summary: 'An illegal attempt was made to set a cookie under a different domain than the current page.'
  },
  UnableToSetCookie: {
    code: 25,
    summary: 'A request to set a cookie\'s value could not be satisfied.'
  },
  UnexpectedAlertOpen: {
    code: 26,
    summary: 'A modal dialog was open, blocking this operation'
  },
  NoAlertOpenError: {
    code: 27,
    summary: 'An attempt was made to operate on a modal dialog when one was not open.'
  },
  ScriptTimeout: {
    code: 28,
    summary: 'A script did not complete before its timeout expired.'
  },
  InvalidElementCoordinates: {
    code: 29,
    summary: 'The coordinates provided to an interactions operation are invalid.'
  },
  IMENotAvailable: {
    code: 30,
    summary: 'IME was not available.'
  },
  IMEEngineActivationFailed: {
    code: 31,
    summary: 'An IME engine could not be started.'
  },
  InvalidSelector: {
    code: 32,
    summary: 'Argument was an invalid selector (e.g. XPath/CSS).'
  },
  SessionNotCreatedException: {
    code: 33,
    summary: 'A new session could not be created.'
  },
  MoveTargetOutOfBounds: {
    code: 34,
    summary: 'Target provided for a move action is out of bounds.'
  },
  NoSuchContext: {
    code: 35,
    summary: 'No such context found.'
  }
};
exports.codes = codes;

function getSummaryByCode(code) {
  code = parseInt(code, 10);

  for (let obj of _lodash.default.values(codes)) {
    if (!_lodash.default.isUndefined(obj.code) && obj.code === code) {
      return obj.summary;
    }
  }

  return 'An error occurred';
}

var _default = codes;
exports.default = _default;require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9qc29ud3Atc3RhdHVzL3N0YXR1cy5qcyJdLCJuYW1lcyI6WyJjb2RlcyIsIlN1Y2Nlc3MiLCJjb2RlIiwic3VtbWFyeSIsIk5vU3VjaERyaXZlciIsIk5vU3VjaEVsZW1lbnQiLCJOb1N1Y2hGcmFtZSIsIlVua25vd25Db21tYW5kIiwiU3RhbGVFbGVtZW50UmVmZXJlbmNlIiwiRWxlbWVudE5vdFZpc2libGUiLCJJbnZhbGlkRWxlbWVudFN0YXRlIiwiVW5rbm93bkVycm9yIiwiRWxlbWVudElzTm90U2VsZWN0YWJsZSIsIkphdmFTY3JpcHRFcnJvciIsIlhQYXRoTG9va3VwRXJyb3IiLCJUaW1lb3V0IiwiTm9TdWNoV2luZG93IiwiSW52YWxpZENvb2tpZURvbWFpbiIsIlVuYWJsZVRvU2V0Q29va2llIiwiVW5leHBlY3RlZEFsZXJ0T3BlbiIsIk5vQWxlcnRPcGVuRXJyb3IiLCJTY3JpcHRUaW1lb3V0IiwiSW52YWxpZEVsZW1lbnRDb29yZGluYXRlcyIsIklNRU5vdEF2YWlsYWJsZSIsIklNRUVuZ2luZUFjdGl2YXRpb25GYWlsZWQiLCJJbnZhbGlkU2VsZWN0b3IiLCJTZXNzaW9uTm90Q3JlYXRlZEV4Y2VwdGlvbiIsIk1vdmVUYXJnZXRPdXRPZkJvdW5kcyIsIk5vU3VjaENvbnRleHQiLCJnZXRTdW1tYXJ5QnlDb2RlIiwicGFyc2VJbnQiLCJvYmoiLCJfIiwidmFsdWVzIiwiaXNVbmRlZmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBLE1BQU1BLEtBQUssR0FBRztBQUNaQyxFQUFBQSxPQUFPLEVBQUU7QUFDUEMsSUFBQUEsSUFBSSxFQUFFLENBREM7QUFFUEMsSUFBQUEsT0FBTyxFQUFFO0FBRkYsR0FERztBQUtaQyxFQUFBQSxZQUFZLEVBQUU7QUFDWkYsSUFBQUEsSUFBSSxFQUFFLENBRE07QUFFWkMsSUFBQUEsT0FBTyxFQUFFO0FBRkcsR0FMRjtBQVNaRSxFQUFBQSxhQUFhLEVBQUU7QUFDYkgsSUFBQUEs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eEIsSUFBQUEsSUFBSSxFQUFFLEVBRG9CO0FBRTFCQyxJQUFBQSxPQUFPLEVBQUU7QUFGaUIsR0E3RmhCO0FBaUdad0IsRUFBQUEscUJBQXFCLEVBQUU7QUFDckJ6QixJQUFBQSxJQUFJLEVBQUUsRUFEZTtBQUVyQkMsSUFBQUEsT0FBTyxFQUFFO0FBRlksR0FqR1g7QUFxR1p5QixFQUFBQSxhQUFhLEVBQUU7QUFDYjFCLElBQUFBLElBQUksRUFBRSxFQURPO0FBRWJDLElBQUFBLE9BQU8sRUFBRTtBQUZJO0FBckdILENBQWQ7OztBQTJHQSxTQUFTMEIsZ0JBQVQsQ0FBMkIzQixJQUEzQixFQUFpQztBQUMvQkEsRUFBQUEsSUFBSSxHQUFHNEIsUUFBUSxDQUFDNUIsSUFBRCxFQUFPLEVBQVAsQ0FBZjs7QUFDQSxPQUFLLElBQUk2QixHQUFULElBQWdCQyxnQkFBRUMsTUFBRixDQUFTakMsS0FBVCxDQUFoQixFQUFpQztBQUMvQixRQUFJLENBQUNnQyxnQkFBRUUsV0FBRixDQUFjSCxHQUFHLENBQUM3QixJQUFsQixDQUFELElBQTRCNkIsR0FBRyxDQUFDN0IsSUFBSixLQUFhQSxJQUE3QyxFQUFtRDtBQUNqRCxhQUFPNkIsR0FBRyxDQUFDNUIsT0FBWDtBQUNEO0FBQ0Y7O0FBQ0QsU0FBTyxtQkFBUDtBQUNEOztlQUVjSCxLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuY29uc3QgY29kZXMgPSB7XG4gIFN1Y2Nlc3M6IHtcbiAgICBjb2RlOiAwLFxuICAgIHN1bW1hcnk6ICdUaGUgY29tbWFuZCBleGVjdXRlZCBzdWNjZXNzZnVsbHkuJ1xuICB9LFxuICBOb1N1Y2hEcml2ZXI6IHtcbiAgICBjb2RlOiA2LFxuICAgIHN1bW1hcnk6ICdBIHNlc3Npb24gaXMgZWl0aGVyIHRlcm1pbmF0ZWQgb3Igbm90IHN0YXJ0ZWQnXG4gIH0sXG4gIE5vU3VjaEVsZW1lbnQ6IHtcbiAgICBjb2RlOiA3LFxuICAgIHN1bW1hcnk6ICdBbiBlbGVtZW50IGNvdWxkIG5vdCBiZSBsb2NhdGVkIG9uIHRoZSBwYWdlIHVzaW5nIHRoZSBnaXZlbiBzZWFyY2ggcGFyYW1ldGVycy4nXG4gIH0sXG4gIE5vU3VjaEZyYW1lOiB7XG4gICAgY29kZTogOCxcbiAgICBzdW1tYXJ5OiAnQSByZXF1ZXN0IHRvIHN3aXRjaCB0byBhIGZyYW1lIGNvdWxkIG5vdCBiZSBzYXRpc2ZpZWQgYmVjYXVzZSB0aGUgZnJhbWUgY291bGQgbm90IGJlIGZvdW5kLidcbiAgfSxcbiAgVW5rbm93bkNvbW1hbmQ6IHtcbiAgICBjb2RlOiA5LFxuICAgIHN1bW1hcnk6ICdUaGUgcmVxdWVzdGVkIHJlc291cmNlIGNvdWxkIG5vdCBiZSBmb3VuZCwgb3IgYSByZXF1ZXN0IHdhcyByZWNlaXZlZCB1c2luZyBhbiBIVFRQIG1ldGhvZCB0aGF0IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIG1hcHBlZCByZXNvdXJjZS4nXG4gIH0sXG4gIFN0YWxlRWxlbWVudFJlZmVyZW5jZToge1xuICAgIGNvZGU6IDEwLFxuICAgIHN1bW1hcnk6ICdBbiBlbGVtZW50IGNvbW1hbmQgZmFpbGVkIGJlY2F1c2UgdGhlIHJlZmVyZW5jZWQgZWxlbWVudCBpcyBubyBsb25nZXIgYXR0YWNoZWQgdG8gdGhlIERPTS4nXG4gIH0sXG4gIEVsZW1lbnROb3RWaXNpYmxlOiB7XG4gICAgY29kZTogMTEsXG4gICAgc3VtbWFyeTogJ0FuIGVsZW1lbnQgY29tbWFuZCBjb3VsZCBub3QgYmUgY29tcGxldGVkIGJlY2F1c2UgdGhlIGVsZW1lbnQgaXMgbm90IHZpc2libGUgb24gdGhlIHBhZ2UuJ1xuICB9LFxuICBJbnZhbGlkRWxlbWVudFN0YXRlOiB7XG4gICAgY29kZTogMTIsXG4gICAgc3VtbWFyeTogJ0FuIGVsZW1lbnQgY29tbWFuZCBjb3VsZCBub3QgYmUgY29tcGxldGVkIGJlY2F1c2UgdGhlIGVsZW1lbnQgaXMgaW4gYW4gaW52YWxpZCBzdGF0ZSAoZS5nLiBhdHRlbXB0aW5nIHRvIGNsaWNrIGEgZGlzYWJsZWQgZWxlbWVudCkuJ1xuICB9LFxuICBVbmtub3duRXJyb3I6IHtcbiAgICBjb2RlOiAxMyxcbiAgICBzdW1tYXJ5OiAnQW4gdW5rbm93biBzZXJ2ZXItc2lkZSBlcnJvciBvY2N1cnJlZCB3aGlsZSBwcm9jZXNzaW5nIHRoZSBjb21tYW5kLidcbiAgfSxcbiAgRWxlbWVudElzTm90U2VsZWN0YWJsZToge1xuICAgIGNvZGU6IDE1LFxuICAgIHN1bW1hcnk6ICdBbiBhdHRlbXB0IHdhcyBtYWRlIHRvIHNlbGVjdCBhbiBlbGVtZW50IHRoYXQgY2Fubm90IGJlIHNlbGVjdGVkLidcbiAgfSxcbiAgSmF2YVNjcmlwdEVycm9yOiB7XG4gICAgY29kZTogMTcsXG4gICAgc3VtbWFyeTogJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGV4ZWN1dGluZyB1c2VyIHN1cHBsaWVkIEphdmFTY3JpcHQuJ1xuICB9LFxuICBYUGF0aExvb2t1cEVycm9yOiB7XG4gICAgY29kZTogMTksXG4gICAgc3VtbWFyeTogJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIHNlYXJjaGluZyBmb3IgYW4gZWxlbWVudCBieSBYUGF0aC4nXG4gIH0sXG4gIFRpbWVvdXQ6IHtcbiAgICBjb2RlOiAyMSxcbiAgICBzdW1tYXJ5OiAnQW4gb3BlcmF0aW9uIGRpZCBub3QgY29tcGxldGUgYmVmb3JlIGl0cyB0aW1lb3V0IGV4cGlyZWQuJ1xuICB9LFxuICBOb1N1Y2hXaW5kb3c6IHtcbiAgICBjb2RlOiAyMyxcbiAgICBzdW1tYXJ5OiAnQSByZXF1ZXN0IHRvIHN3aXRjaCB0byBhIGRpZmZlcmVudCB3aW5kb3cgY291bGQgbm90IGJlIHNhdGlzZmllZCBiZWNhdXNlIHRoZSB3aW5kb3cgY291bGQgbm90IGJlIGZvdW5kLidcbiAgfSxcbiAgSW52YWxpZENvb2tpZURvbWFpbjoge1xuICAgIGNvZGU6IDI0LFxuICAgIHN1bW1hcnk6ICdBbiBpbGxlZ2FsIGF0dGVtcHQgd2FzIG1hZGUgdG8gc2V0IGEgY29va2llIHVuZGVyIGEgZGlmZmVyZW50IGRvbWFpbiB0aGFuIHRoZSBjdXJyZW50IHBhZ2UuJ1xuICB9LFxuICBVbmFibGVUb1NldENvb2tpZToge1xuICAgIGNvZGU6IDI1LFxuICAgIHN1bW1hcnk6ICdBIHJlcXVlc3QgdG8gc2V0IGEgY29va2llXFwncyB2YWx1ZSBjb3VsZCBub3QgYmUgc2F0aXNmaWVkLidcbiAgfSxcbiAgVW5leHBlY3RlZEFsZXJ0T3Blbjoge1xuICAgIGNvZGU6IDI2LFxuICAgIHN1bW1hcnk6ICdBIG1vZGFsIGRpYWxvZyB3YXMgb3BlbiwgYmxvY2tpbmcgdGhpcyBvcGVyYXRpb24nXG4gIH0sXG4gIE5vQWxlcnRPcGVuRXJyb3I6IHtcbiAgICBjb2RlOiAyNyxcbiAgICBzdW1tYXJ5OiAnQW4gYXR0ZW1wdCB3YXMgbWFkZSB0byBvcGVyYXRlIG9uIGEgbW9kYWwgZGlhbG9nIHdoZW4gb25lIHdhcyBub3Qgb3Blbi4nXG4gIH0sXG4gIFNjcmlwdFRpbWVvdXQ6IHtcbiAgICBjb2RlOiAyOCxcbiAgICBzdW1tYXJ5OiAnQSBzY3JpcHQgZGlkIG5vdCBjb21wbGV0ZSBiZWZvcmUgaXRzIHRpbWVvdXQgZXhwaXJlZC4nXG4gIH0sXG4gIEludmFsaWRFbGVtZW50Q29vcmRpbmF0ZXM6IHtcbiAgICBjb2RlOiAyOSxcbiAgICBzdW1tYXJ5OiAnVGhlIGNvb3JkaW5hdGVzIHByb3ZpZGVkIHRvIGFuIGludGVyYWN0aW9ucyBvcGVyYXRpb24gYXJlIGludmFsaWQuJ1xuICB9LFxuICBJTUVOb3RBdmFpbGFibGU6IHtcbiAgICBjb2RlOiAzMCxcbiAgICBzdW1tYXJ5OiAnSU1FIHdhcyBub3QgYXZhaWxhYmxlLidcbiAgfSxcbiAgSU1FRW5naW5lQWN0aXZhdGlvbkZhaWxlZDoge1xuICAgIGNvZGU6IDMxLFxuICAgIHN1bW1hcnk6ICdBbiBJTUUgZW5naW5lIGNvdWxkIG5vdCBiZSBzdGFydGVkLidcbiAgfSxcbiAgSW52YWxpZFNlbGVjdG9yOiB7XG4gICAgY29kZTogMzIsXG4gICAgc3VtbWFyeTogJ0FyZ3VtZW50IHdhcyBhbiBpbnZhbGlkIHNlbGVjdG9yIChlLmcuIFhQYXRoL0NTUykuJ1xuICB9LFxuICBTZXNzaW9uTm90Q3JlYXRlZEV4Y2VwdGlvbjoge1xuICAgIGNvZGU6IDMzLFxuICAgIHN1bW1hcnk6ICdBIG5ldyBzZXNzaW9uIGNvdWxkIG5vdCBiZSBjcmVhdGVkLidcbiAgfSxcbiAgTW92ZVRhcmdldE91dE9mQm91bmRzOiB7XG4gICAgY29kZTogMzQsXG4gICAgc3VtbWFyeTogJ1RhcmdldCBwcm92aWRlZCBmb3IgYSBtb3ZlIGFjdGlvbiBpcyBvdXQgb2YgYm91bmRzLidcbiAgfSxcbiAgTm9TdWNoQ29udGV4dDoge1xuICAgIGNvZGU6IDM1LFxuICAgIHN1bW1hcnk6ICdObyBzdWNoIGNvbnRleHQgZm91bmQuJ1xuICB9XG59O1xuXG5mdW5jdGlvbiBnZXRTdW1tYXJ5QnlDb2RlIChjb2RlKSB7XG4gIGNvZGUgPSBwYXJzZUludChjb2RlLCAxMCk7XG4gIGZvciAobGV0IG9iaiBvZiBfLnZhbHVlcyhjb2RlcykpIHtcbiAgICBpZiAoIV8uaXNVbmRlZmluZWQob2JqLmNvZGUpICYmIG9iai5jb2RlID09PSBjb2RlKSB7XG4gICAgICByZXR1cm4gb2JqLnN1bW1hcnk7XG4gICAgfVxuICB9XG4gIHJldHVybiAnQW4gZXJyb3Igb2NjdXJyZWQnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb2RlcztcbmV4cG9ydCB7IGNvZGVzLCBnZXRTdW1tYXJ5QnlDb2RlIH07XG4iXSwiZmlsZSI6ImxpYi9qc29ud3Atc3RhdHVzL3N0YXR1cy5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLiJ9
