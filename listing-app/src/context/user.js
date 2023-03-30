import React, { useState } from 'react'

const UserContext = React.createContext({})

export function UserProvider(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    function logIn() {
        setIsLoggedIn(true)
    }

    function logout() {
        setIsLoggedIn(false)
    }
    return (
        <UserContext.Provider value={{
            isLoggedIn,
            logout,
            logIn
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext