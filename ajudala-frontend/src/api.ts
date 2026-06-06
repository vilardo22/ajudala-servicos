// src/api.ts
import axios from 'axios';

export const api = axios.create({
  // SUBSTITUA a porta abaixo pela porta que o seu 'dotnet run' mostrou no terminal!
  baseURL: 'http://localhost:5024/api', 
});