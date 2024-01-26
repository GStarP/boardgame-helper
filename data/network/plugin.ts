import axios from 'axios'

export type PluginMetaData = {
  name: string
  version: string
  description: string
  dist: {
    integrity: string
    shasum: string
    tarball: string
    unpackedSize: number
    signatures: {
      keyid: string
      sig: string
    }[]
  }
  bgt?: {
    name?: string
    desc?: string
    icon?: string
  }
}

export async function fetchPluginMetadata(
  pluginId: string
): Promise<PluginMetaData> {
  const { data } = await axios.get(
    `https://registry.npmjs.org/${pluginId}/latest`
  )
  return data
}
