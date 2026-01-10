import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SessionCard } from '@/components/security/SessionCard';

describe('SessionCard', () => {
    const mockSession = {
        id: '1',
        device_type: 'Desktop',
        browser_name: 'Chrome',
        browser_version: '120',
        os_name: 'Mac OS X',
        os_version: '10.15.7',
        ip_address: '127.0.0.1',
        location_city: 'London',
        location_country: 'UK',
        last_active_at: new Date().toISOString(),
        is_current: false,
    };

    it('renders session details', () => {
        render(<SessionCard session={mockSession} />);
        expect(screen.getByText(/chrome on mac os x/i)).toBeInTheDocument();
        expect(screen.getByText('127.0.0.1')).toBeInTheDocument();
        expect(screen.getByText(/london, uk/i)).toBeInTheDocument();
        expect(screen.getByText(/last active:/i)).toBeInTheDocument();
    });

    it('shows "Current Session" badge when is_current is true', () => {
        render(<SessionCard session={{ ...mockSession, is_current: true }} />);
        expect(screen.getByText(/current session/i)).toBeInTheDocument();
        // Should not show revoke button
        expect(screen.queryByTitle(/revoke access/i)).not.toBeInTheDocument();
    });

    it('calls onRevoke when revoke button is clicked', () => {
        const onRevoke = vi.fn();
        render(<SessionCard session={mockSession} onRevoke={onRevoke} />);

        const revokeButton = screen.getByTitle(/revoke access/i);
        fireEvent.click(revokeButton);

        expect(onRevoke).toHaveBeenCalledWith('1');
    });

    it('disables revoke button when isRevoking is true', () => {
        const onRevoke = vi.fn();
        render(<SessionCard session={mockSession} onRevoke={onRevoke} isRevoking={true} />);

        const revokeButton = screen.getByTitle(/revoke access/i);
        expect(revokeButton).toBeDisabled();
    });
});
