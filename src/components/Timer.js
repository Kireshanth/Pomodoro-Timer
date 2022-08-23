import { FaPlay, FaPause } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import '../Pomodoro.css';

const Timer = (props) => {
    return (
      <div id="timer-container">
        <p id="timer-label">{props.current}</p>
        <div id="time-left">{props.time}</div>
        <div id="timer-buttons">
          <button id="start_stop" onClick={props.startStop}>
            <FaPlay className="play"/>
            <FaPause id="pause"/>
          </button>
          <button id="reset" onClick={props.reset}>
            <FontAwesomeIcon id="rotate" icon={faRotateRight} />
          </button>
        </div>
        <audio
          loop
          id="beep"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        ></audio>
      </div>
    );
  };

  export default Timer;