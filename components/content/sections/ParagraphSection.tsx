interface ParagraphSectionProps {
  heading?: string;
  body: string;
}

/**
 * Paragraph section. `body` may contain safe inline HTML (<a>, <em>, <strong>).
 * Content is author-controlled and stored in server-side TypeScript registries
 * so there is no user input being rendered here.
 */
export function ParagraphSection({ heading, body }: ParagraphSectionProps) {
  return (
    <section className="space-y-4">
      {heading && (
        <h2 className="heading-editorial text-2xl sm:text-3xl">{heading}</h2>
      )}
      <p
        className="text-muted-foreground leading-relaxed prose-links"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </section>
  );
}
