import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

const ConfirmHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirmEmail } = useAuth();

  useEffect(() => {
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    // If missing params, immediately go to login
    if (!uid || !token) {
      navigate('/login', { replace: true });
      return;
    }

    // Call the context’s confirmEmail and then redirect
    confirmEmail(uid, token)
      .finally(() => {
        toast('Your email has been confirmed. You can now log in.');
        navigate('/login', { replace: true });
      });
  }, [searchParams, confirmEmail, navigate]);

  // Render nothing—users don’t see an intermediate page
  return null;
};

export default ConfirmHandler;
