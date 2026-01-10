import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DeleteConfirmation } from '@/components/shared/delete-confirmation';

describe('DeleteConfirmation', () => {
    it('does not render when isOpen is false', () => {
        render(
            <DeleteConfirmation
                isOpen={false}
                onClose={() => { }}
                onConfirm={() => { }}
                title="Test Recipe"
            />
        );
        expect(screen.queryByText(/delete recipe\?/i)).not.toBeInTheDocument();
    });

    it('renders recipe title when isOpen is true', () => {
        render(
            <DeleteConfirmation
                isOpen={true}
                onClose={() => { }}
                onConfirm={() => { }}
                title="Test Recipe"
            />
        );
        expect(screen.getByText(/delete recipe\?/i)).toBeInTheDocument();
        expect(screen.getByText(/are you sure you want to delete "Test Recipe"/i)).toBeInTheDocument();
    });

    it('calls onConfirm when delete button is clicked', () => {
        const onConfirm = vi.fn();
        render(
            <DeleteConfirmation
                isOpen={true}
                onClose={() => { }}
                onConfirm={onConfirm}
                title="Test Recipe"
            />
        );

        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);

        expect(onConfirm).toHaveBeenCalled();
    });

    it('shows "Deleting..." when isDeleting is true', () => {
        render(
            <DeleteConfirmation
                isOpen={true}
                onClose={() => { }}
                onConfirm={() => { }}
                title="Test Recipe"
                isDeleting={true}
            />
        );
        expect(screen.getByText(/deleting\.\.\./i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /deleting\.\.\./i })).toBeDisabled();
    });

    it('calls onClose when cancel button is clicked', () => {
        const onClose = vi.fn();
        render(
            <DeleteConfirmation
                isOpen={true}
                onClose={onClose}
                onConfirm={() => { }}
                title="Test Recipe"
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(onClose).toHaveBeenCalled();
    });
});
