'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = exports.SessionData = exports.LinearProgression = exports.FibonacciProgression = exports.ExponentialProgression = exports.Progression = exports.PredictionEvaluation = exports.ModelTestStats = exports.ModelStatics = exports.ModelParams = exports.IterationResult = exports.GridRunStats = exports.GridOptions = exports.Grid = exports.FileIOResult = exports.FileIO = exports.FailureMessage = exports.EpochStats = exports.DateTime = exports.AxisSetTraverser = exports.AxisSet = exports.Axis = void 0;
/*
//TDOO: Merge these into a single index.d.ts
export * as Types from './ts_types/common';
export * as GridTypes from './ts_types/Grid';
*/
//TDOO: This becomes abstract with subs, eliminating the enums
var Axis_1 = require("./lib/Axis");
Object.defineProperty(exports, "Axis", { enumerable: true, get: function () { return Axis_1.Axis; } });
var AxisSet_1 = require("./lib/AxisSet");
Object.defineProperty(exports, "AxisSet", { enumerable: true, get: function () { return AxisSet_1.AxisSet; } });
var AxisSetTraverser_1 = require("./lib/AxisSetTraverser");
Object.defineProperty(exports, "AxisSetTraverser", { enumerable: true, get: function () { return AxisSetTraverser_1.AxisSetTraverser; } });
//TODO: doom this one (npm namespace tester)
var DateTime_1 = require("./lib/DateTime");
Object.defineProperty(exports, "DateTime", { enumerable: true, get: function () { return DateTime_1.DateTime; } });
var EpochStats_1 = require("./lib/EpochStats");
Object.defineProperty(exports, "EpochStats", { enumerable: true, get: function () { return EpochStats_1.EpochStats; } });
var FailureMessage_1 = require("./lib/FailureMessage");
Object.defineProperty(exports, "FailureMessage", { enumerable: true, get: function () { return FailureMessage_1.FailureMessage; } });
var FileIO_1 = require("./lib/FileIO");
Object.defineProperty(exports, "FileIO", { enumerable: true, get: function () { return FileIO_1.FileIO; } });
var FileIOResult_1 = require("./lib/FileIOResult");
Object.defineProperty(exports, "FileIOResult", { enumerable: true, get: function () { return FileIOResult_1.FileIOResult; } });
var Grid_1 = require("./lib/Grid");
Object.defineProperty(exports, "Grid", { enumerable: true, get: function () { return Grid_1.Grid; } });
var GridOptions_1 = require("./lib/GridOptions");
Object.defineProperty(exports, "GridOptions", { enumerable: true, get: function () { return GridOptions_1.GridOptions; } });
var GridRunStats_1 = require("./lib/GridRunStats");
Object.defineProperty(exports, "GridRunStats", { enumerable: true, get: function () { return GridRunStats_1.GridRunStats; } });
var IterationResult_1 = require("./lib/IterationResult");
Object.defineProperty(exports, "IterationResult", { enumerable: true, get: function () { return IterationResult_1.IterationResult; } });
var ModelParams_1 = require("./lib/ModelParams");
Object.defineProperty(exports, "ModelParams", { enumerable: true, get: function () { return ModelParams_1.ModelParams; } });
var ModelStatics_1 = require("./lib/ModelStatics");
Object.defineProperty(exports, "ModelStatics", { enumerable: true, get: function () { return ModelStatics_1.ModelStatics; } });
var ModelTestStats_1 = require("./lib/ModelTestStats");
Object.defineProperty(exports, "ModelTestStats", { enumerable: true, get: function () { return ModelTestStats_1.ModelTestStats; } });
var PredictionEvaluation_1 = require("./lib/PredictionEvaluation");
Object.defineProperty(exports, "PredictionEvaluation", { enumerable: true, get: function () { return PredictionEvaluation_1.PredictionEvaluation; } });
var Progression_1 = require("./lib/Progression");
Object.defineProperty(exports, "Progression", { enumerable: true, get: function () { return Progression_1.Progression; } });
var ExponentialProgression_1 = require("./lib/progression/ExponentialProgression");
Object.defineProperty(exports, "ExponentialProgression", { enumerable: true, get: function () { return ExponentialProgression_1.ExponentialProgression; } });
var FibonacciProgression_1 = require("./lib/progression/FibonacciProgression");
Object.defineProperty(exports, "FibonacciProgression", { enumerable: true, get: function () { return FibonacciProgression_1.FibonacciProgression; } });
var LinearProgression_1 = require("./lib/progression/LinearProgression");
Object.defineProperty(exports, "LinearProgression", { enumerable: true, get: function () { return LinearProgression_1.LinearProgression; } });
var SessionData_1 = require("./lib/SessionData");
Object.defineProperty(exports, "SessionData", { enumerable: true, get: function () { return SessionData_1.SessionData; } });
var Utils_1 = require("./lib/Utils");
Object.defineProperty(exports, "Utils", { enumerable: true, get: function () { return Utils_1.Utils; } });
//# sourceMappingURL=main.js.map