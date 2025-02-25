import { useState, useEffect } from "react";
import { vapi, startAssistant, stopAssistant } from "./ai";
import ActiveCallDetails from "./call/ActiveCallDetails";

function App() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callId, setCallId] = useState("");
  const [callResult, setCallResult] = useState(null);
  const [loadingResult, setLoadingResult] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    vapi
      .on("call-start", () => {
        setLoading(false);
        setStarted(true);
      })
      .on("call-end", () => {
        setStarted(false);
        setLoading(false);
      })
      .on("speech-start", () => {
        setAssistantIsSpeaking(true);
      })
      .on("speech-end", () => {
        setAssistantIsSpeaking(false);
      })
      .on("volume-level", (level) => {
        setVolumeLevel(level);
      });
  }, []);

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleStart = async () => {
    setLoading(true);
    const data = await startAssistant(firstName, lastName, email, phoneNumber);
    setCallId(data.id);
  };

  const handleStop = () => {
    stopAssistant();
    getCallDetails();
  };

  const getCallDetails = (interval = 3000) => {
    setLoadingResult(true);
    fetch("/call-details?call_id=" + callId)
      .then((response) => response.json())
      .then((data) => {
        if (data.analysis && data.summary) {
          console.log(data);
          setCallResult(data);
          setLoadingResult(false);
        } else {
          setTimeout(() => getCallDetails(interval), interval);
        }
      })
      .catch((error) => alert(error));
  };

  const showForm = !loading && !started && !loadingResult && !callResult;
  const allFieldsFilled = firstName && lastName && email && phoneNumber;

  // Add this function to create stars
  const createStars = () => {
    const stars = [];
    for (let i = 0; i < 200; i++) {
      const style = {
        "--duration": `${Math.random() * 3 + 2}s`,
        "--delay": `${Math.random() * 2}s`,
        "--opacity": Math.random() * 0.7 + 0.3,
        "--rotate": `${Math.random() * 360}deg`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      };
      stars.push(<div key={i} className="star" style={style} />);
    }
    return stars;
  };

  return (
    <div className="app-container">
      <div className="star-field">{createStars()}</div>
      <div className="header-container">
        <nav className="nav-bar">
          <div className="logo">NEBULA</div>
          <div className="nav-links">
            <a href="#process">Process</a>
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#plans">Plans</a>
            <a href="#team">Team</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="glow-effect"></div>

        <h1 className="hero-title">Driving growth with AI.</h1>
        <p className="hero-subtitle">
          We craft workflow automations and bespoke AI solutions for
          forward-thinking companies.
        </p>

        <div className="hero-buttons">
          <button className="hero-button primary-button">Our services</button>
          <button className="hero-button secondary-button">
            Get in touch →
          </button>
        </div>
      </div>

      <div className="purple-splash" />
      <div className="glass-card">
        {showForm && (
          <>
            <h1>Contact Details</h1>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              className="input-field"
              onChange={handleInputChange(setFirstName)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              className="input-field"
              onChange={handleInputChange(setLastName)}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              className="input-field"
              onChange={handleInputChange(setEmail)}
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={phoneNumber}
              className="input-field"
              onChange={handleInputChange(setPhoneNumber)}
            />
            {!started && (
              <button
                onClick={handleStart}
                disabled={!allFieldsFilled}
                className="button"
              >
                Start Application Call
              </button>
            )}
          </>
        )}
        {loadingResult && (
          <div className="flex flex-col items-center gap-4">
            <div className="loading" />
            <p className="text-gray-400">Loading call details... please wait</p>
          </div>
        )}
        {!loadingResult && callResult && (
          <div className="call-result">
            <p className="text-lg font-medium">
              Qualified:{" "}
              <span
                className={
                  callResult.analysis.structuredData.is_qualified
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {callResult.analysis.structuredData.is_qualified.toString()}
              </span>
            </p>
            <p className="text-gray-300">{callResult.summary}</p>
          </div>
        )}
        {(loading || loadingResult) && <div className="loading"></div>}
        {started && (
          <ActiveCallDetails
            assistantIsSpeaking={assistantIsSpeaking}
            volumeLevel={volumeLevel}
            endCallCallback={handleStop}
          />
        )}
      </div>
    </div>
  );
}

export default App;
