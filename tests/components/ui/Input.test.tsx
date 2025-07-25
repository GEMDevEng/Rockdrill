import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils'
import { Input } from '../../../src/components/ui/Input'

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('border-gray-300')
  })

  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />)
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders with error state', () => {
    render(<Input error="This field is required" placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toHaveClass('border-red-500')
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('renders with success state', () => {
    render(<Input success placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toHaveClass('border-green-500')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Input size="sm" placeholder="Small" />)
    expect(screen.getByPlaceholderText('Small')).toHaveClass('px-3', 'py-1.5', 'text-sm')

    rerender(<Input size="md" placeholder="Medium" />)
    expect(screen.getByPlaceholderText('Medium')).toHaveClass('px-3', 'py-2')

    rerender(<Input size="lg" placeholder="Large" />)
    expect(screen.getByPlaceholderText('Large')).toHaveClass('px-4', 'py-3', 'text-lg')
  })

  it('handles value changes', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test value')
  })

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    render(
      <Input 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        placeholder="Enter text" 
      />
    )
    
    const input = screen.getByPlaceholderText('Enter text')
    
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />)
    
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('renders with different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Password" />)
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" placeholder="Number" />)
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number')
  })

  it('renders with prefix icon', () => {
    const PrefixIcon = () => <span data-testid="prefix-icon">@</span>
    render(<Input prefix={<PrefixIcon />} placeholder="Username" />)
    
    expect(screen.getByTestId('prefix-icon')).toBeInTheDocument()
  })

  it('renders with suffix icon', () => {
    const SuffixIcon = () => <span data-testid="suffix-icon">✓</span>
    render(<Input suffix={<SuffixIcon />} placeholder="Verified" />)
    
    expect(screen.getByTestId('suffix-icon')).toBeInTheDocument()
  })

  it('renders with help text', () => {
    render(<Input helpText="This is help text" placeholder="Enter text" />)
    
    expect(screen.getByText('This is help text')).toBeInTheDocument()
  })

  it('renders as required field', () => {
    render(<Input required label="Required Field" placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toHaveAttribute('required')
    expect(screen.getByText('Required Field')).toBeInTheDocument()
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} placeholder="Input with ref" />)
    
    expect(ref).toHaveBeenCalled()
  })

  it('renders with custom className', () => {
    render(<Input className="custom-input" placeholder="Custom input" />)
    
    const input = screen.getByPlaceholderText('Custom input')
    expect(input).toHaveClass('custom-input')
  })

  it('handles keyboard events', () => {
    const handleKeyDown = vi.fn()
    const handleKeyUp = vi.fn()
    render(
      <Input 
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="Keyboard input" 
      />
    )
    
    const input = screen.getByPlaceholderText('Keyboard input')
    
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
    
    fireEvent.keyUp(input, { key: 'Enter' })
    expect(handleKeyUp).toHaveBeenCalledTimes(1)
  })

  it('shows character count when maxLength is provided', () => {
    render(<Input maxLength={10} showCharCount placeholder="Limited input" />)
    
    expect(screen.getByText('0/10')).toBeInTheDocument()
    
    const input = screen.getByPlaceholderText('Limited input')
    fireEvent.change(input, { target: { value: 'test' } })
    
    expect(screen.getByText('4/10')).toBeInTheDocument()
  })

  it('validates input on blur when validation is provided', async () => {
    const validate = vi.fn().mockReturnValue('Invalid input')
    render(<Input validate={validate} placeholder="Validated input" />)
    
    const input = screen.getByPlaceholderText('Validated input')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.blur(input)
    
    await waitFor(() => {
      expect(validate).toHaveBeenCalledWith('test')
      expect(screen.getByText('Invalid input')).toBeInTheDocument()
    })
  })

  it('clears validation error when input becomes valid', async () => {
    const validate = vi.fn()
      .mockReturnValueOnce('Invalid input')
      .mockReturnValueOnce('')
    
    render(<Input validate={validate} placeholder="Validated input" />)
    
    const input = screen.getByPlaceholderText('Validated input')
    
    // First validation - invalid
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.blur(input)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid input')).toBeInTheDocument()
    })
    
    // Second validation - valid
    fireEvent.change(input, { target: { value: 'valid@email.com' } })
    fireEvent.blur(input)
    
    await waitFor(() => {
      expect(screen.queryByText('Invalid input')).not.toBeInTheDocument()
    })
  })
})
