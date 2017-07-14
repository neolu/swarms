import { Crazyradio } from '../drivers/crazyradio';

import { Commander } from './commander';
import { Logging } from './logging';

import { EventEmitter } from 'events';
import * as path from 'path';

export const defaultCrazyflieOptions: CrazyflieOptions = {
	cachePath: path.join(__dirname, '..', '..', 'toc-cache.json')
};

export class Crazyflie extends EventEmitter {

	private initialized = false;
	options: CrazyflieOptions = defaultCrazyflieOptions;

	commander: Commander;
	logging: Logging;

	/**
	 * Class for controlling a Crazyflie
	 */

	constructor(public radio: Crazyradio) {
		super();

		this.commander = new Commander(this);
		this.logging = new Logging(this);

		// Forward all errors to the global Crazyflie 'error' event
		this.logging.on('error', (err: any) => {
			this.emit('error', err);
		});
	}

	async init() {
		if (this.initialized) {
			return Promise.reject('Crazyflie already initialized!');
		}

		// Set values initially at 0 or else it won't work
		await this.commander.setpoint({
			roll: 0,
			pitch: 0,
			yaw: 0,
			thrust: 0
		});

		this.initialized = true;
	}

}

export interface CrazyflieOptions {
	cachePath: string;
}
