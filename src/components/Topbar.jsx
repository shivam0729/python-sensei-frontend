export default function Topbar() {

  const email =
    localStorage.getItem(
      "user_email"
    );

  return (

    <div
      style={{
        background:
          "linear-gradient(135deg,#2563eb,#7c3aed)",

        color: "white",

        padding: "30px",

        borderRadius: "20px",

        marginBottom: "30px",

        boxShadow:
          "0 10px 30px rgba(0,0,0,0.15)",
      }}
    >

      <h1>
        Python Sensei
      </h1>

      <p
        style={{
          marginTop: "10px",
          opacity: 0.9,
        }}
      >
        Welcome back
        {email
          ? `, ${email}`
          : ""}
      </p>

      <p
        style={{
          marginTop: "8px",
          opacity: 0.8,
        }}
      >
        Your AI Career Assistant Platform
      </p>

    </div>

  );
}