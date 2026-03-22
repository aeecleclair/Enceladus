interface CardTemplateProps {
  children?: React.ReactNode;
}

export const CardTemplate = ({ children }: CardTemplateProps) => {
  return (
    <div className="grid gap-4 h-full p-4">{children}</div>
  );
};
