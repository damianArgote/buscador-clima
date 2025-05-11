import axios from "axios"
import type { SearchType } from "../types";
import { z } from "zod";
//import * as v from 'valibot';
import { useMemo, useState } from "react";
//import { Weather } from '../types/index';

//types guards
/* function isWeatherResponse(weather: unknown): weather is Weather{
    return (
        Boolean(weather) &&
        typeof weather === 'object' && 
        typeof (weather as Weather).name === 'string' &&
        typeof (weather as Weather).main.temp ===  'number' &&
        typeof (weather as Weather).main.temp_max ===  'number' &&
        typeof (weather as Weather).main.temp_min ===  'number'
    )
} */

//zod
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
})

export type Weather = z.infer<typeof Weather>

//Valibot
/* const WeatherSchema = v.object({
    name: v.string(),
    main: v.object({
        temp: v.number(),
        temp_max: v.number(),
        temp_min: v.number()
    })
})

type WeatherValibot = v.InferOutput<typeof WeatherSchema>; */

const initialState = {
        name:'',
        main:{
            temp:0,
            temp_max:0,
            temp_min:0
        }
    }


export default function useWeather(){

    const [weather,setWeather] = useState<Weather>(initialState)

    const [loading,setLoading] = useState(false);

    const [notFound,setNotFound]= useState(false);

    const fetchWeather = async (search: SearchType) => {
        const appId=import.meta.env.VITE_API_KEY;
        setLoading(true)
        setWeather(initialState)
        try {

            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`
            
            const {data} = await axios(geoUrl)

            if(!data[0]){
                setNotFound(true)
                return
            }
            setNotFound(false)
            const lat = data[0].lat;
            const lon = data[0].lon;

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

            const {data: weatherResult} = await axios(weatherUrl)
            //const result = isWeatherResponse(weatherResult)

            const result = Weather.safeParse(weatherResult)

            //const result = v.parse(WeatherSchema,weatherResult)

            if(result.success){
                setWeather(result.data)
            }
            
            

        } catch (error) {
            console.log(error);
            
        } finally {
            setLoading(false)
        }
    }

    const hasWeatherData = useMemo(() => weather.name ,[weather])


    return {
        weather,
        loading,
        notFound,
        hasWeatherData,
        fetchWeather
    }
}