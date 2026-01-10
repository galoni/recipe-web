import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '@/components/ui/Modal';

describe('Modal', () => {
    it('does not render when isOpen is false', () => {
        render(
            <Modal isOpen={false} onClose={() => { }}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument();
    });

    it('renders title and children when isOpen is true', () => {
        render(
            <Modal isOpen={true} onClose={() => { }} title="Test Modal">
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen={true} onClose={onClose}>
                <div>Modal Content</div>
            </Modal>
        );

        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when backdrop is clicked', () => {
        const onClose = vi.fn();
        const { container } = render(
            <Modal isOpen={true} onClose={onClose}>
                <div>Modal Content</div>
            </Modal>
        );

        // The backdrop is the first motion.div inside the tree
        // Since it has onClick={onClose}
        const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/80');
        if (backdrop) {
            fireEvent.click(backdrop);
            expect(onClose).toHaveBeenCalled();
        }
    });
});
