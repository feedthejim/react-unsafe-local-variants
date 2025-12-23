"use client";

export default function ViewModeControls() {
  const setCookie = (value: string) => {
    document.cookie = `view_mode=${value};path=/;max-age=31536000`;
    location.reload();
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {["grid", "list", "compact"].map((value) => (
        <button
          key={value}
          onClick={() => setCookie(value)}
          className="button"
        >
          {value}
        </button>
      ))}
    </div>
  );
}
