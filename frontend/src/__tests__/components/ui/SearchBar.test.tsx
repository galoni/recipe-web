import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test-utils/render'
import { SearchBar } from '@/components/ui/search-bar'

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Search: () => <span data-testid="icon-search" />,
    X: () => <span data-testid="icon-x" />,
    Loader2: () => <span data-testid="icon-loader" />,
}))

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('SearchBar', () => {
    it('renders correctly with placeholder', () => {
        render(<SearchBar placeholder="Test Placeholder" />)
        expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument()
        expect(screen.getByTestId('icon-search')).toBeInTheDocument()
    })

    it('updates value on change', () => {
        render(<SearchBar />)
        const input = screen.getByRole('textbox')
        fireEvent.change(input, { target: { value: 'pasta' } })
        expect(input).toHaveValue('pasta')
    })

    it('calls onSearch on submit', () => {
        const onSearch = vi.fn()
        render(<SearchBar onSearch={onSearch} />)

        const input = screen.getByRole('textbox')
        fireEvent.change(input, { target: { value: 'pasta' } })

        // Find form and submit
        const form = input.closest('form')!
        fireEvent.submit(form)

        expect(onSearch).toHaveBeenCalledWith('pasta')
    })

    it('clears input when clear button is clicked', () => {
        render(<SearchBar />)
        const input = screen.getByRole('textbox')
        fireEvent.change(input, { target: { value: 'pasta' } })
        expect(input).toHaveValue('pasta')

        const clearButton = screen.getByTestId('icon-x').closest('button')!
        fireEvent.click(clearButton)

        expect(input).toHaveValue('')
    })

    it('shows loader when isLoading is true', () => {
        render(<SearchBar isLoading={true} />)
        expect(screen.getByTestId('icon-loader')).toBeInTheDocument()
    })

    it('does not show loader when isLoading is false', () => {
        render(<SearchBar isLoading={false} />)
        expect(screen.queryByTestId('icon-loader')).not.toBeInTheDocument()
    })
})
