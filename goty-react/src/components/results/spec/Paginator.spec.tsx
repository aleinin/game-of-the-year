import { Paginator, PaginatorProps } from "../Paginator"
import { act } from "react-dom/test-utils"
import { render, unmountComponentAtNode } from "react-dom"

const jumpLeft = ".pi-angle-double-left"
const left = ".pi-angle-left"
const right = ".pi-angle-right"
const jumpRight = ".pi-angle-double-right"
let mockSetIndex: jest.Mock
let defaultProps: PaginatorProps
let container: any
beforeEach(() => {
  mockSetIndex = jest.fn()
  defaultProps = {
    setIndex: mockSetIndex,
    totalPages: 5,
    pageIndex: 3,
  }
  container = document.createElement("div")
  document.body.appendChild(container)
})

it("should set index to 0 on jump left", () => {
  act(() => {
    render(<Paginator {...defaultProps} />, container)
  })
  container.querySelector(jumpLeft).click()
  expect(mockSetIndex).toHaveBeenCalledWith(0)
})

it("should decrement index on left", () => {
  act(() => {
    render(<Paginator {...defaultProps} />, container)
  })
  container.querySelector(left).click()
  expect(mockSetIndex).toHaveBeenCalledWith(defaultProps.pageIndex - 1)
})

it("should inrement index on right", () => {
  act(() => {
    render(<Paginator {...defaultProps} />, container)
  })
  container.querySelector(right).click()
  expect(mockSetIndex).toHaveBeenCalledWith(defaultProps.pageIndex + 1)
})

it("should set index to size on jump right", () => {
  act(() => {
    render(<Paginator {...defaultProps} />, container)
  })
  container.querySelector(jumpRight).click()
  expect(mockSetIndex).toHaveBeenCalledWith(defaultProps.totalPages - 1)
})
it("shouldn't go out of bounds", () => {
  act(() => {
    render(<Paginator {...defaultProps} pageIndex={0} />, container)
  })
  container.querySelector(left).click()
  expect(mockSetIndex).toHaveBeenCalledWith(0)
  container.querySelector(jumpRight).click()
  container.querySelector(right).click()
  expect(mockSetIndex).toHaveBeenCalledWith(defaultProps.totalPages - 1)
})

it("should display the current page", () => {
  act(() => {
    render(<Paginator {...defaultProps} />, container)
  })
  const span: HTMLSpanElement = container.querySelector(
    `[data-testid="current-page"`
  )
  expect(span.innerHTML).toEqual(
    `${defaultProps.pageIndex + 1} of ${defaultProps.totalPages}`
  )
  container.querySelector(left).click()
})

afterEach(() => {
  unmountComponentAtNode(container)
  container.remove()
  container = null
})
