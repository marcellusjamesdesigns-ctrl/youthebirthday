interface FAQSectionProps {
  heading?: string;
  questions: { question: string; answer: string }[];
}

export function FAQSection({ heading, questions }: FAQSectionProps) {
  return (
    <section className="space-y-5">
      {heading && (
        <h2 className="heading-editorial text-xl sm:text-2xl">{heading}</h2>
      )}
      <div className="space-y-2">
        {questions.map((faq) => (
          <details
            key={faq.question}
            className="lift-card p-5 group"
          >
            <summary className="font-medium text-sm cursor-pointer list-none flex items-center justify-between gap-3 text-foreground/80 hover:text-foreground transition-colors">
              <span className="flex-1">{faq.question}</span>
              <span
                aria-hidden="true"
                className="text-muted-foreground/55 transition-transform group-open:rotate-180 text-sm shrink-0 leading-none"
              >
                ▾
              </span>
            </summary>
            <p
              className="text-sm text-muted-foreground mt-3 leading-relaxed prose-links max-w-[62ch]"
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />
          </details>
        ))}
      </div>
    </section>
  );
}
