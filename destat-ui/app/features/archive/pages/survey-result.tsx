import { useReadContract } from 'wagmi';
import { SURVEY_ABI } from '~/features/survey/constant';
import type { Route } from './+types/survey-result';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export default function SurveyResult({ params }: Route.ComponentProps) {
  const surveyId = (params as { surveyId: string }).surveyId as `0x${string}`;

  const { data: title } = useReadContract({
    address: surveyId,
    abi: SURVEY_ABI,
    functionName: 'title',
  });

  const { data: description } = useReadContract({
    address: surveyId,
    abi: SURVEY_ABI,
    functionName: 'description',
  });

  const { data: questions } = useReadContract({
    address: surveyId,
    abi: SURVEY_ABI,
    functionName: 'getQuestions',
  });

  const { data: answers } = useReadContract({
    address: surveyId,
    abi: SURVEY_ABI,
    functionName: 'getAnswers',
  });

  const { data: answerCount } = useReadContract({
    address: surveyId,
    abi: SURVEY_ABI,
    functionName: 'getAnswersCount',
  });

  const getOptionCount = (questionIndex: number, optionIndex: number) => {
    if (!answers) return 0;
    return answers.filter((a) => a.answers[questionIndex] === optionIndex).length;
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold">{title ?? 'Loading...'}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
        <span className="text-sm font-medium mt-2 block">
          Total Responses: {answerCount?.toString() ?? '0'}
        </span>
      </div>

      {questions?.map((q, qi) => (
        <Card key={qi}>
          <CardHeader>
            <CardTitle className="text-lg">
              Q{qi + 1}. {q.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {q.options.map((option, oi) => {
              const count = getOptionCount(qi, oi);
              const total = Number(answerCount ?? 0);
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={oi} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span>{option}</span>
                    <span className="font-semibold">{count}명 ({percent}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {!questions && (
        <p className="text-muted-foreground">Loading survey results...</p>
      )}
    </div>
  );
}
