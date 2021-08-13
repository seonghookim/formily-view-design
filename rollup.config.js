import baseConfig, {
  removeImportStyleFromInputFilePlugin,
} from '../../scripts/rollup.base.js'

export default baseConfig(
  'formily.view-design',
  'Formily.ViewDesign',
  removeImportStyleFromInputFilePlugin()
)
