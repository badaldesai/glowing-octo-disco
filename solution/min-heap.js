"use strict";

module.exports = class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  swap(index1, index2) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }

  insert(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.heap[parentIndex].logEntry.date <= this.heap[index].logEntry.date) break;
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return min;
  }

  heapifyDown() {
    let index = 0;
    const length = this.heap.length;
    while (this.getLeftChildIndex(index) < length) {
      let smallestChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      if (rightChildIndex < length && this.heap[rightChildIndex].logEntry.date < this.heap[smallestChildIndex].logEntry.date) {
        smallestChildIndex = rightChildIndex;
      }

      if (this.heap[index].logEntry.date <= this.heap[smallestChildIndex].logEntry.date) break;
      this.swap(index, smallestChildIndex);
      index = smallestChildIndex;
    }
  }
}