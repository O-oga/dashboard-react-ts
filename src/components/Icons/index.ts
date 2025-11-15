import type { CardIconTypes, SpaceIconTypes, UIIconTypes } from '../../types/Icons.types';
import type { IconProps } from './types';

import { Chair2Icon } from './Chair2Icon';
import { ExitIcon } from './ExitIcon';
import { HelpIcon } from './HelpIcon';
import { HomeIcon } from './HomeIcon';
import { LanguageIcon } from './LanguageIcon';
import { LightbulbIcon } from './LightbulbIcon';
import { LogoutIcon } from './LogoutIcon';
import { MonitorIcon } from './MonitorIcon';
import { PlugCircleIcon } from './PlugCircleIcon';
import { SettingsIcon } from './SettingsIcon';
import { SmartHomeIcon } from './SmartHomeIcon';
import { SwapIcon } from './SwapIcon';
import { TrashIcon } from './TrashIcon';
import { Widget4Icon } from './Widget4Icon';
import { WidgetIcon } from './WidgetIcon';

export type { IconProps } from './types';

export const SpacesIcons: Record<SpaceIconTypes, React.ComponentType<IconProps>> = {
    HomeIcon: HomeIcon,
    Chair2Icon: Chair2Icon,
    SmartHomeIcon: SmartHomeIcon,
    WidgetIcon: WidgetIcon,
    Widget4Icon: Widget4Icon,
    MonitorIcon: MonitorIcon,
    LightbulbIcon: LightbulbIcon,
    PlugCircleIcon: PlugCircleIcon,
};

export const CardsIcons : Record<CardIconTypes, React.ComponentType<IconProps>> = {
    LightbulbIcon: LightbulbIcon,
    PlugCircleIcon: PlugCircleIcon,
};

export const UIIcons: Record<UIIconTypes, React.ComponentType<IconProps>> = {
    HomeIcon: HomeIcon,
    SettingsIcon: SettingsIcon,
    LogoutIcon: LogoutIcon,
    LanguageIcon: LanguageIcon,
    HelpIcon: HelpIcon,
    TrashIcon: TrashIcon,
    SwapIcon: SwapIcon,
    ExitIcon: ExitIcon,
};