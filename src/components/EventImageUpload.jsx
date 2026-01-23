import { useEffect, useMemo } from "react";

function EventImageUpload({ value, onChange }) {
  const previewUrl = useMemo(() => {
    if (!value) return null;

    // 1️⃣ If value is already a URL string (edit mode)
    if (typeof value === "string") {
      return value;
    }

    // 2️⃣ If value is a File (create/update)
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    return null;
  }, [value]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (value instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [value, previewUrl]);

  return (
    <div>
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="event"
          style={{ width: "100%", height: 280, objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed #ccc",
          }}
        >
          No image selected
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files[0])}
      />
    </div>
  );
}

export default EventImageUpload;
