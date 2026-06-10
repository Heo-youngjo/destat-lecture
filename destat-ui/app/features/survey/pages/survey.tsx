import type { Route } from './+types/survey';
import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { SendIcon } from 'lucide-react';
import { Form } from 'react-router';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import MessageBubble from '../components/message-bubble';
import { SURVEY_ABI } from '../constant';


export default function Survey({ params }: Route.ComponentProps) {
  const { data: surveyData } = useReadContract({
    address: (params as { surveyId: string }).surveyId as `0x${string}`,
    abi: SURVEY_ABI,
    functionName: 'getQuestions',
    args: [],
  });

  const { data: description } = useReadContract({
    address: (params as { surveyId: string }).surveyId as `0x${string}`,
    abi: SURVEY_ABI,
    functionName: 'description',
    args: [],
  });

  const { writeContract } = useWriteContract();
  const { address } = useAccount();

  const submitAnswer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!address) {
      alert('Please connect wallet before submiting answer');
      return;
    }
    const formData = new FormData(e.currentTarget);
    const selectedAnswers: number[] = [];
    for (const value of formData.values()) {
      selectedAnswers.push(Number(value));
    }
    writeContract({
      address: (params as { surveyId: string }).surveyId as `0x${string}`,
      abi: SURVEY_ABI,
      functionName: 'submitAnswer',
      args: [
        {
          respondent: address,
          answers: selectedAnswers,
        },
      ],
    });
  };

  const { data: answers } = useReadContract({
    address: (params as { surveyId: string }).surveyId as `0x${string}`,
    abi: SURVEY_ABI,
    functionName: 'getAnswers',
    args: [],
  });

  const { data: target } = useReadContract({
    address: (params as { surveyId: string }).surveyId as `0x${string}`,
    abi: SURVEY_ABI,
    functionName: 'targetNumber',
    args: [],
  });

  const [counts, setCounts] = useState<number[][]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  const countAnswers = () => {
    // 0:[1,0,0] --> 0:[1,0,0]
    // 1:[0,0,1]
    if (!target) return;
    return surveyData?.map((q, i) => {
      const count = Array.from({ length: q.options.length }).fill(
        0
      ) as number[];
      answers?.forEach((answer) => count[answer.answers[i]]++);
      // return count;
      return count.map((n) => (n / Number(target)) * 100);
    });
  };

  useEffect(() => {
    if (!answers || !surveyData || !address) {
      return;
    }
    for (const answer of answers) {
      if (answer.respondent === address) {
        setCounts(countAnswers() || []);
        setIsAnswered(true);
        return;
      }
    }
  }, [answers, address, target]);

  return (
    <div className="grid grid-cols-3 w-screen gap-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="font-extrabold text-3xl">
            Sample Survey
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        {isAnswered ? (
          <CardContent className="overflow-y-auto h-[70vh]">
            <h1 className="font-semibold text-xl pb-4">Survey Progress</h1>
            <div className="gap-5 grid grid-cols-2">
              {surveyData?.map((q, i) => (
                <div key={i} className="flex flex-col">
                  <h1 className="font-bold text-sm pb-2">{q.question}</h1>
                  <div className="flex flex-col pl-2 gap-1">
                    {q.options.map((o, j) => (
                      <div
                        key={j}
                        className="flex flex-row justify-center items-center relative"
                      >
                        <div className="left-2 absolute text-xs font-semibold">
                          {o}
                        </div>
                        <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-400 h-5 rounded-full"
                            style={{ width: `${counts[i][j]}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <Form method="post" className="grid grid-cols-2" onSubmit={submitAnswer}>
              {surveyData?.map((q, i) => (
                <div key={i} className="flex flex-col">
                  <span className="mt-5 mb-1">{q.question}</span>
                  {q.options.map((o, j) => (
                    <label key={j} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={i.toString()}
                        value={j.toString()}
                        className="hidden peer"
                      />
                      <span className="w-4 h-4 rounded-full border-2 peer-checked:bg-primary peer-checked:border-primary" />
                      {o}
                    </label>
                  ))}
                </div>
              ))}
            </Form>
          </CardContent>
        )}
        <CardFooter className="justify-between">
          <p className="text-xs text-muted-foreground">
            10 questions · about 3 minutes
          </p>
          <Button>Submit Survey</Button>
        </CardFooter>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Live Chat</CardTitle>
          <CardDescription>
            Ask questions while answering the survey.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[62vh] flex-col gap-5 overflow-y-auto">
          {Array.from({ length: 12 }).map((_, index) => (
            <MessageBubble key={index} sender={index % 2 === 0} />
          ))}
        </CardContent>
        <CardFooter className="w-full">
          <Form className="relative flex w-full flex-row items-center">
            <input
              type="text"
              placeholder="type a message..."
              className="h-10 w-full rounded-full border border-border bg-background px-4 pr-12 text-xs outline-none transition-colors focus:border-primary/50"
            />
            <Button
              size="icon-xs"
              className="absolute right-2 flex flex-row items-center justify-center rounded-full"
            >
              <SendIcon />
            </Button>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
