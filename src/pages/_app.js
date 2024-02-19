import "bootstrap/dist/css/bootstrap.css"
import "@/styles/style.css"

import React, { useState, useEffect, useRef } from "react"
import Axios from "@/lib/axios"

import TopNav from "@/components/layouts/TopNav"
import Messages from "@/components/core/Messages"

const App = ({ Component, pageProps }) => {
	// Function for checking local storage
	const getLocalStorage = (state) => {
		if (typeof window !== "undefined" && localStorage.getItem(state)) {
			return JSON.parse(localStorage.getItem(state))
		} else {
			return []
		}
	}

	// Function for checking local storage
	const getLocalStorageAuth = (state) => {
		if (typeof window !== "undefined" && localStorage.getItem(state)) {
			return JSON.parse(localStorage.getItem(state))
		} else {
			return {
				name: "Guest",
				username: "@guest",
				avatar: "/storage/avatars/male-avatar.png",
				accountType: "normal",
				decos: 0,
				posts: 0,
				fans: 0,
			}
		}
	}

	// Function to set local storage
	const setLocalStorage = (state, data) => {
		localStorage.setItem(state, JSON.stringify(data))
	}

	const url = process.env.NEXT_PUBLIC_BACKEND_URL

	const apiUrl = "https://rickandmortyapi.com/api"

	// Declare states
	const [messages, setMessages] = useState([])
	const [errors, setErrors] = useState([])
	const [login, setLogin] = useState()
	const [auth, setAuth] = useState(getLocalStorageAuth("auth"))
	const [locations, setLocations] = useState([])
	const [characters, setCharacters] = useState([])

	// Function for fetching data from API
	const get = (endpoint, setState, storage = null, errors = true) => {
		Axios.get(`/api/${endpoint}`)
			.then((res) => {
				var data = res.data ? res.data.data : []
				setState(data)
				storage && setLocalStorage(storage, data)
			})
			.catch(() => errors && setErrors([`Failed to fetch ${endpoint}`]))
	}

	// Function for fetching data from API
	const getPaginated = (endpoint, setState, storage = null, errors = true) => {
		Axios.get(`/api/${endpoint}`)
			.then((res) => {
				var data = res.data ? res.data : []
				setState(data)
				storage && setLocalStorage(storage, data)
			})
			.catch(() => errors && setErrors([`Failed to fetch ${endpoint}`]))
	}

	// Function for showing iteration
	const iterator = (key, list) => {
		return key + 1 + list.meta.per_page * (list.meta.current_page - 1)
	}

	// Function for getting errors from responses
	const getErrors = (err, message = false) => {
		const resErrors = err.response.data.errors
		var newError = []
		for (var resError in resErrors) {
			newError.push(resErrors[resError])
		}
		// Get other errors
		message && newError.push(err.response.data.message)
		setErrors(newError)
	}

	// Fetch data on page load
	useEffect(() => {
		// Import Js for Bootstrap
		import("bootstrap/dist/js/bootstrap")

		get("auth", setAuth, "auth", false)
	}, [])

	const GLOBAL_STATE = {
		getLocalStorage,
		setLocalStorage,
		url,
		messages,
		setMessages,
		errors,
		setErrors,
		get,
		getPaginated,
		iterator,
		getErrors,
		login,
		setLogin,
		auth,
		setAuth,
		apiUrl,
		locations,
		setLocations,
		characters,
		setCharacters
	}

	return (
		<div>
			<TopNav {...GLOBAL_STATE} />
			<Component {...pageProps} {...GLOBAL_STATE} />
			<Messages {...GLOBAL_STATE} />
		</div>
	)
}

export default App
