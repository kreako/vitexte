import { WordType } from "@vitexte/api"
import { roundToNearestMinutes } from "date-fns"

type Node = {
  start: number
  end: number
  left: Node | null
  right: Node | null
}

export type SelectionModel = {
  root: Node | null
}

const newNode = (start: number, end: number): Node => ({
  start,
  end,
  left: null,
  right: null,
})

const nodeIsLeaf = (node: Node): boolean => node.left == null && node.right == null

export const addSelect = (model: SelectionModel, start: number, end: number): SelectionModel => {
  return { root: _addSelect(model.root, start, end) }
}

export const addDelete = (model: SelectionModel, start: number, end: number): SelectionModel => {
  return { root: _addDelete(model.root, start, end) }
}

class TreeError extends Error {
  constructor(msg: string) {
    super(msg)
  }
}

export const _nodeDepth = (node: Node | null): number => {
  if (node == null) {
    return 0
  } else {
    return Math.max(_nodeDepth(node.left), _nodeDepth(node.right)) + 1
  }
}

const _addSelect = (root: Node | null, start: number, end: number): Node => {
  if (start > end) {
    throw new Error(`Invalid use of _addSelect start ${start} > end ${end}`)
  }
  if (root == null) {
    return newNode(start, end)
  }
  if (nodeIsLeaf(root)) {
    if (root.start <= start && end <= root.end) {
      // Nothing to do this is already in the node !
      return root
    } else if (start <= root.start && root.end <= end) {
      // This selection is bigger and contains the actual node
      root.start = start
      root.end = end
      return root
    } else if (start <= root.start && end >= root.start) {
      // extend selection by left
      root.start = start
      return root
    } else if (start <= root.end && root.end <= end) {
      // extend selection by right
      root.end = end
      return root
    } else if (end < root.start) {
      // selection is far left, so split it in 2 different node
      root.left = newNode(start, end)
      root.right = newNode(root.start, root.end)
      root.start = start
      // root.end = root.end
      return root
    } else if (root.end < start) {
      // selection is far right, split it in 2 different node
      root.left = newNode(root.start, root.end)
      root.right = newNode(start, end)
      // root.start = root.start
      root.end = end
      return root
    }
  } else {
    if (root.end < start) {
      // Add something far right of the current one
      const newRoot = newNode(root.start, end)
      newRoot.left = root
      newRoot.right = newNode(start, end)
      return newRoot
    } else if (end < root.start) {
      // Add something far left of the current one
      const newRoot = newNode(start, root.end)
      newRoot.left = newNode(start, end)
      newRoot.right = root
      return newRoot
    } else {
      // Will collide with the current tree
      if (
        root.left &&
        ((start >= root.left.start && start <= root.left.end) ||
          (end >= root.left.start && end <= root.left.end))
      ) {
        // collides with the left child
        root.left = _addSelect(root.left, start, end)
        root.start = root.left.start
        return root
      } else if (
        root.right &&
        ((start >= root.right.start && start <= root.right.end) ||
          (end >= root.right.start && end <= root.right.end))
      ) {
        // collides with the right child
        root.right = _addSelect(root.right, start, end)
        root.end = root.right.end
        return root
      } else {
        // In the middle of left and right child so let's add it to the lowest depth children
        const leftDepth = _nodeDepth(root.left)
        const rigtDepth = _nodeDepth(root.right)
        if (leftDepth > rigtDepth) {
          root.right = _addSelect(root.right, start, end)
          root.end = root.right.end
          return root
        } else {
          root.left = _addSelect(root.left, start, end)
          root.start = root.left.start
          return root
        }
      }
    }
  }
  throw Error(`Unreachable state in _addSelect : ${JSON.stringify(root)}, ${start}, ${end}`)
}

const _addDelete = (root: Node | null, start: number, end: number): Node | null => {
  if (start > end) {
    throw new Error(`Invalid use of _addDelete start ${start} > end ${end}`)
  }
  if (root == null) {
    throw new TreeError("Can't add a delete operation to a null node")
  }
  if (nodeIsLeaf(root)) {
    if (root.start < start && end < root.end) {
      // delete is in the middle of this node, so I need to split it
      root.left = newNode(root.start, start)
      root.right = newNode(end, root.end)
      return root
    } else if (root.start > start && root.start > end) {
      // delete operation is far before this node
      throw new TreeError(
        `Can't add a delete operation (${start}, ${end}) before the node : (${root.start}, ${root.end})`
      )
    } else if (root.end < start && root.end < end) {
      // delete operation is far after this node
      throw new TreeError(
        `Can't add a delete operation (${start}, ${end}) after the node : (${root.start}, ${root.end})`
      )
    } else if (root.start >= start && end < root.end) {
      // remove the first part of this selection, keep the node but shortens it
      root.start = end
      return root
    } else if (root.start < start && end >= root.end) {
      // remove the last part of this selection, keep the node but shortens it
      root.end = start
      return root
    } else if (root.start === start && root.end === end) {
      // Remove completly the selection
      return null
    }
  } else {
    // Where this delete operation will take place ?
    let inLeft = false
    let inRight = false
    if (root.left) {
      // left node is present, try it
      inLeft = true
      try {
        root.left = _addDelete(root.left, start, end)
      } catch (error) {
        if (error instanceof TreeError) {
          inLeft = false
        } else {
          throw error
        }
      }
    }
    if (root.right) {
      // right node is present try it
      inRight = true
      try {
        root.right = _addDelete(root.right, start, end)
      } catch (error) {
        if (error instanceof TreeError) {
          inRight = false
        } else {
          throw error
        }
      }
    }
    if (inLeft || inRight) {
      return root
    } else {
      throw new TreeError(
        `Can't add a delete operation (${start}, ${end})
        on left (${root.left?.start}, ${root.left?.end})
        or right (${root.right?.start}, ${root.right?.end}) node
        of root (${root.start}, ${root.end})`
      )
    }
  }
  throw new Error(`Unreachable state in _addDelete : ${JSON.stringify(root)}, ${start}, ${end}`)
}
