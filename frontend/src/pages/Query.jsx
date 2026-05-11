import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from '../api/client'


export default function Query() {
  const [sql, setSql] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeQuery = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/query",
        { sql: sql },
      );

      setRows(response.data.rows || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        err.message ||
        "Unknown error"
      );

      setRows([]);
    }

    setLoading(false);
  };

  const renderTable = () => {
    if (rows.length === 0) {
      return <p>No results</p>;
    }

    const columns = Object.keys(rows[0]);

    return (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td
                  key={col}
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                  }}
                >
                  {String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1>SQL Query Console</h1>

      <textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        placeholder="Enter SQL query..."
        rows={8}
        style={{
          width: "100%",
          fontFamily: "monospace",
          fontSize: "1rem",
          padding: "1rem",
          marginTop: "1rem",
        }}
      />

      <button
        onClick={executeQuery}
        disabled={loading}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          cursor: "pointer",
        }}
      >
        {loading ? "Running..." : "Execute Query"}
      </button>

      {error && (
        <div
          style={{
            marginTop: "1rem",
            color: "red",
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        {renderTable()}
      </div>
    </div>
  );
}
