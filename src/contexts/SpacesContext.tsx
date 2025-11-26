import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Action, Space, SpacesState } from '@/types/space.types'
import type { Card } from '@/types/card.types'
import { saveSpaces, getSpaces } from '@/modules/loader'

type SpacesContextType = {
  spaces: Space[]
  currentSpaceId: number | null
  setCurrentSpaceId: (id: number) => void
  dispatch: React.Dispatch<Action>
  addSpace: (space: Space) => void
  removeSpace: (id: number) => void
  changeSpace: (space: Space) => void
  addCard: (spaceId: number, card: Card) => void
  removeCard: (spaceId: number, cardId: number) => void
}

/**
 * Reducer function for managing spaces state
 */
const spacesReducer = (state: SpacesState, action: Action): SpacesState => {
  switch (action.type) {
    case 'loadSpaces':
      return action.state
    case 'changeSpace':
      return {
        ...state,
        spaces: state.spaces.map(s =>
          s.id === action.space.id ? action.space : s
        ),
      }
    case 'addSpace':
      return { ...state, spaces: [...state.spaces, action.space] }
    case 'removeSpace':
      return { ...state, spaces: state.spaces.filter(s => s.id !== action.id) }
    case 'addCard':
      return {
        ...state,
        spaces: state.spaces.map(s =>
          s.id === action.spaceId
            ? { ...s, cards: [...s.cards, action.card] }
            : s
        ),
      }
    case 'removeCard':
      return {
        ...state,
        spaces: state.spaces.map(s =>
          s.id === action.spaceId
            ? { ...s, cards: s.cards.filter(c => c.id !== action.cardId) }
            : s
        ),
      }
    default:
      return state
  }
}

/**
 * Initialize spaces state from localStorage or return empty state
 */
const getInitialSpacesState = (): SpacesState => {
  const savedSpaces = getSpaces()
  if (savedSpaces && Array.isArray(savedSpaces.spaces)) {
    return savedSpaces
  }
  return { spaces: [] }
}

const SpacesContext = createContext<SpacesContextType | null>(null)

/**
 * Provider component for Spaces context
 */
export const SpacesProvider = ({ children }: { children: ReactNode }) => {
  const [spacesState, dispatch] = useReducer(
    spacesReducer,
    undefined,
    getInitialSpacesState
  )
  const [currentSpaceId, setCurrentSpaceId] = useState<number | null>(null)
  const hasLoadedRef = useRef(false)
  const prevSpacesStateRef = useRef<SpacesState | null>(null)

  // Auto-select first space
  useEffect(() => {
    if (spacesState.spaces.length > 0 && currentSpaceId === null) {
      const firstSpace = [...spacesState.spaces].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      )[0]
      if (firstSpace) {
        setCurrentSpaceId(firstSpace.id)
      }
    }
  }, [])

  // Save data to localStorage whenever spaces state changes
  useEffect(() => {
    // Skip saving on initial mount
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      prevSpacesStateRef.current = spacesState
      return
    }

    if (
      prevSpacesStateRef.current &&
      JSON.stringify(prevSpacesStateRef.current) !== JSON.stringify(spacesState)
    ) {
      saveSpaces(spacesState)
      prevSpacesStateRef.current = spacesState
    }
  }, [spacesState])

  const addSpace = useCallback((space: Space) => {
    dispatch({
      type: 'addSpace',
      space: {
        id: space.id,
        title: space.title,
        description: space.description,
        icon: space.icon,
        cards: space.cards ?? [],
        order: space.order,
      },
    })
    setCurrentSpaceId(space.id)
  }, [])

  const removeSpace = useCallback((id: number) => {
    dispatch({ type: 'removeSpace', id })
    if (currentSpaceId === id && spacesState.spaces.length > 2) {
      setCurrentSpaceId(
        [...spacesState.spaces].sort((a, b) => a.order - b.order)[0].id
      )
    } else if (spacesState.spaces.length === 1) {
      setCurrentSpaceId(spacesState.spaces[0].id)
    } else if (spacesState.spaces.length === 0) {
      setCurrentSpaceId(null)
    }
  }, [])

  const changeSpace = useCallback((space: Space) => {
    dispatch({ type: 'changeSpace', space })
    if (currentSpaceId === space.id) {
      setCurrentSpaceId(space.id)
    }
  }, [])

  const addCard = useCallback((spaceId: number, card: Card) => {
    dispatch({ type: 'addCard', spaceId, card })
  }, [])

  const removeCard = useCallback((spaceId: number, cardId: number) => {
    dispatch({ type: 'removeCard', spaceId, cardId })
  }, [])

  return (
    <SpacesContext.Provider
      value={{
        spaces: spacesState.spaces,
        currentSpaceId,
        setCurrentSpaceId,
        dispatch,
        addSpace,
        removeSpace,
        changeSpace,
        addCard,
        removeCard,
      }}
    >
      {children}
    </SpacesContext.Provider>
  )
}

/**
 * Custom hook to use Spaces context
 * @throws Error if used outside SpacesProvider
 */
export const useSpaces = () => {
  const context = useContext(SpacesContext)
  if (context === null) {
    throw new Error('useSpaces must be used within a SpacesProvider')
  }
  return context
}
