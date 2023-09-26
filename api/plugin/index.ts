import axios from '..'
import { NPMPackageMetadata } from './types'

export async function fetchPluginMetadata(
  pluginId: string
): Promise<NPMPackageMetadata> {
  const { data } = await axios.get(
    `https://registry.npmjs.org/${pluginId}/latest`
  )
  return data
}
