import reduce from '../../reducers/index'
import Immutable from 'immutable'

describe("replace", function() {
  describe("when the version is greater than the local version", function() {
    it("replaces the full state with some new state", function() {
      const result = reduce(Immutable.fromJS({version: 5, foo: "bar"}), {type: "REPLACE_STATE", state: {version: 6, bar: "baz"}})
      expect(result.get("bar")).toEqual("baz")
    })
  })

  describe("when the version is not greater than the local version", function() {
    it("does not replace the state", function() {
      const result = reduce(Immutable.fromJS({version: 5, foo: "bar"}), {type: "REPLACE_STATE", state: {version: 5, bar: "baz"}})
      expect(result.get("foo")).toEqual("bar")
      expect(result.get("bar")).toEqual(undefined)
    })
  })
})

describe("assignments", function() {
  describe("drop", function() {
    it("re-assigns the card to the target row", function() {
      const result = reduce(Immutable.fromJS({
          assignments: {
            "some-row": []
          }
      }), {type: "DROP_CARD", card: "julz", target: "some-row"})

      expect(result.get("assignments").get("some-row")).toContain("julz")
    })

    it("creates a new row if necessary", function() {
      const result = reduce(Immutable.fromJS({}), {type: "DROP_CARD", card: "julz", target: "some-row"})
      expect(result.get("assignments").get("some-row")).toContain("julz")
    })

    it("keeps existing cards in the assigned row", function() {
      const result = reduce(Immutable.fromJS({
        assignments: {"some-row": ["zyu", "gareth"]}
      }), {type: "DROP_CARD", card: "julz", target: "some-row"})

      expect(result.get("assignments").get("some-row")).toContain("zyu", "gareth")
    })

    it("removes the card from other rows", function() {
      const result = reduce(Immutable.fromJS({
        assignments: {
           "other-row": ["svett", "julz"],
           "some-row": ["zyu", "gareth"],
           "one-more": ["julz", "popeye"],
        }}),
        {type: "DROP_CARD", card: "julz", target: "some-row"}
      )

      expect(result.get("assignments").get("other-row")).not.toContain("julz")
      expect(result.get("assignments").get("one-more")).not.toContain("julz")
    })
  })
})

describe("badges", function() {
  describe("drop", function() {
    it("re-assigns the badge to the target row", function() {
      const result = reduce(Immutable.fromJS({
          badges: {
            "some-row": []
          }
      }), {type: "DROP_BADGE", badge: "ci", target: "some-row"})

      expect(result.get("badges").get("some-row")).toContain("ci")
    })

    it("creates a new row if necessary", function() {
      const result = reduce(Immutable.fromJS({}), {
        type: "DROP_BADGE",
        badge: "ci",
        target: "some-row"
      })

      expect(result.get("badges").get("some-row")).toContain("ci")
    })

    it("keeps existing badges in the assigned row", function() {
      const result = reduce(Immutable.fromJS({
        badges: {"some-row": ["a", "b"]}
      }), {type: "DROP_BADGE", badge: "ci", target: "some-row"})

      expect(result.get("badges").get("some-row")).toContain("a", "b")
    })

    it("removes the card from other rows", function() {
      const result = reduce(Immutable.fromJS({
        badges: {
           "other-row": ["c", "ci"],
           "some-row": ["a", "b"],
           "one-more": ["ci", "e"],
        }}),

        {type: "DROP_BADGE", badge: "ci", target: "some-row"}
      )

      expect(result.get("badges").get("other-row")).not.toContain("ci")
      expect(result.get("badges").get("one-more")).not.toContain("ci")
    })
  })
})
