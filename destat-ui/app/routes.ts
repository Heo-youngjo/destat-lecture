import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('features/dashboard/pages/dashboard.tsx', { id: 'dashboard-home' }),
  route('docs', 'features/dashboard/pages/dashboard.tsx', {
    id: 'dashboard-docs',
  }),
  route('survey/all', 'features/survey/pages/all-surveys.tsx'),
  route('survey/create', 'features/survey/pages/create-survey.tsx'),
  route('survey/:surveyId', 'features/survey/pages/survey.tsx'),
  route('archive/finish', 'features/archive/pages/finished-survey.tsx'),
  route('survey/:surveyId/result', 'features/archive/pages/survey-result.tsx'),
  route('profile/survey', 'features/profile/pages/my-survey.tsx'),
  route('profile/response', 'features/profile/pages/my-response.tsx'),
] satisfies RouteConfig;
