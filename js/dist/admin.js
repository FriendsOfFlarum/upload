/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction");

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };
  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }
        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }
    var previousPromise;
    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }
      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }
  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };
  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }
      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }
      context.method = method;
      context.arg = arg;
      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }
          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }
        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;
          if (record.arg === ContinueSentinel) {
            continue;
          }
          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;
      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);
          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }
        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }
      return ContinueSentinel;
    }
    var record = tryCatch(method, delegate.iterator, context.arg);
    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }
    var info = record.arg;
    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }
    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function () {
    return this;
  });
  define(Gp, "toString", function () {
    return "[object Generator]";
  });
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    if (1 in locs) {
      entry.catchLoc = locs[1];
    }
    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }
    this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }
  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }
  exports.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }
      if (typeof iterable.next === "function") {
        return iterable;
      }
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }
            next.value = undefined;
            next.done = true;
            return next;
          };
        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return {
      next: doneResult
    };
  }
  exports.values = values;
  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }
  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);
      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }
      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }
        return !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;
        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }
      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;
      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }
      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }
      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };
      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }
      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;
}(
// If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
 true ? module.exports : 0);
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/***/ }),

/***/ "./src/admin/components/InspectMimeModal.js":
/*!**************************************************!*\
  !*** ./src/admin/components/InspectMimeModal.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InspectMimeModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__);




var InspectMimeModal = /*#__PURE__*/function (_Modal) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(InspectMimeModal, _Modal);
  function InspectMimeModal() {
    return _Modal.apply(this, arguments) || this;
  }
  var _proto = InspectMimeModal.prototype;
  _proto.oninit = function oninit(vnode) {
    _Modal.prototype.oninit.call(this, vnode);
    this.uploading = false;
    this.inspection = {};
  };
  _proto.className = function className() {
    return 'Modal--small fof-upload-inspect-mime-modal';
  };
  _proto.title = function title() {
    return flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.title');
  };
  _proto.content = function content() {
    return m("div", {
      className: "Modal-body"
    }, m("p", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.description', {
      a: m("a", {
        href: "https://github.com/SoftCreatR/php-mime-detector"
      })
    })), m("p", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.select')), m("div", null, m("input", {
      type: "file",
      onchange: this.onupload.bind(this),
      disabled: this.uploading
    }), this.uploading ? flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default().component() : null), m("dl", null, m("dt", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.laravel-validation')), m("dd", null, typeof this.inspection.laravel_validation === 'undefined' ? m("em", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.no-file-selected')) : this.inspection.laravel_validation ? flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.validation-passed') : flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.validation-failed', {
      error: this.inspection.laravel_validation_error || '?'
    }))), m("dl", null, m("dt", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.mime-detector')), m("dd", null, this.inspection.mime_detector ? m("code", null, this.inspection.mime_detector) : m("em", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.not-available')))), m("dl", null, m("dt", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.mime-fileinfo')), m("dd", null, this.inspection.php_mime ? m("code", null, this.inspection.php_mime) : m("em", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.not-available')))), m("dl", null, m("dt", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.guessed-extension')), m("dd", null, this.inspection.guessed_extension ? m("code", null, this.inspection.guessed_extension) : m("em", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.inspect-mime.not-available')))));
  };
  _proto.onupload = function onupload(event) {
    var _this = this;
    var body = new FormData();
    for (var i = 0; i < event.target.files.length; i++) {
      body.append('files[]', event.target.files[i]);
    }
    this.uploading = true;
    return flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().request({
      method: 'POST',
      url: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('apiUrl') + '/fof/upload/inspect-mime',
      serialize: function serialize(raw) {
        return raw;
      },
      body: body
    }).then(function (result) {
      _this.uploading = false;
      _this.inspection = result;
      m.redraw();
    })["catch"](function (error) {
      _this.uploading = false;
      _this.inspection = {};
      m.redraw();
      throw error;
    });
  };
  return InspectMimeModal;
}((flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/admin/components/SharedUploadPage.tsx":
/*!***************************************************!*\
  !*** ./src/admin/components/SharedUploadPage.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SharedUploadPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_admin_components_AdminPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/admin/components/AdminPage */ "flarum/admin/components/AdminPage");
/* harmony import */ var flarum_admin_components_AdminPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_AdminPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_components_UploadSharedFileModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../common/components/UploadSharedFileModal */ "./src/common/components/UploadSharedFileModal.tsx");
/* harmony import */ var _common_components_SharedFileList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../common/components/SharedFileList */ "./src/common/components/SharedFileList.tsx");
/* harmony import */ var _common_states_FileListState__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../common/states/FileListState */ "./src/common/states/FileListState.ts");








var SharedUploadPage = /*#__PURE__*/function (_AdminPage) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SharedUploadPage, _AdminPage);
  function SharedUploadPage() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _AdminPage.call.apply(_AdminPage, [this].concat(args)) || this;
    _this.sharedUploads = [];
    _this.currentPage = 1;
    _this.fileState = void 0;
    return _this;
  }
  var _proto = SharedUploadPage.prototype;
  _proto.oninit = function oninit(vnode) {
    _AdminPage.prototype.oninit.call(this, vnode);
    this.fileState = new _common_states_FileListState__WEBPACK_IMPORTED_MODULE_7__["default"](true);
  };
  _proto.headerInfo = function headerInfo() {
    return {
      className: 'SharedUploadPage--header',
      icon: 'fas fa-file-upload',
      title: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.shared-uploads.title'),
      description: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.shared-uploads.description')
    };
  };
  _proto.content = function content() {
    return m("div", {
      className: "SharedUploadPage--content"
    }, m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.shared-uploads.introduction')), m("hr", null), m("div", {
      className: "SharedUploadPage--main-actions"
    }, this.mainActionItems().toArray()), m("hr", null), m("div", {
      className: "SharedUploadPage--uploads"
    }, m(_common_components_SharedFileList__WEBPACK_IMPORTED_MODULE_6__["default"], {
      user: (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().session).user,
      selectable: false,
      fileState: this.fileState,
      onDelete: this.onDelete.bind(this)
    })));
  };
  _proto.showUploadModal = function showUploadModal() {
    var _this2 = this;
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show(_common_components_UploadSharedFileModal__WEBPACK_IMPORTED_MODULE_5__["default"], {
      onUploadComplete: function onUploadComplete(files) {
        _this2.uploadComplete(files);
      }
    });
  };
  _proto.mainActionItems = function mainActionItems() {
    var _this3 = this;
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default())();
    items.add('refresh', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button Button--icon",
      icon: "fas fa-sync",
      onclick: function onclick() {
        return _this3.refresh();
      }
    }));
    items.add('upload-new', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button",
      icon: "fas fa-upload",
      onclick: function onclick() {
        return _this3.showUploadModal();
      }
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.shared-uploads.upload-new-button')));
    return items;
  };
  _proto.fileActionItems = function fileActionItems(file) {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default())();
    return items;
  };
  _proto.uploadComplete = function uploadComplete(files) {
    console.log('upload complete', files);
    this.fileState.addToList(files);
  };
  _proto.refresh = function refresh() {
    this.fileState.refresh();
  };
  _proto.onDelete = function onDelete(file) {
    this.fileState.removeFromList(file);
  };
  return SharedUploadPage;
}((flarum_admin_components_AdminPage__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/admin/components/UploadPage.js":
/*!********************************************!*\
  !*** ./src/admin/components/UploadPage.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/admin/utils/saveSettings */ "flarum/admin/utils/saveSettings");
/* harmony import */ var flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Alert */ "flarum/common/components/Alert");
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Select */ "flarum/common/components/Select");
/* harmony import */ var flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Switch */ "flarum/common/components/Switch");
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/admin/components/UploadImageButton */ "flarum/admin/components/UploadImageButton");
/* harmony import */ var flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/utils/withAttr */ "flarum/common/utils/withAttr");
/* harmony import */ var flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/admin/components/ExtensionPage */ "flarum/admin/components/ExtensionPage");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _InspectMimeModal__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./InspectMimeModal */ "./src/admin/components/InspectMimeModal.js");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_14__);
















