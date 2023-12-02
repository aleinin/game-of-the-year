export interface SubmissionIds {
  id: string
  secret: string
}

const submissionIdKey = 'submissionUUID'
const submissionSecretKey = 'submissionSecret'

export const localStorageService = {
  setSubmissionIds: (id: string, secret: string) => {
    localStorage.setItem(submissionIdKey, id)
    localStorage.setItem(submissionSecretKey, secret)
  },
  getSubmissionIds: (): SubmissionIds => {
    const id = localStorage.getItem(submissionIdKey) ?? ''
    const secret = localStorage.getItem(submissionSecretKey) ?? ''
    return { id, secret }
  },
  clearIds: () => {
    localStorage.removeItem(submissionIdKey)
    localStorage.removeItem(submissionSecretKey)
  },
}
