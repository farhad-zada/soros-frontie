import { useEffect, useState } from "react";
import { Soros } from "../contracts/Soros";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useSorosContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
    contract_balance: number;
  }>();

  const { sender } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const soros = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Soros(
      Address.parse("EQAnuIOvY6W6SkdXZw1PoPM0-Bzj37DRndbrBnobQuCv7WBD") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Soros>;
  }, [client]);

  let val = null;

  useEffect(() => {
    async function getValue() {
      if (!soros) return;
      setContractData(null);
      val = await soros.getData();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
        contract_balance: (await soros.getBalance()).balance,
      });
      await sleep(5000);
      getValue();
    }
    getValue();
  }, [soros]);

  return {
    value: val,
    contract_address: soros?.address.toString(),
    sendIncrement: () => {
      return soros?.sendIncrement(sender, toNano(0.05), 5);
    },
    sendDepost: () => {
      return soros?.sendDeposit(sender, toNano(0.05));
    },
    withdraw: () => {
      return soros?.sendWithdrawRequest(
        sender,
        toNano(0.05),

        toNano(0.19758)
      );
    },
    ...contractData,
  };
}
