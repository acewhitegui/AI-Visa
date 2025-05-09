"use client";
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/shadcn/form";
import {RadioGroup, RadioGroupItem} from "@/app/components/ui/shadcn/radio-group";
import {Button} from "@/app/components/ui/shadcn/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import {toast} from "sonner";
import {Card, CardContent} from "@/app/components/ui/shadcn/card";
import {useEffect, useState} from "react";
import {Choice, Question} from "@/app/library/objects/types";
import {getQuestionList} from "@/app/library/services/question_service";

export function Questions({productId, locale}: {
  userToken: string;
  productId: string;
  conversationId: string
  locale: string;
}) {
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [visibleQuestions, setVisibleQuestions] = useState<Set<string>>(new Set());
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});

  const formSchema = z.object({
    answers: z.record(z.string())
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: {}
    }
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast.info("You submitted the following values: " + JSON.stringify(data, null, 2))
  }

  // 获取问题列表
  useEffect(() => {
    const fetchQuestionList = async () => {
      const questions: Question[] = await getQuestionList(productId, locale);
      if (!questions || questions.length === 0) {
        toast.error("No questions found, please try again")
        return
      }
      // 找到第一个根问题（链式结构只允许一个入口）
      const rootQuestion = questions.find(q => q.showDefault);
      setQuestionList(questions);
      setVisibleQuestions(rootQuestion ? new Set([rootQuestion.documentId]) : new Set());
    };
    fetchQuestionList();
  }, [locale, productId]);

  // 递归清除下游所有相关问题的答案
  const clearDownstreamAnswers = (questionId: string, updatedSelectedChoices: Record<string, string>) => {
    const q = questionList.find(q => q.documentId === questionId);
    if (!q) return;
    const selectedChoiceId = updatedSelectedChoices[questionId];
    const selectedChoice = q.choices?.find(c => c.id.toString() === selectedChoiceId);
    if (selectedChoice && selectedChoice.question) {
      const nextQuestionId = selectedChoice.question.documentId;
      // 清除下游答案
      form.setValue(`answers.${nextQuestionId}`, "");
      delete updatedSelectedChoices[nextQuestionId];
      clearDownstreamAnswers(nextQuestionId, updatedSelectedChoices);
    }
  };

  // 计算链路上所有可见问题
  const getVisibleChain = (rootId: string, choices: Record<string, string>): Set<string> => {
    const chain = new Set<string>();
    let currentId = rootId;
    while (currentId) {
      chain.add(currentId);
      const q = questionList.find(q => q.documentId === currentId);
      if (!q) break;
      const selectedChoiceId = choices[currentId];
      const selectedChoice = q.choices?.find(c => c.id.toString() === selectedChoiceId);
      if (selectedChoice && selectedChoice.question) {
        currentId = selectedChoice.question.documentId;
      } else {
        break;
      }
    }
    return chain;
  };

  const handleChoiceChange = (questionId: string, choiceId: string) => {
    // 更新选择
    const newSelectedChoices = {...selectedChoices, [questionId]: choiceId};

    // 清除下游所有相关问题的答案
    clearDownstreamAnswers(questionId, newSelectedChoices);

    // 更新表单值
    form.setValue(`answers.${questionId}`, choiceId);

    // 找到根问题
    const rootQuestion = questionList.find(q => q.showDefault);
    if (!rootQuestion) return;

    // 计算链路上所有可见问题
    const newVisibleQuestions = getVisibleChain(rootQuestion.documentId, newSelectedChoices);

    // 清除不可见问题的答案
    const currentAnswers = form.getValues().answers;
    Object.keys(currentAnswers).forEach(answerId => {
      if (!newVisibleQuestions.has(answerId)) {
        form.setValue(`answers.${answerId}`, "");
        delete newSelectedChoices[answerId];
      }
    });

    setSelectedChoices({...newSelectedChoices});
    setVisibleQuestions(newVisibleQuestions);
  };

  return (
    <Card className="mb-4">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            {questionList.map((question: Question) => {
              if (!visibleQuestions.has(question.documentId)) {
                return null;
              }
              return (
                <FormField
                  key={question.documentId}
                  control={form.control}
                  name={`answers.${question.documentId}`}
                  render={({field}) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{question.title}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleChoiceChange(question.documentId, value);
                          }}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {question?.choices?.map((choice: Choice) => (
                            <FormItem key={choice.id} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={choice.id.toString()}/>
                              </FormControl>
                              <FormLabel className="font-normal">
                                {choice.title}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              );
            })}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
