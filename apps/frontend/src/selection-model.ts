type Node = {
  // word index in the words list - included in the selection
  start: number
  // word index in the words list - included in the selection
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

export const addWordsSelection = (
  model: SelectionModel,
  start: number,
  end: number
): SelectionModel => {
  return { root: _addWordsSelection(model.root, start, end) }
}

export const deleteWord = (model: SelectionModel, index: number): SelectionModel => {
  return { root: _deleteWord(model.root, index) }
}

export const selectedState = (model: SelectionModel, index: number): boolean =>
  _selectedState(model.root, index)

const _selectedState = (node: Node | null, index: number): boolean => {
  if (node == null) {
    return false
  }
  if (nodeIsLeaf(node)) {
    if (node.start <= index && index <= node.end) {
      return true
    } else {
      return false
    }
  } else {
    if (node.left && node.left.start <= index && index <= node.left.end) {
      return _selectedState(node.left, index)
    } else if (node.right && node.right.start <= index && index <= node.right.end) {
      return _selectedState(node.right, index)
    } else {
      return false
    }
  }
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

const _addWordsSelection = (root: Node | null, start: number, end: number): Node => {
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
    } else if (start <= root.start && end >= root.start - 1) {
      // extend selection by left
      root.start = start
      return root
    } else if (start <= root.end + 1 && root.end <= end) {
      // extend selection by right
      root.end = end
      return root
    } else if (end < root.start - 1) {
      // selection is far left, so split it in 2 different node
      root.left = newNode(start, end)
      root.right = newNode(root.start, root.end)
      root.start = start
      // root.end = root.end
      return root
    } else if (root.end + 1 < start) {
      // selection is far right, split it in 2 different node
      root.left = newNode(root.start, root.end)
      root.right = newNode(start, end)
      // root.start = root.start
      root.end = end
      return root
    }
  } else {
    if (root.end + 1 < start) {
      // Add something far right of the current one
      const newRoot = newNode(root.start, end)
      newRoot.left = root
      newRoot.right = newNode(start, end)
      return newRoot
    } else if (end < root.start - 1) {
      // Add something far left of the current one
      const newRoot = newNode(start, root.end)
      newRoot.left = newNode(start, end)
      newRoot.right = root
      return newRoot
    } else {
      // Will collide with the current tree
      if (
        root.left &&
        ((start >= root.left.start && start <= root.left.end + 1) ||
          (end >= root.left.start - 1 && end <= root.left.end))
      ) {
        // collides with the left child
        root.left = _addWordsSelection(root.left, start, end)
        root.start = root.left.start
      } else if (
        root.right &&
        ((start >= root.right.start && start <= root.right.end + 1) ||
          (end >= root.right.start - 1 && end <= root.right.end))
      ) {
        // collides with the right child
        root.right = _addWordsSelection(root.right, start, end)
        root.end = root.right.end
      } else {
        // In the middle of left and right child so let's add it to the lowest depth children
        const leftDepth = _nodeDepth(root.left)
        const rigtDepth = _nodeDepth(root.right)
        if (leftDepth > rigtDepth) {
          root.right = _addWordsSelection(root.right, start, end)
          root.end = root.right.end
        } else {
          root.left = _addWordsSelection(root.left, start, end)
          root.start = root.left.start
        }
      }
      // Now check if this part of the tree needs to be collapsed
      if (root.left && root.right && root.left.end + 1 >= root.right.start) {
        // Yes there is an overlap
        // So collapse and move everything up
        root.start = Math.min(root.left.start, root.right.start)
        root.end = Math.max(root.left.end, root.right.end)
        root.left = null
        root.right = null
      }
      return root
    }
  }
  throw Error(`Unreachable state in _addSelect : ${JSON.stringify(root)}, ${start}, ${end}`)
}

const _deleteWord = (root: Node | null, index: number): Node | null => {
  if (root == null) {
    throw new TreeError("Can't add a delete operation to a null node")
  }
  if (nodeIsLeaf(root)) {
    if (root.start < index && index < root.end) {
      // delete is in the middle of this node, so I need to split it
      root.left = newNode(root.start, index - 1)
      root.right = newNode(index + 1, root.end)
      return root
    } else if (index < root.start) {
      // delete operation is far before this node
      throw new TreeError(
        `Can't add a delete operation (${index}) before the node : (${root.start}, ${root.end})`
      )
    } else if (root.end < index) {
      // delete operation is far after this node
      throw new TreeError(
        `Can't add a delete operation (${index}) after the node : (${root.start}, ${root.end})`
      )
    } else if (root.start === index && root.end === index) {
      // Remove completly the selection
      return null
    } else if (index === root.start) {
      // remove the first part of this selection, keep the node but shortens it
      root.start = index + 1
      return root
    } else if (index === root.end) {
      // remove the last part of this selection, keep the node but shortens it
      root.end = index - 1
      return root
    }
  } else {
    // Where this delete operation will take place ?
    let inLeft = false
    let inRight = false
    if (root.left && root.left.start <= index && index <= root.left.end) {
      root.left = _deleteWord(root.left, index)
    } else if (root.right && root.right.start <= index && index <= root.right.end) {
      root.right = _deleteWord(root.right, index)
    } else {
      throw new TreeError(
        `Can't add a delete operation (${index})
        on left (${root.left?.start}, ${root.left?.end})
        or right (${root.right?.start}, ${root.right?.end}) node
        of root (${root.start}, ${root.end})`
      )
    }
    if (root.left == null && root.right == null) {
      // The whole node is now null
      root = null
    } else if (root.left == null && root.right != null) {
      // For typescript... I was obliged to add a root.right != null
      // root.right should be moved up
      root.start = root.right.start
      root.end = root.right.end
      root.left = null
      root.right = null
    } else if (root.left != null && root.right == null) {
      // For typescript... I was obliged to add a root.left != null
      // root.left should be moved up
      root.start = root.left.start
      root.end = root.left.end
      root.left = null
      root.right = null
    }
    return root
  }
  throw new Error(`Unreachable state in _addDelete : ${JSON.stringify(root)}, ${index}`)
}
