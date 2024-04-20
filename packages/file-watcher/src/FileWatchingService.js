// @ts-check
import path from 'node:path';
import fs from 'node:fs/promises';
import { Far } from '@endo/far';

export class FileWatchingService {
  /**
   * @param {Pick<typeof import('fs/promises'), 'readFile' | 'watch'>} fs
   */
  constructor(fs) {
    this.fs = fs;
  }

  /**
   * @param {string} directory
   * @param {Parameters<import('fs/promises').watch>[1]} options
   */
  async *watchDirectory(directory, options = {}) {
    const events = this.fs.watch(directory, options);

    for await (const event of events) {
      console.log('@@', event);
      const { filename } = event;
      // XXX Buffer not supported
      if (typeof filename !== 'string') break;
      const fullPath = path.join(directory, filename);
      yield Far('File', {
        getName: () => filename,
        getContent: async () => {
          const content = await this.fs.readFile(fullPath, 'utf-8');
          return content;
        },
      });
    }
  }
}

const watcher = new FileWatchingService(fs);

export const make = () => {
  return Far('FileWatcherFactory', {
    /** @param {string} path */
    make: path =>
      Far('FileWatcher', {
        watch: () => watcher.watchDirectory(path),
      }),
  });
};
