import { ApiClient } from './api'

// Configuration constants
const DEFAULT_N8N_WEBHOOK_ID = 'e47176dd-28ad-42f8-bf31-b7a091a65a9d'
const PRODUCTION_BASE_URL = 'https://n8n.cherishxn.cloud/webhook-test'
const DEV_PROXY_BASE_URL = '/api/n8n/webhook-test'

interface N8nResponse {
  output?: string
  url?: string
  image?: string
  [key: string]: any
}

export const ImageService = {
  /**
   * Generates an image based on the provided prompt using N8N webhook.
   *
   * @param prompt The text prompt for image generation.
   * @param customBackendUrl Optional custom URL to override the default endpoint.
   * @returns The URL of the generated image.
   */
  generateImage: async (prompt: string, customBackendUrl?: string): Promise<string> => {
    const url = ImageService.resolveEndpoint(customBackendUrl)

    try {
      const data = await ApiClient.post<N8nResponse | N8nResponse[]>(url, { prompt })

      console.log('Image Generation Response:', data)

      // Normalize response: handle both object and array returns
      const responseObj = Array.isArray(data) ? data[0] : data

      console.log('Normalized Response Object:', responseObj)

      // Attempt to find the image URL in various common fields
      const imageUrl =
        responseObj?.output || responseObj?.url || responseObj?.image || responseObj?.data

      if (!imageUrl) {
        console.warn('Invalid response structure. Full data:', JSON.stringify(data, null, 2))
        throw new Error(
          `Response did not contain a recognized image URL field (output, url, image). Received keys: ${Object.keys(
            responseObj || {}
          ).join(', ')}`
        )
      }

      return imageUrl
    } catch (error) {
      console.error('Image Generation Service Error:', error)
      throw error
    }
  },

  /**
   * Resolves the correct API endpoint based on environment and custom configuration.
   */
  resolveEndpoint: (customUrl?: string): string => {
    // 1. If user provides a custom URL, use it directly.
    if (customUrl && customUrl.trim()) {
      return customUrl.trim()
    }

    // 2. Otherwise, determine the URL based on the environment (Dev vs Prod)
    // using Vite's import.meta.env
    if (import.meta.env.DEV) {
      return `${DEV_PROXY_BASE_URL}/${DEFAULT_N8N_WEBHOOK_ID}`
    }

    return `${PRODUCTION_BASE_URL}/${DEFAULT_N8N_WEBHOOK_ID}`
  }
}
