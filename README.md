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

## Installation
```
npm i tfjs-node-grid-search
```

## Documentation
https://github.com/joemullenix-ks/tfjs-node-grid-search/wiki

## Full Example
```js
import * as tngs from 'tfjs-node-grid-search';

console.log('Welcome to TNGS!');

//NOTE: We wrap the example in an async function, because tfjs's model fit
//      is asynchronous.
const main = async () => {
  // First, we define the axes for our grid search (the available axis types are
  // enumerated in Axis (with many more coming soon!)).
  // For each axis, we set a begin and end boundary, which are inclusive. We
  // also create a progression across that range, i.e. the values at which
  // we'll stop to train and test a model.

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

  // test nuerons-per-hidden-layer from 10 to 18 inclusive, using the beginning
  // of the Fibonacci sequence (10, 11, 12, 13, 15, 18)
  axes.push(
    new tngs.Axis(
      tngs.AxisTypes.NEURONS,
      10,
      18,
      new tngs.FibonacciProgression(0)
    )
  );

  const axisSet = new tngs.AxisSet(axes);

  // Next, we define the static parameters. That is, those params that never
  // change during our grid search.

  const modelStatics = new tngs.ModelStatics({
    epochs: 5,
    hiddenLayers: 1,
    validationSplit: 0.25
  });

  // Next, we setup options that will govern the Grid itself, as well as the
  // search process.

  const gridOptions = new tngs.GridOptions({
    epochStatsDepth: 3,
    repetitions: 2,
    resultsDirectory: '',
    validationSetSizeMin: 1000,
    writeResultsAsCSV: true
  });

  // Now we load and configure the data set. A fresh copy of this data will be
  // used to train and test each 'iteration' of the grid search (i.e. each
  // unique combination of dynamic params).

  const dataSetFetcher = new tngs.DataSetFetcher(process.argv);

  const dataSet = await dataSetFetcher.Fetch();

  // set aside 10% of these cases for post-training generalization tests
  const TEST_DATA_FRACTION = 0.1;

  const sessionData = new tngs.SessionData(
    TEST_DATA_FRACTION,
    dataSet,
    true
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
### 1. Include the library
Include TNGS via ES Modules (import)
```
import * as tngs from 'tfjs-node-grid-search';
```

Include TNGS via CommonJS (require)
```
const tngs = require('tfjs-node-grid-search');
```

> NOTE: It's important the grid search be done in an async context, because the
> filesystem reads and the model training process are asynchronous.

### 2. Define the grid's axes (the dynamic parameters)
Decide which hyperparameters will have a range of values. For each, create an
Axis{{LINK TO DOCS}}. Use an array of axes to instatiate an AxisSet{{LINK TO DOCS}}.
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
Instantiate a ModelStatics{{LINK TO DOCS}} with these values.
```js
  const modelStatics = new tngs.ModelStatics({
    epochs: 5,
    hiddenLayers: 1,
    validationSplit: 0.25
  });
```

### 4. (OPTIONAL) Define search parameters
There are optional settings that do not affect your neural network. If you wish
to modify these, instantiate a GridOptions{{LINK TO DOCS}}. Otherwise defaults
will be used.
```js
  const gridOptions = new tngs.GridOptions({
    epochStatsDepth: 3,
    repetitions: 2,
    resultsDirectory: '',
    validationSetSizeMin: 1000,
    writeResultsAsCSV: true
  });
```

### 5. Fetch the data set
Fetch your training/testing data by passing the filepaths to an instance of
DataSetFetcher{{LINK TO DOCS}}, and fetching an instance of DataSet{{LINK TO DOCS}}.
> NOTE: DataSetFetcher is designed to take the Node launch-args vector (see
> example), but any array of strings will work. It expects the third item in the
> array to be the path to your inputs file, and the fourth to be the path to your
> targets file.

Intantiate a SessionData{{LINK TO DOCS}} with the DataSet and your standardization preferences.

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

### 6. Define the evaluation callback
One callback must be supplied to the search, so that predictions can be scored.
Define a function that takes two arrays ("target" and "prediction"), and
returns an instance of PredictionEvaluation{{LINK TO DOCS}}.
The search process will gather your scores, and create a report telling you how
each combination of hyperparameters performed.
```js
  const evaluatePrediction = (target: number[], prediction: number[]) => {
    const targettedIndex = tngs.Utils.ArrayFindIndexOfHighestValue(target);

    const predictedIndex = tngs.Utils.ArrayFindIndexOfHighestValue(prediction);

    return new tngs.PredictionEvaluation(targettedIndex === predictedIndex);
  };
```

### 7. (OPTIONAL) Define reporting callbacks
By default, the system will report results and test stats to the log at the end
of every epoch. If you wish to do your own analysis, you may provide callbacks
for end-of-batch, end-of-epoch, and end-of-iteration (where 'iteration' is a
single model run).
These optional functions have the following signatures:

```js
callbackReportIteration(duration: number, predictions: number[][], proofInputs: Array, proofTargets: number[][])

callbackReportEpoch(duration: number, epoch: number, logs: tf.Logs, epochStats: EpochStats)

callbackReportBatch(duration: number, predictions: number[][], proofInputs: Array, proofTargets: number[][])
```

Pass them to Grid{{LINK TO DOCS}}. No return value(s) are expected.

### 8. Run the grid search
You're all set! Instantiate a Grid{{LINK TO DOCS}}, and call Run(). Again, this
should be run in an async function, as TensorFlow's model.fit is asynchronous.
```js
  const grid = new tngs.Grid(
    axisSet,
    modelStatics,
    sessionData,
    evaluatePrediction,
    gridOptions
  );

  await grid.Run();
```

## Roadmap
Coming soon

## Windows
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
