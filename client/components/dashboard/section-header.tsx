type sectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function SectionHeader({ title, subtitle }: sectionHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
    </div>
  );
}
