import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { Cascader as IvuCascader } from 'view-design'

import type { Cascader as IvuCascaderProps } from 'view-design'
import { PreviewCascaderText } from '../preview-text'
import { getComponentByTag } from '../__builtins__/shared'

export type CascaderProps = IvuCascaderProps

const TransformIviewEvent = getComponentByTag<IvuCascaderProps>(IvuCascader, {
  change: 'on-change',
  focus: 'on-focus',
  blur: 'on-blur',
})

export const Cascader = connect(
  TransformIviewEvent,
  mapProps({ dataSource: 'data' }),
  mapReadPretty(PreviewCascaderText)
)
