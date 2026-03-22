import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, isDemoMode } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export interface DailyEngineResponse {
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  bodyToday: {
    adaptationScore: number;
    adaptationTrend: string;
    recoveryStatus: string;
    trainingLoad: string;
    nutritionStatus: string;
    readinessShort: string;
    whyBullets: string[];
  };
  actionToday: {
    training: {
      type: string;
      duration: number;
      intensity: string;
      warmup: string;
      isRestDay: boolean;
    };
    recovery: {
      action: string;
      focus: string;
    };
    nutrition: {
      targetKcal: number;
      focus: string;
      guidedMessage: string;
    };
  };
  weeklyPlanReason: string;
}

export const useDashboard = () => useQuery({ 
  queryKey: ['system.dashboard'], 
  queryFn: () => apiClient.get('/v2/mivi/system/dashboard'),
  retry: false
});

export const useWeek = (weekStart: string) => useQuery({ 
  queryKey: ['system.week', weekStart], 
  queryFn: () => apiClient.get(`/v2/mivi/system/week?weekStart=${weekStart}`),
  retry: false
});

export const useNotifications = () => useQuery({ 
  queryKey: ['notifications.today'], 
  queryFn: () => apiClient.get('/v2/mivi/notifications/today'),
  retry: false
});

export const usePlanner = () => useQuery({ 
  queryKey: ['planner.nextWorkout'], 
  queryFn: () => apiClient.get('/v2/mivi/planner/next-workout'),
  retry: false
});

export const useWeeklyReport = (weekStart: string) => useQuery({ 
  queryKey: ['reports.weekly', weekStart], 
  queryFn: () => apiClient.get(`/v2/mivi/reports/weekly?weekStart=${weekStart}`),
  retry: false
});

export const useRecoverDaily = (date: string) => useQuery({
  queryKey: ['recover.daily', date],
  queryFn: () => apiClient.get(`/v2/mivi/recover/daily?date=${date}`),
  retry: false
});

export const useFuelDaily = (date: string) => useQuery({
  queryKey: ['fuel.daily', date],
  queryFn: () => apiClient.get(`/v2/mivi/fuel/daily?date=${date}`),
  retry: false
});

export const useSystemSettings = () => useQuery({
  queryKey: ['system.settings'],
  queryFn: () => apiClient.get('/v2/mivi/system/settings'),
  retry: false
});

export const useProfile = () => useQuery({
  queryKey: ['athlete.profile'],
  queryFn: () => apiClient.get('/v2/mivi/athlete/profile'),
  retry: false
});

export const useTrainDay = (date: string) => useQuery({
  queryKey: ['train.day', date],
  queryFn: () => apiClient.get(`/v2/mivi/train/day?date=${date}`),
  retry: false
});

export const useDailyEngine = () => {
  const { data: profile } = useProfile();
  const isBeginner = profile?.experience === 'beginner' || profile?.experience === 'Новичок';
  const isAdvanced = profile?.experience === 'advanced' || profile?.experience === 'Продвинутый';
  const userLevel = isBeginner ? 'beginner' : isAdvanced ? 'advanced' : 'intermediate';

  return useQuery<DailyEngineResponse>({
    queryKey: ['engine.daily'],
    queryFn: async () => {
      try {
        const data = await apiClient.get('/v2/mivi/engine/daily');
        if (data && Object.keys(data).length > 0) return data;
        throw new Error('Empty response');
      } catch (e) {
        if (isDemoMode()) {
          return {
            userLevel,
            bodyToday: {
              adaptationScore: 82,
              adaptationTrend: '+4',
              recoveryStatus: 'Moderate',
              trainingLoad: '+6',
              nutritionStatus: 'Balanced',
              readinessShort: isAdvanced ? 'readinessHighShort' : 'readinessModerateShort',
              whyBullets: ['reason1', 'reason2', 'reason3'],
            },
            actionToday: {
              training: {
                type: 'pushDay1',
                duration: 55,
                intensity: isAdvanced ? 'RPE 8' : isBeginner ? 'lightEffort' : 'moderateEffort',
                warmup: 'mobilityWarmup',
                isRestDay: false
              },
              recovery: {
                action: 'sleepAction',
                focus: 'Active Recovery'
              },
              nutrition: {
                targetKcal: 2150,
                focus: 'proteinFocus',
                guidedMessage: 'nutritionGuidedMsg'
              }
            },
            weeklyPlanReason: isAdvanced ? 'planReasonAdv' : 'planReason'
          };
        }
        throw e;
      }
    },
    retry: false
  });
};

export const useLogAction = (endpoint: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: (data: any) => apiClient.post(endpoint, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['engine.daily'] }),
        queryClient.invalidateQueries({ queryKey: ['system.dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['system.week'] }),
        queryClient.invalidateQueries({ queryKey: ['planner.nextWorkout'] }),
        queryClient.invalidateQueries({ queryKey: ['recover.daily'] }),
        queryClient.invalidateQueries({ queryKey: ['fuel.daily'] }),
      ]);

      showToast(t('save'), t('checkinSuccess'));
    },
    onError: () => {
      showToast(t('error'), t('somethingWentWrong'));
    }
  });
};
