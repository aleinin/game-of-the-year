import { dateStringToTwelveHourString } from '../time'

interface TestCase {
  input: string
  expected: string
}

describe('dateStringToTwelveHourString', () => {
  it('should convert iso 8601 date string a 12 hour string', () => {
    let testCases: TestCase[] = [
      {
        input: '2022-01-11T00:00:00',
        expected: '1/11/2022 12:00AM',
      },
      {
        input: '2022-12-01T23:59:00',
        expected: '12/1/2022 11:59PM',
      },
      {
        input: '2019-12-01T01:05:00',
        expected: '12/1/2019 1:05AM',
      },
      {
        input: '2022-12-01T12:09:00',
        expected: '12/1/2022 12:09PM',
      },
      {
        input: '2022-12-01T09:10:00',
        expected: '12/1/2022 9:10AM',
      },
    ]
    testCases.forEach(({ input, expected }) => {
      expect(dateStringToTwelveHourString(input)).toEqual(expected)
    })
  })
})
