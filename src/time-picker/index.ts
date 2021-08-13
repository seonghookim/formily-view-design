import { getComponentByTag } from '../__builtins__/shared'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { PreviewTimePickerText } from '../preview-text'
import type { TimePicker as IvuTimePickerProps } from 'view-design'
import { TimePicker as IvuTimePicker } from 'view-design'

export type TimePickerProps = IvuTimePickerProps

const TransformIvuTimePicker = getComponentByTag<TimePickerProps>(
  IvuTimePicker,
  {
    change: 'on-change',
    focus: 'on-focus',
    blur: 'on-blur',
  }
)

export const TimePicker = connect(
  TransformIvuTimePicker,
  mapProps({ readOnly: 'readonly' }),
  mapReadPretty(PreviewTimePickerText)
)
