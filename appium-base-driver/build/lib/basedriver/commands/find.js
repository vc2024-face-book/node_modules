"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.helpers = exports.default = exports.commands = exports.IMAGE_STRATEGY = exports.CUSTOM_STRATEGY = void 0;

require("source-map-support/register");

var _logger = _interopRequireDefault(require("../logger"));

var _appiumSupport = require("appium-support");

var _lodash = _interopRequireDefault(require("lodash"));

var _2 = require("../../..");

var _images = require("./images");

var _imageElement = require("../image-element");

const commands = {},
      helpers = {},
      extensions = {};
exports.helpers = helpers;
exports.commands = commands;
const IMAGE_STRATEGY = '-image';
exports.IMAGE_STRATEGY = IMAGE_STRATEGY;
const CUSTOM_STRATEGY = '-custom';
exports.CUSTOM_STRATEGY = CUSTOM_STRATEGY;
const FLOAT_PRECISION = 100000;

helpers.findElOrElsWithProcessing = async function findElOrElsWithProcessing(strategy, selector, mult, context) {
  this.validateLocatorStrategy(strategy);

  try {
    return await this.findElOrEls(strategy, selector, mult, context);
  } catch (err) {
    if (this.opts.printPageSourceOnFindFailure) {
      const src = await this.getPageSource();

      _logger.default.debug(`Error finding element${mult ? 's' : ''}: ${err.message}`);

      _logger.default.debug(`Page source requested through 'printPageSourceOnFindFailure':`);

      _logger.default.debug(src);
    }

    throw err;
  }
};

commands.findElement = async function findElement(strategy, selector) {
  if (strategy === IMAGE_STRATEGY) {
    return await this.findByImage(selector, {
      multiple: false
    });
  } else if (strategy === CUSTOM_STRATEGY) {
    return await this.findByCustom(selector, false);
  }

  return await this.findElOrElsWithProcessing(strategy, selector, false);
};

commands.findElements = async function findElements(strategy, selector) {
  if (strategy === IMAGE_STRATEGY) {
    return await this.findByImage(selector, {
      multiple: true
    });
  } else if (strategy === CUSTOM_STRATEGY) {
    return await this.findByCustom(selector, true);
  }

  return await this.findElOrElsWithProcessing(strategy, selector, true);
};

commands.findElementFromElement = async function findElementFromElement(strategy, selector, elementId) {
  return await this.findElOrElsWithProcessing(strategy, selector, false, elementId);
};

commands.findElementsFromElement = async function findElementsFromElement(strategy, selector, elementId) {
  return await this.findElOrElsWithProcessing(strategy, selector, true, elementId);
};

commands.findByCustom = async function findByCustom(selector, multiple) {
  const plugins = this.opts.customFindModules;

  if (!plugins) {
    throw new Error('Finding an element using a plugin is currently an ' + 'incubating feature. To use it you must manually install one or more ' + 'plugin modules in a way that they can be required by Appium, for ' + 'example installing them from the Appium directory, installing them ' + 'globally, or installing them elsewhere and passing an absolute path as ' + 'the capability. Then construct an object where the key is the shortcut ' + 'name for this plugin and the value is the module name or absolute path, ' + 'for example: {"p1": "my-find-plugin"}, and pass this in as the ' + "'customFindModules' capability.");
  }

  if (!_lodash.default.isPlainObject(plugins)) {
    throw new Error("Invalid format for the 'customFindModules' capability. " + 'It should be an object with keys corresponding to the short names and ' + 'values corresponding to the full names of the element finding plugins');
  }

  let [plugin, realSelector] = selector.split(':');

  if (_lodash.default.size(plugins) > 1 && !realSelector) {
    throw new Error(`Multiple element finding plugins were registered ` + `(${_lodash.default.keys(plugins)}), but your selector did not indicate which plugin ` + `to use. Ensure you put the short name of the plugin followed by ':' as ` + `the initial part of the selector string.`);
  }

  if (_lodash.default.size(plugins) === 1 && !realSelector) {
    realSelector = plugin;
    plugin = _lodash.default.keys(plugins)[0];
  }

  if (!plugins[plugin]) {
    throw new Error(`Selector specified use of element finding plugin ` + `'${plugin}' but it was not registered in the 'customFindModules' ` + `capability.`);
  }

  let finder;

  try {
    _logger.default.debug(`Find plugin '${plugin}' requested; will attempt to use it ` + `from '${plugins[plugin]}'`);

    finder = require(plugins[plugin]);
  } catch (err) {
    throw new Error(`Could not load your custom find module '${plugin}'. Did ` + `you put it somewhere Appium can 'require' it? Original error: ${err}`);
  }

  if (!finder || !_lodash.default.isFunction(finder.find)) {
    throw new Error('Your custom find module did not appear to be constructed ' + 'correctly. It needs to export an object with a `find` method.');
  }

  const customFinderLog = _appiumSupport.logger.getLogger(plugin);

  let elements;

  const condition = async () => {
    elements = await finder.find(this, customFinderLog, realSelector, multiple);

    if (!_lodash.default.isEmpty(elements) || multiple) {
      return true;
    }

    return false;
  };

  try {
    await this.implicitWaitForCondition(condition);
  } catch (err) {
    if (err.message.match(/Condition unmet/)) {
      throw new _2.errors.NoSuchElementError();
    }

    throw err;
  }

  return multiple ? elements : elements[0];
};

helpers.findByImage = async function findByImage(b64Template, {
  shouldCheckStaleness = false,
  multiple = false,
  ignoreDefaultImageTemplateScale = false
}) {
  const {
    imageMatchThreshold: threshold,
    imageMatchMethod,
    fixImageTemplateSize,
    fixImageTemplateScale,
    defaultImageTemplateScale,
    getMatchedImageResult: visualize
  } = this.settings.getSettings();

  _logger.default.info(`Finding image element with match threshold ${threshold}`);

  if (!this.getWindowSize) {
    throw new Error("This driver does not support the required 'getWindowSize' command");
  }

  const {
    width: screenWidth,
    height: screenHeight
  } = await this.getWindowSize();

  if (fixImageTemplateSize) {
    b64Template = await this.ensureTemplateSize(b64Template, screenWidth, screenHeight);
  }

  const results = [];

  const condition = async () => {
    try {
      const {
        b64Screenshot,
        scale
      } = await this.getScreenshotForImageFind(screenWidth, screenHeight);
      b64Template = await this.fixImageTemplateScale(b64Template, {
        defaultImageTemplateScale,
        ignoreDefaultImageTemplateScale,
        fixImageTemplateScale,
        ...scale
      });
      const comparisonOpts = {
        threshold,
        visualize,
        multiple
      };

      if (imageMatchMethod) {
        comparisonOpts.method = imageMatchMethod;
      }

      if (multiple) {
        results.push(...(await this.compareImages(_images.MATCH_TEMPLATE_MODE, b64Screenshot, b64Template, comparisonOpts)));
      } else {
        results.push(await this.compareImages(_images.MATCH_TEMPLATE_MODE, b64Screenshot, b64Template, comparisonOpts));
      }

      return true;
    } catch (err) {
      if (err.message.match(/Cannot find any occurrences/)) {
        return false;
      }

      throw err;
    }
  };

  try {
    await this.implicitWaitForCondition(condition);
  } catch (err) {
    if (!err.message.match(/Condition unmet/)) {
      throw err;
    }
  }

  if (_lodash.default.isEmpty(results)) {
    if (multiple) {
      return [];
    }

    throw new _2.errors.NoSuchElementError();
  }

  const elements = results.map(({
    rect,
    score,
    visualization
  }) => {
    _logger.default.info(`Image template matched: ${JSON.stringify(rect)}`);

    return new _imageElement.ImageElement(b64Template, rect, score, visualization);
  });

  if (shouldCheckStaleness) {
    return elements[0];
  }

  const registeredElements = elements.map(imgEl => this.registerImageElement(imgEl));
  return multiple ? registeredElements : registeredElements[0];
};

helpers.ensureTemplateSize = async function ensureTemplateSize(b64Template, screenWidth, screenHeight) {
  let imgObj = await _appiumSupport.imageUtil.getJimpImage(b64Template);
  let {
    width: tplWidth,
    height: tplHeight
  } = imgObj.bitmap;

  _logger.default.info(`Template image is ${tplWidth}x${tplHeight}. Screen size is ${screenWidth}x${screenHeight}`);

  if (tplWidth <= screenWidth && tplHeight <= screenHeight) {
    return b64Template;
  }

  _logger.default.info(`Scaling template image from ${tplWidth}x${tplHeight} to match ` + `screen at ${screenWidth}x${screenHeight}`);

  imgObj = imgObj.scaleToFit(screenWidth, screenHeight);
  return (await imgObj.getBuffer(_appiumSupport.imageUtil.MIME_PNG)).toString('base64');
};

helpers.getScreenshotForImageFind = async function getScreenshotForImageFind(screenWidth, screenHeight) {
  if (!this.getScreenshot) {
    throw new Error("This driver does not support the required 'getScreenshot' command");
  }

  let b64Screenshot = await this.getScreenshot();

  if (!this.settings.getSettings().fixImageFindScreenshotDims) {
    _logger.default.info(`Not verifying screenshot dimensions match screen`);

    return {
      b64Screenshot
    };
  }

  if (screenWidth < 1 || screenHeight < 1) {
    _logger.default.warn(`The retrieved screen size ${screenWidth}x${screenHeight} does ` + `not seem to be valid. No changes will be applied to the screenshot`);

    return {
      b64Screenshot
    };
  }

  _logger.default.info('Verifying screenshot size and aspect ratio');

  let imgObj = await _appiumSupport.imageUtil.getJimpImage(b64Screenshot);
  let {
    width: shotWidth,
    height: shotHeight
  } = imgObj.bitmap;

  if (shotWidth < 1 || shotHeight < 1) {
    _logger.default.warn(`The retrieved screenshot size ${shotWidth}x${shotHeight} does ` + `not seem to be valid. No changes will be applied to the screenshot`);

    return {
      b64Screenshot
    };
  }

  if (screenWidth === shotWidth && screenHeight === shotHeight) {
    _logger.default.info('Screenshot size matched screen size');

    return {
      b64Screenshot
    };
  }

  const scale = {
    xScale: 1.0,
    yScale: 1.0
  };
  const screenAR = screenWidth / screenHeight;
  const shotAR = shotWidth / shotHeight;

  if (Math.round(screenAR * FLOAT_PRECISION) === Math.round(shotAR * FLOAT_PRECISION)) {
    _logger.default.info(`Screenshot aspect ratio '${shotAR}' (${shotWidth}x${shotHeight}) matched ` + `screen aspect ratio '${screenAR}' (${screenWidth}x${screenHeight})`);
  } else {
    _logger.default.warn(`When trying to find an element, determined that the screen ` + `aspect ratio and screenshot aspect ratio are different. Screen ` + `is ${screenWidth}x${screenHeight} whereas screenshot is ` + `${shotWidth}x${shotHeight}.`);

    const xScale = 1.0 * shotWidth / screenWidth;
    const yScale = 1.0 * shotHeight / screenHeight;
    const scaleFactor = xScale >= yScale ? yScale : xScale;

    _logger.default.warn(`Resizing screenshot to ${shotWidth * scaleFactor}x${shotHeight * scaleFactor} to match ` + `screen aspect ratio so that image element coordinates have a ` + `greater chance of being correct.`);

    imgObj = imgObj.resize(shotWidth * scaleFactor, shotHeight * scaleFactor);
    scale.xScale *= scaleFactor;
    scale.yScale *= scaleFactor;
    shotWidth = imgObj.bitmap.width;
    shotHeight = imgObj.bitmap.height;
  }

  if (screenWidth !== shotWidth && screenHeight !== shotHeight) {
    _logger.default.info(`Scaling screenshot from ${shotWidth}x${shotHeight} to match ` + `screen at ${screenWidth}x${screenHeight}`);

    imgObj = imgObj.resize(screenWidth, screenHeight);
    scale.xScale *= 1.0 * screenWidth / shotWidth;
    scale.yScale *= 1.0 * screenHeight / shotHeight;
  }

  b64Screenshot = (await imgObj.getBuffer(_appiumSupport.imageUtil.MIME_PNG)).toString('base64');
  return {
    b64Screenshot,
    scale
  };
};

