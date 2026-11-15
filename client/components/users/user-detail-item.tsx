type Props = {
  label: string;
  value?: React.ReactNode;
};

export default function DetailItem({ label, value }: Props) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-white/50">{label}</p>

      <p>{value ?? '-'}</p>
    </div>
  );
}
