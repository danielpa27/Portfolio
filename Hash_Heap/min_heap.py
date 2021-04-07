# Course: CS261 - Data Structures
# Assignment: 5
# Student: Patrick Daniels
# Description: Min Heap implementation using a dynamic array


# Import pre-written DynamicArray and LinkedList classes
from a5_include import *


class MinHeapException(Exception):
    """
    Custom exception to be used by MinHeap class
    DO NOT CHANGE THIS CLASS IN ANY WAY
    """
    pass


class MinHeap:
    def __init__(self, start_heap=None):
        """
        Initializes a new MinHeap
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        self.heap = DynamicArray()

        # populate MH with initial values (if provided)
        # before using this feature, implement add() method
        if start_heap:
            for node in start_heap:
                self.add(node)

    def __str__(self) -> str:
        """
        Return MH content in human-readable form
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        return 'HEAP ' + str(self.heap)

    def is_empty(self) -> bool:
        """
        Return True if no elements in the heap, False otherwise
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        return self.heap.length() == 0

    def par_index(self, index: int) -> int:
        """
        Returns parent index of index given
        """
        return (index - 1) // 2

    def lc_index(self, index: int) -> int:
        """
        Returns left child index of index given
        """
        return 2 * index + 1

    def rc_index(self, index: int) -> int:
        """
        Returns right child index of index given
        """
        return 2 * index + 2

    def perc_up(self, index: int) -> None:
        """
        Moves the node at the given index up in the heap until its parent 
        is smaller than itself
        """

        # get parent index
        pi = self.par_index(index)

        # swap if node is less than parent and not min
        while index > 0 and self.heap[index] < self.heap[pi]:
            self.heap.swap(index, pi)
            # move pointers
            index = pi
            pi = self.par_index(index)

    def perc_down(self, index: int) -> None:
        """
        Moves the node at the given index down in the heap until both its children
        are smaller than itself
        """
        length = self.heap.length()

        while index >= 0:
            mci = -1    # minimum child index
            rci = self.rc_index(index)      # right child index
            lci = self.lc_index(index)      # left child index

            # right child in bounds and less than parent
            if rci < length and self.heap[rci] < self.heap[index]:
                # left child is minimum
                if self.heap[lci] <= self.heap[rci]:
                    # set minimum child index
                    mci = lci
                else:
                    mci = rci

            # only left child in bounds and less than parent
            else:
                if lci < length and self.heap[lci] < self.heap[index]:
                    # set minimum child index
                    mci = lci

            # swap if there is a smaller child
            if mci >= 0:
                self.heap.swap(index, mci)
            # update pointer
            index = mci

    def add(self, node: object) -> None:
        """
        Adds given object to MinHeap and maintains heap property.
        """
        # add node as last element and percolate up
        self.heap.append(node)
        self.perc_up(self.heap.length() - 1)

    def get_min(self) -> object:
        """
        Returns object with the minimum key without removing it from the heap.
        """

        # empty heap
        if self.is_empty():
            raise MinHeapException

        return self.heap[0]

    def remove_min(self) -> object:
        """
        Returns object with minimum key and removes it from the heap. If heap is empty
        raises MinHeapException
        """
        length = self.heap.length()

        # empty list
        if length <= 0:
            raise MinHeapException

        # save value
        heap_min = self.get_min()

        # if last node remove
        if length == 1:
            self.heap.pop()

        # replace min with last node and remove last node
        else:
            self.heap[0] = self.heap.pop()

        # percolate node down heap
        self.perc_down(0)

        return heap_min

    def build_heap(self, da: DynamicArray) -> None:
        """
        Takes a DynamicArray with objects in any order and builds a proper MinHeap from them.  
        Current content of the MinHeap is lost.  
        """

        # create new array and copy da elements
        new_heap = DynamicArray()
        for el in da:
            new_heap.append(el)
        self.heap = new_heap

        # find index of first none leaf node
        index = self.heap.length() // 2 - 1

        # move up the heap and percolate nodes down until minimum reached
        while index >= 0:
            self.perc_down(index)
            index -= 1


# BASIC TESTING
if __name__ == '__main__':

    print("\nPDF - add example 1")
    print("-------------------")
    h = MinHeap()
    print(h, h.is_empty())
    for value in range(300, 200, -15):
        h.add(value)
        print(h)

    print("\nPDF - add example 2")
    print("-------------------")
    h = MinHeap(['fish', 'bird'])
    print(h)
    for value in ['monkey', 'zebra', 'elephant', 'horse', 'bear']:
        h.add(value)
        print(h)

    print("\nPDF - get_min example 1")
    print("-----------------------")
    h = MinHeap(['fish', 'bird'])
    print(h)
    print(h.get_min(), h.get_min())

    print("\nPDF - remove_min example 1")
    print("--------------------------")
    h = MinHeap([1, 10, 2, 9, 3, 8, 4, 7, 5, 6])
    while not h.is_empty():
        print(h, end=' ')
        print(h.remove_min())

    print("\nPDF - build_heap example 1")
    print("--------------------------")
    da = DynamicArray([100, 20, 6, 200, 90, 150, 300])
    h = MinHeap(['zebra', 'apple'])
    print(h)
    h.build_heap(da)
    print(h)
    da.set_at_index(0, 500)
    print(da)
    print(h)
