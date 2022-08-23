import { Component } from 'react';
import Timer from './components/Timer';
import TimeEvent from './components/TimeEvent';
import './Pomodoro.css';

const breaktime = {
    id: "break-label",
    text: "Break Length",
    idDec: "break-decrement",
    idIncr: "break-increment",
    length: "break-length"
  };
  //HTML attribute values for session element
  const session = {
    id: "session-label",
    text: "Session Length",
    idDec: "session-decrement",
    idIncr: "session-increment",
    length: "session-length"
  };
  
  let buttonsOff = false;
  let swap = false; //keep track of the activity, false -> session true -> break
  //let running = false; //keep track of the timer state, false -> timer off true -> timer on
  let initialStart = false; //keep track of initialization of timer, update timer to set length
  let tomatoTime = null; //used to create setInterval to decrement time
  
  export default class Pomodoro extends Component {
    constructor(props) {
      super(props);
      this.state = {
        seconds: 0,
        minutes: 25,
        current: swap ? "Break" : "Session",
        breakDuration: 5,
        sessionDuration: 25
      };
      //bind functions to object to get access to state
      this.decrementBreak = this.decrementBreak.bind(this);
      this.incrementBreak = this.incrementBreak.bind(this);
      this.decrementSess = this.decrementSess.bind(this);
      this.incrementSess = this.incrementSess.bind(this);
      this.reset = this.reset.bind(this);
      this.startStop = this.startStop.bind(this);
      this.updateTimerToSess = this.updateTimerToSess.bind(this);
      this.beep = this.beep.bind(this);
      this.changeColor = this.changeColor.bind(this);
    }
  
    changeColor() {
      //function to alternate between color schemes based on current activity
      if (swap === false) {
        document.documentElement.style.setProperty(
          "--background-color",
          "#1f4690"
        );
        document.documentElement.style.setProperty(
          "--main-font-color",
          "#e8aa42"
        );
      } else {
        document.documentElement.style.setProperty(
          "--background-color",
          "#e8aa42"
        );
        document.documentElement.style.setProperty(
          "--main-font-color",
          "#1f4690"
        );
      }
    }
  
    beep(action) {
      //function to trigger beep alarm when activty changes
      let sound = document.getElementById("beep");
      if (action === "play") {
        sound.play();
        setTimeout(() => {
          sound.pause();
        }, 5000);
      } else if (action === "pause") {
        sound.pause();
        sound.currentTime = 0;
      }
    }
  
    startStop() {
      //Execute when user clicks play/pause button.
      //Only execute when timer is initially started or reset. Do not execute when user pauses/runs timer.
      //disable timer duration buttons when started
      if (initialStart === false) {
        this.setState({
          seconds: 0,
          minutes:
            swap === false
              ? this.state.sessionDuration
              : this.state.breakDuration,
          current: swap === false ? "Session" : "Break",
          breakDuration: this.state.breakDuration,
          sessionDuration: this.state.sessionDuration
        });
        initialStart = true;
      }
      //if "timer" is cleared, and create 'timer' event. Executes if/else checks every second to simulate a timer countdown.
  
      if (tomatoTime === null) {
        buttonsOff = true;
        tomatoTime = setInterval(() => {
          //when the time reaches 00:00, trigger alarm, clear 'timer', change color theme, update timer with settings for next activity and start.
          if (this.state.seconds === 0) {
            if (this.state.minutes === 0) {
              this.beep("play");
              clearInterval(tomatoTime);
              tomatoTime = null;
              initialStart = !initialStart;
              swap = !swap;
              this.changeColor();
              this.startStop();
            }
            //when timer reaches XX:00 but timer is not not, decrement minute count (ie. full minute passes)
            else {
              this.setState({
                seconds: 59,
                minutes: this.state.minutes - 1,
                current: !swap ? "Session" : "Break",
                breakDuration: this.state.breakDuration,
                sessionDuration: this.state.sessionDuration
              });
            }
          }
          //decrement seconds count by 1 while keeping other state variables the same (normal operation)
          else {
            this.setState({
              seconds: this.state.seconds - 1,
              minutes: this.state.minutes,
              current: !swap ? "Session" : "Break",
              breakDuration: this.state.breakDuration,
              sessionDuration: this.state.sessionDuration
            });
          }
        }, 1000);
      }
      //if 'timer' is already created, renable time duration buttons and clear 'timer'. (pause operation)
      else {
        buttonsOff = false;
        clearInterval(tomatoTime);
        tomatoTime = null;
      }
    }
  
    decrementBreak() {
      //decrement break duration while ensuring break is not less than 1 minute. Timer will use updated values when it is run.
      initialStart = false;
      if (buttonsOff === false) {
        if (this.state.breakDuration > 1) {
          this.setState({
            seconds: this.state.seconds,
            minutes: this.state.minutes,
            current: this.state.current,
            breakDuration: this.state.breakDuration - 1,
            sessionDuration: this.state.sessionDuration
          });
        }
      }
    }
    decrementSess() {
      //decrement session duration while ensuring session is not less than 1 minute. Timer will use updated values when it is run.
      initialStart = false;
      if (buttonsOff === false) {
        if (this.state.sessionDuration > 1) {
          this.setState(
            {
              seconds: this.state.seconds,
              minutes: this.state.minutes,
              current: this.state.current,
              breakDuration: this.state.breakDuration,
              sessionDuration: this.state.sessionDuration - 1
            },
            () => this.updateTimerToSess()
          );
        }
      }
    }
    incrementBreak() {
      //increment break duration while ensuring break is not greater than 60 minutes. Timer will use updated values when it is run.
      initialStart = false;
      if (buttonsOff === false) {
        if (this.state.breakDuration < 60) {
          this.setState({
            seconds: this.state.seconds,
            minutes: this.state.minutes,
            current: this.state.current,
            breakDuration: this.state.breakDuration + 1,
            sessionDuration: this.state.sessionDuration
          });
        }
      }
    }
    incrementSess() {
      //increment session duration while ensuring session is not greater than 60 minutes. Timer will use updated values when it is run.
      initialStart = false;
      if (buttonsOff === false) {
        if (this.state.sessionDuration < 60) {
          this.setState(
            {
              seconds: this.state.seconds,
              minutes: this.state.minutes,
              current: this.state.current,
              breakDuration: this.state.breakDuration,
              sessionDuration: this.state.sessionDuration + 1
            },
            () => this.updateTimerToSess()
          );
        }
      }
    }
  
    updateTimerToSess() {
      //function to update timer value when session duration is updated
      this.setState({
        seconds: this.state.seconds,
        minutes: this.state.sessionDuration,
        current: this.state.current,
        breakDuration: this.state.breakDuration,
        sessionDuration: this.state.sessionDuration
      });
    }
    reset() {
      //function to reset all timer settings to default state
      this.beep("pause");
      swap = false;
      buttonsOff = false;
      clearInterval(tomatoTime);
      tomatoTime = null;
      initialStart = false;
      this.setState({
        seconds: 0,
        minutes: 25,
        current: "Session",
        breakDuration: 5,
        sessionDuration: 25
      });
    }
  
    render() {
      //display timer in MM:SS format (minutes : seconds)
      let Display =
        this.state.minutes.toString().padStart(2, "0") +
        ":" +
        this.state.seconds.toString().padStart(2, "0");
  
      return (
        <div id="container">
          <div id="title">Pomodoro Timer (25+5)</div>
          <Timer
            current={this.state.current}
            time={Display}
            reset={this.reset}
            startStop={this.startStop}
          />
          <div id="timer-settings">
            <TimeEvent
              event={breaktime}
              length={this.state.breakDuration}
              decrement={this.decrementBreak}
              increment={this.incrementBreak}
              container={"break-container"}
            />
            <TimeEvent
              event={session}
              length={this.state.sessionDuration}
              decrement={this.decrementSess}
              increment={this.incrementSess}
              container={"session-container"}
            />
          </div>
          <div id="credit">
            by{" "}
            <a target="_blank" href="https://github.com/kireshanth">
              Kireshanth 👨🏿‍💻
            </a>
          </div>
        </div>
      );
    }
  }