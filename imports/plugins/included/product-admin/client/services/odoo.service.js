import {useState, useEffect} from 'react';

export default {
    useFetch: () =>{
        const [odooProducts, setOdooProducts] = useState([
            {
                "value": "LULIS CJ",
                "key": 1485
            },
            {
                "value": "LULIS CookieCake Smore GDE",
                "key": 656
            },
            {
                "value": "Pastel ChocoGalleta",
                "key": 1364
            },
            {
                "value": "LULIS Salted Brownie",
                "key": 1044
            },
            {
                "value": "LULIS Alfa-CJ12",
                "key": 1122
            },
            {
                "value": "LULIS Spicy 250",
                "key": 1319
            },
            {
                "value": "LULIS Ranch 250",
                "key": 1385
            },
            {
                "value": "LULIS Ranch 40",
                "key": 1343
            },
            {
                "value": "LULIS Chocochip 120",
                "key": 1255
            },
            {
                "value": "LULIS Pecan 120",
                "key": 1253
            },
            {
                "value": "LULIS Sprinkles 120",
                "key": 1254
            },
            {
                "value": "LULIS Full Choco 120",
                "key": 1252
            },
            {
                "value": "LULIS Cranberry WhiteChoco 120",
                "key": 1299
            },
            {
                "value": "LULIS FIT Brownie ",
                "key": 1504
            },
            {
                "value": "LULIS Doh-B Chocochip 300",
                "key": 1339
            },
            {
                "value": "LULIS Doh-B Peanut Butter Brownie 300",
                "key": 1386
            },
            {
                "value": "LULIS Alfajor 9",
                "key": 1328
            },
            {
                "value": "LULIS Empanada Pollo",
                "key": 1356
            },
            {
                "value": "LULIS Empanada Carne",
                "key": 1357
            },
            {
                "value": "LULIS CookieCake Smore PEQ",
                "key": 1062
            },
            {
                "value": "LULIS Doh-B KeyLime 300",
                "key": 1361
            },
            {
                "value": "LULIS Nutella Brownie",
                "key": 1400
            },
            {
                "value": "LULIS Avena 120 ",
                "key": 1404
            },
            {
                "value": "LULIS CD Avena 480",
                "key": 1405
            },
            {
                "value": "LULIS CD Sprinkles 480",
                "key": 1406
            },
            {
                "value": "LULIS CD Chocochip 480",
                "key": 1407
            },
            {
                "value": "LULIS CD Cranberry White Choco (nuez) 480 ",
                "key": 1408
            },
            {
                "value": "LULIS CD Full Choco 480",
                "key": 1409
            },
            {
                "value": "LULIS Doh-B Sprinkles 300",
                "key": 1397
            },
            {
                "value": "LULIS Krispy Kreme Cookie",
                "key": 1410
            },
            {
                "value": "LULIS BOX12 Chocochip",
                "key": 1429
            },
            {
                "value": "LULIS BOX12 Pecan",
                "key": 1430
            },
            {
                "value": "LULIS BOX12 Sprinkles",
                "key": 1431
            },
            {
                "value": "LULIS BOX12 Full Choco",
                "key": 1432
            },
            {
                "value": "LULIS BOX12 Cranberry",
                "key": 1433
            },
            {
                "value": "LULIS BOX12 Avena",
                "key": 1434
            },
            {
                "value": "LULIS CD Pecan 480 ",
                "key": 1437
            },
            {
                "value": "LULIS Cajeta Smores Lotus",
                "key": 1438
            },
            {
                "value": "LULIS Choco Smores Lotus ",
                "key": 1439
            },
            {
                "value": "LULIS Empanada Spinachoke",
                "key": 1441
            },
            {
                "value": "LULIS Brookie ",
                "key": 1472
            },
            {
                "value": "LULIS Mint Brownie ",
                "key": 1475
            },
            {
                "value": "CookieCake Chocochip",
                "key": 1478
            },
            {
                "value": "CookieCake Full Choco",
                "key": 1479
            },
            {
                "value": "CookieCake Pecan",
                "key": 1480
            },
            {
                "value": "CookieCake Sprinkles",
                "key": 1481
            },
            {
                "value": "CookieCake Avena",
                "key": 1482
            },
            {
                "value": "CookieCake Cranberry",
                "key": 1484
            },
            {
                "value": "LULIS La FLACA",
                "key": 1491
            },
            {
                "value": "LULIS BOX12 LA FLACA",
                "key": 1492
            },
            {
                "value": "LULIS Heart Cookie",
                "key": 1496
            },
            {
                "value": "LULIS 2XChoco 120 ",
                "key": 1497
            },
            {
                "value": "LULIS Cheese Guava",
                "key": 1517
            },
            {
                "value": "LULIS Blueberry Limon 120",
                "key": 1525
            }
        ]);

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