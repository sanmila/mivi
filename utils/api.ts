import { getTokens, setTokens, clearTokens } from './auth';

// Environment-controlled Demo Mode (Strictly isolated to development builds only)
export const isDemoMode = () => __DEV__ && process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.mivi.app';

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  let { accessToken, refreshToken } = await getTokens();
  
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  // Handle 401 Unauthorized with Refresh Token Flow
  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        await setTokens(data.accessToken, data.refreshToken);
        headers['Authorization'] = `Bearer ${data.accessToken}`;
        
        // Retry original request with new token
        response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
      } else {
        await clearTokens();
      }
    } catch (e) {
      await clearTokens();
    }
  }

  return response;
};

// DEMO MOCK DATA (Fallback only - stripped in production)
const getDemoData = (endpoint: string) => {
  if (endpoint.includes('/system/dashboard')) {
    return {
      adaptationScore: 82,
      readiness: { state: 'Высокая', score: 85 },
      recommendations: { bullets: ["Сон в норме (7.5ч)", "ВСР стабильна", "Оптимальное питание"] },
      today: { output: { reasons: ["Организм полностью восстановлен"] } }
    };
  }
  if (endpoint.includes('/system/week')) {
    return {
      days: [
        { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], adaptationScore: 78, dataPresence: { train: true, fuel: true, recover: true } },
        { date: new Date().toISOString().split('T')[0], adaptationScore: 82, dataPresence: { train: false, fuel: false, recover: false } }
      ]
    };
  }
  if (endpoint.includes('/planner/next-workout')) {
    return { workout: { title: 'Жим — День 1', sessionFocus: 'Сила', rpeTarget: 8, estimatedDuration: 45 } };
  }
  if (endpoint.includes('/notifications/today')) {
    return { nudges: [{ title: 'Запишите сон', body: 'Это повысит точность прогноза', action: 'log_recover' }] };
  }
  if (endpoint.includes('/reports/weekly')) {
    return {
      averages: { readinessScore: 85 },
      consistency: { daysWith2PlusPillars: 6 },
      trainingStats: { sessionsCount: 4 },
      deltas: { adaptation: 4 }
    };
  }
  if (endpoint.includes('/system/settings')) {
    return { caloriesTarget: 2150, proteinTargetG: 160, fatTargetG: 70, carbsTargetG: 230 };
  }
  if (endpoint.includes('/athlete/profile')) {
    return { height: 182, weight: 82.5, age: 28, gender: 'male', programStyle: 'Strength', experience: 'advanced' };
  }
  if (endpoint.includes('/subscription/status')) {
    return { level: 'PRO' };
  }
  return {};
};

export const apiClient = {
  async post(endpoint: string, data?: any) {
    try {
      const response = await fetchWithAuth(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (isDemoMode()) {
        if (endpoint.includes('/auth/login') || endpoint.includes('/auth/signup')) {
          throw new Error('Authentication requires a real backend connection.');
        }
        return { success: true };
      }
      throw error;
    }
  },
  
  async get(endpoint: string) {
    try {
      const response = await fetchWithAuth(endpoint, { method: 'GET' });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (isDemoMode()) return getDemoData(endpoint);
      throw error;
    }
  },
  
  async put(endpoint: string, data?: any) {
    try {
      const response = await fetchWithAuth(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (isDemoMode()) return { success: true };
      throw error;
    }
  }
};
