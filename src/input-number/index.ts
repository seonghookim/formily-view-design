import { getComponentByTag } from '../__builtins__/shared'
import { connect, mapProps, mapReadPretty } from '@formily/vue'

import type { InputNumber as _IvuInputNumberProps } from 'view-design'
import { InputNumber as IvuInputNumber } from 'view-design'
import { PreviewInputText } from '../preview-text'

export type InputNumberProps = _IvuInputNumberProps

const TransformIvuInputNumber = getComponentByTag<InputNumberProps>(
  IvuInputNumber,
  {
    change: 'on-change',
    focus: 'on-focus',
    blur: 'on-blur',
  }
)

export const InputNumber = connect(
  TransformIvuInputNumber,
  mapProps({ readOnly: 'readonly' }, (props) => {
    let controlsPosition = 'right'
    if (props.controlsPosition) {
      controlsPosition = props.controlsPosition
    }
    return {
      controlsPosition,
    }
  }),
  mapReadPretty(PreviewInputText)
)
