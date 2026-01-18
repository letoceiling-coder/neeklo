/**
 * API utility for Laravel backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Make API request
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message || 'Ошибка запроса',
      errors: data.errors,
    };
  }

  return {
    success: true,
    data,
  };
}

/**
 * Upload files to Laravel backend
 */
export async function uploadFiles(
  files: File[],
  submissionId?: string
): Promise<{ success: boolean; files?: Array<{ name: string; size: number; type: string; url: string }>; message?: string }> {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files[]', file);
  });
  
  if (submissionId) {
    formData.append('submission_id', submissionId);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/brief-submissions/upload-files`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Ошибка загрузки файлов',
      };
    }

    return {
      success: true,
      files: data.files || [],
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: 'Ошибка загрузки файлов',
    };
  }
}

/**
 * Submit brief submission
 */
export async function submitBriefSubmission(data: {
  name: string;
  company?: string;
  role: string;
  project_name?: string;
  description: string;
  phone: string;
  email: string;
  files?: Array<{ name: string; size: number; type: string; url: string }>;
}): Promise<{ success: boolean; message?: string }> {
  const response = await apiRequest('/brief-submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    success: response.success,
    message: response.message,
  };
}

/**
 * Send message to Telegram (via Laravel backend)
 */
export async function sendTelegramMessage(data: {
  name: string;
  phone: string;
  email?: string;
  role: string;
  description: string;
}): Promise<{ success: boolean; message?: string }> {
  const response = await apiRequest('/brief-submissions/send-telegram', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    success: response.success,
    message: response.message,
  };
}

