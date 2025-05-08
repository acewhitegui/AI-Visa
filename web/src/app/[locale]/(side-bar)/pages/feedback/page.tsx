"use server";
import "@/app/assets/css/youtrack.css";
import {YoutrackForm} from "@/app/components/ui/youtrack";
import {Props} from "@/app/library/objects/props";

export default async function FeedbackForm({params}: Props) {
  const {locale} = await params;

  const langCode = locale.slice(0, 2)

  return (
    <>
      <YoutrackForm lang={langCode}/>
    </>
  )
}
