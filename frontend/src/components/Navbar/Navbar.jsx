import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

const Navbar = () => {

    const [authObject, setAuthObject] = useState(null)

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('user'))) {
            setAuthObject(JSON.parse(localStorage.getItem('user')))
        }
    }, [])

  return (
    <div>Navbar{"  "}
        {authObject ? ' | Logged in as ' + authObject.username : 'Not logged in' }
    </div>
  )
}

export default Navbar