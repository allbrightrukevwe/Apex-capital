import { ReactNode } from "react";

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
}

export default function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center pb-4 border-b border-light-200 dark:border-dark-200/50">
      {icon}
      <h3 className="text-base font-bold text-dark dark:text-white">{title}</h3>
    </div>
  );
}