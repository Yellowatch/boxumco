import { useState } from 'react';
import EnableMFA from '@/components/authentication/EnableMFA';
import ConfirmMFA from '@/components/authentication/ConfirmMFA';
import DisableMFA from '@/components/authentication/DisableMFA';
import StepsIndicator from '@/components/StepsIndicator';
import { Button } from '@/components/ui/button';
import { MoveLeft } from 'lucide-react';

interface MFASetupProps {
    initialMfaEnabled: boolean;
}

interface EnableData {
    qrCode: string | null;
    provisioningUri: string | null;
}

const MFASetup = ({ initialMfaEnabled }: MFASetupProps) => {
    const [mfaEnabled, setMfaEnabled] = useState(initialMfaEnabled);
    const [step, setStep] = useState<'enable' | 'confirm' | 'disable'>(
        mfaEnabled ? 'disable' : 'enable'
    );
    const [enableData, setEnableData] = useState<EnableData>({ qrCode: null, provisioningUri: null });

    // Called when EnableMFA finishes (user clicks "Next")
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
        setStep('enable');
    };

    // Allow the user to go back from the confirm step to the enable step.
    const goBack = () => {
        setStep('enable');
    };

    return (
        <div>
            {/* Only show the steps indicator when in the "confirm" phase */}
            {step === 'confirm' && (
                <StepsIndicator steps={['Enable MFA', 'Confirm MFA']} currentStep={1} />
            )}

            {step === 'enable' && (
                <EnableMFA
                    onEnabled={handleEnabled}
                    initialQrCode={enableData.qrCode}
                    initialProvisioningUri={enableData.provisioningUri}
                />
            )}

            {step === 'confirm' && (
                <div>
                    <ConfirmMFA onConfirmed={handleConfirmed} />
                    <div className="flex justify-start mt-4">
                        <Button variant="outline" onClick={goBack}>
                            <MoveLeft /> Previous
                        </Button>
                    </div>
                </div>
            )}

            {step === 'disable' && <DisableMFA onDisabled={handleDisabled} />}
        </div>
    );
};

export default MFASetup;
