import { client } from "/..client/";
inport { withdrawbtn } from "thirdweb/react";

const withdraw = async () => {
  return{
    <div>
    <withdrawbtn client={client} />
    </div>
  };
}

export default withdraw
