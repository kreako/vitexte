import { assert, describe, test } from "vitest"
import { deleteWord, addWordsSelection, selectedState, SelectionModel } from "./selection-model"

const leaf = (start: number, end: number) => ({
  start,
  end,
  left: null,
  right: null,
})

describe("Add a select to a single node", () => {
  test("empty model", () => {
    const model1 = { root: null }
    const model2 = addWordsSelection(model1, 10, 20)
    assert.deepEqual(model2, {
      root: leaf(10, 20),
    })
  })

  test("already selected", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addWordsSelection(model1, 12, 18)
    assert.deepEqual(model2, {
      root: leaf(10, 20),
    })
  })

  test("already selected - edge case", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addWordsSelection(model1, 10, 20)
    assert.deepEqual(model2, {
      root: leaf(10, 20),
    })
  })

  test("bigger selection", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addWordsSelection(model1, 8, 22)
    assert.deepEqual(model2, {
      root: leaf(8, 22),
    })
  })

  test("from the left", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addWordsSelection(model1, 8, 12)
    assert.deepEqual(model2, {
      root: leaf(8, 20),
    })
  })

  test("from the left - edge case", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addWordsSelection(model1, 8, 9)
    assert.deepEqual(model2, {
      root: leaf(8, 20),
    })
  })

  test("from the right", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addWordsSelection(model1, 18, 22)
    assert.deepEqual(model2, {
      root: leaf(10, 22),
    })
  })

  test("from the right - edge case", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addWordsSelection(model1, 21, 22)
    assert.deepEqual(model2, {
      root: leaf(10, 22),
    })
  })

  test("far left", () => {
    const model1 = { root: { start: 10, end: 20, left: null, right: null } }
    const model2 = addWordsSelection(model1, 2, 8)
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
    const model2 = addWordsSelection(model1, 30, 40)
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
    const model2 = addWordsSelection(model1, 30, 40)
    const model3 = addWordsSelection(model2, 50, 60)
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
    const model2 = addWordsSelection(model1, 30, 40)
    const model3 = addWordsSelection(model2, 2, 6)
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
    const model2 = addWordsSelection(model1, 30, 40)
    const model3 = addWordsSelection(model2, 5, 9)
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
    const model2 = addWordsSelection(model1, 30, 40)
    const model3 = addWordsSelection(model2, 41, 45)
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
    const model2 = addWordsSelection(model1, 30, 40)
    const model3 = addWordsSelection(model2, 22, 28)
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
      deleteWord(model1, 5)
    })
  })

  test("Add a delete node to a leaf node far before should throw", () => {
    const model1 = { root: leaf(10, 20) }
    assert.throw(() => {
      deleteWord(model1, 9)
    })
  })

  test("Add a delete node to a leaf node far after should throw", () => {
    const model1 = { root: leaf(10, 20) }
    assert.throw(() => {
      deleteWord(model1, 21)
    })
  })
  test("Add a delete node to a leaf node - remove it completely", () => {
    const model1 = { root: leaf(10, 10) }
    const model2 = deleteWord(model1, 10)
    assert.deepEqual(model2, {
      root: null,
    })
  })

  test("Add a delete node to a leaf node - start of selection - edge case", () => {
    const model1 = { root: leaf(10, 20) }
    const model2 = deleteWord(model1, 10)
    assert.deepEqual(model2, {
      root: leaf(11, 20),
    })
  })

  test("Add a delete node to a leaf node - middle of things", () => {
    const model1 = { root: leaf(10, 20) }
    const model2 = deleteWord(model1, 13)
    assert.deepEqual(model2, {
      root: {
        start: 10,
        end: 20,
        left: leaf(10, 12),
        right: leaf(14, 20),
      },
    })
  })

  test("Add a delete node to a leaf node - start of selection", () => {
    const model1 = { root: leaf(10, 20) }
    const model2 = deleteWord(model1, 10)
    const model3 = deleteWord(model2, 14)
    const model4 = deleteWord(model3, 13)
    const model5 = deleteWord(model4, 12)
    const model6 = deleteWord(model5, 11)
    assert.deepEqual(model6, {
      root: leaf(15, 20),
    })
  })

  test("Add a delete node to a leaf node - end of selection - edge case", () => {
    const model1 = { root: leaf(10, 20) }
    const model2 = deleteWord(model1, 20)
    assert.deepEqual(model2, {
      root: leaf(10, 19),
    })
  })

  test("Add a delete node to a leaf node - end of selection", () => {
    const model1 = { root: leaf(10, 20) }
    let model2 = deleteWord(model1, 20)
    model2 = deleteWord(model1, 16)
    model2 = deleteWord(model1, 17)
    model2 = deleteWord(model1, 18)
    model2 = deleteWord(model1, 19)
    assert.deepEqual(model2, {
      root: leaf(10, 15),
    })
  })
})

