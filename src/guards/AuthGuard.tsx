// import { FullScreenLoader } from '@/components';
// import { useAuth } from '@/hooks/useAuth';
// import { ALL_ROUTES } from '@/types';
// import { FC, useLayoutEffect, useState } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const AuthGuard: FC = () => {
//   const [isLoading, setLoading] = useState<boolean>(true);
//   const { initAuth, isAuthenticated, isInitialized } = useAuth();

//   useLayoutEffect(() => {
//     if (!isInitialized) {
//       initAuth()
//         .then(() => {
//           setTimeout(() => {
//             setLoading(false);
//           });

//           setLoading(false);
//         })
//         .catch(() => {
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   if (isLoading || !isInitialized) {
//     return <FullScreenLoader />;
//   }

//   if (!isLoading && isInitialized && !isAuthenticated) {
//     return <Navigate to={ALL_ROUTES.HOMEPAGE} />;
//   }

//   return <Outlet />;
// };

// export default AuthGuard;