/* global m */
var UploadPage = /*#__PURE__*/function (_ExtensionPage) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UploadPage, _ExtensionPage);
  function UploadPage() {
    return _ExtensionPage.apply(this, arguments) || this;
  }
  var _proto = UploadPage.prototype;
  _proto.oninit = function oninit(vnode) {
    var _this = this;
    _ExtensionPage.prototype.oninit.call(this, vnode);
    // whether we are saving the settings or not right now
    this.loading = false;

    // the fields we need to watch and to save
    this.fields = [
    // image
    'resizeMaxWidth', 'cdnUrl', 'maxFileSize', 'whitelistedClientExtensions', 'composerButtonVisiblity',
    // watermark
    'watermark', 'watermarkPosition',
    // Imgur
    'imgurClientId',
    // AWS
    'awsS3Key', 'awsS3Secret', 'awsS3Bucket', 'awsS3Region', 'awsS3Endpoint', 'awsS3ACL',
    // QIniu
    'qiniuKey', 'qiniuSecret', 'qiniuBucket'];

    // the checkboxes we need to watch and to save.
    this.checkboxes = ['mustResize', 'addsWatermarks', 'disableHotlinkProtection', 'disableDownloadLogging', 'awsS3UsePathStyleEndpoint'];

    // fields that are objects
    this.objects = ['mimeTypes'];

    // watermark positions
    this.watermarkPositions = {
      'top-left': 'top-left',
      'top-right': 'top-right',
      'bottom-left': 'bottom-left',
      'bottom-right': 'bottom-right',
      center: 'center',
      left: 'left',
      top: 'top',
      right: 'right',
      bottom: 'bottom'
    };

    // Composer button options
    this.composerButtonVisiblityOptions = {
      both: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.composer_buttons.options.both'),
      'upload-btn': flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.composer_buttons.options.upload-btn'),
      'media-btn': flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.composer_buttons.options.media-btn')
    };

    // get the saved settings from the database
    var settings = (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings;

    // our package prefix (to be added to every field and checkbox in the setting table)
    this.settingsPrefix = 'fof-upload';

    // Options for the Upload methods dropdown menu.
    this.uploadMethodOptions = settings[this.addPrefix('availableUploadMethods')] || {};
    // Options for the Template dropdown menu.
    this.templateOptions = settings[this.addPrefix('availableTemplates')] || {};
    // Contains current values.
    this.values = {};
    // bind the values of the fields and checkboxes to the getter/setter functions
    this.fields.forEach(function (key) {
      return _this.values[key] = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()(settings[_this.addPrefix(key)]);
    });
    this.checkboxes.forEach(function (key) {
      return _this.values[key] = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()(settings[_this.addPrefix(key)] === '1');
    });
    this.objects.forEach(function (key) {
      return _this.values[key] = settings[_this.addPrefix(key)] ? flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()(JSON.parse(settings[_this.addPrefix(key)])) : flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()();
    });

    // Set a sane default in case no mimeTypes have been configured yet.
    // Since 'local' (or others) can now be disabled, pick the last entry in the object for default
    this.defaultAdap = Object.keys(this.uploadMethodOptions)[Object.keys(this.uploadMethodOptions).length - 1];
    this.values.mimeTypes() || (this.values.mimeTypes = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()({
      '^image\\/.*': {
        adapter: this.defaultAdap,
        template: 'image-preview'
      }
    }));
    this.newMimeType = {
      regex: flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()(''),
      adapter: flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()(this.defaultAdap),
      template: flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_9___default()('file')
    };
  }

  /**
   * Show the actual ImageUploadPage.
   *
   * @returns {*}
   */;
  _proto.content = function content() {
    var _this2 = this;
    var max_post = (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings[this.addPrefix('php_ini.post_max_size')];
    var max_upload = (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings[this.addPrefix('php_ini.upload_max_filesize')];
    return [m('.UploadPage', [m('.container', [m('form', {
      onsubmit: this.onsubmit.bind(this)
    }, [m('fieldset', [m('legend', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.title')), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.max_file_size')), m('input.FormControl', {
      value: this.values.maxFileSize(),
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.maxFileSize),
      type: 'number',
      min: '0'
    }), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.php_ini_values', {
      post: max_post,
      upload: max_upload
    })), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.preferences.mime_types')), m('.MimeTypes--Container', Object.keys(this.values.mimeTypes()).map(function (mime) {
      var config = _this2.values.mimeTypes()[mime];
      // Compatibility for older versions.
      if (typeof config !== 'object') {
        config = {
          adapter: config,
          template: 'file'
        };
      }
      return m('div', [m('input.FormControl.MimeTypes', {
        value: mime,
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', _this2.updateMimeTypeKey.bind(_this2, mime))
      }), flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default().component({
        options: _this2.uploadMethodOptions,
        onchange: _this2.updateMimeTypeAdapter.bind(_this2, mime, config),
        value: config.adapter || 'local'
      }), flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default().component({
        options: _this2.getTemplateOptionsForInput(),
        onchange: _this2.updateMimeTypeTemplate.bind(_this2, mime, config),
        value: config.template || 'local'
      }), flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default().component({
        type: 'button',
        className: 'Button Button--warning',
        onclick: _this2.deleteMimeType.bind(_this2, mime)
      }, 'x')]);
    }), m('br'), m('div', [m('input.FormControl.MimeTypes.add-MimeType-key', {
      value: this.newMimeType.regex(),
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.newMimeType.regex)
    }), flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default().component({
      options: this.uploadMethodOptions,
      className: 'add-MimeType-value',
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.newMimeType.adapter),
      value: this.newMimeType.adapter()
    }), flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default().component({
      options: this.getTemplateOptionsForInput(),
      className: 'add-MimeType-value',
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.newMimeType.template),
      value: this.newMimeType.template()
    }), flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default().component({
      type: 'button',
      className: 'Button Button--warning',
      onclick: this.addMimeType.bind(this)
    }, '+')])), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.mime_types')), flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default().component({
      className: 'Button',
      onclick: function onclick() {
        flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show(_InspectMimeModal__WEBPACK_IMPORTED_MODULE_12__["default"]);
      }
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.inspect-mime')), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.download_templates')), this.templateOptionsDescriptions()]), m('fieldset.composerButtons', [m('legend', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.composer_buttons.title')), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.composer_buttons')), m('div', [flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default().component({
      options: this.composerButtonVisiblityOptions,
      onchange: this.values.composerButtonVisiblity,
      value: this.values.composerButtonVisiblity() || 'both'
    })])]), m('fieldset', [m('legend', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.resize.title')), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.resize')), flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default().component({
      state: this.values.mustResize() || false,
      onchange: this.values.mustResize
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.resize.toggle')), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.resize.max_width')), m('input', {
      className: 'FormControl',
      value: this.values.resizeMaxWidth() || 100,
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.resizeMaxWidth),
      disabled: !this.values.mustResize(),
      type: 'number',
      min: '0'
    })]), m('fieldset', [m('legend', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.client_extension.title')), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.client_extension')), m('input', {
      className: 'FormControl',
      value: this.values.whitelistedClientExtensions() || '',
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.whitelistedClientExtensions)
    })]), m('fieldset', [m('legend', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.watermark.title')), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.watermark')), flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default().component({
      state: this.values.addsWatermarks() || false,
      onchange: this.values.addsWatermarks
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.watermark.toggle')), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.watermark.position')), m('div', [flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_5___default().component({
      options: this.watermarkPositions,
      onchange: this.values.watermarkPosition,
      value: this.values.watermarkPosition() || 'bottom-right'
    })]), m('label', {}, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.watermark.file')), flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_7___default().component({
      name: 'fof/watermark'
    })]), m('fieldset', [m('legend', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.disable-hotlink-protection.title')), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.disable-hotlink-protection')), flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default().component({
      state: this.values.disableHotlinkProtection() || false,
      onchange: this.values.disableHotlinkProtection
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.disable-hotlink-protection.toggle')), m('legend', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.disable-download-logging.title')), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.disable-download-logging')), flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default().component({
      state: this.values.disableDownloadLogging() || false,
      onchange: this.values.disableDownloadLogging
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.disable-download-logging.toggle'))]), m('fieldset', [m('legend', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.local.title')), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.local.cdn_url')), m('input.FormControl', {
      value: this.values.cdnUrl() || '',
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.cdnUrl)
    })]), this.adaptorItems().toArray(), flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default().component({
      type: 'submit',
      className: 'Button Button--primary',
      loading: this.loading,
      disabled: !this.changed()
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('core.admin.settings.submit_button'))])])])];
  };
  _proto.adaptorItems = function adaptorItems() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_11___default())();
    if (this.uploadMethodOptions['imgur'] !== undefined) {
      items.add('imgur', m("div", {
        className: "imgur"
      }, m("fieldset", null, m("legend", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.imgur.title')), m("p", null, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_13___default()('fas fa-exclamation-circle'), ' ', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.imgur.tos', {
        a: m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_14___default()), {
          href: "https://imgur.com/tos",
          external: true,
          target: "_blank"
        })
      })), m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.imgur.client_id')), m("input", {
        className: "FormControl",
        value: this.values.imgurClientId() || '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.imgurClientId)
      }))), 100);
    }
    if (this.uploadMethodOptions['qiniu'] !== undefined) {
      items.add('qiniu', m('.qiniu', [m('fieldset', [m('legend', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.qiniu.title')), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.qiniu.key')), m('input.FormControl', {
        value: this.values.qiniuKey() || '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.qiniuKey)
      }), m('label', {}, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.qiniu.secret')), m('input.FormControl', {
        value: this.values.qiniuSecret() || '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.qiniuSecret)
      }), m('label', {}, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.qiniu.bucket')), m('input.FormControl', {
        value: this.values.qiniuBucket() || '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.qiniuBucket)
      })])]), 80);
    }
    if (this.uploadMethodOptions['aws-s3'] !== undefined) {
      items.add('aws-s3', m('.aws', [m('fieldset', [m('legend', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.title')), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.s3_instance_profile')), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.key')), m('input.FormControl', {
        value: this.values.awsS3Key() || '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3Key)
      }), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.secret')), m('input.FormControl', {
        value: this.values.awsS3Secret() || '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3Secret)
      }), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.bucket')), m('input.FormControl', {
        value: this.values.awsS3Bucket() || '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3Bucket)
      }), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.region')), m('input.FormControl', {
        value: this.values.awsS3Region() || '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3Region)
      })]), m('fieldset', [m('legend', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.advanced_title')), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.s3_compatible_storage')), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.endpoint')), m('input.FormControl', {
        value: this.values.awsS3Endpoint() || '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3Endpoint)
      }), flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default().component({
        state: this.values.awsS3UsePathStyleEndpoint() || false,
        onchange: this.values.awsS3UsePathStyleEndpoint
      }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.use_path_style_endpoint')), m('label', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.labels.aws-s3.acl')), m('input.FormControl', {
        value: this.values.awsS3ACL() || '',
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_8___default()('value', this.values.awsS3ACL)
      }), m('.helpText', flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.admin.help_texts.s3_acl'))])]), 60);
    }
    return items;
  };
  _proto.getTemplateOptionsForInput = function getTemplateOptionsForInput() {
    var options = {};
    for (var option in this.templateOptions) {
      if (!this.templateOptions.hasOwnProperty(option)) {
        continue;
      }
      options[option] = this.templateOptions[option].name;
    }
    return options;
  };
  _proto.updateMimeTypeKey = function updateMimeTypeKey(mime, value) {
    this.values.mimeTypes()[value] = this.values.mimeTypes()[mime];
    this.deleteMimeType(mime);
  };
  _proto.updateMimeTypeAdapter = function updateMimeTypeAdapter(mime, config, value) {
    config.adapter = value;
    this.values.mimeTypes()[mime] = config;
  };
  _proto.updateMimeTypeTemplate = function updateMimeTypeTemplate(mime, config, value) {
    config.template = value;
    this.values.mimeTypes()[mime] = config;
  };
  _proto.deleteMimeType = function deleteMimeType(mime) {
    delete this.values.mimeTypes()[mime];
  };
  _proto.templateOptionsDescriptions = function templateOptionsDescriptions() {
    var children = [];
    for (var template in this.templateOptions) {
      if (!this.templateOptions.hasOwnProperty(template)) {
        continue;
      }
      children.push(m("li", null, this.templateOptions[template].name, ": ", m.trust(this.templateOptions[template].description)));
    }
    return m('ul', children);
  };
  _proto.addMimeType = function addMimeType() {
    this.values.mimeTypes()[this.newMimeType.regex()] = {
      adapter: this.newMimeType.adapter(),
      template: this.newMimeType.template()
    };
    this.newMimeType.regex('');
    this.newMimeType.adapter('local');
    this.newMimeType.template('file');
  }

  /**
   * Checks if the values of the fields and checkboxes are different from
   * the ones stored in the database
   *
   * @returns boolean
   */;
  _proto.changed = function changed() {
    var _this3 = this;
    var fieldsCheck = this.fields.some(function (key) {
      return _this3.values[key]() !== (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings[_this3.addPrefix(key)];
    });
    var checkboxesCheck = this.checkboxes.some(function (key) {
      return _this3.values[key]() !== ((flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings[_this3.addPrefix(key)] === '1');
    });
    var objectsCheck = this.objects.some(function (key) {
      return JSON.stringify(_this3.values[key]()) !== (flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().data).settings[_this3.addPrefix(key)];
    });
    return fieldsCheck || checkboxesCheck || objectsCheck;
  }

  /**
   * Saves the settings to the database and redraw the page
   *
   * @param e
   */;
  _proto.onsubmit = function onsubmit(e) {
    var _this4 = this;
    // prevent the usual form submit behaviour
    e.preventDefault();

    // if the page is already saving, do nothing
    if (this.loading) return;

    // prevents multiple savings
    this.loading = true;

    // remove previous success popup
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.dismiss(this.successAlert);
    var settings = {};

    // gets all the values from the form
    this.fields.forEach(function (key) {
      return settings[_this4.addPrefix(key)] = _this4.values[key]();
    });
    this.checkboxes.forEach(function (key) {
      return settings[_this4.addPrefix(key)] = _this4.values[key]();
    });
    this.objects.forEach(function (key) {
      return settings[_this4.addPrefix(key)] = JSON.stringify(_this4.values[key]());
    });

    // actually saves everything in the database
    flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3___default()(settings).then(function () {
      // on success, show popup
      _this4.successAlert = flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.show((flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_4___default()), {
        type: 'success'
      }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('core.admin.settings.saved_message'));
    })["catch"](function () {}).then(function () {
      // return to the initial state and redraw the page
      _this4.loading = false;
      m.redraw();
    });
  }

  /**
   * Adds the prefix `this.settingsPrefix` at the beginning of `key`
   *
   * @returns string
   */;
  _proto.addPrefix = function addPrefix(key) {
    return this.settingsPrefix + '.' + key;
  };
  return UploadPage;
}((flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_10___default()));


/***/ }),

