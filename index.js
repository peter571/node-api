import axios from "axios"
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()


async function getCoins() {
    const siteUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

    try {
        const { data: { data } } = await axios({
            method: 'GET',
            url: siteUrl,
            qs: {
                'start': '1',
                'limit': '1000',
                'convert': 'USD'
            },
            headers: {
                'X-CMC_PRO_API_KEY': `${process.env.API_KEY}`
            },
            json: true,
            gzip: true
        });

        /**Sort using the 24 hour percentage value*/
        data.sort((a, b) => {
            return parseFloat(b.quote.USD.percent_change_24h) - parseFloat(a.quote.USD.percent_change_24h)
        })

        const sortedData = data.map((el) => {
            return {
                name: el.name,
                symbol: el.symbol,
                rank: el.cmc_rank,
                price: el.quote.USD.price,
                percent_change_24h: el.quote.USD.percent_change_24h
            }
        })


        return sortedData;

    } catch (error) {
        console.log(error)
    }
}


const app = express();

app.get('/coins', async (req, res) => {
    try {
        const data = await getCoins();

        return res.status(200).json({ result: data });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.listen(7000, () => {
    console.log("Server running on http://localhost:7000")
})
