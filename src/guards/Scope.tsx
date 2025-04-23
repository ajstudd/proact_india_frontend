// import { UserAuthResponsePayload } from '../types';
// import React, { PropsWithChildren, useEffect, useState } from 'react';

// interface ScopeProps {
//   scope: string;
// }

// const Scope = (props: PropsWithChildren<ScopeProps>) => {
//   const { children, scope } = props;
//   const [allow, setAllow] = useState<boolean>(false);

//   useEffect(() => {
//     const authData = localStorage.getItem('authData');
//     if (authData) {
//       const data = JSON.parse(authData) as UserAuthResponsePayload;
//       if (data?.user?.role?.scopes) {
//         const scopes = data.user.role.scopes;
//         if (!scopes.includes(scope)) {
//           setAllow(false);
//         } else {
//           setAllow(true);
//         }
//       }
//     }
//   }, []);

//   if (!allow) {
//     return null;
//   }

//   return <React.Fragment>{children}</React.Fragment>;
// };

// export default Scope;
