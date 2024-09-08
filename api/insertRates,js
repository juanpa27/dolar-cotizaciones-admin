import { insertExchangeRates } from "../insertRates.js";

export default async function handler(req, res) {
    console.log("Handler started");  // Agrega este log para verificar si llega aquí
    await insertExchangeRates();
    console.log("Insert completed");  // Agrega este log para saber si la inserción ocurrió
    res.status(200).json({ message: "Exchange rates inserted" });
  }