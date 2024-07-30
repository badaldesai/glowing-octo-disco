"use strict";
const MinHeap = require("./min-heap");

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    const minHeap = new MinHeap();
    const queuePromise = {};
    let activeSource = -1;

    async function fetchNextLog(sourceIndex) {
      const entry = await logSources[sourceIndex].popAsync();
      if (entry) {
        minHeap.insert({ logEntry: entry, sourceIndex });
      }
      if (entry && sourceIndex !== activeSource) {
        if (!queuePromise[sourceIndex]) {
          queuePromise[sourceIndex] = [fetchNextLog(sourceIndex)];
        } else {
          queuePromise[sourceIndex].push(fetchNextLog(sourceIndex));
        }
      }
    }

    const fetchPromises = logSources.map((_, index) => fetchNextLog(index));
    await Promise.all(fetchPromises);

    while (minHeap.heap.length > 0) {
      const { logEntry, sourceIndex } = minHeap.extractMin();
      printer.print(logEntry);
      activeSource = sourceIndex;
      await Promise.all(queuePromise[sourceIndex]);
      activeSource = -1;
      queuePromise[sourceIndex] = [fetchNextLog(sourceIndex)];
    }
    printer.done();
    resolve(console.log("Async sort complete."));
  });
};
