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

/***/ "./src/forum/addUploadButton.js":
/*!**************************************!*\
  !*** ./src/forum/addUploadButton.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/TextEditor */ "flarum/common/components/TextEditor");
/* harmony import */ var flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_UploadButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/UploadButton */ "./src/forum/components/UploadButton.js");
/* harmony import */ var _components_DragAndDrop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/DragAndDrop */ "./src/forum/components/DragAndDrop.js");
/* harmony import */ var _components_PasteClipboard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/PasteClipboard */ "./src/forum/components/PasteClipboard.js");
/* harmony import */ var _handler_Uploader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./handler/Uploader */ "./src/forum/handler/Uploader.js");
/* harmony import */ var _components_FileManagerButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/FileManagerButton */ "./src/forum/components/FileManagerButton.tsx");








/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'oninit', function () {
    this.uploader = new _handler_Uploader__WEBPACK_IMPORTED_MODULE_6__["default"]();
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'controlItems', function (items) {
    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.canUpload')) return;
    var composerButtonVisiblity = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.composerButtonVisiblity');

    // Add media button
    if (composerButtonVisiblity === 'both' || composerButtonVisiblity === 'media-btn') {
      items.add('fof-upload-media', _components_FileManagerButton__WEBPACK_IMPORTED_MODULE_7__["default"].component({
        uploader: this.uploader
      }));
    }

    // Add upload button
    if (composerButtonVisiblity === 'both' || composerButtonVisiblity === 'upload-btn') {
      items.add('fof-upload', _components_UploadButton__WEBPACK_IMPORTED_MODULE_3__["default"].component({
        uploader: this.uploader
      }));
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'oncreate', function (f_, vnode) {
    var _this = this;
    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.canUpload')) return;
    this.uploader.on('success', function (_ref) {
      var file = _ref.file,
        addBBcode = _ref.addBBcode;
      if (!addBBcode) return;
      _this.attrs.composer.editor.insertAtCursor(file.bbcode() + '\n', false);

      // We wrap this in a typeof check to prevent it running when a user
      // is creating a new discussion. There's nothing to preview in a new
      // discussion, so the `preview` function isn't defined.
      if (typeof _this.attrs.preview === 'function') {
        // Scroll the preview into view
        // preview() causes the composer to close on mobile, but we don't want that. We want only the scroll
        // We work around that by temporarily patching the isFullScreen method
        var originalIsFullScreen = (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().composer).isFullScreen;
        (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().composer).isFullScreen = function () {
          return false;
        };
        _this.attrs.preview();
        (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().composer).isFullScreen = originalIsFullScreen;
      }
    });

    // Gracefully fail if the TextEditor was used in a non-Composer context
    // Using a custom method to retrieve the target allows other extensions to still use this feature by returning an alternate container
    var dragAndDropTarget = this.fofUploadDragAndDropTarget();
    if (dragAndDropTarget) {
      this.dragAndDrop = new _components_DragAndDrop__WEBPACK_IMPORTED_MODULE_4__["default"](function (files) {
        return _this.uploader.upload(files);
      }, dragAndDropTarget);
    }
    new _components_PasteClipboard__WEBPACK_IMPORTED_MODULE_5__["default"](function (files) {
      return _this.uploader.upload(files);
    }, this.$('.TextEditor-editor')[0]);
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'onremove', function (f_, vnode) {
    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.canUpload')) return;
    if (this.dragAndDrop) {
      this.dragAndDrop.unload();
    }
  });
  (flarum_common_components_TextEditor__WEBPACK_IMPORTED_MODULE_2___default().prototype).fofUploadDragAndDropTarget = function () {
    return this.$().parents('.Composer')[0];
  };
}

/***/ }),

/***/ "./src/forum/addUserPageButton.js":
/*!****************************************!*\
  !*** ./src/forum/addUserPageButton.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addUserPageButton)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/UserPage */ "flarum/forum/components/UserPage");
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__);




function addUserPageButton() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'navItems', function (items) {
    var canUpload = !!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.canUpload');
    var hasUploads = !!this.user.uploadCountCurrent();
    if ((flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session).user && (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session.user.viewOthersMediaLibrary() || this.user === (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session).user && (canUpload || hasUploads))) {
      var uploadCount = this.user.uploadCountCurrent();
      items.add('uploads', flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default().component({
        href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('user.uploads', {
          username: this.user.username()
        }),
        name: 'uploads',
        icon: 'fas fa-file-upload'
      }, [this.user === (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session).user ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.forum.buttons.media') : flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.forum.buttons.user_uploads'), ' ', uploadCount > 0 ? m("span", {
        className: "Button-badge"
      }, uploadCount) : '']), 80);
    }
  });
}

