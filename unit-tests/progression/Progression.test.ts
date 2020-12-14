/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';


import { Progression } from '../../src/lib/progression/Progression';


test('implementation; instantiation; read-onlys; advance and reset', () => {
	class EmptyNameConcreteProgression extends Progression {
		constructor() {
			super(false, '');
		}

		Advance(): void {
			++this._value;
		}
	}

	expect(() => {
		const emptyNameConcreteProgression = new EmptyNameConcreteProgression();
	}).toThrow();

	const INTEGER_BASED = false;
	const TYPE_NAME = 'unused;'

	class ConcreteProgression extends Progression {
		constructor() {
			super(INTEGER_BASED, TYPE_NAME);
		}

		Advance(): void {
			++this._value;
		}
	}

	const concreteProgression = new ConcreteProgression();

	expect(concreteProgression).toBeInstanceOf(Progression);

	expect(concreteProgression.integerBased).toBe(INTEGER_BASED);
	expect(concreteProgression.typeName).toBe(TYPE_NAME);

	expect(concreteProgression.value).toBe(0);

	concreteProgression.Advance();

	expect(concreteProgression.value).toBe(1);

	concreteProgression.Reset();

	expect(concreteProgression.value).toBe(0);
});