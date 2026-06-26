export default function SectionHeader({
  title,
  description,
}) {
  return (
    <div
      style={{
        marginBottom: "10px",
        paddingLeft: "4px",
      }}
    >
      <h1
        style={{
          fontSize: "1.85rem",
          fontWeight: "800",
          fontFamily: "var(--font-display)",
          marginBottom: "8px",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: "0.95rem",
          color: "var(--text-secondary)",
          lineHeight: "1.6",
          maxWidth: "800px",
        }}
      >
        {description}
      </p>
    </div>
  );
}
