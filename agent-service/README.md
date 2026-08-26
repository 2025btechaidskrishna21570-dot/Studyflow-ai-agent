# StudyFlow Academic Operations Agent Service

Autonomous Academic Operations Agent Service built using the official **Google Agent Development Kit (google-adk)** and the `google-genai` Python SDK powered by **Gemini 3.7 Flash** (`gemini-3.7-flash`).

---

## 📦 Pinned Dependency Versions & Runtime

The Python agent service uses exact pinned dependencies for deterministic execution:

| Dependency | Pinned Version | Purpose |
|------------|----------------|---------|
| `google-adk` | `0.1.0` | Official Google Agent Development Kit (Agent, Runner, InMemorySessionService) |
| `google-genai` | `0.1.1` | Official Google GenAI SDK with Gemini 3.7 Flash support |
| `pydantic` | `2.8.2` | Data schema validation and model definitions |
| `fastapi` | `0.111.0` | High-performance async API service framework |
| `uvicorn` | `0.30.1` | ASGI web server implementation |
| `python-dotenv` | `1.0.1` | Environment variable configuration loader |

---

## 🤖 Gemini Model Configuration

- **Default Model**: `gemini-3.7-flash` (Gemini 3.7 Flash, fully satisfying the Gemini 3.5+ hackathon requirement).
- **Configuration**: Configurable via the `GEMINI_MODEL` environment variable (defaults automatically to `gemini-3.7-flash`).

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.7-flash
PORT=8000
```

---

## 🏗 Architecture & Official ADK Runner Execution

The agent operates strictly through the official Google ADK `Runner` and `InMemorySessionService`:

```
React Frontend (Vite + Tailwind)
       │
       ▼
Node/Express Backend (Port 3000)
       │
       ▼ (HTTP Proxy /api/agent/*)
Google ADK Agent Service (Port 8000)
       │
       ├── Agent: StudyFlowAcademicAgent (google.adk.agents.Agent)
       ├── Model: gemini-3.7-flash (Gemini 3.7 Flash)
       ├── Runner: google.adk.runners.Runner (Runner.run_async)
       ├── Session: google.adk.sessions.InMemorySessionService
       └── Tools: 15 Registered Academic Tools
```

### Key Execution Characteristics:
1. **Official ADK Runner Execution**: Events are processed via `Runner.run_async(user_id=..., session_id=..., new_message=...)`.
2. **Model-Driven Autonomous Tool Selection**: The Gemini model inspects student context (enrolled subjects, upcoming exam dates, daily capacity hours, current task density) and dynamically selects which tools to call.
3. **Structured Tool Call Traces**: Every tool call and response emitted by the ADK Runner is captured into structured `ToolCallTrace` records without exposing raw internal thoughts.
4. **Current Storage Status**: In-memory sessions (`InMemorySessionService`) and in-memory repository for local development and demonstration.
5. **Future Phases**: Persistent Cloud Firestore and Cloud Run deployment are prepared for subsequent migration phases.

---

## 🛠 15 Registered Academic Tools

1. `get_student_profile`: Retrieves daily capacity (hours/day), preferred study times, CGPA goals.
2. `get_subjects`: Enrolled courses, mastery/confidence ratings (1–5), and completed hours.
3. `get_exams`: Upcoming exam dates, weight percentages, target scores, and days remaining.
4. `get_tasks`: Lists study tasks filtered by plan, status (`pending`, `completed`, `missed`, `rescheduled`), subject, or date.
5. `get_progress`: Syllabus completion rate, hours logged, study streaks, and per-subject breakdown.
6. `detect_risk`: Computes academic risk score (0–100) based on deadline proximity and workload deficit.
7. `create_task`: Schedules a new study session with duration, difficulty, and priority.
8. `update_task`: Updates task attributes and notes.
9. `complete_task`: Records study completion and updates velocity metrics.
10. `mark_task_missed`: Flags overdue sessions for emergency risk evaluation.
11. `reschedule_task`: Autonomously reallocates tasks to safeguard upcoming exam dates.
12. `save_agent_action`: Appends structured agent decisions to the immutable audit trail.
13. `create_notification`: Emits actionable notifications to the student dashboard.
14. `analyze_syllabus`: Parses curriculum into chapters, topics, difficulty ratings, and hour estimates.
15. `create_study_plan`: Synthesizes multi-day adaptive study plan adhering to daily capacity limits.

---

## ⚙ Installation & Running

```bash
cd agent-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Health Check (`GET /health`)

```json
{
  "status": "healthy",
  "service": "StudyFlow Academic Operations Service",
  "adkConfigured": true,
  "geminiConfigured": true,
  "geminiModel": "gemini-3.7-flash",
  "toolCount": 15,
  "agentName": "StudyFlowAcademicAgent",
  "adkPackage": "google-adk"
}
```

### Test ADK Execution (`POST /api/agent/test-execution`)

Triggers a live ADK Runner execution cycle with `StudyFlowAcademicAgent`, verifying tool calling and returning trace metrics.