/***/ "./src/admin/components/index.ts":
/*!***************************************!*\
  !*** ./src/admin/components/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* binding */ components)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _UploadPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UploadPage */ "./src/admin/components/UploadPage.js");
/* harmony import */ var _common_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/components */ "./src/common/components/index.ts");



var components = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _common_components__WEBPACK_IMPORTED_MODULE_2__.commonComponents, {
  UploadPage: _UploadPage__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/admin/extend.ts":
/*!*****************************!*\
  !*** ./src/admin/extend.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/extend */ "./src/common/extend.ts");
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extenders */ "flarum/common/extenders");
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_SharedUploadPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/SharedUploadPage */ "./src/admin/components/SharedUploadPage.tsx");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([].concat(_common_extend__WEBPACK_IMPORTED_MODULE_0__["default"], [new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1___default().Routes)() //
.add('adminUploads', '/uploads', _components_SharedUploadPage__WEBPACK_IMPORTED_MODULE_2__["default"])]));

/***/ }),

/***/ "./src/admin/extendAdminNav.tsx":
/*!**************************************!*\
  !*** ./src/admin/extendAdminNav.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ extendAdminNav)
/* harmony export */ });
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_admin_components_AdminNav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/admin/components/AdminNav */ "flarum/admin/components/AdminNav");
/* harmony import */ var flarum_admin_components_AdminNav__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_AdminNav__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__);




