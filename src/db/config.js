
import mongoose from "mongoose";
import ENVIROMENT from "../config/enviroment.config.js";


mongoose.connect(ENVIROMENT.MONGODB_URI)
.then(
    () => 
        console.log('Conexión exitosa con la DB'))
.catch(
    (error) => console.error('Error al conectar con MongoDB', error));

export default mongoose
