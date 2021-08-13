import { getComponentByTag } from '../__builtins__/shared'
import { connect, mapProps, mapReadPretty } from '@formily/vue'

import type { DatePicker as IvuDatePickerProps } from 'view-design'
import { DatePicker as IvuDatePicker } from 'view-design'
import { PreviewDatePickerText } from '../preview-text'

export type DatePickerProps = IvuDatePickerProps

const TransformIvuDatePicker = getComponentByTag<DatePickerProps>(
  IvuDatePicker,
  {
    change: 'on-change',
    focus: 'on-focus',
    blur: 'on-blur',
  }
)

const getDefaultFormat = (props, formatType = 'format') => {
  const type = props.type

  if (type === 'week' && formatType === 'format') {
    return 'yyyy-WW'
  } else if (type === 'month') {
    return 'yyyy-MM'
  } else if (type === 'year') {
    return 'yyyy'
  } else if (type === 'datetime' || type === 'datetimerange') {
    return 'yyyy-MM-dd HH:mm:ss'
  }

  return 'yyyy-MM-dd'
}

export const DatePicker = connect(
  TransformIvuDatePicker,
  mapProps({ readOnly: 'readonly' }, (props) => {
    return {
      ...props,
      format: props.format || getDefaultFormat(props),
      valueFormat: props.valueFormat || getDefaultFormat(props, 'valueFormat'),
    }
  }),
  mapReadPretty(PreviewDatePickerText)
)