const DEFAULT_FIX_IMAGE_TEMPLATE_SCALE = 1;

helpers.fixImageTemplateScale = async function fixImageTemplateScale(b64Template, opts = {}) {
  if (!opts) {
    return b64Template;
  }

  let {
    fixImageTemplateScale = false,
    defaultImageTemplateScale = _imageElement.DEFAULT_TEMPLATE_IMAGE_SCALE,
    ignoreDefaultImageTemplateScale = false,
    xScale = DEFAULT_FIX_IMAGE_TEMPLATE_SCALE,
    yScale = DEFAULT_FIX_IMAGE_TEMPLATE_SCALE
  } = opts;

  if (ignoreDefaultImageTemplateScale) {
    defaultImageTemplateScale = _imageElement.DEFAULT_TEMPLATE_IMAGE_SCALE;
  }

  if (defaultImageTemplateScale === _imageElement.DEFAULT_TEMPLATE_IMAGE_SCALE && !fixImageTemplateScale) {
    return b64Template;
  }

  if (fixImageTemplateScale) {
    xScale *= defaultImageTemplateScale;
    yScale *= defaultImageTemplateScale;
  } else {
    xScale = yScale = 1 * defaultImageTemplateScale;
  }

  if (!parseFloat(xScale) || !parseFloat(yScale)) {
    return b64Template;
  }

  if (Math.round(xScale * FLOAT_PRECISION) === Math.round(DEFAULT_FIX_IMAGE_TEMPLATE_SCALE * FLOAT_PRECISION) && Math.round(yScale * FLOAT_PRECISION === Math.round(DEFAULT_FIX_IMAGE_TEMPLATE_SCALE * FLOAT_PRECISION))) {
    return b64Template;
  }

  let imgTempObj = await _appiumSupport.imageUtil.getJimpImage(b64Template);
  let {
    width: baseTempWidth,
    height: baseTempHeigh
  } = imgTempObj.bitmap;
  const scaledWidth = baseTempWidth * xScale;
  const scaledHeight = baseTempHeigh * yScale;

  _logger.default.info(`Scaling template image from ${baseTempWidth}x${baseTempHeigh}` + ` to ${scaledWidth}x${scaledHeight}`);

  _logger.default.info(`The ratio is ${xScale} and ${yScale}`);

  imgTempObj = await imgTempObj.resize(scaledWidth, scaledHeight);
  return (await imgTempObj.getBuffer(_appiumSupport.imageUtil.MIME_PNG)).toString('base64');
};

