import { Paginator } from '../Paginator'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const jumpLeft = 'jump-left'
const left = 'left'
const right = 'right'
const jumpRight = 'jump-right'

describe('Paginator', () => {
  it('should set index to 0 on jump left', async () => {
    const user = userEvent.setup()
    const setIndex = jest.fn()
    render(<Paginator setIndex={setIndex} totalPages={5} pageIndex={3} />)
    await user.click(screen.getByTestId(jumpLeft))
    expect(setIndex).toHaveBeenCalledWith(0)
  })

  it('should decrement index on left', async () => {
    const user = userEvent.setup()
    const setIndex = jest.fn()
    const index = 3
    render(<Paginator setIndex={setIndex} totalPages={5} pageIndex={index} />)
    await user.click(screen.getByTestId(left))
    expect(setIndex).toHaveBeenCalledWith(index - 1)
  })

  it('should inrement index on right', async () => {
    const user = userEvent.setup()
    const setIndex = jest.fn()
    const index = 3
    render(<Paginator setIndex={setIndex} totalPages={5} pageIndex={index} />)
    await user.click(screen.getByTestId(right))
    expect(setIndex).toHaveBeenCalledWith(index + 1)
  })

  it('should set index to size on jump right', async () => {
    const user = userEvent.setup()
    const setIndex = jest.fn()
    const totalPages = 5
    render(<Paginator setIndex={setIndex} totalPages={totalPages} pageIndex={3} />)
    await user.click(screen.getByTestId(jumpRight))
    expect(setIndex).toHaveBeenCalledWith(totalPages - 1)
  })

  it('shouldn\'t go out of bounds', async () => {
    const user = userEvent.setup()
    const setIndex = jest.fn()
    const totalPages = 5
    const {rerender} = render(<Paginator setIndex={setIndex} totalPages={totalPages} pageIndex={0} />)
    await user.click(screen.getByTestId(left))
    expect(setIndex).toHaveBeenLastCalledWith(0)
    rerender(<Paginator setIndex={setIndex} totalPages={totalPages} pageIndex={totalPages - 1} />)
    await user.click(screen.getByTestId(right))
    expect(setIndex).toHaveBeenLastCalledWith(totalPages - 1)
  })

  it('should display the current page', () => {
    render(<Paginator setIndex={jest.fn()} totalPages={5} pageIndex={3} />)
    screen.getByText('4 of 5')
  })
})
