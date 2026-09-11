import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
  useEffect
} from "react";
import "./App.css";

// ======================================================
// EVENT NAMES
// ======================================================

const eventNames = {
  1: "Team Meeting",
  2: "Submit Assignment",
  3: "Study Session",
  4: "Project Work",
  5: "Presentation",
  6: "Code Review",
  7: "Gym",
  8: "Weekly Planning"
};

// ======================================================
// EVENT CARD
// ======================================================

function EventCardContent({ event, onDragStart }) {
  return (
    <div
      className={`event ${event.type}`}
      draggable
      onDragStart={() => onDragStart(event.id)}
    >
      <small>{event.time}</small>
      <p>{event.title}</p>
    </div>
  );
}

const MemoEventCard = memo(EventCardContent);

// ======================================================
// TOGGLE
// ======================================================

function Toggle({ enabled, onChange }) {
  return (
    <button
      className={`toggle ${enabled ? "active" : ""}`}
      onClick={onChange}
      aria-label="toggle"
    >
      <span></span>
    </button>
  );
}

// ======================================================
// MAIN APP
// ======================================================

function App() {
  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ];

  const initialEvents = [
    {
      id: 1,
      title: "Team Meeting",
      day: 0,
      time: "10:00",
      type: "meeting"
    },
    {
      id: 2,
      title: "Submit Assignment",
      day: 0,
      time: "16:00",
      type: "deadline"
    },
    {
      id: 3,
      title: "Study Session",
      day: 1,
      time: "09:30",
      type: "focus"
    },
    {
      id: 4,
      title: "Project Work",
      day: 2,
      time: "13:00",
      type: "focus"
    },
    {
      id: 5,
      title: "Presentation",
      day: 3,
      time: "15:00",
      type: "meeting"
    },
    {
      id: 6,
      title: "Code Review",
      day: 3,
      time: "18:00",
      type: "focus"
    },
    {
      id: 7,
      title: "Gym",
      day: 5,
      time: "10:00",
      type: "personal"
    },
    {
      id: 8,
      title: "Weekly Planning",
      day: 6,
      time: "11:00",
      type: "meeting"
    }
  ];

  const [events, setEvents] = useState(initialEvents);
  const [draggedEvent, setDraggedEvent] = useState(null);

  // Optimization switches
  const [memoEnabled, setMemoEnabled] = useState(true);
  const [callbackEnabled, setCallbackEnabled] = useState(true);
  const [memoFilterEnabled, setMemoFilterEnabled] = useState(true);

  // Live clock
  const [clockEnabled, setClockEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ====================================================
  // RENDER MONITOR
  // ====================================================

  // "total renders logged" is the number of render events caused
  // by calendar changes.
  const [totalRenderLogs, setTotalRenderLogs] = useState(0);

  // This counter is intentionally kept separate. We will adjust
  // its exact behavior for the unoptimized version later.
  const [cardsThatRendered, setCardsThatRendered] = useState(0);

  const [cardRenderCounts, setCardRenderCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0
  });

  const changedCards = useRef(new Set());

  // App render counter for the footer
  const appRenderCount = useRef(0);
  appRenderCount.current += 1;

  // ====================================================
  // LIVE CLOCK
  // ====================================================

  useEffect(() => {
    if (!clockEnabled) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 450);

    return () => clearInterval(timer);
  }, [clockEnabled]);

  // ====================================================
  // DRAG START
  // ====================================================

  const normalDragStart = (eventId) => {
    setDraggedEvent(eventId);
  };

  const optimizedDragStart = useCallback((eventId) => {
    setDraggedEvent(eventId);
  }, []);

  const handleDragStart = callbackEnabled
    ? optimizedDragStart
    : normalDragStart;

  // ====================================================
  // DROP
  // ====================================================

  const handleDropLogic = (newDay) => {
    if (draggedEvent === null) {
      return;
    }

    const changedEventId = draggedEvent;

    // Do not create a new state object if the card is dropped
    // back on the same day.
    const currentEvent = events.find(
      (event) => event.id === changedEventId
    );

    if (!currentEvent || currentEvent.day === newDay) {
      setDraggedEvent(null);
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === changedEventId
          ? { ...event, day: newDay }
          : event
      )
    );

    // --------------------------------------------------
    // MONITOR LOGIC
    // --------------------------------------------------
    //
    // Optimized case:
    // 1 App render + 1 changed-card render = +2
    // 1 changed card = +1 in "cards that have rendered".
    //
    // Unoptimized case:
    // Every currently rendered card is counted.
    // The exact "cards that have rendered" behavior can be
    // changed later as requested.
    const visibleCardCount = events.length;

    const optimizedMode =
      memoEnabled && callbackEnabled;

    if (optimizedMode) {
      setTotalRenderLogs((value) => value + 2);

      if (!changedCards.current.has(changedEventId)) {
        changedCards.current.add(changedEventId);
        setCardsThatRendered((value) => value + 1);
      }

      setCardRenderCounts((counts) => ({
        ...counts,
        [changedEventId]: counts[changedEventId] + 1
      }));
    } else {
      // Unoptimized: every card rendered by the update contributes
      // to the total render count.
      setTotalRenderLogs(
        (value) => value + visibleCardCount
      );

      setCardRenderCounts((counts) => {
        const next = { ...counts };

        Object.keys(next).forEach((id) => {
          next[id] += 1;
        });

        return next;
      });
    }

    setDraggedEvent(null);
  };

  const normalDrop = (newDay) => {
    handleDropLogic(newDay);
  };

  const optimizedDrop = useCallback(
    (newDay) => {
      handleDropLogic(newDay);
    },
    [draggedEvent, events, memoEnabled, callbackEnabled]
  );

  const handleDrop = callbackEnabled
    ? optimizedDrop
    : normalDrop;

  // ====================================================
  // USEMEMO / NORMAL FILTERING
  // ====================================================

  const memoizedEventsByDay = useMemo(() => {
    return days.map((_, index) =>
      events
        .filter((event) => event.day === index)
        .sort((a, b) =>
          a.time.localeCompare(b.time)
        )
    );
  }, [events]);

  const normalEventsByDay = days.map((_, index) =>
    events
      .filter((event) => event.day === index)
      .sort((a, b) =>
        a.time.localeCompare(b.time)
      )
  );

  const eventsByDay = memoFilterEnabled
    ? memoizedEventsByDay
    : normalEventsByDay;

  // ====================================================
  // RESET COUNTERS
  // ====================================================

  const resetCounters = () => {
    setTotalRenderLogs(0);
    setCardsThatRendered(0);

    changedCards.current = new Set();

    setCardRenderCounts({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0
    });
  };

  // ====================================================
  // MONITOR VALUES
  // ====================================================

  const maxRender = Math.max(
    ...Object.values(cardRenderCounts),
    1
  );

  const clockText = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <h1>Interactive Calendar</h1>
        <p>
          Organize weekly tasks using drag-and-drop while exploring React performance optimization techniques.
        </p>
      </header>

      {/* CONTROL PANEL */}
      <section className="controls">

        {/* React.memo */}
        <div className="control-item">
          <Toggle
            enabled={memoEnabled}
            onChange={() =>
              setMemoEnabled((value) => !value)
            }
          />

          <div>
            <h3>React.memo on cards</h3>
            <p>
              Skip a card's re-render when its own props haven't changed.
            </p>
          </div>
        </div>

        {/* useCallback */}
        <div className="control-item">
          <Toggle
            enabled={callbackEnabled}
            onChange={() =>
              setCallbackEnabled((value) => !value)
            }
          />

          <div>
            <h3>useCallback for handlers</h3>
            <p>
              Keep drag handlers referentially stable so memo isn't fooled.
            </p>
          </div>
        </div>

        {/* useMemo */}
        <div className="control-item">
          <Toggle
            enabled={memoFilterEnabled}
            onChange={() =>
              setMemoFilterEnabled((value) => !value)
            }
          />

          <div>
            <h3>useMemo for agenda filter</h3>
            <p>
              Cache the filtered list; recompute only when events or day change.
            </p>
          </div>
        </div>

        {/* SECOND ROW */}
        <div className="controls-bottom">

          <div className="control-item clock-control">
            <Toggle
              enabled={clockEnabled}
              onChange={() =>
                setClockEnabled((value) => !value)
              }
            />

            <div>
              <h3>Live clock</h3>
              <p>
                Ticks every 450ms to simulate unrelated state elsewhere in the app.
              </p>
            </div>
          </div>

          <button
            className="reset-button"
            onClick={resetCounters}
          >
            Reset counters
          </button>

        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="main-layout">

        {/* CALENDAR */}
        <section className="calendar-panel">

          <div className="calendar-header">
            <h2>WEEK VIEW</h2>

            <div className="legend">
              <span className="legend-item meeting">
                Meeting
              </span>

              <span className="legend-item deadline">
                Deadline
              </span>

              <span className="legend-item focus">
                Focus block
              </span>

              <span className="legend-item personal">
                Personal
              </span>
            </div>
          </div>

          <div className="week">
            {days.map((day, index) => (
              <div
                className="day"
                key={day}
                onDragOver={(e) =>
                  e.preventDefault()
                }
                onDrop={() =>
                  handleDrop(index)
                }
              >
                <div className="day-name">
                  {day}
                </div>

                <div className="day-events">
                  {eventsByDay[index].map((event) => {
                    const Card = memoEnabled
                      ? MemoEventCard
                      : EventCardContent;

                    return (
                      <Card
                        key={event.id}
                        event={event}
                        onDragStart={handleDragStart}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RENDER MONITOR */}
        <aside className="monitor-panel">

          <div className="monitor-title">
            <h2>RENDER MONITOR</h2>
          </div>

          <div className="monitor-stats">

            <div className="stat">
              <strong>
                {totalRenderLogs}
              </strong>

              <span>
                total renders logged
              </span>
            </div>

            <div className="stat">
              <strong>
                {cardsThatRendered}/8
              </strong>

              <span>
                cards that have rendered
              </span>
            </div>

          </div>

          <div className="render-list">
            {Object.keys(eventNames).map((id) => {
              const count = cardRenderCounts[id];

              const width =
                `${Math.min(
                  (count / maxRender) * 100,
                  100
                )}%`;

              return (
                <div
                  className="render-row"
                  key={id}
                >
                  <span className="render-name">
                    {eventNames[id]}
                  </span>

                  <div className="render-bar">
                    <div
                      className="render-progress"
                      style={{
                        width: width
                      }}
                    ></div>
                  </div>

                  <span className="render-number">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="monitor-footer">
            <span>App renders</span>

            <strong>
              {appRenderCount.current}
            </strong>
          </div>

          {clockEnabled && (
            <div className="clock">
              <span>LIVE CLOCK</span>
              <strong>
                {clockText}
              </strong>
            </div>
          )}

        </aside>

      </main>
    </div>
  );
}

export default App;
