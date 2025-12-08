'use client';
import React, { use, useState,useEffect } from "react";

const QuestionGeneratorUI = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState(null);
  const [subject, setSubject] = useState("");
   const [editing, setEditing] = useState({ section: "", index: null });
  const [tempData, setTempData] = useState({});

  useEffect(() => { 
    const sub = localStorage.getItem("subject");
    if (sub) setSubject(sub);
  }, []);

  const handleSave = async () => {
    if (!paper) return;
    sessionStorage.setItem("tempPaper", JSON.stringify(paper));
    window.alert("The AI generated questions are saved!");
    window.location.href="/create-paper";
  };
  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setPaper(null);
    try {
      const response = await fetch("/api/getAIpapers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject, topic: topic}),
      });
      const res=await response.json();
     
    //   const mockAPI = new Promise((resolve) =>
    //   setTimeout(
    //     () =>
    //       resolve({
    //         mcq: [
    //           {
    //             question: `Which of the following best describes ${topic}?`,
    //             options: [
    //               "A. A computing service model",
    //               "B. A storage device",
    //               "C. A networking cable",
    //               "D. A local database",
    //             ],
    //             answer: "A. A computing service model",
    //             marks: "2",
    //           },
    //           {
    //             question: `What is a key advantage of ${topic}?`,
    //             options: [
    //               "A. Reduced scalability",
    //               "B. Increased flexibility",
    //               "C. More manual control",
    //               "D. Higher latency",
    //             ],
    //             answer: "B. Increased flexibility",
    //             marks: "2",
    //           },
    //         ],
    //         descriptive: [
    //           {
    //             question: `Explain how ${topic} has revolutionized education technology.`,
    //             answer: `${topic} enables scalable, flexible access to resources and supports adaptive learning.`,
    //             marks: "5",
    //           },
    //           {
    //             question: `Discuss the challenges associated with implementing ${topic}.`,
    //             answer: `Key challenges include cost, integration, and user adaptation.`,
    //             marks: "5",
    //           },
    //         ],
    //       }),
    //     1200
    //   )
    // );

    // const response = await mockAPI;
    setPaper(res);
    setLoading(false);
  } catch (error) {
      console.error("Error generating questions:", error);
      setLoading(false);
    }
  };

  // --- Edit, Save, Cancel, Delete ---
  const startEdit = (section, index) => {
    setEditing({ section, index });
    const target = paper[section][index];
    setTempData(JSON.parse(JSON.stringify(target)));
  };

  const handleChange = (field, value, optionIndex) => {
    if (optionIndex !== undefined) {
      const updatedOptions = [...tempData.options];
      updatedOptions[optionIndex] = value;
      setTempData({ ...tempData, options: updatedOptions });
    } else {
      setTempData({ ...tempData, [field]: value });
    }
  };

  const saveEdit = () => {
    const updatedPaper = { ...paper };
    updatedPaper[editing.section][editing.index] = tempData;
    setPaper(updatedPaper);
    setEditing({ section: "", index: null });
    setTempData({});
  };

  const cancelEdit = () => {
    setEditing({ section: "", index: null });
    setTempData({});
  };

  const deleteQuestion = (section, index) => {
    const updatedPaper = { ...paper };
    updatedPaper[section] = updatedPaper[section].filter((_, i) => i !== index);
    setPaper(updatedPaper);
  };

  // --- Styles ---
  const styles = {
    page: {
      minHeight: "100vh",
      background: "radial-gradient(circle at top left, #111827, #0f172a 70%)",
      color: "#e2e8f0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Segoe UI, Roboto, sans-serif",
      padding: "20px",
    },
    container: {
      width: "100%",
      maxWidth: "800px",
      background: "rgba(17, 24, 39, 0.9)",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
      padding: "40px",
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(10px)",
    },
    title: {
      textAlign: "center",
      fontSize: "2rem",
      fontWeight: "700",
      color: "#f8fafc",
      marginBottom: "10px",
    },
    subtitle: {
      textAlign: "center",
      color: "#cbd5e1",
      fontSize: "1rem",
      marginBottom: "40px",
      lineHeight: "1.6",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "10px",
      border: "1px solid #334155",
      outline: "none",
      color: "#f8fafc",
      background: "#1e293b",
      marginBottom: "20px",
      fontSize: "1rem",
    },
    button: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "10px",
      border: "none",
      color: "white",
      background: "linear-gradient(90deg, #3b82f6, #2563eb)",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    sectionTitle: {
      fontSize: "1.3rem",
      fontWeight: "600",
      color: "#60a5fa",
      marginBottom: "10px",
      marginTop: "35px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      paddingBottom: "4px",
    },
    questionCard: {
      background: "linear-gradient(145deg, #1e293b, #111827)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      padding: "20px",
      marginTop: "15px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    questionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    badge: {
      background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
      color: "white",
      borderRadius: "20px",
      padding: "4px 12px",
      fontSize: "0.8rem",
      fontWeight: "600",
      letterSpacing: "0.3px",
    },
    questionText: {
      color: "#f1f5f9",
      fontSize: "1rem",
      fontWeight: "600",
      marginBottom: "10px",
    },
    answerBox: {
      background: "rgba(255,255,255,0.05)",
      borderRadius: "8px",
      padding: "10px 12px",
      color: "#a5b4fc",
      fontSize: "0.95rem",
      marginTop: "8px",
    },
    marks: {
      fontSize: "0.85rem",
      color: "#9ca3af",
      marginTop: "4px",
    },
    editBtn: {
      padding: "6px 12px",
      borderRadius: "6px",
      border: "1px solid #475569",
      background: "rgba(255,255,255,0.05)",
      color: "#e2e8f0",
      cursor: "pointer",
      fontSize: "0.85rem",
      marginRight: "6px",
    },
    deleteBtn: {
      padding: "6px 12px",
      borderRadius: "6px",
      border: "1px solid #dc2626",
      background: "rgba(239, 68, 68, 0.15)",
      color: "#fca5a5",
      cursor: "pointer",
      fontSize: "0.85rem",
    },
    saveBtn: {
      padding: "6px 12px",
      border: "none",
      borderRadius: "6px",
      background: "linear-gradient(90deg, #3b82f6, #2563eb)",
      color: "white",
      cursor: "pointer",
      fontSize: "0.85rem",
      marginRight: "6px",
    },
    cancelBtn: {
      padding: "6px 12px",
      border: "1px solid #475569",
      borderRadius: "6px",
      background: "transparent",
      color: "#e2e8f0",
      cursor: "pointer",
      fontSize: "0.85rem",
    },
    textField: {
      width: "100%",
      background: "#1e293b",
      color: "#f8fafc",
      border: "1px solid #475569",
      borderRadius: "8px",
      padding: "8px",
      marginBottom: "8px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>AI Question Generator</h1>
        <p style={styles.subtitle}>
          Enter a topic and automatically generate MCQ and descriptive
          questions. Edit, delete, and review before saving.
        </p>

        <input
          type="text"
          placeholder="Enter topic (e.g., Cloud Computing)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleGenerate} style={styles.button}>
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        {loading && (
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid rgba(255,255,255,0.1)",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "20px auto",
            }}
          ></div>
        )}

        {!loading && paper && (
          <>
            {/* MCQ Section */}
            <h3 style={styles.sectionTitle}>Multiple Choice Questions</h3>
            {paper.mcq.map((item, idx) => (
              <div key={idx} style={styles.questionCard}>
                {editing.section === "mcq" && editing.index === idx ? (
                  <>
                    <input
                      style={styles.textField}
                      value={tempData.question}
                      onChange={(e) =>
                        handleChange("question", e.target.value)
                      }
                    />
                    {tempData.options.map((opt, i) => (
                      <input
                        key={i}
                        style={styles.textField}
                        value={opt}
                        onChange={(e) =>
                          handleChange("options", e.target.value, i)
                        }
                      />
                    ))}
                    <input
                      style={styles.textField}
                      value={tempData.answer}
                      onChange={(e) => handleChange("answer", e.target.value)}
                    />
                    <input
                      style={styles.textField}
                      value={tempData.marks}
                      type="number"
                      onChange={(e) => handleChange("marks", e.target.value)}
                    />
                    <div>
                      <button style={styles.saveBtn} onClick={saveEdit}>
                        Save
                      </button>
                      <button style={styles.cancelBtn} onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.questionHeader}>
                      <span style={styles.badge}>MCQ</span>
                      <div>
                        <button
                          style={styles.editBtn}
                          onClick={() => startEdit("mcq", idx)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteQuestion("mcq", idx)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p style={styles.questionText}>{item.question}</p>
                    <ul style={{ paddingLeft: "20px", color: "#cbd5e1" }}>
                      {item.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                    <div style={styles.answerBox}>
                      <strong>Answer:</strong> {item.answer}
                    </div>
                    <p style={styles.marks}>Marks: {item.marks}</p>
                  </>
                )}
              </div>
            ))}

            {/* Descriptive Section */}
            <h3 style={styles.sectionTitle}>Descriptive Questions</h3>
            {paper.descriptive.map((item, idx) => (
              <div key={idx} style={styles.questionCard}>
                {editing.section === "descriptive" && editing.index === idx ? (
                  <>
                    <input
                      style={styles.textField}
                      value={tempData.question}
                      onChange={(e) =>
                        handleChange("question", e.target.value)
                      }
                    />
                    <textarea
                      style={styles.textField}
                      rows="3"
                      value={tempData.answer}
                      onChange={(e) => handleChange("answer", e.target.value)}
                    />
                    <input
                      style={styles.textField}
                      type="number"
                      value={tempData.marks}
                      onChange={(e) => handleChange("marks", e.target.value)}
                    />
                    <div>
                      <button style={styles.saveBtn} onClick={saveEdit}>
                        Save
                      </button>
                      <button style={styles.cancelBtn} onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.questionHeader}>
                      <span style={styles.badge}>Descriptive</span>
                      <div>
                        <button
                          style={styles.editBtn}
                          onClick={() => startEdit("descriptive", idx)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteQuestion("descriptive", idx)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p style={styles.questionText}>{item.question}</p>
                    <div style={styles.answerBox}>
                      <strong>Answer:</strong> {item.answer}
                    </div>
                    <p style={styles.marks}>Marks: {item.marks}</p>
                  </>
                )}
              </div>
            ))}
          </>
        )}
        {paper && (
          <button onClick={handleSave} style={styles.button}>
          SAVE
        </button>
        )}
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            div[style*="questionCard"]:hover {
              transform: translateY(-3px);
              box-shadow: 0 6px 18px rgba(0,0,0,0.4);
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default QuestionGeneratorUI;
     
