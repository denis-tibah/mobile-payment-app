import Typography from "../Typography";

const displayTitle = ({ title }: { title: string }) => {
  return (
    <Typography
      color="#086AFB"
      fontFamily="Nunito-Bold"
      fontSize={12}
      fontWeight={600}
    >
      {title}
    </Typography>
  );
};

const displayValue = ({ content }: { content: string | null }) => {
  return (
    <Typography
      color="#000"
      fontFamily="Nunito-SemiBold"
      fontSize={14}
      fontWeight={600}
    >
      {content}
    </Typography>
  );
};

export { displayTitle, displayValue };
