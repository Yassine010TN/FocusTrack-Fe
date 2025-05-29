import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [quote, setQuote] = useState("Welcome to FocusTrack!");
  const [goals, setGoals] = useState([]);
  const [sharedGoals, setSharedGoals] = useState([]);
  const [goalSteps, setGoalSteps] = useState({});
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
      "https://stoic.tekloon.net/stoic-quote"
    )}&timestamp=${new Date().getTime()}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const parsed = JSON.parse(data.contents);
        setQuote(`${parsed.data.quote} — ${parsed.data.author}`);
      })
      .catch(() => setQuote("Stay strong. Be present."));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    const goalsUrl = showOpenOnly
      ? "http://localhost:8080/api/goals/?filter=true"
      : "http://localhost:8080/api/goals/";

    fetch(goalsUrl, { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch goals")))
      .then(setGoals)
      .catch(() => setGoals([]));

    fetch("http://localhost:8080/api/sharing/my-shared-goals", { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch shared goals")))
      .then(setSharedGoals)
      .catch(() => setSharedGoals([]));
  }, [showOpenOnly]);

  const handleGoalClick = (goalId, isShared) => {
    navigate(isShared ? `/shared-goals/${goalId}` : `/goals/${goalId}`);
  };

  const toggleSteps = (goalId, isShared) => {
    goalSteps[goalId]
      ? setGoalSteps((prev) => ({ ...prev, [goalId]: null }))
      : fetchSteps(goalId, isShared);
  };

  const fetchSteps = (goalId, isShared) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    if (isShared) {
      const sharedGoal = sharedGoals.find((sg) => sg.goal.id === goalId);
      if (!sharedGoal) return setGoalSteps((prev) => ({ ...prev, [goalId]: [] }));
      const contactId = sharedGoal.ownerID;

      fetch(`http://localhost:8080/api/sharing/shared-goals/${goalId}/steps?contactId=${contactId}`, { headers })
        .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch steps")))
        .then((data) => setGoalSteps((prev) => ({ ...prev, [goalId]: data })))
        .catch(() => setGoalSteps((prev) => ({ ...prev, [goalId]: [] })));
    } else {
      fetch(`http://localhost:8080/api/goals/${goalId}/steps`, { headers })
        .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch steps")))
        .then((data) => setGoalSteps((prev) => ({ ...prev, [goalId]: data })))
        .catch(() => setGoalSteps((prev) => ({ ...prev, [goalId]: [] })));
    }
  };

  const handleStepClick = (parentId, stepId, isShared) => {
    navigate(isShared ? `/shared-goals/${stepId}` : `/goals/${stepId}`);
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#eaf4fb" }}>
      {/* Quote */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">🌞 Quote of the Day</h2>
        <p className="text-lg italic text-gray-700 max-w-3xl mx-auto">{quote}</p>
      </div>

      {/* My Goals */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-900">🎯 My Goals</h2>
          <label className="text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showOpenOnly}
              onChange={() => setShowOpenOnly((prev) => !prev)}
              className="mr-2"
            />
            Show only open goals
          </label>
        </div>

        {goals.length === 0 ? (
          <p className="text-gray-500">No goals yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const priority = Math.max(0, Math.min(goal.priority || 0, 5));
              const stepsVisible = !!goalSteps[goal.id];
              return (
                <div
                  key={goal.id}
                  className="cursor-pointer bg-white border border-gray-200 p-4 rounded-xl shadow hover:shadow-lg hover:bg-blue-50 transition"
                  onClick={() => handleGoalClick(goal.id, false)}
                >
                  <h3 className="font-bold text-lg text-blue-800 mb-1">{goal.description}</h3>
                  <p className="text-sm text-gray-700">📅 {goal.startDate} → {goal.dueDate}</p>
                  <p className="text-sm text-gray-700 mt-1">📊 Progress: {goal.progress}%</p>
                  <p className="text-sm text-gray-700 mt-1">
                    🔥 Priority: {"★".repeat(priority)}{"☆".repeat(5 - priority)}
                  </p>

                  <button
                    className="text-blue-600 mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSteps(goal.id, false);
                    }}
                  >
                    {stepsVisible ? "- Hide Steps" : "+ Show Steps"}
                  </button>

                  {stepsVisible && goalSteps[goal.id] && (
                    <ul className="list-disc pl-5 mt-3 text-sm">
                      {goalSteps[goal.id].map((step) => (
                        <li
                          key={step.stepGoalId}
                          className="text-blue-600 hover:underline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStepClick(goal.id, step.stepGoalId, false);
                          }}
                        >
                          {step.description} (Progress: {step.progress}%) {step.done ? "✅" : "❌"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shared Goals */}
      <div>
        <h2 className="text-2xl font-bold text-yellow-800 mb-4">🤝 Shared With Me</h2>
        {sharedGoals.length === 0 ? (
          <p className="text-gray-500">No shared goals.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {sharedGoals.map(({ goal, ownerEmail }) => {
              const priority = Math.max(0, Math.min(goal.priority || 0, 5));
              const stepsVisible = !!goalSteps[goal.id];
              return (
                <div
                  key={goal.id}
                  className="cursor-pointer bg-white border border-gray-200 p-4 rounded-xl shadow hover:shadow-lg hover:bg-yellow-50 transition"
                  onClick={() => handleGoalClick(goal.id, true)}
                >
                  <h3 className="font-bold text-lg text-blue-800 mb-1">{goal.description}</h3>
                  <p className="text-sm text-gray-700">📅 {goal.startDate} → {goal.dueDate}</p>
                  <p className="text-sm text-gray-700 mt-1">📊 Progress: {goal.progress}%</p>
                  <p className="text-sm text-gray-700">🔥 Priority: {"★".repeat(priority)}{"☆".repeat(5 - priority)}</p>
                  <p className="text-sm text-gray-600 mt-1">👤 Shared by: <span className="font-medium">{ownerEmail}</span></p>

                  <button
                    className="text-yellow-600 mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSteps(goal.id, true);
                    }}
                  >
                    {stepsVisible ? "- Hide Steps" : "+ Show Steps"}
                  </button>

                  {stepsVisible && goalSteps[goal.id] && (
                    <ul className="list-disc pl-5 mt-3 text-sm">
                      {goalSteps[goal.id].map((step) => (
                        <li
                          key={step.stepGoalId}
                          className="text-yellow-600 hover:underline cursor-pointer"
                        >
                          {step.description} (Progress: {step.progress}%) {step.done ? "✅" : "❌"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
