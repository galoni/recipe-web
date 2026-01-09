import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test-utils/render'
import { FeatureCard } from '@/components/ui/feature-card'
import { Zap } from 'lucide-react'

describe('FeatureCard', () => {
    it('renders title and description', () => {
        render(
            <FeatureCard
                icon={Zap}
                title="Super Fast"
                description="This feature is blazingly fast."
            />
        )

        expect(screen.getByText('Super Fast')).toBeInTheDocument()
        expect(screen.getByText('This feature is blazingly fast.')).toBeInTheDocument()
    })
})
