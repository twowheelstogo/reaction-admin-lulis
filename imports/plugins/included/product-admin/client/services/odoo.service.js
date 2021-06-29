import {useState, useEffect} from 'react';

export default {
    useFetch: () =>{
        const [odooProducts, setOdooProducts] = useState([{
            value:"Sin valor",
            key:"not-value"
        }]);

        const fetchProducts = async () =>{
            try{
                const res= await Axios.get(`${process.env.ODOO_HOST}/products`);
                setOdooProducts( res.data );
            }catch(err){}
        }

        useEffect(()=>{
            fetchProducts();
        },[])
        return {odooProducts};
    },

}