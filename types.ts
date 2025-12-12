/*
 * @Author: qinzhaoxuan
 * @Date: 2025-12-11 10:01:04
 * @LastEditors: qinzhaoxuan
 * @LastEditTime: 2025-12-13 03:16:03
 * @Description: file content
 * @FilePath: /z-image-gemini-build/types.ts
 */
export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  timestamp: number
  width?: number
  height?: number
}

export enum AspectRatio {
  Square = '1:1',
  Portrait = '9:16',
  Landscape = '16:9',
  Classic = '4:3',
  Wide = '21:9' // Mapped to nearest supported
}

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error'

export enum TaskStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Task {
  id: string
  prompt: string
  width: number
  height: number
  seed: number
  status: TaskStatus
  progress: number
  current_step?: string | null
  result_url?: string | null
  error_msg?: string | null
  created_at: string
  prompt_id?: string | null
}

export interface TaskCreate {
  prompt: string
  width?: number
  height?: number
  seed?: number
}