/***/ }),

/***/ "./src/forum/components/DragAndDrop.js":
/*!*********************************************!*\
  !*** ./src/forum/components/DragAndDrop.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DragAndDrop)
/* harmony export */ });
var DragAndDrop = /*#__PURE__*/function () {
  function DragAndDrop(upload, composerElement) {
    this.upload = upload;
    this.composerElement = composerElement;

    // Keep references to the bound methods so we can remove the event listeners later
    this.handlers = {};
    if (!this.supportsFileDragging()) {
      return;
    }
    this.composerElement.addEventListener('dragover', this.handlers["in"] = this["in"].bind(this));
    this.composerElement.addEventListener('dragleave', this.handlers.out = this.out.bind(this));
    this.composerElement.addEventListener('dragend', this.handlers.out);
    this.composerElement.addEventListener('drop', this.handlers.dropping = this.dropping.bind(this));
  }
  var _proto = DragAndDrop.prototype;
  _proto.supportsFileDragging = function supportsFileDragging() {
    // Based on https://css-tricks.com/drag-and-drop-file-uploading/
    var div = document.createElement('div');
    return ('draggable' in div || 'ondragstart' in div && 'ondrop' in div) && 'FormData' in window && 'FileReader' in window;
  };
  _proto.unload = function unload() {
    // If the handlers were not set (drag and drop not supported), we skip removing them
    if (!this.handlers["in"]) {
      return;
    }
    this.composerElement.removeEventListener('dragover', this.handlers["in"]);
    this.composerElement.removeEventListener('dragleave', this.handlers.out);
    this.composerElement.removeEventListener('dragend', this.handlers.out);
    this.composerElement.removeEventListener('drop', this.handlers.dropping);
  };
  _proto.isNotFile = function isNotFile(event) {
    // Checking event.dataTransfer.files.length does not work on dragover event, it's always zero
    // So we use the dataTransfer.items property to check whether any file is being dragged
    if (event.dataTransfer.items) {
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind !== 'file') {
          return true;
        }
      }
    }
    return false;
  };
  _proto["in"] = function _in(event) {
    if (this.isNotFile(event)) {
      return;
    }
    event.preventDefault();
    if (!this.over) {
      this.composerElement.classList.add('fof-upload-dragging');
      this.over = true;
    }
  };
  _proto.out = function out(event) {
    if (this.isNotFile(event)) {
      return;
    }
    event.preventDefault();
    if (this.over) {
      this.composerElement.classList.remove('fof-upload-dragging');
      this.over = false;
    }
  };
  _proto.dropping = function dropping(event) {
    if (this.isNotFile(event)) {
      return;
    }
    event.preventDefault();
    this.upload(event.dataTransfer.files);
    this.composerElement.classList.remove('fof-upload-dragging');
  };
  return DragAndDrop;
}();


/***/ }),

/***/ "./src/forum/components/FileManagerButton.tsx":
/*!****************************************************!*\
  !*** ./src/forum/components/FileManagerButton.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileManagerButton)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _FileManagerModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FileManagerModal */ "./src/forum/components/FileManagerModal.js");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Tooltip */ "flarum/common/components/Tooltip");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_5__);






var FileManagerButton = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(FileManagerButton, _Component);
  function FileManagerButton() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = FileManagerButton.prototype;
  _proto.view = function view() {
    return m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_5___default()), {
      text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.buttons.media')
    }, flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default().component({
      className: 'Button fof-upload-button Button--icon',
      onclick: this.fileManagerButtonClicked.bind(this),
      icon: 'fas fa-photo-video'
    }));
  }

  /**
   * Event handler for upload button being clicked
   */;
  _proto.fileManagerButtonClicked = function fileManagerButtonClicked(e) {
    e.preventDefault();

    // Open dialog
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show(_FileManagerModal__WEBPACK_IMPORTED_MODULE_4__["default"], {
      uploader: this.attrs.uploader
    });
  };
  return FileManagerButton;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/FileManagerModal.js":
