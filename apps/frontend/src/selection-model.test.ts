import { assert, describe, test } from "vitest"
import { addDelete, addSelect, selectedState } from "./selection-model"

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

  test("in middle - middle", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addSelect(model1, 30, 40)
    const model3 = addSelect(model2, 22, 28)
    assert.deepEqual(model3, {
      root: {
        start: 10,
        end: 40,
        left: {
          start: 10,
          end: 28,
          left: leaf(10, 20),
          right: leaf(22, 28),
        },
        right: leaf(30, 40),
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

describe("Complex scenarii", () => {
  test("2 select, 2 delete", () => {
    const model1 = { root: null }
    const model2 = addSelect(model1, 4, 8)
    const model3 = addDelete(model2, 6.1, 6.8)
    const model4 = addSelect(model3, 11, 15)
    const model5 = addDelete(model4, 12.2, 12.9)
    assert.deepEqual(model5, {
      root: {
        start: 4,
        end: 15,
        left: {
          start: 4,
          end: 8,
          left: leaf(4, 6.1),
          right: leaf(6.8, 8),
        },
        right: {
          start: 11,
          end: 15,
          left: leaf(11, 12.2),
          right: leaf(12.9, 15),
        },
      },
    })
  })
})

describe("word state", () => {
  test("2 select, 2 delete", () => {
    const model1 = { root: null }
    const model2 = addSelect(model1, 4, 8)
    const model3 = addDelete(model2, 6.1, 6.8)
    const model4 = addSelect(model3, 11, 15)
    const model5 = addDelete(model4, 12.2, 12.9)

    assert.isFalse(selectedState(model5, 3, 3.9))
    assert.isTrue(selectedState(model5, 4.1, 4.9))
    assert.isFalse(selectedState(model5, 6.1, 6.8))
    assert.isTrue(selectedState(model5, 7.1, 7.8))

    assert.isFalse(selectedState(model5, 8.1, 10.8))
    assert.isTrue(selectedState(model5, 11, 12.2))
    assert.isFalse(selectedState(model5, 12.2, 12.9))
    assert.isTrue(selectedState(model5, 12.9, 15))
    assert.isFalse(selectedState(model5, 15.1, 15.9))
  })
})
