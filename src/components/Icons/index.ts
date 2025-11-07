import type { CardIconTypes, IconComponent, SpaceIconTypes, UIIconTypes } from '../../types/Icons.types';
import type { IconProps } from './types';

import { Chair2Icon } from './Chair2Icon';
import { HomeIcon } from './HomeIcon';
import { LightbulbIcon } from './LightbulbIcon';
import { MonitorIcon } from './MonitorIcon';
import { PlugCircleIcon } from './PlugCircleIcon';
import { SmartHomeIcon } from './SmartHomeIcon';
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

// export const UIIcon: Record<UIIconTypes, React.ComponentType<IconProps>> = {
//     HomeIcon: undefined,
//     SettingsIcon: undefined,
//     LogoutIcon: undefined,
//     LanguageIcon: undefined,
//     HelpIcon: undefined,
//     AboutIcon: undefined
// };