/*!**************************************************!*\
  !*** ./src/forum/components/FileManagerModal.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileManagerModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _UploadButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./UploadButton */ "./src/forum/components/UploadButton.js");
/* harmony import */ var _common_components_UserFileList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../common/components/UserFileList */ "./src/common/components/UserFileList.tsx");
/* harmony import */ var _DragAndDrop__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DragAndDrop */ "./src/forum/components/DragAndDrop.js");
/* harmony import */ var _common_components_UploadSharedFileModal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../common/components/UploadSharedFileModal */ "./src/common/components/UploadSharedFileModal.tsx");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _common_components_SharedFileList__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../common/components/SharedFileList */ "./src/common/components/SharedFileList.tsx");
/* harmony import */ var _common_states_FileListState__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../common/states/FileListState */ "./src/common/states/FileListState.ts");











var FileManagerModal = /*#__PURE__*/function (_Modal) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(FileManagerModal, _Modal);
  function FileManagerModal() {
    return _Modal.apply(this, arguments) || this;
  }
  var _proto = FileManagerModal.prototype;
  _proto.oninit = function oninit(vnode) {
    _Modal.prototype.oninit.call(this, vnode);

    // Initialize upload managers
    this.uploader = vnode.attrs.uploader;

    // Current selected files
    this.selectedFiles = [];

    // Allow multiselect
    this.multiSelect = vnode.attrs.multiSelect === undefined ? true : vnode.attrs.multiSelect;

    // Restrict file selection to specific types
    this.restrictFileType = vnode.attrs.restrictFileType || null;

    // Drag & drop
    this.dragDrop = null;
    this.selectedFilesLibrary = vnode.attrs.defaultFilesLibrary || 'user';
    this.sharedUploads = null;
    this.userFileState = new _common_states_FileListState__WEBPACK_IMPORTED_MODULE_10__["default"]();
    this.sharedFileState = new _common_states_FileListState__WEBPACK_IMPORTED_MODULE_10__["default"](true);
    this.uploader.setState(this.userFileState);

    // Initialize uploads
    this.onUpload();
  };
  _proto.className = function className() {
    return 'Modal--large fof-file-manager-modal';
  }

  /**
   * Initialize drag & drop
   */;
  _proto.oncreate = function oncreate(vnode) {
    var _this = this;
    _Modal.prototype.oncreate.call(this, vnode);
    this.dragDrop = new _DragAndDrop__WEBPACK_IMPORTED_MODULE_6__["default"](function (files) {
      return _this.uploader.upload(files, false);
    }, this.$().find('.Modal-content')[0]);
  }

  /**
   * Remove events from modal content
   */;
  _proto.onremove = function onremove() {
    if (this.dragDrop) {
      this.dragDrop.unload();
    }
  };
  _proto.view = function view() {
    var _this2 = this,
      _app$session$user;
    var fileCount = this.selectedFiles.length;
    var _this$attrs = this.attrs,
      hideUser = _this$attrs.hideUser,
      hideShared = _this$attrs.hideShared;
    return m("div", {
      className: "Modal modal-dialog " + this.className()
    }, m("div", {
      className: "Modal-content"
    }, m("div", {
      className: "fof-modal-buttons App-backControl"
    }, !hideUser && this.selectedFilesLibrary === 'user' && m(_UploadButton__WEBPACK_IMPORTED_MODULE_4__["default"], {
      uploader: this.uploader,
      disabled: this.userFileState.isLoading(),
      isMediaUploadButton: true
    }), (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user && flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user.uploadSharedFiles() && !hideShared && this.selectedFilesLibrary === 'shared' && m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button",
      icon: "fas fa-file-upload",
      onclick: function onclick() {
        _this2.showUploadModal();
      }
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.buttons.upload'))), m("div", {
      className: "fof-drag-and-drop"
    }, m("div", {
      className: "fof-drag-and-drop-release"
    }, m("i", {
      className: "fas fa-cloud-upload-alt"
    }), flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.lib.release_to_upload'))), m("div", {
      className: "Modal-header"
    }, m("h3", {
      className: "App-titleControl App-titleControl--text"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.media_manager')), ((_app$session$user = (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user) == null ? void 0 : _app$session$user.accessSharedFiles()) && !hideUser && !hideShared && m("div", {
      className: "LibrarySelection"
    }, this.fileLibraryButtonItems().toArray())), this.alertAttrs && m("div", {
      className: "Modal-alert"
    }, m(Alert, this.alertAttrs)), m("div", {
      className: "Modal-body"
    }, this.selectedFilesLibrary === 'user' && this.userFilesContent(), this.selectedFilesLibrary === 'shared' && this.sharedFilesContent()), m("div", {
      className: "Modal-footer"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      onclick: this.hide.bind(this),
      className: "Button"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.buttons.cancel')), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      onclick: this.onSelect.bind(this),
      disabled: this.selectedFiles.length === 0 || !this.multiSelect && this.selectedFiles.length > 1,
      className: "Button Button--primary"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.lib.file_list.confirm_selection_btn', {
      fileCount: fileCount
    })))));
  };
  _proto.fileLibraryButtonItems = function fileLibraryButtonItems() {
    var _this3 = this;
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_8___default())();
    items.add('user', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button Button--flat " + (this.selectedFilesLibrary === 'user' ? 'active' : ''),
      onclick: function onclick() {
        return _this3.setLibrary('user');
      }
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.buttons.media')));
    items.add('shared', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button Button--flat " + (this.selectedFilesLibrary === 'shared' ? 'active' : ''),
      onclick: function onclick() {
        return _this3.setLibrary('shared');
      }
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.buttons.shared_media')));
    return items;
  };
  _proto.setLibrary = function setLibrary(library) {
    this.selectedFilesLibrary = library;
    m.redraw();
  };
  _proto.userFilesContent = function userFilesContent() {
    return m(_common_components_UserFileList__WEBPACK_IMPORTED_MODULE_5__["default"], {
      user: this.attrs.user,
      selectable: true,
      onFileSelect: this.onFileSelect.bind(this),
      selectedFiles: this.selectedFiles,
      restrictFileType: this.restrictFileType,
      fileState: this.userFileState,
      onDelete: this.onDelete.bind(this)
    });
  };
  _proto.sharedFilesContent = function sharedFilesContent() {
    return m(_common_components_SharedFileList__WEBPACK_IMPORTED_MODULE_9__["default"], {
      selectable: true,
      onFileSelect: this.onFileSelect.bind(this),
      selectedFiles: this.selectedFiles,
      restrictFileType: this.restrictFileType,
      user: this.attrs.user,
      fileState: this.sharedFileState,
      onDelete: this.onDelete.bind(this)
    });
  }

  /**
   * Add or remove file from selected files
   *
   * @param {File} file
   */;
  _proto.onFileSelect = function onFileSelect(file) {
    var itemPosition = this.selectedFiles.indexOf(file.id());
    if (itemPosition >= 0) {
      this.selectedFiles.splice(itemPosition, 1);
    } else {
      if (this.multiSelect) {
        this.selectedFiles.push(file.id());
      } else {
        this.selectedFiles = [file.id()];
      }
    }
  }

  /**
   * Add files to file list after upload
   */;
  _proto.onUpload = function onUpload() {
    var _this4 = this;
    this.uploader.on('success', function (_ref) {
      var file = _ref.file;
      if (_this4.multiSelect) {
        _this4.selectedFiles.push(file.id());
      } else {
        _this4.selectedFiles = [file.id()];
      }
    });
  }

  /**
   * Add selected files to the composer
   */;
  _proto.onSelect = function onSelect() {
    this.hide();

    // Custom callback
    if (this.attrs.onSelect) {
      this.attrs.onSelect(this.selectedFiles);
      return;
    }

    // Add selected files to composer
    this.selectedFiles.map(function (fileId) {
      var file = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().store.getById('files', fileId) || flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().store.getById('shared-files', fileId);
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().composer.editor.insertAtCursor(file.bbcode() + '\n', false);
    });
  };
  _proto.showUploadModal = function showUploadModal() {
    var _this5 = this;
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show(_common_components_UploadSharedFileModal__WEBPACK_IMPORTED_MODULE_7__["default"], {
      onUploadComplete: function onUploadComplete(files) {
        _this5.sharedFileState.addToList(files);
      }
    }, true);
  };
  _proto.onDelete = function onDelete(file) {
    this.sharedFileState.removeFromList(file);
    this.userFileState.removeFromList(file);
  };
  return FileManagerModal;
}((flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/PasteClipboard.js":
/*!************************************************!*\
  !*** ./src/forum/components/PasteClipboard.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PasteClipboard)
/* harmony export */ });
var PasteClipboard = /*#__PURE__*/function () {
  function PasteClipboard(upload, element) {
    this.upload = upload;

    // We don't need to remove the events listeners, because they'll get removed when the DOM does.
    element.addEventListener('paste', this.paste.bind(this));
  }
  var _proto = PasteClipboard.prototype;
  _proto.paste = function paste(e) {
    if (e.clipboardData && e.clipboardData.items) {
      var items = e.clipboardData.items;
      var files = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          files.push(items[i].getAsFile());
        }
      }
      if (files.length > 0) {
        e.preventDefault();
        this.upload(files);
      }
    }
  };
  return PasteClipboard;
}();


