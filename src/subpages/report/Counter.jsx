import { use, useEffect, useState } from "react";

function Counter() {


  const [loading, setloading] = useState(false)
  const [error, setError] = useState("");

  return (
    <form >
      <input
        type="text"
        placeholder="Enter name"
      />

      <input
        type="email"
        placeholder="Enter email"
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}

export default Counter;
