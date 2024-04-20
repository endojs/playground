// @ts-check
import { promises as fs } from 'fs'; // Assuming fs promises for async reading
import { FileWatchingService } from './FileWatchingService.js';

(async () => {
  const watcher = new FileWatchingService(fs);

  const { env } = process;
  console.log('watching Downloads');
  for await (const file of watcher.watchDirectory(`${env.HOME}/Downloads`)) {
    console.log(`New file added: ${file.getName()}`);
    console.log(await file.getContent()); // Call getContent to read the file
  }
})();
