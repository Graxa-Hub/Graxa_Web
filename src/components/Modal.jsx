import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children, totalSteps = 1, nextButtonText = "Próxima Etapa", showNavigation = true, onFinish }) {
    const [currentStep, setCurrentStep] = useState(1)

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1)
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        } else {
            if (onFinish) {
                onFinish()
            } else {
                onClose()
            }
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleClose = () => {
        setCurrentStep(1)
        onClose()
    }

    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl mx-4 min-h-80   h-fit relative overflow-x-hidden min-w-100 w-fit max-w-200">
                {/* Seta Anterior - Esquerda */}
                {currentStep > 1 && (
                    <button
                        onClick={handlePrevious}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 p-[1px] bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors z-10"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                )}

                {/* Seta Próximo - Direita */}
                {currentStep < totalSteps && (
                    <button
                        onClick={handleNext}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 p-[1px] bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors z-10"
                    >
                        <ChevronRight className="w-full h-full text-white" />
                    </button>
                )}

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex flex-col items-center flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>

                        {/* Indicadores de etapa */}
                        {showNavigation && totalSteps > 1 && (
                            <div className="flex items-center gap-2">
                                {[...Array(totalSteps)].map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-3 h-3 rounded-full transition-colors ${
                                            index + 1 === currentStep
                                                ? 'bg-red-500'
                                                : index + 1 < currentStep
                                            
                                                ? 'bg-gray-300': 'bg-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-16 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {typeof children === 'function' ? children(currentStep) : children}
                </div>

                {/* Footer com botão centrado */}
                {showNavigation && (
                    <div className="flex justify-center items-center px-16 py-6 border-t border-gray-200">
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            {currentStep === totalSteps ? 'Finalizar' : nextButtonText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}