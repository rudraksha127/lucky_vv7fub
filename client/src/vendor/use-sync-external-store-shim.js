// ESM wrapper for use-sync-external-store/shim
// Re-exports useSyncExternalStore from React 19 (which has it built-in)
// Vite aliases use-sync-external-store/shim → this file
import { useSyncExternalStore } from 'react'
export { useSyncExternalStore }
export default useSyncExternalStore
