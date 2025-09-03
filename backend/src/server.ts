import 'dotenv/config'
import app from "./app";

const PORT:string | number = process.env.PORT! || 7000

app.listen(PORT , () => {
    console.log(`Server is running http://localhost:${PORT}`);
})

