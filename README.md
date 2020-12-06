# tfjs-node-grid-search &middot; [![npm version](https://img.shields.io/npm/v/tfjs-node-grid-search.svg?style=flat)](https://www.npmjs.com/package/tfjs-node-grid-search)

**tfjs-node-grid-search (TNGS)** is a grid search utility for TensorFLow.js in Node.js.
Simply define ranges of hyperparameters. For each combination, TNGS will create a model, train it and test it using your data set. Results are logged and (optionally) written as a CSV file.

[Learn about running TensorFlow in Node.](https://www.tensorflow.org/js/tutorials/setup#nodejs_setup)

## Installation
```
npm i tfjs-node-grid-search
```

## Examples
> :warning: tfjs-node currently has an installation problem on Windows. See (link to bug)
>           TLDR, here's the workaround:
>
>              copy tensorflow.dll
>             from: node_modules\@tensorflow\tfjs-node\deps\lib
>               to: node_modules\@tensorflow\tfjs-node\lib\napi-v6

```js
import * as tngs from 'tfjs-node-grid-search';

console.log('Welcome to TNGS!');

//NOTE: We wrap the example in an async function, because tfjs's model fit
//		is asynchronous.
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
    validationSetSizeMin: 1000,
    writeResultsToDirectory: ''
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

//NOTE: This example is written for a multi-class (one-hot) classification
//      network.

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

## Documentation
https://github.com/joemullenix-ks/tfjs-node-grid-search/wiki


## License

React is [MIT licensed](./LICENSE).
