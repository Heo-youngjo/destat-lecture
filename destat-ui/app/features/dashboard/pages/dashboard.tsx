import TrendCard from '../components/trend-card';
import { TrendChart } from '../components/trend-chart';
import type { Route } from './+types/dashboard';
import { DateTime } from 'luxon';
import { supabase } from '~/postgres/supaclient';
import { getNumberData, getSurveyData } from '../query';

// [Number]
// Visitors
// Live Surveys
// Archived Surveys

// [Graph]
// time x Live Surveys
// time x Archived Surveys

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  await supabase.rpc('increment_daily_visitor', {
    day: DateTime.now().startOf('day').toISO({ includeOffset: false }),
  });
  const thisWeekStart = DateTime.now()
    .startOf('week')
    .toISO({ includeOffset: false });
  const thisWeekEnd = DateTime.now().toISO({ includeOffset: false });
  const lastWeekStart = DateTime.now()
    .startOf('week')
    .minus({ week: 1 })
    .toISO({ includeOffset: false });
  const { data: liveSurveyCount } = await (supabase as any)
    .from('daily_live_survey')
    .select('count, created_at')
    .order('created_at');
  let formedLivedSurveyCount = [
    {
      date: '',
      data: 0,
    },
  ];
  if (liveSurveyCount) {
    formedLivedSurveyCount = liveSurveyCount.map((c: { count: number; created_at: string }) => {
      return {
        date: c.created_at,
        data: c.count,
      };
    });
  }

  const { count: liveTotal } = await supabase
    .from('survey')
    .select('*', { count: 'exact', head: true })
    .eq('finish', false);
  const { count: archivedTotal } = await supabase
    .from('survey')
    .select('*', { count: 'exact', head: true })
    .eq('finish', true);
  const numberCard = await getNumberData(lastWeekStart, thisWeekStart, thisWeekEnd);
  const liveTrend = await getSurveyData(lastWeekStart, thisWeekStart, thisWeekEnd, false);
  const archivedTrend = await getSurveyData(lastWeekStart, thisWeekStart, thisWeekEnd, true);
  return {
    ...numberCard,
    formedLivedSurveyCount,
    liveValue: (liveTotal ?? 0).toString(),
    liveTrend,
    archivedValue: (archivedTotal ?? 0).toString(),
    archivedTrend,
  };
};

const data = [
  { date: '2025-10-01', data: 186 },
  { date: '2025-10-02', data: 192 },
  { date: '2025-10-03', data: 178 },
  { date: '2025-10-04', data: 201 },
  { date: '2025-10-05', data: 195 },
  { date: '2025-10-06', data: 188 },
  { date: '2025-10-07', data: 190 },
  { date: '2025-10-08', data: 183 },
  { date: '2025-10-09', data: 199 },
  { date: '2025-10-10', data: 205 },
  { date: '2025-10-11', data: 197 },
  { date: '2025-10-12', data: 184 },
  { date: '2025-10-13', data: 193 },
  { date: '2025-10-14', data: 189 },
];

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your survey platform activity.</p>
      </div>
      <div className="grid grid-cols-3 gap-5 w-full">
        <TrendCard
          title="Total Visitors"
          value={loaderData.value}
          trendValue={loaderData.trendValue + '%'}
          trendMessage={loaderData.upAndDown ? 'Trending Up' : 'Trending Down'}
          periodMessage="last 7 days"
          upAndDown={loaderData.upAndDown}
        />
        <TrendCard
          title="Live Surveys"
          value={loaderData.liveValue}
          trendValue={loaderData.liveTrend.trendValue + '%'}
          trendMessage={loaderData.liveTrend.upAndDown ? 'Trending Up' : 'Trending Down'}
          periodMessage="last 7 days"
          upAndDown={loaderData.liveTrend.upAndDown}
        />
        <TrendCard
          title="Archived Surveys"
          value={loaderData.archivedValue}
          trendValue={loaderData.archivedTrend.trendValue + '%'}
          trendMessage={loaderData.archivedTrend.upAndDown ? 'Trending Up' : 'Trending Down'}
          periodMessage="last 7 days"
          upAndDown={loaderData.archivedTrend.upAndDown}
        />
      </div>
      <div className="grid grid-cols-2 mt-6 gap-5 w-full">
        <TrendChart
          title="Live Surveys"
          description="Daily live survey count"
          trendMessage=""
          periodMessage=""
          chartData={loaderData.formedLivedSurveyCount}
        />
        <TrendChart
          title="Archived Surveys"
          description="Daily archived surveys count"
          trendMessage=""
          periodMessage=""
          chartData={data}
        />
      </div>
    </div>
  );
}
