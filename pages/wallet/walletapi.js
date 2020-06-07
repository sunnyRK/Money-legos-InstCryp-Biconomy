import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export async function addTransaction(biconomyAddress, tokenSymbol, to, value, hash) {
    try {
    
        //add transation in transaction history
        const models = {
            "transactionHash": hash,
            "from" : biconomyAddress,
            "to" : to,
            "value" : value,
            "tokenSymbol": tokenSymbol,
        }

        Axios.post('http://localhost:4000/api/create', models)
            .then(res => {
                if(res.statusText == "OK") {
                    alert("success");
                } else {
                    console.log(res);
                    alert("Error");
                }
            })
            .catch(err => {
                console.log(err);
                alert("Catch");
            })
            toast.success("Transfer Successful and transaction added to transaction history!!", {
                position: toast.POSITION.TOP_RIGHT
            });
        
    } catch (error) {
        alert("Error: addtransaction");
        console.log(error)
    }   
}