/***/ }),

/***/ "./src/forum/components/UploadButton.js":
/*!**********************************************!*\
  !*** ./src/forum/components/UploadButton.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadButton)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5__);






var UploadButton = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UploadButton, _Component);
  function UploadButton() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = UploadButton.prototype;
  _proto.oninit = function oninit(vnode) {
    var _this = this;
    _Component.prototype.oninit.call(this, vnode);
    this.attrs.uploader.on('uploaded', function () {
      // reset the button for a new upload
      _this.$('form')[0].reset();

      // redraw to reflect uploader.loading in the DOM
      m.redraw();
    });
    this.isMediaUploadButton = vnode.attrs.isMediaUploadButton || false;
  };
  _proto.view = function view() {
    var buttonText = this.attrs.uploader.uploading ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.states.loading') : flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-upload.forum.buttons.upload');
    return m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5___default()(['Button', 'hasIcon', 'fof-upload-button', !this.isMediaUploadButton && !this.attrs.uploader.uploading && 'Button--icon', !this.isMediaUploadButton && !this.attrs.uploader.uploading && 'Button--link', this.attrs.uploader.uploading && 'uploading']),
      icon: !this.attrs.uploader.uploading && 'fas fa-file-upload',
      onclick: this.uploadButtonClicked.bind(this),
      disabled: this.attrs.disabled
    }, this.attrs.uploader.uploading && m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_4___default()), {
      size: "small",
      display: "inline",
      className: "Button-icon"
    }), (this.isMediaUploadButton || this.attrs.uploader.uploading) && m("span", {
      className: "Button-label"
    }, buttonText), m("form", null, m("input", {
      type: "file",
      multiple: true,
      onchange: this.process.bind(this)
    })));
  }

  /**
   * Process the upload event.
   *
   * @param e
   */;
  _proto.process = function process(e) {
    // get the file from the input field
    var files = this.$('input').prop('files');
    if (files.length === 0) {
      // We've got no files to upload, so trying
      // to begin an upload will show an error
      // to the user.
      return;
    }
    this.attrs.uploader.upload(files, !this.isMediaUploadButton);
  }

  /**
   * Event handler for upload button being clicked
   *
   * @param {PointerEvent} e
   */;
  _proto.uploadButtonClicked = function uploadButtonClicked(e) {
    // Trigger click on hidden input element
    // (Opens file dialog)
    this.$('input').click();
  };
  return UploadButton;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/UploadsUserPage.tsx":
