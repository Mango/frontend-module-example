'use strict';

/**
 * Module dependencies.
 */
var Emitter = require('events').EventEmitter;
var util = require('util');
var inherits = util.inherits;
var extend = util._extend;

/**
 * Modal template.
 */
var template = require('./template.jade');

/**
 * jQuery or Zepto
 */
var $ = window.Zepto || window.jQuery;

/**
 * DOM elements
 */
var $body = $('body');
var $document = $(window.document);

/**
 * Defaults
 */
var defaults = {
  'closable': true
};

/**
 * Creates a new Modal.
 * @constructor
 * @augments Emitter
 * @param {Object} [options] - Options to customize a modal.
 * @param {(String | HTMLElement)} [options.content] - The content to be shown into a modal.
 * @param {Boolean} [options.closable] - Enables or disables if the user can close a modal.
 * @returns {modal} - Returns a new instance of Modal.
 * @example var modal = new Modal(options);
 */
function Modal(options) {

  options = options || {};

  // Clone defaults options.
  this._options = extend({}, defaults);
  extend(this._options, options);

  /**
   * Modal dom element.
   * @type {dom}
   * @public
   */
  this.$modal = $(template());

  /**
   * Content dom element.
   * @type {dom}
   * @public
   */
  this.$content = $('.modal-content', this.$modal);

  if (this._options.content) {
    this.$content.html(this._options.content);
  }

  this.closable(this._options.closable);

  return this;
};

/**
 * Inherits from Emitter.
 */
inherits(Modal, Emitter);

/**
 * Enables or disables if the user can close a modal.
 * @function
 * @param {Boolean} [closable] - If the value is false, the user can't close a modal.
 * @returns {modal} - Returns an instance of Modal.
 * @example
 * modal.closable();
 * @example
 * modal.closable(false);
 */
Modal.prototype.closable = function(closable) {
  closable = closable === undefined ? true : closable;
  this._options.closable = closable;
  this._closable(closable);

  return this;
};

/**
 * Enables or disables if the user can close a modal.
 * @function
 * @private
 * @param {Boolean} [closable] - If the value is false, the user can't close a modal.
 * @returns {modal} - Returns an instance of Modal.
 */
Modal.prototype._closable = function (closable) {
    var self = this;

  if (closable === false) {
    this.$modal.off('click');
    $document.off('keydown');
    return this;
  }

  // Close button and overlay
  this.$modal.on('click', function(eve) {
    var classname = eve.target.className;
    if (classname !== 'modal-container' && classname !== 'modal-close') { return; }
    self.hide();
  });

  // Esc
  $document.on('keydown', function(eve) {
    if (eve.keyCode !== 27 || document.activeElement !== document.body) { return; }
    self.hide();
  });
}

/**
 * Shows a modal.
 * @function
 * @returns {modal} - Returns an instance of Modal.
 * @example
 * modal.show();
 */
Modal.prototype.show = function() {

  if (this._shown) {
    return this;
  }

  this.emit('beforeshow');

  // Append a modal element
  $body.append(this.$modal);

  this.$modal.removeClass('modal-hide');

  if (this._options.closable) {
    this._closable();
  }

  this._shown = true;

  this.emit('show');

  return this;
};

/**
 * Hides a modal.
 * @function
 * @returns {modal} - Returns an instance of Modal.
 * @example
 * modal.hide();
 */
Modal.prototype.hide = function() {

  if (!this._shown) {
    return this;
  }

  this.emit('beforehide');

  this.$modal.addClass('modal-hide');

  this.$modal.remove();

  if (this._options.closable) {
    this._closable(false);
  }

  this._shown = false;

  this.emit('hide');

  return this;
};

/**
 * Sets a new content for a modal.
 * @function
 * @param {(String | HTMLElement)} [content] - The content to be shown into a modal.
 * @returns {modal} - Returns an instance of Modal.
 * @example
 * modal.setContent();
 */
Modal.prototype.setContent = function(content) {
  this.$content.html(content);
  this.emit('setcontent');
  return this;
};

/**
 * Get content from a modal.
 * @function
 * @returns {String}
 * @example
 * modal.getContent();
 */
Modal.prototype.getContent = function() {
  return this.$content.html();
};

/**
 * Returns a boolean specifying if a modal is shown or hidden.
 * @function
 * @returns {modal} - Returns an instance of Modal.
 * @example
 * modal.isShown();
 */
Modal.prototype.isShown = function () {
    return this._shown;
};

/**
 * Expose Modal
 */
module.exports = Modal;
