import { Dropdown } from '../controls/Dropdown/Dropdown'

interface YearsProps {
  selectedYear: string
  handleYearChange: (year: string) => void
  yearOptions: string[]
}
export const Years = ({
  selectedYear,
  yearOptions,
  handleYearChange,
}: YearsProps) => {
  return (
    <Dropdown
      value={selectedYear}
      onChange={handleYearChange}
      options={yearOptions}
      accessorFn={(year: string) => year}
    />
  )
}
