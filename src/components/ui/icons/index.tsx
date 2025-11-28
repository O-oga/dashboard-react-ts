import { memo, useMemo } from 'react'
import type {
  CardIconTypes,
  SpaceIconTypes,
  UIIconTypes,
} from '@/types/Icons.types'
import type { IconProps } from './types'

import { AddIcon } from './AddIcon'
import { ButtonIcon } from './ButtonIcon'
import { Chair2Icon } from './Chair2Icon'
import { EmptyIcon } from './EmptyIcon'
import { ExitIcon } from './ExitIcon'
import { HelpIcon } from './HelpIcon'
import { HomeIcon } from './HomeIcon'
import { LanguageIcon } from './LanguageIcon'
import { LightbulbIcon } from './LightbulbIcon'
import { LogoutIcon } from './LogoutIcon'
import { MediaIcon } from './MediaIcon'
import { MonitorIcon } from './MonitorIcon'
import { PlugCircleIcon } from './PlugCircleIcon'
import { SensorIcon } from './SensorIcon'
import { SettingsIcon } from './SettingsIcon'
import { SmartHomeIcon } from './SmartHomeIcon'
import { SpinnerIcon } from './SpinnerIcon'
import { SwapIcon } from './SwapIcon'
import { SwitchIcon } from './SwitchIcon'
import { TrashIcon } from './TrashIcon'
import { Widget4Icon } from './Widget4Icon'
import { WidgetIcon } from './WidgetIcon'

export type { IconProps } from './types'

export const SpacesIcons: Record<
  SpaceIconTypes,
  React.ComponentType<IconProps>
> = {
  EmptyIcon: EmptyIcon,
  HomeIcon: HomeIcon,
  Chair2Icon: Chair2Icon,
  SmartHomeIcon: SmartHomeIcon,
  WidgetIcon: WidgetIcon,
  Widget4Icon: Widget4Icon,
  MonitorIcon: MonitorIcon,
  LightbulbIcon: LightbulbIcon,
  PlugCircleIcon: PlugCircleIcon,
}

// Memoized component for space icon buttons
export const SpaceIconButtons = memo(
  ({ setIcon }: { setIcon: (icon: SpaceIconTypes) => void }) => {
    const iconButtons = useMemo(
      () =>
        Object.entries(SpacesIcons).map(([icon, Icon]) => (
          <button
            className="icon-button button-svg button-svg-medium button-svg-dark"
            key={icon}
            onClick={() => setIcon(icon as SpaceIconTypes)}
          >
            <Icon size={35} color="white" />
          </button>
        )),
      [setIcon]
    )

    return <>{iconButtons}</>
  }
)

SpaceIconButtons.displayName = 'SpaceIconButtons'

export const CardsIcons: Record<
  CardIconTypes,
  React.ComponentType<IconProps>
> = {
  EmptyIcon: EmptyIcon,
  LightbulbIcon: LightbulbIcon,
  PlugCircleIcon: PlugCircleIcon,
  SensorIcon: SensorIcon,
  SwitchIcon: SwitchIcon,
  MediaIcon: MediaIcon,
  ButtonIcon: ButtonIcon,
}

export const CardIconButtons = memo(
  ({ setIcon }: { setIcon: (icon: CardIconTypes) => void }) => {
    const iconButtons = useMemo(
      () =>
        Object.entries(CardsIcons).map(([icon, Icon]) => (
          <button
            className="icon-button button-svg button-svg-medium button-svg-dark"
            key={icon}
            onClick={() => setIcon(icon as CardIconTypes)}
          >
            <Icon size={35} color="white" />
          </button>
        )),
      [setIcon]
    )

    return <>{iconButtons}</>
  }
)

CardIconButtons.displayName = 'CardIconButtons'


export const UIIcons: Record<UIIconTypes, React.ComponentType<IconProps>> = {
  HomeIcon: HomeIcon,
  SettingsIcon: SettingsIcon,
  LogoutIcon: LogoutIcon,
  LanguageIcon: LanguageIcon,
  HelpIcon: HelpIcon,
  TrashIcon: TrashIcon,
  SwapIcon: SwapIcon,
  ExitIcon: ExitIcon,
  SpinnerIcon: SpinnerIcon,
  AddIcon: AddIcon,
}

export const UIIconButtons = memo(
  ({ setIcon }: { setIcon: (icon: UIIconTypes) => void }) => {
    const iconButtons = useMemo(
      () =>
        Object.entries(UIIcons).map(([icon, Icon]) => (
          <button
            className="icon-button button-svg button-svg-medium button-svg-dark"
            key={icon}
            onClick={() => setIcon(icon as UIIconTypes)}  
          >
            <Icon size={35} color="white" />
          </button>
        )),
      [setIcon]
    )

    return <>{iconButtons}</>
  }
)

UIIconButtons.displayName = 'UIIconButtons'
