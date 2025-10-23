import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Do I need teaching experience?",
    answer:
      "Experience is helpful but not required. We support new teachers with free pre-placement coaching.",
    value: "item-1",
  },
  {
    question: "Where can I work through KTECCS?",
    answer:
      "We offer teaching jobs in Thailand and skilled positions in Poland and Germany. Visa support is also available for Europe, Korea, and Dubai.",
    value: "item-2",
  },
  {
    question: "Do you help with visas and permits?",
    answer:
      "Yes. We manage all required documents, including visa applications, work permits, and teaching licenses.",
    value: "item-3",
  },
  {
    question: "Is your service free to use?",
    answer:
      "Job placement is free for applicants. Some travel and visa services may include a processing fee.",
    value: "item-4",
  },
  {
    question: "What support is available after placement?",
    answer:
      "We provide ongoing help, including accommodation support, flight advice, and emergency assistance when needed.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id='faq' className='container md:w-[700px] py-24 sm:py-32'>
      <div className='text-center mb-8'>
        <h2 className='text-lg text-primary text-center mb-2 tracking-wider'>
          FAQS
        </h2>

        <h2 className='text-3xl md:text-4xl text-center font-bold'>
          Common Questions
        </h2>
      </div>

      <Accordion type='single' collapsible className='AccordionRoot'>
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className='text-left'>
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
