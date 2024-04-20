// @ts-check
import { promises as fs } from 'fs'; // Assuming fs promises for async reading
import { watch } from 'chokidar'; // Import chokidar directly
import { FileWatchingService } from './FileWatchingService.js';

(async () => {
  const fileSystem = fs; // Replace with your preferred file system implementation

  /** @type {typeof import('chokidar').watch} */
  const watchFactory = (directory, options) => watch(directory, options);

  const watcher = new FileWatchingService(fileSystem, watchFactory); // Inject fs and watchFactory

  const { env } = process;
  for await (const file of watcher.watchDirectory(`${env.HOME}/Downloads`)) {
    console.log(`New file added: ${file.getName()}`);
    console.log(await file.getContent()); // Call getContent to read the file
  }
})();
