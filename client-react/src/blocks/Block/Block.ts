import { cn } from '@bem-react/classname';
import { withBemMod } from '@bem-react/core';

import './Block.scss';

export const cnBlock = cn('Block');

export const mixBlock = (mods = {}) => withBemMod('Block', mods);
