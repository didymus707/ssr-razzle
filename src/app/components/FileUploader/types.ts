import { BoxProps } from '@chakra-ui/core'

interface DropzoneOptions {
  isDragActive: boolean
}

interface Options {
  accept?: string
  maxSize?: number
  children?: React.ReactNode | ((props: DropzoneOptions) => React.ReactNode)
  onUpload?: (files: File[]) => void
}

export type FileUploaderProps = Options & BoxProps