function extendAdminNav() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_admin_components_AdminNav__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'items', function (items) {
    items.add('shared-uploads', m((flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default()), {
      href: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().route('adminUploads'),
      icon: "fas fa-file-upload",
      title: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.shared-uploads.title')
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.nav.shared-uploads-button')), 49);
  });
}

/***/ }),

/***/ "./src/admin/index.ts":
/*!****************************!*\
  !*** ./src/admin/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_3__.components),
/* harmony export */   extend: () => (/* reexport safe */ _extend__WEBPACK_IMPORTED_MODULE_4__["default"])
/* harmony export */ });
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_UploadPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/UploadPage */ "./src/admin/components/UploadPage.js");
/* harmony import */ var _extendAdminNav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extendAdminNav */ "./src/admin/extendAdminNav.tsx");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components */ "./src/admin/components/index.ts");
/* harmony import */ var _extend__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./extend */ "./src/admin/extend.ts");





flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('fof-upload', function () {
  flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().extensionData["for"]('fof-upload').registerPage(_components_UploadPage__WEBPACK_IMPORTED_MODULE_1__["default"]).registerPermission({
    icon: 'far fa-file',
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.upload_label'),
    permission: 'fof-upload.upload'
  }, 'start', 50).registerPermission({
    icon: 'fas fa-download',
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.download_label'),
    permission: 'fof-upload.download',
    allowGuest: true
  }, 'view', 50).registerPermission({
    icon: 'fas fa-eye',
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.view_user_uploads_label'),
    permission: 'fof-upload.viewUserUploads'
  }, 'moderate', 50).registerPermission({
    icon: 'fas fa-trash',
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.delete_uploads_of_others_label'),
    permission: 'fof-upload.deleteUserUploads'
  }, 'moderate', 50).registerPermission({
    icon: 'far fa-file-alt',
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.upload_shared_label'),
    permission: 'fof-upload.upload-shared-files'
  }, 'start').registerPermission({
    icon: 'far fa-file-alt',
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.admin.permissions.access_shared_label'),
    permission: 'fof-upload.access-shared-files'
  }, 'start');
  (0,_extendAdminNav__WEBPACK_IMPORTED_MODULE_2__["default"])();

  //app.fileListState = new FileListState();
});

/***/ }),

/***/ "./src/common/components/AbstractFIleList.tsx":
/*!****************************************************!*\
  !*** ./src/common/components/AbstractFIleList.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractFileList)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _mimeToIcon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../mimeToIcon */ "./src/common/mimeToIcon.ts");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _DisplayFile__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./DisplayFile */ "./src/common/components/DisplayFile.tsx");
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/common/components/Alert */ "flarum/common/components/Alert");
/* harmony import */ var flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_12__);













var AbstractFileList = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(AbstractFileList, _Component);
  function AbstractFileList() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.user = null;
    _this.inModal = void 0;
    _this.restrictFileType = void 0;
    _this.downloadOnClick = void 0;
    _this.filesBeingHidden = void 0;
    _this.fileState = void 0;
    return _this;
  }
  var _proto = AbstractFileList.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.inModal = this.attrs.selectable;
    this.restrictFileType = this.attrs.restrictFileType || null;
    this.downloadOnClick = this.attrs.downloadOnClick || false;
    this.filesBeingHidden = [];
    this.fileState = this.attrs.fileState;
    this.loadFileList();
  };
  _proto.view = function view() {
    var _this2 = this;
    return m("div", {
      className: "SharedFileList fof-upload-file-list",
      "aria-live": "polite"
    }, this.isLoading() && this.fileCollection().length === 0 && m("div", {
      className: 'fof-upload-loading'
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-upload.lib.file_list.loading'), m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default()), null)), !this.isLoading() && this.fileCollection().length === 0 && m("div", {
      className: "Placeholder"
    }, m("p", {
      className: "fof-upload-empty"
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-upload.lib.file_list.empty'))), m("ul", null, this.fileCollection().map(function (file) {
      var _file$id, _file$id2;
      var fileIcon = (0,_mimeToIcon__WEBPACK_IMPORTED_MODULE_6__["default"])(file.type());
      var fileSelectable = _this2.restrictFileType ? _this2.isSelectable(file) : true;
      var fileClassNames = flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7___default()(['fof-file',
      // File is image
      fileIcon === 'far fa-file-image' && 'fof-file-type-image',
      // File is selected
      _this2.attrs.selectedFiles && _this2.attrs.selectedFiles.indexOf((_file$id = file.id()) != null ? _file$id : '') >= 0 && 'fof-file-selected']);
      var isFileHiding = _this2.filesBeingHidden.includes(file.uuid());
      return m("li", {
        "aria-busy": isFileHiding,
        key: file.uuid()
      }, m(_DisplayFile__WEBPACK_IMPORTED_MODULE_9__["default"], {
        file: file,
        fileSelectable: fileSelectable,
        isSelected: _this2.attrs.selectedFiles && _this2.attrs.selectedFiles.indexOf((_file$id2 = file.id()) != null ? _file$id2 : '') >= 0,
        fileClassNames: fileClassNames,
        isFileHiding: isFileHiding,
        onHide: _this2.hideFile.bind(_this2),
        onFileClick: _this2.onFileClick.bind(_this2),
        user: _this2.attrs.user,
        onDelete: _this2.onDelete.bind(_this2)
      }));
    }), this.hasMoreResults() && m("div", {
      className: 'fof-load-more-files'
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_8___default()), {
      className: 'Button Button--primary',
      disabled: this.isLoading(),
      loading: this.isLoading(),
      onclick: function onclick() {
        return _this2.loadMore();
      }
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-upload.lib.file_list.load_more_files_btn')))));
  };
  _proto.onDelete = function onDelete(file) {
    if (this.attrs.onDelete) {
      this.attrs.onDelete(file);
    }
  }

  // Common methods like onFileClick, isSelectable, hideFile...
  ;
  _proto.onFileClick = function onFileClick(file) {
    // Custom functionality
    if (this.attrs.onFileSelect) {
      this.attrs.onFileSelect(file);
      return;
    }

    // Download on click
    if (this.attrs.downloadOnClick) {
      window.open(file.url());
      return;
    }
  };
  _proto.isSelectable = function isSelectable(file) {
    var fileType = file.type();

    // Custom defined file types
    if (Array.isArray(this.restrictFileType)) {
      return this.restrictFileType.indexOf(fileType) >= 0;
    }

    // Image
    else if (this.restrictFileType === 'image') {
      return fileType.includes('image/');
    }

    // Audio
    else if (this.restrictFileType === 'audio') {
      return fileType.includes('audio/');
    }

    // Video
    else if (this.restrictFileType === 'video') {
      return fileType.includes('video/');
    }
    return false;
  }

  /**
   * Begins the hiding process for a file.
   *
   * - Shows a native confirmation dialog
   * - If confirmed, sends AJAX request to the hide file API
   */;
  _proto.hideFile =
  /*#__PURE__*/
  function () {
    var _hideFile = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee(file) {
      var uuid, transPrefix, confirmToggleHide, filePayload, index, i;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              uuid = file.uuid();
              if (!this.filesBeingHidden.includes(uuid)) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return");
            case 3:
              this.filesBeingHidden.push(uuid);
              transPrefix = file.isShared() ? 'fof-upload.lib.file_list.hide_shared_file' : 'fof-upload.lib.file_list.hide_file';
              confirmToggleHide = confirm(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_11___default()(flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans(file.hidden() ? transPrefix + ".show_confirmation" : transPrefix + ".hide_confirmation", {
                fileName: file.baseName()
              })));
              if (!confirmToggleHide) {
                _context.next = 24;
                break;
              }
              _context.prev = 7;
              _context.next = 10;
              return flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().request({
                method: 'PATCH',
                url: flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + "/fof/upload/hide",
                body: {
                  uuid: uuid
                }
              });
            case 10:
              filePayload = _context.sent;
              flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().store.pushPayload(filePayload);
              m.redraw();
              flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show((flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_10___default()), {
                type: 'success'
              }, [flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_12___default()(file.hidden() ? 'fas fa-eye-slash' : 'fas fa-eye'), ' ', flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans(file != null && file.hidden() ? transPrefix + ".hide_success" : transPrefix + ".show_success")]);
              if (this.fileState.user) {
                index = this.fileState.files.findIndex(function (file) {
                  return uuid === file.uuid();
                });
                this.fileState.files.splice(index, 1);
              }
              _context.next = 20;
              break;
            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](7);
              flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show((flarum_common_components_Alert__WEBPACK_IMPORTED_MODULE_10___default()), {
                type: 'error'
              }, flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans(file != null && file.hidden() ? transPrefix + ".hide_fail" : transPrefix + ".show_fail", {
                fileName: file.baseName()
              }));
            case 20:
              _context.prev = 20;
              // Remove file from hiding list
              i = this.filesBeingHidden.indexOf(uuid);
              this.filesBeingHidden.splice(i, 1);
              return _context.finish(20);
            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[7, 17, 20, 24]]);
    }));
    function hideFile(_x) {
      return _hideFile.apply(this, arguments);
    }
    return hideFile;
  }();
  return AbstractFileList;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_4___default()));


