import { Dropdown } from '../controls/Dropdown/Dropdown'
import React from 'react'

interface YearsProps {
  selectedYear: number
  handleYearChange: (year: number) => void
  yearOptions: number[]
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
      accessorFn={(num: number) => num.toString()}
    />
  )
}
