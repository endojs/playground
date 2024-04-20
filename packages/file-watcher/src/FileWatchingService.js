// @ts-check
import path from 'path';

export class FileWatchingService {
  /**
   * @param {Pick<typeof import('fs/promises'), 'readFile' | 'watch'>} fs
   */
  constructor(fs) {
    this.fs = fs;
  }

  /**
   * @param {string} directory
   * @param {import('chokidar').WatchOptions} options
   */
  async *watchDirectory(directory, options = {}) {
    const events = this.fs.watch(directory, options);

    for await (const event of events) {
      console.log('@@', event);
      const { filename } = event;
      if (filename === null) break;
      const fullPath = path.join(directory, filename);
      yield {
        getName: () => filename,
        getContent: async () => {
          const content = await this.fs.readFile(fullPath, 'utf-8');
          return content;
        },
      };
    }
  }
}
