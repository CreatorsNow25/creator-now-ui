import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PasswordProtection from '@/components/PasswordProtection';

const AccessGate = () => {
  const [hasAccess, setHasAccess] = useState(
    () => sessionStorage.getItem('creators-access') === 'true'
  );

  if (!hasAccess) {
    return (
      <PasswordProtection
        onAuthenticated={() => {
          sessionStorage.setItem('creators-access', 'true');
          setHasAccess(true);
        }}
      />
    );
  }

  return <Outlet />;
};

export default AccessGate;