/*!
 * Isotope PACKAGED v2.2.0
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2015 Metafizzy
 */

/**
 * Bridget makes jQuery widgets
 * v1.1.0
 * MIT license
 */

( function( window ) {



// -------------------------- utils -------------------------- //

var slice = Array.prototype.slice;

function noop() {}

// -------------------------- definition -------------------------- //

function defineBridget( $ ) {

// bail if no jQuery
if ( !$ ) {
  return;
}

// -------------------------- addOptionMethod -------------------------- //

/**
 * adds option method -> $().plugin('option', {...})
 * @param {Function} PluginClass - constructor class
 */
function addOptionMethod( PluginClass ) {
  // don't overwrite original option method
  if ( PluginClass.prototype.option ) {
    return;
  }

  // option setter
  PluginClass.prototype.option = function( opts ) {
    // bail out if not an object
    if ( !$.isPlainObject( opts ) ){
      return;
    }
    this.options = $.extend( true, this.options, opts );
  };
}

// -------------------------- plugin bridge -------------------------- //

// helper function for logging errors
// $.error breaks jQuery chaining
var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

/**
 * jQuery plugin bridge, access methods like $elem.plugin('method')
 * @param {String} namespace - plugin name
 * @param {Function} PluginClass - constructor class
 */
function bridge( namespace, PluginClass ) {
  // add to jQuery fn namespace
  $.fn[ namespace ] = function( options ) {
    if ( typeof options === 'string' ) {
      // call plugin method when first argument is a string
      // get arguments for method
      var args = slice.call( arguments, 1 );

      for ( var i=0, len = this.length; i < len; i++ ) {
        var elem = this[i];
        var instance = $.data( elem, namespace );
        if ( !instance ) {
          logError( "cannot call methods on " + namespace + " prior to initialization; " +
            "attempted to call '" + options + "'" );
          continue;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
          logError( "no such method '" + options + "' for " + namespace + " instance" );
          continue;
        }

        // trigger method with arguments
        var returnValue = instance[ options ].apply( instance, args );

        // break look and return first value if provided
        if ( returnValue !== undefined ) {
          return returnValue;
        }
      }
      // return this if no return value
      return this;
    } else {
      return this.each( function() {
        var instance = $.data( this, namespace );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init();
        } else {
          // initialize new instance
          instance = new PluginClass( this, options );
          $.data( this, namespace, instance );
        }
      });
    }
  };

}

// -------------------------- bridget -------------------------- //

/**
 * converts a Prototypical class into a proper jQuery plugin
 *   the class must have a ._init method
 * @param {String} namespace - plugin name, used in $().pluginName
 * @param {Function} PluginClass - constructor class
 */
$.bridget = function( namespace, PluginClass ) {
  addOptionMethod( PluginClass );
  bridge( namespace, PluginClass );
};

return $.bridget;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'jquery-bridget/jquery.bridget',[ 'jquery' ], defineBridget );
} else if ( typeof exports === 'object' ) {
  defineBridget( require('jquery') );
} else {
  // get jquery from browser global
  defineBridget( window.jQuery );
}

})( window );

/*!
 * eventie v1.0.6
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( window );

/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define('eventEmitter/EventEmitter',[],function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));

/*!
 * getStyleProperty v1.0.4
 * original by kangax
 * http://perfectionkills.com/feature-testing-css-properties/
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false, exports: false, module: false */

( function( window ) {



var prefixes = 'Webkit Moz ms Ms O'.split(' ');
var docElemStyle = document.documentElement.style;

function getStyleProperty( propName ) {
  if ( !propName ) {
    return;
  }

  // test standard property first
  if ( typeof docElemStyle[ propName ] === 'string' ) {
    return propName;
  }

  // capitalize
  propName = propName.charAt(0).toUpperCase() + propName.slice(1);

  // test vendor specific properties
  var prefixed;
  for ( var i=0, len = prefixes.length; i < len; i++ ) {
    prefixed = prefixes[i] + propName;
    if ( typeof docElemStyle[ prefixed ] === 'string' ) {
      return prefixed;
    }
  }
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'get-style-property/get-style-property',[],function() {
    return getStyleProperty;
  });
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = getStyleProperty;
} else {
  // browser global
  window.getStyleProperty = getStyleProperty;
}

})( window );

/*!
 * getSize v1.2.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, exports: false, require: false, module: false, console: false */

( function( window, undefined ) {



// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') === -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}



function defineGetSize( getStyleProperty ) {

// -------------------------- setup -------------------------- //

var isSetup = false;

var getStyle, boxSizingProp, isBoxSizeOuter;

/**
 * setup vars and functions
 * do it on initial getSize(), rather than on script load
 * For Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  var getComputedStyle = window.getComputedStyle;
  getStyle = ( function() {
    var getStyleFn = getComputedStyle ?
      function( elem ) {
        return getComputedStyle( elem, null );
      } :
      function( elem ) {
        return elem.currentStyle;
      };

      return function getStyle( elem ) {
        var style = getStyleFn( elem );
        if ( !style ) {
          logError( 'Style returned ' + style +
            '. Are you running this code in a hidden iframe on Firefox? ' +
            'See http://bit.ly/getsizebug1' );
        }
        return style;
      };
  })();

  // -------------------------- box sizing -------------------------- //

  boxSizingProp = getStyleProperty('boxSizing');

  /**
   * WebKit measures the outer-width on style.width on border-box elems
   * IE & Firefox measures the inner-width
   */
  if ( boxSizingProp ) {
    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.padding = '1px 2px 3px 4px';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px 2px 3px 4px';
    div.style[ boxSizingProp ] = 'border-box';

    var body = document.body || document.documentElement;
    body.appendChild( div );
    var style = getStyle( div );

    isBoxSizeOuter = getStyleSize( style.width ) === 200;
    body.removeChild( div );
  }

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem === 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display === 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
    style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

  // get all measurements
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    value = mungeNonPixel( elem, value );
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

// IE8 returns percent values, not pixels
// taken from jQuery's curCSS
function mungeNonPixel( elem, value ) {
  // IE8 and has percent value
  if ( window.getComputedStyle || value.indexOf('%') === -1 ) {
    return value;
  }
  var style = elem.style;
  // Remember the original values
  var left = style.left;
  var rs = elem.runtimeStyle;
  var rsLeft = rs && rs.left;

  // Put in the new values to get a computed value out
  if ( rsLeft ) {
    rs.left = elem.currentStyle.left;
  }
  style.left = value;
  value = style.pixelLeft;

  // Revert the changed values
  style.left = left;
  if ( rsLeft ) {
    rs.left = rsLeft;
  }

  return value;
}

return getSize;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD for RequireJS
  define( 'get-size/get-size',[ 'get-style-property/get-style-property' ], defineGetSize );
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = defineGetSize( require('desandro-get-style-property') );
} else {
  // browser global
  window.getSize = defineGetSize( window.getStyleProperty );
}

})( window );

/*!
 * docReady v1.0.4
 * Cross browser DOMContentLoaded event emitter
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false, require: false, module: false */

( function( window ) {



var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
  // throw out non-functions
  if ( typeof fn !== 'function' ) {
    return;
  }

  if ( docReady.isReady ) {
    // ready now, hit it
    fn();
  } else {
    // queue function when ready
    queue.push( fn );
  }
}

docReady.isReady = false;

// triggered on various doc ready events
function onReady( event ) {
  // bail if already triggered or IE8 document is not ready just yet
  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
  if ( docReady.isReady || isIE8NotReady ) {
    return;
  }

  trigger();
}

function trigger() {
  docReady.isReady = true;
  // process queue
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var fn = queue[i];
    fn();
  }
}

function defineDocReady( eventie ) {
  // trigger ready if page is ready
  if ( document.readyState === 'complete' ) {
    trigger();
  } else {
    // listen for events
    eventie.bind( document, 'DOMContentLoaded', onReady );
    eventie.bind( document, 'readystatechange', onReady );
    eventie.bind( window, 'load', onReady );
  }

  return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'doc-ready/doc-ready',[ 'eventie/eventie' ], defineDocReady );
} else if ( typeof exports === 'object' ) {
  module.exports = defineDocReady( require('eventie') );
} else {
  // browser global
  window.docReady = defineDocReady( window.eventie );
}

})( window );

/**
 * matchesSelector v1.0.3
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( ElemProto ) {

  'use strict';

  var matchesMethod = ( function() {
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  // ----- match ----- //

  function match( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  }

  // ----- appendToFragment ----- //

  function checkParent( elem ) {
    // not needed if already has parent
    if ( elem.parentNode ) {
      return;
    }
    var fragment = document.createDocumentFragment();
    fragment.appendChild( elem );
  }

  // ----- query ----- //

  // fall back to using QSA
  // thx @jonathantneal https://gist.github.com/3062955
  function query( elem, selector ) {
    // append to fragment if no parent
    checkParent( elem );

    // match elem with all selected elems of parent
    var elems = elem.parentNode.querySelectorAll( selector );
    for ( var i=0, len = elems.length; i < len; i++ ) {
      // return true if match
      if ( elems[i] === elem ) {
        return true;
      }
    }
    // otherwise return false
    return false;
  }

  // ----- matchChild ----- //

  function matchChild( elem, selector ) {
    checkParent( elem );
    return match( elem, selector );
  }

  // ----- matchesSelector ----- //

  var matchesSelector;

  if ( matchesMethod ) {
    // IE9 supports matchesSelector, but doesn't work on orphaned elems
    // check for that
    var div = document.createElement('div');
    var supportsOrphans = match( div, 'div' );
    matchesSelector = supportsOrphans ? match : matchChild;
  } else {
    matchesSelector = query;
  }

  // transport
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'matches-selector/matches-selector',[],function() {
      return matchesSelector;
    });
  } else if ( typeof exports === 'object' ) {
    module.exports = matchesSelector;
  }
  else {
    // browser global
    window.matchesSelector = matchesSelector;
  }

})( Element.prototype );

/**
 * Fizzy UI utils v1.0.1
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  /*global define: false, module: false, require: false */
  'use strict';
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'fizzy-ui-utils/utils',[
      'doc-ready/doc-ready',
      'matches-selector/matches-selector'
    ], function( docReady, matchesSelector ) {
      return factory( window, docReady, matchesSelector );
    });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('doc-ready'),
      require('desandro-matches-selector')
    );
  } else {
    // browser global
    window.fizzyUIUtils = factory(
      window,
      window.docReady,
      window.matchesSelector
    );
  }

}( window, function factory( window, docReady, matchesSelector ) {



var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- isArray ----- //
  
var objToString = Object.prototype.toString;
utils.isArray = function( obj ) {
  return objToString.call( obj ) == '[object Array]';
};

// ----- makeArray ----- //

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  var ary = [];
  if ( utils.isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length == 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
};

// ----- indexOf ----- //

// index of helper cause IE8
utils.indexOf = Array.prototype.indexOf ? function( ary, obj ) {
    return ary.indexOf( obj );
  } : function( ary, obj ) {
    for ( var i=0, len = ary.length; i < len; i++ ) {
      if ( ary[i] === obj ) {
        return i;
      }
    }
    return -1;
  };

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = utils.indexOf( ary, obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- isElement ----- //

// http://stackoverflow.com/a/384380/182183
utils.isElement = ( typeof HTMLElement == 'function' || typeof HTMLElement == 'object' ) ?
  function isElementDOM2( obj ) {
    return obj instanceof HTMLElement;
  } :
  function isElementQuirky( obj ) {
    return obj && typeof obj == 'object' &&
      obj.nodeType == 1 && typeof obj.nodeName == 'string';
  };

// ----- setText ----- //

utils.setText = ( function() {
  var setTextProperty;
  function setText( elem, text ) {
    // only check setTextProperty once
    setTextProperty = setTextProperty || ( document.documentElement.textContent !== undefined ? 'textContent' : 'innerText' );
    elem[ setTextProperty ] = text;
  }
  return setText;
})();

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // check that elem is an actual element
    if ( !utils.isElement( elem ) ) {
      continue;
    }
    // filter & find items if we have a selector
    if ( selector ) {
      // filter siblings
      if ( matchesSelector( elem, selector ) ) {
        ffElems.push( elem );
      }
      // find children
      var childElems = elem.querySelectorAll( selector );
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        ffElems.push( childElems[j] );
      }
    } else {
      ffElems.push( elem );
    }
  }

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    if ( timeout ) {
      clearTimeout( timeout );
    }
    var args = arguments;

    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold || 100 );
  };
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-option attribute
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var elems = document.querySelectorAll( '.js-' + dashedNamespace );
    var dataAttr = 'data-' + dashedNamespace + '-options';

    for ( var i=0, len = elems.length; i < len; i++ ) {
      var elem = elems[i];
      var attr = elem.getAttribute( dataAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' +
            elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
            error );
        }
        continue;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('layoutname')
      var jQuery = window.jQuery;
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    }
  });
};

// -----  ----- //

return utils;

}));

/**
 * Outlayer Item
 */

( function( window, factory ) {
  'use strict';
  // universal module definition
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'outlayer/item',[
        'eventEmitter/EventEmitter',
        'get-size/get-size',
        'get-style-property/get-style-property',
        'fizzy-ui-utils/utils'
      ],
      function( EventEmitter, getSize, getStyleProperty, utils ) {
        return factory( window, EventEmitter, getSize, getStyleProperty, utils );
      }
    );
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('get-size'),
      require('desandro-get-style-property'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    window.Outlayer = {};
    window.Outlayer.Item = factory(
      window,
      window.EventEmitter,
      window.getSize,
      window.getStyleProperty,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, EventEmitter, getSize, getStyleProperty, utils ) {
'use strict';

// ----- helpers ----- //

var getComputedStyle = window.getComputedStyle;
var getStyle = getComputedStyle ?
  function( elem ) {
    return getComputedStyle( elem, null );
  } :
  function( elem ) {
    return elem.currentStyle;
  };


function isEmptyObj( obj ) {
  for ( var prop in obj ) {
    return false;
  }
  prop = null;
  return true;
}

// -------------------------- CSS3 support -------------------------- //

var transitionProperty = getStyleProperty('transition');
var transformProperty = getStyleProperty('transform');
var supportsCSS3 = transitionProperty && transformProperty;
var is3d = !!getStyleProperty('perspective');

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'otransitionend',
  transition: 'transitionend'
}[ transitionProperty ];

// properties that could have vendor prefix
var prefixableProperties = [
  'transform',
  'transition',
  'transitionDuration',
  'transitionProperty'
];

// cache all vendor properties
var vendorProperties = ( function() {
  var cache = {};
  for ( var i=0, len = prefixableProperties.length; i < len; i++ ) {
    var prop = prefixableProperties[i];
    var supportedProp = getStyleProperty( prop );
    if ( supportedProp && supportedProp !== prop ) {
      cache[ prop ] = supportedProp;
    }
  }
  return cache;
})();

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
  if ( !element ) {
    return;
  }

  this.element = element;
  // parent layout class, i.e. Masonry, Isotope, or Packery
  this.layout = layout;
  this.position = {
    x: 0,
    y: 0
  };

  this._create();
}

// inherit EventEmitter
utils.extend( Item.prototype, EventEmitter.prototype );

Item.prototype._create = function() {
  // transition objects
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };

  this.css({
    position: 'absolute'
  });
};

// trigger specified handler for event type
Item.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

Item.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
Item.prototype.css = function( style ) {
  var elemStyle = this.element.style;

  for ( var prop in style ) {
    // use vendor property if available
    var supportedProp = vendorProperties[ prop ] || prop;
    elemStyle[ supportedProp ] = style[ prop ];
  }
};

 // measure position, and sets it
Item.prototype.getPosition = function() {
  var style = getStyle( this.element );
  var layoutOptions = this.layout.options;
  var isOriginLeft = layoutOptions.isOriginLeft;
  var isOriginTop = layoutOptions.isOriginTop;
  var xValue = style[ isOriginLeft ? 'left' : 'right' ];
  var yValue = style[ isOriginTop ? 'top' : 'bottom' ];
  var x = parseInt( xValue, 10 );
  var y = parseInt( yValue, 10 );
  // convert percent to pixels
  var layoutSize = this.layout.size;
  x = xValue.indexOf('%') != -1 ? ( x / 100 ) * layoutSize.width : x;
  y = yValue.indexOf('%') != -1 ? ( y / 100 ) * layoutSize.height : y;

  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

  this.position.x = x;
  this.position.y = y;
};

// set settled position, apply padding
Item.prototype.layoutPosition = function() {
  var layoutSize = this.layout.size;
  var layoutOptions = this.layout.options;
  var style = {};

  // x
  var xPadding = layoutOptions.isOriginLeft ? 'paddingLeft' : 'paddingRight';
  var xProperty = layoutOptions.isOriginLeft ? 'left' : 'right';
  var xResetProperty = layoutOptions.isOriginLeft ? 'right' : 'left';

  var x = this.position.x + layoutSize[ xPadding ];
  // set in percentage or pixels
  style[ xProperty ] = this.getXValue( x );
  // reset other property
  style[ xResetProperty ] = '';

  // y
  var yPadding = layoutOptions.isOriginTop ? 'paddingTop' : 'paddingBottom';
  var yProperty = layoutOptions.isOriginTop ? 'top' : 'bottom';
  var yResetProperty = layoutOptions.isOriginTop ? 'bottom' : 'top';

  var y = this.position.y + layoutSize[ yPadding ];
  // set in percentage or pixels
  style[ yProperty ] = this.getYValue( y );
  // reset other property
  style[ yResetProperty ] = '';

  this.css( style );
  this.emitEvent( 'layout', [ this ] );
};

Item.prototype.getXValue = function( x ) {
  var layoutOptions = this.layout.options;
  return layoutOptions.percentPosition && !layoutOptions.isHorizontal ?
    ( ( x / this.layout.size.width ) * 100 ) + '%' : x + 'px';
};

Item.prototype.getYValue = function( y ) {
  var layoutOptions = this.layout.options;
  return layoutOptions.percentPosition && layoutOptions.isHorizontal ?
    ( ( y / this.layout.size.height ) * 100 ) + '%' : y + 'px';
};


Item.prototype._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var compareX = parseInt( x, 10 );
  var compareY = parseInt( y, 10 );
  var didNotMove = compareX === this.position.x && compareY === this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  transitionStyle.transform = this.getTranslate( transX, transY );

  this.transition({
    to: transitionStyle,
    onTransitionEnd: {
      transform: this.layoutPosition
    },
    isCleaning: true
  });
};

Item.prototype.getTranslate = function( x, y ) {
  // flip cooridinates if origin on right or bottom
  var layoutOptions = this.layout.options;
  x = layoutOptions.isOriginLeft ? x : -x;
  y = layoutOptions.isOriginTop ? y : -y;
  x = this.getXValue( x );
  y = this.getYValue( y );

  if ( is3d ) {
    return 'translate3d(' + x + ', ' + y + ', 0)';
  }

  return 'translate(' + x + ', ' + y + ')';
};

// non transition + transform support
Item.prototype.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

// use transition and transforms if supported
Item.prototype.moveTo = supportsCSS3 ?
  Item.prototype._transitionTo : Item.prototype.goTo;

Item.prototype.setPosition = function( x, y ) {
  this.position.x = parseInt( x, 10 );
  this.position.y = parseInt( y, 10 );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
Item.prototype._nonTransition = function( args ) {
  this.css( args.to );
  if ( args.isCleaning ) {
    this._removeStyles( args.to );
  }
  for ( var prop in args.onTransitionEnd ) {
    args.onTransitionEnd[ prop ].call( this );
  }
};

/**
 * proper transition
 * @param {Object} args - arguments
 *   @param {Object} to - style to transition to
 *   @param {Object} from - style to start transition from
 *   @param {Boolean} isCleaning - removes transition styles after transition
 *   @param {Function} onTransitionEnd - callback
 */
Item.prototype._transition = function( args ) {
  // redirect to nonTransition if no transition duration
  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
    this._nonTransition( args );
    return;
  }

  var _transition = this._transn;
  // keep track of onTransitionEnd callback by css property
  for ( var prop in args.onTransitionEnd ) {
    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
  }
  // keep track of properties that are transitioning
  for ( prop in args.to ) {
    _transition.ingProperties[ prop ] = true;
    // keep track of properties to clean up when transition is done
    if ( args.isCleaning ) {
      _transition.clean[ prop ] = true;
    }
  }

  // set from styles
  if ( args.from ) {
    this.css( args.from );
    // force redraw. http://blog.alexmaccaw.com/css-transitions
    var h = this.element.offsetHeight;
    // hack for JSHint to hush about unused var
    h = null;
  }
  // enable transition
  this.enableTransition( args.to );
  // set styles that are transitioning
  this.css( args.to );

  this.isTransitioning = true;

};

