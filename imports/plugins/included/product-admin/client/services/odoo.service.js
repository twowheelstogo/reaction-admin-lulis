import {useState, useEffect} from 'react';

export default {
    useFetch: () =>{
        const [odooProducts, setOdooProduct] = useState([{
            value:"Select Value",
            key:"not-value"
        }]);

        const fetchProducts = async () =>{
            try{
                const res= await Axios.get(`${process.env.ODOO_HOST}/products`);
                setOdooProduct( res.data );
            }catch(err){}
        }

        useEffect(()=>{
            fetchProducts();
        },[])
        return {odooProduct};
    },

}