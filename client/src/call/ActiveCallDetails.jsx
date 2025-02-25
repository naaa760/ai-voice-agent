import AssistantSpeechIndicator from "./AssistantSpeechIndicator";
import VolumeLevel from "./VolumeLevel";
import PropTypes from "prop-types";

const ActiveCallDetails = ({
  assistantIsSpeaking,
  volumeLevel,
  endCallCallback,
}) => {
  return (
    <div className="active-call-detail">
      <div className="call-info">
        <AssistantSpeechIndicator isSpeaking={assistantIsSpeaking} />
        <VolumeLevel volume={volumeLevel} />
      </div>
      <div className="end-call-button">
        <button onClick={endCallCallback}>End Call</button>
      </div>
    </div>
  );
};

ActiveCallDetails.propTypes = {
  assistantIsSpeaking: PropTypes.bool.isRequired,
  volumeLevel: PropTypes.number.isRequired,
  endCallCallback: PropTypes.func.isRequired,
};

export default ActiveCallDetails;
