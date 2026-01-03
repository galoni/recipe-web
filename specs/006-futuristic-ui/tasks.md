# Task List - Futuristic UI (Feature 006)

## Foundation
- [ ] Install dependencies (`framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`) <!-- id: 0 -->
- [ ] Configure Tailwind with "Futuristic" palette (Deep backgrounds, Neon accents) <!-- id: 1 -->
- [ ] Update `globals.css` for dark default and base styles <!-- id: 2 -->
- [ ] Configure Typography (Inter/Space Grotesk) in `layout.tsx` <!-- id: 3 -->

## Core Components ("Glass" Kit)
- [ ] Create `components/ui/GlassCard.tsx` <!-- id: 4 -->
- [ ] Create `components/ui/NeonButton.tsx` <!-- id: 5 -->
- [ ] Create `components/ui/ModernInput.tsx` <!-- id: 6 -->
- [ ] Refactor `components/shared/Navbar.tsx` to use new design <!-- id: 7 -->

## Pages & Routing
- [ ] Create `app/(marketing)/page.tsx` (Landing Page) <!-- id: 8 -->
- [ ] Create `app/(app)/dashboard/page.tsx` (New Home for authenticated users) <!-- id: 9 -->
- [ ] Create `app/(app)/layout.tsx` (App-specific layout if needed) <!-- id: 10 -->
- [ ] Update root `layout.tsx` to handle providers and font injection <!-- id: 11 -->

## Integration & Logic
- [ ] Implement Auth Protection (Middleware or Layout check) <!-- id: 12 -->
- [ ] Migrate existing "Generate" logic to Dashboard <!-- id: 13 -->
- [ ] Verify Mobile Responsiveness <!-- id: 14 -->