/***/ }),

/***/ "./src/common/components/DisplayFile.tsx":
/*!***********************************************!*\
  !*** ./src/common/components/DisplayFile.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DisplayFile)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _mimeToIcon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../mimeToIcon */ "./src/common/mimeToIcon.ts");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/common/components/Tooltip */ "flarum/common/components/Tooltip");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_10__);











var DisplayFile = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(DisplayFile, _Component);
  function DisplayFile() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.isFileHiding = void 0;
    _this.imageLoaded = true;
    _this.file = void 0;
    _this.fileIcon = void 0;
    _this.isSelected = void 0;
    _this.isSelectable = void 0;
    _this.handleImageError = function () {
      _this.imageLoaded = false;
      _this.fileIcon = 'fas fa-exclamation-triangle';
      _this.isSelectable = false;
      m.redraw();
    };
    _this.handleImageLoad = function () {
      _this.imageLoaded = true;
      m.redraw();
    };
    return _this;
  }
  var _proto = DisplayFile.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.file = this.attrs.file;
    this.isFileHiding = this.attrs.isFileHiding === undefined ? false : this.attrs.isFileHiding;
    this.fileIcon = (0,_mimeToIcon__WEBPACK_IMPORTED_MODULE_8__["default"])(this.file.type());
    this.isSelected = this.attrs.isSelected === undefined ? false : this.attrs.isSelected;
    this.isSelectable = this.attrs.fileSelectable === undefined ? true : this.attrs.fileSelectable;
  };
  _proto.onbeforeupdate = function onbeforeupdate(vnode) {
    _Component.prototype.onbeforeupdate.call(this, vnode);

    // Make sure the isSelected property is updated
    this.isSelected = this.attrs.isSelected === undefined ? false : this.attrs.isSelected;
  };
  _proto.view = function view() {
    var _this2 = this;
    var isImage = this.file.type().startsWith('image/');
    var fileSelectedClass = this.isSelected ? 'selected' : '';
    return m("div", {
      className: "UploadedFile " + fileSelectedClass,
      key: this.file.uuid(),
      onclick: function onclick() {
        if (_this2.isSelectable && !_this2.isFileHiding) {
          _this2.isSelected = !_this2.isSelected;
          _this2.attrs.onFileClick(_this2.file);
        }
      },
      disabled: !this.isSelectable || this.isFileHiding
    }, this.imageLoaded && isImage ? m("img", {
      src: this.file.url(),
      className: "fof-file-image-preview",
      draggable: false,
      onerror: this.handleImageError,
      onload: this.handleImageLoad,
      alt: this.file.baseName()
    }) : this.displayIcon(this.fileIcon), m("div", {
      className: "fof-file-actions"
    }, this.actionItems(this.file).toArray()), m("div", {
      className: "fof-file-name"
    }, m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_10___default()), {
      text: this.file.baseName()
    }, m("span", null, this.file.baseName()))), this.isFileHiding && m("div", {
      "class": "fof-file-loading",
      role: "status",
      "aria-label": flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-upload.lib.file_list.hide_file.loading')
    }, m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default()), null)));
  };
  _proto.displayIcon = function displayIcon(fileIcon) {
    return m("span", {
      className: "fof-file-icon",
      role: "presentation",
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%' // Ensure the container takes up the necessary space
      }
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default()("fa-fw " + fileIcon));
  };
  _proto.actionItems = function actionItems(file) {
    var _this3 = this;
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_9___default())();
    file.canViewInfo() && items.add('view-info', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_6___default()), {
      className: "Button Button--icon fof-file-action",
      icon: "fas fa-info-circle",
      "aria-label": "info",
      onclick: function onclick() {
        return _this3.viewFileInfo();
      }
    }), 100);
    var transPrefix = file.isShared() ? 'fof-upload.lib.file_list.hide_shared_file' : 'fof-upload.lib.file_list.hide_file';
    file.canHide() && items.add('hide-file', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_6___default()), {
      className: "Button Button--icon fof-file-action",
      icon: this.file.hidden() ? 'fas fa-eye' : 'fas fa-eye-slash',
      "aria-label": flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans(this.file.hidden() ? transPrefix + ".btn_a11y_label_show" : transPrefix + ".btn_a11y_label_hide", {
        fileName: file.baseName()
      }),
      disabled: this.isFileHiding,
      onclick: function onclick(e) {
        return _this3.hide(e);
      }
    }), 80);
    file.canDelete() && items.add('delete-file', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_6___default()), {
      className: "Button Button--icon fof-file-action",
      icon: "fas fa-trash",
      "aria-label": flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-upload.lib.file_list.delete_file_a11y_label', {
        fileName: file.baseName()
      }),
      disabled: this.isFileHiding,
      onclick: function onclick() {
        return _this3.confirmDelete();
      }
    }), 60);
    return items;
  }

  // Function to call when image fails to load

  // Function to call when image loads successfully
  ;
  _proto.viewFileInfo = function viewFileInfo() {
    console.log('view file info');
  };
  _proto.hide = function hide(e) {
    e.stopPropagation();

    // TODO: local logic, then:

    if (this.attrs.onHide) {
      this.attrs.onHide(this.file);
    }
  };
  _proto.confirmDelete = /*#__PURE__*/function () {
    var _confirmDelete = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee() {
      var result, uuid;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              result = confirm('Are you sure you want to delete this file?');
              if (!result) {
                _context.next = 6;
                break;
              }
              uuid = this.file.uuid();
              _context.next = 5;
              return flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().request({
                method: 'DELETE',
                url: flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/fof/upload/delete/' + uuid
              });
            case 5:
              if (this.attrs.onDelete) {
                this.attrs.onDelete(this.file);
              }
            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
    function confirmDelete() {
      return _confirmDelete.apply(this, arguments);
    }
    return confirmDelete;
  }();
  return DisplayFile;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_4___default()));


/***/ }),

/***/ "./src/common/components/SharedFileList.tsx":
/*!**************************************************!*\
  !*** ./src/common/components/SharedFileList.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SharedFileList)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _AbstractFIleList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractFIleList */ "./src/common/components/AbstractFIleList.tsx");


var SharedFileList = /*#__PURE__*/function (_AbstractFileList) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SharedFileList, _AbstractFileList);
  function SharedFileList() {
    return _AbstractFileList.apply(this, arguments) || this;
  }
  var _proto = SharedFileList.prototype;
  _proto.loadFileList = function loadFileList() {
    this.fileState.loadResults();
  };
  _proto.hasMoreResults = function hasMoreResults() {
    return this.fileState.hasMoreResults();
  };
  _proto.loadMore = function loadMore() {
    this.fileState.loadMore();
  };
  _proto.isLoading = function isLoading() {
    return this.fileState.isLoading();
  };
  _proto.fileCollection = function fileCollection() {
    return this.fileState.files;
  };
  return SharedFileList;
}(_AbstractFIleList__WEBPACK_IMPORTED_MODULE_1__["default"]);


