import { Link } from 'react-router';
import { supabase } from '~/postgres/supaclient';
import type { Route } from './+types/finished-survey';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';

export const clientLoader = async () => {
  const { data, error } = await supabase
    .from('survey')
    .select('id, title, description, target_number, reward_amount')
    .eq('finish', true);
  if (error) return [];
  return data ?? [];
};

export default function FinishedSurvey({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Archived Surveys</h1>
        <span className="font-light text-muted-foreground">Finished surveys and their results</span>
      </div>
      {loaderData.length === 0 ? (
        <p className="text-muted-foreground">No archived surveys yet.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {loaderData.map((survey) => (
            <Card key={survey.id} className="max-w-92">
              <CardHeader>
                <CardTitle>{survey.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-10">
                  {survey.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link to={`/survey/${survey.id}/result`} className="w-full">
                  <Button className="w-full">View Results</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
