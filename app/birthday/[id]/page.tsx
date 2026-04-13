import { getDb } from "@/lib/db";
import { birthdaySessions, birthdayGenerations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DashboardShell } from "./_components/DashboardShell";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const db = getDb();
  const session = await db
    .select()
    .from(birthdaySessions)
    .where(eq(birthdaySessions.id, id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!session) return { title: "Not Found" };

  return {
    title: `${session.name}'s Birthday | You The Birthday`,
    robots: { index: false, follow: false },
    openGraph: {
      images: [`/api/og/${id}`],
    },
  };
}

export default async function BirthdayPage({ params }: PageProps) {
  const { id } = await params;
  const db = getDb();

  const session = await db
    .select()
    .from(birthdaySessions)
    .where(eq(birthdaySessions.id, id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!session) notFound();

  const generation = await db
    .select()
    .from(birthdayGenerations)
    .where(eq(birthdayGenerations.sessionId, id))
    .orderBy(desc(birthdayGenerations.version))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  return (
    <DashboardShell
      session={session}
      initialGeneration={generation}
      sessionId={id}
    />
  );
}
