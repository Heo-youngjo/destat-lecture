import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export default function TrendCard({
  title,
  value,
  trendValue,
  trendMessage,
  periodMessage,
  upAndDown = true,
}: {
  title: string;
  value: string;
  trendValue: string;
  trendMessage: string;
  periodMessage: string;
  upAndDown?: boolean;
}) {
  const TrendIcon = upAndDown ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription className="text-sm font-medium">{title}</CardDescription>
        <CardTitle className="text-3xl font-bold tabular-nums @[250px]/card:text-4xl">
          {value}
        </CardTitle>
        <CardAction>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              upAndDown
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            <TrendIcon className="size-3" />
            {trendValue}
          </span>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div
          className={`flex items-center gap-1.5 font-medium ${
            upAndDown ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          <TrendIcon className="size-4" />
          {trendMessage}
        </div>
        <div className="text-muted-foreground">{periodMessage}</div>
      </CardFooter>
    </Card>
  );
}