/*!**************************************************!*\
  !*** ./src/forum/components/UploadsUserPage.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadsUserPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/UserPage */ "flarum/forum/components/UserPage");
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_components_UserFileList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/components/UserFileList */ "./src/common/components/UserFileList.tsx");
/* harmony import */ var _common_states_FileListState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../common/states/FileListState */ "./src/common/states/FileListState.ts");





var UploadsUserPage = /*#__PURE__*/function (_UserPage) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UploadsUserPage, _UserPage);
  function UploadsUserPage() {
    return _UserPage.apply(this, arguments) || this;
  }
  var _proto = UploadsUserPage.prototype;
  _proto.oninit = function oninit(vnode) {
    _UserPage.prototype.oninit.call(this, vnode);
    this.user = null;
    this.loadUser(m.route.param('username'));
  };
  _proto.content = function content() {
    var fileState = new _common_states_FileListState__WEBPACK_IMPORTED_MODULE_4__["default"]();
    if ((flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user && (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user.viewOthersMediaLibrary() || this.user === (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user)) {
      return this.user && _common_components_UserFileList__WEBPACK_IMPORTED_MODULE_3__["default"].component({
        user: this.user,
        selectable: false,
        downloadOnClick: true,
        fileState: fileState
      });
    } else {
      return null;
    }
  };
  _proto.show = function show(user) {
    _UserPage.prototype.show.call(this, user);
    this.user = user;
  };
  return UploadsUserPage;
}((flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/index.ts":
/*!***************************************!*\
  !*** ./src/forum/components/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* binding */ components)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _handler_Uploader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../handler/Uploader */ "./src/forum/handler/Uploader.js");
/* harmony import */ var _DragAndDrop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DragAndDrop */ "./src/forum/components/DragAndDrop.js");
/* harmony import */ var _FileManagerButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FileManagerButton */ "./src/forum/components/FileManagerButton.tsx");
/* harmony import */ var _FileManagerModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FileManagerModal */ "./src/forum/components/FileManagerModal.js");
/* harmony import */ var _UploadButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./UploadButton */ "./src/forum/components/UploadButton.js");
/* harmony import */ var _common_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../common/components */ "./src/common/components/index.ts");







