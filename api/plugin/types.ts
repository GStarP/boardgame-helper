export interface NPMPackageMetadata {
  name: string
  version: string
  description: string
  dist: {
    integrity: string
    shasum: string
    tarball: string
    unpackedSize: number
    signatures: NPMPackageSignature[]
  }
  bgt: {
    name: string
    desc: string
  }
}

export interface NPMPackageSignature {
  keyid: string
  sig: string
}
