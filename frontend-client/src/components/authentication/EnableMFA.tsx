import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, MoveRight } from 'lucide-react';
import Card from '../Card';
import { useMutation } from '@tanstack/react-query';

interface EnableMFAProps {
    onEnabled: (data: { qrCode: string | null; provisioningUri: string | null }) => void;
    initialQrCode?: string | null;
    initialProvisioningUri?: string | null;
}

const EnableMFA = ({ onEnabled, initialQrCode = null, initialProvisioningUri = null }: EnableMFAProps) => {
    const { initiateMfaSetup } = useAuth();
    const [qrCode, setQrCode] = useState<string | null>(initialQrCode);
    const [provisioningUri, setProvisioningUri] = useState<string | null>(initialProvisioningUri);
    const [errorMsg, setErrorMsg] = useState('');

    const enableMfaMutation = useMutation({
        mutationFn: () => initiateMfaSetup(),
        onSuccess: (result) => {
            if (result.success) {
                setQrCode(result.qrCode || null);
                setProvisioningUri(result.provisioningUri || null);
            } else {
                setErrorMsg(result.error || 'An error occurred.');
            }
        },
        onError: () => {
            setErrorMsg('An error occurred.');
        },
    });

    const handleEnableMfa = () => {
        setErrorMsg('');
        enableMfaMutation.mutate();
    };

    return (
        <div>
            {!qrCode ? (
                enableMfaMutation.status === 'pending' ? (
                    <Button disabled>
                        <Loader2 className="animate-spin" />
                        Loading...
                    </Button>
                ) : (
                    <Button onClick={handleEnableMfa}>Enable MFA</Button>
                )
            ) : (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl">Scan the QR Code on your authenticator app.</h2>
                    </div>
                    <div className="flex justify-center">
                        <Card className="md:w-2/3">
                            <img
                                src={`data:image/png;base64,${qrCode}`}
                                alt="MFA QR Code"
                                className="sm:w-full sm:h-full"
                            />
                        </Card>
                    </div>
                    <div className="space-y-2">
                        <p className="font-semibold">
                            If you cannot scan the QR code, enter the following code manually in your authenticator app:
                        </p>
                        <p className="break-all">{provisioningUri}</p>
                    </div>
                    <Button variant="outline" onClick={() => onEnabled({ qrCode, provisioningUri })}>
                        <MoveRight />Next
                    </Button>
                </div>
            )}
            {errorMsg && <div className="text-red-500">{errorMsg}</div>}
        </div>
    );
};

export default EnableMFA;