Object.assign(extensions, commands, helpers);
var _default = extensions;
exports.default = _default;require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9iYXNlZHJpdmVyL2NvbW1hbmRzL2ZpbmQuanMiXSwibmFtZXMiOlsiY29tbWFuZHMiLCJoZWxwZXJzIiwiZXh0ZW5zaW9ucyIsIklNQUdFX1NUUkFURUdZIiwiQ1VTVE9NX1NUUkFURUdZIiwiRkxPQVRfUFJFQ0lTSU9OIiwiZmluZEVsT3JFbHNXaXRoUHJvY2Vzc2luZyIsInN0cmF0ZWd5Iiwic2VsZWN0b3IiLCJtdWx0IiwiY29udGV4dCIsInZhbGlkYXRlTG9jYXRvclN0cmF0ZWd5IiwiZmluZEVsT3JFbHMiLCJlcnIiLCJvcHRzIiwicHJpbnRQYWdlU291cmNlT25GaW5kRmFpbHVyZSIsInNyYyIsImdldFBhZ2VTb3VyY2UiLCJsb2ciLCJkZWJ1ZyIsIm1lc3NhZ2UiLCJmaW5kRWxlbWVudCIsImZpbmRCeUltYWdlIiwibXVsdGlwbGUiLCJmaW5kQnlDdXN0b20iLCJmaW5kRWxlbWVudHMiLCJmaW5kRWxlbWVudEZyb21FbGVtZW50IiwiZWxlbWVudElkIiwiZmluZEVsZW1lbnRzRnJvbUVsZW1lbnQiLCJwbHVnaW5zIiwiY3VzdG9tRmluZE1vZHVsZXMiLCJFcnJvciIsIl8iLCJpc1BsYWluT2JqZWN0IiwicGx1Z2luIiwicmVhbFNlbGVjdG9yIiwic3BsaXQiLCJzaXplIiwia2V5cyIsImZpbmRlciIsInJlcXVpcmUiLCJpc0Z1bmN0aW9uIiwiZmluZCIsImN1c3RvbUZpbmRlckxvZyIsImxvZ2dlciIsImdldExvZ2dlciIsImVsZW1lbnRzIiwiY29uZGl0aW9uIiwiaXNFbXB0eSIsImltcGxpY2l0V2FpdEZvckNvbmRpdGlvbiIsIm1hdGNoIiwiZXJyb3JzIiwiTm9TdWNoRWxlbWVudEVycm9yIiwiYjY0VGVtcGxhdGUiLCJzaG91bGRDaGVja1N0YWxlbmVzcyIsImlnbm9yZURlZmF1bHRJbWFnZVRlbXBsYXRlU2NhbGUiLCJpbWFnZU1hdGNoVGhyZXNob2xkIiwidGhyZXNob2xkIiwiaW1hZ2VNYXRjaE1ldGhvZCIsImZpeEltYWdlVGVtcGxhdGVTaXplIiwiZml4SW1hZ2VUZW1wbGF0ZVNjYWxlIiwiZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZSIsImdldE1hdGNoZWRJbWFnZVJlc3VsdCIsInZpc3VhbGl6ZSIsInNldHRpbmdzIiwiZ2V0U2V0dGluZ3MiLCJpbmZvIiwiZ2V0V2luZG93U2l6ZSIsIndpZHRoIiwic2NyZWVuV2lkdGgiLCJoZWlnaHQiLCJzY3JlZW5IZWlnaHQiLCJlbnN1cmVUZW1wbGF0ZVNpemUiLCJyZXN1bHRzIiwiYjY0U2NyZWVuc2hvdCIsInNjYWxlIiwiZ2V0U2NyZWVuc2hvdEZvckltYWdlRmluZCIsImNvbXBhcmlzb25PcHRzIiwibWV0aG9kIiwicHVzaCIsImNvbXBhcmVJbWFnZXMiLCJNQVRDSF9URU1QTEFURV9NT0RFIiwibWFwIiwicmVjdCIsInNjb3JlIiwidmlzdWFsaXphdGlvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJJbWFnZUVsZW1lbnQiLCJyZWdpc3RlcmVkRWxlbWVudHMiLCJpbWdFbCIsInJlZ2lzdGVySW1hZ2VFbGVtZW50IiwiaW1nT2JqIiwiaW1hZ2VVdGlsIiwiZ2V0SmltcEltYWdlIiwidHBsV2lkdGgiLCJ0cGxIZWlnaHQiLCJiaXRtYXAiLCJzY2FsZVRvRml0IiwiZ2V0QnVmZmVyIiwiTUlNRV9QTkciLCJ0b1N0cmluZyIsImdldFNjcmVlbnNob3QiLCJmaXhJbWFnZUZpbmRTY3JlZW5zaG90RGltcyIsIndhcm4iLCJzaG90V2lkdGgiLCJzaG90SGVpZ2h0IiwieFNjYWxlIiwieVNjYWxlIiwic2NyZWVuQVIiLCJzaG90QVIiLCJNYXRoIiwicm91bmQiLCJzY2FsZUZhY3RvciIsInJlc2l6ZSIsIkRFRkFVTFRfRklYX0lNQUdFX1RFTVBMQVRFX1NDQUxFIiwiREVGQVVMVF9URU1QTEFURV9JTUFHRV9TQ0FMRSIsInBhcnNlRmxvYXQiLCJpbWdUZW1wT2JqIiwiYmFzZVRlbXBXaWR0aCIsImJhc2VUZW1wSGVpZ2giLCJzY2FsZWRXaWR0aCIsInNjYWxlZEhlaWdodCIsIk9iamVjdCIs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TUMsV0FBWSxJQUFHQyxZQUFhLEVBRDdDOztBQUVBeEcsa0JBQUlnRCxJQUFKLENBQVUsZ0JBQWV5QyxNQUFPLFFBQU9DLE1BQU8sRUFBOUM7O0FBQ0FVLEVBQUFBLFVBQVUsR0FBRyxNQUFNQSxVQUFVLENBQUNKLE1BQVgsQ0FBa0JPLFdBQWxCLEVBQStCQyxZQUEvQixDQUFuQjtBQUNBLFNBQU8sQ0FBQyxNQUFNSixVQUFVLENBQUNuQixTQUFYLENBQXFCTix5QkFBVU8sUUFBL0IsQ0FBUCxFQUFpREMsUUFBakQsQ0FBMEQsUUFBMUQsQ0FBUDtBQUNELENBbkREOztBQXFEQXNCLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjMUgsVUFBZCxFQUEwQkYsUUFBMUIsRUFBb0NDLE9BQXBDO2VBRWVDLFUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbG9nIGZyb20gJy4uL2xvZ2dlcic7XG5pbXBvcnQgeyBsb2dnZXIsIGltYWdlVXRpbCB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBlcnJvcnMgfSBmcm9tICcuLi8uLi8uLic7XG5pbXBvcnQgeyBNQVRDSF9URU1QTEFURV9NT0RFIH0gZnJvbSAnLi9pbWFnZXMnO1xuaW1wb3J0IHsgSW1hZ2VFbGVtZW50LCBERUZBVUxUX1RFTVBMQVRFX0lNQUdFX1NDQUxFIH0gZnJvbSAnLi4vaW1hZ2UtZWxlbWVudCc7XG5cblxuY29uc3QgY29tbWFuZHMgPSB7fSwgaGVscGVycyA9IHt9LCBleHRlbnNpb25zID0ge307XG5cbmNvbnN0IElNQUdFX1NUUkFURUdZID0gJy1pbWFnZSc7XG5jb25zdCBDVVNUT01fU1RSQVRFR1kgPSAnLWN1c3RvbSc7XG5cbi8vIFVzZWQgdG8gY29tcGFyZSByYXRpbyBhbmQgc2NyZWVuIHdpZHRoXG4vLyBQaXhlbCBpcyBiYXNpY2FsbHkgdW5kZXIgMTA4MCBmb3IgZXhhbXBsZS4gMTAwSyBpcyBwcm9iYWJseSBlbm91Z2ggZm8gYSB3aGlsZS5cbmNvbnN0IEZMT0FUX1BSRUNJU0lPTiA9IDEwMDAwMDtcblxuLy8gT3ZlcnJpZGUgdGhlIGZvbGxvd2luZyBmdW5jdGlvbiBmb3IgeW91ciBvd24gZHJpdmVyLCBhbmQgdGhlIHJlc3QgaXMgdGFrZW5cbi8vIGNhcmUgb2YhXG5cbi8vIGhlbHBlcnMuZmluZEVsT3JFbHMgPSBhc3luYyBmdW5jdGlvbiAoc3RyYXRlZ3ksIHNlbGVjdG9yLCBtdWx0LCBjb250ZXh0KSB7fVxuLy8gICBzdHJhdGVneTogbG9jYXRvciBzdHJhdGVneVxuLy8gICBzZWxlY3RvcjogdGhlIGFjdHVhbCBzZWxlY3RvciBmb3IgZmluZGluZyBhbiBlbGVtZW50XG4vLyAgIG11bHQ6IG11bHRpcGxlIGVsZW1lbnRzIG9yIGp1c3Qgb25lP1xuLy8gICBjb250ZXh0OiBmaW5kaW5nIGFuIGVsZW1lbnQgZnJvbSB0aGUgcm9vdCBjb250ZXh0PyBvciBzdGFydGluZyBmcm9tIGFub3RoZXIgZWxlbWVudFxuLy9cbi8vIFJldHVybnMgYW4gb2JqZWN0IHdoaWNoIGFkaGVyZXMgdG8gdGhlIHdheSB0aGUgSlNPTiBXaXJlIFByb3RvY29sIHJlcHJlc2VudHMgZWxlbWVudHM6XG4vLyB7IEVMRU1FTlQ6ICMgfSAgICBlZzogeyBFTEVNRU5UOiAzIH0gIG9yIHsgRUxFTUVOVDogMS4wMjMgfVxuXG5oZWxwZXJzLmZpbmRFbE9yRWxzV2l0aFByb2Nlc3NpbmcgPSBhc3luYyBmdW5jdGlvbiBmaW5kRWxPckVsc1dpdGhQcm9jZXNzaW5nIChzdHJhdGVneSwgc2VsZWN0b3IsIG11bHQsIGNvbnRleHQpIHtcbiAgdGhpcy52YWxpZGF0ZUxvY2F0b3JTdHJhdGVneShzdHJhdGVneSk7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZmluZEVsT3JFbHMoc3RyYXRlZ3ksIHNlbGVjdG9yLCBtdWx0LCBjb250ZXh0KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKHRoaXMub3B0cy5wcmludFBhZ2VTb3VyY2VPbkZpbmRGYWlsdXJlKSB7XG4gICAgICBjb25zdCBzcmMgPSBhd2FpdCB0aGlzLmdldFBhZ2VTb3VyY2UoKTtcbiAgICAgIGxvZy5kZWJ1ZyhgRXJyb3IgZmluZGluZyBlbGVtZW50JHttdWx0ID8gJ3MnIDogJyd9OiAke2Vyci5tZXNzYWdlfWApO1xuICAgICAgbG9nLmRlYnVnKGBQYWdlIHNvdXJjZSByZXF1ZXN0ZWQgdGhyb3VnaCAncHJpbnRQYWdlU291cmNlT25GaW5kRmFpbHVyZSc6YCk7XG4gICAgICBsb2cuZGVidWcoc3JjKTtcbiAgICB9XG4gICAgLy8gc3RpbGwgd2FudCB0aGUgZXJyb3IgdG8gb2NjdXJcbiAgICB0aHJvdyBlcnI7XG4gIH1cbn07XG5cbmNvbW1hbmRzLmZpbmRFbGVtZW50ID0gYXN5bmMgZnVuY3Rpb24gZmluZEVsZW1lbnQgKHN0cmF0ZWd5LCBzZWxlY3Rvcikge1xuICBpZiAoc3RyYXRlZ3kgPT09IElNQUdFX1NUUkFURUdZKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZmluZEJ5SW1hZ2Uoc2VsZWN0b3IsIHttdWx0aXBsZTogZmFsc2V9KTtcbiAgfSBlbHNlIGlmIChzdHJhdGVneSA9PT0gQ1VTVE9NX1NUUkFURUdZKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZmluZEJ5Q3VzdG9tKHNlbGVjdG9yLCBmYWxzZSk7XG4gIH1cblxuICByZXR1cm4gYXdhaXQgdGhpcy5maW5kRWxPckVsc1dpdGhQcm9jZXNzaW5nKHN0cmF0ZWd5LCBzZWxlY3RvciwgZmFsc2UpO1xufTtcblxuY29tbWFuZHMuZmluZEVsZW1lbnRzID0gYXN5bmMgZnVuY3Rpb24gZmluZEVsZW1lbnRzIChzdHJhdGVneSwgc2VsZWN0b3IpIHtcbiAgaWYgKHN0cmF0ZWd5ID09PSBJTUFHRV9TVFJBVEVHWSkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmZpbmRCeUltYWdlKHNlbGVjdG9yLCB7bXVsdGlwbGU6IHRydWV9KTtcbiAgfSBlbHNlIGlmIChzdHJhdGVneSA9PT0gQ1VTVE9NX1NUUkFURUdZKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZmluZEJ5Q3VzdG9tKHNlbGVjdG9yLCB0cnVlKTtcbiAgfVxuXG4gIHJldHVybiBhd2FpdCB0aGlzLmZpbmRFbE9yRWxzV2l0aFByb2Nlc3Npbmcoc3RyYXRlZ3ksIHNlbGVjdG9yLCB0cnVlKTtcbn07XG5cbmNvbW1hbmRzLmZpbmRFbGVtZW50RnJvbUVsZW1lbnQgPSBhc3luYyBmdW5jdGlvbiBmaW5kRWxlbWVudEZyb21FbGVtZW50IChzdHJhdGVneSwgc2VsZWN0b3IsIGVsZW1lbnRJZCkge1xuICByZXR1cm4gYXdhaXQgdGhpcy5maW5kRWxPckVsc1dpdGhQcm9jZXNzaW5nKHN0cmF0ZWd5LCBzZWxlY3RvciwgZmFsc2UsIGVsZW1lbnRJZCk7XG59O1xuXG5jb21tYW5kcy5maW5kRWxlbWVudHNGcm9tRWxlbWVudCA9IGFzeW5jIGZ1bmN0aW9uIGZpbmRFbGVtZW50c0Zyb21FbGVtZW50IChzdHJhdGVneSwgc2VsZWN0b3IsIGVsZW1lbnRJZCkge1xuICByZXR1cm4gYXdhaXQgdGhpcy5maW5kRWxPckVsc1dpdGhQcm9jZXNzaW5nKHN0cmF0ZWd5LCBzZWxlY3RvciwgdHJ1ZSwgZWxlbWVudElkKTtcbn07XG5cbi8qKlxuICogRmluZCBhbiBlbGVtZW50IHVzaW5nIGEgY3VzdG9tIHBsdWdpbiBzcGVjaWZpZWQgYnkgdGhlIGN1c3RvbUZpbmRNb2R1bGVzIGNhcC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSB0aGUgc2VsZWN0b3Igd2hpY2ggdGhlIHBsdWdpbiB3aWxsIHVzZSB0byBmaW5kXG4gKiBlbGVtZW50c1xuICogQHBhcmFtIHtib29sZWFufSBtdWx0aXBsZSAtIHdoZXRoZXIgd2Ugd2FudCBvbmUgZWxlbWVudCBvciBtdWx0aXBsZVxuICpcbiAqIEByZXR1cm5zIHtXZWJFbGVtZW50fSAtIFdlYkRyaXZlciBlbGVtZW50IG9yIGxpc3Qgb2YgZWxlbWVudHNcbiAqL1xuY29tbWFuZHMuZmluZEJ5Q3VzdG9tID0gYXN5bmMgZnVuY3Rpb24gZmluZEJ5Q3VzdG9tIChzZWxlY3RvciwgbXVsdGlwbGUpIHtcbiAgY29uc3QgcGx1Z2lucyA9IHRoaXMub3B0cy5jdXN0b21GaW5kTW9kdWxlcztcblxuICAvLyBmaXJzdCBlbnN1cmUgdGhlIHVzZXIgaGFzIHJlZ2lzdGVyZWQgb25lIG9yIG1vcmUgZmluZCBwbHVnaW5zXG4gIGlmICghcGx1Z2lucykge1xuICAgIC8vIFRPRE8gdGhpcyBpbmZvIHNob3VsZCBnbyBpbiBkb2NzIGluc3RlYWQ7IHVwZGF0ZSB3aGVuIGRvY3MgZm9yIHRoaXNcbiAgICAvLyBmZWF0dXJlIGV4aXN0XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaW5kaW5nIGFuIGVsZW1lbnQgdXNpbmcgYSBwbHVnaW4gaXMgY3VycmVudGx5IGFuICcgK1xuICAgICAgJ2luY3ViYXRpbmcgZmVhdHVyZS4gVG8gdXNlIGl0IHlvdSBtdXN0IG1hbnVhbGx5IGluc3RhbGwgb25lIG9yIG1vcmUgJyArXG4gICAgICAncGx1Z2luIG1vZHVsZXMgaW4gYSB3YXkgdGhhdCB0aGV5IGNhbiBiZSByZXF1aXJlZCBieSBBcHBpdW0sIGZvciAnICtcbiAgICAgICdleGFtcGxlIGluc3RhbGxpbmcgdGhlbSBmcm9tIHRoZSBBcHBpdW0gZGlyZWN0b3J5LCBpbnN0YWxsaW5nIHRoZW0gJyArXG4gICAgICAnZ2xvYmFsbHksIG9yIGluc3RhbGxpbmcgdGhlbSBlbHNld2hlcmUgYW5kIHBhc3NpbmcgYW4gYWJzb2x1dGUgcGF0aCBhcyAnICtcbiAgICAgICd0aGUgY2FwYWJpbGl0eS4gVGhlbiBjb25zdHJ1Y3QgYW4gb2JqZWN0IHdoZXJlIHRoZSBrZXkgaXMgdGhlIHNob3J0Y3V0ICcgK1xuICAgICAgJ25hbWUgZm9yIHRoaXMgcGx1Z2luIGFuZCB0aGUgdmFsdWUgaXMgdGhlIG1vZHVsZSBuYW1lIG9yIGFic29sdXRlIHBhdGgsICcgK1xuICAgICAgJ2ZvciBleGFtcGxlOiB7XCJwMVwiOiBcIm15LWZpbmQtcGx1Z2luXCJ9LCBhbmQgcGFzcyB0aGlzIGluIGFzIHRoZSAnICtcbiAgICAgIFwiJ2N1c3RvbUZpbmRNb2R1bGVzJyBjYXBhYmlsaXR5LlwiKTtcbiAgfVxuXG4gIC8vIHRoZW4gZG8gc29tZSBiYXNpYyBjaGVja2luZyBvZiB0aGUgdHlwZSBvZiB0aGUgY2FwYWJpbGl0eVxuICBpZiAoIV8uaXNQbGFpbk9iamVjdChwbHVnaW5zKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZm9ybWF0IGZvciB0aGUgJ2N1c3RvbUZpbmRNb2R1bGVzJyBjYXBhYmlsaXR5LiBcIiArXG4gICAgICAnSXQgc2hvdWxkIGJlIGFuIG9iamVjdCB3aXRoIGtleXMgY29ycmVzcG9uZGluZyB0byB0aGUgc2hvcnQgbmFtZXMgYW5kICcgK1xuICAgICAgJ3ZhbHVlcyBjb3JyZXNwb25kaW5nIHRvIHRoZSBmdWxsIG5hbWVzIG9mIHRoZSBlbGVtZW50IGZpbmRpbmcgcGx1Z2lucycpO1xuICB9XG5cbiAgLy8gZ2V0IHRoZSBuYW1lIG9mIHRoZSBwYXJ0aWN1bGFyIHBsdWdpbiB1c2VkIGZvciB0aGlzIGludm9jYXRpb24gb2YgZmluZCxcbiAgLy8gYW5kIHNlcGFyYXRlIGl0IGZyb20gdGhlIHNlbGVjdG9yIHdlIHdpbGwgcGFzcyB0byB0aGUgcGx1Z2luXG4gIGxldCBbcGx1Z2luLCByZWFsU2VsZWN0b3JdID0gc2VsZWN0b3Iuc3BsaXQoJzonKTtcblxuICAvLyBpZiB0aGUgdXNlciBkaWRuJ3Qgc3BlY2lmeSBhIHBsdWdpbiBmb3IgdGhpcyBmaW5kIGludm9jYXRpb24sIGFuZCB3ZSBoYWRcbiAgLy8gbXVsdGlwbGUgcGx1Z2lucyByZWdpc3RlcmVkLCB0aGF0J3MgYSBwcm9ibGVtXG4gIGlmIChfLnNpemUocGx1Z2lucykgPiAxICYmICFyZWFsU2VsZWN0b3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIGVsZW1lbnQgZmluZGluZyBwbHVnaW5zIHdlcmUgcmVnaXN0ZXJlZCBgICtcbiAgICAgIGAoJHtfLmtleXMocGx1Z2lucyl9KSwgYnV0IHlvdXIgc2VsZWN0b3IgZGlkIG5vdCBpbmRpY2F0ZSB3aGljaCBwbHVnaW4gYCArXG4gICAgICBgdG8gdXNlLiBFbnN1cmUgeW91IHB1dCB0aGUgc2hvcnQgbmFtZSBvZiB0aGUgcGx1Z2luIGZvbGxvd2VkIGJ5ICc6JyBhcyBgICtcbiAgICAgIGB0aGUgaW5pdGlhbCBwYXJ0IG9mIHRoZSBzZWxlY3RvciBzdHJpbmcuYCk7XG4gIH1cblxuICAvLyBidXQgaWYgdGhleSBkaWQgbm90IHNwZWNpZnkgYSBwbHVnaW4gYW5kIHdlIG9ubHkgaGF2ZSBvbmUgcGx1Z2luLCBqdXN0IHVzZVxuICAvLyB0aGF0IG9uZVxuICBpZiAoXy5zaXplKHBsdWdpbnMpID09PSAxICYmICFyZWFsU2VsZWN0b3IpIHtcbiAgICByZWFsU2VsZWN0b3IgPSBwbHVnaW47XG4gICAgcGx1Z2luID0gXy5rZXlzKHBsdWdpbnMpWzBdO1xuICB9XG5cbiAgaWYgKCFwbHVnaW5zW3BsdWdpbl0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNlbGVjdG9yIHNwZWNpZmllZCB1c2Ugb2YgZWxlbWVudCBmaW5kaW5nIHBsdWdpbiBgICtcbiAgICAgIGAnJHtwbHVnaW59JyBidXQgaXQgd2FzIG5vdCByZWdpc3RlcmVkIGluIHRoZSAnY3VzdG9tRmluZE1vZHVsZXMnIGAgK1xuICAgICAgYGNhcGFiaWxpdHkuYCk7XG4gIH1cblxuICBsZXQgZmluZGVyO1xuICB0cnkge1xuICAgIGxvZy5kZWJ1ZyhgRmluZCBwbHVnaW4gJyR7cGx1Z2lufScgcmVxdWVzdGVkOyB3aWxsIGF0dGVtcHQgdG8gdXNlIGl0IGAgK1xuICAgICAgYGZyb20gJyR7cGx1Z2luc1twbHVnaW5dfSdgKTtcbiAgICBmaW5kZXIgPSByZXF1aXJlKHBsdWdpbnNbcGx1Z2luXSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGxvYWQgeW91ciBjdXN0b20gZmluZCBtb2R1bGUgJyR7cGx1Z2lufScuIERpZCBgICtcbiAgICAgIGB5b3UgcHV0IGl0IHNvbWV3aGVyZSBBcHBpdW0gY2FuICdyZXF1aXJlJyBpdD8gT3JpZ2luYWwgZXJyb3I6ICR7ZXJyfWApO1xuICB9XG5cbiAgaWYgKCFmaW5kZXIgfHwgIV8uaXNGdW5jdGlvbihmaW5kZXIuZmluZCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgY3VzdG9tIGZpbmQgbW9kdWxlIGRpZCBub3QgYXBwZWFyIHRvIGJlIGNvbnN0cnVjdGVkICcgK1xuICAgICAgICAnY29ycmVjdGx5LiBJdCBuZWVkcyB0byBleHBvcnQgYW4gb2JqZWN0IHdpdGggYSBgZmluZGAgbWV0aG9kLicpO1xuICB9XG5cbiAgY29uc3QgY3VzdG9tRmluZGVyTG9nID0gbG9nZ2VyLmdldExvZ2dlcihwbHVnaW4pO1xuXG4gIGxldCBlbGVtZW50cztcbiAgY29uc3QgY29uZGl0aW9uID0gYXN5bmMgKCkgPT4ge1xuICAgIC8vIGdldCBhIGxpc3Qgb2YgbWF0Y2hlZCBlbGVtZW50cyBmcm9tIHRoZSBjdXN0b20gZmluZGVyLCB3aGljaCBjYW5cbiAgICAvLyBwb3RlbnRpYWxseSB1c2UgdGhlIGVudGlyZSBzdWl0ZSBvZiBtZXRob2RzIHRoZSBjdXJyZW50IGRyaXZlciBwcm92aWRlcy5cbiAgICAvLyB0aGUgZmluZGVyIHNob3VsZCBhbHdheXMgcmV0dXJuIGEgbGlzdCBvZiBlbGVtZW50cywgYnV0IG1heSB1c2UgdGhlXG4gICAgLy8ga25vd2xlZGdlIG9mIHdoZXRoZXIgd2UgYXJlIGxvb2tpbmcgZm9yIG9uZSBvciBtYW55IHRvIHBlcmZvcm0gaW50ZXJuYWxcbiAgICAvLyBvcHRpbWl6YXRpb25zXG4gICAgZWxlbWVudHMgPSBhd2FpdCBmaW5kZXIuZmluZCh0aGlzLCBjdXN0b21GaW5kZXJMb2csIHJlYWxTZWxlY3RvciwgbXVsdGlwbGUpO1xuXG4gICAgLy8gaWYgd2UncmUgbG9va2luZyBmb3IgbXVsdGlwbGUgZWxlbWVudHMsIG9yIGlmIHdlJ3JlIGxvb2tpbmcgZm9yIG9ubHlcbiAgICAvLyBvbmUgYW5kIGZvdW5kIGl0LCB3ZSdyZSBkb25lXG4gICAgaWYgKCFfLmlzRW1wdHkoZWxlbWVudHMpIHx8IG11bHRpcGxlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBvdGhlcndpc2Ugd2Ugc2hvdWxkIHJldHJ5LCBzbyByZXR1cm4gZmFsc2UgdG8gdHJpZ2dlciB0aGUgcmV0cnkgbG9vcFxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICB0cnkge1xuICAgIC8vIG1ha2Ugc3VyZSB3ZSByZXNwZWN0IGltcGxpY2l0IHdhaXRcbiAgICBhd2FpdCB0aGlzLmltcGxpY2l0V2FpdEZvckNvbmRpdGlvbihjb25kaXRpb24pO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoZXJyLm1lc3NhZ2UubWF0Y2goL0NvbmRpdGlvbiB1bm1ldC8pKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLk5vU3VjaEVsZW1lbnRFcnJvcigpO1xuICAgIH1cbiAgICB0aHJvdyBlcnI7XG4gIH1cblxuICByZXR1cm4gbXVsdGlwbGUgPyBlbGVtZW50cyA6IGVsZW1lbnRzWzBdO1xufTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBGaW5kQnlJbWFnZU9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW3Nob3VsZENoZWNrU3RhbGVuZXNzPWZhbHNlXSAtIHdoZXRoZXIgdGhpcyBjYWxsIHRvIGZpbmQgYW5cbiAqIGltYWdlIGlzIG1lcmVseSB0byBjaGVjayBzdGFsZW5lc3MuIElmIHNvIHdlIGNhbiBieXBhc3MgYSBsb3Qgb2YgbG9naWNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW211bHRpcGxlPWZhbHNlXSAtIFdoZXRoZXIgd2UgYXJlIGZpbmRpbmcgb25lIGVsZW1lbnQgb3JcbiAqIG11bHRpcGxlXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtpZ25vcmVEZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlPWZhbHNlXSAtIFdoZXRoZXIgd2VcbiAqIGlnbm9yZSBkZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlLiBJdCBjYW4gYmUgdXNlZCB3aGVuIHlvdSB3b3VsZCBsaWtlIHRvXG4gKiBzY2FsZSBiNjRUZW1wbGF0ZSB3aXRoIGRlZmF1bHRJbWFnZVRlbXBsYXRlU2NhbGUgc2V0dGluZy5cbiAqL1xuXG4vKipcbiAqIEZpbmQgYSBzY3JlZW4gcmVjdCByZXByZXNlbnRlZCBieSBhbiBJbWFnZUVsZW1lbnQgY29ycmVzcG9uZGluZyB0byBhbiBpbWFnZVxuICogdGVtcGxhdGUgc2VudCBpbiBieSB0aGUgY2xpZW50XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGI2NFRlbXBsYXRlIC0gYmFzZTY0LWVuY29kZWQgaW1hZ2UgdXNlZCBhcyBhIHRlbXBsYXRlIHRvIGJlXG4gKiBtYXRjaGVkIGluIHRoZSBzY3JlZW5zaG90XG4gKiBAcGFyYW0ge0ZpbmRCeUltYWdlT3B0aW9uc30gLSBhZGRpdGlvbmFsIG9wdGlvbnNcbiAqXG4gKiBAcmV0dXJucyB7V2ViRWxlbWVudH0gLSBXZWJEcml2ZXIgZWxlbWVudCB3aXRoIGEgc3BlY2lhbCBpZCBwcmVmaXhcbiAqL1xuaGVscGVycy5maW5kQnlJbWFnZSA9IGFzeW5jIGZ1bmN0aW9uIGZpbmRCeUltYWdlIChiNjRUZW1wbGF0ZSwge1xuICBzaG91bGRDaGVja1N0YWxlbmVzcyA9IGZhbHNlLFxuICBtdWx0aXBsZSA9IGZhbHNlLFxuICBpZ25vcmVEZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlID0gZmFsc2UsXG59KSB7XG4gIGNvbnN0IHtcbiAgICBpbWFnZU1hdGNoVGhyZXNob2xkOiB0aHJlc2hvbGQsXG4gICAgaW1hZ2VNYXRjaE1ldGhvZCxcbiAgICBmaXhJbWFnZVRlbXBsYXRlU2l6ZSxcbiAgICBmaXhJbWFnZVRlbXBsYXRlU2NhbGUsXG4gICAgZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZSxcbiAgICBnZXRNYXRjaGVkSW1hZ2VSZXN1bHQ6IHZpc3VhbGl6ZVxuICB9ID0gdGhpcy5zZXR0aW5ncy5nZXRTZXR0aW5ncygpO1xuXG4gIGxvZy5pbmZvKGBGaW5kaW5nIGltYWdlIGVsZW1lbnQgd2l0aCBtYXRjaCB0aHJlc2hvbGQgJHt0aHJlc2hvbGR9YCk7XG4gIGlmICghdGhpcy5nZXRXaW5kb3dTaXplKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBkcml2ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgcmVxdWlyZWQgJ2dldFdpbmRvd1NpemUnIGNvbW1hbmRcIik7XG4gIH1cbiAgY29uc3Qge3dpZHRoOiBzY3JlZW5XaWR0aCwgaGVpZ2h0OiBzY3JlZW5IZWlnaHR9ID0gYXdhaXQgdGhpcy5nZXRXaW5kb3dTaXplKCk7XG5cbiAgLy8gc29tZW9uZSBtaWdodCBoYXZlIHNlbnQgaW4gYSB0ZW1wbGF0ZSB0aGF0J3MgbGFyZ2VyIHRoYW4gdGhlIHNjcmVlblxuICAvLyBkaW1lbnNpb25zLiBJZiBzbyBsZXQncyBjaGVjayBhbmQgY3V0IGl0IGRvd24gdG8gc2l6ZSBzaW5jZSB0aGUgYWxnb3JpdGhtXG4gIC8vIHdpbGwgbm90IHdvcmsgdW5sZXNzIHdlIGRvLiBCdXQgYmVjYXVzZSBpdCByZXF1aXJlcyBzb21lIHBvdGVudGlhbGx5XG4gIC8vIGV4cGVuc2l2ZSBjb21tYW5kcywgb25seSBkbyB0aGlzIGlmIHRoZSB1c2VyIGhhcyByZXF1ZXN0ZWQgaXQgaW4gc2V0dGluZ3MuXG4gIGlmIChmaXhJbWFnZVRlbXBsYXRlU2l6ZSkge1xuICAgIGI2NFRlbXBsYXRlID0gYXdhaXQgdGhpcy5lbnN1cmVUZW1wbGF0ZVNpemUoYjY0VGVtcGxhdGUsIHNjcmVlbldpZHRoLFxuICAgICAgc2NyZWVuSGVpZ2h0KTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgY29uc3QgY29uZGl0aW9uID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7YjY0U2NyZWVuc2hvdCwgc2NhbGV9ID0gYXdhaXQgdGhpcy5nZXRTY3JlZW5zaG90Rm9ySW1hZ2VGaW5kKHNjcmVlbldpZHRoLCBzY3JlZW5IZWlnaHQpO1xuXG4gICAgICBiNjRUZW1wbGF0ZSA9IGF3YWl0IHRoaXMuZml4SW1hZ2VUZW1wbGF0ZVNjYWxlKGI2NFRlbXBsYXRlLCB7XG4gICAgICAgIGRlZmF1bHRJbWFnZVRlbXBsYXRlU2NhbGUsIGlnbm9yZURlZmF1bHRJbWFnZVRlbXBsYXRlU2NhbGUsXG4gICAgICAgIGZpeEltYWdlVGVtcGxhdGVTY2FsZSwgLi4uc2NhbGVcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb21wYXJpc29uT3B0cyA9IHtcbiAgICAgICAgdGhyZXNob2xkLFxuICAgICAgICB2aXN1YWxpemUsXG4gICAgICAgIG11bHRpcGxlLFxuICAgICAgfTtcbiAgICAgIGlmIChpbWFnZU1hdGNoTWV0aG9kKSB7XG4gICAgICAgIGNvbXBhcmlzb25PcHRzLm1ldGhvZCA9IGltYWdlTWF0Y2hNZXRob2Q7XG4gICAgICB9XG4gICAgICBpZiAobXVsdGlwbGUpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKC4uLihhd2FpdCB0aGlzLmNvbXBhcmVJbWFnZXMoTUFUQ0hfVEVNUExBVEVfTU9ERSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYjY0U2NyZWVuc2hvdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYjY0VGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhcmlzb25PcHRzKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGF3YWl0IHRoaXMuY29tcGFyZUltYWdlcyhNQVRDSF9URU1QTEFURV9NT0RFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGI2NFNjcmVlbnNob3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYjY0VGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFyaXNvbk9wdHMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBpZiBjb21wYXJlSW1hZ2VzIGZhaWxzLCB3ZSdsbCBnZXQgYSBzcGVjaWZpYyBlcnJvciwgYnV0IHdlIHNob3VsZFxuICAgICAgLy8gcmV0cnksIHNvIHRyYXAgdGhhdCBhbmQganVzdCByZXR1cm4gZmFsc2UgdG8gdHJpZ2dlciB0aGUgbmV4dCByb3VuZCBvZlxuICAgICAgLy8gaW1wbGljaXRseSB3YWl0aW5nLiBGb3Igb3RoZXIgZXJyb3JzLCB0aHJvdyB0aGVtIHRvIGdldCBvdXQgb2YgdGhlXG4gICAgICAvLyBpbXBsaWNpdCB3YWl0IGxvb3BcbiAgICAgIGlmIChlcnIubWVzc2FnZS5tYXRjaCgvQ2Fubm90IGZpbmQgYW55IG9jY3VycmVuY2VzLykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfTtcblxuICB0cnkge1xuICAgIGF3YWl0IHRoaXMuaW1wbGljaXRXYWl0Rm9yQ29uZGl0aW9uKGNvbmRpdGlvbik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIHRoaXMgYGltcGxpY2l0V2FpdEZvckNvbmRpdGlvbmAgbWV0aG9kIHdpbGwgdGhyb3cgYSAnQ29uZGl0aW9uIHVubWV0J1xuICAgIC8vIGVycm9yIGlmIGFuIGVsZW1lbnQgaXMgbm90IGZvdW5kIGV2ZW50dWFsbHkuIEluIHRoYXQgY2FzZSwgd2Ugd2lsbFxuICAgIC8vIGhhbmRsZSB0aGUgZWxlbWVudCBub3QgZm91bmQgcmVzcG9uc2UgYmVsb3cuIEluIHRoZSBjYXNlIHdoZXJlIGdldCBzb21lXG4gICAgLy8gX290aGVyXyBraW5kIG9mIGVycm9yLCBpdCBtZWFucyBzb21ldGhpbmcgYmxldyB1cCB0b3RhbGx5IGFwYXJ0IGZyb20gdGhlXG4gICAgLy8gaW1wbGljaXQgd2FpdCB0aW1lb3V0LiBXZSBzaG91bGQgbm90IG1hc2sgdGhhdCBlcnJvciBhbmQgaW5zdGVhZCB0aHJvd1xuICAgIC8vIGl0IHN0cmFpZ2h0YXdheVxuICAgIGlmICghZXJyLm1lc3NhZ2UubWF0Y2goL0NvbmRpdGlvbiB1bm1ldC8pKSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG5cbiAgaWYgKF8uaXNFbXB0eShyZXN1bHRzKSkge1xuICAgIGlmIChtdWx0aXBsZSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgZXJyb3JzLk5vU3VjaEVsZW1lbnRFcnJvcigpO1xuICB9XG5cbiAgY29uc3QgZWxlbWVudHMgPSByZXN1bHRzLm1hcCgoe3JlY3QsIHNjb3JlLCB2aXN1YWxpemF0aW9ufSkgPT4ge1xuICAgIGxvZy5pbmZvKGBJbWFnZSB0ZW1wbGF0ZSBtYXRjaGVkOiAke0pTT04uc3RyaW5naWZ5KHJlY3QpfWApO1xuICAgIHJldHVybiBuZXcgSW1hZ2VFbGVtZW50KGI2NFRlbXBsYXRlLCByZWN0LCBzY29yZSwgdmlzdWFsaXphdGlvbik7XG4gIH0pO1xuXG4gIC8vIGlmIHdlJ3JlIGp1c3QgY2hlY2tpbmcgc3RhbGVuZXNzLCByZXR1cm4gc3RyYWlnaHRhd2F5IHNvIHdlIGRvbid0IGFkZFxuICAvLyBhIG5ldyBlbGVtZW50IHRvIHRoZSBjYWNoZS4gc2hvdWxkQ2hlY2tTdGFsZW5lc3MgZG9lcyBub3Qgc3VwcG9ydCBtdWx0aXBsZVxuICAvLyBlbGVtZW50cywgc2luY2UgaXQgaXMgYSBwdXJlbHkgaW50ZXJuYWwgbWVjaGFuaXNtXG4gIGlmIChzaG91bGRDaGVja1N0YWxlbmVzcykge1xuICAgIHJldHVybiBlbGVtZW50c1swXTtcbiAgfVxuXG4gIGNvbnN0IHJlZ2lzdGVyZWRFbGVtZW50cyA9IGVsZW1lbnRzLm1hcCgoaW1nRWwpID0+IHRoaXMucmVnaXN0ZXJJbWFnZUVsZW1lbnQoaW1nRWwpKTtcblxuICByZXR1cm4gbXVsdGlwbGUgPyByZWdpc3RlcmVkRWxlbWVudHMgOiByZWdpc3RlcmVkRWxlbWVudHNbMF07XG59O1xuXG4vKipcbiAqIEVuc3VyZSB0aGF0IHRoZSBpbWFnZSB0ZW1wbGF0ZSBzZW50IGluIGZvciBhIGZpbmQgaXMgb2YgYSBzdWl0YWJsZSBzaXplXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGI2NFRlbXBsYXRlIC0gYmFzZTY0LWVuY29kZWQgaW1hZ2VcbiAqIEBwYXJhbSB7aW50fSBzY3JlZW5XaWR0aCAtIHdpZHRoIG9mIHNjcmVlblxuICogQHBhcmFtIHtpbnR9IHNjcmVlbkhlaWdodCAtIGhlaWdodCBvZiBzY3JlZW5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBiYXNlNjQtZW5jb2RlZCBpbWFnZSwgcG90ZW50aWFsbHkgcmVzaXplZFxuICovXG5oZWxwZXJzLmVuc3VyZVRlbXBsYXRlU2l6ZSA9IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZVRlbXBsYXRlU2l6ZSAoYjY0VGVtcGxhdGUsIHNjcmVlbldpZHRoLCBzY3JlZW5IZWlnaHQpIHtcbiAgbGV0IGltZ09iaiA9IGF3YWl0IGltYWdlVXRpbC5nZXRKaW1wSW1hZ2UoYjY0VGVtcGxhdGUpO1xuICBsZXQge3dpZHRoOiB0cGxXaWR0aCwgaGVpZ2h0OiB0cGxIZWlnaHR9ID0gaW1nT2JqLmJpdG1hcDtcblxuICBsb2cuaW5mbyhgVGVtcGxhdGUgaW1hZ2UgaXMgJHt0cGxXaWR0aH14JHt0cGxIZWlnaHR9LiBTY3JlZW4gc2l6ZSBpcyAke3NjcmVlbldpZHRofXgke3NjcmVlbkhlaWdodH1gKTtcbiAgLy8gaWYgdGhlIHRlbXBsYXRlIGZpdHMgaW5zaWRlIHRoZSBzY3JlZW4gZGltZW5zaW9ucywgd2UncmUgZ29vZFxuICBpZiAodHBsV2lkdGggPD0gc2NyZWVuV2lkdGggJiYgdHBsSGVpZ2h0IDw9IHNjcmVlbkhlaWdodCkge1xuICAgIHJldHVybiBiNjRUZW1wbGF0ZTtcbiAgfVxuXG4gIGxvZy5pbmZvKGBTY2FsaW5nIHRlbXBsYXRlIGltYWdlIGZyb20gJHt0cGxXaWR0aH14JHt0cGxIZWlnaHR9IHRvIG1hdGNoIGAgK1xuICAgICAgICAgICBgc2NyZWVuIGF0ICR7c2NyZWVuV2lkdGh9eCR7c2NyZWVuSGVpZ2h0fWApO1xuICAvLyBvdGhlcndpc2UsIHNjYWxlIGl0IHRvIGZpdCBpbnNpZGUgdGhlIHNjcmVlbiBkaW1lbnNpb25zXG4gIGltZ09iaiA9IGltZ09iai5zY2FsZVRvRml0KHNjcmVlbldpZHRoLCBzY3JlZW5IZWlnaHQpO1xuICByZXR1cm4gKGF3YWl0IGltZ09iai5nZXRCdWZmZXIoaW1hZ2VVdGlsLk1JTUVfUE5HKSkudG9TdHJpbmcoJ2Jhc2U2NCcpO1xufTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBTY3JlZW5zaG90XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYjY0U2NyZWVuc2hvdCAtIGJhc2U2NCBiYXNlZCBzY3JlZW5zaG90IHN0cmluZ1xuICovXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFNjcmVlbnNob3RTY2FsZVxuICogQHByb3BlcnR5IHtmbG9hdH0geFNjYWxlIC0gU2NhbGUgcmF0aW8gZm9yIHdpZHRoXG4gKiBAcHJvcGVydHkge2Zsb2F0fSB5U2NhbGUgLSBTY2FsZSByYXRpbyBmb3IgaGVpZ2h0XG4gKi9cbi8qKlxuICogR2V0IHRoZSBzY3JlZW5zaG90IGltYWdlIHRoYXQgd2lsbCBiZSB1c2VkIGZvciBmaW5kIGJ5IGVsZW1lbnQsIHBvdGVudGlhbGx5XG4gKiBhbHRlcmluZyBpdCBpbiB2YXJpb3VzIHdheXMgYmFzZWQgb24gdXNlci1yZXF1ZXN0ZWQgc2V0dGluZ3NcbiAqXG4gKiBAcGFyYW0ge2ludH0gc2NyZWVuV2lkdGggLSB3aWR0aCBvZiBzY3JlZW5cbiAqIEBwYXJhbSB7aW50fSBzY3JlZW5IZWlnaHQgLSBoZWlnaHQgb2Ygc2NyZWVuXG4gKlxuICogQHJldHVybnMge1NjcmVlbnNob3QsID9TY3JlZW5zaG90U2NhbGV9IGJhc2U2NC1lbmNvZGVkIHNjcmVlbnNob3QgYW5kIFNjcmVlbnNob3RTY2FsZVxuICovXG5oZWxwZXJzLmdldFNjcmVlbnNob3RGb3JJbWFnZUZpbmQgPSBhc3luYyBmdW5jdGlvbiBnZXRTY3JlZW5zaG90Rm9ySW1hZ2VGaW5kIChzY3JlZW5XaWR0aCwgc2NyZWVuSGVpZ2h0KSB7XG4gIGlmICghdGhpcy5nZXRTY3JlZW5zaG90KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBkcml2ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgcmVxdWlyZWQgJ2dldFNjcmVlbnNob3QnIGNvbW1hbmRcIik7XG4gIH1cblxuICBsZXQgYjY0U2NyZWVuc2hvdCA9IGF3YWl0IHRoaXMuZ2V0U2NyZWVuc2hvdCgpO1xuXG4gIC8vIGlmIHRoZSB1c2VyIGhhcyByZXF1ZXN0ZWQgbm90IHRvIGNvcnJlY3QgZm9yIGFzcGVjdCBvciBzaXplIGRpZmZlcmVuY2VzXG4gIC8vIGJldHdlZW4gdGhlIHNjcmVlbnNob3QgYW5kIHRoZSBzY3JlZW4sIGp1c3QgcmV0dXJuIHRoZSBzY3JlZW5zaG90IG5vd1xuICBpZiAoIXRoaXMuc2V0dGluZ3MuZ2V0U2V0dGluZ3MoKS5maXhJbWFnZUZpbmRTY3JlZW5zaG90RGltcykge1xuICAgIGxvZy5pbmZvKGBOb3QgdmVyaWZ5aW5nIHNjcmVlbnNob3QgZGltZW5zaW9ucyBtYXRjaCBzY3JlZW5gKTtcbiAgICByZXR1cm4ge2I2NFNjcmVlbnNob3R9O1xuICB9XG5cbiAgaWYgKHNjcmVlbldpZHRoIDwgMSB8fCBzY3JlZW5IZWlnaHQgPCAxKSB7XG4gICAgbG9nLndhcm4oYFRoZSByZXRyaWV2ZWQgc2NyZWVuIHNpemUgJHtzY3JlZW5XaWR0aH14JHtzY3JlZW5IZWlnaHR9IGRvZXMgYCArXG4gICAgICBgbm90IHNlZW0gdG8gYmUgdmFsaWQuIE5vIGNoYW5nZXMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBzY3JlZW5zaG90YCk7XG4gICAgcmV0dXJuIHtiNjRTY3JlZW5zaG90fTtcbiAgfVxuXG4gIC8vIG90aGVyd2lzZSwgZG8gc29tZSB2ZXJpZmljYXRpb24gb24gdGhlIHNjcmVlbnNob3QgdG8gbWFrZSBzdXJlIGl0IG1hdGNoZXNcbiAgLy8gdGhlIHNjcmVlbiBzaXplIGFuZCBhc3BlY3QgcmF0aW9cbiAgbG9nLmluZm8oJ1ZlcmlmeWluZyBzY3JlZW5zaG90IHNpemUgYW5kIGFzcGVjdCByYXRpbycpO1xuXG4gIGxldCBpbWdPYmogPSBhd2FpdCBpbWFnZVV0aWwuZ2V0SmltcEltYWdlKGI2NFNjcmVlbnNob3QpO1xuICBsZXQge3dpZHRoOiBzaG90V2lkdGgsIGhlaWdodDogc2hvdEhlaWdodH0gPSBpbWdPYmouYml0bWFwO1xuXG4gIGlmIChzaG90V2lkdGggPCAxIHx8IHNob3RIZWlnaHQgPCAxKSB7XG4gICAgbG9nLndhcm4oYFRoZSByZXRyaWV2ZWQgc2NyZWVuc2hvdCBzaXplICR7c2hvdFdpZHRofXgke3Nob3RIZWlnaHR9IGRvZXMgYCArXG4gICAgICBgbm90IHNlZW0gdG8gYmUgdmFsaWQuIE5vIGNoYW5nZXMgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBzY3JlZW5zaG90YCk7XG4gICAgcmV0dXJuIHtiNjRTY3JlZW5zaG90fTtcbiAgfVxuXG4gIGlmIChzY3JlZW5XaWR0aCA9PT0gc2hvdFdpZHRoICYmIHNjcmVlbkhlaWdodCA9PT0gc2hvdEhlaWdodCkge1xuICAgIC8vIHRoZSBoZWlnaHQgYW5kIHdpZHRoIG9mIHRoZSBzY3JlZW5zaG90IGFuZCB0aGUgZGV2aWNlIHNjcmVlbiBtYXRjaCwgd2hpY2hcbiAgICAvLyBtZWFucyB3ZSBzaG91bGQgYmUgc2FmZSB3aGVuIGRvaW5nIHRlbXBsYXRlIG1hdGNoZXNcbiAgICBsb2cuaW5mbygnU2NyZWVuc2hvdCBzaXplIG1hdGNoZWQgc2NyZWVuIHNpemUnKTtcbiAgICByZXR1cm4ge2I2NFNjcmVlbnNob3R9O1xuICB9XG5cbiAgLy8gb3RoZXJ3aXNlLCBpZiB0aGV5IGRvbid0IG1hdGNoLCBpdCBjb3VsZCBzcGVsbCBwcm9ibGVtcyBmb3IgdGhlIGFjY3VyYWN5XG4gIC8vIG9mIGNvb3JkaW5hdGVzIHJldHVybmVkIGJ5IHRoZSBpbWFnZSBtYXRjaCBhbGdvcml0aG0sIHNpbmNlIHdlIG1hdGNoIGJhc2VkXG4gIC8vIG9uIHRoZSBzY3JlZW5zaG90IGNvb3JkaW5hdGVzIG5vdCB0aGUgZGV2aWNlIGNvb3JkaW5hdGVzIHRoZW1zZWx2ZXMuIFRoZXJlXG4gIC8vIGFyZSB0d28gcG90ZW50aWFsIHR5cGVzIG9mIG1pc21hdGNoOiBhc3BlY3QgcmF0aW8gbWlzbWF0Y2ggYW5kIHNjYWxlXG4gIC8vIG1pc21hdGNoLiBXZSBuZWVkIHRvIGRldGVjdCBhbmQgZml4IGJvdGhcblxuICBjb25zdCBzY2FsZSA9IHt4U2NhbGU6IDEuMCwgeVNjYWxlOiAxLjB9O1xuXG4gIGNvbnN0IHNjcmVlbkFSID0gc2NyZWVuV2lkdGggLyBzY3JlZW5IZWlnaHQ7XG4gIGNvbnN0IHNob3RBUiA9IHNob3RXaWR0aCAvIHNob3RIZWlnaHQ7XG4gIGlmIChNYXRoLnJvdW5kKHNjcmVlbkFSICogRkxPQVRfUFJFQ0lTSU9OKSA9PT0gTWF0aC5yb3VuZChzaG90QVIgKiBGTE9BVF9QUkVDSVNJT04pKSB7XG4gICAgbG9nLmluZm8oYFNjcmVlbnNob3QgYXNwZWN0IHJhdGlvICcke3Nob3RBUn0nICgke3Nob3RXaWR0aH14JHtzaG90SGVpZ2h0fSkgbWF0Y2hlZCBgICtcbiAgICAgIGBzY3JlZW4gYXNwZWN0IHJhdGlvICcke3NjcmVlbkFSfScgKCR7c2NyZWVuV2lkdGh9eCR7c2NyZWVuSGVpZ2h0fSlgKTtcbiAgfSBlbHNlIHtcbiAgICBsb2cud2FybihgV2hlbiB0cnlpbmcgdG8gZmluZCBhbiBlbGVtZW50LCBkZXRlcm1pbmVkIHRoYXQgdGhlIHNjcmVlbiBgICtcbiAgICAgICAgICAgICBgYXNwZWN0IHJhdGlvIGFuZCBzY3JlZW5zaG90IGFzcGVjdCByYXRpbyBhcmUgZGlmZmVyZW50LiBTY3JlZW4gYCArXG4gICAgICAgICAgICAgYGlzICR7c2NyZWVuV2lkdGh9eCR7c2NyZWVuSGVpZ2h0fSB3aGVyZWFzIHNjcmVlbnNob3QgaXMgYCArXG4gICAgICAgICAgICAgYCR7c2hvdFdpZHRofXgke3Nob3RIZWlnaHR9LmApO1xuXG4gICAgLy8gSW4gdGhlIGNhc2Ugd2hlcmUgdGhlIHgtc2NhbGUgYW5kIHktc2NhbGUgYXJlIGRpZmZlcmVudCwgd2UgbmVlZCB0byBkZWNpZGVcbiAgICAvLyB3aGljaCBvbmUgdG8gcmVzcGVjdCwgb3RoZXJ3aXNlIHRoZSBzY3JlZW5zaG90IGFuZCB0ZW1wbGF0ZSB3aWxsIGVuZCB1cFxuICAgIC8vIGJlaW5nIHJlc2l6ZWQgaW4gYSB3YXkgdGhhdCBjaGFuZ2VzIGl0cyBhc3BlY3QgcmF0aW8gKGRpc3RvcnRzIGl0KS4gRm9yIGV4YW1wbGUsIGxldCdzIHNheTpcbiAgICAvLyB0aGlzLmdldFNjcmVlbnNob3Qoc2hvdFdpZHRoLCBzaG90SGVpZ2h0KSBpcyA1NDB4Mzk3LFxuICAgIC8vIHRoaXMuZ2V0RGV2aWNlU2l6ZShzY3JlZW5XaWR0aCwgc2NyZWVuSGVpZ2h0KSBpcyAxMDgweDE5MjAuXG4gICAgLy8gVGhlIHJhdGlvIHdvdWxkIHRoZW4gYmUge3hTY2FsZTogMC41LCB5U2NhbGU6IDAuMn0uXG4gICAgLy8gSW4gdGhpcyBjYXNlLCB3ZSBtdXN0IHNob3VsZCBgeVNjYWxlOiAwLjJgIGFzIHNjYWxlRmFjdG9yLCBiZWNhdXNlXG4gICAgLy8gaWYgd2Ugc2VsZWN0IHRoZSB4U2NhbGUsIHRoZSBoZWlnaHQgd2lsbCBiZSBiaWdnZXIgdGhhbiByZWFsIHNjcmVlbnNob3Qgc2l6ZVxuICAgIC8vIHdoaWNoIGlzIHVzZWQgdG8gaW1hZ2UgY29tcGFyaXNvbiBieSBPcGVuQ1YgYXMgYSBiYXNlIGltYWdlLlxuICAgIC8vIEFsbCBvZiB0aGlzIGlzIHByaW1hcmlseSB1c2VmdWwgd2hlbiB0aGUgc2NyZWVuc2hvdCBpcyBhIGhvcml6b250YWwgc2xpY2UgdGFrZW4gb3V0IG9mIHRoZVxuICAgIC8vIHNjcmVlbiAoZm9yIGV4YW1wbGUgbm90IGluY2x1ZGluZyB0b3AvYm90dG9tIG5hdiBiYXJzKVxuICAgIGNvbnN0IHhTY2FsZSA9ICgxLjAgKiBzaG90V2lkdGgpIC8gc2NyZWVuV2lkdGg7XG4gICAgY29uc3QgeVNjYWxlID0gKDEuMCAqIHNob3RIZWlnaHQpIC8gc2NyZWVuSGVpZ2h0O1xuICAgIGNvbnN0IHNjYWxlRmFjdG9yID0geFNjYWxlID49IHlTY2FsZSA/IHlTY2FsZSA6IHhTY2FsZTtcblxuICAgIGxvZy53YXJuKGBSZXNpemluZyBzY3JlZW5zaG90IHRvICR7c2hvdFdpZHRoICogc2NhbGVGYWN0b3J9eCR7c2hvdEhlaWdodCAqIHNjYWxlRmFjdG9yfSB0byBtYXRjaCBgICtcbiAgICAgICAgICAgICBgc2NyZWVuIGFzcGVjdCByYXRpbyBzbyB0aGF0IGltYWdlIGVsZW1lbnQgY29vcmRpbmF0ZXMgaGF2ZSBhIGAgK1xuICAgICAgICAgICAgIGBncmVhdGVyIGNoYW5jZSBvZiBiZWluZyBjb3JyZWN0LmApO1xuICAgIGltZ09iaiA9IGltZ09iai5yZXNpemUoc2hvdFdpZHRoICogc2NhbGVGYWN0b3IsIHNob3RIZWlnaHQgKiBzY2FsZUZhY3Rvcik7XG5cbiAgICBzY2FsZS54U2NhbGUgKj0gc2NhbGVGYWN0b3I7XG4gICAgc2NhbGUueVNjYWxlICo9IHNjYWxlRmFjdG9yO1xuXG4gICAgc2hvdFdpZHRoID0gaW1nT2JqLmJpdG1hcC53aWR0aDtcbiAgICBzaG90SGVpZ2h0ID0gaW1nT2JqLmJpdG1hcC5oZWlnaHQ7XG4gIH1cblxuICAvLyBSZXNpemUgYmFzZWQgb24gdGhlIHNjcmVlbiBkaW1lbnNpb25zIG9ubHkgaWYgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IGFyZSBtaXNtYXRjaGVkXG4gIC8vIHNpbmNlIGV4Y2VwdCBmb3IgdGhhdCwgaXQgbWlnaHQgYmUgYSBzaXR1YXRpb24gd2hpY2ggaXMgZGlmZmVyZW50IHdpbmRvdyByZWN0IGFuZFxuICAvLyBzY3JlZW5zaG90IHNpemUgbGlrZSBgQGRyaXZlci53aW5kb3dfcmVjdCAjPT54PTAsIHk9MCwgd2lkdGg9MTA4MCwgaGVpZ2h0PTE3OTRgIGFuZFxuICAvLyBgXCJkZXZpY2VTY3JlZW5TaXplXCI9PlwiMTA4MHgxOTIwXCJgXG4gIGlmIChzY3JlZW5XaWR0aCAhPT0gc2hvdFdpZHRoICYmIHNjcmVlbkhlaWdodCAhPT0gc2hvdEhlaWdodCkge1xuICAgIGxvZy5pbmZvKGBTY2FsaW5nIHNjcmVlbnNob3QgZnJvbSAke3Nob3RXaWR0aH14JHtzaG90SGVpZ2h0fSB0byBtYXRjaCBgICtcbiAgICAgICAgICAgICBgc2NyZWVuIGF0ICR7c2NyZWVuV2lkdGh9eCR7c2NyZWVuSGVpZ2h0fWApO1xuICAgIGltZ09iaiA9IGltZ09iai5yZXNpemUoc2NyZWVuV2lkdGgsIHNjcmVlbkhlaWdodCk7XG5cbiAgICBzY2FsZS54U2NhbGUgKj0gKDEuMCAqIHNjcmVlbldpZHRoKSAvIHNob3RXaWR0aDtcbiAgICBzY2FsZS55U2NhbGUgKj0gKDEuMCAqIHNjcmVlbkhlaWdodCkgLyBzaG90SGVpZ2h0O1xuICB9XG5cbiAgYjY0U2NyZWVuc2hvdCA9IChhd2FpdCBpbWdPYmouZ2V0QnVmZmVyKGltYWdlVXRpbC5NSU1FX1BORykpLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgcmV0dXJuIHtiNjRTY3JlZW5zaG90LCBzY2FsZX07XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEltYWdlVGVtcGxhdGVTZXR0aW5nc1xuICogQHByb3BlcnR5IHtib29sZWFufSBmaXhJbWFnZVRlbXBsYXRlU2NhbGUgLSBmaXhJbWFnZVRlbXBsYXRlU2NhbGUgaW4gZGV2aWNlLXNldHRpbmdzXG4gKiBAcHJvcGVydHkge2Zsb2F0fSBkZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlIC0gZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZSBpbiBkZXZpY2Utc2V0dGluZ3NcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaWdub3JlRGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZSAtIElnbm9yZSBkZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlIGlmIGl0IGhhcyB0cnVlLlxuICogSWYgYjY0VGVtcGxhdGUgaGFzIGJlZW4gc2NhbGVkIHRvIGRlZmF1bHRJbWFnZVRlbXBsYXRlU2NhbGUgb3Igc2hvdWxkIGlnbm9yZSB0aGUgc2NhbGUsXG4gKiB0aGlzIHBhcmFtZXRlciBzaG91bGQgYmUgdHJ1ZS4gZS5nLiBjbGljayBpbiBpbWFnZS1lbGVtZW50IG1vZHVsZVxuICogQHByb3BlcnR5IHtmbG9hdH0geFNjYWxlIC0gU2NhbGUgcmF0aW8gZm9yIHdpZHRoXG4gKiBAcHJvcGVydHkge2Zsb2F0fSB5U2NhbGUgLSBTY2FsZSByYXRpbyBmb3IgaGVpZ2h0XG5cbiAqL1xuLyoqXG4gKiBHZXQgYSBpbWFnZSB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgdGVtcGxhdGUgbWFjaGluZy5cbiAqIFJldHVybnMgc2NhbGVkIGltYWdlIGlmIHNjYWxlIHJhdGlvIGlzIHByb3ZpZGVkLlxuICpcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYjY0VGVtcGxhdGUgLSBiYXNlNjQtZW5jb2RlZCBpbWFnZSB1c2VkIGFzIGEgdGVtcGxhdGUgdG8gYmVcbiAqIG1hdGNoZWQgaW4gdGhlIHNjcmVlbnNob3RcbiAqIEBwYXJhbSB7SW1hZ2VUZW1wbGF0ZVNldHRpbmdzfSBvcHRzIC0gSW1hZ2UgdGVtcGxhdGUgc2NhbGUgcmVsYXRlZCBvcHRpb25zXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gYmFzZTY0LWVuY29kZWQgc2NhbGVkIHRlbXBsYXRlIHNjcmVlbnNob3RcbiAqL1xuY29uc3QgREVGQVVMVF9GSVhfSU1BR0VfVEVNUExBVEVfU0NBTEUgPSAxO1xuaGVscGVycy5maXhJbWFnZVRlbXBsYXRlU2NhbGUgPSBhc3luYyBmdW5jdGlvbiBmaXhJbWFnZVRlbXBsYXRlU2NhbGUgKGI2NFRlbXBsYXRlLCBvcHRzID0ge30pIHtcbiAgaWYgKCFvcHRzKSB7XG4gICAgcmV0dXJuIGI2NFRlbXBsYXRlO1xuICB9XG5cbiAgbGV0IHtcbiAgICBmaXhJbWFnZVRlbXBsYXRlU2NhbGUgPSBmYWxzZSxcbiAgICBkZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlID0gREVGQVVMVF9URU1QTEFURV9JTUFHRV9TQ0FMRSxcbiAgICBpZ25vcmVEZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlID0gZmFsc2UsXG4gICAgeFNjYWxlID0gREVGQVVMVF9GSVhfSU1BR0VfVEVNUExBVEVfU0NBTEUsXG4gICAgeVNjYWxlID0gREVGQVVMVF9GSVhfSU1BR0VfVEVNUExBVEVfU0NBTEVcbiAgfSA9IG9wdHM7XG5cbiAgaWYgKGlnbm9yZURlZmF1bHRJbWFnZVRlbXBsYXRlU2NhbGUpIHtcbiAgICBkZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlID0gREVGQVVMVF9URU1QTEFURV9JTUFHRV9TQ0FMRTtcbiAgfVxuXG4gIC8vIERlZmF1bHRcbiAgaWYgKGRlZmF1bHRJbWFnZVRlbXBsYXRlU2NhbGUgPT09IERFRkFVTFRfVEVNUExBVEVfSU1BR0VfU0NBTEUgJiYgIWZpeEltYWdlVGVtcGxhdGVTY2FsZSkge1xuICAgIHJldHVybiBiNjRUZW1wbGF0ZTtcbiAgfVxuXG4gIC8vIENhbGN1bGF0ZSB4U2NhbGUgYW5kIHlTY2FsZSBBcHBpdW0gc2hvdWxkIHNjYWxlXG4gIGlmIChmaXhJbWFnZVRlbXBsYXRlU2NhbGUpIHtcbiAgICB4U2NhbGUgKj0gZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZTtcbiAgICB5U2NhbGUgKj0gZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZTtcbiAgfSBlbHNlIHtcbiAgICB4U2NhbGUgPSB5U2NhbGUgPSAxICogZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZTtcbiAgfVxuXG4gIC8vIHhTY2FsZSBhbmQgeVNjYWxlIGNhbiBiZSBOYU4gaWYgZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZSBpcyBzdHJpbmcsIGZvciBleGFtcGxlXG4gIGlmICghcGFyc2VGbG9hdCh4U2NhbGUpIHx8ICFwYXJzZUZsb2F0KHlTY2FsZSkpIHtcbiAgICByZXR1cm4gYjY0VGVtcGxhdGU7XG4gIH1cblxuICAvLyBSZXR1cm4gaWYgdGhlIHNjYWxlIGlzIGRlZmF1bHQsIDEsIHZhbHVlXG4gIGlmIChNYXRoLnJvdW5kKHhTY2FsZSAqIEZMT0FUX1BSRUNJU0lPTikgPT09IE1hdGgucm91bmQoREVGQVVMVF9GSVhfSU1BR0VfVEVNUExBVEVfU0NBTEUgKiBGTE9BVF9QUkVDSVNJT04pXG4gICAgICAmJiBNYXRoLnJvdW5kKHlTY2FsZSAqIEZMT0FUX1BSRUNJU0lPTiA9PT0gTWF0aC5yb3VuZChERUZBVUxUX0ZJWF9JTUFHRV9URU1QTEFURV9TQ0FMRSAqIEZMT0FUX1BSRUNJU0lPTikpKSB7XG4gICAgcmV0dXJuIGI2NFRlbXBsYXRlO1xuICB9XG5cbiAgbGV0IGltZ1RlbXBPYmogPSBhd2FpdCBpbWFnZVV0aWwuZ2V0SmltcEltYWdlKGI2NFRlbXBsYXRlKTtcbiAgbGV0IHt3aWR0aDogYmFzZVRlbXBXaWR0aCwgaGVpZ2h0OiBiYXNlVGVtcEhlaWdofSA9IGltZ1RlbXBPYmouYml0bWFwO1xuXG4gIGNvbnN0IHNjYWxlZFdpZHRoID0gYmFzZVRlbXBXaWR0aCAqIHhTY2FsZTtcbiAgY29uc3Qgc2NhbGVkSGVpZ2h0ID0gYmFzZVRlbXBIZWlnaCAqIHlTY2FsZTtcbiAgbG9nLmluZm8oYFNjYWxpbmcgdGVtcGxhdGUgaW1hZ2UgZnJvbSAke2Jhc2VUZW1wV2lkdGh9eCR7YmFzZVRlbXBIZWlnaH1gICtcbiAgICAgICAgICAgIGAgdG8gJHtzY2FsZWRXaWR0aH14JHtzY2FsZWRIZWlnaHR9YCk7XG4gIGxvZy5pbmZvKGBUaGUgcmF0aW8gaXMgJHt4U2NhbGV9IGFuZCAke3lTY2FsZX1gKTtcbiAgaW1nVGVtcE9iaiA9IGF3YWl0IGltZ1RlbXBPYmoucmVzaXplKHNjYWxlZFdpZHRoLCBzY2FsZWRIZWlnaHQpO1xuICByZXR1cm4gKGF3YWl0IGltZ1RlbXBPYmouZ2V0QnVmZmVyKGltYWdlVXRpbC5NSU1FX1BORykpLnRvU3RyaW5nKCdiYXNlNjQnKTtcbn07XG5cbk9iamVjdC5hc3NpZ24oZXh0ZW5zaW9ucywgY29tbWFuZHMsIGhlbHBlcnMpO1xuZXhwb3J0IHsgY29tbWFuZHMsIGhlbHBlcnMsIElNQUdFX1NUUkFURUdZLCBDVVNUT01fU1RSQVRFR1kgfTtcbmV4cG9ydCBkZWZhdWx0IGV4dGVuc2lvbnM7XG4iXSwiZmlsZSI6ImxpYi9iYXNlZHJpdmVyL2NvbW1hbmRzL2ZpbmQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4ifQ==
