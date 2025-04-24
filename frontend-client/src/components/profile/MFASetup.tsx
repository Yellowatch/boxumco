import React, { useState } from 'react';
import EnableMFA from '@/components/authentication/EnableMFA';
import ConfirmMFA from '@/components/authentication/ConfirmMFA';
import DisableMFA from '@/components/authentication/DisableMFA';
import StepsIndicator from '@/components/StepsIndicator';
import { Button } from '@/components/ui/button';
import { MoveLeft, MoveRight } from 'lucide-react';

interface MFASetupProps {
    initialMfaEnabled: boolean;
}

interface EnableData {
    qrCode: string | null;
    provisioningUri: string | null;
}

const MFASetup: React.FC<MFASetupProps> = ({ initialMfaEnabled }) => {
    const [mfaEnabled, setMfaEnabled] = useState(initialMfaEnabled);
    const [step, setStep] = useState<'start' | 'enable' | 'confirm' | 'disable'>(
        mfaEnabled ? 'disable' : 'start'
    );
    const [enableData, setEnableData] = useState<EnableData>({ qrCode: null, provisioningUri: null });

    // Called when user clicks "Begin MFA Setup"
    const handleBegin = () => setStep('enable');

    // Called when EnableMFA finishes
    const handleEnabled = (data: EnableData) => {
        setEnableData(data);
        setStep('confirm');
    };

    // Called when ConfirmMFA is successful
    const handleConfirmed = () => {
        setMfaEnabled(true);
        setStep('disable');
    };

    // Called when MFA is disabled
    const handleDisabled = () => {
        setMfaEnabled(false);
        setStep('start');
    };

    // Allow the user to go back from confirm to enable
    const goBack = () => setStep('enable');

    return (
        <div>
            {/* Step 0: Initial begin button */}
            {step === 'start' && !mfaEnabled && (
                <Button onClick={handleBegin}>
                    <MoveRight className="mr-2" /> Enable MFA
                </Button>
            )}

            {/* Step 1: Enable MFA */}
            {step === 'enable' && (
                <>
                    <StepsIndicator steps={['Enable', 'Confirm']} currentStep={0} />
                    <EnableMFA
                        onEnabled={handleEnabled}
                        initialQrCode={enableData.qrCode}
                        initialProvisioningUri={enableData.provisioningUri}
                    />
                </>
            )}

            {/* Step 2: Confirm MFA */}
            {step === 'confirm' && (
                <>
                    <StepsIndicator steps={['Enable', 'Confirm']} currentStep={1} />
                    <ConfirmMFA onConfirmed={handleConfirmed} />
                    <div className="flex justify-start mt-4">
                        <Button variant="outline" onClick={goBack}>
                            <MoveLeft className="mr-2" /> Previous
                        </Button>
                    </div>
                </>
            )}

            {/* Step 3: Disable MFA */}
            {step === 'disable' && <DisableMFA onDisabled={handleDisabled} />}
        </div>
    );
};

export default MFASetup;