// dash before all cap letters, including first for
// WebkitTransform => -webkit-transform
function toDashedAll( str ) {
  return str.replace( /([A-Z])/g, function( $1 ) {
    return '-' + $1.toLowerCase();
  });
}

var transitionProps = 'opacity,' +
  toDashedAll( vendorProperties.transform || 'transform' );

Item.prototype.enableTransition = function(/* style */) {
  // HACK changing transitionProperty during a transition
  // will cause transition to jump
  if ( this.isTransitioning ) {
    return;
  }

  // make `transition: foo, bar, baz` from style object
  // HACK un-comment this when enableTransition can work
  // while a transition is happening
  // var transitionValues = [];
  // for ( var prop in style ) {
  //   // dash-ify camelCased properties like WebkitTransition
  //   prop = vendorProperties[ prop ] || prop;
  //   transitionValues.push( toDashedAll( prop ) );
  // }
  // enable transition styles
  this.css({
    transitionProperty: transitionProps,
    transitionDuration: this.layout.options.transitionDuration
  });
  // listen for transition end event
  this.element.addEventListener( transitionEndEvent, this, false );
};

Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

// ----- events ----- //

Item.prototype.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

Item.prototype.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
  '-webkit-transform': 'transform',
  '-moz-transform': 'transform',
  '-o-transform': 'transform'
};

Item.prototype.ontransitionend = function( event ) {
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }
  var _transition = this._transn;
  // get property name of transitioned property, convert to prefix-free
  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

  // remove property that has completed transitioning
  delete _transition.ingProperties[ propertyName ];
  // check if any properties are still transitioning
  if ( isEmptyObj( _transition.ingProperties ) ) {
    // all properties have completed transitioning
    this.disableTransition();
  }
  // clean style
  if ( propertyName in _transition.clean ) {
    // clean up style
    this.element.style[ event.propertyName ] = '';
    delete _transition.clean[ propertyName ];
  }
  // trigger onTransitionEnd callback
  if ( propertyName in _transition.onEnd ) {
    var onTransitionEnd = _transition.onEnd[ propertyName ];
    onTransitionEnd.call( this );
    delete _transition.onEnd[ propertyName ];
  }

  this.emitEvent( 'transitionEnd', [ this ] );
};

Item.prototype.disableTransition = function() {
  this.removeTransitionStyles();
  this.element.removeEventListener( transitionEndEvent, this, false );
  this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
Item.prototype._removeStyles = function( style ) {
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in style ) {
    cleanStyle[ prop ] = '';
  }
  this.css( cleanStyle );
};

var cleanTransitionStyle = {
  transitionProperty: '',
  transitionDuration: ''
};

Item.prototype.removeTransitionStyles = function() {
  // remove transition
  this.css( cleanTransitionStyle );
};

// ----- show/hide/remove ----- //

// remove element from DOM
Item.prototype.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  // remove display: none
  this.css({ display: '' });
  this.emitEvent( 'remove', [ this ] );
};

Item.prototype.remove = function() {
  // just remove element if no transition support or no transition
  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
    this.removeElem();
    return;
  }

  // start transition
  var _this = this;
  this.once( 'transitionEnd', function() {
    _this.removeElem();
  });
  this.hide();
};

