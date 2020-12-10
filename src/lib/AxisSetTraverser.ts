'use strict';


import { NumberKeyedStringsObject, StringKeyedNumbersObject } from './types';


import { AxisSet } from './AxisSet';


/**
 * Manages an {@link AxisSet}.
 * Performs the selection of hyperparameter values during the grid search.
 */
class AxisSetTraverser {
	private _totalAxes = 0;
	private _traversed = false;
	private _iterationDescriptorsByIndex: NumberKeyedStringsObject = {};
	private _totalIterations = 0;

	/**
	 * Creates an instance of AxisSetTraverser.
	 * @param {AxisSet} _axisSet The collection of {@link Axis} that define the
	 *							 grid (parameter space) to be searched. Each
	 *							 axis is associated with one hyperparameter.
	 */
	constructor(private _axisSet: AxisSet) {
		// save off our axis count, which never changes
		this._totalAxes = this._axisSet.GetTotalAxes();

		this._traversed = false;

//NOTE: This function is buried in the c'tor because it actually runs the traversal (advances the axes).
//		It cleans up after itself, resetting to a pristine state on the way out.
		this._iterationDescriptorsByIndex = {};

		this._totalIterations = 0;

		const BUILD_SCHEDULE = () => {
			let reportText = '';

			for (let i = 0; !this._traversed; ++i) {
				++this._totalIterations;

				const DESCRIPTOR = this.WriteReport(true); // compact report

				this._iterationDescriptorsByIndex[i] = DESCRIPTOR;

//TODO: (maybe) add a "x3" suffix to this printout; needs 'repetitions' from the owner.
//		...could make more sense to factor this out of the constructor. The protection of the 'running' state seems misplaced.
				reportText += DESCRIPTOR + '\n';

				this.Advance();
			}

			console.log('iteration schedule:' + '\n' + reportText);

			// reset for traversals managed by the owner
			this._traversed = false;
		}

		BUILD_SCHEDULE();
	}

	get	totalIterations(): number { return this._totalIterations; }
	get traversed(): boolean { return this._traversed; }

	/**
	 * Iterates the grid. Called after each 'cell' (i.e. unique
	 * combination of hyperparameters) is trained and tested. Once all axes
	 * are complete, we mark ourselves as traversed (or done).
	 */
	Advance(): void {
		console.assert(!this._traversed);

		let resetCounter = 0;

		for (let i = 0; i < this._totalAxes; ++i) {
			this._axisSet.AdvanceAxis(i);

			if (this._axisSet.CheckAxisComplete(i)) {
				this._axisSet.ResetAxis(i);

//KEEP: This is useful, but currently too spammy (without digging out the axis name, it's also too vague).
//		There's a decent chance this comes back after the first round of user feedback.
//				console.log('Axis ' + i + ' reset');

				++resetCounter;

				continue;
			}

			return;
		}

		console.assert(resetCounter === this._totalAxes);

		// this advance completed the traversal; reset

		this._traversed = true;
	}

	/**
	 * Produces a simple key: value mapping of the axes current positions,
	 * keyed by their names.
	 * @return {StringKeyedNumbersObject}
	 */
	CreateIterationParams(): StringKeyedNumbersObject {
		return this._axisSet.CreateParams();
	}

	/**
	 * Traverses the axis set, invoking a callback with the name of each axis.
	 * @param {function(string): void} callback The function to be invoked.
	 */
	ExamineAxisNames(callback: CallbackDoSomethingWithAxisName): void {
		this._axisSet.Walk((axis) => {
			callback(axis.typeName);
		});
	}

	/**
	 * Gets the descriptor for a requested axis. We build these simple strings
	 * in the constructor.
	 * @param {number} index The axis to be described.
	 * @return {string}
	 */
	LookupIterationDescriptor(index: number): string {
		if (this._iterationDescriptorsByIndex[index] === undefined) {
			throw new Error('Attempted to lookup descriptor for unknown iteration: ' + index);
		}

		return this._iterationDescriptorsByIndex[index];
	}

	/**
	 * Gets a combined report of every axis' status.
	 * @param {boolean} compact Whether to get a detailed report.
	 * @return {string}
	 */
	WriteReport(compact: boolean): string {
		let reportText = '';

		for (let i = 0; i < this._totalAxes; ++i) {
			reportText += (compact ? '' : '• ')
							+ this._axisSet.WriteAxisReport(i, compact)
							+ (compact ? ', ' : '\n');
		}

		// remove the trailing newline or comma-and-space
		reportText = reportText.slice(0, (compact ? -2 : -1));

		return reportText;
	}
}


//NOTE: This is only here for JSDoc, which has a hard time parsing the
//		signature. It's not hurting anyone. Yet.
type CallbackDoSomethingWithAxisName = (axisKey: string) => void;


Object.freeze(AxisSetTraverser);

export { AxisSetTraverser };
