import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const TimeEvent = (props) => {
    return (
      <div id={props.container}>
        <p id={props.event.id}>{props.event.text}</p>
        <div id="center-timer-settings">
          <button id={props.event.idDec} onClick={props.decrement}>
            <FaArrowDown size ={28}/>
          </button>
          <input id={props.event.length} value={props.length} disabled />
          <button id={props.event.idIncr} onClick={props.increment}>
          <FaArrowUp size ={28}/>
          </button>
        </div>
      </div>
    );
};

export default TimeEvent;