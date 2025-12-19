import { redirect } from "next/navigation";
import { generatePracticeTest } from "../actions";
import PracticeTaker from "@/components/exam/practice-taker";

export default async function PracticeTakePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const topic = params.topic as string;
    const count = Number(params.count) || 10;
    const time = Number(params.time) || 15;

    if (!topic) {
        redirect("/dashboard/study/practice");
    }

    const questions = await generatePracticeTest(topic, count);

    return (
        <PracticeTaker
            initialQuestions={questions}
            topic={topic}
            duration={time}
        />
    );
}
