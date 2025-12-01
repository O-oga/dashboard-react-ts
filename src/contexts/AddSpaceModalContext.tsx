import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { SpaceIconTypes } from '@/types/Icons.types'

type SpacePreview = {
  name: string
  description: string
  icon: SpaceIconTypes
}

type AddSpaceModalContextType = {
  isOpen: boolean
  openAddSpaceModal: () => void
  closeAddSpaceModal: () => void
  spacePreview: SpacePreview | null
  setSpacePreview: (preview: SpacePreview | null) => void
}

const AddSpaceModalContext = createContext<AddSpaceModalContextType | undefined>(undefined)

export const AddSpaceModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [spacePreview, setSpacePreview] = useState<SpacePreview | null>(null)

  const openAddSpaceModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeAddSpaceModal = useCallback(() => {
    setIsOpen(false)
    // Reset preview when closing
    setSpacePreview(null)
  }, [])

  const handleSetSpacePreview = useCallback((preview: SpacePreview | null) => {
    setSpacePreview(preview)
  }, [])

  return (
    <AddSpaceModalContext.Provider
      value={{
        isOpen,
        openAddSpaceModal,
        closeAddSpaceModal,
        spacePreview,
        setSpacePreview: handleSetSpacePreview,
      }}
    >
      {children}
    </AddSpaceModalContext.Provider>
  )
}

export const useAddSpaceModal = () => {
  const context = useContext(AddSpaceModalContext)
  if (context === undefined) {
    throw new Error('useAddSpaceModal must be used within an AddSpaceModalProvider')
  }
  return context
}

