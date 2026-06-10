import assert from 'node:assert/strict'
import test from 'node:test'

import { pollAiScreeningRun, resumeActiveAiScreeningRun } from './ai-screening-polling.ts'

const pending = {
  runId: 41,
  status: 'RUNNING',
  totalCount: 4,
  processedCount: 1,
  successCount: 1,
  failedCount: 0,
  progressPercent: 25,
  startedAt: null,
  completedAt: null,
  errorMessage: null
}

test('polls sequentially and stops when the run completes', async () => {
  const responses = [
    pending,
    { ...pending, status: 'COMPLETED', processedCount: 4, successCount: 4, progressPercent: 100 }
  ]
  const updates = []
  const delays = []
  let calls = 0

  const result = await pollAiScreeningRun({
    runId: 41,
    getRun: async () => responses[calls++],
    onProgress: (run) => updates.push(run.progressPercent),
    delay: async (milliseconds) => {
      delays.push(milliseconds)
    }
  })

  assert.equal(result.status, 'COMPLETED')
  assert.equal(calls, 2)
  assert.deepEqual(updates, [25, 100])
  assert.deepEqual(delays, [2500])
})

test('stops and exposes the backend error when the run fails', async () => {
  await assert.rejects(
    pollAiScreeningRun({
      runId: 41,
      getRun: async () => ({ ...pending, status: 'FAILED', errorMessage: 'Ollama unavailable' }),
      delay: async () => undefined
    }),
    /Ollama unavailable/
  )
})

test('stops polling after abort and does not schedule another request', async () => {
  const controller = new AbortController()
  let calls = 0

  await assert.rejects(
    pollAiScreeningRun({
      runId: 41,
      signal: controller.signal,
      getRun: async () => {
        calls += 1
        return pending
      },
      delay: async () => {
        controller.abort()
      }
    }),
    { name: 'AbortError' }
  )

  assert.equal(calls, 1)
})

test('never overlaps progress requests', async () => {
  let activeRequests = 0
  let maximumActiveRequests = 0
  let calls = 0

  await pollAiScreeningRun({
    runId: 41,
    getRun: async () => {
      activeRequests += 1
      maximumActiveRequests = Math.max(maximumActiveRequests, activeRequests)
      await Promise.resolve()
      activeRequests -= 1
      calls += 1
      return calls === 2 ? { ...pending, status: 'COMPLETED' } : pending
    },
    delay: async () => undefined
  })

  assert.equal(maximumActiveRequests, 1)
})

test('reconnects to an active backend run without creating a new run', async () => {
  const completed = { ...pending, status: 'COMPLETED', processedCount: 4, successCount: 4, progressPercent: 100 }
  const updates = []

  const result = await resumeActiveAiScreeningRun({
    jobId: 20,
    getActiveRun: async () => pending,
    getRun: async () => completed,
    onProgress: (run) => updates.push(run.progressPercent),
    delay: async () => undefined
  })

  assert.equal(result?.status, 'COMPLETED')
  assert.deepEqual(updates, [25, 100])
})

test('returns null when the job has no active backend run', async () => {
  const result = await resumeActiveAiScreeningRun({
    jobId: 20,
    getActiveRun: async () => null,
    getRun: async () => {
      throw new Error('should not poll')
    }
  })

  assert.equal(result, null)
})
