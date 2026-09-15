import {
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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const INITIAL_EVENTS = [
  { id: 1, title: "Team Meeting", day: 0, time: "10:00", type: "meeting" },
  { id: 2, title: "Submit Assignment", day: 0, time: "16:00", type: "deadline" },
  { id: 3, title: "Study Session", day: 1, time: "09:30", type: "focus" },
  { id: 4, title: "Project Work", day: 2, time: "13:00", type: "focus" },
  { id: 5, title: "Presentation", day: 3, time: "15:00", type: "meeting" },
  { id: 6, title: "Code Review", day: 3, time: "18:00", type: "focus" },
  { id: 7, title: "Gym", day: 5, time: "10:00", type: "personal" },
  { id: 8, title: "Weekly Planning", day: 6, time: "11:00", type: "meeting" }
];

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
      type="button"
      className={`toggle ${enabled ? "active" : ""}`}
      onClick={onChange}
      aria-label="toggle"
      aria-pressed={enabled}
    >
      <span />
    </button>
  );
}

// ======================================================
// MAIN APP
// ======================================================

function App() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
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

  const [totalRenderLogs, setTotalRenderLogs] = useState(0);
  const [cardsThatRendered, setCardsThatRendered] = useState(0);

  const [cardRenderCounts, setCardRenderCounts] = useState({
    1: 0, 2: 0, 3: 0, 4: 0,
    5: 0, 6: 0, 7: 0, 8: 0
  });

  const changedCards = useRef(new Set());

  // Refs keep the optimized callbacks stable without using stale state.
  const eventsRef = useRef(events);
  const draggedEventRef = useRef(draggedEvent);
  const memoEnabledRef = useRef(memoEnabled);
  const callbackEnabledRef = useRef(callbackEnabled);

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    draggedEventRef.current = draggedEvent;
  }, [draggedEvent]);

  useEffect(() => {
    memoEnabledRef.current = memoEnabled;
  }, [memoEnabled]);

  useEffect(() => {
    callbackEnabledRef.current = callbackEnabled;
  }, [callbackEnabled]);

  // App render counter for the footer.
  // This is a display-only render counter; it does not participate in state.
  const appRenderCount = useRef(0);
  // eslint-disable-next-line react-hooks/refs
  appRenderCount.current += 1;

  // ====================================================
  // LIVE CLOCK
  // ====================================================

  useEffect(() => {
    if (!clockEnabled) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 450);

    return () => clearInterval(timer);
  }, [clockEnabled]);

  // ====================================================
  // DRAG START
  // ====================================================

  // Deliberately recreated when useCallback is disabled.
  const normalDragStart = (eventId) => {
    setDraggedEvent(eventId);
  };

  // Stable handler: this is what lets React.memo receive the same
  // function reference across unrelated parent renders.
  const optimizedDragStart = useCallback((eventId) => {
    setDraggedEvent(eventId);
  }, []);

  const handleDragStart = callbackEnabled
    ? optimizedDragStart
    : normalDragStart;

  // ====================================================
  // DROP LOGIC
  // ====================================================

  const performDrop = useCallback((newDay) => {
    const changedEventId = draggedEventRef.current;

    if (changedEventId === null) return;

    const currentEvents = eventsRef.current;
    const currentEvent = currentEvents.find(
      (event) => event.id === changedEventId
    );

    // Dropping an event on its existing day should do nothing.
    if (!currentEvent || currentEvent.day === newDay) {
      setDraggedEvent(null);
      return;
    }

    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === changedEventId
          ? { ...event, day: newDay }
          : event
      )
    );

    // The monitor compares the two intended rendering strategies.
    // Optimized = App + changed card.
    // Unoptimized = all 8 cards.
    const optimizedMode =
      memoEnabledRef.current && callbackEnabledRef.current;

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
  setTotalRenderLogs((value) => value + currentEvents.length);

  // In unoptimized mode, all 8 cards render.
  setCardsThatRendered(8);

  setCardRenderCounts((counts) => {
    const next = { ...counts };

    Object.keys(next).forEach((id) => {
      next[id] += 1;
    });

    return next;
  });
}

    setDraggedEvent(null);
  }, []);

  // Stable drop callback when useCallback is enabled.
  const optimizedDrop = useCallback((newDay) => {
    performDrop(newDay);
  }, [performDrop]);

  // Normal version is recreated on every App render.
  const normalDrop = (newDay) => {
    performDrop(newDay);
  };

  const handleDrop = callbackEnabled
    ? optimizedDrop
    : normalDrop;

  // ====================================================
  // USEMEMO / NORMAL FILTERING
  // ====================================================

  const memoizedEventsByDay = useMemo(() => {
    return DAYS.map((_, index) =>
      events
        .filter((event) => event.day === index)
        .sort((a, b) => a.time.localeCompare(b.time))
    );
  }, [events]);

  // This is intentionally recalculated on every App render when
  // the useMemo switch is OFF, demonstrating the difference.
  const normalEventsByDay = DAYS.map((_, index) =>
    events
      .filter((event) => event.day === index)
      .sort((a, b) => a.time.localeCompare(b.time))
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
      1: 0, 2: 0, 3: 0, 4: 0,
      5: 0, 6: 0, 7: 0, 8: 0
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

      <header className="header">
        <h1>Interactive Calendar</h1>
        <p>
          Organize weekly tasks using drag-and-drop while exploring
          React performance optimization techniques.
        </p>
      </header>

      <section className="controls">

        <div className="control-item">
          <Toggle
            enabled={memoEnabled}
            onChange={() => setMemoEnabled((value) => !value)}
          />
          <div>
            <h3>React.memo on cards</h3>
            <p>
              Skip a card's re-render when its own props haven't changed.
            </p>
          </div>
        </div>

        <div className="control-item">
          <Toggle
            enabled={callbackEnabled}
            onChange={() => setCallbackEnabled((value) => !value)}
          />
          <div>
            <h3>useCallback for handlers</h3>
            <p>
              Keep drag handlers referentially stable so memo isn't fooled.
            </p>
          </div>
        </div>

        <div className="control-item">
          <Toggle
            enabled={memoFilterEnabled}
            onChange={() => setMemoFilterEnabled((value) => !value)}
          />
          <div>
            <h3>useMemo for agenda filter</h3>
            <p>
              Cache the filtered list; recompute only when events change.
            </p>
          </div>
        </div>

        <div className="controls-bottom">
          <div className="control-item clock-control">
            <Toggle
              enabled={clockEnabled}
              onChange={() => setClockEnabled((value) => !value)}
            />
            <div>
              <h3>Live clock</h3>
              <p>
                Ticks every 450ms to simulate unrelated state elsewhere in the app.
              </p>
            </div>
          </div>

          <button className="reset-button" onClick={resetCounters}>
            Reset counters
          </button>
        </div>
      </section>

      <main className="main-layout">

        <section className="calendar-panel">
          <div className="calendar-header">
            <h2>WEEK VIEW</h2>

            <div className="legend">
              <span className="legend-item meeting">Meeting</span>
              <span className="legend-item deadline">Deadline</span>
              <span className="legend-item focus">Focus block</span>
              <span className="legend-item personal">Personal</span>
            </div>
          </div>

          <div className="week">
            {DAYS.map((day, index) => (
              <div
                className="day"
                key={day}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(index)}
              >
                <div className="day-name">{day}</div>

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

        <aside className="monitor-panel">

          <div className="monitor-title">
            <h2>RENDER MONITOR</h2>
          </div>

          <div className="monitor-stats">
            <div className="stat">
              <strong>{totalRenderLogs}</strong>
              <span>total renders logged</span>
            </div>

            <div className="stat">
              <strong>{cardsThatRendered}/8</strong>
              <span>cards that have rendered</span>
            </div>
          </div>

          <div className="render-list">
            {Object.keys(eventNames).map((id) => {
              const count = cardRenderCounts[id];

              const width = `${Math.min(
                (count / maxRender) * 100,
                100
              )}%`;

              return (
                <div className="render-row" key={id}>
                  <span className="render-name">
                    {eventNames[id]}
                  </span>

                  <div className="render-bar">
                    <div
                      className="render-progress"
                      style={{ width }}
                    />
                  </div>

                  <span className="render-number">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="monitor-footer">
            <span>App renders</span>
            {/* eslint-disable-next-line react-hooks/refs */}
            <strong>{appRenderCount.current}</strong>
          </div>

          {clockEnabled && (
            <div className="clock">
              <span>LIVE CLOCK</span>
              <strong>{clockText}</strong>
            </div>
          )}

        </aside>
      </main>
    </div>
  );
}

export default App;
