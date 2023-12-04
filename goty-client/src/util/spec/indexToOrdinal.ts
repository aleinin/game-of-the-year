import { indexToOrdinal } from '../indexToOrdinal'

it('should add ordinal to index', () => {
  const expected = [...(Array(24).keys() as any)].map(
    (index) => `${index + 1}th`,
  )
  expected[0] = '1st'
  expected[1] = '2nd'
  expected[2] = '3rd'
  expected[20] = '21st'
  expected[21] = '22nd'
  expected[22] = '23rd'
  const actual = [...(Array(24).keys() as any)].map((index) =>
    indexToOrdinal(index),
  )
  expect(actual).toEqual(expected)
})

it('should return empty string for bad input', () => {
  const badInput = [undefined, null, '1', 1.1, -1]
  badInput.forEach((input) => expect(indexToOrdinal(input)).toEqual(''))
})
