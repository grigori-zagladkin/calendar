import "./App.css";
import Calendar from "./components/calendar";
import PopupLayer from "./components/PopupLayer";

function App() {
  return (
    <div>
      <PopupLayer>
        <div className="w-full h-screen flex justify-center">
          <Calendar />
        </div>
      </PopupLayer>
    </div>
  );
}

export default App;
