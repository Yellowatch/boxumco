import React from 'react';

interface StepsIndicatorProps {
    steps: string[];
    currentStep: number;
}

const StepsIndicator = ({ steps, currentStep }: StepsIndicatorProps) => {
    return (
        <div className='flex justify-center w-full'>
            <div className="flex items-center w-full md:w-3/4">
                {steps.map((label, index) => {
                    // A step is completed if its index is less than currentStep
                    const isCompleted = index < currentStep;
                    // A step is active if its index equals currentStep
                    const isActive = index === currentStep;
                    // Make the line green if the user has passed this step
                    const isLineGreen = index + 1 <= currentStep;

                    return (
                        <React.Fragment key={index}>
                            {/* Circle */}
                            <div
                                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold
                ${isCompleted
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : isActive
                                            ? 'bg-primary-dark border-blue-500 text-white'
                                            : 'bg-gray-200 border-gray-300 text-gray-500'
                                    }
              `}
                            >
                                {index + 1}
                            </div>

                            {/* Connecting line (except after the last circle) */}
                            {index !== steps.length - 1 && (
                                <div
                                    className={`flex-1 h-1 ${isLineGreen ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default StepsIndicator;
