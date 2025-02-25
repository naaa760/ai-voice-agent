import PropTypes from "prop-types";

const AssistantSpeechIndicator = ({ isSpeaking }) => {
  return (
    <div className="assistant-speech-editor">
      <div
        className={`speech-indicator ${
          isSpeaking ? "speaking" : "not-speaking"
        }`}
      ></div>
      <p className="speech-status">
        {isSpeaking ? "Assistant Speaking" : "Assistant Not Speaking"}
      </p>
    </div>
  );
};

AssistantSpeechIndicator.propTypes = {
  isSpeaking: PropTypes.bool.isRequired,
};

export default AssistantSpeechIndicator;