Item.prototype.reveal = function() {
  delete this.isHidden;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onRevealTransitionEnd;

  this.transition({
    from: options.hiddenStyle,
    to: options.visibleStyle,
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

Item.prototype.onRevealTransitionEnd = function() {
  // check if still visible
  // during transition, item may have been hidden
  if ( !this.isHidden ) {
    this.emitEvent('reveal');
  }
};

/**
 * get style property use for hide/reveal transition end
 * @param {String} styleProperty - hiddenStyle/visibleStyle
 * @returns {String}
 */
Item.prototype.getHideRevealTransitionEndProperty = function( styleProperty ) {
  var optionStyle = this.layout.options[ styleProperty ];
  // use opacity
  if ( optionStyle.opacity ) {
    return 'opacity';
  }
  // get first property
  for ( var prop in optionStyle ) {
    return prop;
  }
};

Item.prototype.hide = function() {
  // set flag
  this.isHidden = true;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onHideTransitionEnd;

  this.transition({
    from: options.visibleStyle,
    to: options.hiddenStyle,
    // keep hidden stuff hidden
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

Item.prototype.onHideTransitionEnd = function() {
  // check if still hidden
  // during transition, item may have been un-hidden
  if ( this.isHidden ) {
    this.css({ display: 'none' });
    this.emitEvent('hide');
  }
};

Item.prototype.destroy = function() {
  this.css({
    position: '',
    left: '',
    right: '',
    top: '',
    bottom: '',
    transition: '',
    transform: ''
  });
};

return Item;

}));

/*!
 * Outlayer v1.4.1
 * the brains and guts of a layout library
 * MIT license
 */

( function( window, factory ) {
  'use strict';
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'outlayer/outlayer',[
        'eventie/eventie',
        'eventEmitter/EventEmitter',
        'get-size/get-size',
        'fizzy-ui-utils/utils',
        './item'
      ],
      function( eventie, EventEmitter, getSize, utils, Item ) {
        return factory( window, eventie, EventEmitter, getSize, utils, Item);
      }
    );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('eventie'),
      require('wolfy87-eventemitter'),
      require('get-size'),
      require('fizzy-ui-utils'),
      require('./item')
    );
  } else {
    // browser global
    window.Outlayer = factory(
      window,
      window.eventie,
      window.EventEmitter,
      window.getSize,
      window.fizzyUIUtils,
      window.Outlayer.Item
    );
  }

}( window, function factory( window, eventie, EventEmitter, getSize, utils, Item ) {
'use strict';

// ----- vars ----- //

var console = window.console;
var jQuery = window.jQuery;
var noop = function() {};

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for ' + this.constructor.namespace +
        ': ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }

  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // add id for Outlayer.getFromElement
  var id = ++GUID;
  this.element.outlayerGUID = id; // expando
  instances[ id ] = this; // associate via id

  // kick it off
  this._create();

  if ( this.options.isInitLayout ) {
    this.layout();
  }
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
  containerStyle: {
    position: 'relative'
  },
  isInitLayout: true,
  isOriginLeft: true,
  isOriginTop: true,
  isResizeBound: true,
  isResizingContainer: true,
  // item options
  transitionDuration: '0.4s',
  hiddenStyle: {
    opacity: 0,
    transform: 'scale(0.001)'
  },
  visibleStyle: {
    opacity: 1,
    transform: 'scale(1)'
  }
};

// inherit EventEmitter
utils.extend( Outlayer.prototype, EventEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
Outlayer.prototype.option = function( opts ) {
  utils.extend( this.options, opts );
};

Outlayer.prototype._create = function() {
  // get items from children
  this.reloadItems();
  // elements that affect layout, but are not laid out
  this.stamps = [];
  this.stamp( this.options.stamp );
  // set container style
  utils.extend( this.element.style, this.options.containerStyle );

  // bind resize method
  if ( this.options.isResizeBound ) {
    this.bindResize();
  }
};

// goes through all children again and gets bricks in proper order
Outlayer.prototype.reloadItems = function() {
  // collection of item elements
  this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
Outlayer.prototype._itemize = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );
  var Item = this.constructor.Item;

  // create new Outlayer Items for collection
  var items = [];
  for ( var i=0, len = itemElems.length; i < len; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
Outlayer.prototype._filterFindItemElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.itemSelector );
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
Outlayer.prototype.getItemElements = function() {
  var elems = [];
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    elems.push( this.items[i].element );
  }
  return elems;
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
Outlayer.prototype.layout = function() {
  this._resetLayout();
  this._manageStamps();

  // don't animate first layout
  var isInstant = this.options.isLayoutInstant !== undefined ?
    this.options.isLayoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
Outlayer.prototype._init = Outlayer.prototype.layout;

/**
 * logic before any new layout
 */
Outlayer.prototype._resetLayout = function() {
  this.getSize();
};


Outlayer.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
Outlayer.prototype._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    // use option as an element
    if ( typeof option === 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( utils.isElement( option ) ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @api public
 */
Outlayer.prototype.layoutItems = function( items, isInstant ) {
  items = this._getItemsForLayout( items );

  this._layoutItems( items, isInstant );

  this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
Outlayer.prototype._getItemsForLayout = function( items ) {
  var layoutItems = [];
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    if ( !item.isIgnored ) {
      layoutItems.push( item );
    }
  }
  return layoutItems;
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
Outlayer.prototype._layoutItems = function( items, isInstant ) {
  this._emitCompleteOnItems( 'layout', items );

  if ( !items || !items.length ) {
    // no items, emit event with empty array
    return;
  }

  var queue = [];

  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    // get x/y object from method
    var position = this._getItemLayoutPosition( item );
    // enqueue
    position.item = item;
    position.isInstant = isInstant || item.isLayoutInstant;
    queue.push( position );
  }

  this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
Outlayer.prototype._getItemLayoutPosition = function( /* item */ ) {
  return {
    x: 0,
    y: 0
  };
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
Outlayer.prototype._processLayoutQueue = function( queue ) {
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var obj = queue[i];
    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant );
  }
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
Outlayer.prototype._positionItem = function( item, x, y, isInstant ) {
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( x, y );
  } else {
    item.moveTo( x, y );
  }
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
Outlayer.prototype._postLayout = function() {
  this.resizeContainer();
};

Outlayer.prototype.resizeContainer = function() {
  if ( !this.options.isResizingContainer ) {
    return;
  }
  var size = this._getContainerSize();
  if ( size ) {
    this._setContainerMeasure( size.width, true );
    this._setContainerMeasure( size.height, false );
  }
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *   @param {Number} width
 *   @param {Number} height
 */
Outlayer.prototype._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
Outlayer.prototype._setContainerMeasure = function( measure, isWidth ) {
  if ( measure === undefined ) {
    return;
  }

  var elemSize = this.size;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
      elemSize.borderLeftWidth + elemSize.borderRightWidth :
      elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }

  measure = Math.max( measure, 0 );
  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * emit eventComplete on a collection of items events
 * @param {String} eventName
 * @param {Array} items - Outlayer.Items
 */
Outlayer.prototype._emitCompleteOnItems = function( eventName, items ) {
  var _this = this;
  function onComplete() {
    _this.dispatchEvent( eventName + 'Complete', null, [ items ] );
  }

  var count = items.length;
  if ( !items || !count ) {
    onComplete();
    return;
  }

  var doneCount = 0;
  function tick() {
    doneCount++;
    if ( doneCount === count ) {
      onComplete();
    }
  }

  // bind callback
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    item.once( eventName, tick );
  }
};

/**
 * emits events via eventEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
Outlayer.prototype.dispatchEvent = function( type, event, args ) {
  // add original event to arguments
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );

  if ( jQuery ) {
    // set this.$element
    this.$element = this.$element || jQuery( this.element );
    if ( event ) {
      // create jQuery event
      var $event = jQuery.Event( event );
      $event.type = type;
      this.$element.trigger( $event, args );
    } else {
      // just trigger with type if no event available
      this.$element.trigger( type, args );
    }
  }
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
Outlayer.prototype.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
Outlayer.prototype.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
Outlayer.prototype.stamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ) {
    return;
  }

  this.stamps = this.stamps.concat( elems );
  // ignore
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    this.ignore( elem );
  }
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
Outlayer.prototype.unstamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ){
    return;
  }

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // filter out removed stamp elements
    utils.removeFrom( this.stamps, elem );
    this.unignore( elem );
  }

};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
Outlayer.prototype._find = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems === 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = utils.makeArray( elems );
  return elems;
};

Outlayer.prototype._manageStamps = function() {
  if ( !this.stamps || !this.stamps.length ) {
    return;
  }

  this._getBoundingRect();

  for ( var i=0, len = this.stamps.length; i < len; i++ ) {
    var stamp = this.stamps[i];
    this._manageStamp( stamp );
  }
};

// update boundingLeft / Top
Outlayer.prototype._getBoundingRect = function() {
  // get bounding rect for container element
  var boundingRect = this.element.getBoundingClientRect();
  var size = this.size;
  this._boundingRect = {
    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
  };
};

/**
 * @param {Element} stamp
**/
Outlayer.prototype._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
Outlayer.prototype._getElementOffset = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var thisRect = this._boundingRect;
  var size = getSize( elem );
  var offset = {
    left: boundingRect.left - thisRect.left - size.marginLeft,
    top: boundingRect.top - thisRect.top - size.marginTop,
    right: thisRect.right - boundingRect.right - size.marginRight,
    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
  };
  return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
Outlayer.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

/**
 * Bind layout to window resizing
 */
Outlayer.prototype.bindResize = function() {
  // bind just one listener
  if ( this.isResizeBound ) {
    return;
  }
  eventie.bind( window, 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
Outlayer.prototype.unbindResize = function() {
  if ( this.isResizeBound ) {
    eventie.unbind( window, 'resize', this );
  }
  this.isResizeBound = false;
};

// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Outlayer.prototype.onresize = function() {
  if ( this.resizeTimeout ) {
    clearTimeout( this.resizeTimeout );
  }

  var _this = this;
  function delayed() {
    _this.resize();
    delete _this.resizeTimeout;
  }

  this.resizeTimeout = setTimeout( delayed, 100 );
};

// debounced, layout on resize
Outlayer.prototype.resize = function() {
  // don't trigger if size did not change
  // or if resize was unbound. See #9
  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
    return;
  }

  this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
Outlayer.prototype.needsResizeLayout = function() {
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
Outlayer.prototype.addItems = function( elems ) {
  var items = this._itemize( elems );
  // add items to collection
  if ( items.length ) {
    this.items = this.items.concat( items );
  }
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.prepended = function( elems ) {
  var items = this._itemize( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._resetLayout();
  this._manageStamps();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.reveal = function( items ) {
  this._emitCompleteOnItems( 'reveal', items );

  var len = items && items.length;
  for ( var i=0; len && i < len; i++ ) {
    var item = items[i];
    item.reveal();
  }
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.hide = function( items ) {
  this._emitCompleteOnItems( 'hide', items );

  var len = items && items.length;
  for ( var i=0; len && i < len; i++ ) {
    var item = items[i];
    item.hide();
  }
};

/**
 * reveal item elements
 * @param {Array}, {Element}, {NodeList} items
 */
Outlayer.prototype.revealItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.reveal( items );
};

/**
 * hide item elements
 * @param {Array}, {Element}, {NodeList} items
 */
Outlayer.prototype.hideItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.hide( items );
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
Outlayer.prototype.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    if ( item.element === elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
Outlayer.prototype.getItems = function( elems ) {
  elems = utils.makeArray( elems );
  var items = [];
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.remove = function( elems ) {
  var removeItems = this.getItems( elems );

  this._emitCompleteOnItems( 'remove', removeItems );

  // bail if no items to remove
  if ( !removeItems || !removeItems.length ) {
    return;
  }

  for ( var i=0, len = removeItems.length; i < len; i++ ) {
    var item = removeItems[i];
    item.remove();
    // remove item from collection
    utils.removeFrom( this.items, item );
  }
};

// ----- destroy ----- //

// remove and disable Outlayer instance
Outlayer.prototype.destroy = function() {
  // clean up dynamic styles
  var style = this.element.style;
  style.height = '';
  style.position = '';
  style.width = '';
  // destroy items
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    item.destroy();
  }

  this.unbindResize();

  var id = this.element.outlayerGUID;
  delete instances[ id ]; // remove reference to instance by id
  delete this.element.outlayerGUID;
  // remove data for jQuery
  if ( jQuery ) {
    jQuery.removeData( this.element, this.constructor.namespace );
  }

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.outlayerGUID;
  return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
  // sub-class Outlayer
  function Layout() {
    Outlayer.apply( this, arguments );
  }
  // inherit Outlayer prototype, use Object.create if there
  if ( Object.create ) {
    Layout.prototype = Object.create( Outlayer.prototype );
  } else {
    utils.extend( Layout.prototype, Outlayer.prototype );
  }
  // set contructor, used for namespace and Item
  Layout.prototype.constructor = Layout;

  Layout.defaults = utils.extend( {}, Outlayer.defaults );
  // apply new options
  utils.extend( Layout.defaults, options );
  // keep prototype.settings for backwards compatibility (Packery v1.2.0)
  Layout.prototype.settings = {};

  Layout.namespace = namespace;

  Layout.data = Outlayer.data;

  // sub-class Item
  Layout.Item = function LayoutItem() {
    Item.apply( this, arguments );
  };

  Layout.Item.prototype = new Item();

  // -------------------------- declarative -------------------------- //

  utils.htmlInit( Layout, namespace );

  // -------------------------- jQuery bridge -------------------------- //

  // make into jQuery plugin
  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( namespace, Layout );
  }

  return Layout;
};

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}));


/**
 * Isotope Item
**/

( function( window, factory ) {
'use strict';
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/js/item',[
        'outlayer/outlayer'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('outlayer')
    );
  } else {
    // browser global
    window.Isotope = window.Isotope || {};
    window.Isotope.Item = factory(
      window.Outlayer
    );
  }

}( window, function factory( Outlayer ) {
'use strict';

// -------------------------- Item -------------------------- //

// sub-class Outlayer Item
function Item() {
  Outlayer.Item.apply( this, arguments );
}

Item.prototype = new Outlayer.Item();

Item.prototype._create = function() {
  // assign id, used for original-order sorting
  this.id = this.layout.itemGUID++;
  Outlayer.Item.prototype._create.call( this );
  this.sortData = {};
};

Item.prototype.updateSortData = function() {
  if ( this.isIgnored ) {
    return;
  }
  // default sorters
  this.sortData.id = this.id;
  // for backward compatibility
  this.sortData['original-order'] = this.id;
  this.sortData.random = Math.random();
  // go thru getSortData obj and apply the sorters
  var getSortData = this.layout.options.getSortData;
  var sorters = this.layout._sorters;
  for ( var key in getSortData ) {
    var sorter = sorters[ key ];
    this.sortData[ key ] = sorter( this.element, this );
  }
};

var _destroy = Item.prototype.destroy;
Item.prototype.destroy = function() {
  // call super
  _destroy.apply( this, arguments );
  // reset display, #741
  this.css({
    display: ''
  });
};

return Item;

}));

/**
 * Isotope LayoutMode
 */

( function( window, factory ) {
  'use strict';
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/js/layout-mode',[
        'get-size/get-size',
        'outlayer/outlayer'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('get-size'),
      require('outlayer')
    );
  } else {
    // browser global
    window.Isotope = window.Isotope || {};
    window.Isotope.LayoutMode = factory(
      window.getSize,
      window.Outlayer
    );
  }

}( window, function factory( getSize, Outlayer ) {
  'use strict';

  // layout mode class
  function LayoutMode( isotope ) {
    this.isotope = isotope;
    // link properties
    if ( isotope ) {
      this.options = isotope.options[ this.namespace ];
      this.element = isotope.element;
      this.items = isotope.filteredItems;
      this.size = isotope.size;
    }
  }

  /**
   * some methods should just defer to default Outlayer method
   * and reference the Isotope instance as `this`
  **/
  ( function() {
    var facadeMethods = [
      '_resetLayout',
      '_getItemLayoutPosition',
      '_manageStamp',
      '_getContainerSize',
      '_getElementOffset',
      'needsResizeLayout'
    ];

    for ( var i=0, len = facadeMethods.length; i < len; i++ ) {
      var methodName = facadeMethods[i];
      LayoutMode.prototype[ methodName ] = getOutlayerMethod( methodName );
    }

    function getOutlayerMethod( methodName ) {
      return function() {
        return Outlayer.prototype[ methodName ].apply( this.isotope, arguments );
      };
    }
  })();

  // -----  ----- //

  // for horizontal layout modes, check vertical size
  LayoutMode.prototype.needsVerticalResizeLayout = function() {
    // don't trigger if size did not change
    var size = getSize( this.isotope.element );
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var hasSizes = this.isotope.size && size;
    return hasSizes && size.innerHeight != this.isotope.size.innerHeight;
  };

  // ----- measurements ----- //

  LayoutMode.prototype._getMeasurement = function() {
    this.isotope._getMeasurement.apply( this, arguments );
  };

  LayoutMode.prototype.getColumnWidth = function() {
    this.getSegmentSize( 'column', 'Width' );
  };

  LayoutMode.prototype.getRowHeight = function() {
    this.getSegmentSize( 'row', 'Height' );
  };

  /**
   * get columnWidth or rowHeight
   * segment: 'column' or 'row'
   * size 'Width' or 'Height'
  **/
  LayoutMode.prototype.getSegmentSize = function( segment, size ) {
    var segmentName = segment + size;
    var outerSize = 'outer' + size;
    // columnWidth / outerWidth // rowHeight / outerHeight
    this._getMeasurement( segmentName, outerSize );
    // got rowHeight or columnWidth, we can chill
    if ( this[ segmentName ] ) {
      return;
    }
    // fall back to item of first element
    var firstItemSize = this.getFirstItemSize();
    this[ segmentName ] = firstItemSize && firstItemSize[ outerSize ] ||
      // or size of container
      this.isotope.size[ 'inner' + size ];
  };

  LayoutMode.prototype.getFirstItemSize = function() {
    var firstItem = this.isotope.filteredItems[0];
    return firstItem && firstItem.element && getSize( firstItem.element );
  };

  // ----- methods that should reference isotope ----- //

  LayoutMode.prototype.layout = function() {
    this.isotope.layout.apply( this.isotope, arguments );
  };

  LayoutMode.prototype.getSize = function() {
    this.isotope.getSize();
    this.size = this.isotope.size;
  };

  // -------------------------- create -------------------------- //

  LayoutMode.modes = {};

  LayoutMode.create = function( namespace, options ) {

    function Mode() {
      LayoutMode.apply( this, arguments );
    }

    Mode.prototype = new LayoutMode();

    // default options
    if ( options ) {
      Mode.options = options;
    }

    Mode.prototype.namespace = namespace;
    // register in Isotope
    LayoutMode.modes[ namespace ] = Mode;

    return Mode;
  };

  return LayoutMode;

}));

/*!
 * Masonry v3.3.0
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

( function( window, factory ) {
  'use strict';
  // universal module definition
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'masonry/masonry',[
        'outlayer/outlayer',
        'get-size/get-size',
        'fizzy-ui-utils/utils'
      ],
      factory );
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = factory(
      require('outlayer'),
      require('get-size'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    window.Masonry = factory(
      window.Outlayer,
      window.getSize,
      window.fizzyUIUtils
    );
  }

}( window, function factory( Outlayer, getSize, utils ) {



// -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var Masonry = Outlayer.create('masonry');

  Masonry.prototype._resetLayout = function() {
    this.getSize();
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'gutter', 'outerWidth' );
    this.measureColumns();

    // reset column Y
    var i = this.cols;
    this.colYs = [];
    while (i--) {
      this.colYs.push( 0 );
    }

    this.maxY = 0;
  };

  Masonry.prototype.measureColumns = function() {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if ( !this.columnWidth ) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      // columnWidth fall back to item of first element
      this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
        // if first elem has no width, default to size of container
        this.containerWidth;
    }

    var columnWidth = this.columnWidth += this.gutter;

    // calculate columns
    var containerWidth = this.containerWidth + this.gutter;
    var cols = containerWidth / columnWidth;
    // fix rounding errors, typically with gutters
    var excess = columnWidth - containerWidth % columnWidth;
    // if overshoot is less than a pixel, round up, otherwise floor it
    var mathMethod = excess && excess < 1 ? 'round' : 'floor';
    cols = Math[ mathMethod ]( cols );
    this.cols = Math.max( cols, 1 );
  };

  Masonry.prototype.getContainerWidth = function() {
    // container is parent if fit width
    var container = this.options.isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize( container );
    this.containerWidth = size && size.innerWidth;
  };

  Masonry.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
    colSpan = Math.min( colSpan, this.cols );

    var colGroup = this._getColGroup( colSpan );
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, colGroup );
    var shortColIndex = utils.indexOf( colGroup, minimumY );

    // position the brick
    var position = {
      x: this.columnWidth * shortColIndex,
      y: minimumY
    };

    // apply setHeight to necessary columns
    var setHeight = minimumY + item.size.outerHeight;
    var setSpan = this.cols + 1 - colGroup.length;
    for ( var i = 0; i < setSpan; i++ ) {
      this.colYs[ shortColIndex + i ] = setHeight;
    }

    return position;
  };

  /**
   * @param {Number} colSpan - number of columns the element spans
   * @returns {Array} colGroup
   */
  Masonry.prototype._getColGroup = function( colSpan ) {
    if ( colSpan < 2 ) {
      // if brick spans only one column, use all the column Ys
      return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for ( var i = 0; i < groupCount; i++ ) {
      // make an array of colY values for that one group
      var groupColYs = this.colYs.slice( i, i + colSpan );
      // and get the max value of the array
      colGroup[i] = Math.max.apply( Math, groupColYs );
    }
    return colGroup;
  };

  Masonry.prototype._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this._getElementOffset( stamp );
    // get the columns that this stamp affects
    var firstX = this.options.isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor( firstX / this.columnWidth );
    firstCol = Math.max( 0, firstCol );
    var lastCol = Math.floor( lastX / this.columnWidth );
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min( this.cols - 1, lastCol );
    // set colYs to bottom of the stamp
    var stampMaxY = ( this.options.isOriginTop ? offset.top : offset.bottom ) +
      stampSize.outerHeight;
    for ( var i = firstCol; i <= lastCol; i++ ) {
      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
    }
  };

  Masonry.prototype._getContainerSize = function() {
    this.maxY = Math.max.apply( Math, this.colYs );
    var size = {
      height: this.maxY
    };

    if ( this.options.isFitWidth ) {
      size.width = this._getContainerFitWidth();
    }

    return size;
  };

  Masonry.prototype._getContainerFitWidth = function() {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while ( --i ) {
      if ( this.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    // fit container to columns that have been used
    return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
  };

  Masonry.prototype.needsResizeLayout = function() {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth !== this.containerWidth;
  };

  return Masonry;

}));

/*!
 * Masonry layout mode
 * sub-classes Masonry
 * http://masonry.desandro.com
 */

( function( window, factory ) {
  'use strict';
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/js/layout-modes/masonry',[
        '../layout-mode',
        'masonry/masonry'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode'),
      require('masonry-layout')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode,
      window.Masonry
    );
  }

}( window, function factory( LayoutMode, Masonry ) {
'use strict';

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

// -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var MasonryMode = LayoutMode.create('masonry');

  // save on to these methods
  var _getElementOffset = MasonryMode.prototype._getElementOffset;
  var layout = MasonryMode.prototype.layout;
  var _getMeasurement = MasonryMode.prototype._getMeasurement;

  // sub-class Masonry
  extend( MasonryMode.prototype, Masonry.prototype );

  // set back, as it was overwritten by Masonry
  MasonryMode.prototype._getElementOffset = _getElementOffset;
  MasonryMode.prototype.layout = layout;
  MasonryMode.prototype._getMeasurement = _getMeasurement;

  var measureColumns = MasonryMode.prototype.measureColumns;
  MasonryMode.prototype.measureColumns = function() {
    // set items, used if measuring first item
    this.items = this.isotope.filteredItems;
    measureColumns.call( this );
  };

  // HACK copy over isOriginLeft/Top options
  var _manageStamp = MasonryMode.prototype._manageStamp;
  MasonryMode.prototype._manageStamp = function() {
    this.options.isOriginLeft = this.isotope.options.isOriginLeft;
    this.options.isOriginTop = this.isotope.options.isOriginTop;
    _manageStamp.apply( this, arguments );
  };

  return MasonryMode;

}));

/**
 * fitRows layout mode
 */

( function( window, factory ) {
  'use strict';
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/js/layout-modes/fit-rows',[
        '../layout-mode'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( LayoutMode ) {
'use strict';

var FitRows = LayoutMode.create('fitRows');

FitRows.prototype._resetLayout = function() {
  this.x = 0;
  this.y = 0;
  this.maxY = 0;
  this._getMeasurement( 'gutter', 'outerWidth' );
};

FitRows.prototype._getItemLayoutPosition = function( item ) {
  item.getSize();

  var itemWidth = item.size.outerWidth + this.gutter;
  // if this element cannot fit in the current row
  var containerWidth = this.isotope.size.innerWidth + this.gutter;
  if ( this.x !== 0 && itemWidth + this.x > containerWidth ) {
    this.x = 0;
    this.y = this.maxY;
  }

  var position = {
    x: this.x,
    y: this.y
  };

  this.maxY = Math.max( this.maxY, this.y + item.size.outerHeight );
  this.x += itemWidth;

  return position;
};

FitRows.prototype._getContainerSize = function() {
  return { height: this.maxY };
};

return FitRows;

}));

/**
 * vertical layout mode
 */

( function( window, factory ) {
  'use strict';
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/js/layout-modes/vertical',[
        '../layout-mode'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( LayoutMode ) {
'use strict';

var Vertical = LayoutMode.create( 'vertical', {
  horizontalAlignment: 0
});

Vertical.prototype._resetLayout = function() {
  this.y = 0;
};

Vertical.prototype._getItemLayoutPosition = function( item ) {
  item.getSize();
  var x = ( this.isotope.size.innerWidth - item.size.outerWidth ) *
    this.options.horizontalAlignment;
  var y = this.y;
  this.y += item.size.outerHeight;
  return { x: x, y: y };
};

Vertical.prototype._getContainerSize = function() {
  return { height: this.y };
};

return Vertical;

}));

/*!
 * Isotope v2.2.0
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2015 Metafizzy
 */

( function( window, factory ) {
  'use strict';
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        'outlayer/outlayer',
        'get-size/get-size',
        'matches-selector/matches-selector',
        'fizzy-ui-utils/utils',
        'isotope/js/item',
        'isotope/js/layout-mode',
        // include default layout modes
        'isotope/js/layout-modes/masonry',
        'isotope/js/layout-modes/fit-rows',
        'isotope/js/layout-modes/vertical'
      ],
      function( Outlayer, getSize, matchesSelector, utils, Item, LayoutMode ) {
        return factory( window, Outlayer, getSize, matchesSelector, utils, Item, LayoutMode );
      });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('outlayer'),
      require('get-size'),
      require('desandro-matches-selector'),
      require('fizzy-ui-utils'),
      require('./item'),
      require('./layout-mode'),
      // include default layout modes
      require('./layout-modes/masonry'),
      require('./layout-modes/fit-rows'),
      require('./layout-modes/vertical')
    );
  } else {
    // browser global
    window.Isotope = factory(
      window,
      window.Outlayer,
      window.getSize,
      window.matchesSelector,
      window.fizzyUIUtils,
      window.Isotope.Item,
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( window, Outlayer, getSize, matchesSelector, utils,
  Item, LayoutMode ) {



// -------------------------- vars -------------------------- //

var jQuery = window.jQuery;

// -------------------------- helpers -------------------------- //

var trim = String.prototype.trim ?
  function( str ) {
    return str.trim();
  } :
  function( str ) {
    return str.replace( /^\s+|\s+$/g, '' );
  };

var docElem = document.documentElement;

var getText = docElem.textContent ?
  function( elem ) {
    return elem.textContent;
  } :
  function( elem ) {
    return elem.innerText;
  };

// -------------------------- isotopeDefinition -------------------------- //

  // create an Outlayer layout class
  var Isotope = Outlayer.create( 'isotope', {
    layoutMode: "masonry",
    isJQueryFiltering: true,
    sortAscending: true
  });

  Isotope.Item = Item;
  Isotope.LayoutMode = LayoutMode;

  Isotope.prototype._create = function() {
    this.itemGUID = 0;
    // functions that sort items
    this._sorters = {};
    this._getSorters();
    // call super
    Outlayer.prototype._create.call( this );

    // create layout modes
    this.modes = {};
    // start filteredItems with all items
    this.filteredItems = this.items;
    // keep of track of sortBys
    this.sortHistory = [ 'original-order' ];
    // create from registered layout modes
    for ( var name in LayoutMode.modes ) {
      this._initLayoutMode( name );
    }
  };

  Isotope.prototype.reloadItems = function() {
    // reset item ID counter
    this.itemGUID = 0;
    // call super
    Outlayer.prototype.reloadItems.call( this );
  };

  Isotope.prototype._itemize = function() {
    var items = Outlayer.prototype._itemize.apply( this, arguments );
    // assign ID for original-order
    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      item.id = this.itemGUID++;
    }
    this._updateItemsSortData( items );
    return items;
  };


  // -------------------------- layout -------------------------- //

  Isotope.prototype._initLayoutMode = function( name ) {
    var Mode = LayoutMode.modes[ name ];
    // set mode options
    // HACK extend initial options, back-fill in default options
    var initialOpts = this.options[ name ] || {};
    this.options[ name ] = Mode.options ?
      utils.extend( Mode.options, initialOpts ) : initialOpts;
    // init layout mode instance
    this.modes[ name ] = new Mode( this );
  };


  Isotope.prototype.layout = function() {
    // if first time doing layout, do all magic
    if ( !this._isLayoutInited && this.options.isInitLayout ) {
      this.arrange();
      return;
    }
    this._layout();
  };

  // private method to be used in layout() & magic()
  Isotope.prototype._layout = function() {
    // don't animate first layout
    var isInstant = this._getIsInstant();
    // layout flow
    this._resetLayout();
    this._manageStamps();
    this.layoutItems( this.filteredItems, isInstant );

    // flag for initalized
    this._isLayoutInited = true;
  };

  // filter + sort + layout
  Isotope.prototype.arrange = function( opts ) {
    // set any options pass
    this.option( opts );
    this._getIsInstant();
    // filter, sort, and layout

    // filter
    var filtered = this._filter( this.items );
    this.filteredItems = filtered.matches;

    var _this = this;
    function hideReveal() {
      _this.reveal( filtered.needReveal );
      _this.hide( filtered.needHide );
    }

    this._bindArrangeComplete();

    if ( this._isInstant ) {
      this._noTransition( hideReveal );
    } else {
      hideReveal();
    }

    this._sort();
    this._layout();
  };
  // alias to _init for main plugin method
  Isotope.prototype._init = Isotope.prototype.arrange;

  // HACK
  // Don't animate/transition first layout
  // Or don't animate/transition other layouts
  Isotope.prototype._getIsInstant = function() {
    var isInstant = this.options.isLayoutInstant !== undefined ?
      this.options.isLayoutInstant : !this._isLayoutInited;
    this._isInstant = isInstant;
    return isInstant;
  };

  // listen for layoutComplete, hideComplete and revealComplete
  // to trigger arrangeComplete
  Isotope.prototype._bindArrangeComplete = function() {
    // listen for 3 events to trigger arrangeComplete
    var isLayoutComplete, isHideComplete, isRevealComplete;
    var _this = this;
    function arrangeParallelCallback() {
      if ( isLayoutComplete && isHideComplete && isRevealComplete ) {
        _this.dispatchEvent( 'arrangeComplete', null, [ _this.filteredItems ] );
      }
    }
    this.once( 'layoutComplete', function() {
      isLayoutComplete = true;
      arrangeParallelCallback();
    });
    this.once( 'hideComplete', function() {
      isHideComplete = true;
      arrangeParallelCallback();
    });
    this.once( 'revealComplete', function() {
      isRevealComplete = true;
      arrangeParallelCallback();
    });
  };

  // -------------------------- filter -------------------------- //

  Isotope.prototype._filter = function( items ) {
    var filter = this.options.filter;
    filter = filter || '*';
    var matches = [];
    var hiddenMatched = [];
    var visibleUnmatched = [];

    var test = this._getFilterTest( filter );

    // test each item
    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      if ( item.isIgnored ) {
        continue;
      }
      // add item to either matched or unmatched group
      var isMatched = test( item );
      // item.isFilterMatched = isMatched;
      // add to matches if its a match
      if ( isMatched ) {
        matches.push( item );
      }
      // add to additional group if item needs to be hidden or revealed
      if ( isMatched && item.isHidden ) {
        hiddenMatched.push( item );
      } else if ( !isMatched && !item.isHidden ) {
        visibleUnmatched.push( item );
      }
    }

    // return collections of items to be manipulated
    return {
      matches: matches,
      needReveal: hiddenMatched,
      needHide: visibleUnmatched
    };
  };

  // get a jQuery, function, or a matchesSelector test given the filter
  Isotope.prototype._getFilterTest = function( filter ) {
    if ( jQuery && this.options.isJQueryFiltering ) {
      // use jQuery
      return function( item ) {
        return jQuery( item.element ).is( filter );
      };
    }
    if ( typeof filter == 'function' ) {
      // use filter as function
      return function( item ) {
        return filter( item.element );
      };
    }
    // default, use filter as selector string
    return function( item ) {
      return matchesSelector( item.element, filter );
    };
  };

  // -------------------------- sorting -------------------------- //

  /**
   * @params {Array} elems
   * @public
   */
  Isotope.prototype.updateSortData = function( elems ) {
    // get items
    var items;
    if ( elems ) {
      elems = utils.makeArray( elems );
      items = this.getItems( elems );
    } else {
      // update all items if no elems provided
      items = this.items;
    }

    this._getSorters();
    this._updateItemsSortData( items );
  };

  Isotope.prototype._getSorters = function() {
    var getSortData = this.options.getSortData;
    for ( var key in getSortData ) {
      var sorter = getSortData[ key ];
      this._sorters[ key ] = mungeSorter( sorter );
    }
  };

  /**
   * @params {Array} items - of Isotope.Items
   * @private
   */
  Isotope.prototype._updateItemsSortData = function( items ) {
    // do not update if no items
    var len = items && items.length;

    for ( var i=0; len && i < len; i++ ) {
      var item = items[i];
      item.updateSortData();
    }
  };

  // ----- munge sorter ----- //

  // encapsulate this, as we just need mungeSorter
  // other functions in here are just for munging
  var mungeSorter = ( function() {
    // add a magic layer to sorters for convienent shorthands
    // `.foo-bar` will use the text of .foo-bar querySelector
    // `[foo-bar]` will use attribute
    // you can also add parser
    // `.foo-bar parseInt` will parse that as a number
    function mungeSorter( sorter ) {
      // if not a string, return function or whatever it is
      if ( typeof sorter != 'string' ) {
        return sorter;
      }
      // parse the sorter string
      var args = trim( sorter ).split(' ');
      var query = args[0];
      // check if query looks like [an-attribute]
      var attrMatch = query.match( /^\[(.+)\]$/ );
      var attr = attrMatch && attrMatch[1];
      var getValue = getValueGetter( attr, query );
      // use second argument as a parser
      var parser = Isotope.sortDataParsers[ args[1] ];
      // parse the value, if there was a parser
      sorter = parser ? function( elem ) {
        return elem && parser( getValue( elem ) );
      } :
      // otherwise just return value
      function( elem ) {
        return elem && getValue( elem );
      };

      return sorter;
    }

    // get an attribute getter, or get text of the querySelector
    function getValueGetter( attr, query ) {
      var getValue;
      // if query looks like [foo-bar], get attribute
      if ( attr ) {
        getValue = function( elem ) {
          return elem.getAttribute( attr );
        };
      } else {
        // otherwise, assume its a querySelector, and get its text
        getValue = function( elem ) {
          var child = elem.querySelector( query );
          return child && getText( child );
        };
      }
      return getValue;
    }

    return mungeSorter;
  })();

  // parsers used in getSortData shortcut strings
  Isotope.sortDataParsers = {
    'parseInt': function( val ) {
      return parseInt( val, 10 );
    },
    'parseFloat': function( val ) {
      return parseFloat( val );
    }
  };

  // ----- sort method ----- //

  // sort filteredItem order
  Isotope.prototype._sort = function() {
    var sortByOpt = this.options.sortBy;
    if ( !sortByOpt ) {
      return;
    }
    // concat all sortBy and sortHistory
    var sortBys = [].concat.apply( sortByOpt, this.sortHistory );
    // sort magic
    var itemSorter = getItemSorter( sortBys, this.options.sortAscending );
    this.filteredItems.sort( itemSorter );
    // keep track of sortBy History
    if ( sortByOpt != this.sortHistory[0] ) {
      // add to front, oldest goes in last
      this.sortHistory.unshift( sortByOpt );
    }
  };

  // returns a function used for sorting
  function getItemSorter( sortBys, sortAsc ) {
    return function sorter( itemA, itemB ) {
      // cycle through all sortKeys
      for ( var i = 0, len = sortBys.length; i < len; i++ ) {
        var sortBy = sortBys[i];
        var a = itemA.sortData[ sortBy ];
        var b = itemB.sortData[ sortBy ];
        if ( a > b || a < b ) {
          // if sortAsc is an object, use the value given the sortBy key
          var isAscending = sortAsc[ sortBy ] !== undefined ? sortAsc[ sortBy ] : sortAsc;
          var direction = isAscending ? 1 : -1;
          return ( a > b ? 1 : -1 ) * direction;
        }
      }
      return 0;
    };
  }

  // -------------------------- methods -------------------------- //

  // get layout mode
  Isotope.prototype._mode = function() {
    var layoutMode = this.options.layoutMode;
    var mode = this.modes[ layoutMode ];
    if ( !mode ) {
      // TODO console.error
      throw new Error( 'No layout mode: ' + layoutMode );
    }
    // HACK sync mode's options
    // any options set after init for layout mode need to be synced
    mode.options = this.options[ layoutMode ];
    return mode;
  };

  Isotope.prototype._resetLayout = function() {
    // trigger original reset layout
    Outlayer.prototype._resetLayout.call( this );
    this._mode()._resetLayout();
  };

  Isotope.prototype._getItemLayoutPosition = function( item  ) {
    return this._mode()._getItemLayoutPosition( item );
  };

  Isotope.prototype._manageStamp = function( stamp ) {
    this._mode()._manageStamp( stamp );
  };

  Isotope.prototype._getContainerSize = function() {
    return this._mode()._getContainerSize();
  };

  Isotope.prototype.needsResizeLayout = function() {
    return this._mode().needsResizeLayout();
  };

  // -------------------------- adding & removing -------------------------- //

  // HEADS UP overwrites default Outlayer appended
  Isotope.prototype.appended = function( elems ) {
    var items = this.addItems( elems );
    if ( !items.length ) {
      return;
    }
    // filter, layout, reveal new items
    var filteredItems = this._filterRevealAdded( items );
    // add to filteredItems
    this.filteredItems = this.filteredItems.concat( filteredItems );
  };

  // HEADS UP overwrites default Outlayer prepended
  Isotope.prototype.prepended = function( elems ) {
    var items = this._itemize( elems );
    if ( !items.length ) {
      return;
    }
    // start new layout
    this._resetLayout();
    this._manageStamps();
    // filter, layout, reveal new items
    var filteredItems = this._filterRevealAdded( items );
    // layout previous items
    this.layoutItems( this.filteredItems );
    // add to items and filteredItems
    this.filteredItems = filteredItems.concat( this.filteredItems );
    this.items = items.concat( this.items );
  };

  Isotope.prototype._filterRevealAdded = function( items ) {
    var filtered = this._filter( items );
    this.hide( filtered.needHide );
    // reveal all new items
    this.reveal( filtered.matches );
    // layout new items, no transition
    this.layoutItems( filtered.matches, true );
    return filtered.matches;
  };

  /**
   * Filter, sort, and layout newly-appended item elements
   * @param {Array or NodeList or Element} elems
   */
  Isotope.prototype.insert = function( elems ) {
    var items = this.addItems( elems );
    if ( !items.length ) {
      return;
    }
    // append item elements
    var i, item;
    var len = items.length;
    for ( i=0; i < len; i++ ) {
      item = items[i];
      this.element.appendChild( item.element );
    }
    // filter new stuff
    var filteredInsertItems = this._filter( items ).matches;
    // set flag
    for ( i=0; i < len; i++ ) {
      items[i].isLayoutInstant = true;
    }
    this.arrange();
    // reset flag
    for ( i=0; i < len; i++ ) {
      delete items[i].isLayoutInstant;
    }
    this.reveal( filteredInsertItems );
  };

  var _remove = Isotope.prototype.remove;
  Isotope.prototype.remove = function( elems ) {
    elems = utils.makeArray( elems );
    var removeItems = this.getItems( elems );
    // do regular thing
    _remove.call( this, elems );
    // bail if no items to remove
    var len = removeItems && removeItems.length;
    if ( !len ) {
      return;
    }
    // remove elems from filteredItems
    for ( var i=0; i < len; i++ ) {
      var item = removeItems[i];
      // remove item from collection
      utils.removeFrom( this.filteredItems, item );
    }
  };

  Isotope.prototype.shuffle = function() {
    // update random sortData
    for ( var i=0, len = this.items.length; i < len; i++ ) {
      var item = this.items[i];
      item.sortData.random = Math.random();
    }
    this.options.sortBy = 'random';
    this._sort();
    this._layout();
  };

  /**
   * trigger fn without transition
   * kind of hacky to have this in the first place
   * @param {Function} fn
   * @returns ret
   * @private
   */
  Isotope.prototype._noTransition = function( fn ) {
    // save transitionDuration before disabling
    var transitionDuration = this.options.transitionDuration;
    // disable transition
    this.options.transitionDuration = 0;
    // do it
    var returnValue = fn.call( this );
    // re-enable transition for reveal
    this.options.transitionDuration = transitionDuration;
    return returnValue;
  };

  // ----- helper methods ----- //

  /**
   * getter method for getting filtered item elements
   * @returns {Array} elems - collection of item elements
   */
  Isotope.prototype.getFilteredItemElements = function() {
    var elems = [];
    for ( var i=0, len = this.filteredItems.length; i < len; i++ ) {
      elems.push( this.filteredItems[i].element );
    }
    return elems;
  };

  // -----  ----- //

  return Isotope;

}));

