import { useState, type ChangeEvent, type FormEvent } from "react";
import { countries } from "../../data/countries";
import styles from './Form.module.css'
import type { SearchType } from "../../types";
import Alert from "../Alert/Alert";
import { getTranslationFrom } from "../../utils";
import { translations } from "./Form.trad";

type FormProps = {
    fetchWeather: (search:SearchType) => Promise<void>
}

export default function Form({fetchWeather}: FormProps) {

    const [search,setSearch] = useState<SearchType>({
        city:'',
        country:''
    })

    const [alert,setAlert] = useState('')

    const trad = getTranslationFrom(translations,'en')

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) =>{

        setSearch({
            ...search,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(Object.values(search).includes('')){
            setAlert(trad.alertMessage)
            return
        }
        setAlert('')
        fetchWeather(search)
    }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

        {alert && <Alert>{alert}</Alert>}

        <div className={styles.field}>
            <label htmlFor="city">Ciudad:</label>
            <input type="text"
                id="city"
                name="city"
                placeholder="Ciudad"
                value={search.city}
                onChange={handleChange}
            />
        </div>

        <div className={styles.field}>
            <label htmlFor="country">Pais:</label>
            <select name="country" id="country" value={search.country} onChange={handleChange}>
                <option value="">-- Seleccione un pais --</option>
                {countries.map(country => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                ))}
            </select>
        </div>

        <input className={styles.submit} type="submit" value={'Consultar Clima'} />
    </form>
  )
}
