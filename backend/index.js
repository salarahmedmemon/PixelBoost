const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post("/api/enhance", async (req, res) => {
    const { imageUrl } = req.body;

    try {
        // Step 1: Start Prediction
        const startResponse = await axios.post(
            'https://api.replicate.com/v1/predictions',
            {
                version: "0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
                input: { img: imageUrl }
            },
            {
                headers: {
                    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const predictionId = startResponse.data.id;
        let status = startResponse.data.status;
        let enhancedUrl = null;

        console.log("Prediction started. Polling for results...");

        // Step 2: Poll every 2 seconds until prediction is completed
        while (status !== "succeeded" && status !== "failed") {
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait for 2 seconds

            const pollResponse = await axios.get(`https://api.replicate.com/v1/predictions/${predictionId}`, {
                headers: {
                    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`
                }
            });

            status = pollResponse.data.status;
            console.log(`Current status: ${status}`);

            if (status === "succeeded") {
                enhancedUrl = pollResponse.data.output;
                break;
            }

            if (status === "failed") {
                return res.status(500).json({ error: "Image enhancement failed on Replicate." });
            }
        }

        console.log("Image enhancement completed.");
        return res.json({ enhancedImageUrl: enhancedUrl });

    } catch (error) {
        console.error('Backend Error:', error.response?.data || error.message);
        res.status(500).json({ error: "Enhancement failed", details: error.message });
    }
});

const PORT = process.env.PORT || 4851;
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
