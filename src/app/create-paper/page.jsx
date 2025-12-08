'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CreateQuestionPaper = () => {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [classStream, setClassStream] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);
  
  const router = useRouter();

  // Fetch AI-generated data
  useEffect(() => {
    const aiQuestions = sessionStorage.getItem("tempPaper");
    if (aiQuestions) {
      const data = JSON.parse(aiQuestions);
      const merged = [
        ...(data.mcq?.map(q => ({ ...q, type: "mcq" })) || []),
        ...(data.descriptive?.map(q => ({ ...q, type: "descriptive" })) || []),
      ];
      setQuestions(merged);
      sessionStorage.removeItem("tempPaper");
    }
  }, []);

  const addQuestion = () => setShowTypeModal(true);
   const calculateTotalQuestionMarks = () => {
    return questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);
  };


  const handleAddQuestionWithType = (type) => {
    const currentTotalMarks = calculateTotalQuestionMarks();
    const remainingMarks = parseInt(totalMarks) - currentTotalMarks;

    if (questions.length > 0) {
      const lastQuestion = questions[questions.length - 1];
      if (
        lastQuestion.type === "mcq" &&
        (!Array.isArray(lastQuestion.options) || !lastQuestion.options.includes(lastQuestion.answer))
      ) {
        alert("The correct answer must match one of the options in the previous question!");
        setShowTypeModal(false);
        setPendingAdd(false); // <-- add here
        return;
      }
    }

    if (remainingMarks <= 0) {
      alert("Cannot add more questions. Total marks limit reached!");
      setShowTypeModal(false);
      setPendingAdd(false); // <-- add here
      return;
    }

    if (type === "mcq") {
      setQuestions([...questions, { type, question: "", options: ["", "", "", ""], answer: "", marks: "" }]);
    } else {
      setQuestions([...questions, { type, question: "", answer: "", marks: "" }]);
    }
    setShowTypeModal(false);
    setPendingAdd(false);
  };

  const updateQuestion = (i, key, value) => {
    const copy = [...questions];
    copy[i][key] = value;
    setQuestions(copy);
  };

  const deleteQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));

  const calculateTotalMarks = () =>
    questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentTotalMarks = calculateTotalQuestionMarks();
    const remainingMarks = parseInt(totalMarks) - currentTotalMarks;

   if (questions.length > 0) {
  const lastQuestion = questions[questions.length - 1];
  if (
    lastQuestion.type === "mcq" &&
    (!Array.isArray(lastQuestion.options) || !lastQuestion.options.includes(lastQuestion.answer))
  ) {
    alert("The correct answer must match one of the options in the previous question!");
    return;
  }
}
    
    if (remainingMarks > 0) {
      alert("Cannot submit the question paper! Please add more questions to reach the total marks limit!");
      return;
    }
    if(remainingMarks < 0) {
      alert("Total marks of questions exceed the specified total marks! Please adjust the marks.");
      return;
    }
    setLoading(true);

    const currentMarks = calculateTotalMarks();
    if (parseInt(totalMarks) > currentMarks) {
      alert("Please add enough questions to reach the total marks limit.");
      return;
    }
    try {
      setLoading(true);
      const subject = localStorage.getItem("subject");
      const res = await fetch("/api/createQuestionPaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, classStream, subject, totalMarks, timeLimit, questions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Question paper created successfully!");
      setTitle(""); setClassStream(""); setTotalMarks(""); setTimeLimit(""); setQuestions([]);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a1a1a, #2b2b2b)",
      color: "white",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
    }}>
      <style>{`
        @media (min-width: 1024px) {
          .mainLayout {
            display: flex;
            height: calc(100vh - 4rem);
            overflow: hidden;
          }
          .leftPane, .rightPane {
            flex: 1;
            overflow-y: auto;
            padding: 2rem;
          }
          .leftPane {
            border-right: 1px solid rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.03);
          }
          .actionBar {
            position: fixed;
            bottom: 1.2rem;
            right: 2rem;
            display: flex;
            gap: 1rem;
            padding: 0.75rem 1.25rem;
            background: rgba(20, 20, 20, 0.7);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }
        }
        @media (max-width: 1023px) {
          .mainLayout { display: block; }
          .leftPane, .rightPane { padding: 1rem; }
          .actionBar {
            position: static;
            margin: 1rem auto;
            justify-content: center;
          }
        }
        .inputField {
          width: 100%;
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          background: #f0f0f0;
          color: #111;
        }
        .heading { font-weight: bold; color: #6aa5ff; margin-bottom: 0.3rem; }
        /* Mobile button layout fix */
@media (max-width: 768px) {
  .bottomButtons {
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.75rem !important;
    position: relative !important; /* allow normal scroll flow */
    margin-top: 1.5rem !important;
  }

  .bottomButtons button,
  .bottomButtons a {
    width: 80% !important;
    font-size: 1rem !important;
    padding: 0.9rem 1rem !important;
    text-align: center !important;
    border-radius: 10px !important;
  }
}
 
}

      `}</style>

      {/* Common Page Heading */}
<div
  style={{
    position: "sticky",
    top: "50px", // 👈 adjust this based on your navbar height
    zIndex: 50,
    background: "linear-gradient(90deg, #1e3c72, #2a5298)",
    color: "#ffffff",
    textAlign: "center",
    padding: "1.2rem 0",
    fontSize: "2rem",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  }}
