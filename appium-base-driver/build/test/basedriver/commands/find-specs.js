"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("source-map-support/register");

var _chai = _interopRequireDefault(require("chai"));

var _path = _interopRequireDefault(require("path"));

var _chaiAsPromised = _interopRequireDefault(require("chai-as-promised"));

var _sinon = _interopRequireDefault(require("sinon"));

var _ = require("../../..");

var _find = require("../../../lib/basedriver/commands/find");

var _appiumSupport = require("appium-support");

const should = _chai.default.should();

_chai.default.use(_chaiAsPromised.default);

class TestDriver extends _.BaseDriver {
  async getWindowSize() {}

  async getScreenshot() {}

}

const CUSTOM_FIND_MODULE = _path.default.resolve(__dirname, '..', '..', '..', '..', 'test', 'basedriver', 'fixtures', 'custom-element-finder');

const BAD_CUSTOM_FIND_MODULE = _path.default.resolve(__dirname, '..', '..', '..', '..', 'test', 'basedriver', 'fixtures', 'custom-element-finder-bad');

const TINY_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0NDMDM4MDM4N0U2MTFFOEEzMzhGMTRFNUUwNzIwNUIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0NDMDM4MDQ4N0U2MTFFOEEzMzhGMTRFNUUwNzIwNUIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3Q0MwMzgwMTg3RTYxMUU4QTMzOEYxNEU1RTA3MjA1QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3Q0MwMzgwMjg3RTYxMUU4QTMzOEYxNEU1RTA3MjA1QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpdvJjQAAAAlSURBVHjaJInBEQAACIKw/Xe2Ul5wYBtwmJqkk4+zfvUQVoABAEg0EfrZwc0hAAAAAElFTkSuQmCC';
const TINY_PNG_DIMS = [4, 4];
describe('finding elements by image', function () {
  describe('findElement', function () {
    it('should use a different special method to find element by image', async function () {
      const d = new TestDriver();

      _sinon.default.stub(d, 'findByImage').returns(true);

      _sinon.default.stub(d, 'findElOrElsWithProcessing').returns(false);

      await d.findElement(_find.IMAGE_STRATEGY, 'foo').should.eventually.be.true;
      await d.findElements(_find.IMAGE_STRATEGY, 'foo').should.eventually.be.true;
    });
    it('should not be able to find image element from any other element', async function () {
      const d = new TestDriver();
      await d.findElementFromElement(_find.IMAGE_STRATEGY, 'foo', 'elId').should.eventually.be.rejectedWith(/Locator Strategy.+is not supported/);
      await d.findElementsFromElement(_find.IMAGE_STRATEGY, 'foo', 'elId').should.eventually.be.rejectedWith(/Locator Strategy.+is not supported/);
    });
  });
  describe('findByImage', function () {
    const rect = {
      x: 10,
      y: 20,
      width: 30,
      height: 40
    };
    const score = 0.9;
    const size = {
      width: 100,
      height: 200
    };
    const screenshot = 'iVBORfoo';
    const template = 'iVBORbar';

    function basicStub(driver) {
      const sizeStub = _sinon.default.stub(driver, 'getWindowSize').returns(size);

      const screenStub = _sinon.default.stub(driver, 'getScreenshotForImageFind').returns(screenshot);

      const compareStub = _sinon.default.stub(driver, 'compareImages').returns({
        rect,
        score
      });

      return {
        sizeStub,
        screenStub,
        compareStub
      };
    }

    function basicImgElVerify(imgElProto, driver) {
      const imgElId = imgElProto.ELEMENT;
      driver._imgElCache.has(imgElId).should.be.true;

      const imgEl = driver._imgElCache.get(imgElId);

      (imgEl instanceof _.ImageElement).should.be.true;
      imgEl.rect.should.eql(rect);
      imgEl.score.should.eql(score);
      return imgEl;
    }

    it('should find an image element happypath', async function () {
      const d = new TestDriver();
      basicStub(d);
      const imgElProto = await d.findByImage(template, {
        multiple: false
      });
      basicImgElVerify(imgElProto, d);
    });
    it('should find image elements happypath', async function () {
      const d = new TestDriver();
      const {
        compareStub
      } = basicStub(d);
      compareStub.returns([{
        rect,
        score
      }]);
      const els = await d.findByImage(template, {
        multiple: true
      });
      els.should.have.length(1);
      basicImgElVerify(els[0], d);
    });
    it('should fail if driver does not support getWindowSize', async function () {
      const d = new _.BaseDriver();
      await d.findByImage(template, {
        multiple: false
      }).should.eventually.be.rejectedWith(/driver does not support/);
    });
    it('should fix template size if requested', async function () {
      const d = new TestDriver();
      const newTemplate = 'iVBORbaz';
      const {
        compareStub
      } = basicStub(d);
      await d.settings.update({
        fixImageTemplateSize: true
      });

      _sinon.default.stub(d, 'ensureTemplateSize').returns(newTemplate);

      const imgElProto = await d.findByImage(template, {
        multiple: false
      });
      const imgEl = basicImgElVerify(imgElProto, d);
      imgEl.template.should.eql(newTemplate);
      compareStub.args[0][2].should.eql(newTemplate);
    });
    it('should fix template size scale if requested', async function () {
      const d = new TestDriver();
      const newTemplate = 'iVBORbaz';
      const {
        compareStub
      } = basicStub(d);
      await d.settings.update({
        fixImageTemplateScale: true
      });

      _sinon.default.stub(d, 'fixImageTemplateScale').returns(newTemplate);

      const imgElProto = await d.findByImage(template, {
        multiple: false
      });
      const imgEl = basicImgElVerify(imgElProto, d);
      imgEl.template.should.eql(newTemplate);
      compareStub.args[0][2].should.eql(newTemplate);
    });
    it('should not fix template size scale if it is not requested', async function () {
      const d = new TestDriver();
      const newTemplate = 'iVBORbaz';
      basicStub(d);
      await d.settings.update({});

      _sinon.default.stub(d, 'fixImageTemplateScale').returns(newTemplate);

      d.fixImageTemplateScale.callCount.should.eql(0);
    });
    it('should throw an error if template match fails', async function () {
      const d = new TestDriver();
      const {
        compareStub
      } = basicStub(d);
      compareStub.throws(new Error('Cannot find any occurrences'));
      await d.findByImage(template, {
        multiple: false
      }).should.eventually.be.rejectedWith(/element could not be located/);
    });
    it('should return empty array for multiple elements if template match fails', async function () {
      const d = new TestDriver();
      const {
        compareStub
      } = basicStub(d);
      compareStub.throws(new Error('Cannot find any occurrences'));
      await d.findByImage(template, {
        multiple: true
      }).should.eventually.eql([]);
    });
    it('should respect implicit wait', async function () {
      const d = new TestDriver();
      d.setImplicitWait(10);
      const {
        compareStub
      } = basicStub(d);
      compareStub.onCall(0).throws(new Error('Cannot find any occurrences'));
      const imgElProto = await d.findByImage(template, {
        multiple: false
      });
      basicImgElVerify(imgElProto, d);
      compareStub.callCount.should.eql(2);
    });
    it('should not add element to cache and return it directly when checking staleness', async function () {
      const d = new TestDriver();
      basicStub(d);
      const imgEl = await d.findByImage(template, {
        multiple: false,
        shouldCheckStaleness: true
      });
      (imgEl instanceof _.ImageElement).should.be.true;
      d._imgElCache.has(imgEl.id).should.be.false;
      imgEl.rect.should.eql(rect);
    });
  });
  describe('fixImageTemplateScale', function () {
    it('should not fix template size scale if no scale value', async function () {
      const newTemplate = 'iVBORbaz';
      await _find.helpers.fixImageTemplateScale(newTemplate, {
        fixImageTemplateScale: true
      }).should.eventually.eql(newTemplate);
    });
    it('should not fix template size scale if it is null', async function () {
      const newTemplate = 'iVBORbaz';
      await _find.helpers.fixImageTemplateScale(newTemplate, null).should.eventually.eql(newTemplate);
    });
    it('should not fix template size scale if it is not number', async function () {
      const newTemplate = 'iVBORbaz';
      await _find.helpers.fixImageTemplateScale(newTemplate, 'wrong-scale').should.eventually.eql(newTemplate);
    });
    it('should fix template size scale', async function () {
      const actual = 'iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAWElEQVR4AU3BQRWAQAhAwa/PGBsEgrC16AFBKEIPXW7OXO+Rmey9iQjMjHFzrLUwM7qbqmLcHKpKRFBVuDvj4agq3B1VRUQYT2bS3QwRQVUZF/CaGRHB3wc1vSZbHO5+BgAAAABJRU5ErkJggg==';
      await _find.helpers.fixImageTemplateScale(TINY_PNG, {
        fixImageTemplateScale: true,
        xScale: 1.5,
        yScale: 1.5
      }).should.eventually.eql(actual);
    });
    it('should not fix template size scale because of fixImageTemplateScale is false', async function () {
      await _find.helpers.fixImageTemplateScale(TINY_PNG, {
        fixImageTemplateScale: false,
        xScale: 1.5,
        yScale: 1.5
      }).should.eventually.eql(TINY_PNG);
    });
    it('should fix template size scale with default scale', async function () {
      const actual = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVR4AaXBPUsrQQCG0SeX+cBdkTjwTpG1NPgLpjY/fW1stt4UYmm2cJqwMCsaw70uJJ3CBc9Z/P3Cl+12S9u2tG1L27bEGLm/v2ez2bDZbJDEd/7wS4YT7z3X19fc3Nxwd3dHXdd47xnHkefnZ8ZxpKoq6rqmqiqMMcwMJ1VV0TQN0zThnOPj44O6rsk503UdkmiahqZpWK1WGGOYGU7quqZpGqy1SCLnTM6Z19dXcs5IYpomrLVI4uLigpnhpKoqVqsVkjgcDjw9PdF1HTlnuq5DEs45JHE4HDgznByPR97e3pimiVIK4zhyPB7x3hNCIITA5eUl3nsWiwVnhpNSCsMwsNvtGIaB/X5PKQVJpJSQxHq9RhLOOc4MJ9M0sdvt2G639H3PTBIxRiQhCUnEGLHWcmY4KaUwDAN93/P4+MhyuSSlhCRSSkjCOYe1FmstZ6bve2YvLy/s93tmy+USSUhCEpIIIfAd8/DwwOz9/Z1SCpJIKSGJ9XqNJJxz/MS0bcvs6uoKScQYkYQkJBFjxFrLT0zbtsxub29JKSGJlBKScM5hrcVay09MzplZjJHPz0+894QQCCHwP/7wS/8A4e6nAg+R8LwAAAAASUVORK5CYII=';
      await _find.helpers.fixImageTemplateScale(TINY_PNG, {
        defaultImageTemplateScale: 4.0
      }).should.eventually.eql(actual);
    });
    it('should fix template size scale with default scale and image scale', async function () {
      const actual = 'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACaUlEQVR4AbXBMWvrWBSF0c9BsFPtW91UR1U6+///FKlKKt8qqnyqnMozggkI8xgMj6x1uv+L/6zryrIsrOvKsiys68qyLFwuF87nM5fLhfP5zOVy4Xw+84wXftkLv2ziQBK26b0TEVQVu4jANrvM5Hq9spOEJCQhCUlI4mjiQBK26b1TVewkYRvb7DKTMQaZiW1s01rDNraRxNHEgSRaa1QVO0m01jjKTDKTXe+d3jtVxU4SjyYOJGGbnSRs03snM8lMMpPb7UZmkplEBFXFThK2eTRxIAnbSMI2VcX39zdjDMYYZCaZyRiDMQZVxU4StqkqHk0cSEISf5KZ7DKTMQbLsrCTRGuN3jtVxaOJg6qiqqgqqoqqoqoYY5CZ7GwTEdzvd97f34kIeu/YRhKPJg6qiswkM7ndbmQmmUlmkpnsbBMR2CYimOeZ3ju2kcSjiYOqIjP5+vpi2za2bWPbNo5aa7TW2PXe6b3Te6e1hiQeTRxUFbfbjW3bGGNwvV4ZY2Ab27TWsI1tbGMb27TWsI0kHk0cVBWZybZtXK9XPj8/+fj4YJ5nIoLWGraJCOZ5RhKSkIQkJPFo4qCqyEy2bWOMwefnJ+u6cjqdsM3ONvM8cz6feca0ris/rtcrmcnONhHB/X7n/f2diKD3jm0k8axpWRZ+ZCaZyc42EYFtIoJ5num9YxtJPGta15U/sY1tdm9vb/Te6b1jG0k8a1qWhR+2sU1rjdYatrGNbWxjm9YaknjWtK4rPyKCiKC1hm0igojg9fUVSUhCEpJ41rQsC0e22dkmIrhcLvyNF/7H6XTib73wy174Zf8AJEsePtlPj10AAAAASUVORK5CYII=';
      await _find.helpers.fixImageTemplateScale(TINY_PNG, {
        defaultImageTemplateScale: 4.0,
        fixImageTemplateScale: true,
        xScale: 1.5,
        yScale: 1.5
      }).should.eventually.eql(actual);
    });
    it('should not fix template size scale with default scale and image scale', async function () {
      const actual = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVR4AaXBPUsrQQCG0SeX+cBdkTjwTpG1NPgLpjY/fW1stt4UYmm2cJqwMCsaw70uJJ3CBc9Z/P3Cl+12S9u2tG1L27bEGLm/v2ez2bDZbJDEd/7wS4YT7z3X19fc3Nxwd3dHXdd47xnHkefnZ8ZxpKoq6rqmqiqMMcwMJ1VV0TQN0zThnOPj44O6rsk503UdkmiahqZpWK1WGGOYGU7quqZpGqy1SCLnTM6Z19dXcs5IYpomrLVI4uLigpnhpKoqVqsVkjgcDjw9PdF1HTlnuq5DEs45JHE4HDgznByPR97e3pimiVIK4zhyPB7x3hNCIITA5eUl3nsWiwVnhpNSCsMwsNvtGIaB/X5PKQVJpJSQxHq9RhLOOc4MJ9M0sdvt2G639H3PTBIxRiQhCUnEGLHWcmY4KaUwDAN93/P4+MhyuSSlhCRSSkjCOYe1FmstZ6bve2YvLy/s93tmy+USSUhCEpIIIfAd8/DwwOz9/Z1SCpJIKSGJ9XqNJJxz/MS0bcvs6uoKScQYkYQkJBFjxFrLT0zbtsxub29JKSGJlBKScM5hrcVay09MzplZjJHPz0+894QQCCHwP/7wS/8A4e6nAg+R8LwAAAAASUVORK5CYII=';
      await _find.helpers.fixImageTemplateScale(TINY_PNG, {
        defaultImageTemplateScale: 4.0,
        fixImageTemplateScale: false,
        xScale: 1.5,
        yScale: 1.5
      }).should.eventually.eql(actual);
    });
    it('should not fix template size scale because of ignoreDefaultImageTemplateScale', async function () {
      await _find.helpers.fixImageTemplateScale(TINY_PNG, {
        defaultImageTemplateScale: 4.0,
        ignoreDefaultImageTemplateScale: true
      }).should.eventually.eql(TINY_PNG);
    });
    it('should ignore defaultImageTemplateScale to fix template size scale because of ignoreDefaultImageTemplateScale', async function () {
      const actual = 'iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAWElEQVR4AU3BQRWAQAhAwa/PGBsEgrC16AFBKEIPXW7OXO+Rmey9iQjMjHFzrLUwM7qbqmLcHKpKRFBVuDvj4agq3B1VRUQYT2bS3QwRQVUZF/CaGRHB3wc1vSZbHO5+BgAAAABJRU5ErkJggg==';
      await _find.helpers.fixImageTemplateScale(TINY_PNG, {
        defaultImageTemplateScale: 4.0,
        ignoreDefaultImageTemplateScale: true,
        fixImageTemplateScale: true,
        xScale: 1.5,
        yScale: 1.5
      }).should.eventually.eql(actual);
    });
  });
  describe('ensureTemplateSize', function () {
    it('should not resize the template if it is smaller than the screen', async function () {
      const screen = TINY_PNG_DIMS.map(n => n * 2);
      const d = new TestDriver();
      await d.ensureTemplateSize(TINY_PNG, ...screen).should.eventually.eql(TINY_PNG);
    });
    it('should not resize the template if it is the same size as the screen', async function () {
      const d = new TestDriver();
      await d.ensureTemplateSize(TINY_PNG, ...TINY_PNG_DIMS).should.eventually.eql(TINY_PNG);
    });
    it('should resize the template if it is bigger than the screen', async function () {
      const d = new TestDriver();
      const screen = TINY_PNG_DIMS.map(n => n / 2);
      const newTemplate = await d.ensureTemplateSize(TINY_PNG, ...screen);
      newTemplate.should.not.eql(TINY_PNG);
      newTemplate.length.should.be.below(TINY_PNG.length);
    });
  });
  describe('getScreenshotForImageFind', function () {
    it('should fail if driver does not support getScreenshot', async function () {
      const d = new _.BaseDriver();
      await d.getScreenshotForImageFind().should.eventually.be.rejectedWith(/driver does not support/);
    });
    it('should not adjust or verify screenshot if asked not to by settings', async function () {
      const d = new TestDriver();

      _sinon.default.stub(d, 'getScreenshot').returns(TINY_PNG);

      d.settings.update({
        fixImageFindScreenshotDims: false
      });
      const screen = TINY_PNG_DIMS.map(n => n + 1);
      const {
        b64Screenshot,
        scale
      } = await d.getScreenshotForImageFind(...screen);
      b64Screenshot.should.eql(TINY_PNG);
      should.equal(scale, undefined);
    });
    it('should return screenshot without adjustment if it matches screen size', async function () {
      const d = new TestDriver();

      _sinon.default.stub(d, 'getScreenshot').returns(TINY_PNG);

      const {
        b64Screenshot,
        scale
      } = await d.getScreenshotForImageFind(...TINY_PNG_DIMS);
      b64Screenshot.should.eql(TINY_PNG);
      should.equal(scale, undefined);
    });
    it('should return scaled screenshot with same aspect ratio if matching screen aspect ratio', async function () {
      const d = new TestDriver();

      _sinon.default.stub(d, 'getScreenshot').returns(TINY_PNG);

      const screen = TINY_PNG_DIMS.map(n => n * 1.5);
      const {
        b64Screenshot,
        scale
      } = await d.getScreenshotForImageFind(...screen);
      b64Screenshot.should.not.eql(TINY_PNG);
      const screenshotObj = await _appiumSupport.imageUtil.getJimpImage(b64Screenshot);
      screenshotObj.bitmap.width.should.eql(screen[0]);
      screenshotObj.bitmap.height.should.eql(screen[1]);
      scale.should.eql({
        xScale: 1.5,
        yScale: 1.5
      });
    });
    it('should return scaled screenshot with different aspect ratio if not matching screen aspect ratio', async function () {
      const d = new TestDriver();

      _sinon.default.stub(d, 'getScreenshot').returns(TINY_PNG);

      let screen = [TINY_PNG_DIMS[0] * 2, TINY_PNG_DIMS[1] * 3];
      let expectedScale = {
        xScale: 2.67,
        yScale: 4
      };
      const {
        b64Screenshot,
        scale
      } = await d.getScreenshotForImageFind(...screen);
      b64Screenshot.should.not.eql(TINY_PNG);
      let screenshotObj = await _appiumSupport.imageUtil.getJimpImage(b64Screenshot);
      screenshotObj.bitmap.width.should.eql(screen[0]);
      screenshotObj.bitmap.height.should.eql(screen[1]);
      scale.xScale.toFixed(2).should.eql(expectedScale.xScale.toString());
      scale.yScale.should.eql(expectedScale.yScale);
      screen = [TINY_PNG_DIMS[0] * 3, TINY_PNG_DIMS[1] * 2];
      expectedScale = {
        xScale: 4,
        yScale: 2.67
      };
      const {
        b64Screenshot: newScreen,
        scale: newScale
      } = await d.getScreenshotForImageFind(...screen);
      newScreen.should.not.eql(TINY_PNG);
      screenshotObj = await _appiumSupport.imageUtil.getJimpImage(newScreen);
      screenshotObj.bitmap.width.should.eql(screen[0]);
      screenshotObj.bitmap.height.should.eql(screen[1]);
      newScale.xScale.should.eql(expectedScale.xScale);
      newScale.yScale.toFixed(2).should.eql(expectedScale.yScale.toString());
    });
    it('should return scaled screenshot with different aspect ratio if not matching screen aspect ratio with fixImageTemplateScale', async function () {
      const d = new TestDriver();

      _sinon.default.stub(d, 'getScreenshot').returns(TINY_PNG);

      let screen = [TINY_PNG_DIMS[0] * 2, TINY_PNG_DIMS[1] * 3];
      let expectedScale = {
        xScale: 2.67,
        yScale: 4
      };
      const {
        b64Screenshot,
        scale
      } = await d.getScreenshotForImageFind(...screen);
      b64Screenshot.should.not.eql(TINY_PNG);
      let screenshotObj = await _appiumSupport.imageUtil.getJimpImage(b64Screenshot);
      screenshotObj.bitmap.width.should.eql(screen[0]);
      screenshotObj.bitmap.height.should.eql(screen[1]);
      scale.xScale.toFixed(2).should.eql(expectedScale.xScale.toString());
      scale.yScale.should.eql(expectedScale.yScale);
      await _find.helpers.fixImageTemplateScale(b64Screenshot, {
        fixImageTemplateScale: true,
        scale
      }).should.eventually.eql('iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAJ0lEQVR4AYXBAQEAIACDMKR/p0fTBrKdbZcPCRIkSJAgQYIECRIkPAzBA1TpeNwZAAAAAElFTkSuQmCC');
      screen = [TINY_PNG_DIMS[0] * 3, TINY_PNG_DIMS[1] * 2];
      expectedScale = {
        xScale: 4,
        yScale: 2.67
      };
      const {
        b64Screenshot: newScreen,
        scale: newScale
      } = await d.getScreenshotForImageFind(...screen);
      newScreen.should.not.eql(TINY_PNG);
      screenshotObj = await _appiumSupport.imageUtil.getJimpImage(newScreen);
      screenshotObj.bitmap.width.should.eql(screen[0]);
      screenshotObj.bitmap.height.should.eql(screen[1]);
      newScale.xScale.should.eql(expectedScale.xScale);
      newScale.yScale.toFixed(2).should.eql(expectedScale.yScale.toString());
      await _find.helpers.fixImageTemplateScale(newScreen, {
        fixImageTemplateScale: true,
        scale
      }).should.eventually.eql('iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAYAAADN5B7xAAAAI0lEQVR4AZXBAQEAMAyDMI5/T5W2ayB5245AIokkkkgiiST6+W4DTLyo5PUAAAAASUVORK5CYII=');
    });
  });
});
describe('custom element finding plugins', function () {
  it('should find a single element using a custom finder', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = {
      f: CUSTOM_FIND_MODULE
    };
    await d.findElement(_find.CUSTOM_STRATEGY, 'f:foo').should.eventually.eql('bar');
  });
  it('should not require selector prefix if only one find plugin is registered', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = {
      f: CUSTOM_FIND_MODULE
    };
    await d.findElement(_find.CUSTOM_STRATEGY, 'foo').should.eventually.eql('bar');
  });
  it('should find multiple elements using a custom finder', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = {
      f: CUSTOM_FIND_MODULE
    };
    await d.findElements(_find.CUSTOM_STRATEGY, 'f:foos').should.eventually.eql(['baz1', 'baz2']);
  });
  it('should give a hint to the plugin about whether multiple are requested', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = {
      f: CUSTOM_FIND_MODULE
    };
    await d.findElement(_find.CUSTOM_STRATEGY, 'f:foos').should.eventually.eql('bar1');
  });
  it('should be able to use multiple find modules', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = {
      f: CUSTOM_FIND_MODULE,
      g: CUSTOM_FIND_MODULE
    };
    await d.findElement(_find.CUSTOM_STRATEGY, 'f:foo').should.eventually.eql('bar');
    await d.findElement(_find.CUSTOM_STRATEGY, 'g:foo').should.eventually.eql('bar');
  });
  it('should throw an error if customFindModules is not set', async function () {
    const d = new _.BaseDriver();
    await d.findElement(_find.CUSTOM_STRATEGY, 'f:foo').should.eventually.be.rejectedWith(/customFindModules/);
  });
  it('should throw an error if customFindModules is the wrong shape', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = CUSTOM_FIND_MODULE;
    await d.findElement(_find.CUSTOM_STRATEGY, 'f:foo').should.eventually.be.rejectedWith(/customFindModules/);
  });
  it('should throw an error if customFindModules is size > 1 and no selector prefix is used', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = {
      f: CUSTOM_FIND_MODULE,
      g: CUSTOM_FIND_MODULE
    };
    await d.findElement(_find.CUSTOM_STRATEGY, 'foo').should.eventually.be.rejectedWith(/multiple element finding/i);
  });
  it('should throw an error in attempt to use unregistered plugin', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = {
      f: CUSTOM_FIND_MODULE,
      g: CUSTOM_FIND_MODULE
    };
    await d.findElement(_find.CUSTOM_STRATEGY, 'z:foo').should.eventually.be.rejectedWith(/was not registered/);
  });
  it('should throw an error if plugin cannot be loaded', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = {
      f: './foo.js'
    };
    await d.findElement(_find.CUSTOM_STRATEGY, 'f:foo').should.eventually.be.rejectedWith(/could not load/i);
  });
  it('should throw an error if plugin is not the right shape', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = {
      f: BAD_CUSTOM_FIND_MODULE
    };
    await d.findElement(_find.CUSTOM_STRATEGY, 'f:foo').should.eventually.be.rejectedWith(/constructed correctly/i);
  });
  it('should pass on an error thrown by the finder itself', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = {
      f: CUSTOM_FIND_MODULE
    };
    await d.findElement(_find.CUSTOM_STRATEGY, 'f:error').should.eventually.be.rejectedWith(/plugin error/i);
  });
  it('should throw no such element error if element not found', async function () {
    const d = new _.BaseDriver();
    d.opts.customFindModules = {
      f: CUSTOM_FIND_MODULE
    };
    await d.findElement(_find.CUSTOM_STRATEGY, 'f:nope').should.eventually.be.rejectedWith(/could not be located/);
  });
});require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvYmFzZWRyaXZlci9jb21tYW5kcy9maW5kLXNwZWNzLmpzIl0sIm5hbWVzIjpbInNob3VsZCIsImNoYWkiLCJ1c2UiLCJjaGFpQXNQcm9taXNlZCIsIlRlc3REcml2ZXIiLCJCYXNlRHJpdmVyIiwiZ2V0V2luZG93U2l6ZSIsImdldFNjcmVlbnNob3QiLCJDVVNUT01fRklORF9NT0RVTEUiLCJwYXRoIiwicmVzb2x2ZSIsIl9fZGlybmFtZSIsIkJBRF9DVVNUT01fRklORF9NT0RVTEUiLCJUSU5ZX1BORyIsIlRJTllfUE5HX0RJTVMiLCJkZXNjcmliZSIsIml0IiwiZCIsInNpbm9uIiwic3R1YiIsInJldHVybnMiLCJmaW5kRWxlbWVudCIsIklNQUdFX1NUUkFURUdZIiwiZXZlbnR1YWxseSIsImJlIiwidHJ1ZSIsImZpbmRFbGVtZW50cyIsImZpbmRFbGVtZW50RnJvbUVsZW1lbnQiLCJyZWplY3RlZFdpdGgiLCJmaW5kRWxlbWVudHNGcm9tRWxlbWVudCIsInJlY3QiLCJ4IiwieSIsIndpZHRoIiwiaGVpZ2h0Iiwic2NvcmUiLCJzaXplIiwic2NyZWVuc2hvdCIsInRlbXBsYXRlIiwiYmFzaWNTdHViIiwiZHJpdmVyIiwic2l6ZVN0dWIiLCJzY3JlZW5TdHViIiwiY29tcGFyZVN0dWIiLCJiYXNpY0ltZ0VsVmVyaWZ5IiwiaW1nRWxQcm90byIsImltZ0VsSWQiLCJFTEVNRU5UIiwiX2ltZ0VsQ2FjaGUiLCJoYXMiLCJpbWdFbCIsImdldCIsIkltYWdlRWxlbWVudCIsImVxbCIsImZpbmRCeUltYWdlIiwibXVsdGlwbGUiLCJlbHMiLCJoYXZlIiwibGVuZ3RoIiwibmV3VGVtcGxhdGUiLCJzZXR0aW5ncyIsInVwZGF0ZSIsImZpeEltYWdlVGVtcGxhdGVTaXplIiwiYXJncyIsImZpeEltYWdlVGVtcGxhdGVTY2FsZSIsImNhbGxDb3VudCIsInRocm93cyIsIkVycm9yIiwic2V0SW1wbGljaXRXYWl0Iiwib25DYWxsIiwic2hvdWxkQ2hlY2tTdGFsZW5lc3MiLCJpZCIsImZhbHNlIiwiaGVscGVycyIsImFjdHVhbCIsInhTY2FsZSIsInlTY2FsZSIsImRlZmF1bHRJbWFnZVRlbXBsYXRlU2NhbGUiLCJpZ25vcmVEZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlIiwic2NyZWVuIiwibWFwIiwibiIsImVuc3VyZVRlbXBsYXRlU2l6ZSIsIm5vdCIsImJlbG93IiwiZ2V0U2NyZWVuc2hvdEZvckltYWdlRmluZCIsImZpeEltYWdlRmluZFNjcmVlbnNob3REaW1zIiwiYjY0U2NyZWVuc2hvdCIsInNjYWxlIiwiZXF1YWwiLCJ1bmRlZmluZWQiLCJzY3JlZW5zaG90T2JqIiwiaW1hZ2VVdGlsIiwiZ2V0SmltcEltYWdlIiwiYml0bWFwIiwiZXhwZWN0ZWRTY2FsZSIsInRvRml4ZWQiLCJ0b1N0cmluZyIsIm5ld1NjcmVlbiIsIm5ld1NjYWxlIiwib3B0cyIsImN1c3RvbUZpbmRNb2R1bGVzIiwiZiIsIkNVU1RPTV9TVFJBVEVHWSIsImciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUdBLE1BQU1BLE1BQU0sR0FBR0MsY0FBS0QsTUFBTCxFQUFmOztBQUNBQyxjQUFLQyxHQUFMLENBQVNDLHVCQUFUOztBQUdBLE1BQU1DLFVBQU4sU0FBeUJDLFlBQXpCLENBQW9DO0FBQ2YsUUFBYkMsYUFBYSxHQUFJLENBQUU7O0FBQ04sUUFBYkMsYUFBYSxHQUFJLENBQUU7O0FBRlM7O0FBS3BDLE1BQU1DLGtCQUFrQixHQUFHQyxjQUFLQyxPQUFMLENBQWFDLFNBQWIsRUFBd0IsSUFBeEIsRUFBOEIsSUFBOUIsRUFBb0MsSUFBcEMsRUFBMEMsSUFBMUMsRUFDekIsTUFEeUIsRUFDakIsWUFEaUIsRUFDSCxVQURHLEVBQ1MsdUJBRFQsQ0FBM0I7O0FBRUEsTUFBTUMsc0JBQXNCLEdBQUdILGNBQUtDLE9BQUwsQ0FBYUMsU0FBYixFQUF3QixJQUF4QixFQUE4QixJQUE5QixFQUFvQyxJQUFwQyxFQUEwQyxJQUExQyxFQUM3QixNQUQ2QixFQUNyQixZQURxQixFQUNQLFVBRE8sRUFDSywyQkFETCxDQUEvQjs7QUFHQSxNQUFNRSxRQUFRLEdBQUcsc3ZDQUFqQjtBQUNBLE1BQU1DLGFBQWEsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXRCO0FBRUFDLFFBQVEsQ0FBQywyQkFBRCxFQUE4QixZQUFZO0FBQ2hEQSxFQUFBQSxRQUFRLENBQUMsYUFBRCxFQUFnQixZQUFZO0FBQ2xDQyxJQUFBQSxFQUFFLENBQUMsZ0VBQUQsRUFBbUUsa0JBQWtCO0FBQ3JGLFlBQU1DLENBQUMsR0FBRyxJQUFJYixVQUFKLEVBQVY7O0FBQ0FjLHFCQUFNQyxJQUFOLENBQVdGLENBQVgsRUFBYyxhQUFkLEVBQTZCRyxPQUE3QixDQUFxQyxJQUFyQzs7QUFDQUYscUJBQU1DLElBQU4sQ0FBV0YsQ0FBWCxFQUFjLDJCQUFkLEVBQTJDRyxPQUEzQyxDQUFtRCxLQUFuRDs7QUFDQSxZQUFNSCxDQUFDLENBQUNJLFdBQUYsQ0FBY0Msb0JBQWQsRUFBOEIsS0FBOUIsRUFBcUN0QixNQUFyQyxDQUE0Q3VCLFVBQTVDLENBQXVEQyxFQUF2RCxDQUEwREMsSUFBaEU7QUFDQSxZQUFNUixDQUFDLENBQUNTLFlBQUYsQ0FBZUosb0JBQWYsRUFBK0IsS0FBL0IsRUFBc0N0QixNQUF0QyxDQUE2Q3VCLFVBQTdDLENBQXdEQyxFQUF4RCxDQUEyREMsSUFBakU7QUFDRCxLQU5DLENBQUY7QUFPQVQsSUFBQUEsRUFBRSxDQUFDLGlFQUFELEVBQW9FLGtCQUFrQjtBQUN0RixZQUFNQyxDQUFDLEdBQUcsSUFBSWIsVUFBSixFQUFWO0FBQ0EsWUFBTWEsQ0FBQyxDQUFDVSxzQkFBRixDQUF5Qkwsb0JBQXpCLEVBQXlDLEtBQXpDLEVBQWdELE1BQWhELEVBQ0h0QixNQURHLENBQ0l1QixVQURKLENBQ2VDLEVBRGYsQ0FDa0JJLFlBRGxCLENBQytCLG9DQUQvQixDQUFOO0FBRUEsWUFBTVgsQ0FBQyxDQUFDWSx1QkFBRixDQUEwQlAsb0JBQTFCLEVBQTBDLEtBQTFDLEVBQWlELE1BQWpELEVBQ0h0QixNQURHLENBQ0l1QixVQURKLENBQ2VDLEVBRGYsQ0FDa0JJLFlBRGxCLENBQytCLG9DQUQvQixDQUFOO0FBRUQsS0FOQyxDQUFGO0FBT0QsR0FmTyxDQUFSO0FBaUJBYixFQUFBQSxRQUFRLENBQUMsYUFBRCxFQUFnQixZQUFZO0FBQ2xDLFVBQU1lLElBQUksR0FBRztBQUFDQyxNQUFBQSxDQUFDLEVBQUUsRUFBSjtBQUFRQyxNQUFBQSxDQUFDLEVBQUUsRUFBWDtBQUFlQyxNQUFBQSxLQUFLLEVBQUUsRUFBdEI7QUFBMEJDLE1BQUFBLE1BQU0sRUFBRTtBQUFsQyxLQUFiO0FBQ0EsVUFBTUMsS0FBSyxHQUFHLEdBQWQ7QUFDQSxVQUFNQyxJQUFJLEdBQUc7QUFBQ0gsTUFBQUEsS0FBSyxFQUFFLEdBQVI7QUFBYUMsTUFBQUEsTUFBTSxFQUFFO0FBQXJCLEtBQWI7QUFDQSxVQUFNRyxVQUFVLEdBQUcsVUFBbkI7QUFDQSxVQUFNQyxRQUFRLEdBQUcsVUFBakI7O0FBRUEsYUFBU0MsU0FBVCxDQUFvQkMsTUFBcEIsRUFBNEI7QUFDMUIsWUFBTUMsUUFBUSxHQUFHdkIsZUFBTUMsSUFBTixDQUFXcUIsTUFBWCxFQUFtQixlQUFuQixFQUFvQ3BCLE9BQXBDLENBQTRDZ0IsSUFBNUMsQ0FBakI7O0FBQ0EsWUFBTU0sVUFBVSxHQUFHeEIsZUFBTUMsSUFBTixDQUFXcUIsTUFBWCxFQUFtQiwyQkFBbkIsRUFBZ0RwQixPQUFoRCxDQUF3RGlCLFVBQXhELENBQW5COztBQUNBLFlBQU1NLFdBQVcsR0FBR3pCLGVBQU1DLElBQU4sQ0FBV3FCLE1BQVgsRUFBbUIsZUFBbkIsRUFBb0NwQixPQUFwQyxDQUE0QztBQUFDVSxRQUFBQSxJQUFEO0FBQU9LLFFBQUFBO0FBQVAsT0FBNUMsQ0FBcEI7O0FBQ0EsYUFBTztBQUFDTSxRQUFBQSxRQUFEO0FBQVdDLFFBQUFBLFVBQVg7QUFBdUJDLFFBQUFBO0FBQXZCLE9BQVA7QUFDRDs7QUFFRCxhQUFTQyxnQkFBVCxDQUEyQkMsVUFBM0IsRUFBdUNMLE1BQXZDLEVBQStDO0FBQzdDLFlBQU1NLE9BQU8sR0FBR0QsVUFBVSxDQUFDRSxPQUEzQjtBQUNBUCxNQUFBQSxNQUFNLENBQUNRLFdBQVAsQ0FBbUJDLEdBQW5CLENBQXVCSCxPQUF2QixFQUFnQzlDLE1BQWhDLENBQXVDd0IsRUFBdkMsQ0FBMENDLElBQTFDOztBQUNBLFlBQU15QixLQUFLLEdBQUdWLE1BQU0sQ0FBQ1EsV0FBUCxDQUFtQkcsR0FBbkIsQ0FBdUJMLE9BQXZCLENBQWQ7O0FBQ0EsT0FBQ0ksS0FBSyxZQUFZRSxjQUFsQixFQUFnQ3BELE1BQWhDLENBQXVDd0IsRUFBdkMsQ0FBMENDLElBQTFDO0FBQ0F5QixNQUFBQSxLQUFLLENBQUNwQixJQUFOLENBQVc5QixNQUFYLENBQWtCcUQsR0FBbEIsQ0FBc0J2QixJQUF0QjtBQUNBb0IsTUFBQUEsS0FBSyxDQUFDZixLQUFOLENBQVluQyxNQUFaLENBQW1CcUQsR0FBbkIsQ0FBdUJsQixLQUF2QjtBQUNBLGFBQU9lLEtBQVA7QUFDRDs7QUFFRGxDLElBQUFBLEVBQUUsQ0FBQyx3Q0FBRCxFQUEyQyxrQkFBa0I7QUFDN0QsWUFBTUMsQ0FBQyxHQUFHLElBQUliLFVBQUosRUFBVjtBQUNBbUMsTUFBQUEsU0FBUyxDQUFDdEIsQ0FBRCxDQUFUO0FBQ0EsWUFBTTRCLFVBQVUsR0FBRyxNQUFNNUIsQ0FBQyxDQUFDcUMsV0FBRixDQUFjaEIsUUFBZCxFQUF3QjtBQUFDaUIsUUFBQUEsUUFBUSxFQUFFO0FBQVgsT0FBeEIsQ0FBekI7QUFDQVgsTUFBQUEsZ0JBQWdCLENBQUNDLFVBQUQsRUFBYTVCLENBQWIsQ0FBaEI7QUFDRCxLQUxDLENBQUY7QUFNQUQsSUFBQUEsRUFBRSxDQUFDLHNDQUFELEVBQXlDLGtCQUFrQjtBQUMzRCxZQUFNQyxDQUFDLEdBQUcsSUFBSWIsVUFBSixFQUFWO0FBQ0EsWUFBTTtBQUFDdUMsUUFBQUE7QUFBRCxVQUFnQkosU0FBUyxDQUFDdEIsQ0FBRCxDQUEvQjtBQUNBMEIsTUFBQUEsV0FBVyxDQUFDdkIsT0FBWixDQUFvQixDQUFDO0FBQUNVLFFBQUFBLElBQUQ7QUFBT0ssUUFBQUE7QUFBUCxPQUFELENBQXBCO0FBRUEsWUFBTXFCLEdBQUcsR0FBRyxNQUFNdkMsQ0FBQyxDQUFDcUMsV0FBRixDQUFjaEIsUUFBZCxFQUF3QjtBQUFDaUIsUUFBQUEsUUFBUSxFQUFFO0FBQVgsT0FBeEIsQ0FBbEI7QUFDQUMsTUFBQUEsR0FBRyxDQUFDeEQsTUFBSixDQUFXeUQsSUFBWCxDQUFnQkMsTUFBaEIsQ0FBdUIsQ0FBdkI7QUFDQWQsTUFBQUEsZ0JBQWdCLENBQUNZLEdBQUcsQ0FBQyxDQUFELENBQUosRUFBU3ZDLENBQVQsQ0FBaEI7QUFDRCxLQVJDLENBQUY7QUFTQUQsSUFBQUEsRUFBRSxDQUFDLHNEQUFELEVBQXlELGtCQUFrQjtBQUMzRSxZQUFNQyxDQUFDLEdBQUcsSUFBSVosWUFBSixFQUFWO0FBQ0EsWUFBTVksQ0FBQyxDQUFDcUMsV0FBRixDQUFjaEIsUUFBZCxFQUF3QjtBQUFDaUIsUUFBQUEsUUFBUSxFQUFFO0FBQVgsT0FBeEIsRUFDSHZELE1BREcsQ0FDSXVCLFVBREosQ0FDZUMsRUFEZixDQUNrQkksWUFEbEIsQ0FDK0IseUJBRC9CLENBQU47QUFFRCxLQUpDLENBQUY7QUFLQVosSUFBQUEsRUFBRSxDQUFDLHVDQUFELEVBQTBDLGtCQUFrQjtBQUM1RCxZQUFNQyxDQUFDLEdBQUcsSUFBSWIsVUFBSixFQUFWO0FBQ0EsWUFBTXVELFdBQVcsR0FBRyxVQUFwQjtBQUNBLFlBQU07QUFBQ2hCLFFBQUFBO0FBQUQsVUFBZ0JKLFNBQVMsQ0FBQ3RCLENBQUQsQ0FBL0I7QUFDQSxZQUFNQSxDQUFDLENBQUMyQyxRQUFGLENBQVdDLE1BQVgsQ0FBa0I7QUFBQ0MsUUFBQUEsb0JBQW9CLEVBQUU7QUFBdkIsT0FBbEIsQ0FBTjs7QUFDQTVDLHFCQUFNQyxJQUFOLENBQVdGLENBQVgsRUFBYyxvQkFBZCxFQUFvQ0csT0FBcEMsQ0FBNEN1QyxXQUE1Qzs7QUFDQSxZQUFNZCxVQUFVLEdBQUcsTUFBTTVCLENBQUMsQ0FBQ3FDLFdBQUYsQ0FBY2hCLFFBQWQsRUFBd0I7QUFBQ2lCLFFBQUFBLFFBQVEsRUFBRTtBQUFYLE9BQXhCLENBQXpCO0FBQ0EsWUFBTUwsS0FBSyxHQUFHTixnQkFBZ0IsQ0FBQ0MsVUFBRCxFQUFhNUIsQ0FBYixDQUE5QjtBQUNBaUMsTUFBQUEsS0FBSyxDQUFDWixRQUFOLENBQWV0QyxNQUFmLENBQXNCcUQsR0FBdEIsQ0FBMEJNLFdBQTFCO0FBQ0FoQixNQUFBQSxXQUFXLENBQUNvQixJQUFaLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLEVBQXVCL0QsTUFBdkIsQ0FBOEJxRCxHQUE5QixDQUFrQ00sV0FBbEM7QUFDRCxLQVZDLENBQUY7QUFZQTNDLElBQUFBLEVBQUUsQ0FBQyw2Q0FBRCxFQUFnRCxrQkFBa0I7QUFDbEUsWUFBTUMsQ0FBQyxHQUFHLElBQUliLFVBQUosRUFBVjtBQUNBLFlBQU11RCxXQUFXLEdBQUcsVUFBcEI7QUFDQSxZQUFNO0FBQUNoQixRQUFBQTtBQUFELFVBQWdCSixTQUFTLENBQUN0QixDQUFELENBQS9CO0FBQ0EsWUFBTUEsQ0FBQyxDQUFDMkMsUUFBRixDQUFXQyxNQUFYLENBQWtCO0FBQUNHLFFBQUFBLHFCQUFxQixFQUFFO0FBQXhCLE9BQWxCLENBQU47O0FBQ0E5QyxxQkFBTUMsSUFBTixDQUFXRixDQUFYLEVBQWMsdUJBQWQsRUFBdUNHLE9BQXZDLENBQStDdUMsV0FBL0M7O0FBQ0EsWUFBTWQsVUFBVSxHQUFHLE1BQU01QixDQUFDLENBQUNxQyxXQUFGLENBQWNoQixRQUFkLEVBQXdCO0FBQUNpQixRQUFBQSxRQUFRLEVBQUU7QUFBWCxPQUF4QixDQUF6QjtBQUNBLFlBQU1MLEtBQUssR0FBR04sZ0JBQWdCLENBQUNDLFVBQUQsRUFBYTVCLENBQWIsQ0FBOUI7QUFDQWlDLE1BQUFBLEtBQUssQ0FBQ1osUUFBTixDQUFldEMsTUFBZixDQUFzQnFELEdBQXRCLENBQTBCTSxXQUExQjtBQUNBaEIsTUFBQUEsV0FBVyxDQUFDb0IsSUFBWixDQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1Qi9ELE1BQXZCLENBQThCcUQsR0FBOUIsQ0FBa0NNLFdBQWxDO0FBQ0QsS0FWQyxDQUFGO0FBV0EzQyxJQUFBQSxFQUFFLENBQUMsMkRBQUQsRUFBOEQsa0JBQWtCO0FBQ2hGLFlBQU1DLENBQUMsR0FBRyxJQUFJYixVQUFKLEVBQVY7QUFDQSxZQUFNdUQsV0FBVyxHQUFHLFVBQXBCO0FBQ0FwQixNQUFBQSxTQUFTLENBQUN0QixDQUFELENBQVQ7QUFDQSxZQUFNQSxDQUFDLENBQUMyQyxRQUFGLENBQVdDLE1BQVgsQ0FBa0IsRUFBbEIsQ0FBTjs7QUFDQTNDLHFCQUFNQyxJQUFOLENBQVdGLENBQVgsRUFBYyx1QkFBZCxFQUF1Q0csT0FBdkMsQ0FBK0N1QyxXQUEvQzs7QUFDQTFDLE1BQUFBLENBQUMsQ0FBQytDLHFCQUFGLENBQXdCQyxTQUF4QixDQUFrQ2pFLE1BQWxDLENBQXlDcUQsR0FBekMsQ0FBNkMsQ0FBN0M7QUFDRCxLQVBDLENBQUY7QUFTQXJDLElBQUFBLEVBQUUsQ0FBQywrQ0FBRCxFQUFrRCxrQkFBa0I7QUFDcEUsWUFBTUMsQ0FBQyxHQUFHLElBQUliLFVBQUosRUFBVjtBQUNBLFlBQU07QUFBQ3VDLFFBQUFBO0FBQUQsVUFBZ0JKLFNBQVMsQ0FBQ3RCLENBQUQsQ0FBL0I7QUFDQTBCLE1BQUFBLFdBQVcsQ0FBQ3VCLE1BQVosQ0FBbUIsSUFBSUMsS0FBSixDQUFVLDZCQUFWLENBQW5CO0FBQ0EsWUFBTWxELENBQUMsQ0FBQ3FDLFdBQUYsQ0FBY2hCLFFBQWQsRUFBd0I7QUFBQ2lCLFFBQUFBLFFBQVEsRUFBRTtBQUFYLE9BQXhCLEVBQ0h2RCxNQURHLENBQ0l1QixVQURKLENBQ2VDLEVBRGYsQ0FDa0JJLFlBRGxCLENBQytCLDhCQUQvQixDQUFOO0FBRUQsS0FOQyxDQUFGO0FBT0FaLElBQUFBLEVBQUUsQ0FBQyx5RUFBRCxFQUE0RSxrQkFBa0I7QUFDOUYsWUFBTUMsQ0FBQyxHQUFHLElBQUliLFVBQUosRUFBVjtBQUNBLFlBQU07QUFBQ3VDLFFBQUFBO0FBQUQsVUFBZ0JKLFNBQVMsQ0FBQ3RCLENBQUQsQ0FBL0I7QUFDQTBCLE1BQUFBLFdBQVcsQ0FBQ3VCLE1BQVosQ0FBbUIsSUFBSUMsS0FBSixDQUFVLDZCQUFWLENBQW5CO0FBQ0EsWUFBTWxELENBQUMsQ0FBQ3FDLFdBQUYsQ0FBY2hCLFFBQWQsRUFBd0I7QUFBQ2lCLFFBQUFBLFFBQVEsRUFBRTtBQUFYLE9BQXhCLEVBQTBDdkQsTUFBMUMsQ0FBaUR1QixVQUFqRCxDQUE0RDhCLEdBQTVELENBQWdFLEVBQWhFLENBQU47QUFDRCxLQUxDLENBQUY7QUFNQXJDLElBQUFBLEVBQUUsQ0FBQyw4QkFBRCxFQUFpQyxrQkFBa0I7QUFDbkQsWUFBTUMsQ0FBQyxHQUFHLElBQUliLFVBQUosRUFBVjtBQUNBYSxNQUFBQSxDQUFDLENBQUNtRCxlQUFGLENBQWtCLEVBQWxCO0FBQ0EsWUFBTTtBQUFDekIsUUFBQUE7QUFBRCxVQUFnQkosU0FBUyxDQUFDdEIsQ0FBRCxDQUEvQjtBQUNBMEIsTUFBQUEsV0FBVyxDQUFDMEIsTUFBWixDQUFtQixDQUFuQixFQUFzQkgsTUFBdEIsQ0FBNkIsSUFBSUMsS0FBSixDQUFVLDZCQUFWLENBQTdCO0FBQ0EsWUFBTXRCLFVBQVUsR0FBRyxNQUFNNUIsQ0FBQyxDQUFDcUMsV0FBRixDQUFjaEIsUUFBZCxFQUF3QjtBQUFDaUIsUUFBQUEsUUFBUSxFQUFFO0FBQVgsT0FBeEIsQ0FBekI7QUFDQVgsTUFBQUEsZ0JBQWdCLENBQUNDLFVBQUQsRUFBYTVCLENBQWIsQ0FBaEI7QUFDQTBCLE1BQUFBLFdBQVcsQ0FBQ3NCLFNBQVosQ0FBc0JqRSxNQUF0QixDQUE2QnFELEdBQTdCLENBQWlDLENBQWpDO0FBQ0QsS0FSQyxDQUFGO0FBU0FyQyxJQUFBQSxFQUFFLENBQUMsZ0ZBQUQsRUFBbUYsa0JBQWtCO0FBQ3JHLFlBQU1DLENBQUMsR0FBRyxJQUFJYixVQUFKLEVBQVY7QUFDQW1DLE1BQUFBLFNBQVMsQ0FBQ3RCLENBQUQsQ0FBVDtBQUNBLFlBQU1pQyxLQUFLLEdBQUcsTUFBTWpDLENBQUMsQ0FBQ3FDLFdBQUYsQ0FBY2hCLFFBQWQsRUFBd0I7QUFBQ2lCLFFBQUFBLFFBQVEsRUFBRSxLQUFYO0FBQWtCZSxRQUFBQSxvQkFBb0IsRUFBRTtBQUF4QyxPQUF4QixDQUFwQjtBQUNBLE9BQUNwQixLQUFLLFlBQVlFLGNBQWxCLEVBQWdDcEQsTUFBaEMsQ0FBdUN3QixFQUF2QyxDQUEwQ0MsSUFBMUM7QUFDQVIsTUFBQUEsQ0FBQyxDQUFDK0IsV0FBRixDQUFjQyxHQUFkLENBQWtCQyxLQUFLLENBQUNxQixFQUF4QixFQUE0QnZFLE1BQTVCLENBQW1Dd0IsRUFBbkMsQ0FBc0NnRCxLQUF0QztBQUNBdEIsTUFBQUEsS0FBSyxDQUFDcEIsSUFBTixDQUFXOUIsTUFBWCxDQUFrQnFELEdBQWxCLENBQXNCdkIsSUFBdEI7QUFDRCxLQVBDLENBQUY7QUFRRCxHQTFHTyxDQUFSO0FBNEdBZixFQUFBQSxRQUFRLENBQUMsdUJBQUQsRUFBMEIsWUFBWTtBQUM1Q0MsSUFBQUEsRUFBRSxDQUFDLHNEQUFELEVBQXlELGtCQUFrQjtBQUMzRSxZQUFNMkMsV0FBVyxHQUFHLFVBQXBCO0FBQ0EsWUFBTWMsY0FBUVQscUJBQVIsQ0FBOEJMLFdBQTlCLEVBQTJDO0FBQUNLLFFBQUFBLHFCQUFxQixFQUFFO0FBQXhCLE9BQTNDLEVBQ0hoRSxNQURHLENBQ0l1QixVQURKLENBQ2U4QixHQURmLENBQ21CTSxXQURuQixDQUFOO0FBRUQsS0FKQyxDQUFGO0FBTUEzQyxJQUFBQSxFQUFFLENBQUMsa0RBQUQsRUFBcUQsa0JBQWtCO0FBQ3ZFLFlBQU0yQyxXQUFXLEdBQUcsVUFBcEI7QUFDQSxZQUFNYyxjQUFRVCxxQkFBUixDQUE4QkwsV0FBOUIsRUFBMkMsSUFBM0MsRUFDSDNELE1BREcsQ0FDSXVCLFVBREosQ0FDZThCLEdBRGYsQ0FDbUJNLFdBRG5CLENBQU47QUFFRCxLQUpDLENBQUY7QUFNQTNDLElBQUFBLEVBQUUsQ0FBQyx3REFBRCxFQUEyRCxrQkFBa0I7QUFDN0UsWUFBTTJDLFdBQVcsR0FBRyxVQUFwQjtBQUNBLFlBQU1jLGNBQVFULHFCQUFSLENBQThCTCxXQUE5QixFQUEyQyxhQUEzQyxFQUNIM0QsTUFERyxDQUNJdUIsVUFESixDQUNlOEIsR0FEZixDQUNtQk0sV0FEbkIsQ0FBTjtBQUVELEtBSkMsQ0FBRjtBQU1BM0MsSUFBQUEsRUFBRSxDQUFDLGdDQUFELEVBQW1DLGtCQUFrQjtBQUNyRCxZQUFNMEQsTUFBTSxHQUFHLHNNQUFmO0FBQ0EsWUFBTUQsY0FBUVQscUJBQVIsQ0FBOEJuRCxRQUE5QixFQUF3QztBQUM1Q21ELFFBQUFBLHFCQUFxQixFQUFFLElBRHFCO0FBQ2ZXLFFBQUFBLE1BQU0sRUFBRSxHQURPO0FBQ0ZDLFFBQUFBLE1BQU0sRUFBRTtBQUROLE9BQXhDLEVBRUg1RSxNQUZHLENBRUl1QixVQUZKLENBRWU4QixHQUZmLENBRW1CcUIsTUFGbkIsQ0FBTjtBQUdELEtBTEMsQ0FBRjtBQU9BMUQsSUFBQUEsRUFBRSxDQUFDLDhFQUFELEVBQWlGLGtCQUFrQjtBQUNuRyxZQUFNeUQsY0FBUVQscUJBQVIsQ0FBOEJuRCxRQUE5QixFQUF3QztBQUM1Q21ELFFBQUFBLHFCQUFxQixFQUFFLEtBRHFCO0FBQ2RXLFFBQUFBLE1BQU0sRUFBRSxHQURNO0FBQ0RDLFFBQUFBLE1BQU0sRUFBRTtBQURQLE9BQXhDLEVBRUg1RSxNQUZHLENBRUl1QixVQUZKLENBRWU4QixHQUZmLENBRW1CeEMsUUFGbkIsQ0FBTjtBQUdELEtBSkMsQ0FBRjtBQU1BRyxJQUFBQSxFQUFFLENBQUMsbURBQUQsRUFBc0Qsa0JBQWtCO0FBQ3hFLFlBQU0wRCxNQUFNLEdBQUcsc3FCQUFmO0FBQ0EsWUFBTUQsY0FBUVQscUJBQVIsQ0FBOEJuRCxRQUE5QixFQUF3QztBQUM1Q2dFLFFBQUFBLHlCQUF5QixFQUFFO0FBRGlCLE9BQXhDLEVBRUg3RSxNQUZHLENBRUl1QixVQUZKLENBRWU4QixHQUZmLENBRW1CcUIsTUFGbkIsQ0FBTjtBQUdELEtBTEMsQ0FBRjtBQU9BMUQsSUFBQUEsRUFBRSxDQUFDLG1FQUFELEVBQXNFLGtCQUFrQjtBQUN4RixZQUFNMEQsTUFBTSxHQUFHLHM0QkFBZjtBQUNBLFlBQU1ELGNBQVFULHFCQUFSLENBQThCbkQsUUFBOUIsRUFBd0M7QUFDNUNnRSxRQUFBQSx5QkFBeUIsRUFBRSxHQURpQjtBQUU1Q2IsUUFBQUEscUJBQXFCLEVBQUUsSUFGcUI7QUFHNUNXLFFBQUFBLE1BQU0sRUFBRSxHQUhvQztBQUcvQkMsUUFBQUEsTUFBTSxFQUFFO0FBSHVCLE9BQXhDLEVBSUg1RSxNQUpHLENBSUl1QixVQUpKLENBSWU4QixHQUpmLENBSW1CcUIsTUFKbkIsQ0FBTjtBQUtELEtBUEMsQ0FBRjtBQVNBMUQsSUFBQUEsRUFBRSxDQUFDLHVFQUFELEVBQTBFLGtCQUFrQjtBQUM1RixZQUFNMEQsTUFBTSxHQUFHLHNxQkFBZjtBQUNBLFlBQU1ELGNBQVFULHFCQUFSLENBQThCbkQsUUFBOUIsRUFBd0M7QUFDNUNnRSxRQUFBQSx5QkFBeUIsRUFBRSxHQURpQjtBQUU1Q2IsUUFBQUEscUJBQXFCLEVBQUUsS0FGcUI7QUFHNUNXLFFBQUFBLE1BQU0sRUFBRSxHQUhvQztBQUcvQkMsUUFBQUEsTUFBTSxFQUFFO0FBSHVCLE9BQXhDLEVBSUg1RSxNQUpHLENBSUl1QixVQUpKLENBSWU4QixHQUpmLENBSW1CcUIsTUFKbkIsQ0FBTjtBQUtELEtBUEMsQ0FBRjtBQVNBMUQsSUFBQUEsRUFBRSxDQUFDLCtFQUFELEVBQWtGLGtCQUFrQjtBQUNwRyxZQUFNeUQsY0FBUVQscUJBQVIsQ0FBOEJuRCxRQUE5QixFQUF3QztBQUM1Q2dFLFFBQUFBLHlCQUF5QixFQUFFLEdBRGlCO0FBRTVDQyxRQUFBQSwrQkFBK0IsRUFBRTtBQUZXLE9BQXhDLEVBR0g5RSxNQUhHLENBR0l1QixVQUhKLENBR2U4QixHQUhmLENBR21CeEMsUUFIbkIsQ0FBTjtBQUlELEtBTEMsQ0FBRjtBQU9BRyxJQUFBQSxFQUFFLENBQUMsK0dBQUQsRUFBa0gsa0JBQWtCO0FBQ3BJLFlBQU0wRCxNQUFNLEdBQUcsc01BQWY7QUFDQSxZQUFNRCxjQUFRVCxxQkFBUixDQUE4Qm5ELFFBQTlCLEVBQXdDO0FBQzVDZ0UsUUFBQUEseUJBQXlCLEVBQUUsR0FEaUI7QUFFNUNDLFFBQUFBLCtCQUErQixFQUFFLElBRlc7QUFHNUNkLFFBQUFBLHFCQUFxQixFQUFFLElBSHFCO0FBSTVDVyxRQUFBQSxNQUFNLEVBQUUsR0FKb0M7QUFJL0JDLFFBQUFBLE1BQU0sRUFBRTtBQUp1QixPQUF4QyxFQUtINUUsTUFMRyxDQUtJdUIsVUFMSixDQUtlOEIsR0FMZixDQUttQnFCLE1BTG5CLENBQU47QUFNRCxLQVJDLENBQUY7QUFTRCxHQXpFTyxDQUFSO0FBMkVBM0QsRUFBQUEsUUFBUSxDQUFDLG9CQUFELEVBQXVCLFlBQVk7QUFDekNDLElBQUFBLEVBQUUsQ0FBQyxpRUFBRCxFQUFvRSxrQkFBa0I7QUFDdEYsWUFBTStELE1BQU0sR0FBR2pFLGFBQWEsQ0FBQ2tFLEdBQWQsQ0FBbUJDLENBQUQsSUFBT0EsQ0FBQyxHQUFHLENBQTdCLENBQWY7QUFDQSxZQUFNaEUsQ0FBQyxHQUFHLElBQUliLFVBQUosRUFBVjtBQUNBLFlBQU1hLENBQUMsQ0FBQ2lFLGtCQUFGLENBQXFCckUsUUFBckIsRUFBK0IsR0FBR2tFLE1BQWxDLEVBQ0gvRSxNQURHLENBQ0l1QixVQURKLENBQ2U4QixHQURmLENBQ21CeEMsUUFEbkIsQ0FBTjtBQUVELEtBTEMsQ0FBRjtBQU1BRyxJQUFBQSxFQUFFLENBQUMscUVBQUQsRUFBd0Usa0JBQWtCO0FBQzFGLFlBQU1DLENBQUMsR0FBRyxJQUFJYixVQUFKLEVBQVY7QUFDQSxZQUFNYSxDQUFDLENBQUNpRSxrQkFBRixDQUFxQnJFLFFBQXJCLEVBQStCLEdBQUdDLGFBQWxDLEVBQ0hkLE1BREcsQ0FDSXVCLFVBREosQ0FDZThCLEdBRGYsQ0FDbUJ4QyxRQURuQixDQUFOO0FBRUQsS0FKQyxDQUFGO0FBS0FHLElBQUFBLEVBQUUsQ0FBQyw0REFBRCxFQUErRCxrQkFBa0I7QUFDakYsWUFBTUMsQ0FBQyxHQUFHLElBQUliLFVBQUosRUFBVjtBQUNBLFlBQU0yRSxNQUFNLEdBQUdqRSxhQUFhLENBQUNrRSxHQUFkLENBQW1CQyxDQUFELElBQU9BLENBQUMsR0FBRyxDQUE3QixDQUFmO0FBQ0EsWUFBTXRCLFdBQVcsR0FBRyxNQUFNMUMsQ0FBQyxDQUFDaUUsa0JBQUYsQ0FBcUJyRSxRQUFyQixFQUErQixHQUFHa0UsTUFBbEMsQ0FBMUI7QUFDQXBCLE1BQUFBLFdBQVcsQ0FBQzNELE1BQVosQ0FBbUJtRixHQUFuQixDQUF1QjlCLEdBQXZCLENBQTJCeEMsUUFBM0I7QUFDQThDLE1BQUFBLFdBQVcsQ0FBQ0QsTUFBWixDQUFtQjFELE1BQW5CLENBQTBCd0IsRUFBMUIsQ0FBNkI0RCxLQUE3QixDQUFtQ3ZFLFFBQVEsQ0FBQzZDLE1BQTVDO0FBQ0QsS0FOQyxDQUFGO0FBT0QsR0FuQk8sQ0FBUjtBQXFCQTNDLEVBQUFBLFFBQVEsQ0FBQywyQkFBRCxFQUE4QixZQUFZO0FBQ2hEQyxJQUFBQSxFQUFFLENBQUMsc0RBQUQsRUFBeUQsa0JBQWtCO0FBQzNFLFlBQU1DLENBQUMsR0FBRyxJQUFJWixZQUFKLEVBQVY7QUFDQSxZQUFNWSxDQUFDLENBQUNvRSx5QkFBRixHQUNIckYsTUFERyxDQUNJdUIsVUFESixDQUNlQyxFQURmLENBQ2tCSSxZQURsQixDQUMrQix5QkFEL0IsQ0FBTjtBQUVELEtBSkMsQ0FBRjtBQUtBWixJQUFBQSxFQUFFLENBQUMsb0VBQUQsRUFBdUUsa0JBQWtCO0FBQ3pGLFlBQU1DLENBQUMsR0FBRyxJQUFJYixVQUFKLEVBQVY7O0FBQ0FjLHFCQUFNQyxJQUFOLENBQVdGLENBQVgsRUFBYyxlQUFkLEVBQStCRyxPQUEvQixDQUF1Q1AsUUFBdkM7O0FBQ0FJLE1BQUFBLENBQUMsQ0FBQzJDLFFBQUYsQ0FBV0MsTUFBWCxDQUFrQjtBQUFDeUIsUUFBQUEsMEJBQTBCLEVBQUU7QUFBN0IsT0FBbEI7QUFDQSxZQUFNUCxNQUFNLEdBQUdqRSxhQUFhLENBQUNrRSxHQUFkLENBQW1CQyxDQUFELElBQU9BLENBQUMsR0FBRyxDQUE3QixDQUFmO0FBQ0EsWUFBTTtBQUFDTSxRQUFBQSxhQUFEO0FBQWdCQyxRQUFBQTtBQUFoQixVQUF5QixNQUFNdkUsQ0FBQyxDQUFDb0UseUJBQUYsQ0FBNEIsR0FBR04sTUFBL0IsQ0FBckM7QUFDQVEsTUFBQUEsYUFBYSxDQUFDdkYsTUFBZCxDQUFxQnFELEdBQXJCLENBQXlCeEMsUUFBekI7QUFDQWIsTUFBQUEsTUFBTSxDQUFDeUYsS0FBUCxDQUFhRCxLQUFiLEVBQW9CRSxTQUFwQjtBQUNELEtBUkMsQ0FBRjtBQVNBMUUsSUFBQUEsRUFBRSxDQUFDLHVFQUFELEVBQTBFLGtCQUFrQjtBQUM1RixZQUFNQyxDQUFDLEdBQUcsSUFBSWIsVUFBSixFQUFWOztBQUNBYyxxQkFBTUMsSUFBTixDQUFXRixDQUFYLEVBQWMsZUFBZCxFQUErQkcsT0FBL0IsQ0FBdUNQLFFBQXZDOztBQUNBLFlBQU07QUFBQzBFLFFBQUFBLGFBQUQ7QUFBZ0JDLFFBQUFBO0FBQWhCLFVBQXlCLE1BQU12RSxDQUFDLENBQUNvRSx5QkFBRixDQUE0QixHQUFHdkUsYUFBL0IsQ0FBckM7QUFDQXlFLE1BQUFBLGFBQWEsQ0FBQ3ZGLE1BQWQsQ0FBcUJxRCxHQUFyQixDQUF5QnhDLFFBQXpCO0FBQ0FiLE1BQUFBLE1BQU0sQ0FBQ3lGLEtBQVAsQ0FBYUQsS0FBYixFQUFvQkUsU0FBcEI7QUFDRCxLQU5DLENBQUY7QUFPQTFFLElBQUFBLEVBQUUsQ0FBQyx3RkFBRCxFQUEyRixrQkFBa0I7QUFDN0csWUFBTUMsQ0FBQyxHQUFHLElBQUliLFVBQUosRUFBVjs7QUFDQWMscUJBQU1DLElBQU4sQ0FBV0YsQ0FBWCxFQUFjLGVBQWQsRUFBK0JHLE9BQS9CLENBQXVDUCxRQUF2Qzs7QUFDQSxZQUFNa0UsTUFBTSxHQUFHakUsYUFBYSxDQUFDa0UsR0FBZCxDQUFtQkMsQ0FBRCxJQUFPQSxDQUFDLEdBQUcsR0FBN0IsQ0FBZjtBQUNBLFlBQU07QUFBQ00sUUFBQUEsYUFBRDtBQUFnQkMsUUFBQUE7QUFBaEIsVUFBeUIsTUFBTXZFLENBQUMsQ0FBQ29FLHlCQUFGLENBQTRCLEdBQUdOLE1BQS9CLENBQXJDO0FBQ0FRLE1BQUFBLGFBQWEsQ0FBQ3ZGLE1BQWQsQ0FBcUJtRixHQUFyQixDQUF5QjlCLEdBQXpCLENBQTZCeEMsUUFBN0I7QUFDQSxZQUFNOEUsYUFBYSxHQUFHLE1BQU1DLHlCQUFVQyxZQUFWLENBQXVCTixhQUF2QixDQUE1QjtBQUNBSSxNQUFBQSxhQUFhLENBQUNHLE1BQWQsQ0FBcUI3RCxLQUFyQixDQUEyQmpDLE1BQTNCLENBQWtDcUQsR0FBbEMsQ0FBc0MwQixNQUFNLENBQUMsQ0FBRCxDQUE1QztBQUNBWSxNQUFBQSxhQUFhLENBQUNHLE1BQWQsQ0FBcUI1RCxNQUFyQixDQUE0QmxDLE1BQTVCLENBQW1DcUQsR0FBbkMsQ0FBdUMwQixNQUFNLENBQUMsQ0FBRCxDQUE3QztBQUNBUyxNQUFBQSxLQUFLLENBQUN4RixNQUFOLENBQWFxRCxHQUFiLENBQWlCO0FBQUVzQixRQUFBQSxNQUFNLEVBQUUsR0FBVjtBQUFlQyxRQUFBQSxNQUFNLEVBQUU7QUFBdkIsT0FBakI7QUFDRCxLQVZDLENBQUY7QUFXQTVELElBQUFBLEVBQUUsQ0FBQyxpR0FBRCxFQUFvRyxrQkFBa0I7QUFDdEgsWUFBTUMsQ0FBQyxHQUFHLElBQUliLFVBQUosRUFBVjs7QUFDQWMscUJBQU1DLElBQU4sQ0FBV0YsQ0FBWCxFQUFjLGVBQWQsRUFBK0JHLE9BQS9CLENBQXVDUCxRQUF2Qzs7QUFHQSxVQUFJa0UsTUFBTSxHQUFHLENBQUNqRSxhQUFhLENBQUMsQ0FBRCxDQUFiLEdBQW1CLENBQXBCLEVBQXVCQSxhQUFhLENBQUMsQ0FBRCxDQUFiLEdBQW1CLENBQTFDLENBQWI7QUFDQSxVQUFJaUYsYUFBYSxHQUFHO0FBQUVwQixRQUFBQSxNQUFNLEVBQUUsSUFBVjtBQUFnQkMsUUFBQUEsTUFBTSxFQUFFO0FBQXhCLE9BQXBCO0FBRUEsWUFBTTtBQUFDVyxRQUFBQSxhQUFEO0FBQWdCQyxRQUFBQTtBQUFoQixVQUF5QixNQUFNdkUsQ0FBQyxDQUFDb0UseUJBQUYsQ0FBNEIsR0FBR04sTUFBL0IsQ0FBckM7QUFDQVEsTUFBQUEsYUFBYSxDQUFDdkYsTUFBZCxDQUFxQm1GLEdBQXJCLENBQXlCOUIsR0FBekIsQ0FBNkJ4QyxRQUE3QjtBQUNBLFVBQUk4RSxhQUFhLEdBQUcsTUFBTUMseUJBQVVDLFlBQVYsQ0FBdUJOLGFBQXZCLENBQTFCO0FBQ0FJLE1BQUFBLGFBQWEsQ0FBQ0csTUFBZCxDQUFxQjdELEtBQXJCLENBQTJCakMsTUFBM0IsQ0FBa0NxRCxHQUFsQyxDQUFzQzBCLE1BQU0sQ0FBQyxDQUFELENBQTVDO0FBQ0FZLE1BQUFBLGFBQWEsQ0FBQ0csTUFBZCxDQUFxQjVELE1BQXJCLENBQTRCbEMsTUFBNUIsQ0FBbUNxRCxHQUFuQyxDQUF1QzBCLE1BQU0sQ0FBQyxDQUFELENBQTdDO0FBQ0FTLE1BQUFBLEtBQUssQ0FBQ2IsTUFBTixDQUFhcUIsT0FBYixDQUFxQixDQUFyQixFQUF3QmhHLE1BQXhCLENBQStCcUQsR0FBL0IsQ0FBbUMwQyxhQUFhLENBQUNwQixNQUFkLENBQXFCc0IsUUFBckIsRUFBbkM7QUFDQVQsTUFBQUEsS0FBSyxDQUFDWixNQUFOLENBQWE1RSxNQUFiLENBQW9CcUQsR0FBcEIsQ0FBd0IwQyxhQUFhLENBQUNuQixNQUF0QztBQUdBRyxNQUFBQSxNQUFNLEdBQUcsQ0FBQ2pFLGFBQWEsQ0FBQyxDQUFELENBQWIsR0FBbUIsQ0FBcEIsRUFBdUJBLGFBQWEsQ0FBQyxDQUFELENBQWIsR0FBbUIsQ0FBMUMsQ0FBVDtBQUNBaUYsTUFBQUEsYUFBYSxHQUFHO0FBQUVwQixRQUFBQSxNQUFNLEVBQUUsQ0FBVjtBQUFhQyxRQUFBQSxNQUFNLEVBQUU7QUFBckIsT0FBaEI7QUFFQSxZQUFNO0FBQUNXLFFBQUFBLGFBQWEsRUFBRVcsU0FBaEI7QUFBMkJWLFFBQUFBLEtBQUssRUFBRVc7QUFBbEMsVUFBOEMsTUFBTWxGLENBQUMsQ0FBQ29FLHlCQUFGLENBQTRCLEdBQUdOLE1BQS9CLENBQTFEO0FBQ0FtQixNQUFBQSxTQUFTLENBQUNsRyxNQUFWLENBQWlCbUYsR0FBakIsQ0FBcUI5QixHQUFyQixDQUF5QnhDLFFBQXpCO0FBQ0E4RSxNQUFBQSxhQUFhLEdBQUcsTUFBTUMseUJBQVVDLFlBQVYsQ0FBdUJLLFNBQXZCLENBQXRCO0FBQ0FQLE1BQUFBLGFBQWEsQ0FBQ0csTUFBZCxDQUFxQjdELEtBQXJCLENBQTJCakMsTUFBM0IsQ0FBa0NxRCxHQUFsQyxDQUFzQzBCLE1BQU0sQ0FBQyxDQUFELENBQTVDO0FBQ0FZLE1BQUFBLGFBQWEsQ0FBQ0csTUFBZCxDQUFxQjVELE1BQXJCLENBQTRCbEMsTUFBNUIsQ0FBbUNxRCxHQUFuQyxDQUF1QzBCLE1BQU0sQ0FBQyxDQUFELENBQTdDO0FBQ0FvQixNQUFBQSxRQUFRLENBQUN4QixNQUFULENBQWdCM0UsTUFBaEIsQ0FBdUJxRCxHQUF2QixDQUEyQjBDLGFBQWEsQ0FBQ3BCLE1BQXpDO0FBQ0F3QixNQUFBQSxRQUFRLENBQUN2QixNQUFULENBQWdCb0IsT0FBaEIsQ0FBd0IsQ0FBeEIsRUFBMkJoRyxNQUEzQixDQUFrQ3FELEdBQWxDLENBQXNDMEMsYUFBYSxDQUFDbkIsTUFBZCxDQUFxQnFCLFFBQXJCLEVBQXRDO0FBQ0QsS0EzQkMsQ0FBRjtBQTZCQWpGLElBQUFBLEVBQUUsQ0FBQyw0SEFBRCxFQUErSCxrQkFBa0I7QUFDakosWUFBTUMsQ0FBQyxHQUFHLElBQUliLFVBQUosRUFBVjs7QUFDQWMscUJBQU1DLElBQU4sQ0FBV0YsQ0FBWCxFQUFjLGVBQWQsRUFBK0JHLE9BQS9CLENBQXVDUCxRQUF2Qzs7QUFHQSxVQUFJa0UsTUFBTSxHQUFHLENBQUNqRSxhQUFhLENBQUMsQ0FBRCxDQUFiLEdBQW1CLENBQXBCLEVBQXVCQSxhQUFhLENBQUMsQ0FBRCxDQUFiLEdBQW1CLENBQTFDLENBQWI7QUFDQSxVQUFJaUYsYUFBYSxHQUFHO0FBQUVwQixRQUFBQSxNQUFNLEVBQUUsSUFBVjtBQUFnQkMsUUFBQUEsTUFBTSxFQUFFO0FBQXhCLE9BQXBCO0FBRUEsWUFBTTtBQUFDVyxRQUFBQSxhQUFEO0FBQWdCQyxRQUFBQTtBQUFoQixVQUF5QixNQUFNdkUsQ0FBQyxDQUFDb0UseUJBQUYsQ0FBNEIsR0FBR04sTUFBL0IsQ0FBckM7QUFDQVEsTUFBQUEsYUFBYSxDQUFDdkYsTUFBZCxDQUFxQm1GLEdBQXJCLENBQXlCOUIsR0FBekIsQ0FBNkJ4QyxRQUE3QjtBQUNBLFVBQUk4RSxhQUFhLEdBQUcsTUFBTUMseUJBQVVDLFlBQVYsQ0FBdUJOLGFBQXZCLENBQTFCO0FBQ0FJLE1BQUFBLGFBQWEsQ0FBQ0csTUFBZCxDQUFxQjdELEtBQXJCLENBQTJCakMsTUFBM0IsQ0FBa0NxRCxHQUFsQyxDQUFzQzBCLE1BQU0sQ0FBQyxDQUFELENBQTVDO0FBQ0FZLE1BQUFBLGFBQWEsQ0FBQ0csTUFBZCxDQUFxQjVELE1BQXJCLENBQTRCbEMsTUFBNUIsQ0FBbUNxRCxHQUFuQyxDQUF1QzBCLE1BQU0sQ0FBQyxDQUFELENBQTdDO0FBQ0FTLE1BQUFBLEtBQUssQ0FBQ2IsTUFBTixDQUFhcUIsT0FBYixDQUFxQixDQUFyQixFQUF3QmhHLE1BQXhCLENBQStCcUQsR0FBL0IsQ0FBbUMwQyxhQUFhLENBQUNwQixNQUFkLENBQXFCc0IsUUFBckIsRUFBbkM7QUFDQVQsTUFBQUEsS0FBSyxDQUFDWixNQUFOLENBQWE1RSxNQUFiLENBQW9CcUQsR0FBcEIsQ0FBd0IwQyxhQUFhLENBQUNuQixNQUF0QztBQUVBLFlBQU1ILGNBQVFULHFCQUFSLENBQThCdUIsYUFBOUIsRUFBNkM7QUFBQ3ZCLFFBQUFBLHFCQUFxQixFQUFFLElBQXhCO0FBQThCd0IsUUFBQUE7QUFBOUIsT0FBN0MsRUFDSHhGLE1BREcsQ0FDSXVCLFVBREosQ0FDZThCLEdBRGYsQ0FDbUIsa0lBRG5CLENBQU47QUFJQTBCLE1BQUFBLE1BQU0sR0FBRyxDQUFDakUsYUFBYSxDQUFDLENBQUQsQ0FBYixHQUFtQixDQUFwQixFQUF1QkEsYUFBYSxDQUFDLENBQUQsQ0FBYixHQUFtQixDQUExQyxDQUFUO0FBQ0FpRixNQUFBQSxhQUFhLEdBQUc7QUFBRXBCLFFBQUFBLE1BQU0sRUFBRSxDQUFWO0FBQWFDLFFBQUFBLE1BQU0sRUFBRTtBQUFyQixPQUFoQjtBQUVBLFlBQU07QUFBQ1csUUFBQUEsYUFBYSxFQUFFVyxTQUFoQjtBQUEyQlYsUUFBQUEsS0FBSyxFQUFFVztBQUFsQyxVQUE4QyxNQUFNbEYsQ0FBQyxDQUFDb0UseUJBQUYsQ0FBNEIsR0FBR04sTUFBL0IsQ0FBMUQ7QUFDQW1CLE1BQUFBLFNBQVMsQ0FBQ2xHLE1BQVYsQ0FBaUJtRixHQUFqQixDQUFxQjlCLEdBQXJCLENBQXlCeEMsUUFBekI7QUFDQThFLE1BQUFBLGFBQWEsR0FBRyxNQUFNQyx5QkFBVUMsWUFBVixDQUF1QkssU0FBdkIsQ0FBdEI7QUFDQVAsTUFBQUEsYUFBYSxDQUFDRyxNQUFkLENBQXFCN0QsS0FBckIsQ0FBMkJqQyxNQUEzQixDQUFrQ3FELEdBQWxDLENBQXNDMEIsTUFBTSxDQUFDLENBQUQsQ0FBNUM7QUFDQVksTUFBQUEsYUFBYSxDQUFDRyxNQUFkLENBQXFCNUQsTUFBckIsQ0FBNEJsQyxNQUE1QixDQUFtQ3FELEdBQW5DLENBQXVDMEIsTUFBTSxDQUFDLENBQUQsQ0FBN0M7QUFDQW9CLE1BQUFBLFFBQVEsQ0FBQ3hCLE1BQVQsQ0FBZ0IzRSxNQUFoQixDQUF1QnFELEdBQXZCLENBQTJCMEMsYUFBYSxDQUFDcEIsTUFBekM7QUFDQXdCLE1BQUFBLFFBQVEsQ0FBQ3ZCLE1BQVQsQ0FBZ0JvQixPQUFoQixDQUF3QixDQUF4QixFQUEyQmhHLE1BQTNCLENBQWtDcUQsR0FBbEMsQ0FBc0MwQyxhQUFhLENBQUNuQixNQUFkLENBQXFCcUIsUUFBckIsRUFBdEM7QUFFQSxZQUFNeEIsY0FBUVQscUJBQVIsQ0FBOEJrQyxTQUE5QixFQUF5QztBQUFDbEMsUUFBQUEscUJBQXFCLEVBQUUsSUFBeEI7QUFBOEJ3QixRQUFBQTtBQUE5QixPQUF6QyxFQUNIeEYsTUFERyxDQUNJdUIsVUFESixDQUNlOEIsR0FEZixDQUNtQiw4SEFEbkIsQ0FBTjtBQUVELEtBakNDLENBQUY7QUFtQ0QsR0FqR08sQ0FBUjtBQWtHRCxDQWhVTyxDQUFSO0FBa1VBdEMsUUFBUSxDQUFDLGdDQUFELEVBQW1DLFlBQVk7QUFFckRDLEVBQUFBLEVBQUUsQ0FBQyxvREFBRCxFQUF1RCxrQkFBa0I7QUFDekUsVUFBTUMsQ0FBQyxHQUFHLElBQUlaLFlBQUosRUFBVjtBQUNBWSxJQUFBQSxDQUFDLENBQUNtRixJQUFGLENBQU9DLGlCQUFQLEdBQTJCO0FBQUNDLE1BQUFBLENBQUMsRUFBRTlGO0FBQUosS0FBM0I7QUFDQSxVQUFNUyxDQUFDLENBQUNJLFdBQUYsQ0FBY2tGLHFCQUFkLEVBQStCLE9BQS9CLEVBQXdDdkcsTUFBeEMsQ0FBK0N1QixVQUEvQyxDQUEwRDhCLEdBQTFELENBQThELEtBQTlELENBQU47QUFDRCxHQUpDLENBQUY7QUFLQXJDLEVBQUFBLEVBQUUsQ0FBQywwRUFBRCxFQUE2RSxrQkFBa0I7QUFDL0YsVUFBTUMsQ0FBQyxHQUFHLElBQUlaLFlBQUosRUFBVjtBQUNBWSxJQUFBQSxDQUFDLENBQUNtRixJQUFGLENBQU9DLGlCQUFQLEdBQTJCO0FBQUNDLE1BQUFBLENBQUMsRUFBRTlGO0FBQUosS0FBM0I7QUFDQSxVQUFNUyxDQUFDLENBQUNJLFdBQUYsQ0FBY2tGLHFCQUFkLEVBQStCLEtBQS9CLEVBQXNDdkcsTUFBdEMsQ0FBNkN1QixVQUE3QyxDQUF3RDhCLEdBQXhELENBQTRELEtBQTVELENBQU47QUFDRCxHQUpDLENBQUY7QUFLQXJDLEVBQUFBLEVBQUUsQ0FBQyxxREFBRCxFQUF3RCxrQkFBa0I7QUFDMUUsVUFBTUMsQ0FBQyxHQUFHLElBQUlaLFlBQUosRUFBVjtBQUNBWSxJQUFBQSxDQUFDLENBQUNtRixJQUFGLENBQU9DLGlCQUFQLEdBQTJCO0FBQUNDLE1BQUFBLENBQUMsRUFBRTlGO0FBQUosS0FBM0I7QUFDQSxVQUFNUyxDQUFDLENBQUNTLFlBQUYsQ0FBZTZFLHFCQUFmLEVBQWdDLFFBQWhDLEVBQTBDdkcsTUFBMUMsQ0FBaUR1QixVQUFqRCxDQUE0RDhCLEdBQTVELENBQWdFLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBaEUsQ0FBTjtBQUNELEdBSkMsQ0FBRjtBQUtBckMsRUFBQUEsRUFBRSxDQUFDLHVFQUFELEVBQTBFLGtCQUFrQjtBQUM1RixVQUFNQyxDQUFDLEdBQUcsSUFBSVosWUFBSixFQUFWO0FBQ0FZLElBQUFBLENBQUMsQ0FBQ21GLElBQUYsQ0FBT0MsaUJBQVAsR0FBMkI7QUFBQ0MsTUFBQUEsQ0FBQyxFQUFFOUY7QUFBSixLQUEzQjtBQUNBLFVBQU1TLENBQUMsQ0FBQ0ksV0FBRixDQUFja0YscUJBQWQsRUFBK0IsUUFBL0IsRUFBeUN2RyxNQUF6QyxDQUFnRHVCLFVBQWhELENBQTJEOEIsR0FBM0QsQ0FBK0QsTUFBL0QsQ0FBTjtBQUNELEdBSkMsQ0FBRjtBQUtBckMsRUFBQUEsRUFBRSxDQUFDLDZDQUFELEVBQWdELGtCQUFrQjtBQUNsRSxVQUFNQyxDQUFDLEdBQUcsSUFBSVosWUFBSixFQUFWO0FBQ0FZLElBQUFBLENBQUMsQ0FBQ21GLElBQUYsQ0FBT0MsaUJBQVAsR0FBMkI7QUFBQ0MsTUFBQUEsQ0FBQyxFQUFFOUYsa0JBQUo7QUFBd0JnRyxNQUFBQSxDQUFDLEVBQUVoRztBQUEzQixLQUEzQjtBQUNBLFVBQU1TLENBQUMsQ0FBQ0ksV0FBRixDQUFja0YscUJBQWQsRUFBK0IsT0FBL0IsRUFBd0N2RyxNQUF4QyxDQUErQ3VCLFVBQS9DLENBQTBEOEIsR0FBMUQsQ0FBOEQsS0FBOUQsQ0FBTjtBQUNBLFVBQU1wQyxDQUFDLENBQUNJLFdBQUYsQ0FBY2tGLHFCQUFkLEVBQStCLE9BQS9CLEVBQXdDdkcsTUFBeEMsQ0FBK0N1QixVQUEvQyxDQUEwRDhCLEdBQTFELENBQThELEtBQTlELENBQU47QUFDRCxHQUxDLENBQUY7QUFRQXJDLEVBQUFBLEVBQUUsQ0FBQyx1REFBRCxFQUEwRCxrQkFBa0I7QUFDNUUsVUFBTUMsQ0FBQyxHQUFHLElBQUlaLFlBQUosRUFBVjtBQUNBLFVBQU1ZLENBQUMsQ0FBQ0ksV0FBRixDQUFja0YscUJBQWQsRUFBK0IsT0FBL0IsRUFBd0N2RyxNQUF4QyxDQUErQ3VCLFVBQS9DLENBQTBEQyxFQUExRCxDQUE2REksWUFBN0QsQ0FBMEUsbUJBQTFFLENBQU47QUFDRCxHQUhDLENBQUY7QUFJQVosRUFBQUEsRUFBRSxDQUFDLCtEQUFELEVBQWtFLGtCQUFrQjtBQUNwRixVQUFNQyxDQUFDLEdBQUcsSUFBSVosWUFBSixFQUFWO0FBQ0FZLElBQUFBLENBQUMsQ0FBQ21GLElBQUYsQ0FBT0MsaUJBQVAsR0FBMkI3RixrQkFBM0I7QUFDQSxVQUFNUyxDQUFDLENBQUNJLFdBQUYsQ0FBY2tGLHFCQUFkLEVBQStCLE9BQS9CLEVBQXdDdkcsTUFBeEMsQ0FBK0N1QixVQUEvQyxDQUEwREMsRUFBMUQsQ0FBNkRJLFlBQTdELENBQTBFLG1CQUExRSxDQUFOO0FBQ0QsR0FKQyxDQUFGO0FBS0FaLEVBQUFBLEVBQUUsQ0FBQyx1RkFBRCxFQUEwRixrQkFBa0I7QUFDNUcsVUFBTUMsQ0FBQyxHQUFHLElBQUlaLFlBQUosRUFBVjtBQUNBWSxJQUFBQSxDQUFDLENBQUNtRixJQUFGLENBQU9DLGlCQUFQLEdBQTJCO0FBQUNDLE1BQUFBLENBQUMsRUFBRTlGLGtCQUFKO0FBQXdCZ0csTUFBQUEsQ0FBQyxFQUFFaEc7QUFBM0IsS0FBM0I7QUFDQSxVQUFNUyxDQUFDLENBQUNJLFdBQUYsQ0FBY2tGLHFCQUFkLEVBQStCLEtBQS9CLEVBQXNDdkcsTUFBdEMsQ0FBNkN1QixVQUE3QyxDQUF3REMsRUFBeEQsQ0FBMkRJLFlBQTNELENBQXdFLDJCQUF4RSxDQUFOO0FBQ0QsR0FKQyxDQUFGO0FBS0FaLEVBQUFBLEVBQUUsQ0FBQyw2REFBRCxFQUFnRSxrQkFBa0I7QUFDbEYsVUFBTUMsQ0FBQyxHQUFHLElBQUlaLFlBQUosRUFBVjtBQUNBWSxJQUFBQSxDQUFDLENBQUNtRixJQUFGLENBQU9DLGlCQUFQLEdBQTJCO0FBQUNDLE1BQUFBLENBQUMsRUFBRTlGLGtCQUFKO0FBQXdCZ0csTUFBQUEsQ0FBQyxFQUFFaEc7QUFBM0IsS0FBM0I7QUFDQSxVQUFNUyxDQUFDLENBQUNJLFdBQUYsQ0FBY2tGLHFCQUFkLEVBQStCLE9BQS9CLEVBQXdDdkcsTUFBeEMsQ0FBK0N1QixVQUEvQyxDQUEwREMsRUFBMUQsQ0FBNkRJLFlBQTdELENBQTBFLG9CQUExRSxDQUFOO0FBQ0QsR0FKQyxDQUFGO0FBS0FaLEVBQUFBLEVBQUUsQ0FBQyxrREFBRCxFQUFxRCxrQkFBa0I7QUFDdkUsVUFBTUMsQ0FBQyxHQUFHLElBQUlaLFlBQUosRUFBVjtBQUNBWSxJQUFBQSxDQUFDLENBQUNtRixJQUFGLENBQU9DLGlCQUFQLEdBQTJCO0FBQUNDLE1BQUFBLENBQUMsRUFBRTtBQUFKLEtBQTNCO0FBQ0EsVUFBTXJGLENBQUMsQ0FBQ0ksV0FBRixDQUFja0YscUJBQWQsRUFBK0IsT0FBL0IsRUFBd0N2RyxNQUF4QyxDQUErQ3VCLFVBQS9DLENBQTBEQyxFQUExRCxDQUE2REksWUFBN0QsQ0FBMEUsaUJBQTFFLENBQU47QUFDRCxHQUpDLENBQUY7QUFLQVosRUFBQUEsRUFBRSxDQUFDLHdEQUFELEVBQTJELGtCQUFrQjtBQUM3RSxVQUFNQyxDQUFDLEdBQUcsSUFBSVosWUFBSixFQUFWO0FBQ0FZLElBQUFBLENBQUMsQ0FBQ21GLElBQUYsQ0FBT0MsaUJBQVAsR0FBMkI7QUFBQ0MsTUFBQUEsQ0FBQyxFQUFFMUY7QUFBSixLQUEzQjtBQUNBLFVBQU1LLENBQUMsQ0FBQ0ksV0FBRixDQUFja0YscUJBQWQsRUFBK0IsT0FBL0IsRUFBd0N2RyxNQUF4QyxDQUErQ3VCLFVBQS9DLENBQTBEQyxFQUExRCxDQUE2REksWUFBN0QsQ0FBMEUsd0JBQTFFLENBQU47QUFDRCxHQUpDLENBQUY7QUFLQVosRUFBQUEsRUFBRSxDQUFDLHFEQUFELEVBQXdELGtCQUFrQjtBQUMxRSxVQUFNQyxDQUFDLEdBQUcsSUFBSVosWUFBSixFQUFWO0FBQ0FZLElBQUFBLENBQUMsQ0FBQ21GLElBQUYsQ0FBT0MsaUJBQVAsR0FBMkI7QUFBQ0MsTUFBQUEsQ0FBQyxFQUFFOUY7QUFBSixLQUEzQjtBQUNBLFVBQU1TLENBQUMsQ0FBQ0ksV0FBRixDQUFja0YscUJBQWQsRUFBK0IsU0FBL0IsRUFBMEN2RyxNQUExQyxDQUFpRHVCLFVBQWpELENBQTREQyxFQUE1RCxDQUErREksWUFBL0QsQ0FBNEUsZUFBNUUsQ0FBTjtBQUNELEdBSkMsQ0FBRjtBQUtBWixFQUFBQSxFQUFFLENBQUMseURBQUQsRUFBNEQsa0JBQWtCO0FBQzlFLFVBQU1DLENBQUMsR0FBRyxJQUFJWixZQUFKLEVBQVY7QUFDQVksSUFBQUEsQ0FBQyxDQUFDbUYsSUFBRixDQUFPQyxpQkFBUCxHQUEyQjtBQUFDQyxNQUFBQSxDQUFDLEVBQUU5RjtBQUFKLEtBQTNCO0FBQ0EsVUFBTVMsQ0FBQyxDQUFDSSxXQUFGLENBQWNrRixxQkFBZCxFQUErQixRQUEvQixFQUF5Q3ZHLE1BQXpDLENBQWdEdUIsVUFBaEQsQ0FBMkRDLEVBQTNELENBQThESSxZQUE5RCxDQUEyRSxzQkFBM0UsQ0FBTjtBQUNELEdBSkMsQ0FBRjtBQUtELENBckVPLENBQVIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hhaSBmcm9tICdjaGFpJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGNoYWlBc1Byb21pc2VkIGZyb20gJ2NoYWktYXMtcHJvbWlzZWQnO1xuaW1wb3J0IHNpbm9uIGZyb20gJ3Npbm9uJztcbmltcG9ydCB7IEJhc2VEcml2ZXIsIEltYWdlRWxlbWVudCB9IGZyb20gJy4uLy4uLy4uJztcbmltcG9ydCB7IElNQUdFX1NUUkFURUdZLCBDVVNUT01fU1RSQVRFR1ksIGhlbHBlcnMgfSBmcm9tICcuLi8uLi8uLi9saWIvYmFzZWRyaXZlci9jb21tYW5kcy9maW5kJztcbmltcG9ydCB7IGltYWdlVXRpbCB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcblxuXG5jb25zdCBzaG91bGQgPSBjaGFpLnNob3VsZCgpO1xuY2hhaS51c2UoY2hhaUFzUHJvbWlzZWQpO1xuXG5cbmNsYXNzIFRlc3REcml2ZXIgZXh0ZW5kcyBCYXNlRHJpdmVyIHtcbiAgYXN5bmMgZ2V0V2luZG93U2l6ZSAoKSB7fVxuICBhc3luYyBnZXRTY3JlZW5zaG90ICgpIHt9XG59XG5cbmNvbnN0IENVU1RPTV9GSU5EX01PRFVMRSA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICcuLicsICcuLicsICcuLicsXG4gICd0ZXN0JywgJ2Jhc2Vkcml2ZXInLCAnZml4dHVyZXMnLCAnY3VzdG9tLWVsZW1lbnQtZmluZGVyJyk7XG5jb25zdCBCQURfQ1VTVE9NX0ZJTkRfTU9EVUxFID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJy4uJyxcbiAgJ3Rlc3QnLCAnYmFzZWRyaXZlcicsICdmaXh0dXJlcycsICdjdXN0b20tZWxlbWVudC1maW5kZXItYmFkJyk7XG5cbmNvbnN0IFRJTllfUE5HID0gJ2lWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBUUFBQUFFQ0FJQUFBQW1rd2twQUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUF5aHBWRmgwV0UxTU9tTnZiUzVoWkc5aVpTNTRiWEFBQUFBQUFEdy9lSEJoWTJ0bGRDQmlaV2RwYmowaTc3dS9JaUJwWkQwaVZ6Vk5NRTF3UTJWb2FVaDZjbVZUZWs1VVkzcHJZemxrSWo4K0lEeDRPbmh0Y0cxbGRHRWdlRzFzYm5NNmVEMGlZV1J2WW1VNmJuTTZiV1YwWVM4aUlIZzZlRzF3ZEdzOUlrRmtiMkpsSUZoTlVDQkRiM0psSURVdU5pMWpNVFF3SURjNUxqRTJNRFExTVN3Z01qQXhOeTh3TlM4d05pMHdNVG93T0RveU1TQWdJQ0FnSUNBZ0lqNGdQSEprWmpwU1JFWWdlRzFzYm5NNmNtUm1QU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh4T1RrNUx6QXlMekl5TFhKa1ppMXplVzUwWVhndGJuTWpJajRnUEhKa1pqcEVaWE5qY21sd2RHbHZiaUJ5WkdZNllXSnZkWFE5SWlJZ2VHMXNibk02ZUcxd1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JTWldZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlZKbFppTWlJSGh0Y0RwRGNtVmhkRzl5Vkc5dmJEMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJREl3TVRnZ0tFMWhZMmx1ZEc5emFDa2lJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZOME5ETURNNE1ETTROMFUyTVRGRk9FRXpNemhHTVRSRk5VVXdOekl3TlVJaUlIaHRjRTFOT2tSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk4wTkRNRE00TURRNE4wVTJNVEZGT0VFek16aEdNVFJGTlVVd056SXdOVUlpUGlBOGVHMXdUVTA2UkdWeWFYWmxaRVp5YjIwZ2MzUlNaV1k2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvM1EwTXdNemd3TVRnM1JUWXhNVVU0UVRNek9FWXhORVUxUlRBM01qQTFRaUlnYzNSU1pXWTZaRzlqZFcxbGJuUkpSRDBpZUcxd0xtUnBaRG8zUTBNd016Z3dNamczUlRZeE1VVTRRVE16T0VZeE5FVTFSVEEzTWpBMVFpSXZQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QcGR2SmpRQUFBQWxTVVJCVkhqYUpJbkJFUUFBQ0lLdy9YZTJVbDV3WUJ0d21KcWtrNCt6ZnZVUVZvQUJBRWcwRWZyWndjMGhBQUFBQUVsRlRrU3VRbUNDJztcbmNvbnN0IFRJTllfUE5HX0RJTVMgPSBbNCwgNF07XG5cbmRlc2NyaWJlKCdmaW5kaW5nIGVsZW1lbnRzIGJ5IGltYWdlJywgZnVuY3Rpb24gKCkge1xuICBkZXNjcmliZSgnZmluZEVsZW1lbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoJ3Nob3VsZCB1c2UgYSBkaWZmZXJlbnQgc3BlY2lhbCBtZXRob2QgdG8gZmluZCBlbGVtZW50IGJ5IGltYWdlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZCA9IG5ldyBUZXN0RHJpdmVyKCk7XG4gICAgICBzaW5vbi5zdHViKGQsICdmaW5kQnlJbWFnZScpLnJldHVybnModHJ1ZSk7XG4gICAgICBzaW5vbi5zdHViKGQsICdmaW5kRWxPckVsc1dpdGhQcm9jZXNzaW5nJykucmV0dXJucyhmYWxzZSk7XG4gICAgICBhd2FpdCBkLmZpbmRFbGVtZW50KElNQUdFX1NUUkFURUdZLCAnZm9vJykuc2hvdWxkLmV2ZW50dWFsbHkuYmUudHJ1ZTtcbiAgICAgIGF3YWl0IGQuZmluZEVsZW1lbnRzKElNQUdFX1NUUkFURUdZLCAnZm9vJykuc2hvdWxkLmV2ZW50dWFsbHkuYmUudHJ1ZTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIG5vdCBiZSBhYmxlIHRvIGZpbmQgaW1hZ2UgZWxlbWVudCBmcm9tIGFueSBvdGhlciBlbGVtZW50JywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZCA9IG5ldyBUZXN0RHJpdmVyKCk7XG4gICAgICBhd2FpdCBkLmZpbmRFbGVtZW50RnJvbUVsZW1lbnQoSU1BR0VfU1RSQVRFR1ksICdmb28nLCAnZWxJZCcpXG4gICAgICAgIC5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZFdpdGgoL0xvY2F0b3IgU3RyYXRlZ3kuK2lzIG5vdCBzdXBwb3J0ZWQvKTtcbiAgICAgIGF3YWl0IGQuZmluZEVsZW1lbnRzRnJvbUVsZW1lbnQoSU1BR0VfU1RSQVRFR1ksICdmb28nLCAnZWxJZCcpXG4gICAgICAgIC5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZFdpdGgoL0xvY2F0b3IgU3RyYXRlZ3kuK2lzIG5vdCBzdXBwb3J0ZWQvKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ZpbmRCeUltYWdlJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHJlY3QgPSB7eDogMTAsIHk6IDIwLCB3aWR0aDogMzAsIGhlaWdodDogNDB9O1xuICAgIGNvbnN0IHNjb3JlID0gMC45O1xuICAgIGNvbnN0IHNpemUgPSB7d2lkdGg6IDEwMCwgaGVpZ2h0OiAyMDB9O1xuICAgIGNvbnN0IHNjcmVlbnNob3QgPSAnaVZCT1Jmb28nO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gJ2lWQk9SYmFyJztcblxuICAgIGZ1bmN0aW9uIGJhc2ljU3R1YiAoZHJpdmVyKSB7XG4gICAgICBjb25zdCBzaXplU3R1YiA9IHNpbm9uLnN0dWIoZHJpdmVyLCAnZ2V0V2luZG93U2l6ZScpLnJldHVybnMoc2l6ZSk7XG4gICAgICBjb25zdCBzY3JlZW5TdHViID0gc2lub24uc3R1Yihkcml2ZXIsICdnZXRTY3JlZW5zaG90Rm9ySW1hZ2VGaW5kJykucmV0dXJucyhzY3JlZW5zaG90KTtcbiAgICAgIGNvbnN0IGNvbXBhcmVTdHViID0gc2lub24uc3R1Yihkcml2ZXIsICdjb21wYXJlSW1hZ2VzJykucmV0dXJucyh7cmVjdCwgc2NvcmV9KTtcbiAgICAgIHJldHVybiB7c2l6ZVN0dWIsIHNjcmVlblN0dWIsIGNvbXBhcmVTdHVifTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiYXNpY0ltZ0VsVmVyaWZ5IChpbWdFbFByb3RvLCBkcml2ZXIpIHtcbiAgICAgIGNvbnN0IGltZ0VsSWQgPSBpbWdFbFByb3RvLkVMRU1FTlQ7XG4gICAgICBkcml2ZXIuX2ltZ0VsQ2FjaGUuaGFzKGltZ0VsSWQpLnNob3VsZC5iZS50cnVlO1xuICAgICAgY29uc3QgaW1nRWwgPSBkcml2ZXIuX2ltZ0VsQ2FjaGUuZ2V0KGltZ0VsSWQpO1xuICAgICAgKGltZ0VsIGluc3RhbmNlb2YgSW1hZ2VFbGVtZW50KS5zaG91bGQuYmUudHJ1ZTtcbiAgICAgIGltZ0VsLnJlY3Quc2hvdWxkLmVxbChyZWN0KTtcbiAgICAgIGltZ0VsLnNjb3JlLnNob3VsZC5lcWwoc2NvcmUpO1xuICAgICAgcmV0dXJuIGltZ0VsO1xuICAgIH1cblxuICAgIGl0KCdzaG91bGQgZmluZCBhbiBpbWFnZSBlbGVtZW50IGhhcHB5cGF0aCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgVGVzdERyaXZlcigpO1xuICAgICAgYmFzaWNTdHViKGQpO1xuICAgICAgY29uc3QgaW1nRWxQcm90byA9IGF3YWl0IGQuZmluZEJ5SW1hZ2UodGVtcGxhdGUsIHttdWx0aXBsZTogZmFsc2V9KTtcbiAgICAgIGJhc2ljSW1nRWxWZXJpZnkoaW1nRWxQcm90bywgZCk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBmaW5kIGltYWdlIGVsZW1lbnRzIGhhcHB5cGF0aCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgVGVzdERyaXZlcigpO1xuICAgICAgY29uc3Qge2NvbXBhcmVTdHVifSA9IGJhc2ljU3R1YihkKTtcbiAgICAgIGNvbXBhcmVTdHViLnJldHVybnMoW3tyZWN0LCBzY29yZX1dKTtcblxuICAgICAgY29uc3QgZWxzID0gYXdhaXQgZC5maW5kQnlJbWFnZSh0ZW1wbGF0ZSwge211bHRpcGxlOiB0cnVlfSk7XG4gICAgICBlbHMuc2hvdWxkLmhhdmUubGVuZ3RoKDEpO1xuICAgICAgYmFzaWNJbWdFbFZlcmlmeShlbHNbMF0sIGQpO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgZmFpbCBpZiBkcml2ZXIgZG9lcyBub3Qgc3VwcG9ydCBnZXRXaW5kb3dTaXplJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZCA9IG5ldyBCYXNlRHJpdmVyKCk7XG4gICAgICBhd2FpdCBkLmZpbmRCeUltYWdlKHRlbXBsYXRlLCB7bXVsdGlwbGU6IGZhbHNlfSlcbiAgICAgICAgLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkV2l0aCgvZHJpdmVyIGRvZXMgbm90IHN1cHBvcnQvKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGZpeCB0ZW1wbGF0ZSBzaXplIGlmIHJlcXVlc3RlZCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgVGVzdERyaXZlcigpO1xuICAgICAgY29uc3QgbmV3VGVtcGxhdGUgPSAnaVZCT1JiYXonO1xuICAgICAgY29uc3Qge2NvbXBhcmVTdHVifSA9IGJhc2ljU3R1YihkKTtcbiAgICAgIGF3YWl0IGQuc2V0dGluZ3MudXBkYXRlKHtmaXhJbWFnZVRlbXBsYXRlU2l6ZTogdHJ1ZX0pO1xuICAgICAgc2lub24uc3R1YihkLCAnZW5zdXJlVGVtcGxhdGVTaXplJykucmV0dXJucyhuZXdUZW1wbGF0ZSk7XG4gICAgICBjb25zdCBpbWdFbFByb3RvID0gYXdhaXQgZC5maW5kQnlJbWFnZSh0ZW1wbGF0ZSwge211bHRpcGxlOiBmYWxzZX0pO1xuICAgICAgY29uc3QgaW1nRWwgPSBiYXNpY0ltZ0VsVmVyaWZ5KGltZ0VsUHJvdG8sIGQpO1xuICAgICAgaW1nRWwudGVtcGxhdGUuc2hvdWxkLmVxbChuZXdUZW1wbGF0ZSk7XG4gICAgICBjb21wYXJlU3R1Yi5hcmdzWzBdWzJdLnNob3VsZC5lcWwobmV3VGVtcGxhdGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBmaXggdGVtcGxhdGUgc2l6ZSBzY2FsZSBpZiByZXF1ZXN0ZWQnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBkID0gbmV3IFRlc3REcml2ZXIoKTtcbiAgICAgIGNvbnN0IG5ld1RlbXBsYXRlID0gJ2lWQk9SYmF6JztcbiAgICAgIGNvbnN0IHtjb21wYXJlU3R1Yn0gPSBiYXNpY1N0dWIoZCk7XG4gICAgICBhd2FpdCBkLnNldHRpbmdzLnVwZGF0ZSh7Zml4SW1hZ2VUZW1wbGF0ZVNjYWxlOiB0cnVlfSk7XG4gICAgICBzaW5vbi5zdHViKGQsICdmaXhJbWFnZVRlbXBsYXRlU2NhbGUnKS5yZXR1cm5zKG5ld1RlbXBsYXRlKTtcbiAgICAgIGNvbnN0IGltZ0VsUHJvdG8gPSBhd2FpdCBkLmZpbmRCeUltYWdlKHRlbXBsYXRlLCB7bXVsdGlwbGU6IGZhbHNlfSk7XG4gICAgICBjb25zdCBpbWdFbCA9IGJhc2ljSW1nRWxWZXJpZnkoaW1nRWxQcm90bywgZCk7XG4gICAgICBpbWdFbC50ZW1wbGF0ZS5zaG91bGQuZXFsKG5ld1RlbXBsYXRlKTtcbiAgICAgIGNvbXBhcmVTdHViLmFyZ3NbMF1bMl0uc2hvdWxkLmVxbChuZXdUZW1wbGF0ZSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBub3QgZml4IHRlbXBsYXRlIHNpemUgc2NhbGUgaWYgaXQgaXMgbm90IHJlcXVlc3RlZCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgVGVzdERyaXZlcigpO1xuICAgICAgY29uc3QgbmV3VGVtcGxhdGUgPSAnaVZCT1JiYXonO1xuICAgICAgYmFzaWNTdHViKGQpO1xuICAgICAgYXdhaXQgZC5zZXR0aW5ncy51cGRhdGUoe30pO1xuICAgICAgc2lub24uc3R1YihkLCAnZml4SW1hZ2VUZW1wbGF0ZVNjYWxlJykucmV0dXJucyhuZXdUZW1wbGF0ZSk7XG4gICAgICBkLmZpeEltYWdlVGVtcGxhdGVTY2FsZS5jYWxsQ291bnQuc2hvdWxkLmVxbCgwKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3IgaWYgdGVtcGxhdGUgbWF0Y2ggZmFpbHMnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBkID0gbmV3IFRlc3REcml2ZXIoKTtcbiAgICAgIGNvbnN0IHtjb21wYXJlU3R1Yn0gPSBiYXNpY1N0dWIoZCk7XG4gICAgICBjb21wYXJlU3R1Yi50aHJvd3MobmV3IEVycm9yKCdDYW5ub3QgZmluZCBhbnkgb2NjdXJyZW5jZXMnKSk7XG4gICAgICBhd2FpdCBkLmZpbmRCeUltYWdlKHRlbXBsYXRlLCB7bXVsdGlwbGU6IGZhbHNlfSlcbiAgICAgICAgLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkV2l0aCgvZWxlbWVudCBjb3VsZCBub3QgYmUgbG9jYXRlZC8pO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IGFycmF5IGZvciBtdWx0aXBsZSBlbGVtZW50cyBpZiB0ZW1wbGF0ZSBtYXRjaCBmYWlscycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgVGVzdERyaXZlcigpO1xuICAgICAgY29uc3Qge2NvbXBhcmVTdHVifSA9IGJhc2ljU3R1YihkKTtcbiAgICAgIGNvbXBhcmVTdHViLnRocm93cyhuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIGFueSBvY2N1cnJlbmNlcycpKTtcbiAgICAgIGF3YWl0IGQuZmluZEJ5SW1hZ2UodGVtcGxhdGUsIHttdWx0aXBsZTogdHJ1ZX0pLnNob3VsZC5ldmVudHVhbGx5LmVxbChbXSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCByZXNwZWN0IGltcGxpY2l0IHdhaXQnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBkID0gbmV3IFRlc3REcml2ZXIoKTtcbiAgICAgIGQuc2V0SW1wbGljaXRXYWl0KDEwKTtcbiAgICAgIGNvbnN0IHtjb21wYXJlU3R1Yn0gPSBiYXNpY1N0dWIoZCk7XG4gICAgICBjb21wYXJlU3R1Yi5vbkNhbGwoMCkudGhyb3dzKG5ldyBFcnJvcignQ2Fubm90IGZpbmQgYW55IG9jY3VycmVuY2VzJykpO1xuICAgICAgY29uc3QgaW1nRWxQcm90byA9IGF3YWl0IGQuZmluZEJ5SW1hZ2UodGVtcGxhdGUsIHttdWx0aXBsZTogZmFsc2V9KTtcbiAgICAgIGJhc2ljSW1nRWxWZXJpZnkoaW1nRWxQcm90bywgZCk7XG4gICAgICBjb21wYXJlU3R1Yi5jYWxsQ291bnQuc2hvdWxkLmVxbCgyKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIG5vdCBhZGQgZWxlbWVudCB0byBjYWNoZSBhbmQgcmV0dXJuIGl0IGRpcmVjdGx5IHdoZW4gY2hlY2tpbmcgc3RhbGVuZXNzJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZCA9IG5ldyBUZXN0RHJpdmVyKCk7XG4gICAgICBiYXNpY1N0dWIoZCk7XG4gICAgICBjb25zdCBpbWdFbCA9IGF3YWl0IGQuZmluZEJ5SW1hZ2UodGVtcGxhdGUsIHttdWx0aXBsZTogZmFsc2UsIHNob3VsZENoZWNrU3RhbGVuZXNzOiB0cnVlfSk7XG4gICAgICAoaW1nRWwgaW5zdGFuY2VvZiBJbWFnZUVsZW1lbnQpLnNob3VsZC5iZS50cnVlO1xuICAgICAgZC5faW1nRWxDYWNoZS5oYXMoaW1nRWwuaWQpLnNob3VsZC5iZS5mYWxzZTtcbiAgICAgIGltZ0VsLnJlY3Quc2hvdWxkLmVxbChyZWN0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ZpeEltYWdlVGVtcGxhdGVTY2FsZScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIG5vdCBmaXggdGVtcGxhdGUgc2l6ZSBzY2FsZSBpZiBubyBzY2FsZSB2YWx1ZScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG5ld1RlbXBsYXRlID0gJ2lWQk9SYmF6JztcbiAgICAgIGF3YWl0IGhlbHBlcnMuZml4SW1hZ2VUZW1wbGF0ZVNjYWxlKG5ld1RlbXBsYXRlLCB7Zml4SW1hZ2VUZW1wbGF0ZVNjYWxlOiB0cnVlfSlcbiAgICAgICAgLnNob3VsZC5ldmVudHVhbGx5LmVxbChuZXdUZW1wbGF0ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBmaXggdGVtcGxhdGUgc2l6ZSBzY2FsZSBpZiBpdCBpcyBudWxsJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbmV3VGVtcGxhdGUgPSAnaVZCT1JiYXonO1xuICAgICAgYXdhaXQgaGVscGVycy5maXhJbWFnZVRlbXBsYXRlU2NhbGUobmV3VGVtcGxhdGUsIG51bGwpXG4gICAgICAgIC5zaG91bGQuZXZlbnR1YWxseS5lcWwobmV3VGVtcGxhdGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgZml4IHRlbXBsYXRlIHNpemUgc2NhbGUgaWYgaXQgaXMgbm90IG51bWJlcicsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG5ld1RlbXBsYXRlID0gJ2lWQk9SYmF6JztcbiAgICAgIGF3YWl0IGhlbHBlcnMuZml4SW1hZ2VUZW1wbGF0ZVNjYWxlKG5ld1RlbXBsYXRlLCAnd3Jvbmctc2NhbGUnKVxuICAgICAgICAuc2hvdWxkLmV2ZW50dWFsbHkuZXFsKG5ld1RlbXBsYXRlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZml4IHRlbXBsYXRlIHNpemUgc2NhbGUnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBhY3R1YWwgPSAnaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFZQUFBQUdDQVlBQUFEZ3pPOUlBQUFBV0VsRVFWUjRBVTNCUVJXQVFBaEF3YS9QR0JzRWdyQzE2QUZCS0VJUFhXN09YTytSbWV5OWlRak1qSEZ6ckxVd003cWJxbUxjSEtwS1JGQlZ1RHZqNGFncTNCMVZSVVFZVDJiUzNRd1JRVlVaRi9DYUdSSEIzd2MxdlNaYkhPNStCZ0FBQUFCSlJVNUVya0pnZ2c9PSc7XG4gICAgICBhd2FpdCBoZWxwZXJzLmZpeEltYWdlVGVtcGxhdGVTY2FsZShUSU5ZX1BORywge1xuICAgICAgICBmaXhJbWFnZVRlbXBsYXRlU2NhbGU6IHRydWUsIHhTY2FsZTogMS41LCB5U2NhbGU6IDEuNVxuICAgICAgfSkuc2hvdWxkLmV2ZW50dWFsbHkuZXFsKGFjdHVhbCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBmaXggdGVtcGxhdGUgc2l6ZSBzY2FsZSBiZWNhdXNlIG9mIGZpeEltYWdlVGVtcGxhdGVTY2FsZSBpcyBmYWxzZScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGF3YWl0IGhlbHBlcnMuZml4SW1hZ2VUZW1wbGF0ZVNjYWxlKFRJTllfUE5HLCB7XG4gICAgICAgIGZpeEltYWdlVGVtcGxhdGVTY2FsZTogZmFsc2UsIHhTY2FsZTogMS41LCB5U2NhbGU6IDEuNVxuICAgICAgfSkuc2hvdWxkLmV2ZW50dWFsbHkuZXFsKFRJTllfUE5HKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZml4IHRlbXBsYXRlIHNpemUgc2NhbGUgd2l0aCBkZWZhdWx0IHNjYWxlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgYWN0dWFsID0gJ2lWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQndVbEVRVlI0QWFYQlBVc3JRUUNHMFNlWCtjQmRrVGp3VHBHMU5QZ0xwalkvZlcxc3R0NFVZbW0yY0pxd01Dc2F3NzB1SkozQ0JjOVovUDNDbCsxMlM5dTJ0RzFMMjdiRUdMbS92MmV6MmJEWmJKREVkLzd3UzRZVDd6M1gxOWZjM054d2QzZEhYZGQ0N3huSGtlZm5aOFp4cEtvcTZycW1xaXFNTWN3TUoxVlYwVFFOMHpUaG5PUGo0NE82cnNrNTAzVWRrbWlhaHFacFdLMVdHR09ZR1U3cXVxWnBHcXkxU0NMblRNNloxOWRYY3M1SVlwb21yTFZJNHVMaWdwbmhwS29xVnFzVmtqZ2NEanc5UGRGMUhUbG51cTVERXM0NUpIRTRIRGd6bkJ5UFI5N2UzcGltaVZJSzR6aHlQQjd4M2hOQ0lJVEE1ZVVsM25zV2l3Vm5ocE5TQ3NNd3NOdnRHSWFCL1g1UEtRVkpwSlNReEhxOVJoTE9PYzRNSjlNMHNkdnQyRzYzOUgzUFRCSXhSaVFoQ1VuRUdMSFdjbVk0S2FVd0RBTjkzL1A0K01oeXVTU2xoQ1JTU2tqQ09ZZTFGbXN0WjZidmUyWXZMeS9zOTN0bXkrVVNTVWhDRXBJSUlmQWQ4L0R3d096OS9aMVNDcEpJS1NHSjlYcU5KSnh6L01TMGJjdnM2dW9LU2NRWWtZUWtKQkZqeEZyTFQwemJ0c3h1YjI5SktTR0psQktTY001aHJjVmF5MDlNenBsWmpKSFB6MCs4OTRRUUNDSHdQLzd3Uy84QTRlNm5BZytSOEx3QUFBQUFTVVZPUks1Q1lJST0nO1xuICAgICAgYXdhaXQgaGVscGVycy5maXhJbWFnZVRlbXBsYXRlU2NhbGUoVElOWV9QTkcsIHtcbiAgICAgICAgZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZTogNC4wXG4gICAgICB9KS5zaG91bGQuZXZlbnR1YWxseS5lcWwoYWN0dWFsKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZml4IHRlbXBsYXRlIHNpemUgc2NhbGUgd2l0aCBkZWZhdWx0IHNjYWxlIGFuZCBpbWFnZSBzY2FsZScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGFjdHVhbCA9ICdpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQmdBQUFBWUNBWUFBQURnZHozNEFBQUNhVWxFUVZSNEFiWEJNV3ZyV0JTRjBjOUJzRlB0VzkxVVIxVTYrLy8vRktsS0t0OHFxbnlxbk1vemdna0k4eGdNajZ4MXV2K0wvNnpyeXJJc3JPdktzaXlzNjhxeUxGd3VGODduTTVmTGhmUDV6T1Z5NFh3Kzg0d1hmdGtMdjJ6aVFCSzI2YjBURVZRVnU0akFOcnZNNUhxOXNwT0VKQ1FoQ1VsSTRtamlRQksyNmIxVFZld2tZUnZiN0RLVE1RYVppVzFzMDFyRE5yYVJ4TkhFZ1NSYWExUVZPMG0wMWpqS1RES1RYZStkM2p0VnhVNFNqeVlPSkdHYm5TUnMwM3NuTThsTU1wUGI3VVpta3BsRUJGWEZUaEsyZVRSeElBbmJTTUkyVmNYMzl6ZGpETVlZWkNhWnlSaURNUVpWeFU0U3Rxa3FIazBjU0VJU2Y1S1o3REtUTVFiTHNyQ1RSR3VOM2p0VnhhT0pnNnFpcXFncXFvcXFvcW9ZWTVDWjdHd1RFZHp2ZDk3ZjM0a0lldS9ZUmhLUEpnNnFpc3drTTduZGJtUW1tVWxta3Buc2JCTVIyQ1lpbU9lWjNqdTJrY1NqaVlPcUlqUDUrdnBpMnphMmJXUGJObzVhYTdUVzJQWGU2YjNUZTZlMWhpUWVUUnhVRmJmYmpXM2JHR053dlY0WlkyQWIyN1RXc0kxdGJHTWIyN1RXc0kwa0hrMGNWQldaeWJadFhLOVhQajgvK2ZqNFlKNW5Jb0xXR3JhSkNPWjVSaEtTa0lRa0pQRm80cUNxeUV5MmJXT013ZWZuSit1NmNqcWRzTTNPTnZNOGN6NmZlY2EwcmlzL3J0Y3JtY25PTmhIQi9YN24vZjJkaUtEM2ptMGs4YXhwV1JaK1pDYVp5YzQyRVlGdElvSjVudW05WXh0SlBHdGExNVUvc1kxdGRtOXZiL1RlNmIxakcwazhhMXFXaFIrMnNVMXJqZFlhdHJHTmJXeGptOVlha25qV3RLNHJQeUtDaUtDMWhtMGlnb2pnOWZVVlNVaENFcEo0MXJRc0MwZTIyZGttSXJoY0x2eU5GLzdINlhUaWI3M3d5MTc0WmY4QUpFc2VQdGxQajEwQUFBQUFTVVZPUks1Q1lJST0nO1xuICAgICAgYXdhaXQgaGVscGVycy5maXhJbWFnZVRlbXBsYXRlU2NhbGUoVElOWV9QTkcsIHtcbiAgICAgICAgZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZTogNC4wLFxuICAgICAgICBmaXhJbWFnZVRlbXBsYXRlU2NhbGU6IHRydWUsXG4gICAgICAgIHhTY2FsZTogMS41LCB5U2NhbGU6IDEuNVxuICAgICAgfSkuc2hvdWxkLmV2ZW50dWFsbHkuZXFsKGFjdHVhbCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBmaXggdGVtcGxhdGUgc2l6ZSBzY2FsZSB3aXRoIGRlZmF1bHQgc2NhbGUgYW5kIGltYWdlIHNjYWxlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgYWN0dWFsID0gJ2lWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQndVbEVRVlI0QWFYQlBVc3JRUUNHMFNlWCtjQmRrVGp3VHBHMU5QZ0xwalkvZlcxc3R0NFVZbW0yY0pxd01Dc2F3NzB1SkozQ0JjOVovUDNDbCsxMlM5dTJ0RzFMMjdiRUdMbS92MmV6MmJEWmJKREVkLzd3UzRZVDd6M1gxOWZjM054d2QzZEhYZGQ0N3huSGtlZm5aOFp4cEtvcTZycW1xaXFNTWN3TUoxVlYwVFFOMHpUaG5PUGo0NE82cnNrNTAzVWRrbWlhaHFacFdLMVdHR09ZR1U3cXVxWnBHcXkxU0NMblRNNloxOWRYY3M1SVlwb21yTFZJNHVMaWdwbmhwS29xVnFzVmtqZ2NEanc5UGRGMUhUbG51cTVERXM0NUpIRTRIRGd6bkJ5UFI5N2UzcGltaVZJSzR6aHlQQjd4M2hOQ0lJVEE1ZVVsM25zV2l3Vm5ocE5TQ3NNd3NOdnRHSWFCL1g1UEtRVkpwSlNReEhxOVJoTE9PYzRNSjlNMHNkdnQyRzYzOUgzUFRCSXhSaVFoQ1VuRUdMSFdjbVk0S2FVd0RBTjkzL1A0K01oeXVTU2xoQ1JTU2tqQ09ZZTFGbXN0WjZidmUyWXZMeS9zOTN0bXkrVVNTVWhDRXBJSUlmQWQ4L0R3d096OS9aMVNDcEpJS1NHSjlYcU5KSnh6L01TMGJjdnM2dW9LU2NRWWtZUWtKQkZqeEZyTFQwemJ0c3h1YjI5SktTR0psQktTY001aHJjVmF5MDlNenBsWmpKSFB6MCs4OTRRUUNDSHdQLzd3Uy84QTRlNm5BZytSOEx3QUFBQUFTVVZPUks1Q1lJST0nO1xuICAgICAgYXdhaXQgaGVscGVycy5maXhJbWFnZVRlbXBsYXRlU2NhbGUoVElOWV9QTkcsIHtcbiAgICAgICAgZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZTogNC4wLFxuICAgICAgICBmaXhJbWFnZVRlbXBsYXRlU2NhbGU6IGZhbHNlLFxuICAgICAgICB4U2NhbGU6IDEuNSwgeVNjYWxlOiAxLjVcbiAgICAgIH0pLnNob3VsZC5ldmVudHVhbGx5LmVxbChhY3R1YWwpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgZml4IHRlbXBsYXRlIHNpemUgc2NhbGUgYmVjYXVzZSBvZiBpZ25vcmVEZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgYXdhaXQgaGVscGVycy5maXhJbWFnZVRlbXBsYXRlU2NhbGUoVElOWV9QTkcsIHtcbiAgICAgICAgZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZTogNC4wLFxuICAgICAgICBpZ25vcmVEZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlOiB0cnVlLFxuICAgICAgfSkuc2hvdWxkLmV2ZW50dWFsbHkuZXFsKFRJTllfUE5HKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaWdub3JlIGRlZmF1bHRJbWFnZVRlbXBsYXRlU2NhbGUgdG8gZml4IHRlbXBsYXRlIHNpemUgc2NhbGUgYmVjYXVzZSBvZiBpZ25vcmVEZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgYWN0dWFsID0gJ2lWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBWUFBQUFHQ0FZQUFBRGd6TzlJQUFBQVdFbEVRVlI0QVUzQlFSV0FRQWhBd2EvUEdCc0VnckMxNkFGQktFSVBYVzdPWE8rUm1leTlpUWpNakhGenJMVXdNN3FicW1MY0hLcEtSRkJWdUR2ajRhZ3EzQjFWUlVRWVQyYlMzUXdSUVZVWkYvQ2FHUkhCM3djMXZTWmJITzUrQmdBQUFBQkpSVTVFcmtKZ2dnPT0nO1xuICAgICAgYXdhaXQgaGVscGVycy5maXhJbWFnZVRlbXBsYXRlU2NhbGUoVElOWV9QTkcsIHtcbiAgICAgICAgZGVmYXVsdEltYWdlVGVtcGxhdGVTY2FsZTogNC4wLFxuICAgICAgICBpZ25vcmVEZWZhdWx0SW1hZ2VUZW1wbGF0ZVNjYWxlOiB0cnVlLFxuICAgICAgICBmaXhJbWFnZVRlbXBsYXRlU2NhbGU6IHRydWUsXG4gICAgICAgIHhTY2FsZTogMS41LCB5U2NhbGU6IDEuNVxuICAgICAgfSkuc2hvdWxkLmV2ZW50dWFsbHkuZXFsKGFjdHVhbCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdlbnN1cmVUZW1wbGF0ZVNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoJ3Nob3VsZCBub3QgcmVzaXplIHRoZSB0ZW1wbGF0ZSBpZiBpdCBpcyBzbWFsbGVyIHRoYW4gdGhlIHNjcmVlbicsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHNjcmVlbiA9IFRJTllfUE5HX0RJTVMubWFwKChuKSA9PiBuICogMik7XG4gICAgICBjb25zdCBkID0gbmV3IFRlc3REcml2ZXIoKTtcbiAgICAgIGF3YWl0IGQuZW5zdXJlVGVtcGxhdGVTaXplKFRJTllfUE5HLCAuLi5zY3JlZW4pXG4gICAgICAgIC5zaG91bGQuZXZlbnR1YWxseS5lcWwoVElOWV9QTkcpO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgbm90IHJlc2l6ZSB0aGUgdGVtcGxhdGUgaWYgaXQgaXMgdGhlIHNhbWUgc2l6ZSBhcyB0aGUgc2NyZWVuJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZCA9IG5ldyBUZXN0RHJpdmVyKCk7XG4gICAgICBhd2FpdCBkLmVuc3VyZVRlbXBsYXRlU2l6ZShUSU5ZX1BORywgLi4uVElOWV9QTkdfRElNUylcbiAgICAgICAgLnNob3VsZC5ldmVudHVhbGx5LmVxbChUSU5ZX1BORyk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCByZXNpemUgdGhlIHRlbXBsYXRlIGlmIGl0IGlzIGJpZ2dlciB0aGFuIHRoZSBzY3JlZW4nLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBkID0gbmV3IFRlc3REcml2ZXIoKTtcbiAgICAgIGNvbnN0IHNjcmVlbiA9IFRJTllfUE5HX0RJTVMubWFwKChuKSA9PiBuIC8gMik7XG4gICAgICBjb25zdCBuZXdUZW1wbGF0ZSA9IGF3YWl0IGQuZW5zdXJlVGVtcGxhdGVTaXplKFRJTllfUE5HLCAuLi5zY3JlZW4pO1xuICAgICAgbmV3VGVtcGxhdGUuc2hvdWxkLm5vdC5lcWwoVElOWV9QTkcpO1xuICAgICAgbmV3VGVtcGxhdGUubGVuZ3RoLnNob3VsZC5iZS5iZWxvdyhUSU5ZX1BORy5sZW5ndGgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZ2V0U2NyZWVuc2hvdEZvckltYWdlRmluZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGZhaWwgaWYgZHJpdmVyIGRvZXMgbm90IHN1cHBvcnQgZ2V0U2NyZWVuc2hvdCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgQmFzZURyaXZlcigpO1xuICAgICAgYXdhaXQgZC5nZXRTY3JlZW5zaG90Rm9ySW1hZ2VGaW5kKClcbiAgICAgICAgLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkV2l0aCgvZHJpdmVyIGRvZXMgbm90IHN1cHBvcnQvKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIG5vdCBhZGp1c3Qgb3IgdmVyaWZ5IHNjcmVlbnNob3QgaWYgYXNrZWQgbm90IHRvIGJ5IHNldHRpbmdzJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZCA9IG5ldyBUZXN0RHJpdmVyKCk7XG4gICAgICBzaW5vbi5zdHViKGQsICdnZXRTY3JlZW5zaG90JykucmV0dXJucyhUSU5ZX1BORyk7XG4gICAgICBkLnNldHRpbmdzLnVwZGF0ZSh7Zml4SW1hZ2VGaW5kU2NyZWVuc2hvdERpbXM6IGZhbHNlfSk7XG4gICAgICBjb25zdCBzY3JlZW4gPSBUSU5ZX1BOR19ESU1TLm1hcCgobikgPT4gbiArIDEpO1xuICAgICAgY29uc3Qge2I2NFNjcmVlbnNob3QsIHNjYWxlfSA9IGF3YWl0IGQuZ2V0U2NyZWVuc2hvdEZvckltYWdlRmluZCguLi5zY3JlZW4pO1xuICAgICAgYjY0U2NyZWVuc2hvdC5zaG91bGQuZXFsKFRJTllfUE5HKTtcbiAgICAgIHNob3VsZC5lcXVhbChzY2FsZSwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBzY3JlZW5zaG90IHdpdGhvdXQgYWRqdXN0bWVudCBpZiBpdCBtYXRjaGVzIHNjcmVlbiBzaXplJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZCA9IG5ldyBUZXN0RHJpdmVyKCk7XG4gICAgICBzaW5vbi5zdHViKGQsICdnZXRTY3JlZW5zaG90JykucmV0dXJucyhUSU5ZX1BORyk7XG4gICAgICBjb25zdCB7YjY0U2NyZWVuc2hvdCwgc2NhbGV9ID0gYXdhaXQgZC5nZXRTY3JlZW5zaG90Rm9ySW1hZ2VGaW5kKC4uLlRJTllfUE5HX0RJTVMpO1xuICAgICAgYjY0U2NyZWVuc2hvdC5zaG91bGQuZXFsKFRJTllfUE5HKTtcbiAgICAgIHNob3VsZC5lcXVhbChzY2FsZSwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBzY2FsZWQgc2NyZWVuc2hvdCB3aXRoIHNhbWUgYXNwZWN0IHJhdGlvIGlmIG1hdGNoaW5nIHNjcmVlbiBhc3BlY3QgcmF0aW8nLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBkID0gbmV3IFRlc3REcml2ZXIoKTtcbiAgICAgIHNpbm9uLnN0dWIoZCwgJ2dldFNjcmVlbnNob3QnKS5yZXR1cm5zKFRJTllfUE5HKTtcbiAgICAgIGNvbnN0IHNjcmVlbiA9IFRJTllfUE5HX0RJTVMubWFwKChuKSA9PiBuICogMS41KTtcbiAgICAgIGNvbnN0IHtiNjRTY3JlZW5zaG90LCBzY2FsZX0gPSBhd2FpdCBkLmdldFNjcmVlbnNob3RGb3JJbWFnZUZpbmQoLi4uc2NyZWVuKTtcbiAgICAgIGI2NFNjcmVlbnNob3Quc2hvdWxkLm5vdC5lcWwoVElOWV9QTkcpO1xuICAgICAgY29uc3Qgc2NyZWVuc2hvdE9iaiA9IGF3YWl0IGltYWdlVXRpbC5nZXRKaW1wSW1hZ2UoYjY0U2NyZWVuc2hvdCk7XG4gICAgICBzY3JlZW5zaG90T2JqLmJpdG1hcC53aWR0aC5zaG91bGQuZXFsKHNjcmVlblswXSk7XG4gICAgICBzY3JlZW5zaG90T2JqLmJpdG1hcC5oZWlnaHQuc2hvdWxkLmVxbChzY3JlZW5bMV0pO1xuICAgICAgc2NhbGUuc2hvdWxkLmVxbCh7IHhTY2FsZTogMS41LCB5U2NhbGU6IDEuNSB9KTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBzY2FsZWQgc2NyZWVuc2hvdCB3aXRoIGRpZmZlcmVudCBhc3BlY3QgcmF0aW8gaWYgbm90IG1hdGNoaW5nIHNjcmVlbiBhc3BlY3QgcmF0aW8nLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBkID0gbmV3IFRlc3REcml2ZXIoKTtcbiAgICAgIHNpbm9uLnN0dWIoZCwgJ2dldFNjcmVlbnNob3QnKS5yZXR1cm5zKFRJTllfUE5HKTtcblxuICAgICAgLy8gdHJ5IGZpcnN0IHdpdGggcG9ydHJhaXQgc2NyZWVuLCBzY3JlZW4gPSA4IHggMTJcbiAgICAgIGxldCBzY3JlZW4gPSBbVElOWV9QTkdfRElNU1swXSAqIDIsIFRJTllfUE5HX0RJTVNbMV0gKiAzXTtcbiAgICAgIGxldCBleHBlY3RlZFNjYWxlID0geyB4U2NhbGU6IDIuNjcsIHlTY2FsZTogNCB9O1xuXG4gICAgICBjb25zdCB7YjY0U2NyZWVuc2hvdCwgc2NhbGV9ID0gYXdhaXQgZC5nZXRTY3JlZW5zaG90Rm9ySW1hZ2VGaW5kKC4uLnNjcmVlbik7XG4gICAgICBiNjRTY3JlZW5zaG90LnNob3VsZC5ub3QuZXFsKFRJTllfUE5HKTtcbiAgICAgIGxldCBzY3JlZW5zaG90T2JqID0gYXdhaXQgaW1hZ2VVdGlsLmdldEppbXBJbWFnZShiNjRTY3JlZW5zaG90KTtcbiAgICAgIHNjcmVlbnNob3RPYmouYml0bWFwLndpZHRoLnNob3VsZC5lcWwoc2NyZWVuWzBdKTtcbiAgICAgIHNjcmVlbnNob3RPYmouYml0bWFwLmhlaWdodC5zaG91bGQuZXFsKHNjcmVlblsxXSk7XG4gICAgICBzY2FsZS54U2NhbGUudG9GaXhlZCgyKS5zaG91bGQuZXFsKGV4cGVjdGVkU2NhbGUueFNjYWxlLnRvU3RyaW5nKCkpO1xuICAgICAgc2NhbGUueVNjYWxlLnNob3VsZC5lcWwoZXhwZWN0ZWRTY2FsZS55U2NhbGUpO1xuXG4gICAgICAvLyB0aGVuIHdpdGggbGFuZHNjYXBlIHNjcmVlbiwgc2NyZWVuID0gMTIgeCA4XG4gICAgICBzY3JlZW4gPSBbVElOWV9QTkdfRElNU1swXSAqIDMsIFRJTllfUE5HX0RJTVNbMV0gKiAyXTtcbiAgICAgIGV4cGVjdGVkU2NhbGUgPSB7IHhTY2FsZTogNCwgeVNjYWxlOiAyLjY3IH07XG5cbiAgICAgIGNvbnN0IHtiNjRTY3JlZW5zaG90OiBuZXdTY3JlZW4sIHNjYWxlOiBuZXdTY2FsZX0gPSBhd2FpdCBkLmdldFNjcmVlbnNob3RGb3JJbWFnZUZpbmQoLi4uc2NyZWVuKTtcbiAgICAgIG5ld1NjcmVlbi5zaG91bGQubm90LmVxbChUSU5ZX1BORyk7XG4gICAgICBzY3JlZW5zaG90T2JqID0gYXdhaXQgaW1hZ2VVdGlsLmdldEppbXBJbWFnZShuZXdTY3JlZW4pO1xuICAgICAgc2NyZWVuc2hvdE9iai5iaXRtYXAud2lkdGguc2hvdWxkLmVxbChzY3JlZW5bMF0pO1xuICAgICAgc2NyZWVuc2hvdE9iai5iaXRtYXAuaGVpZ2h0LnNob3VsZC5lcWwoc2NyZWVuWzFdKTtcbiAgICAgIG5ld1NjYWxlLnhTY2FsZS5zaG91bGQuZXFsKGV4cGVjdGVkU2NhbGUueFNjYWxlKTtcbiAgICAgIG5ld1NjYWxlLnlTY2FsZS50b0ZpeGVkKDIpLnNob3VsZC5lcWwoZXhwZWN0ZWRTY2FsZS55U2NhbGUudG9TdHJpbmcoKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBzY2FsZWQgc2NyZWVuc2hvdCB3aXRoIGRpZmZlcmVudCBhc3BlY3QgcmF0aW8gaWYgbm90IG1hdGNoaW5nIHNjcmVlbiBhc3BlY3QgcmF0aW8gd2l0aCBmaXhJbWFnZVRlbXBsYXRlU2NhbGUnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBkID0gbmV3IFRlc3REcml2ZXIoKTtcbiAgICAgIHNpbm9uLnN0dWIoZCwgJ2dldFNjcmVlbnNob3QnKS5yZXR1cm5zKFRJTllfUE5HKTtcblxuICAgICAgLy8gdHJ5IGZpcnN0IHdpdGggcG9ydHJhaXQgc2NyZWVuLCBzY3JlZW4gPSA4IHggMTJcbiAgICAgIGxldCBzY3JlZW4gPSBbVElOWV9QTkdfRElNU1swXSAqIDIsIFRJTllfUE5HX0RJTVNbMV0gKiAzXTtcbiAgICAgIGxldCBleHBlY3RlZFNjYWxlID0geyB4U2NhbGU6IDIuNjcsIHlTY2FsZTogNCB9O1xuXG4gICAgICBjb25zdCB7YjY0U2NyZWVuc2hvdCwgc2NhbGV9ID0gYXdhaXQgZC5nZXRTY3JlZW5zaG90Rm9ySW1hZ2VGaW5kKC4uLnNjcmVlbik7XG4gICAgICBiNjRTY3JlZW5zaG90LnNob3VsZC5ub3QuZXFsKFRJTllfUE5HKTtcbiAgICAgIGxldCBzY3JlZW5zaG90T2JqID0gYXdhaXQgaW1hZ2VVdGlsLmdldEppbXBJbWFnZShiNjRTY3JlZW5zaG90KTtcbiAgICAgIHNjcmVlbnNob3RPYmouYml0bWFwLndpZHRoLnNob3VsZC5lcWwoc2NyZWVuWzBdKTtcbiAgICAgIHNjcmVlbnNob3RPYmouYml0bWFwLmhlaWdodC5zaG91bGQuZXFsKHNjcmVlblsxXSk7XG4gICAgICBzY2FsZS54U2NhbGUudG9GaXhlZCgyKS5zaG91bGQuZXFsKGV4cGVjdGVkU2NhbGUueFNjYWxlLnRvU3RyaW5nKCkpO1xuICAgICAgc2NhbGUueVNjYWxlLnNob3VsZC5lcWwoZXhwZWN0ZWRTY2FsZS55U2NhbGUpO1xuICAgICAgLy8gOCB4IDEyIHN0cmV0Y2hlZCBUSU5ZX1BOR1xuICAgICAgYXdhaXQgaGVscGVycy5maXhJbWFnZVRlbXBsYXRlU2NhbGUoYjY0U2NyZWVuc2hvdCwge2ZpeEltYWdlVGVtcGxhdGVTY2FsZTogdHJ1ZSwgc2NhbGV9KVxuICAgICAgICAuc2hvdWxkLmV2ZW50dWFsbHkuZXFsKCdpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQWdBQUFBTUNBWUFBQUJmbnZ5ZEFBQUFKMGxFUVZSNEFZWEJBUUVBSUFDRE1LUi9wMGZUQnJLZGJaY1BDUklrU0pBZ1FZSUVDUklrUEF6QkExVHBlTndaQUFBQUFFbEZUa1N1UW1DQycpO1xuXG4gICAgICAvLyB0aGVuIHdpdGggbGFuZHNjYXBlIHNjcmVlbiwgc2NyZWVuID0gMTIgeCA4XG4gICAgICBzY3JlZW4gPSBbVElOWV9QTkdfRElNU1swXSAqIDMsIFRJTllfUE5HX0RJTVNbMV0gKiAyXTtcbiAgICAgIGV4cGVjdGVkU2NhbGUgPSB7IHhTY2FsZTogNCwgeVNjYWxlOiAyLjY3IH07XG5cbiAgICAgIGNvbnN0IHtiNjRTY3JlZW5zaG90OiBuZXdTY3JlZW4sIHNjYWxlOiBuZXdTY2FsZX0gPSBhd2FpdCBkLmdldFNjcmVlbnNob3RGb3JJbWFnZUZpbmQoLi4uc2NyZWVuKTtcbiAgICAgIG5ld1NjcmVlbi5zaG91bGQubm90LmVxbChUSU5ZX1BORyk7XG4gICAgICBzY3JlZW5zaG90T2JqID0gYXdhaXQgaW1hZ2VVdGlsLmdldEppbXBJbWFnZShuZXdTY3JlZW4pO1xuICAgICAgc2NyZWVuc2hvdE9iai5iaXRtYXAud2lkdGguc2hvdWxkLmVxbChzY3JlZW5bMF0pO1xuICAgICAgc2NyZWVuc2hvdE9iai5iaXRtYXAuaGVpZ2h0LnNob3VsZC5lcWwoc2NyZWVuWzFdKTtcbiAgICAgIG5ld1NjYWxlLnhTY2FsZS5zaG91bGQuZXFsKGV4cGVjdGVkU2NhbGUueFNjYWxlKTtcbiAgICAgIG5ld1NjYWxlLnlTY2FsZS50b0ZpeGVkKDIpLnNob3VsZC5lcWwoZXhwZWN0ZWRTY2FsZS55U2NhbGUudG9TdHJpbmcoKSk7XG4gICAgICAvLyAxMiB4IDggc3RyZXRjaGVkIFRJTllfUE5HXG4gICAgICBhd2FpdCBoZWxwZXJzLmZpeEltYWdlVGVtcGxhdGVTY2FsZShuZXdTY3JlZW4sIHtmaXhJbWFnZVRlbXBsYXRlU2NhbGU6IHRydWUsIHNjYWxlfSlcbiAgICAgICAgLnNob3VsZC5ldmVudHVhbGx5LmVxbCgnaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUF3QUFBQUlDQVlBQUFETjVCN3hBQUFBSTBsRVFWUjRBWlhCQVFFQU1BeURNSTUvVDVXMmF5QjUyNDVBSW9ra2trZ2lpU1Q2K1c0RFRMeW81UFVBQUFBQVNVVk9SSzVDWUlJPScpO1xuICAgIH0pO1xuXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjdXN0b20gZWxlbWVudCBmaW5kaW5nIHBsdWdpbnMnLCBmdW5jdGlvbiAoKSB7XG4gIC8vIGhhcHB5c1xuICBpdCgnc2hvdWxkIGZpbmQgYSBzaW5nbGUgZWxlbWVudCB1c2luZyBhIGN1c3RvbSBmaW5kZXInLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZCA9IG5ldyBCYXNlRHJpdmVyKCk7XG4gICAgZC5vcHRzLmN1c3RvbUZpbmRNb2R1bGVzID0ge2Y6IENVU1RPTV9GSU5EX01PRFVMRX07XG4gICAgYXdhaXQgZC5maW5kRWxlbWVudChDVVNUT01fU1RSQVRFR1ksICdmOmZvbycpLnNob3VsZC5ldmVudHVhbGx5LmVxbCgnYmFyJyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIG5vdCByZXF1aXJlIHNlbGVjdG9yIHByZWZpeCBpZiBvbmx5IG9uZSBmaW5kIHBsdWdpbiBpcyByZWdpc3RlcmVkJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGQgPSBuZXcgQmFzZURyaXZlcigpO1xuICAgIGQub3B0cy5jdXN0b21GaW5kTW9kdWxlcyA9IHtmOiBDVVNUT01fRklORF9NT0RVTEV9O1xuICAgIGF3YWl0IGQuZmluZEVsZW1lbnQoQ1VTVE9NX1NUUkFURUdZLCAnZm9vJykuc2hvdWxkLmV2ZW50dWFsbHkuZXFsKCdiYXInKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgZmluZCBtdWx0aXBsZSBlbGVtZW50cyB1c2luZyBhIGN1c3RvbSBmaW5kZXInLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZCA9IG5ldyBCYXNlRHJpdmVyKCk7XG4gICAgZC5vcHRzLmN1c3RvbUZpbmRNb2R1bGVzID0ge2Y6IENVU1RPTV9GSU5EX01PRFVMRX07XG4gICAgYXdhaXQgZC5maW5kRWxlbWVudHMoQ1VTVE9NX1NUUkFURUdZLCAnZjpmb29zJykuc2hvdWxkLmV2ZW50dWFsbHkuZXFsKFsnYmF6MScsICdiYXoyJ10pO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBnaXZlIGEgaGludCB0byB0aGUgcGx1Z2luIGFib3V0IHdoZXRoZXIgbXVsdGlwbGUgYXJlIHJlcXVlc3RlZCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBkID0gbmV3IEJhc2VEcml2ZXIoKTtcbiAgICBkLm9wdHMuY3VzdG9tRmluZE1vZHVsZXMgPSB7ZjogQ1VTVE9NX0ZJTkRfTU9EVUxFfTtcbiAgICBhd2FpdCBkLmZpbmRFbGVtZW50KENVU1RPTV9TVFJBVEVHWSwgJ2Y6Zm9vcycpLnNob3VsZC5ldmVudHVhbGx5LmVxbCgnYmFyMScpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIHVzZSBtdWx0aXBsZSBmaW5kIG1vZHVsZXMnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZCA9IG5ldyBCYXNlRHJpdmVyKCk7XG4gICAgZC5vcHRzLmN1c3RvbUZpbmRNb2R1bGVzID0ge2Y6IENVU1RPTV9GSU5EX01PRFVMRSwgZzogQ1VTVE9NX0ZJTkRfTU9EVUxFfTtcbiAgICBhd2FpdCBkLmZpbmRFbGVtZW50KENVU1RPTV9TVFJBVEVHWSwgJ2Y6Zm9vJykuc2hvdWxkLmV2ZW50dWFsbHkuZXFsKCdiYXInKTtcbiAgICBhd2FpdCBkLmZpbmRFbGVtZW50KENVU1RPTV9TVFJBVEVHWSwgJ2c6Zm9vJykuc2hvdWxkLmV2ZW50dWFsbHkuZXFsKCdiYXInKTtcbiAgfSk7XG5cbiAgLy8gZXJyb3JzXG4gIGl0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3IgaWYgY3VzdG9tRmluZE1vZHVsZXMgaXMgbm90IHNldCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBkID0gbmV3IEJhc2VEcml2ZXIoKTtcbiAgICBhd2FpdCBkLmZpbmRFbGVtZW50KENVU1RPTV9TVFJBVEVHWSwgJ2Y6Zm9vJykuc2hvdWxkLmV2ZW50dWFsbHkuYmUucmVqZWN0ZWRXaXRoKC9jdXN0b21GaW5kTW9kdWxlcy8pO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCB0aHJvdyBhbiBlcnJvciBpZiBjdXN0b21GaW5kTW9kdWxlcyBpcyB0aGUgd3Jvbmcgc2hhcGUnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZCA9IG5ldyBCYXNlRHJpdmVyKCk7XG4gICAgZC5vcHRzLmN1c3RvbUZpbmRNb2R1bGVzID0gQ1VTVE9NX0ZJTkRfTU9EVUxFO1xuICAgIGF3YWl0IGQuZmluZEVsZW1lbnQoQ1VTVE9NX1NUUkFURUdZLCAnZjpmb28nKS5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZFdpdGgoL2N1c3RvbUZpbmRNb2R1bGVzLyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHRocm93IGFuIGVycm9yIGlmIGN1c3RvbUZpbmRNb2R1bGVzIGlzIHNpemUgPiAxIGFuZCBubyBzZWxlY3RvciBwcmVmaXggaXMgdXNlZCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBkID0gbmV3IEJhc2VEcml2ZXIoKTtcbiAgICBkLm9wdHMuY3VzdG9tRmluZE1vZHVsZXMgPSB7ZjogQ1VTVE9NX0ZJTkRfTU9EVUxFLCBnOiBDVVNUT01fRklORF9NT0RVTEV9O1xuICAgIGF3YWl0IGQuZmluZEVsZW1lbnQoQ1VTVE9NX1NUUkFURUdZLCAnZm9vJykuc2hvdWxkLmV2ZW50dWFsbHkuYmUucmVqZWN0ZWRXaXRoKC9tdWx0aXBsZSBlbGVtZW50IGZpbmRpbmcvaSk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHRocm93IGFuIGVycm9yIGluIGF0dGVtcHQgdG8gdXNlIHVucmVnaXN0ZXJlZCBwbHVnaW4nLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZCA9IG5ldyBCYXNlRHJpdmVyKCk7XG4gICAgZC5vcHRzLmN1c3RvbUZpbmRNb2R1bGVzID0ge2Y6IENVU1RPTV9GSU5EX01PRFVMRSwgZzogQ1VTVE9NX0ZJTkRfTU9EVUxFfTtcbiAgICBhd2FpdCBkLmZpbmRFbGVtZW50KENVU1RPTV9TVFJBVEVHWSwgJ3o6Zm9vJykuc2hvdWxkLmV2ZW50dWFsbHkuYmUucmVqZWN0ZWRXaXRoKC93YXMgbm90IHJlZ2lzdGVyZWQvKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3IgaWYgcGx1Z2luIGNhbm5vdCBiZSBsb2FkZWQnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZCA9IG5ldyBCYXNlRHJpdmVyKCk7XG4gICAgZC5vcHRzLmN1c3RvbUZpbmRNb2R1bGVzID0ge2Y6ICcuL2Zvby5qcyd9O1xuICAgIGF3YWl0IGQuZmluZEVsZW1lbnQoQ1VTVE9NX1NUUkFURUdZLCAnZjpmb28nKS5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZFdpdGgoL2NvdWxkIG5vdCBsb2FkL2kpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCB0aHJvdyBhbiBlcnJvciBpZiBwbHVnaW4gaXMgbm90IHRoZSByaWdodCBzaGFwZScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBkID0gbmV3IEJhc2VEcml2ZXIoKTtcbiAgICBkLm9wdHMuY3VzdG9tRmluZE1vZHVsZXMgPSB7ZjogQkFEX0NVU1RPTV9GSU5EX01PRFVMRX07XG4gICAgYXdhaXQgZC5maW5kRWxlbWVudChDVVNUT01fU1RSQVRFR1ksICdmOmZvbycpLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkV2l0aCgvY29uc3RydWN0ZWQgY29ycmVjdGx5L2kpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBwYXNzIG9uIGFuIGVycm9yIHRocm93biBieSB0aGUgZmluZGVyIGl0c2VsZicsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBkID0gbmV3IEJhc2VEcml2ZXIoKTtcbiAgICBkLm9wdHMuY3VzdG9tRmluZE1vZHVsZXMgPSB7ZjogQ1VTVE9NX0ZJTkRfTU9EVUxFfTtcbiAgICBhd2FpdCBkLmZpbmRFbGVtZW50KENVU1RPTV9TVFJBVEVHWSwgJ2Y6ZXJyb3InKS5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZFdpdGgoL3BsdWdpbiBlcnJvci9pKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgdGhyb3cgbm8gc3VjaCBlbGVtZW50IGVycm9yIGlmIGVsZW1lbnQgbm90IGZvdW5kJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGQgPSBuZXcgQmFzZURyaXZlcigpO1xuICAgIGQub3B0cy5jdXN0b21GaW5kTW9kdWxlcyA9IHtmOiBDVVNUT01fRklORF9NT0RVTEV9O1xuICAgIGF3YWl0IGQuZmluZEVsZW1lbnQoQ1VTVE9NX1NUUkFURUdZLCAnZjpub3BlJykuc2hvdWxkLmV2ZW50dWFsbHkuYmUucmVqZWN0ZWRXaXRoKC9jb3VsZCBub3QgYmUgbG9jYXRlZC8pO1xuICB9KTtcbn0pO1xuIl0sImZpbGUiOiJ0ZXN0L2Jhc2Vkcml2ZXIvY29tbWFuZHMvZmluZC1zcGVjcy5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLiJ9
