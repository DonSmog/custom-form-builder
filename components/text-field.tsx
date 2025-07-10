export const TextField = ({
  fontSize,
  content,
  fontWeight,
}: {
  fontWeight: string;
  fontSize: string;
  content: string;
}) => {
  return (
    <div
      className={`text-${fontSize} font-${fontWeight} text-gray-900`}
      style={{
        fontSize:
          fontSize === "xs"
            ? "12px"
            : fontSize === "sm"
            ? "14px"
            : fontSize === "base"
            ? "16px"
            : fontSize === "lg"
            ? "18px"
            : fontSize === "xl"
            ? "20px"
            : fontSize === "2xl"
            ? "24px"
            : fontSize === "3xl"
            ? "30px"
            : fontSize === "4xl"
            ? "36px"
            : "16px",
        fontWeight:
          fontWeight === "normal"
            ? "400"
            : fontWeight === "medium"
            ? "500"
            : fontWeight === "semibold"
            ? "600"
            : fontWeight === "bold"
            ? "700"
            : fontWeight === "extrabold"
            ? "800"
            : "400",
      }}
    >
      {content}
    </div>
  );
};
