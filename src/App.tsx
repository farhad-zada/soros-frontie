import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useSorosContract } from "./hooks/useSorosContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";
import WebApp from '@twa-dev/sdk'

const showAlert = () => {
   WebApp.showAlert('Nice to meet you!');
}

const swtichTheme = () => {
  if (WebApp.colorScheme == "dark") {
    WebApp.colorScheme = "light";
  
  } else {
    WebApp.colorScheme = "dark";
  }
}

const getUserData = async () => {
  try {
    const userData = WebApp.initData;
    console.log(userData);
    return userData;
  } catch (error) {
    console.error(error);
  }}

function App() {
  const {
    contract_address,
    counter_value,
    // recent_sender,
    // owner_address,
    contract_balance,
    sendIncrement,
    sendDepost,
    withdraw,
    } = useSorosContract();
  const { connected } = useTonConnect()
  return (
    <div>
      <div>{WebApp.platform}</div>
      {
         <a
         onClick={() => {
            swtichTheme();
         }}
       >
         Switch Theme
       </a>
    }
    <br />
      {
         <a
         onClick={() => {
           showAlert();
         }}
       >
         Trigger Alert
       </a>
      }
      <div className="contract_addrs">
        <TonConnectButton/>
      </div>
      <div>
        <div className='Card'>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div>{contract_balance  && (
            <div className="Hint">
              {fromNano(contract_balance)} TON
            </div>
          )}</div>
        </div>
          <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
      <div className="increment">
      {connected && (
          <a
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment by 5
          </a>
        )}
      </div>
      <div className="deposit">
        {connected && (
          <a
            onClick={() => {
              sendDepost();
            }}
          >
            Request a depost of 0.05 TON
          </a>
        )}
      </div>

      <div className="withdraw">
        {connected && (
          <a
            onClick={() => {
              withdraw();
            }}
          >
            Request withdraw of all funds
          </a>
        )}
      </div>
      {/* Show user data */}
      <div className="userData">
        <a
          onClick={() => {
            getUserData();
          }}
        >
          Get User Data
        </a>
      </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;