/***/ }),

/***/ "./src/common/components/UploadSharedFileModal.tsx":
/*!*********************************************************!*\
  !*** ./src/common/components/UploadSharedFileModal.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadSharedFileModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Switch */ "flarum/common/components/Switch");
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _mimeToIcon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../mimeToIcon */ "./src/common/mimeToIcon.ts");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7__);








var UploadSharedFileModal = /*#__PURE__*/function (_Modal) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(UploadSharedFileModal, _Modal);
  function UploadSharedFileModal() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Modal.call.apply(_Modal, [this].concat(args)) || this;
    _this.files = [];
    _this.fileInput = null;
    _this.options = {
      shared: true,
      hidden: false
    };
    _this.loading = false;
    return _this;
  }
  var _proto = UploadSharedFileModal.prototype;
  _proto.oninit = function oninit(vnode) {
    _Modal.prototype.oninit.call(this, vnode);
  };
  _proto.className = function className() {
    return 'UploadSharedFileModal Modal--medium';
  };
  _proto.title = function title() {
    return flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-upload.lib.upload-shared-file-modal.title');
  };
  _proto.onFileChange = function onFileChange(e) {
    this.addFiles(Array.from(e.target.files));
  };
  _proto.addFiles = function addFiles(newFiles) {
    var _ref;
    (_ref = this.files).push.apply(_ref, newFiles);
    m.redraw();
  };
  _proto.onDragOver = function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  };
  _proto.onDrop = function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer && e.dataTransfer.files) {
      this.addFiles(Array.from(e.dataTransfer.files));
    }
  };
  _proto.onDropzoneClick = function onDropzoneClick() {
    if (this.fileInput) {
      this.fileInput.click();
    }
  };
  _proto.content = function content() {
    var _this2 = this;
    return m("div", {
      className: "Modal-body"
    }, m("div", {
      className: "UploadSharedFileModal-dropzone",
      onclick: function onclick() {
        return _this2.onDropzoneClick();
      },
      ondragover: this.onDragOver.bind(this),
      ondrop: this.onDrop.bind(this)
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-upload.lib.upload-shared-file-modal.dropzone'), m("input", {
      type: "file",
      multiple: true,
      onchange: this.onFileChange.bind(this),
      style: {
        opacity: 0,
        position: 'absolute',
        left: '-9999px'
      },
      oncreate: function oncreate(vnode) {
        _this2.fileInput = vnode.dom;
      }
    })), m("div", {
      className: "UploadSharedFileModal-files"
    }, this.files.map(function (file) {
      var isImage = file.type.startsWith('image/');
      return m("div", {
        className: "UploadedFile"
      }, isImage ? m("img", {
        src: URL.createObjectURL(file),
        alt: file.name
      }) : m("i", {
        className: (0,_mimeToIcon__WEBPACK_IMPORTED_MODULE_6__["default"])(file.type)
      }), m("div", {
        className: "UploadedFile-name"
      }, file.name), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default()), {
        className: "Button Button--icon Button--link UploadedFile-remove",
        icon: "fas fa-times",
        onclick: function onclick() {
          _this2.files = _this2.files.filter(function (f) {
            return f !== file;
          });
        }
      }));
    })), m("div", {
      className: "UploadSharedFileModal-options Form-group"
    }, m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5___default()), {
      state: this.options.hidden,
      onchange: function onchange(value) {
        return _this2.options.hidden = value;
      }
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-upload.lib.upload-shared-file-modal.hide-from-media-gallery'))), m("div", {
      className: "UploadSharedFileModal-submit App-primaryControl"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default()), {
      className: "Button Button--primary",
      loading: this.loading,
      onclick: this.upload.bind(this),
      disabled: !this.files.length || this.loading
    }, flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-upload.lib.upload-shared-file-modal.upload'))));
  };
  _proto.upload = /*#__PURE__*/function () {
    var _upload = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee() {
      var _this3 = this;
      var formData, results, uploadedFiles;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.loading = true;
              m.redraw();
              formData = new FormData(); // Append each file to the form data
              this.files.forEach(function (file) {
                formData.append('files[]', file);
              });
              Object.keys(this.options).forEach(function (key) {
                formData.append("options[" + key + "]", _this3.options[key]);
              });
              _context.next = 7;
              return flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().request({
                method: 'POST',
                url: flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('apiUrl') + '/fof/upload',
                serialize: function serialize(raw) {
                  return raw;
                },
                // Prevent mithril from trying to serialize FormData
                body: formData
              });
            case 7:
              results = _context.sent;
              uploadedFiles = flarum_common_app__WEBPACK_IMPORTED_MODULE_3___default().store.pushPayload(results);
              this.attrs.onUploadComplete(uploadedFiles);
              this.files = [];
              this.hide();
              this.loading = false;
              m.redraw();
            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
    function upload() {
      return _upload.apply(this, arguments);
    }
    return upload;
  }();
  return UploadSharedFileModal;
}((flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_4___default()));


/***/ }),

/***/ "./src/common/components/UploadedFile.tsx":
/*!************************************************!*\
  !*** ./src/common/components/UploadedFile.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadedFile)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _mimeToIcon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../mimeToIcon */ "./src/common/mimeToIcon.ts");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_8__);









var UploadedFile = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(UploadedFile, _Component);
  function UploadedFile() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.file = void 0;
    _this.callback = void 0;
    _this.imageLoaded = true;
    _this.handleImageError = function () {
      _this.imageLoaded = false;
      m.redraw();
    };
    _this.handleImageLoad = function () {
      _this.imageLoaded = true;
      m.redraw();
    };
    return _this;
  }
  var _proto = UploadedFile.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.file = this.attrs.file;
  };
  _proto.view = function view() {
    var _this2 = this;
    var isImage = this.file.type().startsWith('image/');
    var fileIcon = (0,_mimeToIcon__WEBPACK_IMPORTED_MODULE_6__["default"])(this.file.type());
    var errorIcon = 'fas fa-exclamation-triangle';
    var statusIcon = this.file.isPrivateShared() ? 'fas fa-lock' : 'fas fa-unlock';
    return m("div", {
      className: "UploadedFile",
      key: this.file.uuid()
    }, m("div", {
      className: "UploadedFile--sharestatus"
    }, m("span", null, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default()(statusIcon), this.file.baseName())), m("div", {
      className: "UploadedFile--preview",
      onclick: function onclick() {
        return _this2.onFileClick(_this2.file);
      }
    }, isImage ? this.imageLoaded ? m("img", {
      className: this.attrs.fileClassNames,
      src: this.file.url(),
      loading: "lazy",
      onerror: this.handleImageError,
      onload: this.handleImageLoad,
      alt: this.file.baseName()
    }) : flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default()(errorIcon, {
      className: 'icon-fallback'
    }) // Error icon for failed image load
    : flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default()(fileIcon, {
      className: 'icon-fallback'
    }) // Icon representing the file type
    ), m("div", {
      className: "UploadedFile--actions"
    }, this.actionItems().toArray()));
  };
  _proto.actionItems = function actionItems() {
    var _this3 = this;
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5___default())();
    items.add('view-info', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--icon",
      icon: "fas fa-info-circle",
      onclick: function onclick() {
        return _this3.viewFileInfo();
      },
      "aria-label": "info"
    }));
    items.add('download', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--icon",
      icon: "fas fa-download",
      onclick: function onclick() {
        return window.open(_this3.file.url());
      },
      "aria-label": "download"
    }));
    var hideFileIcon = this.file.isPrivateShared() ? 'fas fa-lock' : this.file.hidden() ? 'fas fa-eye' : 'fas fa-eye-slash';
    items.add('hide-file', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--icon",
      icon: hideFileIcon,
      onclick: function onclick() {
        return _this3.hideFile();
      },
      "aria-label": "hide"
    }));
    items.add('delete', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--icon",
      icon: "fas fa-trash",
      onclick: function onclick() {
        return _this3.confirmDelete();
      },
      "aria-label": "delete"
    }));
    return items;
  };
  _proto.confirmDelete = /*#__PURE__*/function () {
    var _confirmDelete = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee() {
      var result, uuid;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              result = confirm('Are you sure you want to delete this file?');
              if (!result) {
                _context.next = 6;
                break;
              }
              uuid = this.file.uuid();
              _context.next = 5;
              return flarum_common_app__WEBPACK_IMPORTED_MODULE_8___default().request({
                method: 'DELETE',
                url: flarum_common_app__WEBPACK_IMPORTED_MODULE_8___default().forum.attribute('apiUrl') + '/fof/upload/delete/' + uuid
              });
            case 5:
              if (this.attrs.onDelete) {
                this.attrs.onDelete(this.file);
              }
            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
    function confirmDelete() {
      return _confirmDelete.apply(this, arguments);
    }
    return confirmDelete;
  }();
  _proto.viewFileInfo = function viewFileInfo() {
    // TODO:
    console.log('view file info');
  };
  _proto.hideFile = function hideFile() {
    // TODO:
    console.log('hide file');
  }

  // Function to call when image fails to load

  // Function to call when image loads successfully
  ;
  _proto.onFileClick = function onFileClick(file) {
    if (this.attrs.onFileSelect) {
      this.attrs.onFileSelect(file);
      return;
    }
  };
  return UploadedFile;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_3___default()));


