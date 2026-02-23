/**
 * E2E tests for WalletSignatureIndicator component
 * Tests visual appearance, animations, and user interactions
 */

describe('WalletSignatureIndicator E2E', () => {
  beforeEach(() => {
    // Visit the demo page (adjust URL as needed)
    cy.visit('/demo/wallet-signature-indicator')
  })

  describe('Visual appearance', () => {
    it('should not be visible initially', () => {
      cy.get('.wallet-signature-indicator').should('not.exist')
    })

    it('should appear when transaction is pending', () => {
      // Trigger transaction
      cy.contains('button', 'Send Soroban Transaction').click()

      // Indicator should appear
      cy.get('.wallet-signature-indicator', { timeout: 1000 })
        .should('be.visible')
        .and('have.class', 'visible')
    })

    it('should display the orb with correct structure', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.wallet-signature-indicator').within(() => {
        cy.get('.orb-container').should('exist')
        cy.get('.orb').should('exist')
        cy.get('.orb-inner').should('exist')
        cy.get('.orb-glow').should('exist')
      })
    })

    it('should display status text', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.wallet-signature-indicator')
        .should('contain.text', 'Awaiting Ledger Authorization...')
    })

    it('should be positioned in bottom-right corner', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.wallet-signature-indicator').then(($el) => {
        const rect = $el[0].getBoundingClientRect()
        const viewportWidth = Cypress.config('viewportWidth')
        const viewportHeight = Cypress.config('viewportHeight')

        // Should be near bottom-right
        expect(rect.bottom).to.be.lessThan(viewportHeight)
        expect(rect.right).to.be.lessThan(viewportWidth)
        expect(rect.bottom).to.be.greaterThan(viewportHeight - 100)
        expect(rect.right).to.be.greaterThan(viewportWidth - 300)
      })
    })
  })

  describe('Animation behavior', () => {
    it('should have breathing animation on the orb', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.orb').then(($orb) => {
        const animation = $orb.css('animation-name')
        expect(animation).to.include('breathe')
      })
    })

    it('should have glow pulse animation', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.orb-glow').then(($glow) => {
        const animation = $glow.css('animation-name')
        expect(animation).to.include('pulse-glow')
      })
    })

    it('should animate entrance smoothly', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      // Check for transition properties
      cy.get('.wallet-signature-indicator').should(($el) => {
        const transition = $el.css('transition')
        expect(transition).to.include('opacity')
        expect(transition).to.include('transform')
      })
    })
  })

  describe('State transitions', () => {
    it('should disappear after transaction completes', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      // Wait for indicator to appear
      cy.get('.wallet-signature-indicator').should('be.visible')

      // Wait for transaction to complete (simulated delay)
      cy.wait(3000)

      // Indicator should disappear
      cy.get('.wallet-signature-indicator').should('not.exist')
    })

    it('should handle multiple transactions', () => {
      // First transaction
      cy.contains('button', 'Send Soroban Transaction').click()
      cy.get('.wallet-signature-indicator').should('be.visible')
      cy.wait(3000)
      cy.get('.wallet-signature-indicator').should('not.exist')

      // Second transaction
      cy.contains('button', 'Send Soroban Transaction').click()
      cy.get('.wallet-signature-indicator').should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.wallet-signature-indicator')
        .should('have.attr', 'role', 'status')
        .and('have.attr', 'aria-live', 'polite')
        .and('have.attr', 'aria-atomic', 'true')
    })

    it('should mark decorative elements as aria-hidden', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.orb').should('have.attr', 'aria-hidden', 'true')
    })

    it('should be keyboard accessible (non-blocking)', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      // Should still be able to tab through other elements
      cy.get('button').first().focus()
      cy.focused().should('exist')
    })
  })

  describe('Non-blocking behavior', () => {
    it('should not interfere with clicking other elements', () => {
      cy.contains('button', 'Send Soroban Transaction').click()
      cy.get('.wallet-signature-indicator').should('be.visible')

      // Should still be able to interact with page
      cy.get('body').click(100, 100)
      
      // Indicator should still be visible
      cy.get('.wallet-signature-indicator').should('be.visible')
    })

    it('should have pointer-events: none', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.wallet-signature-indicator').should(($el) => {
        const pointerEvents = $el.css('pointer-events')
        expect(pointerEvents).to.equal('none')
      })
    })
  })

  describe('Responsive behavior', () => {
    it('should be visible on mobile viewport', () => {
      cy.viewport('iphone-x')
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.wallet-signature-indicator').should('be.visible')
    })

    it('should adjust size on mobile', () => {
      cy.viewport('iphone-x')
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.orb-container').then(($container) => {
        const width = $container.width()
        expect(width).to.be.lessThan(48) // Smaller on mobile
      })
    })

    it('should be visible on tablet viewport', () => {
      cy.viewport('ipad-2')
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.wallet-signature-indicator').should('be.visible')
    })
  })

  describe('Performance', () => {
    it('should not cause layout shifts', () => {
      // Get initial layout
      cy.get('body').then(($body) => {
        const initialHeight = $body.height()

        // Trigger indicator
        cy.contains('button', 'Send Soroban Transaction').click()

        // Check layout hasn't shifted
        cy.get('body').should(($body) => {
          expect($body.height()).to.equal(initialHeight)
        })
      })
    })

    it('should use CSS animations (not JavaScript)', () => {
      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.orb').then(($orb) => {
        // Check that animation is CSS-based
        const computedStyle = window.getComputedStyle($orb[0])
        expect(computedStyle.animationName).to.not.equal('none')
        expect(computedStyle.animationDuration).to.not.equal('0s')
      })
    })
  })

  describe('Dark mode support', () => {
    it('should adapt to dark mode', () => {
      // Enable dark mode (implementation depends on your theme system)
      cy.get('html').invoke('attr', 'class', 'dark')

      cy.contains('button', 'Send Soroban Transaction').click()

      cy.get('.wallet-signature-indicator').should('be.visible')
      
      // Visual regression test could be added here
    })
  })

  describe('Reduced motion preference', () => {
    it('should respect prefers-reduced-motion', () => {
      // Set reduced motion preference
      cy.visit('/demo/wallet-signature-indicator', {
        onBeforeLoad(win) {
          Object.defineProperty(win, 'matchMedia', {
            writable: true,
            value: (query: string) => ({
              matches: query === '(prefers-reduced-motion: reduce)',
              media: query,
              onchange: null,
              addListener: () => {},
              removeListener: () => {},
              addEventListener: () => {},
              removeEventListener: () => {},
              dispatchEvent: () => true,
            }),
          })
        },
      })

      cy.contains('button', 'Send Soroban Transaction').click()

      // Animation should be disabled
      cy.get('.orb').should(($orb) => {
        const animation = window.getComputedStyle($orb[0]).animationName
        expect(animation).to.equal('none')
      })
    })
  })
})
