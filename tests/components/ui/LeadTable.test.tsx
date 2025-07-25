import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils'
import { LeadTable } from '../../../src/components/ui/LeadTable'
import { mockLead } from '../../utils/test-utils'

const mockLeads = [
  { ...mockLead, id: 1, email: 'lead1@example.com', first_name: 'John', last_name: 'Doe' },
  { ...mockLead, id: 2, email: 'lead2@example.com', first_name: 'Jane', last_name: 'Smith' },
  { ...mockLead, id: 3, email: 'lead3@example.com', first_name: 'Bob', last_name: 'Johnson' },
]

describe('LeadTable Component', () => {
  const defaultProps = {
    leads: mockLeads,
    loading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onView: vi.fn(),
    onSort: vi.fn(),
    sortField: 'created_at' as const,
    sortDirection: 'desc' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders table with lead data', () => {
    render(<LeadTable {...defaultProps} />)
    
    // Check table headers
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Company')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
    
    // Check lead data
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    expect(screen.getByText('lead1@example.com')).toBeInTheDocument()
    expect(screen.getByText('lead2@example.com')).toBeInTheDocument()
    expect(screen.getByText('lead3@example.com')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<LeadTable {...defaultProps} loading={true} />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows empty state when no leads', () => {
    render(<LeadTable {...defaultProps} leads={[]} />)
    
    expect(screen.getByText(/no leads found/i)).toBeInTheDocument()
    expect(screen.getByText(/add your first lead/i)).toBeInTheDocument()
  })

  it('handles sorting by clicking column headers', () => {
    render(<LeadTable {...defaultProps} />)
    
    const nameHeader = screen.getByText('Name')
    fireEvent.click(nameHeader)
    
    expect(defaultProps.onSort).toHaveBeenCalledWith('first_name')
  })

  it('shows sort indicators', () => {
    render(<LeadTable {...defaultProps} sortField="first_name" sortDirection="asc" />)
    
    const nameHeader = screen.getByText('Name')
    expect(nameHeader.closest('th')).toHaveClass('sorted-asc')
  })

  it('handles view action', () => {
    render(<LeadTable {...defaultProps} />)
    
    const viewButtons = screen.getAllByText(/view/i)
    fireEvent.click(viewButtons[0])
    
    expect(defaultProps.onView).toHaveBeenCalledWith(mockLeads[0])
  })

  it('handles edit action', () => {
    render(<LeadTable {...defaultProps} />)
    
    const editButtons = screen.getAllByText(/edit/i)
    fireEvent.click(editButtons[0])
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockLeads[0])
  })

  it('handles delete action with confirmation', async () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    
    render(<LeadTable {...defaultProps} />)
    
    const deleteButtons = screen.getAllByText(/delete/i)
    fireEvent.click(deleteButtons[0])
    
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this lead?')
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockLeads[0])
    
    confirmSpy.mockRestore()
  })

  it('cancels delete action when not confirmed', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    
    render(<LeadTable {...defaultProps} />)
    
    const deleteButtons = screen.getAllByText(/delete/i)
    fireEvent.click(deleteButtons[0])
    
    expect(confirmSpy).toHaveBeenCalled()
    expect(defaultProps.onDelete).not.toHaveBeenCalled()
    
    confirmSpy.mockRestore()
  })

  it('displays lead status badges', () => {
    const leadsWithDifferentStatuses = [
      { ...mockLead, id: 1, status: 'NEW' },
      { ...mockLead, id: 2, status: 'CONTACTED' },
      { ...mockLead, id: 3, status: 'QUALIFIED' },
    ]
    
    render(<LeadTable {...defaultProps} leads={leadsWithDifferentStatuses} />)
    
    expect(screen.getByText('NEW')).toBeInTheDocument()
    expect(screen.getByText('CONTACTED')).toBeInTheDocument()
    expect(screen.getByText('QUALIFIED')).toBeInTheDocument()
  })

  it('handles row selection', () => {
    const onSelectionChange = vi.fn()
    render(<LeadTable {...defaultProps} onSelectionChange={onSelectionChange} />)
    
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1]) // First lead checkbox (index 0 is select all)
    
    expect(onSelectionChange).toHaveBeenCalledWith([mockLeads[0].id])
  })

  it('handles select all functionality', () => {
    const onSelectionChange = vi.fn()
    render(<LeadTable {...defaultProps} onSelectionChange={onSelectionChange} />)
    
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(selectAllCheckbox)
    
    expect(onSelectionChange).toHaveBeenCalledWith([1, 2, 3])
  })

  it('shows bulk actions when leads are selected', () => {
    render(<LeadTable {...defaultProps} selectedLeads={[1, 2]} />)
    
    expect(screen.getByText(/2 leads selected/i)).toBeInTheDocument()
    expect(screen.getByText(/bulk actions/i)).toBeInTheDocument()
  })

  it('filters leads by search term', () => {
    render(<LeadTable {...defaultProps} searchTerm="John" />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
  })

  it('shows pagination when enabled', () => {
    const paginationProps = {
      ...defaultProps,
      pagination: {
        page: 1,
        size: 10,
        total: 50,
        onPageChange: vi.fn(),
        onSizeChange: vi.fn(),
      },
    }
    
    render(<LeadTable {...paginationProps} />)
    
    expect(screen.getByText(/showing 1-10 of 50/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    render(<LeadTable {...defaultProps} />)
    
    const firstRow = screen.getByText('John Doe').closest('tr')
    firstRow?.focus()
    
    fireEvent.keyDown(firstRow!, { key: 'Enter' })
    expect(defaultProps.onView).toHaveBeenCalledWith(mockLeads[0])
  })

  it('shows lead details in expandable rows', () => {
    render(<LeadTable {...defaultProps} expandable />)
    
    const expandButtons = screen.getAllByRole('button', { name: /expand/i })
    fireEvent.click(expandButtons[0])
    
    expect(screen.getByText(/lead details/i)).toBeInTheDocument()
  })

  it('exports selected leads', () => {
    const onExport = vi.fn()
    render(<LeadTable {...defaultProps} selectedLeads={[1, 2]} onExport={onExport} />)
    
    const exportButton = screen.getByText(/export/i)
    fireEvent.click(exportButton)
    
    expect(onExport).toHaveBeenCalledWith([1, 2])
  })

  it('handles column visibility toggle', () => {
    render(<LeadTable {...defaultProps} />)
    
    const columnToggle = screen.getByRole('button', { name: /columns/i })
    fireEvent.click(columnToggle)
    
    expect(screen.getByText(/show\/hide columns/i)).toBeInTheDocument()
  })
})