/***/ }),

/***/ "./src/common/components/UserFileList.tsx":
/*!************************************************!*\
  !*** ./src/common/components/UserFileList.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UserFileList)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _AbstractFIleList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AbstractFIleList */ "./src/common/components/AbstractFIleList.tsx");



var UserFileList = /*#__PURE__*/function (_AbstractFileList) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UserFileList, _AbstractFileList);
  function UserFileList() {
    return _AbstractFileList.apply(this, arguments) || this;
  }
  var _proto = UserFileList.prototype;
  _proto.loadFileList = function loadFileList() {
    //app.fileListState.setUser(this.attrs.user || app.session.user);
    this.fileState.setUser(this.attrs.user || (flarum_common_app__WEBPACK_IMPORTED_MODULE_1___default().session).user);
    /**
     * The user who's media we are dealing with
     */
    this.user = this.fileState.user; //app.fileListState.user;
  };
  _proto.hasMoreResults = function hasMoreResults() {
    return this.fileState.hasMoreResults();
  };
  _proto.loadMore = function loadMore() {
    this.fileState.loadMore();
  };
  _proto.isLoading = function isLoading() {
    return this.fileState.isLoading();
  };
  _proto.fileCollection = function fileCollection() {
    return this.fileState.files;
  };
  return UserFileList;
}(_AbstractFIleList__WEBPACK_IMPORTED_MODULE_2__["default"]);


/***/ }),

/***/ "./src/common/components/index.ts":
/*!****************************************!*\
  !*** ./src/common/components/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   commonComponents: () => (/* binding */ commonComponents)
/* harmony export */ });
/* harmony import */ var _UploadSharedFileModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UploadSharedFileModal */ "./src/common/components/UploadSharedFileModal.tsx");
/* harmony import */ var _UploadedFile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UploadedFile */ "./src/common/components/UploadedFile.tsx");
/* harmony import */ var _UserFileList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UserFileList */ "./src/common/components/UserFileList.tsx");



var commonComponents = {
  UploadedFile: _UploadedFile__WEBPACK_IMPORTED_MODULE_1__["default"],
  UploadSharedFileModal: _UploadSharedFileModal__WEBPACK_IMPORTED_MODULE_0__["default"],
  UserFileList: _UserFileList__WEBPACK_IMPORTED_MODULE_2__["default"]
};

/***/ }),

/***/ "./src/common/extend.ts":
/*!******************************!*\
  !*** ./src/common/extend.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extenders */ "flarum/common/extenders");
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_File__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/File */ "./src/common/models/File.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default().Store)() //
.add('files', _models_File__WEBPACK_IMPORTED_MODULE_1__["default"]).add('shared-files', _models_File__WEBPACK_IMPORTED_MODULE_1__["default"])]);

/***/ }),

/***/ "./src/common/mimeToIcon.ts":
/*!**********************************!*\
  !*** ./src/common/mimeToIcon.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mimeToIcon)
/* harmony export */ });
var mimeToIconMap = new Map([
// Image formats
['image/png', 'far fa-file-image'], ['image/jpg', 'far fa-file-image'], ['image/jpeg', 'far fa-file-image'], ['image/svg+xml', 'far fa-file-image'], ['image/gif', 'far fa-file-image'], ['image/bmp', 'far fa-file-image'], ['image/webp', 'far fa-file-image'],
// Compressed file formats
['application/zip', 'far fa-file-archive'], ['application/x-7z-compressed', 'far fa-file-archive'], ['application/gzip', 'far fa-file-archive'], ['application/vnd.rar', 'far fa-file-archive'], ['application/x-rar-compressed', 'far fa-file-archive'], ['application/x-tar', 'far fa-file-archive'], ['application/x-iso9660-image', 'far fa-file-archive'],
// Text and code file formats
['text/plain', 'far fa-file-alt'], ['text/csv', 'far fa-file-csv'], ['text/xml', 'far fa-file-code'], ['text/html', 'far fa-file-code'], ['text/css', 'far fa-file-code'], ['text/javascript', 'far fa-file-code'], ['application/json', 'far fa-file-code'], ['application/ld+json', 'far fa-file-code'], ['application/x-httpd-php', 'far fa-file-code'], ['application/xml', 'far fa-file-code'], ['text/xml', 'far fa-file-code'],
// Document formats
['application/x-abiword', 'far fa-file-word'], ['application/msword', 'far fa-file-word'], ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'far fa-file-word'], ['application/vnd.oasis.opendocument.text', 'far fa-file-word'], ['application/vnd.ms-excel', 'far fa-file-excel'], ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'far fa-file-excel'], ['application/vnd.oasis.opendocument.spreadsheet', 'far fa-file-excel'], ['application/vnd.ms-powerpoint', 'far fa-file-powerpoint'], ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'far fa-file-powerpoint'], ['application/vnd.oasis.opendocument.presentation', 'far fa-file-powerpoint'], ['application/pdf', 'far fa-file-pdf'], ['application/rtf', 'far fa-file-alt'],
// eBook formats
['application/epub+zip', 'far fa-book'], ['application/x-mobipocket-ebook', 'far fa-book'], ['application/vnd.amazon.ebook', 'far fa-book'],
// Audio formats
['audio/mpeg', 'far fa-file-audio'], ['audio/wav', 'far fa-file-audio'], ['audio/x-wav', 'far fa-file-audio'], ['audio/aac', 'far fa-file-audio'], ['audio/ogg', 'far fa-file-audio'], ['audio/flac', 'far fa-file-audio'], ['audio/aiff', 'far fa-file-audio'], ['audio/x-aiff', 'far fa-file-audio'],
// Video formats
['video/x-msvideo', 'far fa-file-video'], ['video/mp4', 'far fa-file-video'], ['video/quicktime', 'far fa-file-video']]);
function mimeToIcon(fileType) {
  // Directly return the icon if the fileType is in the map
  return mimeToIconMap.get(fileType) || function () {
    // Check for generic types
    if (fileType.startsWith('image/')) {
      return 'far fa-file-image';
    } else if (fileType.startsWith('video/')) {
      return 'far fa-file-video';
    } else if (fileType.startsWith('audio/')) {
      return 'far fa-file-audio';
    }

    // Default icon
    return 'far fa-file';
  }();
}

/***/ }),

