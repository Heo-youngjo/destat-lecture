import { Button } from '~/components/ui/button';
import { Form, useNavigate } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { useEffect, useState } from 'react';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { SURVEY_FACTORY, SURVEY_FACTORY_ABI } from '../constant';
import { decodeEventLog, parseEther } from 'viem';
import { supabase } from '~/postgres/supaclient';

export default function CreateSurvey() {
  const [options, setOptions] = useState([1]);
  const [image, setImage] = useState('');
  const [formImage, setFormImage] = useState<File | null>(null);
  const { data: hash, writeContract } = useWriteContract();
  const { data: receipt, isFetched } = useWaitForTransactionReceipt({
    hash,
  });
  const navigate = useNavigate();
  const [surveyMeta, setSurveyMeta] = useState<{
    title: string;
    description: string;
    targetNumber: string;
    rewardAmount: number;
    questions: readonly {
      readonly question: string;
      readonly options: readonly string[];
    }[];
    owner: `0x${string}` | undefined;
  } | null>(null);
  const { address } = useAccount();

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImage('');
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };
  const addQuestion = () => {
    setOptions([...options, 1]);
  };
  const deleteQuestion = () => {
    if (options.length <= 1) return;
    setOptions(options.slice(0, options.length - 1));
  };
  const addOption = (i: number) => {
    setOptions(options.map((o, j) => (i === j ? o + 1 : o)));
  };
  const deleteOption = (i: number) => {
    if (options[i] <= 1) return;
    setOptions(options.map((o, j) => (i === j ? o - 1 : o)));
  };

  const createSurvey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const questionsData = formData.getAll('q') as string[];
    const questions = questionsData.map((q, i) => {
      const options = formData.getAll(i.toString()) as string[];
      return {
        question: q,
        options,
      } as const;
    });
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const targetNumber = formData.get('target') as string;
    const poolSize = formData.get('pool') as string;
    const formImg = formData.get('file') as File;
    if (formImg && formImg.size > 0) setFormImage(formImg);
    writeContract({
      address: SURVEY_FACTORY,
      abi: SURVEY_FACTORY_ABI,
      functionName: 'createSurvey',
      args: [
        {
          title,
          description,
          targetNumber: BigInt(targetNumber),
          questions,
        },
      ],
      value: parseEther(poolSize),
    });
    setSurveyMeta({
      title,
      description,
      targetNumber,
      rewardAmount: Number(poolSize) / Number(targetNumber),
      questions,
      owner: address,
    });
  };
  useEffect(() => {
    if (!isFetched || !receipt || !surveyMeta) return;
    const callAction = async () => {
      let contractAddress: `0x${string}` | undefined;
      for (const log of receipt?.logs ?? []) {
        try {
          const event = decodeEventLog({
            abi: SURVEY_FACTORY_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (event.eventName === 'SurveyCreated') {
            contractAddress = (event.args as any).surveyAddress;
          }
        } catch {}
      }
      if (!contractAddress) return;

      let imageUrl = '';
      if (formImage && formImage.size > 0) {
        const { data: uploadData, error: uploadError } = await supabase
          .storage.from('images')
          .upload(contractAddress, formImage);
        if (!uploadError && uploadData) {
          imageUrl = supabase.storage.from('images').getPublicUrl(uploadData.path).data.publicUrl;
        }
      }

      await (supabase as any).from('survey').insert({
        id: contractAddress,
        title: surveyMeta.title,
        description: surveyMeta.description,
        target_number: Number(surveyMeta.targetNumber),
        reward_amount: surveyMeta.rewardAmount,
        image: imageUrl,
        questions: surveyMeta.questions,
        owner: surveyMeta.owner,
      });

      await (supabase as any).from('daily_live_survey').insert({ count: 1 });

      navigate('/survey/all');
    };
    callAction();
  }, [receipt]);

  return (
    <div className="flex justify-center w-full">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create Survey</CardTitle>
          <CardDescription>
            Build and publish a new survey to collect reliable responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={(e) => createSurvey(e)} encType="multipart/form-data">
            <label className="flex flex-col mb-4">
              <h1 className="font-bold mb-2">Title</h1>
              <Input type="text" name="title" defaultValue="Sample Survey" />
            </label>

            <label className="flex flex-col mb-4">
              <h1 className="font-bold mb-2">Description</h1>
              <Input
                type="text"
                name="description"
                defaultValue="This is a sample survey"
              />
            </label>

            <label className="flex flex-col mb-4">
              <h1 className="font-bold mb-2">Target Number</h1>
              <Input type="number" name="target" defaultValue="100" />
            </label>

            <label className="flex flex-col mb-4">
              <h1 className="font-bold mb-2">Reward Pool Size</h1>
              <Input type="number" name="pool" placeholder="ex) 50(ETH)" />
            </label>

            <h1 className="font-bold mb-2">Questions</h1>
            {options.map((n, i) => (
              <div key={i} className="my-4">
                <Input type="text" placeholder="Question" name="q" />
                <div className="ml-8 mt-2 space-y-2">
                  {Array.from({ length: n }).map((_, j) => (
                    <div key={j} className="flex items-center">
                      {j === n - 1 && j !== 0 ? (
                        <Button
                          type="button"
                          onClick={() => deleteOption(i)}
                          className="h-8 w-8 rounded-full mr-1 bg-red-200"
                        >
                          -
                        </Button>
                      ) : (
                        <div className="h-8 w-8 rounded-full mr-1" />
                      )}
                      <Input
                        type="text"
                        placeholder="Option"
                        name={i.toString()}
                      />
                      {j === n - 1 && (
                        <Button
                          type="button"
                          onClick={() => addOption(i)}
                          className="h-8 w-8 rounded-full ml-1 bg-gray-300"
                        >
                          +
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-center items-center mb-4">
              <Button
                type="button"
                onClick={() => deleteQuestion()}
                className="h-8 w-8 rounded-full mr-1 bg-red-200"
              >
                -
              </Button>
              <Button
                type="button"
                onClick={() => addQuestion()}
                className="h-8 w-8 rounded-full mr-1 bg-gray-300"
              >
                +
              </Button>
            </div>

            <div className="space-y-3 mb-4">
              <h1 className="font-bold">Upload File</h1>
              <Input
                type="file"
                name="file"
                accept="image/*"
                onChange={(e) => uploadFile(e)}
              />
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-inner">
                <div className="flex aspect-[4/3] items-center justify-center">
                  {image ? (
                    <img
                      src={image}
                      alt="Survey preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl text-muted-foreground">
                      +
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button type="submit">Create</Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
