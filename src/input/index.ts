import { getComponentByTag } from '../__builtins__/shared'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { PreviewInputText } from '../preview-text'
import type { Input as IvuInputProps } from 'view-design'
import { Input as IvuInput } from 'view-design'

export type InputProps = IvuInputProps

const TransformIviewEvent = getComponentByTag<InputProps>(IvuInput, {
  change: 'on-change',
  focus: 'on-focus',
  blur: 'on-blur',
})

export const Input = connect(
  TransformIviewEvent,
  mapProps({ readOnly: 'readonly' }),
  mapReadPretty(PreviewInputText)
)

export const TextArea = connect(
  Input,
  mapProps((props) => {
    return {
      ...props,
      type: 'textarea',
    }
  }),
  mapReadPretty(PreviewInputText)
)
