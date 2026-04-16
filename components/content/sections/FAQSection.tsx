interface FAQSectionProps {
  heading?: string;
  questions: { question: string; answer: string }[];
}

export function FAQSection({ heading, questions }: FAQSectionProps) {
  return (
    <section className="space-y-5">
      {heading && (
        <h2 className="heading-editorial text-2xl sm:text-3xl">{heading}</h2>
      )}
      <div className="space-y-2">
        {questions.map((faq) => (
          <details
            key={faq.question}
            className="lift-card p-5 group"
          >
            <summary className="font-medium text-sm cursor-pointer list-none flex items-center justify-between text-foreground/80 hover:text-foreground transition-colors">
              {faq.question}
              <span className="text-muted-foreground/40 transition-transform group-open:rotate-180 text-xs">
                +
              </span>
            </summary>
            <p
              className="text-sm text-muted-foreground mt-3 leading-relaxed prose-links"
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />
          </details>
        ))}
      </div>
    </section>
  );
}
