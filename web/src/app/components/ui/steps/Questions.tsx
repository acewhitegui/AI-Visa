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

  // Create a dynamic form schema based on visible questions
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

  // Fetch question list
  useEffect(() => {
    const fetchQuestionList = async () => {
      const questions: Question[] = await getQuestionList(productId, locale);
      if (!questions || questions.length === 0) {
        toast.error("No questions found, please try again")
        return
      }

      // Find root questions (those that should be visible by default)
      const rootQuestions = new Set<string>();
      questions.forEach(question => {
        if (question.showDefault) {
          rootQuestions.add(question.documentId);
        }
      });

      setQuestionList(questions);
      console.log("questions load: ", JSON.stringify(questions))
      setVisibleQuestions(rootQuestions);
    };

    fetchQuestionList();
  }, [locale, productId]);

  const handleChoiceChange = (questionId: string, choiceId: string) => {
    // Update selected choices
    const newSelectedChoices = {...selectedChoices, [questionId]: choiceId};
    setSelectedChoices(newSelectedChoices);

    // Update form value
    form.setValue(`answers.${questionId}`, choiceId);

    // Calculate which questions should be visible based on the current selections
    const newVisibleQuestions = new Set<string>();

    // First add root questions
    questionList.forEach(question => {
      if (question.showDefault) {
        newVisibleQuestions.add(question.documentId);
      }
    });

    // Then add questions that should be visible based on selected choices
    Object.entries(newSelectedChoices).forEach(([qId, cId]) => {
      const q = questionList.find(q => q.documentId === qId);
      const c = q?.choices?.find(choice => choice.id.toString() === cId);

      if (c?.question) {
        newVisibleQuestions.add(c.question.documentId);
      }
    });

    // Clear form values for questions that are no longer visible
    const currentAnswers = form.getValues().answers;
    Object.keys(currentAnswers).forEach(answerId => {
      if (!newVisibleQuestions.has(answerId)) {
        form.setValue(`answers.${answerId}`, "");
        // Also remove from selectedChoices
        const updatedSelectedChoices = {...newSelectedChoices};
        delete updatedSelectedChoices[answerId];
        setSelectedChoices(updatedSelectedChoices);
      }
    });

    setVisibleQuestions(newVisibleQuestions);
  };

  return (
    <Card className="mb-4">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            {questionList.map((question: Question) => {
              // Only render questions that should be visible
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
