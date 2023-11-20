import { BackendSubmission } from './backendSubmission'

export interface BackendSecretSubmission extends BackendSubmission {
  secret: string
}
