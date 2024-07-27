"use strict";
const MinHeap = require("./min-heap");

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    const minHeap = new MinHeap();
    for (const source of logSources) {
      if (!source.drained) {
        const logEntry = await source.popAsync();
        if (logEntry) minHeap.insert({ logEntry, source });
      }
    }

    while (minHeap.heap.length > 0) {
      const { logEntry, source } = minHeap.extractMin();
      printer.print(logEntry);
      if (!source.drained) {
        const newLogEntry = await source.popAsync();
        if (newLogEntry) minHeap.insert({ logEntry: newLogEntry, source });
      }
    }
    printer.done();
    resolve(console.log("Async sort complete."));
  });
};