/***/ "./src/common/models/File.ts":
/*!***********************************!*\
  !*** ./src/common/models/File.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ File)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__);


var File = /*#__PURE__*/function (_Model) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(File, _Model);
  function File() {
    return _Model.apply(this, arguments) || this;
  }
  var _proto = File.prototype;
  _proto.baseName = function baseName() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('baseName').call(this);
  };
  _proto.path = function path() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('path').call(this);
  };
  _proto.url = function url() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('url').call(this);
  };
  _proto.size = function size() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('size').call(this);
  };
  _proto.type = function type() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('type').call(this);
  };
  _proto.humanSize = function humanSize() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('humanSize').call(this);
  };
  _proto.createdAt = function createdAt() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('createdAt', (flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().transformDate)).call(this);
  };
  _proto.uuid = function uuid() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('uuid').call(this);
  };
  _proto.tag = function tag() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('tag').call(this);
  };
  _proto.hidden = function hidden() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('hidden').call(this);
  };
  _proto.bbcode = function bbcode() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('bbcode').call(this);
  };
  _proto.isShared = function isShared() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('shared').call(this);
  };
  _proto.isPrivateShared = function isPrivateShared() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('isPrivateShared').call(this);
  };
  _proto.canViewInfo = function canViewInfo() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canViewInfo').call(this);
  };
  _proto.canHide = function canHide() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canHide').call(this);
  };
  _proto.canDelete = function canDelete() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canDelete').call(this);
  };
  _proto.apiEndpoint = function apiEndpoint() {
    return '/fof/uploads' + (this.exists ? '/' + this.id() : '');
  };
  return File;
}((flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/common/states/FileListState.ts":
/*!********************************************!*\
  !*** ./src/common/states/FileListState.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileListState)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_2__);



var FileListState = /*#__PURE__*/function () {
  function FileListState(sharedFiles) {
    if (sharedFiles === void 0) {
      sharedFiles = false;
    }
    this.user = void 0;
    this.files = void 0;
    this.moreResults = void 0;
    this.loading = void 0;
    this.sharedFiles = void 0;
    this.user = null;
    this.files = [];
    this.moreResults = false;
    this.loading = false;
    this.sharedFiles = sharedFiles;
  }

  /**
   * Set the user and load their file list.
   * @param user The user whose files to load.
   */
  var _proto = FileListState.prototype;
  _proto.setUser = function setUser(user) {
    if (user === this.user) return;
    this.user = user;
    this.files = [];
    this.loadResults();
  };
  _proto.refresh = function refresh() {
    this.files = [];
    this.loadResults();
    m.redraw();
  }

  /**
   * Load more files for the current user, starting from the given offset.
   * @param offset The starting index for loading more files.
   * @returns A promise resolving to the loaded files.
   */;
  _proto.loadResults =
  /*#__PURE__*/
  function () {
    var _loadResults = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(offset) {
      var route, params, results;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (offset === void 0) {
                offset = 0;
              }
              if (!(!this.sharedFiles && !this.user)) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return", Promise.reject('User not set'));
            case 3:
              this.loading = true;
              route = 'fof/uploads';
              params = {};
              if (!this.sharedFiles && this.user) {
                params = {
                  filter: {
                    user: this.user.id()
                  },
                  page: {
                    offset: offset
                  }
                };
              } else {
                route = 'fof/upload/shared-files';
                params = {
                  page: {
                    offset: offset
                  }
                };
              }
              _context.next = 9;
              return flarum_common_app__WEBPACK_IMPORTED_MODULE_2___default().store.find(route, params);
            case 9:
              results = _context.sent;
              return _context.abrupt("return", this.parseResults(results));
            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
    function loadResults(_x) {
      return _loadResults.apply(this, arguments);
    }
    return loadResults;
  }()
  /**
   * Load the next set of results.
   */
  ;
  _proto.loadMore =
  /*#__PURE__*/
  function () {
    var _loadMore = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee2() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.loading = true;
              return _context2.abrupt("return", this.loadResults(this.files.length));
            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));
    function loadMore() {
      return _loadMore.apply(this, arguments);
    }
    return loadMore;
  }();
  _proto.parseResults = function parseResults(results) {
    var _results$payload, _results$payload$link;
    this.files = results;
    this.loading = false;
    this.moreResults = !!((_results$payload = results.payload) != null && (_results$payload$link = _results$payload.links) != null && _results$payload$link.next);
    m.redraw();
    return results;
  }

  /**
   * Add files to the beginning of the list.
   * @param files The files to be added.
   */;
  _proto.addToList = function addToList(files) {
    if (Array.isArray(files)) {
      var _this$files;
      (_this$files = this.files).unshift.apply(_this$files, files);
    } else {
      this.files.unshift(files);
    }
    m.redraw();
  }

  /**
   * Remove files from the list.
   * @param files The files to be removed.
   */;
  _proto.removeFromList = function removeFromList(files) {
    if (Array.isArray(files)) {
      this.files = this.files.filter(function (file) {
        return !files.includes(file);
      });
    } else {
      this.files = this.files.filter(function (file) {
        return file !== files;
      });
    }
    m.redraw();
  }

  /**
   * Check if there are files in the list.
   * @returns True if there are files, false otherwise.
   */;
  _proto.hasFiles = function hasFiles() {
    return this.files.length > 0;
  }

  /**
   * Check if the file list is currently loading.
   * @returns True if loading, false otherwise.
   */;
  _proto.isLoading = function isLoading() {
    return this.loading;
  }

  /**
   * Check if there are more files to load.
   * @returns True if there are more files, false otherwise.
   */;
  _proto.hasMoreResults = function hasMoreResults() {
    return this.moreResults;
  }

  /**
   * Check if the user has no files and the list is not loading.
   * @returns True if the list is empty and not loading, false otherwise.
   */;
  _proto.empty = function empty() {
    return !this.hasFiles() && !this.isLoading();
  };
  return FileListState;
}();


/***/ }),

/***/ "flarum/admin/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['admin/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/app'];

/***/ }),

/***/ "flarum/admin/components/AdminNav":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['admin/components/AdminNav']" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/components/AdminNav'];

/***/ }),

/***/ "flarum/admin/components/AdminPage":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['admin/components/AdminPage']" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/components/AdminPage'];

/***/ }),

/***/ "flarum/admin/components/ExtensionPage":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['admin/components/ExtensionPage']" ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/components/ExtensionPage'];

/***/ }),

/***/ "flarum/admin/components/UploadImageButton":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['admin/components/UploadImageButton']" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/components/UploadImageButton'];

/***/ }),

/***/ "flarum/admin/utils/saveSettings":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['admin/utils/saveSettings']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/utils/saveSettings'];

/***/ }),

/***/ "flarum/common/Component":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/Component']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Component'];

/***/ }),

/***/ "flarum/common/Model":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['common/Model']" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Model'];

/***/ }),

/***/ "flarum/common/app":
/*!***************************************************!*\
  !*** external "flarum.core.compat['common/app']" ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/app'];

/***/ }),

/***/ "flarum/common/components/Alert":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Alert']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Alert'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/components/Link":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/components/Link']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Link'];

/***/ }),

/***/ "flarum/common/components/LinkButton":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['common/components/LinkButton']" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LinkButton'];

/***/ }),

/***/ "flarum/common/components/LoadingIndicator":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['common/components/LoadingIndicator']" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LoadingIndicator'];

/***/ }),

/***/ "flarum/common/components/Modal":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Modal']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Modal'];

/***/ }),

/***/ "flarum/common/components/Select":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Select']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Select'];

/***/ }),

/***/ "flarum/common/components/Switch":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Switch']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Switch'];

/***/ }),

/***/ "flarum/common/components/Tooltip":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['common/components/Tooltip']" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Tooltip'];

/***/ }),

/***/ "flarum/common/extend":
/*!******************************************************!*\
  !*** external "flarum.core.compat['common/extend']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extend'];

/***/ }),

/***/ "flarum/common/extenders":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/extenders']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extenders'];

/***/ }),

/***/ "flarum/common/helpers/icon":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/icon']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/icon'];

/***/ }),

/***/ "flarum/common/utils/ItemList":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/utils/ItemList']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/ItemList'];

/***/ }),

/***/ "flarum/common/utils/Stream":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/Stream']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/Stream'];

/***/ }),

/***/ "flarum/common/utils/classList":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/utils/classList']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/classList'];

/***/ }),

/***/ "flarum/common/utils/extractText":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/utils/extractText']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/extractText'];

/***/ }),

/***/ "flarum/common/utils/withAttr":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/utils/withAttr']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/withAttr'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _asyncToGenerator)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./admin.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* reexport safe */ _src_admin__WEBPACK_IMPORTED_MODULE_0__.components),
/* harmony export */   extend: () => (/* reexport safe */ _src_admin__WEBPACK_IMPORTED_MODULE_0__.extend)
/* harmony export */ });
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.ts");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=admin.js.map