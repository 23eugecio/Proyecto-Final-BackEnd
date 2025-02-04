
import mongoose from "mongoose";
import environment from "../config/environment.config.js";


mongoose.connect(environment.DB_URL)
.then(
    () => {
        console.log('Conexión exitosa con la DB')
    }
)
.catch(
    (error) => {
        console.error('Error al conectar con MongoDB', error)
    }
)


export default mongoose
