"use strict";

const MinHeap = require("./min-heap");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const minHeap = new MinHeap();
  for (const source of logSources) {
    if (!source.drained) {
      const logEntry = source.pop();
      if (logEntry) minHeap.insert({ logEntry, source });
    }
  }

  while (minHeap.heap.length > 0) {
    const { logEntry, source } = minHeap.extractMin();
    printer.print(logEntry);
    if (!source.drained) {
      const newLogEntry = source.pop();
      if (newLogEntry) minHeap.insert({ logEntry: newLogEntry, source });
    }
  }
  printer.done();
  return console.log("Sync sort complete.");
};
