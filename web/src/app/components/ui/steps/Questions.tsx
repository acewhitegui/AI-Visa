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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.info("You submitted the following values: " + JSON.stringify(data, null, 2))
  }

  // 获取问题列表
  useEffect(() => {
    const fetchQuestionList = async () => {
      const questions: Question[] = await getQuestionList(productId, locale);
      if (!questions) {
        toast.error("No conversation found, please try again")
        return
      }
      setQuestionList(questions);
    };

    fetchQuestionList();
  }, [locale, productId]);

  return (
    <Card className="mb-4">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            {
              questionList.map((question: Question) => {
                return (
                  <FormField
                    key={question.documentId}
                    control={form.control}
                    name="type"
                    render={({field}) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{question.title}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {
                              question?.choices?.map((choice: Choice) => {
                                return (
                                  <FormItem key={choice.id} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={choice.id.toString()}/>
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {choice.title}
                                    </FormLabel>
                                  </FormItem>
                                )
                              })
                            }
                          </RadioGroup>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                )
              })
            }
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

const FormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
})