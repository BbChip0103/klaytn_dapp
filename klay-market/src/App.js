import logo from "./logo.svg";
import "./App.css";
import Caver from "caver-js";

import metadata from "./metadata/metadata.json"

const COUNT_CONTRACT_ADDRESS = metadata["COUNT_CONTRACT_ADDRESS"];
const ACCESS_KEY_ID = metadata["ACCESS_KEY_ID"];
const SECRET_ACCESS_KEY = metadata["SECRET_ACCESS_KEY"];
const AUTH_KEY = metadata["AUTH_KEY"];

const COUNT_ABI = metadata["COUNT_ABI"];

const CHAIN_ID = "1001"; // BAOBAB: 1001, MAIN: 8217

const option = {
  headers: [
    {
      name: "Authorization",
      // value: AUTH_KEY
      value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
    },
    {
      name: "x-chain-id",
      value: CHAIN_ID
    }
  ]
}

const caver = new Caver(
  new Caver.providers.HttpProvider(
    "https://node-api.klaytnapi.com/v1/klaytn",
    option
  )
);
const CountContract = new caver.contract(COUNT_ABI, COUNT_CONTRACT_ADDRESS);

const readCount = async () => {
  const _count = await CountContract.methods.count().call();
  console.log(_count);
}

const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((response) => {
      const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
      console.log('Balance: ' + balance);
      return balance
    }
  )
}

const getBlockNumber = async () => {
  const blockNumber = await CountContract.methods.getBlockNumber().call();
  console.log(blockNumber);
}


const setCount = async (newCount) => {
  try{
    const privateKey = '0x7a40b314fb5dbfd42a3997cdb02057dd8aa3a2f5063e514a6c54dfd80fe0eb41'
    const deplayer = caver.wallet.keyring.createFromPrivateKey(privateKey)
    caver.wallet.add(deplayer);    

    const receipt = await CountContract.methods.setCount(newCount).send({
      from: deplayer.address,  
      gas: "0x45f2400"
    });
    console.log(receipt)
  } catch(e) {
    console.log('[ERROR_SET_COUNT] ' + e)
  }
}


function App() {
  readCount();
  getBlockNumber();

  getBalance('0xf4418948d4ac721ef5af581916E29D5fEA697f3c');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button title='Change count' onClick={()=>setCount(100)} />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
