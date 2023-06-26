import express from 'express'
import config from 'config'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: config.get('OPENAI_KEY'),
});

const openai = new OpenAIApi(configuration);

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))

const PORT = 3000;

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
    const prompt = req.body.prompt
    const size = req.body.size ?? '512x512'
    const number = req.body.number ?? 1

    try {
        const response = await openai.createImage({
            prompt,
            size,
            n: Number(number),
        })

        console.log(response.data.data)

        res.render('index', {
            images: response.data.data,
        })
    } catch (e) {
        res.render('index', {
            error: e.message,
        })
    }
})