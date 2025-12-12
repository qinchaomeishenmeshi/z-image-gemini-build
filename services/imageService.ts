import { ApiClient } from './api'
import { Task, TaskCreate, TaskStatus } from '../types'

// Configuration constants
const API_BASE_PATH = '/api/v1'

export const ImageService = {
  /**
   * Generates an image based on the provided prompt using the local API.
   * Handles the async task polling flow.
   *
   * @param prompt The text prompt for image generation.
   * @returns The completed Task object.
   */
  generateImage: async (prompt: string): Promise<Task> => {
    // 1. Create Task
    const task = await ImageService.createTask({ prompt })
    console.log('Task created:', task)

    // 2. Poll for completion
    return await ImageService.pollTask(task.id)
  },

  /**
   * Creates a generation task.
   */
  createTask: async (payload: TaskCreate): Promise<Task> => {
    const url = `${API_BASE_PATH}/generate`
    return await ApiClient.post<Task>(url, payload)
  },

  /**
   * Polls the task status until completion or failure.
   */
  pollTask: async (taskId: string, intervalMs = 2000, maxAttempts = 60): Promise<Task> => {
    let attempts = 0

    while (attempts < maxAttempts) {
      const task = await ImageService.getTask(taskId)
      console.log(`Polling task ${taskId}: ${task.status} (${task.progress}%)`)

      if (task.status === TaskStatus.COMPLETED) {
        if (!task.result_url) {
          throw new Error('Task completed but no result URL provided')
        }
        return task
      }

      if (task.status === TaskStatus.FAILED) {
        throw new Error(`Task failed: ${task.error_msg || 'Unknown error'}`)
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
      attempts++
    }

    throw new Error('Task generation timed out')
  },

  /**
   * Gets the current status of a task.
   */
  getTask: async (taskId: string): Promise<Task> => {
    const url = `${API_BASE_PATH}/tasks/${taskId}`
    return await ApiClient.get<Task>(url)
  },

  /**
   * Fetches the generation history.
   */
  getHistory: async (limit: number = 20, offset: number = 0): Promise<Task[]> => {
    const url = `${API_BASE_PATH}/history?limit=${limit}&offset=${offset}`
    return await ApiClient.get<Task[]>(url)
  }
}
