import * as React from 'react';
import { Tooltip as RechartsTooltip } from 'recharts';
import { cn } from '~/lib/utils';

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContainerProps = React.ComponentProps<'div'> & {
  config: ChartConfig;
};

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, config, style, children, ...props }, ref) => {
    const chartStyles = Object.entries(config).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value.color) {
          acc[`--color-${key}`] = value.color;
        }

        return acc;
      },
      {},
    );

    return (
      <div
        ref={ref}
        className={cn(
          'h-[250px] w-full text-sm [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/60 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke="#fff"]]:stroke-transparent [&_.recharts-layer]:outline-none',
          className,
        )}
        style={{ ...chartStyles, ...style } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ChartContainer.displayName = 'ChartContainer';

const ChartTooltip = RechartsTooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = 'dot',
}: {
  active?: boolean;
  payload?: Array<{
    color?: string;
    name?: string;
    value?: string | number;
  }>;
  label?: React.ReactNode;
  indicator?: 'dot' | 'line';
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="grid min-w-[8rem] gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-md">
      {label ? <div className="font-medium">{label}</div> : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => (
          <div key={`${item.name}-${index}`} className="flex items-center gap-2">
            <div
              className={cn(
                'shrink-0 rounded-full',
                indicator === 'line' ? 'h-0.5 w-3' : 'h-2 w-2',
              )}
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="ml-auto font-medium text-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };
