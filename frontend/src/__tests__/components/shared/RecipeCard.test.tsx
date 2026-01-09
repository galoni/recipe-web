import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test-utils/render'
import { RecipeCard } from '@/components/shared/recipe-card'
import { Recipe } from '@/lib/types'

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Clock: () => <span data-testid="icon-clock" />,
    Users: () => <span data-testid="icon-users" />,
    Play: () => <span data-testid="icon-play" />,
    Trash2: () => <span data-testid="icon-trash" />,
    ChevronRight: () => <span data-testid="icon-chevron" />,
    Globe: () => <span data-testid="icon-globe" />,
    Lock: () => <span data-testid="icon-lock" />,
}))

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => <div className={className} onClick={onClick}>{children}</div>,
    },
}))

describe('RecipeCard', () => {
    const mockRecipe: Recipe = {
        id: '123',
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        thumbnail_url: 'https://example.com/image.jpg',
        prep_time_minutes: 10,
        cook_time_minutes: 20,
        servings: 4,
        is_public: true,
        ingredients: [],
        steps: [],
        video_url: 'https://youtube.com/watch?v=123',
        dietary_tags: [],
        created_at: new Date().toISOString(),
    }

    it('renders basic recipe information', () => {
        render(<RecipeCard recipe={mockRecipe} />)

        expect(screen.getByText('Test Recipe')).toBeInTheDocument()
        expect(screen.getByText('A delicious test recipe')).toBeInTheDocument()
        // Total time = 10 + 20 = 30m
        expect(screen.getByText('30m')).toBeInTheDocument()
        // Servings
        expect(screen.getByText('4')).toBeInTheDocument()
        // Public badge
        expect(screen.getByText('Public')).toBeInTheDocument()
        // Link to recipe
        expect(screen.getByRole('link', { name: /access vault/i })).toHaveAttribute('href', '/recipe/123')
    })

    it('renders placeholder for missing image', () => {
        const recipeNoImage = { ...mockRecipe, thumbnail_url: undefined }
        render(<RecipeCard recipe={recipeNoImage} />)
        expect(screen.getByTestId('icon-play')).toBeInTheDocument()
    })

    it('renders private status correctly', () => {
        const privateRecipe = { ...mockRecipe, is_public: false }
        render(<RecipeCard recipe={privateRecipe} />)
        expect(screen.getByText('Private')).toBeInTheDocument()
        expect(screen.getByTestId('icon-lock')).toBeInTheDocument()
    })

    it('calls onDelete when trash button is clicked', () => {
        const onDelete = vi.fn()
        render(<RecipeCard recipe={mockRecipe} onDelete={onDelete} />)

        // The buttons are hidden by default (opacity-0 group-hover:opacity-100)
        // Testing-library doesn't care about CSS opacity usually unless checkVisibility is used.
        // But we need to find the button. It might be hidden to user but present in DOM.
        const deleteButton = screen.getByTitle('Delete Recipe')
        fireEvent.click(deleteButton)

        expect(onDelete).toHaveBeenCalledWith('123')
    })

    it('calls onTogglePublic when toggle button is clicked', () => {
        const onTogglePublic = vi.fn()
        render(<RecipeCard recipe={mockRecipe} onTogglePublic={onTogglePublic} />)

        const toggleButton = screen.getByTitle('Make Private') // Since it is public
        fireEvent.click(toggleButton)

        expect(onTogglePublic).toHaveBeenCalledWith('123', true)
    })

    it('does not render delete button if onDelete is not provided', () => {
        render(<RecipeCard recipe={mockRecipe} />)
        expect(screen.queryByTitle('Delete Recipe')).not.toBeInTheDocument()
    })
})