var components = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _common_components__WEBPACK_IMPORTED_MODULE_6__.commonComponents, {
  DragAndDrop: _DragAndDrop__WEBPACK_IMPORTED_MODULE_2__["default"],
  FileManagerButton: _FileManagerButton__WEBPACK_IMPORTED_MODULE_3__["default"],
  FileManagerModal: _FileManagerModal__WEBPACK_IMPORTED_MODULE_4__["default"],
  Uploader: _handler_Uploader__WEBPACK_IMPORTED_MODULE_1__["default"],
  UploadButton: _UploadButton__WEBPACK_IMPORTED_MODULE_5__["default"]
});

/***/ }),

/***/ "./src/forum/downloadButtonInteraction.js":
/*!************************************************!*\
  !*** ./src/forum/downloadButtonInteraction.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_Post__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/Post */ "flarum/forum/components/Post");
/* harmony import */ var flarum_forum_components_Post__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_Post__WEBPACK_IMPORTED_MODULE_2__);




/* global $ */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_Post__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'oncreate', function () {
    var _this = this;
    this.$('[data-fof-upload-download-uuid]').unbind('click').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('fof-upload.canDownload')) {
        alert(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-upload.forum.states.unauthorized'));
        return;
      }
      var url = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('apiUrl') + '/fof/download';
      url += '/' + encodeURIComponent(e.currentTarget.dataset.fofUploadDownloadUuid);
      url += '/' + encodeURIComponent(_this.attrs.post.id());
      url += '/' + encodeURIComponent((flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session).csrfToken);
      window.open(url);
    });
  });
}

/***/ }),

/***/ "./src/forum/extend.ts":
/*!*****************************!*\
  !*** ./src/forum/extend.ts ***!
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
/* harmony import */ var _components_UploadsUserPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/UploadsUserPage */ "./src/forum/components/UploadsUserPage.tsx");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([].concat(_common_extend__WEBPACK_IMPORTED_MODULE_0__["default"], [
// Not using the new extender yet, thinking about if to change the serialized names,
// or the js property names, as we can't change the key->attribute name via the extender,
// like we used to do with ie `User.prototype.viewOthersMediaLibrary = Model.attribute('fof-upload-viewOthersMediaLibrary');`
// new Extend.Model(User) //
//     .attribute<boolean>('fof-upload-viewOthersMediaLibrary')
//     .attribute<boolean>('fof-upload-deleteOthersMediaLibrary')
//     .attribute<number>('fof-upload-uploadCountCurrent')
//     .attribute<number>('fof-upload-uploadCountAll'),

new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1___default().Routes)() //
.add('user.uploads', '/u/:username/uploads', _components_UploadsUserPage__WEBPACK_IMPORTED_MODULE_2__["default"])]));

/***/ }),

