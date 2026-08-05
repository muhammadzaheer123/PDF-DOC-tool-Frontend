import { notFound } from "next/navigation";
import { TOOLS, getToolBySlug } from "@/lib/config/tools.config";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";

type ToolPageParams = Promise<{ slug: string }>;

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: ToolPageParams }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — DocuForge`,
    description: tool.shortDescription,
  };
}

export default async function ToolPage({ params }: { params: ToolPageParams }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return <ToolPageLayout tool={tool} />;
}
