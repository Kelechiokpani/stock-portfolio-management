'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, ArrowRight, Copy, Share2 } from 'lucide-react'

interface PortfolioTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectType: (type: 'inherit' | 'transfer') => void
}

export function PortfolioTypeModal({ isOpen, onClose, onSelectType }: PortfolioTypeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-card border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Create New Portfolio</h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded transition">
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <div className="p-8">
          <p className="text-muted-foreground mb-8 text-center">
            Choose how you'd like to create your new portfolio
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Inherit Portfolio Option */}
            <button
              onClick={() => {
                onSelectType('inherit')
                onClose()
              }}
              className="group"
            >
              <Card className="bg-secondary border-border h-full p-6 hover:border-primary transition cursor-pointer">
                <div className="flex flex-col h-full">
                  <div className="mb-4 p-3 bg-card rounded-lg w-fit group-hover:bg-primary/20 transition">
                    <Copy className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2 text-left">
                    Inherit Portfolio
                  </h3>

                  <p className="text-muted-foreground text-sm text-left mb-6 flex-1">
                    Copy an existing portfolio from another investor. Perfect for duplicating successful strategies.
                  </p>

                  <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Card>
            </button>

            {/* Transfer Portfolio Option */}
            <button
              onClick={() => {
                onSelectType('transfer')
                onClose()
              }}
              className="group"
            >
              <Card className="bg-secondary border-border h-full p-6 hover:border-primary transition cursor-pointer">
                <div className="flex flex-col h-full">
                  <div className="mb-4 p-3 bg-card rounded-lg w-fit group-hover:bg-primary/20 transition">
                    <Share2 className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2 text-left">
                    Transfer Portfolio
                  </h3>

                  <p className="text-muted-foreground text-sm text-left mb-6 flex-1">
                    Receive or transfer a portfolio from another investor. Requires approval from the portfolio owner.
                  </p>

                  <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Card>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              You can also create a blank portfolio from the form that appears below these options.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
