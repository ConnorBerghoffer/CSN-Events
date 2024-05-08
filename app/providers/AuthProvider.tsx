import React, { useContext, useState } from 'react'


export default function AuthContextProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [role, setRole] = useState()
    const AuthContext = useContext(children)
    return (
        <>
            {children}
        </> 
    );
  }