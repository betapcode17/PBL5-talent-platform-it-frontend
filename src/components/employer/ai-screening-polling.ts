import type { AiScreeningRunResponse } from '@/@types/employer'

type PollAiScreeningRunOptions = {
  runId: number
  getRun: (runId: number) => Promise<AiScreeningRunResponse>
  onProgress?: (run: AiScreeningRunResponse) => void
  signal?: AbortSignal
  intervalMs?: number
  delay?: (milliseconds: number, signal?: AbortSignal) => Promise<void>
}

type ResumeActiveAiScreeningRunOptions = Omit<PollAiScreeningRunOptions, 'runId'> & {
  jobId?: number
  getActiveRun: (jobId?: number) => Promise<AiScreeningRunResponse | null>
}

const createAbortError = () => new DOMException('AI Screening polling was cancelled.', 'AbortError')

export const pollingDelay = (milliseconds: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError())
      return
    }

    const complete = () => {
      signal?.removeEventListener('abort', abort)
      resolve()
    }
    const timer = setTimeout(complete, milliseconds)
    const abort = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      reject(createAbortError())
    }
    signal?.addEventListener('abort', abort, { once: true })
  })

export const pollAiScreeningRun = async ({
  runId,
  getRun,
  onProgress,
  signal,
  intervalMs = 2500,
  delay = pollingDelay
}: PollAiScreeningRunOptions): Promise<AiScreeningRunResponse> => {
  for (;;) {
    if (signal?.aborted) throw createAbortError()

    const run = await getRun(runId)
    onProgress?.(run)

    if (run.status === 'COMPLETED') return run
    if (run.status === 'FAILED' || run.status === 'CANCELLED') {
      throw new Error(run.errorMessage ?? `AI Screening ${run.status.toLowerCase()}.`)
    }

    await delay(intervalMs, signal)
  }
}

export const resumeActiveAiScreeningRun = async ({
  jobId,
  getActiveRun,
  ...pollingOptions
}: ResumeActiveAiScreeningRunOptions): Promise<AiScreeningRunResponse | null> => {
  const activeRun = await getActiveRun(jobId)
  if (!activeRun) return null

  pollingOptions.onProgress?.(activeRun)
  return pollAiScreeningRun({
    ...pollingOptions,
    runId: activeRun.runId
  })
}