// Sticky Plugin v1.0.2 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 2/14/2011
// Date: 16/04/2015
// Website: http://labs.anthonygarand.com/sticky
// Description: Makes an element on the page stick on the screen as you scroll
//       It will only set the 'top' and 'position' of your element, you
//       might need to adjust the width in some cases.

(function($) {
    var slice = Array.prototype.slice; // save ref to original slice()
    var splice = Array.prototype.splice; // save ref to original slice()

  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper',
      center: false,
      getWidthFrom: '',
      widthFromWrapper: true, // works only when .getWidthFrom is empty
      responsiveWidth: false
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
      var scrollTop = $window.scrollTop(),
        documentHeight = $document.height(),
        dwh = documentHeight - windowHeight,
        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

      for (var i = 0; i < sticked.length; i++) {
        var s = sticked[i],
          elementTop = s.stickyWrapper.offset().top,
          etse = elementTop - s.topSpacing - extra;

        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            s.stickyElement
              .css({
                'width': '',
                'position': '',
                'top': ''
              });
            s.stickyElement.parent().removeClass(s.className);
            s.stickyElement.trigger('sticky-end', [s]);
            s.currentTop = null;
          }
        }
        else {
          var newTop = documentHeight - s.stickyElement.outerHeight()
            - s.topSpacing - s.bottomSpacing - scrollTop - extra;
          if (newTop < 0) {
            newTop = newTop + s.topSpacing;
          } else {
            newTop = s.topSpacing;
          }
          if (s.currentTop != newTop) {
            var newWidth;
            if ( s.getWidthFrom ) {
                newWidth = $(s.getWidthFrom).width() || null;
            }
            else if(s.widthFromWrapper) {
                newWidth = s.stickyWrapper.width();
            }
            if ( newWidth == null ) {
                newWidth = s.stickyElement.width();
            }
            s.stickyElement
              .css('width', newWidth)
              .css('position', 'fixed')
              .css('top', newTop);

            s.stickyElement.parent().addClass(s.className);

            if (s.currentTop === null) {
              s.stickyElement.trigger('sticky-start', [s]);
            } else {
              // sticky is started but it have to be repositioned
              s.stickyElement.trigger('sticky-update', [s]);
            }

            if (s.currentTop === s.topSpacing && s.currentTop > newTop || s.currentTop === null && newTop < s.topSpacing) {
              // just reached bottom || just started to stick but bottom is already reached
              s.stickyElement.trigger('sticky-bottom-reached', [s]);
            } else if(s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) {
              // sticky is started && sticked at topSpacing && overflowing from top just finished
              s.stickyElement.trigger('sticky-bottom-unreached', [s]);
            }

            s.currentTop = newTop;
          }
        }
      }
    },
    resizer = function() {
      windowHeight = $window.height();

      for (var i = 0; i < sticked.length; i++) {
        var s = sticked[i];
        var newWidth = null;
        if ( s.getWidthFrom ) {
            if ( s.responsiveWidth === true ) {
                newWidth = $(s.getWidthFrom).width();
            }
        }
        else if(s.widthFromWrapper) {
            newWidth = s.stickyWrapper.width();
        }
        if ( newWidth != null ) {
            s.stickyElement.css('width', newWidth);
        }
      }
    },
    methods = {
      init: function(options) {
        var o = $.extend({}, defaults, options);
        return this.each(function() {
          var stickyElement = $(this);

          var stickyId = stickyElement.attr('id');
          var stickyHeight = stickyElement.outerHeight();
          var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName
          var wrapper = $('<div></div>')
            .attr('id', wrapperId)
            .addClass(o.wrapperClassName);

          stickyElement.wrapAll(wrapper);

          var stickyWrapper = stickyElement.parent();

          if (o.center) {
            stickyWrapper.css({width:stickyElement.outerWidth(),marginLeft:"auto",marginRight:"auto"});
          }

          if (stickyElement.css("float") == "right") {
            stickyElement.css({"float":"none"}).parent().css({"float":"right"});
          }

          stickyWrapper.css('height', stickyHeight);

          o.stickyElement = stickyElement;
          o.stickyWrapper = stickyWrapper;
          o.currentTop    = null;

          sticked.push(o);
        });
      },
      update: scroller,
      unstick: function(options) {
        return this.each(function() {
          var that = this;
          var unstickyElement = $(that);

          var removeIdx = -1;
          var i = sticked.length;
          while ( i-- > 0 )
          {
            if (sticked[i].stickyElement.get(0) === that)
            {
                splice.call(sticked,i,1);
                removeIdx = i;
            }
          }
          if(removeIdx != -1)
          {
            unstickyElement.unwrap();
            unstickyElement
              .css({
                'width': '',
                'position': '',
                'top': '',
                'float': ''
              })
            ;
          }
        });
      }
    };

  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
  if (window.addEventListener) {
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', scroller);
    window.attachEvent('onresize', resizer);
  }

  $.fn.sticky = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };

  $.fn.unstick = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.unstick.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }

  };
  $(function() {
    setTimeout(scroller, 0);
  });
})(jQuery);

/**
 * Swiper 3.0.7
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * 
 * http://www.idangero.us/swiper/
 * 
 * Copyright 2015, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: April 25, 2015
 */
