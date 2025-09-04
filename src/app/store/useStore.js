// store/useCounterStore.js
import { create } from 'zustand'

const useAppStore = create((set) => ({
  isLogined: false,
  auth_name: '' ,

  // Single function to set login data
  setLogin: (name) =>
    set({
      isLogined: true,
      auth_name: name
    }),

  // Logout function
  setLogout: () =>
    set({
      isLogined: false,
      auth_name: ''
    }),
}))

export default useAppStore