describe("Complex scenarii", () => {
  test("2 select, 2 delete", () => {
    const model1 = { root: null }
    const model2 = addWordsSelection(model1, 4, 8)
    const model3 = deleteWord(model2, 6)
    const model4 = addWordsSelection(model3, 11, 15)
    const model5 = deleteWord(model4, 12)
    assert.deepEqual(model5, {
      root: {
        start: 4,
        end: 15,
        left: {
          start: 4,
          end: 8,
          left: leaf(4, 5),
          right: leaf(7, 8),
        },
        right: {
          start: 11,
          end: 15,
          left: leaf(11, 11),
          right: leaf(13, 15),
        },
      },
    })
  })

  test("Merge 2 leafs if possible", () => {
    const model1 = { root: null }
    const model2 = addWordsSelection(model1, 4, 8)
    const model3 = deleteWord(model2, 6)
    assert.deepEqual(model3, {
      root: {
        start: 4,
        end: 8,
        left: leaf(4, 5),
        right: leaf(7, 8),
      },
    })
    const model4 = addWordsSelection(model3, 6, 6)
    assert.deepEqual(model4, {
      root: leaf(4, 8),
    })
  })

  test("Merge 2 leafs if possible - end move", () => {
    const model1 = { root: null }
    const model2 = addWordsSelection(model1, 4, 8)
    const model3 = deleteWord(model2, 6)
    assert.deepEqual(model3, {
      root: {
        start: 4,
        end: 8,
        left: leaf(4, 5),
        right: leaf(7, 8),
      },
    })
    const model4 = addWordsSelection(model3, 3, 9)
    assert.deepEqual(model4, {
      root: leaf(3, 9),
    })
  })

  test("Deep merge", () => {
    let model: SelectionModel = { root: null }
    model = addWordsSelection(model, 1, 1)
    model = addWordsSelection(model, 3, 3)
    model = addWordsSelection(model, 5, 5)
    model = addWordsSelection(model, 7, 7)
    model = addWordsSelection(model, 9, 9)
    model = addWordsSelection(model, 11, 11)
    model = addWordsSelection(model, 12, 12)
    model = addWordsSelection(model, 10, 10)
    model = addWordsSelection(model, 8, 8)
    model = addWordsSelection(model, 6, 6)
    model = addWordsSelection(model, 4, 4)
    model = addWordsSelection(model, 2, 2)
    assert.deepEqual(model, {
      root: leaf(1, 12),
    })
  })
})

describe("word state", () => {
  test("2 select, 2 delete", () => {
    const model1 = { root: null }
    const model2 = addWordsSelection(model1, 4, 8)
    const model3 = deleteWord(model2, 6)
    const model4 = addWordsSelection(model3, 11, 15)
    const model5 = deleteWord(model4, 12)

    assert.isFalse(selectedState(model5, 3))
    assert.isTrue(selectedState(model5, 4))
    assert.isTrue(selectedState(model5, 5))
    assert.isFalse(selectedState(model5, 6))
    assert.isTrue(selectedState(model5, 7))
    assert.isTrue(selectedState(model5, 8))
    assert.isFalse(selectedState(model5, 9))

    assert.isFalse(selectedState(model5, 10))
    assert.isTrue(selectedState(model5, 11))
    assert.isFalse(selectedState(model5, 12))
    assert.isTrue(selectedState(model5, 13))
    assert.isTrue(selectedState(model5, 14))
    assert.isTrue(selectedState(model5, 15))
    assert.isFalse(selectedState(model5, 16))
  })
})