>
  Create Question Paper
  <div
    style={{
      fontSize: "0.9rem",
      opacity: 0.8,
      marginTop: "0.3rem",
      fontWeight: "normal",
    }}
  >
    Fill exam details and add questions below
  </div>
</div>


      <div className="mainLayout">
        {/* LEFT SIDE */}
        <div className="leftPane">
          <h3 style={{ marginBottom: "1rem", color: "#fff" }}>Exam Details</h3>
          <label className="heading">Exam Title:</label>
          <input className="inputField" value={title} onChange={e => setTitle(e.target.value)} placeholder="Exam Title" />
          <label className="heading">Class / Stream:</label>
          <input className="inputField" value={classStream} onChange={e => setClassStream(e.target.value)} placeholder="Please enter the class or the engineering stream in abbreviation" />
          <label className="heading">Total Marks:</label>
          <input className="inputField" type="number" value={totalMarks} onWheel={(e) => e.target.blur()} onChange={e => setTotalMarks(e.target.value)} placeholder="Total Marks" />
          <label className="heading">Time Limit (min):</label>
          <input className="inputField" type="number" value={timeLimit} onWheel={(e) => e.target.blur()} onChange={e => setTimeLimit(e.target.value)} placeholder="Time Limit" />
        </div>

        {/* RIGHT SIDE */}
        <div className="rightPane">
          <h3 style={{ marginBottom: "1rem", color: "#fff" }}>Questions</h3>
          {questions.length === 0 ? (
            <p style={{ color: "gray", textAlign: "center", marginTop: "2rem" }}>No questions added yet.</p>
          ) : (
            questions.map((q, index) => (
              <div key={index} style={{
                background: "#f8fafc",
                color: "#111",
                padding: "1.2rem",
                borderRadius: "10px",
                marginBottom: "1.5rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
              }}>
                <label className="heading">Question:</label>
                <input
                  type="text"
                  className="inputField"
                  value={q.question}
                  placeholder="Enter Question"
                  onChange={e => updateQuestion(index, "question", e.target.value)}
                />

                {q.type === "mcq" ? (
                  <>
                    <label className="heading">Options:</label>
                    {q.options.map((opt, i) => (
                      <input key={i}
                        type="text"
                        className="inputField"
                        value={opt}
                        placeholder={`Option ${i + 1}`}
                        onChange={e => {
                          const opts = [...q.options];
                          opts[i] = e.target.value;
                          updateQuestion(index, "options", opts);
                        }}
                      />
                    ))}
                    <label className="heading">Correct Answer:</label>
                    <input
                      type="text"
                      className="inputField"
                      value={q.answer}
                      placeholder="Correct Answer"
                      onChange={e => updateQuestion(index, "answer", e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <label className="heading">Answer:</label>
                    <textarea
                      className="inputField"
                      style={{ minHeight: "80px" }}
                      value={q.answer}
                      placeholder="Type the answer here"
                      onChange={e => updateQuestion(index, "answer", e.target.value)}
                    />
                  </>
                )}

                <label className="heading">Marks:</label>
                <input
                  type="number"
                  className="inputField"
                  value={q.marks}
                  placeholder="Marks for this question"
                  onWheel={(e) => e.target.blur()}
                  onChange={e => updateQuestion(index, "marks", e.target.value)}
                />

                <button
                  onClick={() => deleteQuestion(index)}
                  style={{
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.5rem 1rem",
                    cursor: "pointer"
                  }}
                >
                  Delete Question
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="actionBar" >
        <div className="bottomButtons" style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={addQuestion}
          style={{
            padding: '0.6rem 1.3rem',
            borderRadius: '8px',
            border: '2px solid #2a5298',
            backgroundColor: 'transparent',
            color: '#6aa5ff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Add Question</button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '0.6rem 1.3rem',
            borderRadius: '8px',
            backgroundColor: '#2a5298',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}>{loading ? "Submitting..." : "Publish"}</button>
          <button onClick = {()=>router.push('/ai-paper')}
          style={{
            padding: '0.6rem 1.3rem',
            borderRadius: '8px',
            border: '2px solid #2a5298',
            backgroundColor: 'yellow',
            color: '#2a5298',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Generate with AI <i className='fas fa-robot'></i></button>
      </div>
      </div>

      {/* Type Selection Modal */}
      {showTypeModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}>
          <div style={{
            background: "white",
            color: "#111",
            padding: "2rem",
            borderRadius: "10px",
            textAlign: "center"
          }}>
            <h3>Choose Question Type</h3>
            <button
              style={{ margin: "1rem", padding: "0.75rem 1.5rem", background: "#2a5298", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
              onClick={() => handleAddQuestionWithType("mcq")}>MCQ</button>
            <button
              style={{ margin: "1rem", padding: "0.75rem 1.5rem", border: "2px solid #2a5298", background: "transparent", color: "#2a5298", borderRadius: "8px", cursor: "pointer" }}
              onClick={() => handleAddQuestionWithType("descriptive")}>Descriptive</button>
            <div>
              <button onClick={() => setShowTypeModal(false)} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: "bold" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuestionPaper;
