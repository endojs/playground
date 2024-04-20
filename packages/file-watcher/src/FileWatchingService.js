// @ts-check

import EventEmitter from 'events';

class AsyncEventEmitterIterator {
  /**
   * @param {ReturnType<typeof import('chokidar').watch>} emitter
   */
  constructor(emitter) {
    this.emitter = emitter;
    this.queue = []; // Queue events for asynchronous iteration
  }

  [Symbol.asyncIterator]() {
    return this;
  }

  next() {
    /** @type {Promise<IteratorResult<string>>} */
    const p = new Promise((resolve, reject) => {
      if (!this.emitter) {
        return reject(new Error('Iterator is closed'));
      }

      /** @param {string} event */
      const listener = event => {
        this.queue.push(event); // Add event to the queue
        resolve({ value: event, done: false }); // Resolve with event
      };

      this.emitter.on('event', listener); // Add event listener

      // Resolve immediately if there's already an event in the queue
      if (this.queue.length > 0) {
        const event = this.queue.shift();
        resolve({ value: event, done: false });
        this.emitter.removeListener('event', listener); // Cleanup listener
      }
    });
    return p;
  }

  return() {
    if (this.emitter) {
      this.emitter.removeAllListeners('event'); // Cleanup listeners
    }
    return Promise.resolve({ value: undefined, done: true });
  }
}

export class FileWatchingService {
  /**
   * @param {Pick<typeof import('fs/promises'), 'readFile'>} fs
   * @param {typeof import('chokidar').watch} watchFactory
   */
  constructor(fs, watchFactory) {
    // Inject fs and watchFactory
    this.fs = fs;
    this.watch = watchFactory; // Store the watch function
  }

  /**
   * @param {string} directory
   * @param {import('chokidar').WatchOptions} options
   */
  async *watchDirectory(directory, options = {}) {
    const emitter = this.watch(directory, options);
    const iterator = new AsyncEventEmitterIterator(emitter);

    // Close the emitter (optional)
    // emitter.removeAllListeners();

    for await (const path of iterator) {
      if (path === undefined) continue;
      yield {
        getName: () => path,
        getContent: async () => {
          const content = await this.fs.readFile(path, 'utf-8');
          return content;
        },
      };
    }
  }
}
