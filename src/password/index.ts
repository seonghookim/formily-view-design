import { Input } from '../input'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { PreviewInputText } from '../preview-text'
import type { Input as IvuInputProps } from 'view-design'

export type PasswordProps = IvuInputProps

export const Password = connect(
  Input,
  mapProps((props) => {
    return {
      ...props,
      type: 'password',
    }
  }),
  mapReadPretty(PreviewInputText)
)
