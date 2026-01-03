import express from "express";
import { exec } from "child_process";
import fs from "fs";

const app = express();
app.use(express.json());
app.use("/videos", express.static("videos"));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/download", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  const id = Date.now();
  const file = `videos/${id}.mp4`;

  exec(
    `yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "${file}" "${url}"`,
    (err) => {
      if (err) return res.status(500).json({ error: "Download failed" });

      res.json({
        download: `${req.protocol}://${req.get("host")}/${file}`
      });
    }
  );
});

app.listen(3000);
