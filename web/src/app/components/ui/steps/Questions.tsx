"use client";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/app/components/ui/shadcn/form";
import {RadioGroup, RadioGroupItem,} from "@/app/components/ui/shadcn/radio-group";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Card, CardContent} from "@/app/components/ui/shadcn/card";
import {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from "react";
import {Conversation, Question,} from "@/app/library/objects/types";
import {getQuestionList} from "@/app/library/services/question_service";
import {updateConversation} from "@/app/library/services/conversation_service";

const formSchema = z.object({
  answers: z.record(
    z.string(),
    z
      .object({
        choice_id: z.string(),
        question_id: z.string(),
      })
      .nullable()
  ),
});

type FormSchema = z.infer<typeof formSchema>;

// Define the methods you want to expose
export interface QuestionsRef {
  stepperSubmit: () => void;
}

interface QuestionsProps {
  userToken: string;
  productId: string;
  conversationId: string;
  conversation?: Conversation;
  locale: string;
  onConversationChange: (conversation: Conversation) => void,
  onLoadingChange: (isLoading: boolean) => void;
  onStepChange: (step: number) => void;
}

export const Questions = forwardRef<QuestionsRef, QuestionsProps>(({
                                                                     userToken,
                                                                     productId,
                                                                     conversationId,
                                                                     conversation,
                                                                     locale,
                                                                     onConversationChange,
                                                                     onLoadingChange,
                                                                     onStepChange,
                                                                   }, ref) => {
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [visibleQuestions, setVisibleQuestions] = useState<Set<string>>(new Set());
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {answers: {}},
  });

  // Helper: Parse conversation answers JSON safely
  const parseConversationAnswers = (answersStr?: string) => {
    if (!answersStr) return {};
    try {
      const formatted = answersStr
        .replace(/'/g, '"')
        .replace(/None/g, "null")
        .replace(/True/g, "true")
        .replace(/False/g, "false");
      return JSON.parse(formatted);
    } catch {
      return {};
    }
  };

  // Helper: Find root question
  const getRootQuestion = useCallback(
    () => questionList.find((q) => q.showDefault),
    [questionList]
  );

  // Helper: Get visible question chain based on choices
  const getVisibleChain = useCallback(
    (rootId: string, choices: Record<string, string>): Set<string> => {
      const chain = new Set<string>();
      let currentId = rootId;
      while (currentId) {
        chain.add(currentId);
        const q = questionList.find((q) => q.documentId === currentId);
        if (!q) break;
        const selectedChoiceId = choices[currentId];
        const selectedChoice = q.choices?.find(
          (c) => c.id.toString() === selectedChoiceId
        );
        if (selectedChoice?.question) {
          currentId = selectedChoice.question.documentId;
        } else {
          break;
        }
      }
      return chain;
    },
    [questionList]
  );

  // Helper: Recursively clear downstream answers
  const clearDownstreamAnswers = useCallback(
    (questionId: string, updatedChoices: Record<string, string>) => {
      const q = questionList.find((q) => q.documentId === questionId);
      if (!q) return;
      const selectedChoiceId = updatedChoices[questionId];
      const selectedChoice = q.choices?.find(
        (c) => c.id.toString() === selectedChoiceId
      );
      if (selectedChoice?.question) {
        const nextQuestionId = selectedChoice.question.documentId;
        form.setValue(`answers.${nextQuestionId}`, null);
        delete updatedChoices[nextQuestionId];
        clearDownstreamAnswers(nextQuestionId, updatedChoices);
      }
    },
    [form, questionList]
  );

  // Handle choice change
  const handleChoiceChange = useCallback(
    (questionId: string, choiceId: string) => {
      const newChoices = {...selectedChoices, [questionId]: choiceId};
      clearDownstreamAnswers(questionId, newChoices);

      form.setValue(`answers.${questionId}`, {
        choice_id: choiceId,
        question_id: questionId,
      });

      const rootQuestion = getRootQuestion();
      if (!rootQuestion) return;

      const newVisibleQuestions = getVisibleChain(
        rootQuestion.documentId,
        newChoices
      );

      // Remove answers for now-invisible questions
      const currentAnswers = form.getValues().answers || {};
      Object.keys(currentAnswers).forEach((answerId) => {
        if (!newVisibleQuestions.has(answerId)) {
          form.setValue(`answers.${answerId}`, null);
          delete newChoices[answerId];
        }
      });

      setSelectedChoices(newChoices);
      setVisibleQuestions(newVisibleQuestions);
    },
    [
      selectedChoices,
      clearDownstreamAnswers,
      form,
      getRootQuestion,
      getVisibleChain,
    ]
  );

  // Fetch questions and initialize state
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await getQuestionList(productId, locale);
        if (!questions?.length) {
          toast.error("No questions found, please try again");
          return;
        }
        setQuestionList(questions);

        const rootQuestion = questions.find((q) => q.showDefault);
        const initialVisible = rootQuestion
          ? new Set([rootQuestion.documentId])
          : new Set<string>();

        let initialChoices = {...selectedChoices};
        const answers = parseConversationAnswers(conversation?.answers);

        questions.forEach((question) => {
          const questionId = question.documentId;
          const answer = answers[questionId];
          if (answer) {
            initialVisible.add(questionId);
            initialChoices = {...initialChoices, [questionId]: answer.choice_id};
            question.showDefault = true;
            form.setValue(`answers.${questionId}`, {
              choice_id: answer.choice_id,
              question_id: questionId,
            });
          }
        });

        setSelectedChoices(initialChoices);
        setVisibleQuestions(initialVisible);
      } catch (error) {
        console.error("Failed to fetch questions: ", error);
        toast.error(
          "Failed to fetch questions: " +
          (error instanceof Error ? error.message : String(error))
        );
      }
    };
    fetchQuestions();
  }, [locale, productId, conversation]);

  // Handle form submission
  const stepperSubmit = async () => {
    try {
      onLoadingChange(true)
      const data = form.getValues();
      const conversationName = conversation?.name;
      if (!conversationName) {
        toast.warning("Please enter a valid conversation name");
        return;
      }
      const result = await updateConversation(
        userToken,
        productId,
        conversationId,
        conversationName,
        1,
        data.answers
      );
      if (!result) {
        toast.error("Submit failed, Please try again later");
        return;
      }
      onConversationChange(result)
      toast.success("Submit successfully.");
      onStepChange(1);
    } finally {
      onLoadingChange(false)
    }
  };

  // Expose the method via ref
  useImperativeHandle(ref, () => ({
    stepperSubmit
  }));

  // Sort questions to display non-default questions first
  const sortedQuestionList = [...questionList].sort((a, b) => {
    if (a.showDefault && !b.showDefault) return -1;
    if (!a.showDefault && b.showDefault) return 1;
    return 0;
  });

  return (
    <Card className="mb-4">
      <CardContent>
        <Form {...form}>
          <form
            className="w-2/3 space-y-6"
          >
            {sortedQuestionList.map((question) =>
              visibleQuestions.has(question.documentId) ? (
                <FormField
                  key={question.documentId}
                  control={form.control}
                  name={`answers.${question.documentId}`}
                  render={({field}) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{question.title}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) =>
                            handleChoiceChange(question.documentId, value)
                          }
                          value={field.value?.choice_id || ""}
                          className="flex flex-col space-y-1"
                        >
                          {question.choices?.map((choice) => (
                            <FormItem
                              key={choice.id}
                              className="flex items-center space-x-3 space-y-0"
                            >
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
              ) : null
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

Questions.displayName = "Questions"