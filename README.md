# tfjs-node-grid-search &middot; [![npm version](https://img.shields.io/npm/v/tfjs-node-grid-search.svg?style=flat)](https://www.npmjs.com/package/tfjs-node-grid-search) [![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/joemullenix-ks/tfjs-node-grid-search/blob/main/LICENSE)

<span style="font-size:0.85em">

| Statements                  | Branches                | Functions                 | Lines                |
| --------------------------- | ----------------------- | ------------------------- | -------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg)    |
</span>
<br>

**tfjs-node-grid-search (TNGS)** is a grid search utility for TensorFLow.js in
Node.js. Simply define ranges of hyperparameters. For every combination, TNGS
will create a model, train it and test it using your data set. Results are
logged and (optionally) written as a CSV file.

[Learn about running TensorFlow in Node.](https://www.tensorflow.org/js/tutorials/setup#nodejs_setup)

## Documentation
[joemullenix-ks.github.io/tfjs-node-grid-search](https://joemullenix-ks.github.io/tfjs-node-grid-search/index.html)

## Installation
```
npm i tfjs-node-grid-search
```

### Linux/macOS
After installing, you may need to compile bindings locally. If
you see this error, simply follow the "npm rebuild" instructions:

> Uncaught Error: The Node.js native addon module (tfjs_binding.node) can not be
> found at path: /Users/PROJECT/node_modules/@tensorflow/tfjs-node/lib/napi-v7/tfjs_binding.node.
>
> Please run command 'npm rebuild @tensorflow/tfjs-node build-addon-from-source'
> to rebuild the native addon module.

Note: If the rebuild fails, you may need C++ tools. That's outside the scope of
this package, but fairly easy to solve. Please search "g++" for more info.

## Full Example
This is written for TypeScript.
To run it as plain JS, do the following:
- Add "type": "module" to your package.json, or use CommonJS to require the
  library. See #1 of the step-by-step guide (below).
- Remove types from the scoring callback's signature (line ~95), like so:
```js
  // For plain JS, change this...
  const evaluatePrediction = (target: number[], prediction: number[])...

  // ...to this.
  const evaluatePrediction = (target, prediction)...
```
Example:
```js
import * as tngs from 'tfjs-node-grid-search';

console.log('Welcome to TNGS!');

//NOTE: This example demonstrates a very simple XOR problem. It runs these two
//      network models:
//      - zero hidden layers (SLP), which cannot learn XOR
//      - one hidden layer (MLP), which learns XOR

//NOTE: We wrap the example in an async function, because tfjs's model fit
//      is asynchronous.
const main = async () => {
  // First, we define the axes for our grid search (the available axis types are
  // enumerated in Axis (with many more coming soon!)).
  // For each axis, we set a begin and end boundary, which are inclusive. We
  // also create a progression across that range, i.e. the values at which
  // we'll stop to train and test a model.

  const axes = [];

  // test first with zero hidden layers, then one hidden layer
  axes.push(
    new tngs.Axis(
      tngs.AxisTypes.LAYERS,
      0,
      1,
      new tngs.LinearProgression(1)
    )
  );

  const axisSet = new tngs.AxisSet(axes);

  // Next, we define the static parameters. That is, those params that never
  // change during our grid search.

  const modelStatics = new tngs.ModelStatics({
    epochs: 200,
    validationSplit: 0.5
  });

  // Next, we setup options that will govern the Grid itself, as well as the
  // search process.

  const gridOptions = new tngs.GridOptions({
    repetitions: 2,
    resultsDirectory: '',
    validationSetSizeMin: 1,
    writeResultsAsCSV: true
  });

  // Now we load and configure the data set. A fresh copy of this data will be
  // used to train and test each 'iteration' of the grid search (i.e. each
  // unique combination of dynamic params).

  // set aside one third of the cases for post-training generalization tests
  const TEST_DATA_FRACTION = 1/3;

//NOTE: We load each XOR case three times, for 12 total cases.
//      - Four are reserved for generalization (see TEST_DATA_FRACTION, above).
//      - With a 'validationSplit' of 0.5, the remaining eight are divided into
//      four each for testing and validation.
//
//      The output labels are ["false", "true"].

//NOTE: We use hard-coded data for demonstration purposes, only. The more
//      common usage is to load data from disk or url, via DataSetFetcher.
//      Please see #4 in the step-by-step guide (below).
  const dataSet = new tngs.DataSet(
    [
      [0,0],[0,1],[1,0],[1,1],
      [0,0],[0,1],[1,0],[1,1],
      [0,0],[0,1],[1,0],[1,1]
    ],
    [
      [1,0],[0,1],[0,1],[1,0],
      [1,0],[0,1],[0,1],[1,0],
      [1,0],[0,1],[0,1],[1,0]
    ]);

  const sessionData = new tngs.SessionData(
    TEST_DATA_FRACTION,
    dataSet,
    false
  );

  // This callback is used by the Grid during generalization testing. At the end
  // of each epoch (after) the network is trained, the Grid makes predictions
  // using the test data. For each prediction, it calls this function, passing
  // the known targets and its prediction.
  // We evaluate each prediction, and return a PredictionEvaluation, which lets
  // Grid score the network.
  //	- If the prediction is acceptable, set the first argument ("correct")
  //    to true.
  //	- The second argument (which is optional) is "delta", or an arbitrary
  //    value for the prediction.

  const evaluatePrediction = (target: number[], prediction: number[]) => {
    const targettedIndex = tngs.Utils.ArrayFindIndexOfHighestValue(target);

    const predictedIndex = tngs.Utils.ArrayFindIndexOfHighestValue(prediction);

//NOTE: This example is written for a multi-class classification network
//      (one-hot targets).

    // if the network chose the correct index, we pass true
    const correct = targettedIndex === predictedIndex;

    // we also pass a delta value, measuring how close the prediciton is to 1.0
    // (or 100% probability)
    const delta = 1 - prediction[predictedIndex];

    return new tngs.PredictionEvaluation(correct, delta);
  };

  // We're now ready to create the Grid, and run the search!

  const grid = new tngs.Grid(
    axisSet,
    modelStatics,
    sessionData,
    evaluatePrediction,
    gridOptions
  );

  await grid.Run();
};

// run the example (with a top-level exception handler)
main().catch(reason => {
  console.log('There was a problem.', reason);
});
```

## Step-By-Step
These steps demonstrate more advanced techniques, and some of the options left
out of the full example (above).

### 1. Include the library
There are two supported methods for including the TNGS library:

Via ES Modules (import)
```
import * as tngs from 'tfjs-node-grid-search';
```

Via CommonJS (require)
```
const tngs = require('tfjs-node-grid-search');
```

> NOTE: It's important the grid search be done in an async context, because the
> filesystem reads and the model training process are asynchronous.

### 2. Define the grid's axes (the dynamic parameters)
Decide which hyperparameters will have a range of values. For each, create an
[Axis](https://joemullenix-ks.github.io/tfjs-node-grid-search/Axis.html). Use an array of axes to instatiate an [AxisSet](https://joemullenix-ks.github.io/tfjs-node-grid-search/AxisSet.html).
Example:
```js
  const axes = [];

  // test batch sizes from 8 to 16 inclusive, in linear steps of 4 (8, 12, 16)
  axes.push(
    new tngs.Axis(
      tngs.AxisTypes.BATCH_SIZE,
      8,
      16,
      new tngs.LinearProgression(4)
    )
  );

  // test learning rates from 0.01 to 0.001 inclusive, in linear steps of 0.003
  // (0.01, 0.007, 0.004, 0.001)
  axes.push(
    new tngs.Axis(
      tngs.AxisTypes.LEARN_RATE,
      0.01,
      0.001,
      new tngs.LinearProgression(0.003)
    )
  );

  const axisSet = new tngs.AxisSet(axes);
```

### 3. Define the static model parameters
Set values for model parameters that will *not* change throughout the search.
Instantiate a [ModelStatics](https://joemullenix-ks.github.io/tfjs-node-grid-search/ModelStatics.html) with these values.
```js
  const modelStatics = new tngs.ModelStatics({
    epochs: 5,
    hiddenLayers: 1,
    validationSplit: 0.25
  });
```

### 4. Fetch the data set
Fetch your training/testing data by passing the filepaths to an instance of
[DataSetFetcher](https://joemullenix-ks.github.io/tfjs-node-grid-search/DataSetFetcher.html), and fetching an instance of [DataSet](https://joemullenix-ks.github.io/tfjs-node-grid-search/DataSet.html).
> NOTE: DataSetFetcher is designed to take the Node launch-args vector (see
> example), but any array of strings will work. It expects the third item in the
> array to be the path to your inputs file, and the fourth to be the path to your
> targets file.

Use the DataSet to instantiate a [SessionData](https://joemullenix-ks.github.io/tfjs-node-grid-search/SessionData.html), which also takes your input-standardization preference (true in this example, meaning 'use default algorithm').

```
If you use process.argv as designed, consider launching your app like this:

Example command line
  > node my-tngs-app.js data_inputs.txt data_targets.txt

Example VSCode configuration property (in launch.json)
  "args": ["data_inputs.txt", "data_targets.txt"]
```

```js
  const dataSetFetcher = new tngs.DataSetFetcher(process.argv);

  const dataSet = await dataSetFetcher.Fetch();

  // set aside 10% of these cases for post-training generalization tests
  const TEST_DATA_FRACTION = 0.1;

  const sessionData = new tngs.SessionData(
    TEST_DATA_FRACTION,
    dataSet,
    true
  );
```

### 5. Define the evaluation callback
One callback must be supplied to the search, so that predictions can be scored.
Define a function that takes two arrays ("target" and "prediction"), and
returns an instance of [PredictionEvaluation](https://joemullenix-ks.github.io/tfjs-node-grid-search/PredictionEvaluation.html).
The search process will gather your scores, and create a report telling you how
each combination of hyperparameters performed.
```js
  const evaluatePrediction = (target: number[], prediction: number[]) => {
    const targettedIndex = tngs.Utils.ArrayFindIndexOfHighestValue(target);

    const predictedIndex = tngs.Utils.ArrayFindIndexOfHighestValue(prediction);

    return new tngs.PredictionEvaluation(targettedIndex === predictedIndex);
  };
```

### 6. Run the grid search
You're all set! Instantiate a [Grid](https://joemullenix-ks.github.io/tfjs-node-grid-search/Grid.html), and call Run(). Again, this
should be done in an async function, as TensorFlow's model.fit is asynchronous.
```js
  const grid = new tngs.Grid(
    axisSet,
    modelStatics,
    sessionData,
    evaluatePrediction
  );

  await grid.Run();
```

### 7. (OPTIONAL) Define search parameters
There are optional settings that do not affect your neural network. If you wish
to modify these, instantiate a [GridOptions](https://joemullenix-ks.github.io/tfjs-node-grid-search/GridOptions.html). Otherwise defaults
will be used.
```js
  const gridOptions = new tngs.GridOptions({
    epochStatsDepth: 3,
    repetitions: 2,
    resultsDirectory: '',
    validationSetSizeMin: 1000,
    writeResultsAsCSV: true
  });

  // create a grid with customized options
  const grid = new tngs.Grid(
    axisSet,
    modelStatics,
    sessionData,
    evaluatePrediction,
    gridOptions
  );
```

### 8. (OPTIONAL) Define reporting callbacks
By default, the system reports results and stats to the log at the end of every
epoch. If you wish to do your own analysis, you may provide callbacks for
end-of-batch, end-of-epoch and end-of-iteration (where 'iteration' is a single
model's run).
These optional functions have the following signatures:

```js
callbackReportIteration(duration: number, predictions: number[][], proofInputs: Array, proofTargets: number[][])

callbackReportEpoch(duration: number, epoch: number, logs: tf.Logs, epochStats: EpochStats)

callbackReportBatch(duration: number, batch: number, logs: tf.Logs | undefined)
```

Pass them to [Grid](https://joemullenix-ks.github.io/tfjs-node-grid-search/Grid.html). No return value(s) are expected.

```js
  // create a grid with customized options
  const grid = new tngs.Grid(
    axisSet,
    modelStatics,
    sessionData,
    evaluatePrediction,
    null, // null for default settings, otherwise an instance of GridOptions
    callbackReportIteration,
    callbackReportEpoch,
    callbackReportBatch
  );
```

## Roadmap
- Rewrite DataSetFetcher as a utility, rather than a class to be instantiated.
- Support data fetch via URL.
- Offer custom schedules (as opposed to progressions) of grid-axis steps.
- Optional callback for create-model.
- Optional callback for compile-model (and/or more initializers, optimizers,
  loss functions and metrics).
- Support additional hyperparams (e.g. bias, dropouts).
- Detection and intervention/early-exit on overfit/stuck.
- Support other network types (e.g. regression) w/ templates.
- Support more complex networks (e.g. multi in/out, convolutions).
- Write the model & weight files. // UNBLOCKED by the node bug as of 2.8.0!
- Smart-start method for skipping poor/unlucky initial weights.
- Node FORK/SPAWN for parallel runs.
- Localization, as desired (very few external strings).

## Legacy TF versions on Windows
>
> :warning: An older version of tfjs-node (v2.7.0) has an installation problem
> on Windows.<br>
> [See details](https://github.com/tensorflow/tfjs/issues/4052)
>
>         TLDR, here's the workaround:
>
>         Copy tensorflow.dll
>             from: node_modules\@tensorflow\tfjs-node\deps\lib
>               to: node_modules\@tensorflow\tfjs-node\lib\napi-v6

## License

tfjs-node-grid-search is [MIT licensed](./LICENSE).
