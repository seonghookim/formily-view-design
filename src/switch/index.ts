import { connect, mapProps } from '@formily/vue'

import type { Switch as IvuSwitchProps } from 'view-design'
import { Switch as IvuSwitch } from 'view-design'
import { getComponentByTag } from '../__builtins__/shared'

export type SwitchProps = IvuSwitchProps

const TransformIvuSwitch = getComponentByTag(IvuSwitch, {
  change: 'on-change',
  focus: 'on-focus',
  blur: 'on-blur',
})

export const Switch = connect(
  TransformIvuSwitch,
  mapProps({ readOnly: 'readonly' })
)