!function(){"use strict";function e(e){e.fn.swiper=function(t){var r;return e(this).each(function(){var e=new a(this,t);r||(r=e)}),r}}var a=function(e,r){function s(){return"horizontal"===g.params.direction}function i(){g.autoplayTimeoutId=setTimeout(function(){g.params.loop?(g.fixLoop(),g._slideNext()):g.isEnd?r.autoplayStopOnLast?g.stopAutoplay():g._slideTo(0):g._slideNext()},g.params.autoplay)}function n(e,a){var t=v(e.target);if(!t.is(a))if("string"==typeof a)t=t.parents(a);else if(a.nodeType){var r;return t.parents().each(function(e,t){t===a&&(r=a)}),r?a:void 0}return 0===t.length?void 0:t[0]}function o(e,a){a=a||{};var t=window.MutationObserver||window.WebkitMutationObserver,r=new t(function(e){e.forEach(function(e){g.onResize(!0),g.emit("onObserverUpdate",g,e)})});r.observe(e,{attributes:"undefined"==typeof a.attributes?!0:a.attributes,childList:"undefined"==typeof a.childList?!0:a.childList,characterData:"undefined"==typeof a.characterData?!0:a.characterData}),g.observers.push(r)}function l(e){e.originalEvent&&(e=e.originalEvent);var a=e.keyCode||e.charCode;if(!g.params.allowSwipeToNext&&(s()&&39===a||!s()&&40===a))return!1;if(!g.params.allowSwipeToPrev&&(s()&&37===a||!s()&&38===a))return!1;if(!(e.shiftKey||e.altKey||e.ctrlKey||e.metaKey||document.activeElement&&document.activeElement.nodeName&&("input"===document.activeElement.nodeName.toLowerCase()||"textarea"===document.activeElement.nodeName.toLowerCase()))){if(37===a||39===a||38===a||40===a){var t=!1;if(g.container.parents(".swiper-slide").length>0&&0===g.container.parents(".swiper-slide-active").length)return;for(var r={left:window.pageXOffset,top:window.pageYOffset},i=window.innerWidth,n=window.innerHeight,o=g.container.offset(),l=[[o.left,o.top],[o.left+g.width,o.top],[o.left,o.top+g.height],[o.left+g.width,o.top+g.height]],d=0;d<l.length;d++){var p=l[d];p[0]>=r.left&&p[0]<=r.left+i&&p[1]>=r.top&&p[1]<=r.top+n&&(t=!0)}if(!t)return}s()?((37===a||39===a)&&(e.preventDefault?e.preventDefault():e.returnValue=!1),39===a&&g.slideNext(),37===a&&g.slidePrev()):((38===a||40===a)&&(e.preventDefault?e.preventDefault():e.returnValue=!1),40===a&&g.slideNext(),38===a&&g.slidePrev())}}function d(e){e.originalEvent&&(e=e.originalEvent);var a=g._wheelEvent,t=0;if(e.detail)t=-e.detail;else if("mousewheel"===a)if(g.params.mousewheelForceToAxis)if(s()){if(!(Math.abs(e.wheelDeltaX)>Math.abs(e.wheelDeltaY)))return;t=e.wheelDeltaX}else{if(!(Math.abs(e.wheelDeltaY)>Math.abs(e.wheelDeltaX)))return;t=e.wheelDeltaY}else t=e.wheelDelta;else if("DOMMouseScroll"===a)t=-e.detail;else if("wheel"===a)if(g.params.mousewheelForceToAxis)if(s()){if(!(Math.abs(e.deltaX)>Math.abs(e.deltaY)))return;t=-e.deltaX}else{if(!(Math.abs(e.deltaY)>Math.abs(e.deltaX)))return;t=-e.deltaY}else t=Math.abs(e.deltaX)>Math.abs(e.deltaY)?-e.deltaX:-e.deltaY;if(g.params.freeMode){var r=g.getWrapperTranslate()+t;if(r>0&&(r=0),r<g.maxTranslate()&&(r=g.maxTranslate()),g.setWrapperTransition(0),g.setWrapperTranslate(r),g.updateProgress(),g.updateActiveIndex(),0===r||r===g.maxTranslate())return}else(new window.Date).getTime()-g._lastWheelScrollTime>60&&(0>t?g.slideNext():g.slidePrev()),g._lastWheelScrollTime=(new window.Date).getTime();return g.params.autoplay&&g.stopAutoplay(),e.preventDefault?e.preventDefault():e.returnValue=!1,!1}function p(e,a){e=v(e);var t,r,i;t=e.attr("data-swiper-parallax")||"0",r=e.attr("data-swiper-parallax-x"),i=e.attr("data-swiper-parallax-y"),r||i?(r=r||"0",i=i||"0"):s()?(r=t,i="0"):(i=t,r="0"),r=r.indexOf("%")>=0?parseInt(r,10)*a+"%":r*a+"px",i=i.indexOf("%")>=0?parseInt(i,10)*a+"%":i*a+"px",e.transform("translate3d("+r+", "+i+",0px)")}function u(e){return 0!==e.indexOf("on")&&(e=e[0]!==e[0].toUpperCase()?"on"+e[0].toUpperCase()+e.substring(1):"on"+e),e}if(!(this instanceof a))return new a(e,r);var c={direction:"horizontal",touchEventsTarget:"container",initialSlide:0,speed:300,autoplay:!1,autoplayDisableOnInteraction:!0,freeMode:!1,freeModeMomentum:!0,freeModeMomentumRatio:1,freeModeMomentumBounce:!0,freeModeMomentumBounceRatio:1,freeModeSticky:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",coverflow:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:!0},cube:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94},fade:{crossFade:!1},parallax:!1,scrollbar:null,scrollbarHide:!0,keyboardControl:!1,mousewheelControl:!1,mousewheelForceToAxis:!1,hashnav:!1,spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:"column",slidesPerGroup:1,centeredSlides:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,onlyExternal:!1,threshold:0,touchMoveStopPropagation:!0,pagination:null,paginationClickable:!1,paginationHide:!1,paginationBulletRender:null,resistance:!0,resistanceRatio:.85,nextButton:null,prevButton:null,watchSlidesProgress:!1,watchSlidesVisibility:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,lazyLoading:!1,lazyLoadingInPrevNext:!1,lazyLoadingOnTransitionStart:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,control:void 0,controlInverse:!1,allowSwipeToPrev:!0,allowSwipeToNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",slideClass:"swiper-slide",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slidePrevClass:"swiper-slide-prev",wrapperClass:"swiper-wrapper",bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active",buttonDisabledClass:"swiper-button-disabled",paginationHiddenClass:"swiper-pagination-hidden",observer:!1,observeParents:!1,a11y:!1,prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",runCallbacksOnInit:!0},m=r&&r.virtualTranslate;r=r||{};for(var f in c)if("undefined"==typeof r[f])r[f]=c[f];else if("object"==typeof r[f])for(var h in c[f])"undefined"==typeof r[f][h]&&(r[f][h]=c[f][h]);var g=this;g.version="3.0.7",g.params=r,g.classNames=[];var v;if(v="undefined"==typeof t?window.Dom7||window.Zepto||window.jQuery:t,v&&(g.$=v,g.container=v(e),0!==g.container.length)){if(g.container.length>1)return void g.container.each(function(){new a(this,r)});g.container[0].swiper=g,g.container.data("swiper",g),g.classNames.push("swiper-container-"+g.params.direction),g.params.freeMode&&g.classNames.push("swiper-container-free-mode"),g.support.flexbox||(g.classNames.push("swiper-container-no-flexbox"),g.params.slidesPerColumn=1),(g.params.parallax||g.params.watchSlidesVisibility)&&(g.params.watchSlidesProgress=!0),["cube","coverflow"].indexOf(g.params.effect)>=0&&(g.support.transforms3d?(g.params.watchSlidesProgress=!0,g.classNames.push("swiper-container-3d")):g.params.effect="slide"),"slide"!==g.params.effect&&g.classNames.push("swiper-container-"+g.params.effect),"cube"===g.params.effect&&(g.params.resistanceRatio=0,g.params.slidesPerView=1,g.params.slidesPerColumn=1,g.params.slidesPerGroup=1,g.params.centeredSlides=!1,g.params.spaceBetween=0,g.params.virtualTranslate=!0,g.params.setWrapperSize=!1),"fade"===g.params.effect&&(g.params.slidesPerView=1,g.params.slidesPerColumn=1,g.params.slidesPerGroup=1,g.params.watchSlidesProgress=!0,g.params.spaceBetween=0,"undefined"==typeof m&&(g.params.virtualTranslate=!0)),g.params.grabCursor&&g.support.touch&&(g.params.grabCursor=!1),g.wrapper=g.container.children("."+g.params.wrapperClass),g.params.pagination&&(g.paginationContainer=v(g.params.pagination),g.params.paginationClickable&&g.paginationContainer.addClass("swiper-pagination-clickable")),g.rtl=s()&&("rtl"===g.container[0].dir.toLowerCase()||"rtl"===g.container.css("direction")),g.rtl&&g.classNames.push("swiper-container-rtl"),g.rtl&&(g.wrongRTL="-webkit-box"===g.wrapper.css("display")),g.params.slidesPerColumn>1&&g.classNames.push("swiper-container-multirow"),g.device.android&&g.classNames.push("swiper-container-android"),g.container.addClass(g.classNames.join(" ")),g.translate=0,g.progress=0,g.velocity=0,g.lockSwipeToNext=function(){g.params.allowSwipeToNext=!1},g.lockSwipeToPrev=function(){g.params.allowSwipeToPrev=!1},g.lockSwipes=function(){g.params.allowSwipeToNext=g.params.allowSwipeToPrev=!1},g.unlockSwipeToNext=function(){g.params.allowSwipeToNext=!0},g.unlockSwipeToPrev=function(){g.params.allowSwipeToPrev=!0},g.unlockSwipes=function(){g.params.allowSwipeToNext=g.params.allowSwipeToPrev=!0},g.params.grabCursor&&(g.container[0].style.cursor="move",g.container[0].style.cursor="-webkit-grab",g.container[0].style.cursor="-moz-grab",g.container[0].style.cursor="grab"),g.imagesToLoad=[],g.imagesLoaded=0,g.loadImage=function(e,a,t,r){function s(){r&&r()}var i;e.complete&&t?s():a?(i=new window.Image,i.onload=s,i.onerror=s,i.src=a):s()},g.preloadImages=function(){function e(){"undefined"!=typeof g&&null!==g&&(void 0!==g.imagesLoaded&&g.imagesLoaded++,g.imagesLoaded===g.imagesToLoad.length&&(g.params.updateOnImagesReady&&g.update(),g.emit("onImagesReady",g)))}g.imagesToLoad=g.container.find("img");for(var a=0;a<g.imagesToLoad.length;a++)g.loadImage(g.imagesToLoad[a],g.imagesToLoad[a].currentSrc||g.imagesToLoad[a].getAttribute("src"),!0,e)},g.autoplayTimeoutId=void 0,g.autoplaying=!1,g.autoplayPaused=!1,g.startAutoplay=function(){return"undefined"!=typeof g.autoplayTimeoutId?!1:g.params.autoplay?g.autoplaying?!1:(g.autoplaying=!0,g.emit("onAutoplayStart",g),void i()):!1},g.stopAutoplay=function(e){g.autoplayTimeoutId&&(g.autoplayTimeoutId&&clearTimeout(g.autoplayTimeoutId),g.autoplaying=!1,g.autoplayTimeoutId=void 0,g.emit("onAutoplayStop",g))},g.pauseAutoplay=function(e){g.autoplayPaused||(g.autoplayTimeoutId&&clearTimeout(g.autoplayTimeoutId),g.autoplayPaused=!0,0===e?(g.autoplayPaused=!1,i()):g.wrapper.transitionEnd(function(){g&&(g.autoplayPaused=!1,g.autoplaying?i():g.stopAutoplay())}))},g.minTranslate=function(){return-g.snapGrid[0]},g.maxTranslate=function(){return-g.snapGrid[g.snapGrid.length-1]},g.updateContainerSize=function(){var e,a;e="undefined"!=typeof g.params.width?g.params.width:g.container[0].clientWidth,a="undefined"!=typeof g.params.height?g.params.height:g.container[0].clientHeight,0===e&&s()||0===a&&!s()||(g.width=e,g.height=a,g.size=s()?g.width:g.height)},g.updateSlidesSize=function(){g.slides=g.wrapper.children("."+g.params.slideClass),g.snapGrid=[],g.slidesGrid=[],g.slidesSizesGrid=[];var e,a=g.params.spaceBetween,t=0,r=0,i=0;"string"==typeof a&&a.indexOf("%")>=0&&(a=parseFloat(a.replace("%",""))/100*g.size),g.virtualSize=-a,g.slides.css(g.rtl?{marginLeft:"",marginTop:""}:{marginRight:"",marginBottom:""});var n;g.params.slidesPerColumn>1&&(n=Math.floor(g.slides.length/g.params.slidesPerColumn)===g.slides.length/g.params.slidesPerColumn?g.slides.length:Math.ceil(g.slides.length/g.params.slidesPerColumn)*g.params.slidesPerColumn);var o;for(e=0;e<g.slides.length;e++){o=0;var l=g.slides.eq(e);if(g.params.slidesPerColumn>1){var d,p,u,c,m=g.params.slidesPerColumn;"column"===g.params.slidesPerColumnFill?(p=Math.floor(e/m),u=e-p*m,d=p+u*n/m,l.css({"-webkit-box-ordinal-group":d,"-moz-box-ordinal-group":d,"-ms-flex-order":d,"-webkit-order":d,order:d})):(c=n/m,u=Math.floor(e/c),p=e-u*c),l.css({"margin-top":0!==u&&g.params.spaceBetween&&g.params.spaceBetween+"px"}).attr("data-swiper-column",p).attr("data-swiper-row",u)}"none"!==l.css("display")&&("auto"===g.params.slidesPerView?o=s()?l.outerWidth(!0):l.outerHeight(!0):(o=(g.size-(g.params.slidesPerView-1)*a)/g.params.slidesPerView,s()?g.slides[e].style.width=o+"px":g.slides[e].style.height=o+"px"),g.slides[e].swiperSlideSize=o,g.slidesSizesGrid.push(o),g.params.centeredSlides?(t=t+o/2+r/2+a,0===e&&(t=t-g.size/2-a),Math.abs(t)<.001&&(t=0),i%g.params.slidesPerGroup===0&&g.snapGrid.push(t),g.slidesGrid.push(t)):(i%g.params.slidesPerGroup===0&&g.snapGrid.push(t),g.slidesGrid.push(t),t=t+o+a),g.virtualSize+=o+a,r=o,i++)}g.virtualSize=Math.max(g.virtualSize,g.size);var f;if(g.rtl&&g.wrongRTL&&("slide"===g.params.effect||"coverflow"===g.params.effect)&&g.wrapper.css({width:g.virtualSize+g.params.spaceBetween+"px"}),(!g.support.flexbox||g.params.setWrapperSize)&&g.wrapper.css(s()?{width:g.virtualSize+g.params.spaceBetween+"px"}:{height:g.virtualSize+g.params.spaceBetween+"px"}),g.params.slidesPerColumn>1&&(g.virtualSize=(o+g.params.spaceBetween)*n,g.virtualSize=Math.ceil(g.virtualSize/g.params.slidesPerColumn)-g.params.spaceBetween,g.wrapper.css({width:g.virtualSize+g.params.spaceBetween+"px"}),g.params.centeredSlides)){for(f=[],e=0;e<g.snapGrid.length;e++)g.snapGrid[e]<g.virtualSize+g.snapGrid[0]&&f.push(g.snapGrid[e]);g.snapGrid=f}if(!g.params.centeredSlides){for(f=[],e=0;e<g.snapGrid.length;e++)g.snapGrid[e]<=g.virtualSize-g.size&&f.push(g.snapGrid[e]);g.snapGrid=f,Math.floor(g.virtualSize-g.size)>Math.floor(g.snapGrid[g.snapGrid.length-1])&&g.snapGrid.push(g.virtualSize-g.size)}0===g.snapGrid.length&&(g.snapGrid=[0]),0!==g.params.spaceBetween&&g.slides.css(s()?g.rtl?{marginLeft:a+"px"}:{marginRight:a+"px"}:{marginBottom:a+"px"}),g.params.watchSlidesProgress&&g.updateSlidesOffset()},g.updateSlidesOffset=function(){for(var e=0;e<g.slides.length;e++)g.slides[e].swiperSlideOffset=s()?g.slides[e].offsetLeft:g.slides[e].offsetTop},g.updateSlidesProgress=function(e){if("undefined"==typeof e&&(e=g.translate||0),0!==g.slides.length){"undefined"==typeof g.slides[0].swiperSlideOffset&&g.updateSlidesOffset();var a=g.params.centeredSlides?-e+g.size/2:-e;g.rtl&&(a=g.params.centeredSlides?e-g.size/2:e);{g.container[0].getBoundingClientRect(),s()?"left":"top",s()?"right":"bottom"}g.slides.removeClass(g.params.slideVisibleClass);for(var t=0;t<g.slides.length;t++){var r=g.slides[t],i=g.params.centeredSlides===!0?r.swiperSlideSize/2:0,n=(a-r.swiperSlideOffset-i)/(r.swiperSlideSize+g.params.spaceBetween);if(g.params.watchSlidesVisibility){var o=-(a-r.swiperSlideOffset-i),l=o+g.slidesSizesGrid[t],d=o>=0&&o<g.size||l>0&&l<=g.size||0>=o&&l>=g.size;d&&g.slides.eq(t).addClass(g.params.slideVisibleClass)}r.progress=g.rtl?-n:n}}},g.updateProgress=function(e){"undefined"==typeof e&&(e=g.translate||0);var a=g.maxTranslate()-g.minTranslate();0===a?(g.progress=0,g.isBeginning=g.isEnd=!0):(g.progress=(e-g.minTranslate())/a,g.isBeginning=g.progress<=0,g.isEnd=g.progress>=1),g.isBeginning&&g.emit("onReachBeginning",g),g.isEnd&&g.emit("onReachEnd",g),g.params.watchSlidesProgress&&g.updateSlidesProgress(e),g.emit("onProgress",g,g.progress)},g.updateActiveIndex=function(){var e,a,t,r=g.rtl?g.translate:-g.translate;for(a=0;a<g.slidesGrid.length;a++)"undefined"!=typeof g.slidesGrid[a+1]?r>=g.slidesGrid[a]&&r<g.slidesGrid[a+1]-(g.slidesGrid[a+1]-g.slidesGrid[a])/2?e=a:r>=g.slidesGrid[a]&&r<g.slidesGrid[a+1]&&(e=a+1):r>=g.slidesGrid[a]&&(e=a);(0>e||"undefined"==typeof e)&&(e=0),t=Math.floor(e/g.params.slidesPerGroup),t>=g.snapGrid.length&&(t=g.snapGrid.length-1),e!==g.activeIndex&&(g.snapIndex=t,g.previousIndex=g.activeIndex,g.activeIndex=e,g.updateClasses())},g.updateClasses=function(){g.slides.removeClass(g.params.slideActiveClass+" "+g.params.slideNextClass+" "+g.params.slidePrevClass);var e=g.slides.eq(g.activeIndex);if(e.addClass(g.params.slideActiveClass),e.next("."+g.params.slideClass).addClass(g.params.slideNextClass),e.prev("."+g.params.slideClass).addClass(g.params.slidePrevClass),g.bullets&&g.bullets.length>0){g.bullets.removeClass(g.params.bulletActiveClass);var a;g.params.loop?(a=Math.ceil(g.activeIndex-g.loopedSlides)/g.params.slidesPerGroup,a>g.slides.length-1-2*g.loopedSlides&&(a-=g.slides.length-2*g.loopedSlides),a>g.bullets.length-1&&(a-=g.bullets.length)):a="undefined"!=typeof g.snapIndex?g.snapIndex:g.activeIndex||0,g.paginationContainer.length>1?g.bullets.each(function(){v(this).index()===a&&v(this).addClass(g.params.bulletActiveClass)}):g.bullets.eq(a).addClass(g.params.bulletActiveClass)}g.params.loop||(g.params.prevButton&&(g.isBeginning?(v(g.params.prevButton).addClass(g.params.buttonDisabledClass),g.params.a11y&&g.a11y&&g.a11y.disable(v(g.params.prevButton))):(v(g.params.prevButton).removeClass(g.params.buttonDisabledClass),g.params.a11y&&g.a11y&&g.a11y.enable(v(g.params.prevButton)))),g.params.nextButton&&(g.isEnd?(v(g.params.nextButton).addClass(g.params.buttonDisabledClass),g.params.a11y&&g.a11y&&g.a11y.disable(v(g.params.nextButton))):(v(g.params.nextButton).removeClass(g.params.buttonDisabledClass),g.params.a11y&&g.a11y&&g.a11y.enable(v(g.params.nextButton)))))},g.updatePagination=function(){if(g.params.pagination&&g.paginationContainer&&g.paginationContainer.length>0){for(var e="",a=g.params.loop?Math.ceil((g.slides.length-2*g.loopedSlides)/g.params.slidesPerGroup):g.snapGrid.length,t=0;a>t;t++)e+=g.params.paginationBulletRender?g.params.paginationBulletRender(t,g.params.bulletClass):'<span class="'+g.params.bulletClass+'"></span>';g.paginationContainer.html(e),g.bullets=g.paginationContainer.find("."+g.params.bulletClass)}},g.update=function(e){function a(){r=Math.min(Math.max(g.translate,g.maxTranslate()),g.minTranslate()),g.setWrapperTranslate(r),g.updateActiveIndex(),g.updateClasses()}if(g.updateContainerSize(),g.updateSlidesSize(),g.updateProgress(),g.updatePagination(),g.updateClasses(),g.params.scrollbar&&g.scrollbar&&g.scrollbar.set(),e){var t,r;g.params.freeMode?a():(t="auto"===g.params.slidesPerView&&g.isEnd&&!g.params.centeredSlides?g.slideTo(g.slides.length-1,0,!1,!0):g.slideTo(g.activeIndex,0,!1,!0),t||a())}},g.onResize=function(e){if(g.updateContainerSize(),g.updateSlidesSize(),g.updateProgress(),("auto"===g.params.slidesPerView||g.params.freeMode||e)&&g.updatePagination(),g.params.scrollbar&&g.scrollbar&&g.scrollbar.set(),g.params.freeMode){var a=Math.min(Math.max(g.translate,g.maxTranslate()),g.minTranslate());g.setWrapperTranslate(a),g.updateActiveIndex(),g.updateClasses()}else g.updateClasses(),"auto"===g.params.slidesPerView&&g.isEnd&&!g.params.centeredSlides?g.slideTo(g.slides.length-1,0,!1,!0):g.slideTo(g.activeIndex,0,!1,!0)};var w=["mousedown","mousemove","mouseup"];window.navigator.pointerEnabled?w=["pointerdown","pointermove","pointerup"]:window.navigator.msPointerEnabled&&(w=["MSPointerDown","MSPointerMove","MSPointerUp"]),g.touchEvents={start:g.support.touch||!g.params.simulateTouch?"touchstart":w[0],move:g.support.touch||!g.params.simulateTouch?"touchmove":w[1],end:g.support.touch||!g.params.simulateTouch?"touchend":w[2]},(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&("container"===g.params.touchEventsTarget?g.container:g.wrapper).addClass("swiper-wp8-"+g.params.direction),g.initEvents=function(e){var a=e?"off":"on",t=e?"removeEventListener":"addEventListener",s="container"===g.params.touchEventsTarget?g.container[0]:g.wrapper[0],i=g.support.touch?s:document,n=g.params.nested?!0:!1;g.browser.ie?(s[t](g.touchEvents.start,g.onTouchStart,!1),i[t](g.touchEvents.move,g.onTouchMove,n),i[t](g.touchEvents.end,g.onTouchEnd,!1)):(g.support.touch&&(s[t](g.touchEvents.start,g.onTouchStart,!1),s[t](g.touchEvents.move,g.onTouchMove,n),s[t](g.touchEvents.end,g.onTouchEnd,!1)),!r.simulateTouch||g.device.ios||g.device.android||(s[t]("mousedown",g.onTouchStart,!1),document[t]("mousemove",g.onTouchMove,n),document[t]("mouseup",g.onTouchEnd,!1))),window[t]("resize",g.onResize),g.params.nextButton&&(v(g.params.nextButton)[a]("click",g.onClickNext),g.params.a11y&&g.a11y&&v(g.params.nextButton)[a]("keydown",g.a11y.onEnterKey)),g.params.prevButton&&(v(g.params.prevButton)[a]("click",g.onClickPrev),g.params.a11y&&g.a11y&&v(g.params.prevButton)[a]("keydown",g.a11y.onEnterKey)),g.params.pagination&&g.params.paginationClickable&&v(g.paginationContainer)[a]("click","."+g.params.bulletClass,g.onClickIndex),(g.params.preventClicks||g.params.preventClicksPropagation)&&s[t]("click",g.preventClicks,!0)},g.attachEvents=function(e){g.initEvents()},g.detachEvents=function(){g.initEvents(!0)},g.allowClick=!0,g.preventClicks=function(e){g.allowClick||(g.params.preventClicks&&e.preventDefault(),g.params.preventClicksPropagation&&(e.stopPropagation(),e.stopImmediatePropagation()))},g.onClickNext=function(e){e.preventDefault(),g.slideNext()},g.onClickPrev=function(e){e.preventDefault(),g.slidePrev()},g.onClickIndex=function(e){e.preventDefault();var a=v(this).index()*g.params.slidesPerGroup;g.params.loop&&(a+=g.loopedSlides),g.slideTo(a)},g.updateClickedSlide=function(e){var a=n(e,"."+g.params.slideClass),t=!1;if(a)for(var r=0;r<g.slides.length;r++)g.slides[r]===a&&(t=!0);if(!a||!t)return g.clickedSlide=void 0,void(g.clickedIndex=void 0);if(g.clickedSlide=a,g.clickedIndex=v(a).index(),g.params.slideToClickedSlide&&void 0!==g.clickedIndex&&g.clickedIndex!==g.activeIndex){var s,i=g.clickedIndex;if(g.params.loop)if(s=v(g.clickedSlide).attr("data-swiper-slide-index"),i>g.slides.length-g.params.slidesPerView)g.fixLoop(),i=g.wrapper.children("."+g.params.slideClass+'[data-swiper-slide-index="'+s+'"]').eq(0).index(),setTimeout(function(){g.slideTo(i)},0);else if(i<g.params.slidesPerView-1){g.fixLoop();var o=g.wrapper.children("."+g.params.slideClass+'[data-swiper-slide-index="'+s+'"]');i=o.eq(o.length-1).index(),setTimeout(function(){g.slideTo(i)},0)}else g.slideTo(i);else g.slideTo(i)}};var y,b,x,T,S,C,M,E,z,P="input, select, textarea, button",I=Date.now(),k=[];g.animating=!1,g.touches={startX:0,startY:0,currentX:0,currentY:0,diff:0};var L,D;if(g.onTouchStart=function(e){if(e.originalEvent&&(e=e.originalEvent),L="touchstart"===e.type,L||!("which"in e)||3!==e.which){if(g.params.noSwiping&&n(e,"."+g.params.noSwipingClass))return void(g.allowClick=!0);if(!g.params.swipeHandler||n(e,g.params.swipeHandler)){if(y=!0,b=!1,T=void 0,D=void 0,g.touches.startX=g.touches.currentX="touchstart"===e.type?e.targetTouches[0].pageX:e.pageX,g.touches.startY=g.touches.currentY="touchstart"===e.type?e.targetTouches[0].pageY:e.pageY,x=Date.now(),g.allowClick=!0,g.updateContainerSize(),g.swipeDirection=void 0,g.params.threshold>0&&(M=!1),"touchstart"!==e.type){var a=!0;v(e.target).is(P)&&(a=!1),document.activeElement&&v(document.activeElement).is(P)&&document.activeElement.blur(),a&&e.preventDefault()}g.emit("onTouchStart",g,e)}}},g.onTouchMove=function(e){if(e.originalEvent&&(e=e.originalEvent),!(L&&"mousemove"===e.type||e.preventedByNestedSwiper)){if(g.params.onlyExternal)return b=!0,void(g.allowClick=!1);if(L&&document.activeElement&&e.target===document.activeElement&&v(e.target).is(P))return b=!0,void(g.allowClick=!1);if(g.emit("onTouchMove",g,e),!(e.targetTouches&&e.targetTouches.length>1)){if(g.touches.currentX="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,g.touches.currentY="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,"undefined"==typeof T){var a=180*Math.atan2(Math.abs(g.touches.currentY-g.touches.startY),Math.abs(g.touches.currentX-g.touches.startX))/Math.PI;T=s()?a>g.params.touchAngle:90-a>g.params.touchAngle}if(T&&g.emit("onTouchMoveOpposite",g,e),"undefined"==typeof D&&g.browser.ieTouch&&(g.touches.currentX!==g.touches.startX||g.touches.currentY!==g.touches.startY)&&(D=!0),y){if(T)return void(y=!1);if(D||!g.browser.ieTouch){g.allowClick=!1,g.emit("onSliderMove",g,e),e.preventDefault(),g.params.touchMoveStopPropagation&&!g.params.nested&&e.stopPropagation(),b||(r.loop&&g.fixLoop(),C=g.getWrapperTranslate(),g.setWrapperTransition(0),g.animating&&g.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"),g.params.autoplay&&g.autoplaying&&(g.params.autoplayDisableOnInteraction?g.stopAutoplay():g.pauseAutoplay()),z=!1,g.params.grabCursor&&(g.container[0].style.cursor="move",g.container[0].style.cursor="-webkit-grabbing",g.container[0].style.cursor="-moz-grabbin",g.container[0].style.cursor="grabbing")),b=!0;var t=g.touches.diff=s()?g.touches.currentX-g.touches.startX:g.touches.currentY-g.touches.startY;t*=g.params.touchRatio,g.rtl&&(t=-t),g.swipeDirection=t>0?"prev":"next",S=t+C;var i=!0;if(t>0&&S>g.minTranslate()?(i=!1,g.params.resistance&&(S=g.minTranslate()-1+Math.pow(-g.minTranslate()+C+t,g.params.resistanceRatio))):0>t&&S<g.maxTranslate()&&(i=!1,g.params.resistance&&(S=g.maxTranslate()+1-Math.pow(g.maxTranslate()-C-t,g.params.resistanceRatio))),i&&(e.preventedByNestedSwiper=!0),!g.params.allowSwipeToNext&&"next"===g.swipeDirection&&C>S&&(S=C),!g.params.allowSwipeToPrev&&"prev"===g.swipeDirection&&S>C&&(S=C),g.params.followFinger){if(g.params.threshold>0){if(!(Math.abs(t)>g.params.threshold||M))return void(S=C);if(!M)return M=!0,g.touches.startX=g.touches.currentX,g.touches.startY=g.touches.currentY,S=C,void(g.touches.diff=s()?g.touches.currentX-g.touches.startX:g.touches.currentY-g.touches.startY)}(g.params.freeMode||g.params.watchSlidesProgress)&&g.updateActiveIndex(),g.params.freeMode&&(0===k.length&&k.push({position:g.touches[s()?"startX":"startY"],time:x}),k.push({position:g.touches[s()?"currentX":"currentY"],time:(new window.Date).getTime()})),g.updateProgress(S),g.setWrapperTranslate(S)}}}}}},g.onTouchEnd=function(e){if(e.originalEvent&&(e=e.originalEvent),g.emit("onTouchEnd",g,e),y){g.params.grabCursor&&b&&y&&(g.container[0].style.cursor="move",g.container[0].style.cursor="-webkit-grab",g.container[0].style.cursor="-moz-grab",g.container[0].style.cursor="grab");var a=Date.now(),t=a-x;if(g.allowClick&&(g.updateClickedSlide(e),g.emit("onTap",g,e),300>t&&a-I>300&&(E&&clearTimeout(E),E=setTimeout(function(){g&&(g.params.paginationHide&&g.paginationContainer.length>0&&!v(e.target).hasClass(g.params.bulletClass)&&g.paginationContainer.toggleClass(g.params.paginationHiddenClass),g.emit("onClick",g,e))},300)),300>t&&300>a-I&&(E&&clearTimeout(E),g.emit("onDoubleTap",g,e))),I=Date.now(),setTimeout(function(){g&&g.allowClick&&(g.allowClick=!0)},0),!y||!b||!g.swipeDirection||0===g.touches.diff||S===C)return void(y=b=!1);y=b=!1;var r;if(r=g.params.followFinger?g.rtl?g.translate:-g.translate:-S,g.params.freeMode){if(r<-g.minTranslate())return void g.slideTo(g.activeIndex);if(r>-g.maxTranslate())return void g.slideTo(g.slides.length<g.snapGrid.length?g.snapGrid.length-1:g.slides.length-1);if(g.params.freeModeMomentum){if(k.length>1){var s=k.pop(),i=k.pop(),n=s.position-i.position,o=s.time-i.time;g.velocity=n/o,g.velocity=g.velocity/2,Math.abs(g.velocity)<.02&&(g.velocity=0),(o>150||(new window.Date).getTime()-s.time>300)&&(g.velocity=0)}else g.velocity=0;k.length=0;var l=1e3*g.params.freeModeMomentumRatio,d=g.velocity*l,p=g.translate+d;g.rtl&&(p=-p);var u,c=!1,m=20*Math.abs(g.velocity)*g.params.freeModeMomentumBounceRatio;if(p<g.maxTranslate())g.params.freeModeMomentumBounce?(p+g.maxTranslate()<-m&&(p=g.maxTranslate()-m),u=g.maxTranslate(),c=!0,z=!0):p=g.maxTranslate();else if(p>g.minTranslate())g.params.freeModeMomentumBounce?(p-g.minTranslate()>m&&(p=g.minTranslate()+m),u=g.minTranslate(),c=!0,z=!0):p=g.minTranslate();else if(g.params.freeModeSticky){var f,h=0;for(h=0;h<g.snapGrid.length;h+=1)if(g.snapGrid[h]>-p){f=h;break}p=Math.abs(g.snapGrid[f]-p)<Math.abs(g.snapGrid[f-1]-p)||"next"===g.swipeDirection?g.snapGrid[f]:g.snapGrid[f-1],g.rtl||(p=-p)}if(0!==g.velocity)l=Math.abs(g.rtl?(-p-g.translate)/g.velocity:(p-g.translate)/g.velocity);else if(g.params.freeModeSticky)return void g.slideReset();g.params.freeModeMomentumBounce&&c?(g.updateProgress(u),g.setWrapperTransition(l),g.setWrapperTranslate(p),g.onTransitionStart(),g.animating=!0,g.wrapper.transitionEnd(function(){g&&z&&(g.emit("onMomentumBounce",g),g.setWrapperTransition(g.params.speed),g.setWrapperTranslate(u),g.wrapper.transitionEnd(function(){g&&g.onTransitionEnd()}))})):g.velocity?(g.updateProgress(p),g.setWrapperTransition(l),g.setWrapperTranslate(p),g.onTransitionStart(),g.animating||(g.animating=!0,g.wrapper.transitionEnd(function(){g&&g.onTransitionEnd()}))):g.updateProgress(p),g.updateActiveIndex()}return void((!g.params.freeModeMomentum||t>=g.params.longSwipesMs)&&(g.updateProgress(),g.updateActiveIndex()))}var w,T=0,M=g.slidesSizesGrid[0];for(w=0;w<g.slidesGrid.length;w+=g.params.slidesPerGroup)"undefined"!=typeof g.slidesGrid[w+g.params.slidesPerGroup]?r>=g.slidesGrid[w]&&r<g.slidesGrid[w+g.params.slidesPerGroup]&&(T=w,M=g.slidesGrid[w+g.params.slidesPerGroup]-g.slidesGrid[w]):r>=g.slidesGrid[w]&&(T=w,M=g.slidesGrid[g.slidesGrid.length-1]-g.slidesGrid[g.slidesGrid.length-2]);var P=(r-g.slidesGrid[T])/M;if(t>g.params.longSwipesMs){if(!g.params.longSwipes)return void g.slideTo(g.activeIndex);"next"===g.swipeDirection&&g.slideTo(P>=g.params.longSwipesRatio?T+g.params.slidesPerGroup:T),"prev"===g.swipeDirection&&g.slideTo(P>1-g.params.longSwipesRatio?T+g.params.slidesPerGroup:T)}else{if(!g.params.shortSwipes)return void g.slideTo(g.activeIndex);"next"===g.swipeDirection&&g.slideTo(T+g.params.slidesPerGroup),"prev"===g.swipeDirection&&g.slideTo(T)}}},g._slideTo=function(e,a){return g.slideTo(e,a,!0,!0)},g.slideTo=function(e,a,t,r){"undefined"==typeof t&&(t=!0),"undefined"==typeof e&&(e=0),0>e&&(e=0),g.snapIndex=Math.floor(e/g.params.slidesPerGroup),g.snapIndex>=g.snapGrid.length&&(g.snapIndex=g.snapGrid.length-1);var i=-g.snapGrid[g.snapIndex];if(!g.params.allowSwipeToNext&&i<g.translate)return!1;if(!g.params.allowSwipeToPrev&&i>g.translate)return!1;g.params.autoplay&&g.autoplaying&&(r||!g.params.autoplayDisableOnInteraction?g.pauseAutoplay(a):g.stopAutoplay()),g.updateProgress(i);for(var n=0;n<g.slidesGrid.length;n++)-i>=g.slidesGrid[n]&&(e=n);if("undefined"==typeof a&&(a=g.params.speed),g.previousIndex=g.activeIndex||0,g.activeIndex=e,i===g.translate)return g.updateClasses(),!1;g.updateClasses(),g.onTransitionStart(t);s()?i:0,s()?0:i;return 0===a?(g.setWrapperTransition(0),g.setWrapperTranslate(i),g.onTransitionEnd(t)):(g.setWrapperTransition(a),g.setWrapperTranslate(i),g.animating||(g.animating=!0,g.wrapper.transitionEnd(function(){g&&g.onTransitionEnd(t)}))),!0},g.onTransitionStart=function(e){"undefined"==typeof e&&(e=!0),g.lazy&&g.lazy.onTransitionStart(),e&&(g.emit("onTransitionStart",g),g.activeIndex!==g.previousIndex&&g.emit("onSlideChangeStart",g))},g.onTransitionEnd=function(e){g.animating=!1,g.setWrapperTransition(0),"undefined"==typeof e&&(e=!0),g.lazy&&g.lazy.onTransitionEnd(),e&&(g.emit("onTransitionEnd",g),g.activeIndex!==g.previousIndex&&g.emit("onSlideChangeEnd",g)),g.params.hashnav&&g.hashnav&&g.hashnav.setHash()},g.slideNext=function(e,a,t){if(g.params.loop){if(g.animating)return!1;g.fixLoop();{g.container[0].clientLeft}return g.slideTo(g.activeIndex+g.params.slidesPerGroup,a,e,t)}return g.slideTo(g.activeIndex+g.params.slidesPerGroup,a,e,t)},g._slideNext=function(e){return g.slideNext(!0,e,!0)},g.slidePrev=function(e,a,t){if(g.params.loop){if(g.animating)return!1;g.fixLoop();{g.container[0].clientLeft}return g.slideTo(g.activeIndex-1,a,e,t)}return g.slideTo(g.activeIndex-1,a,e,t)},g._slidePrev=function(e){return g.slidePrev(!0,e,!0)},g.slideReset=function(e,a,t){return g.slideTo(g.activeIndex,a,e)},g.setWrapperTransition=function(e,a){g.wrapper.transition(e),"slide"!==g.params.effect&&g.effects[g.params.effect]&&g.effects[g.params.effect].setTransition(e),g.params.parallax&&g.parallax&&g.parallax.setTransition(e),g.params.scrollbar&&g.scrollbar&&g.scrollbar.setTransition(e),g.params.control&&g.controller&&g.controller.setTransition(e,a),g.emit("onSetTransition",g,e)},g.setWrapperTranslate=function(e,a,t){var r=0,i=0,n=0;s()?r=g.rtl?-e:e:i=e,g.params.virtualTranslate||g.wrapper.transform(g.support.transforms3d?"translate3d("+r+"px, "+i+"px, "+n+"px)":"translate("+r+"px, "+i+"px)"),g.translate=s()?r:i,a&&g.updateActiveIndex(),"slide"!==g.params.effect&&g.effects[g.params.effect]&&g.effects[g.params.effect].setTranslate(g.translate),g.params.parallax&&g.parallax&&g.parallax.setTranslate(g.translate),g.params.scrollbar&&g.scrollbar&&g.scrollbar.setTranslate(g.translate),g.params.control&&g.controller&&g.controller.setTranslate(g.translate,t),g.emit("onSetTranslate",g,g.translate)},g.getTranslate=function(e,a){var t,r,s,i;return"undefined"==typeof a&&(a="x"),g.params.virtualTranslate?g.rtl?-g.translate:g.translate:(s=window.getComputedStyle(e,null),
window.WebKitCSSMatrix?i=new window.WebKitCSSMatrix("none"===s.webkitTransform?"":s.webkitTransform):(i=s.MozTransform||s.OTransform||s.MsTransform||s.msTransform||s.transform||s.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),t=i.toString().split(",")),"x"===a&&(r=window.WebKitCSSMatrix?i.m41:parseFloat(16===t.length?t[12]:t[4])),"y"===a&&(r=window.WebKitCSSMatrix?i.m42:parseFloat(16===t.length?t[13]:t[5])),g.rtl&&r&&(r=-r),r||0)},g.getWrapperTranslate=function(e){return"undefined"==typeof e&&(e=s()?"x":"y"),g.getTranslate(g.wrapper[0],e)},g.observers=[],g.initObservers=function(){if(g.params.observeParents)for(var e=g.container.parents(),a=0;a<e.length;a++)o(e[a]);o(g.container[0],{childList:!1}),o(g.wrapper[0],{attributes:!1})},g.disconnectObservers=function(){for(var e=0;e<g.observers.length;e++)g.observers[e].disconnect();g.observers=[]},g.createLoop=function(){g.wrapper.children("."+g.params.slideClass+"."+g.params.slideDuplicateClass).remove();var e=g.wrapper.children("."+g.params.slideClass);g.loopedSlides=parseInt(g.params.loopedSlides||g.params.slidesPerView,10),g.loopedSlides=g.loopedSlides+g.params.loopAdditionalSlides,g.loopedSlides>e.length&&(g.loopedSlides=e.length);var a,t=[],r=[];for(e.each(function(a,s){var i=v(this);a<g.loopedSlides&&r.push(s),a<e.length&&a>=e.length-g.loopedSlides&&t.push(s),i.attr("data-swiper-slide-index",a)}),a=0;a<r.length;a++)g.wrapper.append(v(r[a].cloneNode(!0)).addClass(g.params.slideDuplicateClass));for(a=t.length-1;a>=0;a--)g.wrapper.prepend(v(t[a].cloneNode(!0)).addClass(g.params.slideDuplicateClass))},g.destroyLoop=function(){g.wrapper.children("."+g.params.slideClass+"."+g.params.slideDuplicateClass).remove(),g.slides.removeAttr("data-swiper-slide-index")},g.fixLoop=function(){var e;g.activeIndex<g.loopedSlides?(e=g.slides.length-3*g.loopedSlides+g.activeIndex,e+=g.loopedSlides,g.slideTo(e,0,!1,!0)):("auto"===g.params.slidesPerView&&g.activeIndex>=2*g.loopedSlides||g.activeIndex>g.slides.length-2*g.params.slidesPerView)&&(e=-g.slides.length+g.activeIndex+g.loopedSlides,e+=g.loopedSlides,g.slideTo(e,0,!1,!0))},g.appendSlide=function(e){if(g.params.loop&&g.destroyLoop(),"object"==typeof e&&e.length)for(var a=0;a<e.length;a++)e[a]&&g.wrapper.append(e[a]);else g.wrapper.append(e);g.params.loop&&g.createLoop(),g.params.observer&&g.support.observer||g.update(!0)},g.prependSlide=function(e){g.params.loop&&g.destroyLoop();var a=g.activeIndex+1;if("object"==typeof e&&e.length){for(var t=0;t<e.length;t++)e[t]&&g.wrapper.prepend(e[t]);a=g.activeIndex+e.length}else g.wrapper.prepend(e);g.params.loop&&g.createLoop(),g.params.observer&&g.support.observer||g.update(!0),g.slideTo(a,0,!1)},g.removeSlide=function(e){g.params.loop&&(g.destroyLoop(),g.slides=g.wrapper.children("."+g.params.slideClass));var a,t=g.activeIndex;if("object"==typeof e&&e.length){for(var r=0;r<e.length;r++)a=e[r],g.slides[a]&&g.slides.eq(a).remove(),t>a&&t--;t=Math.max(t,0)}else a=e,g.slides[a]&&g.slides.eq(a).remove(),t>a&&t--,t=Math.max(t,0);g.params.loop&&g.createLoop(),g.params.observer&&g.support.observer||g.update(!0),g.params.loop?g.slideTo(t+g.loopedSlides,0,!1):g.slideTo(t,0,!1)},g.removeAllSlides=function(){for(var e=[],a=0;a<g.slides.length;a++)e.push(a);g.removeSlide(e)},g.effects={fade:{fadeIndex:null,setTranslate:function(){for(var e=0;e<g.slides.length;e++){var a=g.slides.eq(e),t=a[0].swiperSlideOffset,r=-t;g.params.virtualTranslate||(r-=g.translate);var i=0;s()||(i=r,r=0);var n=g.params.fade.crossFade?Math.max(1-Math.abs(a[0].progress),0):1+Math.min(Math.max(a[0].progress,-1),0);n>0&&1>n&&(g.effects.fade.fadeIndex=e),a.css({opacity:n}).transform("translate3d("+r+"px, "+i+"px, 0px)")}},setTransition:function(e){if(g.slides.transition(e),g.params.virtualTranslate&&0!==e){var a=null!==g.effects.fade.fadeIndex?g.effects.fade.fadeIndex:g.activeIndex;g.params.loop||g.params.fade.crossFade||0!==a||(a=g.slides.length-1),g.slides.eq(a).transitionEnd(function(){if(g)for(var e=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],a=0;a<e.length;a++)g.wrapper.trigger(e[a])})}}},cube:{setTranslate:function(){var e,a=0;g.params.cube.shadow&&(s()?(e=g.wrapper.find(".swiper-cube-shadow"),0===e.length&&(e=v('<div class="swiper-cube-shadow"></div>'),g.wrapper.append(e)),e.css({height:g.width+"px"})):(e=g.container.find(".swiper-cube-shadow"),0===e.length&&(e=v('<div class="swiper-cube-shadow"></div>'),g.container.append(e))));for(var t=0;t<g.slides.length;t++){var r=g.slides.eq(t),i=90*t,n=Math.floor(i/360);g.rtl&&(i=-i,n=Math.floor(-i/360));var o=Math.max(Math.min(r[0].progress,1),-1),l=0,d=0,p=0;t%4===0?(l=4*-n*g.size,p=0):(t-1)%4===0?(l=0,p=4*-n*g.size):(t-2)%4===0?(l=g.size+4*n*g.size,p=g.size):(t-3)%4===0&&(l=-g.size,p=3*g.size+4*g.size*n),g.rtl&&(l=-l),s()||(d=l,l=0);var u="rotateX("+(s()?0:-i)+"deg) rotateY("+(s()?i:0)+"deg) translate3d("+l+"px, "+d+"px, "+p+"px)";if(1>=o&&o>-1&&(a=90*t+90*o,g.rtl&&(a=90*-t-90*o)),r.transform(u),g.params.cube.slideShadows){var c=r.find(s()?".swiper-slide-shadow-left":".swiper-slide-shadow-top"),m=r.find(s()?".swiper-slide-shadow-right":".swiper-slide-shadow-bottom");0===c.length&&(c=v('<div class="swiper-slide-shadow-'+(s()?"left":"top")+'"></div>'),r.append(c)),0===m.length&&(m=v('<div class="swiper-slide-shadow-'+(s()?"right":"bottom")+'"></div>'),r.append(m));{r[0].progress}c.length&&(c[0].style.opacity=-r[0].progress),m.length&&(m[0].style.opacity=r[0].progress)}}if(g.wrapper.css({"-webkit-transform-origin":"50% 50% -"+g.size/2+"px","-moz-transform-origin":"50% 50% -"+g.size/2+"px","-ms-transform-origin":"50% 50% -"+g.size/2+"px","transform-origin":"50% 50% -"+g.size/2+"px"}),g.params.cube.shadow)if(s())e.transform("translate3d(0px, "+(g.width/2+g.params.cube.shadowOffset)+"px, "+-g.width/2+"px) rotateX(90deg) rotateZ(0deg) scale("+g.params.cube.shadowScale+")");else{var f=Math.abs(a)-90*Math.floor(Math.abs(a)/90),h=1.5-(Math.sin(2*f*Math.PI/360)/2+Math.cos(2*f*Math.PI/360)/2),w=g.params.cube.shadowScale,y=g.params.cube.shadowScale/h,b=g.params.cube.shadowOffset;e.transform("scale3d("+w+", 1, "+y+") translate3d(0px, "+(g.height/2+b)+"px, "+-g.height/2/y+"px) rotateX(-90deg)")}var x=g.isSafari||g.isUiWebView?-g.size/2:0;g.wrapper.transform("translate3d(0px,0,"+x+"px) rotateX("+(s()?0:a)+"deg) rotateY("+(s()?-a:0)+"deg)")},setTransition:function(e){g.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),g.params.cube.shadow&&!s()&&g.container.find(".swiper-cube-shadow").transition(e)}},coverflow:{setTranslate:function(){for(var e=g.translate,a=s()?-e+g.width/2:-e+g.height/2,t=s()?g.params.coverflow.rotate:-g.params.coverflow.rotate,r=g.params.coverflow.depth,i=0,n=g.slides.length;n>i;i++){var o=g.slides.eq(i),l=g.slidesSizesGrid[i],d=o[0].swiperSlideOffset,p=(a-d-l/2)/l*g.params.coverflow.modifier,u=s()?t*p:0,c=s()?0:t*p,m=-r*Math.abs(p),f=s()?0:g.params.coverflow.stretch*p,h=s()?g.params.coverflow.stretch*p:0;Math.abs(h)<.001&&(h=0),Math.abs(f)<.001&&(f=0),Math.abs(m)<.001&&(m=0),Math.abs(u)<.001&&(u=0),Math.abs(c)<.001&&(c=0);var w="translate3d("+h+"px,"+f+"px,"+m+"px)  rotateX("+c+"deg) rotateY("+u+"deg)";if(o.transform(w),o[0].style.zIndex=-Math.abs(Math.round(p))+1,g.params.coverflow.slideShadows){var y=o.find(s()?".swiper-slide-shadow-left":".swiper-slide-shadow-top"),b=o.find(s()?".swiper-slide-shadow-right":".swiper-slide-shadow-bottom");0===y.length&&(y=v('<div class="swiper-slide-shadow-'+(s()?"left":"top")+'"></div>'),o.append(y)),0===b.length&&(b=v('<div class="swiper-slide-shadow-'+(s()?"right":"bottom")+'"></div>'),o.append(b)),y.length&&(y[0].style.opacity=p>0?p:0),b.length&&(b[0].style.opacity=-p>0?-p:0)}}if(g.browser.ie){var x=g.wrapper[0].style;x.perspectiveOrigin=a+"px 50%"}},setTransition:function(e){g.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)}}},g.lazy={initialImageLoaded:!1,loadImageInSlide:function(e,a){if("undefined"!=typeof e&&("undefined"==typeof a&&(a=!0),0!==g.slides.length)){var t=g.slides.eq(e),r=t.find(".swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)");!t.hasClass("swiper-lazy")||t.hasClass("swiper-lazy-loaded")||t.hasClass("swiper-lazy-loading")||r.add(t[0]),0!==r.length&&r.each(function(){var e=v(this);e.addClass("swiper-lazy-loading");var r=e.attr("data-background"),s=e.attr("data-src");g.loadImage(e[0],s||r,!1,function(){if(r?(e.css("background-image","url("+r+")"),e.removeAttr("data-background")):(e.attr("src",s),e.removeAttr("data-src")),e.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading"),t.find(".swiper-lazy-preloader, .preloader").remove(),g.params.loop&&a){var i=t.attr("data-swiper-slide-index");if(t.hasClass(g.params.slideDuplicateClass)){var n=g.wrapper.children('[data-swiper-slide-index="'+i+'"]:not(.'+g.params.slideDuplicateClass+")");g.lazy.loadImageInSlide(n.index(),!1)}else{var o=g.wrapper.children("."+g.params.slideDuplicateClass+'[data-swiper-slide-index="'+i+'"]');g.lazy.loadImageInSlide(o.index(),!1)}}g.emit("onLazyImageReady",g,t[0],e[0])}),g.emit("onLazyImageLoad",g,t[0],e[0])})}},load:function(){if(g.params.watchSlidesVisibility)g.wrapper.children("."+g.params.slideVisibleClass).each(function(){g.lazy.loadImageInSlide(v(this).index())});else if(g.params.slidesPerView>1)for(var e=g.activeIndex;e<g.activeIndex+g.params.slidesPerView;e++)g.slides[e]&&g.lazy.loadImageInSlide(e);else g.lazy.loadImageInSlide(g.activeIndex);if(g.params.lazyLoadingInPrevNext){var a=g.wrapper.children("."+g.params.slideNextClass);a.length>0&&g.lazy.loadImageInSlide(a.index());var t=g.wrapper.children("."+g.params.slidePrevClass);t.length>0&&g.lazy.loadImageInSlide(t.index())}},onTransitionStart:function(){g.params.lazyLoading&&(g.params.lazyLoadingOnTransitionStart||!g.params.lazyLoadingOnTransitionStart&&!g.lazy.initialImageLoaded)&&g.lazy.load()},onTransitionEnd:function(){g.params.lazyLoading&&!g.params.lazyLoadingOnTransitionStart&&g.lazy.load()}},g.scrollbar={set:function(){if(g.params.scrollbar){var e=g.scrollbar;e.track=v(g.params.scrollbar),e.drag=e.track.find(".swiper-scrollbar-drag"),0===e.drag.length&&(e.drag=v('<div class="swiper-scrollbar-drag"></div>'),e.track.append(e.drag)),e.drag[0].style.width="",e.drag[0].style.height="",e.trackSize=s()?e.track[0].offsetWidth:e.track[0].offsetHeight,e.divider=g.size/g.virtualSize,e.moveDivider=e.divider*(e.trackSize/g.size),e.dragSize=e.trackSize*e.divider,s()?e.drag[0].style.width=e.dragSize+"px":e.drag[0].style.height=e.dragSize+"px",e.track[0].style.display=e.divider>=1?"none":"",g.params.scrollbarHide&&(e.track[0].style.opacity=0)}},setTranslate:function(){if(g.params.scrollbar){var e,a=g.scrollbar,t=(g.translate||0,a.dragSize);e=(a.trackSize-a.dragSize)*g.progress,g.rtl&&s()?(e=-e,e>0?(t=a.dragSize-e,e=0):-e+a.dragSize>a.trackSize&&(t=a.trackSize+e)):0>e?(t=a.dragSize+e,e=0):e+a.dragSize>a.trackSize&&(t=a.trackSize-e),s()?(a.drag.transform(g.support.transforms3d?"translate3d("+e+"px, 0, 0)":"translateX("+e+"px)"),a.drag[0].style.width=t+"px"):(a.drag.transform(g.support.transforms3d?"translate3d(0px, "+e+"px, 0)":"translateY("+e+"px)"),a.drag[0].style.height=t+"px"),g.params.scrollbarHide&&(clearTimeout(a.timeout),a.track[0].style.opacity=1,a.timeout=setTimeout(function(){a.track[0].style.opacity=0,a.track.transition(400)},1e3))}},setTransition:function(e){g.params.scrollbar&&g.scrollbar.drag.transition(e)}},g.controller={setTranslate:function(e,t){function r(a){e=a.rtl&&"horizontal"===a.params.direction?-g.translate:g.translate,s=(a.maxTranslate()-a.minTranslate())/(g.maxTranslate()-g.minTranslate()),i=(e-g.minTranslate())*s+a.minTranslate(),g.params.controlInverse&&(i=a.maxTranslate()-i),a.updateProgress(i),a.setWrapperTranslate(i,!1,g),a.updateActiveIndex()}var s,i,n=g.params.control;if(g.isArray(n))for(var o=0;o<n.length;o++)n[o]!==t&&n[o]instanceof a&&r(n[o]);else n instanceof a&&t!==n&&r(n)},setTransition:function(e,t){function r(a){a.setWrapperTransition(e,g),0!==e&&(a.onTransitionStart(),a.wrapper.transitionEnd(function(){i&&a.onTransitionEnd()}))}var s,i=g.params.control;if(g.isArray(i))for(s=0;s<i.length;s++)i[s]!==t&&i[s]instanceof a&&r(i[s]);else i instanceof a&&t!==i&&r(i)}},g.hashnav={init:function(){if(g.params.hashnav){g.hashnav.initialized=!0;var e=document.location.hash.replace("#","");if(e)for(var a=0,t=0,r=g.slides.length;r>t;t++){var s=g.slides.eq(t),i=s.attr("data-hash");if(i===e&&!s.hasClass(g.params.slideDuplicateClass)){var n=s.index();g.slideTo(n,a,g.params.runCallbacksOnInit,!0)}}}},setHash:function(){g.hashnav.initialized&&g.params.hashnav&&(document.location.hash=g.slides.eq(g.activeIndex).attr("data-hash")||"")}},g.disableKeyboardControl=function(){v(document).off("keydown",l)},g.enableKeyboardControl=function(){v(document).on("keydown",l)},g._wheelEvent=!1,g._lastWheelScrollTime=(new window.Date).getTime(),g.params.mousewheelControl){if(void 0!==document.onmousewheel&&(g._wheelEvent="mousewheel"),!g._wheelEvent)try{new window.WheelEvent("wheel"),g._wheelEvent="wheel"}catch(G){}g._wheelEvent||(g._wheelEvent="DOMMouseScroll")}g.disableMousewheelControl=function(){return g._wheelEvent?(g.container.off(g._wheelEvent,d),!0):!1},g.enableMousewheelControl=function(){return g._wheelEvent?(g.container.on(g._wheelEvent,d),!0):!1},g.parallax={setTranslate:function(){g.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){p(this,g.progress)}),g.slides.each(function(){var e=v(this);e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){var a=Math.min(Math.max(e[0].progress,-1),1);p(this,a)})})},setTransition:function(e){"undefined"==typeof e&&(e=g.params.speed),g.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){var a=v(this),t=parseInt(a.attr("data-swiper-parallax-duration"),10)||e;0===e&&(t=0),a.transition(t)})}},g._plugins=[];for(var B in g.plugins){var A=g.plugins[B](g,g.params[B]);A&&g._plugins.push(A)}return g.callPlugins=function(e){for(var a=0;a<g._plugins.length;a++)e in g._plugins[a]&&g._plugins[a][e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},g.emitterEventListeners={},g.emit=function(e){g.params[e]&&g.params[e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);var a;if(g.emitterEventListeners[e])for(a=0;a<g.emitterEventListeners[e].length;a++)g.emitterEventListeners[e][a](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);g.callPlugins&&g.callPlugins(e,arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},g.on=function(e,a){return e=u(e),g.emitterEventListeners[e]||(g.emitterEventListeners[e]=[]),g.emitterEventListeners[e].push(a),g},g.off=function(e,a){var t;if(e=u(e),"undefined"==typeof a)return g.emitterEventListeners[e]=[],g;if(g.emitterEventListeners[e]&&0!==g.emitterEventListeners[e].length){for(t=0;t<g.emitterEventListeners[e].length;t++)g.emitterEventListeners[e][t]===a&&g.emitterEventListeners[e].splice(t,1);return g}},g.once=function(e,a){e=u(e);var t=function(){a(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]),g.off(e,t)};return g.on(e,t),g},g.a11y={makeFocusable:function(e){return e[0].tabIndex="0",e},addRole:function(e,a){return e.attr("role",a),e},addLabel:function(e,a){return e.attr("aria-label",a),e},disable:function(e){return e.attr("aria-disabled",!0),e},enable:function(e){return e.attr("aria-disabled",!1),e},onEnterKey:function(e){13===e.keyCode&&(v(e.target).is(g.params.nextButton)?(g.onClickNext(e),g.a11y.notify(g.isEnd?g.params.lastSlideMsg:g.params.nextSlideMsg)):v(e.target).is(g.params.prevButton)&&(g.onClickPrev(e),g.a11y.notify(g.isBeginning?g.params.firstSlideMsg:g.params.prevSlideMsg)))},liveRegion:v('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),notify:function(e){var a=g.a11y.liveRegion;0!==a.length&&(a.html(""),a.html(e))},init:function(){if(g.params.nextButton){var e=v(g.params.nextButton);g.a11y.makeFocusable(e),g.a11y.addRole(e,"button"),g.a11y.addLabel(e,g.params.nextSlideMsg)}if(g.params.prevButton){var a=v(g.params.prevButton);g.a11y.makeFocusable(a),g.a11y.addRole(a,"button"),g.a11y.addLabel(a,g.params.prevSlideMsg)}v(g.container).append(g.a11y.liveRegion)},destroy:function(){g.a11y.liveRegion&&g.a11y.liveRegion.length>0&&g.a11y.liveRegion.remove()}},g.init=function(){g.params.loop&&g.createLoop(),g.updateContainerSize(),g.updateSlidesSize(),g.updatePagination(),g.params.scrollbar&&g.scrollbar&&g.scrollbar.set(),"slide"!==g.params.effect&&g.effects[g.params.effect]&&(g.params.loop||g.updateProgress(),g.effects[g.params.effect].setTranslate()),g.params.loop?g.slideTo(g.params.initialSlide+g.loopedSlides,0,g.params.runCallbacksOnInit):(g.slideTo(g.params.initialSlide,0,g.params.runCallbacksOnInit),0===g.params.initialSlide&&(g.parallax&&g.params.parallax&&g.parallax.setTranslate(),g.lazy&&g.params.lazyLoading&&(g.lazy.load(),g.lazy.initialImageLoaded=!0))),g.attachEvents(),g.params.observer&&g.support.observer&&g.initObservers(),g.params.preloadImages&&!g.params.lazyLoading&&g.preloadImages(),g.params.autoplay&&g.startAutoplay(),g.params.keyboardControl&&g.enableKeyboardControl&&g.enableKeyboardControl(),g.params.mousewheelControl&&g.enableMousewheelControl&&g.enableMousewheelControl(),g.params.hashnav&&g.hashnav&&g.hashnav.init(),g.params.a11y&&g.a11y&&g.a11y.init(),g.emit("onInit",g)},g.cleanupStyles=function(){g.container.removeClass(g.classNames.join(" ")).removeAttr("style"),g.wrapper.removeAttr("style"),g.slides&&g.slides.length&&g.slides.removeClass([g.params.slideVisibleClass,g.params.slideActiveClass,g.params.slideNextClass,g.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"),g.paginationContainer&&g.paginationContainer.length&&g.paginationContainer.removeClass(g.params.paginationHiddenClass),g.bullets&&g.bullets.length&&g.bullets.removeClass(g.params.bulletActiveClass),g.params.prevButton&&v(g.params.prevButton).removeClass(g.params.buttonDisabledClass),g.params.nextButton&&v(g.params.nextButton).removeClass(g.params.buttonDisabledClass),g.params.scrollbar&&g.scrollbar&&(g.scrollbar.track&&g.scrollbar.track.length&&g.scrollbar.track.removeAttr("style"),g.scrollbar.drag&&g.scrollbar.drag.length&&g.scrollbar.drag.removeAttr("style"))},g.destroy=function(e,a){g.detachEvents(),g.stopAutoplay(),g.params.loop&&g.destroyLoop(),a&&g.cleanupStyles(),g.disconnectObservers(),g.params.keyboardControl&&g.disableKeyboardControl&&g.disableKeyboardControl(),g.params.mousewheelControl&&g.disableMousewheelControl&&g.disableMousewheelControl(),g.params.a11y&&g.a11y&&g.a11y.destroy(),g.emit("onDestroy"),e!==!1&&(g=null)},g.init(),g}};a.prototype={isSafari:function(){var e=navigator.userAgent.toLowerCase();return e.indexOf("safari")>=0&&e.indexOf("chrome")<0&&e.indexOf("android")<0}(),isUiWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),isArray:function(e){return"[object Array]"===Object.prototype.toString.apply(e)},browser:{ie:window.navigator.pointerEnabled||window.navigator.msPointerEnabled,ieTouch:window.navigator.msPointerEnabled&&window.navigator.msMaxTouchPoints>1||window.navigator.pointerEnabled&&window.navigator.maxTouchPoints>1},device:function(){var e=navigator.userAgent,a=e.match(/(Android);?[\s\/]+([\d.]+)?/),t=e.match(/(iPad).*OS\s([\d_]+)/),r=(e.match(/(iPod)(.*OS\s([\d_]+))?/),!t&&e.match(/(iPhone\sOS)\s([\d_]+)/));return{ios:t||r||t,android:a}}(),support:{touch:window.Modernizr&&Modernizr.touch===!0||function(){return!!("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch)}(),transforms3d:window.Modernizr&&Modernizr.csstransforms3d===!0||function(){var e=document.createElement("div").style;return"webkitPerspective"in e||"MozPerspective"in e||"OPerspective"in e||"MsPerspective"in e||"perspective"in e}(),flexbox:function(){for(var e=document.createElement("div").style,a="alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "),t=0;t<a.length;t++)if(a[t]in e)return!0}(),observer:function(){return"MutationObserver"in window||"WebkitMutationObserver"in window}()},plugins:{}};for(var t=(function(){var e=function(e){var a=this,t=0;for(t=0;t<e.length;t++)a[t]=e[t];return a.length=e.length,this},a=function(a,t){var r=[],s=0;if(a&&!t&&a instanceof e)return a;if(a)if("string"==typeof a){var i,n,o=a.trim();if(o.indexOf("<")>=0&&o.indexOf(">")>=0){var l="div";for(0===o.indexOf("<li")&&(l="ul"),0===o.indexOf("<tr")&&(l="tbody"),(0===o.indexOf("<td")||0===o.indexOf("<th"))&&(l="tr"),0===o.indexOf("<tbody")&&(l="table"),0===o.indexOf("<option")&&(l="select"),n=document.createElement(l),n.innerHTML=a,s=0;s<n.childNodes.length;s++)r.push(n.childNodes[s])}else for(i=t||"#"!==a[0]||a.match(/[ .<>:~]/)?(t||document).querySelectorAll(a):[document.getElementById(a.split("#")[1])],s=0;s<i.length;s++)i[s]&&r.push(i[s])}else if(a.nodeType||a===window||a===document)r.push(a);else if(a.length>0&&a[0].nodeType)for(s=0;s<a.length;s++)r.push(a[s]);return new e(r)};return e.prototype={addClass:function(e){if("undefined"==typeof e)return this;for(var a=e.split(" "),t=0;t<a.length;t++)for(var r=0;r<this.length;r++)this[r].classList.add(a[t]);return this},removeClass:function(e){for(var a=e.split(" "),t=0;t<a.length;t++)for(var r=0;r<this.length;r++)this[r].classList.remove(a[t]);return this},hasClass:function(e){return this[0]?this[0].classList.contains(e):!1},toggleClass:function(e){for(var a=e.split(" "),t=0;t<a.length;t++)for(var r=0;r<this.length;r++)this[r].classList.toggle(a[t]);return this},attr:function(e,a){if(1===arguments.length&&"string"==typeof e)return this[0]?this[0].getAttribute(e):void 0;for(var t=0;t<this.length;t++)if(2===arguments.length)this[t].setAttribute(e,a);else for(var r in e)this[t][r]=e[r],this[t].setAttribute(r,e[r]);return this},removeAttr:function(e){for(var a=0;a<this.length;a++)this[a].removeAttribute(e);return this},data:function(e,a){if("undefined"==typeof a){if(this[0]){var t=this[0].getAttribute("data-"+e);return t?t:this[0].dom7ElementDataStorage&&e in this[0].dom7ElementDataStorage?this[0].dom7ElementDataStorage[e]:void 0}return void 0}for(var r=0;r<this.length;r++){var s=this[r];s.dom7ElementDataStorage||(s.dom7ElementDataStorage={}),s.dom7ElementDataStorage[e]=a}return this},transform:function(e){for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransform=t.MsTransform=t.msTransform=t.MozTransform=t.OTransform=t.transform=e}return this},transition:function(e){"string"!=typeof e&&(e+="ms");for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransitionDuration=t.MsTransitionDuration=t.msTransitionDuration=t.MozTransitionDuration=t.OTransitionDuration=t.transitionDuration=e}return this},on:function(e,t,r,s){function i(e){var s=e.target;if(a(s).is(t))r.call(s,e);else for(var i=a(s).parents(),n=0;n<i.length;n++)a(i[n]).is(t)&&r.call(i[n],e)}var n,o,l=e.split(" ");for(n=0;n<this.length;n++)if("function"==typeof t||t===!1)for("function"==typeof t&&(r=arguments[1],s=arguments[2]||!1),o=0;o<l.length;o++)this[n].addEventListener(l[o],r,s);else for(o=0;o<l.length;o++)this[n].dom7LiveListeners||(this[n].dom7LiveListeners=[]),this[n].dom7LiveListeners.push({listener:r,liveListener:i}),this[n].addEventListener(l[o],i,s);return this},off:function(e,a,t,r){for(var s=e.split(" "),i=0;i<s.length;i++)for(var n=0;n<this.length;n++)if("function"==typeof a||a===!1)"function"==typeof a&&(t=arguments[1],r=arguments[2]||!1),this[n].removeEventListener(s[i],t,r);else if(this[n].dom7LiveListeners)for(var o=0;o<this[n].dom7LiveListeners.length;o++)this[n].dom7LiveListeners[o].listener===t&&this[n].removeEventListener(s[i],this[n].dom7LiveListeners[o].liveListener,r);return this},once:function(e,a,t,r){function s(n){t(n),i.off(e,a,s,r)}var i=this;"function"==typeof a&&(a=!1,t=arguments[1],r=arguments[2]),i.on(e,a,s,r)},trigger:function(e,a){for(var t=0;t<this.length;t++){var r;try{r=new window.CustomEvent(e,{detail:a,bubbles:!0,cancelable:!0})}catch(s){r=document.createEvent("Event"),r.initEvent(e,!0,!0),r.detail=a}this[t].dispatchEvent(r)}return this},transitionEnd:function(e){function a(i){if(i.target===this)for(e.call(this,i),t=0;t<r.length;t++)s.off(r[t],a)}var t,r=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],s=this;if(e)for(t=0;t<r.length;t++)s.on(r[t],a);return this},width:function(){return this[0]===window?window.innerWidth:this.length>0?parseFloat(this.css("width")):null},outerWidth:function(e){return this.length>0?e?this[0].offsetWidth+parseFloat(this.css("margin-right"))+parseFloat(this.css("margin-left")):this[0].offsetWidth:null},height:function(){return this[0]===window?window.innerHeight:this.length>0?parseFloat(this.css("height")):null},outerHeight:function(e){return this.length>0?e?this[0].offsetHeight+parseFloat(this.css("margin-top"))+parseFloat(this.css("margin-bottom")):this[0].offsetHeight:null},offset:function(){if(this.length>0){var e=this[0],a=e.getBoundingClientRect(),t=document.body,r=e.clientTop||t.clientTop||0,s=e.clientLeft||t.clientLeft||0,i=window.pageYOffset||e.scrollTop,n=window.pageXOffset||e.scrollLeft;return{top:a.top+i-r,left:a.left+n-s}}return null},css:function(e,a){var t;if(1===arguments.length){if("string"!=typeof e){for(t=0;t<this.length;t++)for(var r in e)this[t].style[r]=e[r];return this}if(this[0])return window.getComputedStyle(this[0],null).getPropertyValue(e)}if(2===arguments.length&&"string"==typeof e){for(t=0;t<this.length;t++)this[t].style[e]=a;return this}return this},each:function(e){for(var a=0;a<this.length;a++)e.call(this[a],a,this[a]);return this},html:function(e){if("undefined"==typeof e)return this[0]?this[0].innerHTML:void 0;for(var a=0;a<this.length;a++)this[a].innerHTML=e;return this},is:function(t){if(!this[0])return!1;var r,s;if("string"==typeof t){var i=this[0];if(i===document)return t===document;if(i===window)return t===window;if(i.matches)return i.matches(t);if(i.webkitMatchesSelector)return i.webkitMatchesSelector(t);if(i.mozMatchesSelector)return i.mozMatchesSelector(t);if(i.msMatchesSelector)return i.msMatchesSelector(t);for(r=a(t),s=0;s<r.length;s++)if(r[s]===this[0])return!0;return!1}if(t===document)return this[0]===document;if(t===window)return this[0]===window;if(t.nodeType||t instanceof e){for(r=t.nodeType?[t]:t,s=0;s<r.length;s++)if(r[s]===this[0])return!0;return!1}return!1},index:function(){if(this[0]){for(var e=this[0],a=0;null!==(e=e.previousSibling);)1===e.nodeType&&a++;return a}return void 0},eq:function(a){if("undefined"==typeof a)return this;var t,r=this.length;return a>r-1?new e([]):0>a?(t=r+a,new e(0>t?[]:[this[t]])):new e([this[a]])},append:function(a){var t,r;for(t=0;t<this.length;t++)if("string"==typeof a){var s=document.createElement("div");for(s.innerHTML=a;s.firstChild;)this[t].appendChild(s.firstChild)}else if(a instanceof e)for(r=0;r<a.length;r++)this[t].appendChild(a[r]);else this[t].appendChild(a);return this},prepend:function(a){var t,r;for(t=0;t<this.length;t++)if("string"==typeof a){var s=document.createElement("div");for(s.innerHTML=a,r=s.childNodes.length-1;r>=0;r--)this[t].insertBefore(s.childNodes[r],this[t].childNodes[0])}else if(a instanceof e)for(r=0;r<a.length;r++)this[t].insertBefore(a[r],this[t].childNodes[0]);else this[t].insertBefore(a,this[t].childNodes[0]);return this},insertBefore:function(e){for(var t=a(e),r=0;r<this.length;r++)if(1===t.length)t[0].parentNode.insertBefore(this[r],t[0]);else if(t.length>1)for(var s=0;s<t.length;s++)t[s].parentNode.insertBefore(this[r].cloneNode(!0),t[s])},insertAfter:function(e){for(var t=a(e),r=0;r<this.length;r++)if(1===t.length)t[0].parentNode.insertBefore(this[r],t[0].nextSibling);else if(t.length>1)for(var s=0;s<t.length;s++)t[s].parentNode.insertBefore(this[r].cloneNode(!0),t[s].nextSibling)},next:function(t){return new e(this.length>0?t?this[0].nextElementSibling&&a(this[0].nextElementSibling).is(t)?[this[0].nextElementSibling]:[]:this[0].nextElementSibling?[this[0].nextElementSibling]:[]:[])},nextAll:function(t){var r=[],s=this[0];if(!s)return new e([]);for(;s.nextElementSibling;){var i=s.nextElementSibling;t?a(i).is(t)&&r.push(i):r.push(i),s=i}return new e(r)},prev:function(t){return new e(this.length>0?t?this[0].previousElementSibling&&a(this[0].previousElementSibling).is(t)?[this[0].previousElementSibling]:[]:this[0].previousElementSibling?[this[0].previousElementSibling]:[]:[])},prevAll:function(t){var r=[],s=this[0];if(!s)return new e([]);for(;s.previousElementSibling;){var i=s.previousElementSibling;t?a(i).is(t)&&r.push(i):r.push(i),s=i}return new e(r)},parent:function(e){for(var t=[],r=0;r<this.length;r++)e?a(this[r].parentNode).is(e)&&t.push(this[r].parentNode):t.push(this[r].parentNode);return a(a.unique(t))},parents:function(e){for(var t=[],r=0;r<this.length;r++)for(var s=this[r].parentNode;s;)e?a(s).is(e)&&t.push(s):t.push(s),s=s.parentNode;return a(a.unique(t))},find:function(a){for(var t=[],r=0;r<this.length;r++)for(var s=this[r].querySelectorAll(a),i=0;i<s.length;i++)t.push(s[i]);return new e(t)},children:function(t){for(var r=[],s=0;s<this.length;s++)for(var i=this[s].childNodes,n=0;n<i.length;n++)t?1===i[n].nodeType&&a(i[n]).is(t)&&r.push(i[n]):1===i[n].nodeType&&r.push(i[n]);return new e(a.unique(r))},remove:function(){for(var e=0;e<this.length;e++)this[e].parentNode&&this[e].parentNode.removeChild(this[e]);return this},add:function(){var e,t,r=this;for(e=0;e<arguments.length;e++){var s=a(arguments[e]);for(t=0;t<s.length;t++)r[r.length]=s[t],r.length++}return r}},a.fn=e.prototype,a.unique=function(e){for(var a=[],t=0;t<e.length;t++)-1===a.indexOf(e[t])&&a.push(e[t]);return a},a}()),r=["jQuery","Zepto","Dom7"],s=0;s<r.length;s++)window[r[s]]&&e(window[r[s]]);var i;i="undefined"==typeof t?window.Dom7||window.Zepto||window.jQuery:t,i&&("transitionEnd"in i.fn||(i.fn.transitionEnd=function(e){function a(i){if(i.target===this)for(e.call(this,i),t=0;t<r.length;t++)s.off(r[t],a)}var t,r=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],s=this;if(e)for(t=0;t<r.length;t++)s.on(r[t],a);return this}),"transform"in i.fn||(i.fn.transform=function(e){for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransform=t.MsTransform=t.msTransform=t.MozTransform=t.OTransform=t.transform=e}return this}),"transition"in i.fn||(i.fn.transition=function(e){"string"!=typeof e&&(e+="ms");for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransitionDuration=t.MsTransitionDuration=t.msTransitionDuration=t.MozTransitionDuration=t.OTransitionDuration=t.transitionDuration=e}return this})),window.Swiper=a}(),"undefined"!=typeof module?module.exports=window.Swiper:"function"==typeof define&&define.amd&&define([],function(){"use strict";return window.Swiper});
//# sourceMappingURL=maps/swiper.min.js.map


(function(e,t,n){"use strict";var r=function(e){console.log(e)};var i=e(t),s=t.document,o=e(s);var u=function(){var e,t=3,n=s.createElement("div"),r=n.getElementsByTagName("i");while(n.innerHTML="<!--[if gt IE "+ ++t+"]><i></i><![endif]-->",r[0]){}return t>4?t:e}();var a=function(){var e=t.pageXOffset!==n?t.pageXOffset:s.compatMode=="CSS1Compat"?t.document.documentElement.scrollLeft:t.document.body.scrollLeft,r=t.pageYOffset!==n?t.pageYOffset:s.compatMode=="CSS1Compat"?t.document.documentElement.scrollTop:t.document.body.scrollTop;if(typeof a.x=="undefined"){a.x=e;a.y=r}if(typeof a.distanceX=="undefined"){a.distanceX=e;a.distanceY=r}else{a.distanceX=e-a.x;a.distanceY=r-a.y}var i=a.x-e,o=a.y-r;a.direction=i<0?"right":i>0?"left":o<=0?"down":o>0?"up":"first";a.x=e;a.y=r};i.on("scroll",a);e.fn.style=function(n){if(!n)return null;var r=e(this),i;var o=r.clone().css("display","none");o.find("input:radio").attr("name","copy-"+Math.floor(Math.random()*100+1));r.after(o);var u=function(e,n){var i;if(e.currentStyle){i=e.currentStyle[n.replace(/-\w/g,function(e){return e.toUpperCase().replace("-","")})]}else if(t.getComputedStyle){i=s.defaultView.getComputedStyle(e,null).getPropertyValue(n)}i=/margin/g.test(n)?parseInt(i)===r[0].offsetLeft?i:"auto":i;return i};if(typeof n=="string"){i=u(o[0],n)}else{i={};e.each(n,function(e,t){i[t]=u(o[0],t)})}o.remove();return i||null};e.fn.extend({hcSticky:function(r){if(this.length==0)return this;this.pluginOptions("hcSticky",{top:0,bottom:0,bottomEnd:0,innerTop:0,innerSticker:null,className:"sticky",wrapperClassName:"wrapper-sticky",stickTo:null,responsive:true,followScroll:true,offResolutions:null,onStart:e.noop,onStop:e.noop,on:true,fn:null},r||{},{reinit:function(){e(this).hcSticky()},stop:function(){e(this).pluginOptions("hcSticky",{on:false}).each(function(){var t=e(this),n=t.pluginOptions("hcSticky"),r=t.parent("."+n.wrapperClassName);var i=t.offset().top-r.offset().top;t.css({position:"absolute",top:i,bottom:"auto",left:"auto",right:"auto"}).removeClass(n.className)})},off:function(){e(this).pluginOptions("hcSticky",{on:false}).each(function(){var t=e(this),n=t.pluginOptions("hcSticky"),r=t.parent("."+n.wrapperClassName);t.css({position:"relative",top:"auto",bottom:"auto",left:"auto",right:"auto"}).removeClass(n.className);r.css("height","auto")})},on:function(){e(this).each(function(){e(this).pluginOptions("hcSticky",{on:true,remember:{offsetTop:i.scrollTop()}}).hcSticky()})},destroy:function(){var t=e(this),n=t.pluginOptions("hcSticky"),r=t.parent("."+n.wrapperClassName);t.removeData("hcStickyInit").css({position:r.css("position"),top:r.css("top"),bottom:r.css("bottom"),left:r.css("left"),right:r.css("right")}).removeClass(n.className);i.off("resize",n.fn.resize).off("scroll",n.fn.scroll);t.unwrap()}});if(r&&typeof r.on!="undefined"){if(r.on){this.hcSticky("on")}else{this.hcSticky("off")}}if(typeof r=="string")return this;return this.each(function(){var r=e(this),s=r.pluginOptions("hcSticky");var f=function(){var e=r.parent("."+s.wrapperClassName);if(e.length>0){e.css({height:r.outerHeight(true),width:function(){var t=e.style("width");if(t.indexOf("%")>=0||t=="auto"){if(r.css("box-sizing")=="border-box"||r.css("-moz-box-sizing")=="border-box"){r.css("width",e.width())}else{r.css("width",e.width()-parseInt(r.css("padding-left")-parseInt(r.css("padding-right"))))}return t}else{return r.outerWidth(true)}}()});return e}else{return false}}()||function(){var t=r.style(["width","margin-left","left","right","top","bottom","float","display"]);var n=r.css("display");var i=e("<div>",{"class":s.wrapperClassName}).css({display:n,height:r.outerHeight(true),width:function(){if(t["width"].indexOf("%")>=0||t["width"]=="auto"&&n!="inline-block"&&n!="inline"){r.css("width",parseFloat(r.css("width")));return t["width"]}else if(t["width"]=="auto"&&(n=="inline-block"||n=="inline")){return r.width()}else{return t["margin-left"]=="auto"?r.outerWidth():r.outerWidth(true)}}(),margin:t["margin-left"]?"auto":null,position:function(){var e=r.css("position");return e=="static"?"relative":e}(),"float":t["float"]||null,left:t["left"],right:t["right"],top:t["top"],bottom:t["bottom"],"vertical-align":"top"});r.wrap(i);if(u===7){if(e("head").find("style#hcsticky-iefix").length===0){e('<style id="hcsticky-iefix">.'+s.wrapperClassName+" {zoom: 1;}</style>").appendTo("head")}}return r.parent()}();if(r.data("hcStickyInit"))return;r.data("hcStickyInit",true);var l=s.stickTo&&(s.stickTo=="document"||s.stickTo.nodeType&&s.stickTo.nodeType==9||typeof s.stickTo=="object"&&s.stickTo instanceof(typeof HTMLDocument!="undefined"?HTMLDocument:Document))?true:false;var c=s.stickTo?l?o:typeof s.stickTo=="string"?e(s.stickTo):s.stickTo:f.parent();r.css({top:"auto",bottom:"auto",left:"auto",right:"auto"});i.load(function(){if(r.outerHeight(true)>c.height()){f.css("height",r.outerHeight(true));r.hcSticky("reinit")}});var h=function(e){if(r.hasClass(s.className))return;e=e||{};r.css({position:"fixed",top:e.top||0,left:e.left||f.offset().left}).addClass(s.className);s.onStart.apply(r[0]);f.addClass("sticky-active")},p=function(e){e=e||{};e.position=e.position||"absolute";e.top=e.top||0;e.left=e.left||0;if(r.css("position")!="fixed"&&parseInt(r.css("top"))==e.top)return;r.css({position:e.position,top:e.top,left:e.left}).removeClass(s.className);s.onStop.apply(r[0]);f.removeClass("sticky-active")};var d=function(t){if(!s.on||!r.is(":visible"))return;if(r.outerHeight(true)>=c.height()){p();return}var n=s.innerSticker?e(s.innerSticker).position().top:s.innerTop?s.innerTop:0,o=f.offset().top,u=c.height()-s.bottomEnd+(l?0:o),d=f.offset().top-s.top+n,v=r.outerHeight(true)+s.bottom,m=i.height(),g=i.scrollTop(),y=r.offset().top,b=y-g,w;if(typeof s.remember!="undefined"&&s.remember){var E=y-s.top-n;if(v-n>m&&s.followScroll){if(E<g&&g+m<=E+r.height()){s.remember=false}}else{if(s.remember.offsetTop>E){if(g<=E){h({top:s.top-n});s.remember=false}}else{if(g>=E){h({top:s.top-n});s.remember=false}}}return}if(g>d){if(u+s.bottom-(s.followScroll&&m<v?0:s.top)<=g+v-n-(v-n>m-(d-n)&&s.followScroll?(w=v-m-n)>0?w:0:0)){p({top:u-v+s.bottom-o})}else if(v-n>m&&s.followScroll){if(b+v<=m){if(a.direction=="down"){h({top:m-v})}else{if(b<0&&r.css("position")=="fixed"){p({top:y-(d+s.top-n)-a.distanceY})}}}else{if(a.direction=="up"&&y>=g+s.top-n){h({top:s.top-n})}else if(a.direction=="down"&&y+v>m&&r.css("position")=="fixed"){p({top:y-(d+s.top-n)-a.distanceY})}}}else{h({top:s.top-n})}}else{p()}};var v=false,m=false;var g=function(){b();y();if(!s.on)return;var e=function(){if(r.css("position")=="fixed"){r.css("left",f.offset().left)}else{r.css("left",0)}};if(s.responsive){if(!m){m=r.clone().attr("style","").css({visibility:"hidden",height:0,overflow:"hidden",paddingTop:0,paddingBottom:0,marginTop:0,marginBottom:0});f.after(m)}var t=f.style("width");var n=m.style("width");if(n=="auto"&&t!="auto"){n=parseInt(r.css("width"))}if(n!=t){f.width(n)}if(v){clearTimeout(v)}v=setTimeout(function(){v=false;m.remove();m=false},250)}e();if(r.outerWidth(true)!=f.width()){var i=r.css("box-sizing")=="border-box"||r.css("-moz-box-sizing")=="border-box"?f.width():f.width()-parseInt(r.css("padding-left"))-parseInt(r.css("padding-right"));i=i-parseInt(r.css("margin-left"))-parseInt(r.css("margin-right"));r.css("width",i)}};r.pluginOptions("hcSticky",{fn:{scroll:d,resize:g}});var y=function(){if(s.offResolutions){if(!e.isArray(s.offResolutions)){s.offResolutions=[s.offResolutions]}var t=true;e.each(s.offResolutions,function(e,n){if(n<0){if(i.width()<n*-1){t=false;r.hcSticky("off")}}else{if(i.width()>n){t=false;r.hcSticky("off")}}});if(t&&!s.on){r.hcSticky("on")}}};y();i.on("resize",g);var b=function(){var r=false;if(e._data(t,"events").scroll!=n){e.each(e._data(t,"events").scroll,function(e,t){if(t.handler==s.fn.scroll){r=true}})}if(!r){s.fn.scroll(true);i.on("scroll",s.fn.scroll)}};b()})}})})(jQuery,this);(function(e,t){"use strict";e.fn.extend({pluginOptions:function(n,r,i,s){if(!this.data(n))this.data(n,{});if(n&&typeof r=="undefined")return this.data(n).options;i=i||r||{};if(typeof i=="object"||i===t){return this.each(function(){var t=e(this);if(!t.data(n).options){t.data(n,{options:e.extend(r,i||{})});if(s){t.data(n).commands=s}}else{t.data(n,e.extend(t.data(n),{options:e.extend(t.data(n).options,i||{})}))}})}else if(typeof i=="string"){return this.each(function(){e(this).data(n).commands[i].call(this)})}else{return this}}})})(jQuery)


