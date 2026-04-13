interface ParagraphSectionProps {
  heading?: string;
  body: string;
}

export function ParagraphSection({ heading, body }: ParagraphSectionProps) {
  return (
    <section className="space-y-4">
      {heading && (
        <h2 className="heading-editorial text-2xl sm:text-3xl">{heading}</h2>
      )}
      <p className="text-muted-foreground leading-relaxed">{body}</p>
    </section>
  );
}