/***/ "./src/forum/handler/Uploader.js":
/*!***************************************!*\
  !*** ./src/forum/handler/Uploader.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Uploader)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);

var Uploader = /*#__PURE__*/function () {
  function Uploader() {
    this.callbacks = {
      success: [],
      failure: [],
      uploading: [],
      uploaded: []
    };
    this.uploading = false;
  }
  var _proto = Uploader.prototype;
  _proto.setState = function setState(fileState) {
    this.fileState = fileState;
  };
  _proto.on = function on(type, callback) {
    this.callbacks[type].push(callback);
  };
  _proto.dispatch = function dispatch(type, response) {
    this.callbacks[type].forEach(function (callback) {
      return callback(response);
    });
  };
  _proto.upload = function upload(files, addBBcode) {
    var _this = this;
    if (addBBcode === void 0) {
      addBBcode = true;
    }
    this.uploading = true;
    this.dispatch('uploading', files);
    m.redraw(); // Forcing a redraw so that the button also updates if uploadFiles() is called from DragAndDrop or PasteClipboard

    var body = new FormData();
    for (var i = 0; i < files.length; i++) {
      body.append('files[]', files[i]);
    }

    // send a POST request to the api
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().request({
      method: 'POST',
      url: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('apiUrl') + '/fof/upload',
      // prevent JSON.stringify'ing the form data in the XHR call
      serialize: function serialize(raw) {
        return raw;
      },
      body: body
    }).then(function (result) {
      return _this.uploaded(result, addBBcode);
    })["catch"](function (error) {
      _this.uploading = false;
      m.redraw();
      var e = error.response.errors[0];
      if (!e.code.includes('fof-upload')) {
        throw error;
      }
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().alerts.clear();
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().alerts.show({
        type: 'error'
      }, e.detail);
    });
  };
  _proto.uploaded = function uploaded(result, addBBcode) {
    var _this2 = this;
    if (addBBcode === void 0) {
      addBBcode = false;
    }
    this.uploading = false;
    result.data.forEach(function (file) {
      var fileObj = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store.pushObject(file);

      // Add file to media manager
      _this2.fileState.addToList(fileObj);

      // Dispatch
      _this2.dispatch('success', {
        file: fileObj,
        addBBcode: addBBcode
      });
    });
    this.dispatch('uploaded');
  };
  return Uploader;
}();


/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_7__.components),
/* harmony export */   extend: () => (/* reexport safe */ _extend__WEBPACK_IMPORTED_MODULE_6__["default"])
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/models/User */ "flarum/common/models/User");
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _downloadButtonInteraction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./downloadButtonInteraction */ "./src/forum/downloadButtonInteraction.js");
/* harmony import */ var _addUploadButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./addUploadButton */ "./src/forum/addUploadButton.js");
/* harmony import */ var _addUserPageButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./addUserPageButton */ "./src/forum/addUserPageButton.js");
/* harmony import */ var _extend__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./extend */ "./src/forum/extend.ts");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components */ "./src/forum/components/index.ts");








flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('fof-upload', function () {
  // Leaving these here for now.
  // @see ./extend.ts
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).viewOthersMediaLibrary = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-viewOthersMediaLibrary');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).deleteOthersMediaLibrary = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-deleteOthersMediaLibrary');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).uploadCountCurrent = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-uploadCountCurrent');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).uploadCountAll = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-uploadCountAll');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).uploadSharedFiles = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-uploadSharedFiles');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_1___default().prototype).accessSharedFiles = flarum_common_Model__WEBPACK_IMPORTED_MODULE_2___default().attribute('fof-upload-accessSharedFiles');

  //app.fileListState = new FileListState();

  (0,_addUploadButton__WEBPACK_IMPORTED_MODULE_4__["default"])();
  (0,_downloadButtonInteraction__WEBPACK_IMPORTED_MODULE_3__["default"])();
  (0,_addUserPageButton__WEBPACK_IMPORTED_MODULE_5__["default"])();
});

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

/***/ "flarum/common/components/Switch":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Switch']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Switch'];

/***/ }),

/***/ "flarum/common/components/TextEditor":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['common/components/TextEditor']" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/TextEditor'];

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

/***/ "flarum/common/models/User":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['common/models/User']" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/models/User'];

/***/ }),

/***/ "flarum/common/utils/ItemList":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/utils/ItemList']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/ItemList'];

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

/***/ "flarum/forum/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['forum/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/app'];

/***/ }),

/***/ "flarum/forum/components/Post":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['forum/components/Post']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/Post'];

/***/ }),

/***/ "flarum/forum/components/UserPage":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/UserPage']" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/UserPage'];

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
  !*** ./forum.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.components),
/* harmony export */   extend: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.extend)
/* harmony export */ });
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map