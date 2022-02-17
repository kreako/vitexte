import { assert, describe, test } from "vitest"
import { addDelete, addSelect } from "./selection-model"

const leaf = (start: number, end: number) => ({
  start,
  end,
  left: null,
  right: null,
})

describe("Add a select to a single node", () => {
  test("empty model", () => {
    const model1 = { root: null }
    const model2 = addSelect(model1, 10, 20)
    assert.deepEqual(model2, {
      root: leaf(10, 20),
    })
  })

  test("already selected", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 12, 18)
    assert.deepEqual(model2, {
      root: leaf(10, 20),
    })
  })

  test("already selected - edge case", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 10, 20)
    assert.deepEqual(model2, {
      root: leaf(10, 20),
    })
  })

  test("bigger selection", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 8, 22)
    assert.deepEqual(model2, {
      root: leaf(8, 22),
    })
  })

  test("from the left", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 8, 12)
    assert.deepEqual(model2, {
      root: leaf(8, 20),
    })
  })

  test("from the left - edge case", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 8, 10)
    assert.deepEqual(model2, {
      root: leaf(8, 20),
    })
  })

  test("from the right", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 18, 22)
    assert.deepEqual(model2, {
      root: leaf(10, 22),
    })
  })

  test("from the right - edge case", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 20, 22)
    assert.deepEqual(model2, {
      root: leaf(10, 22),
    })
  })

  test("far left", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 2, 8)
    assert.deepEqual(model2, {
      root: {
        start: 2,
        end: 20,
        left: leaf(2, 8),
        right: leaf(10, 20),
      },
    })
  })

  test("far right", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 30, 40)
    assert.deepEqual(model2, {
      root: {
        start: 10,
        end: 40,
        left: leaf(10, 20),
        right: leaf(30, 40),
      },
    })
  })
})

describe("Add a select to a tree", () => {
  test("far right", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 30, 40)
    const model3 = addSelect(model2, 50, 60)
    assert.deepEqual(model3, {
      root: {
        start: 10,
        end: 60,
        left: {
          start: 10,
          end: 40,
          left: leaf(10, 20),
          right: leaf(30, 40),
        },
        right: leaf(50, 60),
      },
    })
  })

  test("far left", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 30, 40)
    const model3 = addSelect(model2, 2, 6)
    assert.deepEqual(model3, {
      root: {
        start: 2,
        end: 40,
        left: leaf(2, 6),
        right: {
          start: 10,
          end: 40,
          left: leaf(10, 20),
          right: leaf(30, 40),
        },
      },
    })
  })

  test("in middle - from left", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 30, 40)
    const model3 = addSelect(model2, 5, 10)
    assert.deepEqual(model3, {
      root: {
        start: 5,
        end: 40,
        left: leaf(5, 20),
        right: leaf(30, 40),
      },
    })
  })

  test("in middle - from right", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 30, 40)
    const model3 = addSelect(model2, 35, 45)
    assert.deepEqual(model3, {
      root: {
        start: 10,
        end: 45,
        left: leaf(10, 20),
        right: leaf(30, 45),
      },
    })
  })
})

describe("Add a delete node", () => {
  test("Add a delete node to an empty model should throw", () => {
    const model1 = { root: null }
    assert.throw(() => {
      addDelete(model1, 5, 6)
    })
  })

  test("Add a delete node to a leaf node far before should throw", () => {
    const model1 = { root: leaf(10, 20) }
    assert.throw(() => {
      addDelete(model1, 5, 6)
    })
  })

  test("Add a delete node to a leaf node far after should throw", () => {
    const model1 = { root: leaf(10, 20) }
    assert.throw(() => {
      addDelete(model1, 25, 26)
    })
  })

  test("Add a delete node to a leaf node - start of selection - edge case", () => {
    const model1 = { root: leaf(10, 20) }
    const model2 = addDelete(model1, 5, 10)
    assert.deepEqual(model2, {
      root: leaf(10, 20),
    })
  })

  test("Add a delete node to a leaf node - start of selection", () => {
    const model1 = { root: leaf(10, 20) }
    const model2 = addDelete(model1, 5, 15)
    assert.deepEqual(model2, {
      root: leaf(15, 20),
    })
  })

  test("Add a delete node to a leaf node - end of selection - edge case", () => {
    const model1 = { root: leaf(10, 20) }
    const model2 = addDelete(model1, 20, 25)
    assert.deepEqual(model2, {
      root: leaf(10, 20),
    })
  })

  test("Add a delete node to a leaf node - end of selection", () => {
    const model1 = { root: leaf(10, 20) }
    const model2 = addDelete(model1, 15, 25)
    assert.deepEqual(model2, {
      root: leaf(10, 15),
    })
  })
})
