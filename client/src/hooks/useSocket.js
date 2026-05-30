import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useSocket = () => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const s = io(SOCKET_URL, { withCredentials: true })
    setSocket(s)
    return () => s.disconnect()
  }, [])

  return socket
}
