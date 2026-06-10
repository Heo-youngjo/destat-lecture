import { supabase } from '~/postgres/supaclient';

export const getNumberData = async (
  lastStart: string,
  thisStart: string,
  End: string,
) => {
  const { data: lastWeek } = await supabase
    .from('daily_visitor')
    .select('count')
    .lt('day_start', thisStart)
    .gte('day_start', lastStart);
  const { data: thisWeek } = await supabase
    .from('daily_visitor')
    .select('count')
    .lt('day_start', End)
    .gte('day_start', thisStart);
  if (lastWeek && thisWeek) {
    const lastWeekCount = lastWeek.reduce((sum, value) => sum + value.count, 0);
    const thisWeekCount = thisWeek.reduce((sum, value) => sum + value.count, 0);
    const change = lastWeekCount > 0
      ? Math.abs((thisWeekCount - lastWeekCount) / lastWeekCount * 100)
      : thisWeekCount > 0 ? 100 : 0;
    return {
      value: thisWeekCount.toString(),
      trendValue: change.toFixed(1),
      upAndDown: thisWeekCount > lastWeekCount,
    };
  } else {
    return { value: '0', trendValue: '0', upAndDown: false };
  }
};

export const getSurveyData = async (
  lastStart: string,
  thisStart: string,
  End: string,
  finish: boolean,
) => {
  const { data: lastWeek } = await supabase
    .from('survey')
    .select('created_at')
    .lt('created_at', thisStart)
    .gte('created_at', lastStart)
    .eq('finish', finish);
  const { data: thisWeek } = await supabase
    .from('survey')
    .select('created_at')
    .lt('created_at', End)
    .gte('created_at', thisStart)
    .eq('finish', finish);
  if (lastWeek && thisWeek) {
    const lastWeekCount = lastWeek.length;
    const thisWeekCount = thisWeek.length;
    return {
      value: thisWeekCount.toString(),
      trendValue: (lastWeekCount > 0
        ? Math.abs((thisWeekCount - lastWeekCount) / lastWeekCount * 100)
        : thisWeekCount > 0 ? 100 : 0).toFixed(1),
      upAndDown: thisWeekCount > lastWeekCount,
    };
  } else {
    return { value: '0', trendValue: '0', upAndDown: false };
  }
};
